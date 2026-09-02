// src/modules/admin/log/constants.ts

import AppRoutes from "../../../AppRoutes";
import { ADMIN_RESOURCES, IAdminPageMeta } from "../constants";

export const ADMIN_LOG_SEVERITY = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  FATAL: "fatal",
} as const;

export type TAdminLogSeverity =
  (typeof ADMIN_LOG_SEVERITY)[keyof typeof ADMIN_LOG_SEVERITY];

export const ADMIN_LOG_RESOLUTION = {
  UNRESOLVED: "unresolved",
  RESOLVED: "resolved",
  ALL: "all",
} as const;

export type TAdminLogResolution =
  (typeof ADMIN_LOG_RESOLUTION)[keyof typeof ADMIN_LOG_RESOLUTION];

export const ADMIN_LOG_PLATFORM = {
  WEB: "web",
  ANDROID: "android",
  IOS: "ios",
} as const;

export type TAdminLogPlatform =
  (typeof ADMIN_LOG_PLATFORM)[keyof typeof ADMIN_LOG_PLATFORM];

export const ADMIN_LOG_ENVIRONMENT = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
} as const;

export type TAdminLogEnvironment =
  (typeof ADMIN_LOG_ENVIRONMENT)[keyof typeof ADMIN_LOG_ENVIRONMENT];

export const ADMIN_LOG_PAGE_TITLES = {
  LIST: "Client Telemetry & Logs",
} as const;

export const ADMIN_LOG_TABLE_HEADERS = {
  SEVERITY: "Severity",
  MESSAGE: "Error Signature",
  PLATFORM: "Platform / Env",
  COUNT: "Count",
  LAST_OCCURRED: "Last Seen",
} as const;

export const ADMIN_LOG_TABLE_KEYS = {
  SEVERITY: "severity",
  MESSAGE: "message",
  PLATFORM: "platform",
  COUNT: "count",
  LAST_OCCURRED: "last_occurred",
  ACTIONS: "actions",
} as const;

export const ADMIN_LOG_SORT_KEYS = {
  COUNT: "occurrence_count",
  CREATED_AT: "created_at",
  RESOLVED_AT: "resolved_at",
} as const;

export const ADMIN_LOG_PAGE_META: Record<string, IAdminPageMeta> = {
  [AppRoutes.client.protected.admin.LOGS]: {
    title: ADMIN_LOG_PAGE_TITLES.LIST,
    description:
      "Monitor client runtime exceptions, inspect stack traces, and manage crash reports across Web and Mobile.",
    actionResource: ADMIN_RESOURCES.CLIENTS,
  },
};
