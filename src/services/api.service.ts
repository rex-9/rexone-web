import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import AppConfig from "../AppConfig";
import AppRoutes from "../AppRoutes";
import { useLoading } from "../contexts/LoadingContext";
import { useEffect } from "react";
import { useAuth } from "../contexts";
import {
  IApiEnvelope,
  IApiPagination,
  IApiResponse,
  IJsonApiResource,
  IPaginatedResult,
} from "../models";

const PLATFORM_HEADER_VALUE = "web";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: AppConfig.SERVER_BASE_URL,
  timeout: 10000, // Set a timeout for requests
  withCredentials: true, // Include credentials in requests
});

// Utility function to handle errors
const handleError = <T = unknown>(
  error: unknown,
): IApiResponse<IApiEnvelope<T>> => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error("Server Error:", error.response.data);

      return {
        data: error.response.data,
        error:
          error.response.data?.status?.error ||
          error.response.data?.status?.message ||
          "An error occurred",
      };
    }

    if (error.request) {
      console.error("Network Error:", error.request);

      return {
        data: null,
        error: "Network error, please try again later",
      };
    }
  }

  console.error("Error:", (error as Error).message);

  return {
    data: null,
    error: "An error occurred, please try again",
  };
};

const apiRequest = async <T>(
  url: string,
  config: AxiosRequestConfig,
): Promise<IApiResponse<IApiEnvelope<T>>> => {
  try {
    const response = await axiosInstance(url, config);

    return {
      data: response.data,
    };
  } catch (error: unknown) {
    return handleError(error);
  }
};

const shouldSkipLoading = (config: AxiosRequestConfig): boolean =>
  config.headers instanceof AxiosHeaders
    ? config.headers.get("X-Skip-Loading") === "true"
    : config.headers?.["X-Skip-Loading" as keyof typeof config.headers] ===
      "true";

// Utility functions for each HTTP method
export const api = {
  get: async <T>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<IApiResponse<IApiEnvelope<T>>> => {
    return apiRequest<T>(url, {
      ...config,
      method: "GET",
      params,
    });
  },

  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<IApiResponse<IApiEnvelope<T>>> => {
    return apiRequest<T>(url, {
      ...config,
      method: "POST",
      data,
    });
  },

  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<IApiResponse<IApiEnvelope<T>>> => {
    return apiRequest<T>(url, {
      ...config,
      method: "PUT",
      data,
    });
  },

  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<IApiResponse<IApiEnvelope<T>>> => {
    return apiRequest<T>(url, {
      ...config,
      method: "PATCH",
      data,
    });
  },

  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<IApiResponse<IApiEnvelope<T>>> => {
    return apiRequest<T>(url, {
      ...config,
      method: "DELETE",
    });
  },
};

// Custom hook to set up axios interceptor
export const useAxiosInterceptor = () => {
  const { setLoading } = useLoading();
  const { token, signout } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const headers = AxiosHeaders.from(config.headers);
        const skipLoading = shouldSkipLoading(config);

        // Always send platform so backend can enforce one active session per platform.
        headers.set("X-Platform", PLATFORM_HEADER_VALUE);

        // Check if data is FormData - let axios set Content-Type automatically
        if (config.data instanceof FormData) {
          // Don't set Content-Type - axios will set it with boundary
          // Remove any existing Content-Type to let axios handle it
          headers.delete("Content-Type");
          headers.set("Content-Type", "multipart/form-data");
        } else if (config.data && typeof config.data === "object") {
          // For JSON data, set Content-Type
          headers.set("Content-Type", "application/json");
        }

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        if (skipLoading) {
          headers.delete("X-Skip-Loading");
        }

        config.headers = headers;
        if (!skipLoading) {
          setLoading(true);
        }
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      },
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      (error) => {
        console.log("interceptor response error ===>", error);

        // Handle authenticated 401s only. Public auth failures should stay in
        // their dialog and show the endpoint error.
        if (error?.response?.status === 401 && token) {
          signout();

          if (typeof window !== "undefined") {
            const nextUrl = new URL(
              window.location.origin + AppRoutes.client.public.ROOT,
            );
            nextUrl.searchParams.set(
              AppRoutes.dialog.param,
              AppRoutes.dialog.auth,
            );
            nextUrl.searchParams.set("step", AppRoutes.dialog.steps.initial);

            nextUrl.searchParams.set(
              "message",
              "Your session has expired. Please sign in again.",
            );
            window.location.assign(nextUrl.toString());
          }
        }

        setLoading(false);
        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [setLoading, token, signout]);
};

export const apiHandler = async <T>(
  operation: string,
  apiFunction: () => Promise<IApiResponse<IApiEnvelope<T>>>,
  setError: (message: string) => void,
  onSuccess: (response: IApiEnvelope<T>) => void,
  onFailure?: () => void,
): Promise<void> => {
  try {
    const response = await apiFunction();
    const envelope = response.data;

    if (envelope?.status?.success) {
      setError("");
      onSuccess(envelope);
    } else {
      setError(
        envelope?.status?.error ??
          envelope?.status?.message ??
          `An error occurred when ${operation}.`,
      );

      onFailure?.();
    }
  } catch (error) {
    setError(`An error occurred when ${operation}. error: ${error}`);

    onFailure?.();
  }
};

// Helper to extract attributes from JSONAPI response
export const parseFromList = <T>(
  items: IJsonApiResource<T>[] | null | undefined,
): (T & { id: string })[] => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    ...item.attributes,
    id: item.id,
  }));
};

export const parsePaginatedResponse = <T>(
  response: IApiResponse<IApiEnvelope<T[]>>,
): IPaginatedResult<T> => {
  const envelope = response.data;

  return {
    records: envelope?.data ?? [],
    pagination: envelope?.meta?.pagination ?? null,
  };
};

export const parsePaginatedJsonApiResponse = <T>(
  response: IApiResponse<IApiEnvelope<IJsonApiResource<T>[]>>,
): {
  records: (T & { id: string })[];
  pagination: IApiPagination | null;
} => {
  const envelope = response.data;

  return {
    records: parseFromList(envelope?.data),
    pagination: envelope?.meta?.pagination ?? null,
  };
};
