import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import AppConfig from "../AppConfig";
import AppRoutes from "../AppRoutes";
import { useLoading } from "../contexts/LoadingContext";
import { useEffect } from "react";
import { useAuth } from "../contexts";
import { IApiAuthResponse, IApiResponse } from "../models";

const PLATFORM_HEADER_VALUE = "web";
const SESSION_REPLACED_MESSAGE =
  "Your session was replaced by a newer sign in on this platform.";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: AppConfig.SERVER_BASE_URL,
  timeout: 10000, // Set a timeout for requests
  withCredentials: true, // Include credentials in requests
});

// Utility function to handle errors
const handleError = <T>(error: unknown): IApiResponse<T> => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error("Server Error:", error.response.data);
      return {
        data: error.response.data,
        error: error.response.data?.status?.error || "An error occurred",
      };
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.request);
      return { data: null, error: "Network error, please try again later" };
    }
  }
  // Something else happened while setting up the request
  console.error("Error:", (error as Error).message);
  return { data: null, error: "An error occurred, please try again" };
};

const apiRequest = async <T>(
  url: string,
  config: AxiosRequestConfig,
): Promise<IApiResponse<T>> => {
  try {
    const response = await axiosInstance(url, config);
    return { data: response.data };
  } catch (error: unknown) {
    return handleError(error);
  }
};

// Utility functions for each HTTP method
export const api = {
  get: async <T>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ) => {
    return apiRequest<T>(url, {
      ...config,
      method: "GET",
      params,
    });
  },
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const headers =
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };
    return apiRequest<T>(url, { ...config, method: "POST", data, headers });
  },
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const headers =
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };
    return apiRequest<T>(url, { ...config, method: "PUT", data, headers });
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    return apiRequest<T>(url, { ...config, method: "DELETE" });
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

        const serverError = error?.response?.data?.status?.error;
        const hasAuthHeader = Boolean(error?.config?.headers?.Authorization);
        const isSessionReplacedError =
          serverError === "Active session not found";

        // Handle ANY 401 with auth header (token expired OR session replaced)
        if (error?.response?.status === 401 && hasAuthHeader) {
          signout();

          if (typeof window !== "undefined") {
            const nextUrl = new URL(
              window.location.origin + AppRoutes.client.public.ROOT,
            );
            nextUrl.searchParams.set("dialog", "auth");
            nextUrl.searchParams.set("step", "initial");

            if (isSessionReplacedError) {
              nextUrl.searchParams.set(
                "session_message",
                SESSION_REPLACED_MESSAGE,
              );
            } else {
              nextUrl.searchParams.set(
                "session_message",
                "Your session has expired. Please sign in again.",
              );
            }
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
  apiFunction: () => Promise<IApiResponse<IApiAuthResponse<T>>>,
  setError: (message: string) => void,
  onSuccess: (data: IApiAuthResponse<T>) => void,
  onFailure?: () => void,
): Promise<void> => {
  try {
    const response = await apiFunction();
    const { status, data } = response.data || {};
    if (status?.success) {
      setError("");
      onSuccess({ status, data });
    } else {
      setError(status?.error ?? `An error occurred when ${operation}.`);
      onFailure?.();
    }
  } catch (error) {
    setError(`An error occurred when ${operation}. error: ${error}`);
    onFailure?.();
  }
};
