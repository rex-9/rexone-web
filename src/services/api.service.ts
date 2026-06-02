import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import AppConfig from "../AppConfig";
import AppRoutes from "../AppRoutes";
import { useLoading } from "../contexts/LoadingContext";
import { useEffect } from "react";
import { useAuth } from "../contexts";
import { IApiAuthResponse, IApiResponse } from "../models";

const PLATFORM_HEADER_VALUE = "web";
const SKIP_LOADING_HEADER = "X-Skip-Loading";
const SESSION_VERIFY_MIN_INTERVAL_MS = 10_000;
const SESSION_REPLACED_MESSAGE =
  "Your session was replaced by a newer sign in on this platform.";
let lastSessionVerifyAtMs = 0;

const shouldRunProactiveSessionCheck = (): boolean => {
  if (typeof window === "undefined") return false;

  const pathname = window.location.pathname;
  const protectedPaths = Object.values(AppRoutes.client.protected);

  return protectedPaths.some((path) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  });
};

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
    let isSessionCheckInFlight = false;

    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const headers = AxiosHeaders.from(config.headers);
        const shouldSkipLoading =
          String(headers.get(SKIP_LOADING_HEADER) ?? "") === "true";

        // Always send platform so backend can enforce one active session per platform.
        headers.set("X-Platform", PLATFORM_HEADER_VALUE);

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        if (shouldSkipLoading) {
          headers.delete(SKIP_LOADING_HEADER);
        }

        config.headers = headers;

        if (!shouldSkipLoading) {
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

        const serverError = error?.response?.data?.status?.error;
        const errorHeaders = AxiosHeaders.from(error?.config?.headers);
        const shouldSkipLoading =
          String(errorHeaders.get(SKIP_LOADING_HEADER) ?? "") === "true";
        const hasAuthHeader = Boolean(errorHeaders.get("Authorization"));
        const requestUrl = String(error?.config?.url || "");
        const isSessionValidationRequest = requestUrl.includes(
          AppRoutes.server.protected.GET_CURRENT_USER,
        );
        const isSessionReplacedError =
          serverError === "Active session not found";

        // Keep logout scoped to clear session-expiry signals only.
        if (
          error?.response?.status === 401 &&
          !!token &&
          hasAuthHeader &&
          (isSessionReplacedError || isSessionValidationRequest)
        ) {
          signout();

          if (isSessionReplacedError && typeof window !== "undefined") {
            const nextUrl = new URL(
              window.location.origin + AppRoutes.client.public.ROOT,
            );
            nextUrl.searchParams.set("dialog", "auth");
            nextUrl.searchParams.set("step", "initial");
            nextUrl.searchParams.set(
              "session_message",
              SESSION_REPLACED_MESSAGE,
            );
            window.location.assign(nextUrl.toString());
          }
        }

        if (!shouldSkipLoading) {
          setLoading(false);
        }
        return Promise.reject(error);
      },
    );

    const verifySession = async () => {
      if (!token || isSessionCheckInFlight) return;
      if (!shouldRunProactiveSessionCheck()) return;

      const now = Date.now();
      if (now - lastSessionVerifyAtMs < SESSION_VERIFY_MIN_INTERVAL_MS) {
        return;
      }

      lastSessionVerifyAtMs = now;

      isSessionCheckInFlight = true;
      try {
        await axiosInstance.get(AppRoutes.server.protected.GET_CURRENT_USER, {
          headers: {
            [SKIP_LOADING_HEADER]: "true",
          },
        });
      } catch {
        // 401 for this validation request is handled by the response interceptor.
      } finally {
        isSessionCheckInFlight = false;
      }
    };

    void verifySession();

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void verifySession();
      }
    };

    const onFocus = () => {
      void verifySession();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
