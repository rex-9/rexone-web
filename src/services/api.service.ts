// src/services/api.service.ts
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import AppConfig from "../AppConfig";
import AppRoutes from "../AppRoutes";
import { Platform, StorageKeys } from "../constants";
import { AppLocales, getApiLocale, translate } from "../locales";
import {
  IApiEnvelope,
  IApiPagination,
  IApiResponse,
  IJsonApiResource,
} from "../models";
import { DialogAuthSteps, DialogParams } from "../modules/auth";

const PLATFORM_HEADER_VALUE = Platform.WEB;

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(StorageKeys.TOKEN);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : raw;
  } catch {
    const raw = localStorage.getItem(StorageKeys.TOKEN);
    return raw || null;
  }
};

const handleUnauthorized = () => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return;

  // Clear auth storage
  localStorage.removeItem(StorageKeys.TOKEN);
  localStorage.removeItem(StorageKeys.USER);

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
};

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: AppConfig.SERVER_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// Static Request Interceptor (Always active from millisecond 0, including on fresh page reload)
axiosInstance.interceptors.request.use(
  (config) => {
    const headers = AxiosHeaders.from(config.headers);

    // Always send platform so backend can enforce one active session per platform
    headers.set("X-Platform", PLATFORM_HEADER_VALUE);

    // Rexone Core locale
    headers.set("X-Locale", getApiLocale());

    if (config.data instanceof FormData) {
      headers.delete("Content-Type");
      headers.set("Content-Type", "multipart/form-data");
    } else if (config.data && typeof config.data === "object") {
      headers.set("Content-Type", "application/json");
    }

    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    config.headers = headers;
    return config;
  },
  (error) => Promise.reject(error),
);

// Static Response Interceptor (Handles 401 Unauthorized globally)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const token = getStoredToken();
      // If we had a stored token that the backend rejected as 401, automatically log out and redirect
      if (token) {
        handleUnauthorized();
      }
    }
    return Promise.reject(error);
  },
);

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
  response.data?.status?.error ||
  response.data?.status?.message ||
  response.error ||
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

export const parsePagyList = <T extends object>(
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

export const parsePaginatedResponse = parsePagyList;
