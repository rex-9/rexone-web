import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import AppConfig from "../AppConfig";
import AppRoutes from "../AppRoutes";
import { DialogParams } from "../constants";
import { useLoading } from "../contexts/LoadingContext";
import { useEffect } from "react";
import { useAuth } from "../contexts";
import { AppLocales, getApiLocale, translate } from "../locales";
import {
  IApiEnvelope,
  IApiPagination,
  IApiResponse,
  IJsonApiResource,
} from "../models";
import { DialogAuthSteps } from "../modules/auth";

const PLATFORM_HEADER_VALUE = "web";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: AppConfig.SERVER_BASE_URL,
  timeout: 10000, // Set a timeout for requests
  withCredentials: true, // Include credentials in requests
});

const getRequestToken = (config?: AxiosRequestConfig): string | null => {
  const headers = AxiosHeaders.from(config?.headers as AxiosHeaders | undefined);
  const authorization = headers.get("Authorization");
  const value = Array.isArray(authorization)
    ? authorization[0]
    : authorization;

  return typeof value === "string" && value.startsWith("Bearer ")
    ? value.slice("Bearer ".length)
    : null;
};

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

export const getApiError = <T>(
  response: IApiResponse<IApiEnvelope<T>>,
  fallback: string,
): string =>
  response.data?.status?.error ??
  response.data?.status?.message ??
  response.error ??
  fallback;

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

        // Always send platform so backend can enforce one active session per platform.
        headers.set("X-Platform", PLATFORM_HEADER_VALUE);

        // Rexone Core currently supports English and Burmese. Unsupported
        // frontend locales (such as Spanish) intentionally fall back to English.
        headers.set("X-Locale", getApiLocale());

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

        config.headers = headers;
        setLoading(true);
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

        const requestToken = getRequestToken(error?.config);
        const isActiveRequest = !requestToken || !token || requestToken === token;

        if (error?.response?.status === 401 && token && isActiveRequest) {
          signout();

          if (typeof window !== "undefined") {
            const nextUrl = new URL(
              window.location.origin + AppRoutes.client.public.ROOT,
            );
            nextUrl.searchParams.set(DialogParams.DIALOG, DialogParams.AUTH);
            nextUrl.searchParams.set("step", DialogAuthSteps.INITIAL);

            nextUrl.searchParams.set(
              "message",
              translate(AppLocales.Auth.Shared.SessionExpired),
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
  const response = await apiFunction();
  const envelope = response.data;

  if (envelope?.status?.success) {
    setError("");
    onSuccess(envelope);
  } else {
    setError(getApiError(response, `An error occurred when ${operation}.`));

    onFailure?.();
  }
};

export const parseRecord = <T extends object>(
  record: IJsonApiResource<T> | T,
): T & { id: string } => {
  if (
    "attributes" in record &&
    "type" in record &&
    typeof record.attributes === "object" &&
    record.attributes !== null
  ) {
    return { ...record.attributes, id: record.id };
  }

  return record as T & { id: string };
};

export const parsePageList = <T extends object>(
  response: IApiResponse<IApiEnvelope<IJsonApiResource<T>[]>>,
): {
  records: (T & { id: string })[];
  pagination: IApiPagination | null;
} => {
  const envelope = response.data;

  return {
    records: Array.isArray(envelope?.data)
      ? envelope.data.map((record) => parseRecord<T>(record))
      : [],
    pagination: envelope?.meta?.pagination ?? null,
  };
};
