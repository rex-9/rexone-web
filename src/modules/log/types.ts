// src/modules/log/types.ts

// ===== ENUM CONSTANTS =====
export const SEVERITIES = [
  "debug",
  "info",
  "warning",
  "error",
  "critical",
] as const;
export const PLATFORMS = ["web", "ios", "android"] as const;
export const ENVIRONMENTS = ["development", "staging", "production"] as const;

// ===== PARSER CONSTANTS =====
export const BROWSER_NAMES = {
  CHROME: "Chrome",
  SAFARI: "Safari",
  FIREFOX: "Firefox",
  EDGE: "Edge",
  OPERA: "Opera",
  UNKNOWN: "Unknown",
} as const;

export const OS_NAMES = {
  ANDROID: "Android",
  IOS: "iOS",
  MACOS: "macOS",
  WINDOWS: "Windows",
  LINUX: "Linux",
  UNKNOWN: "Unknown",
} as const;

export type Severity = (typeof SEVERITIES)[number];
export type Platform = (typeof PLATFORMS)[number];
export type Environment = (typeof ENVIRONMENTS)[number];

export interface ILogPayload {
  message: string;
  severity?: Severity;
  context?: Record<string, unknown>;
  stack_trace?: string[];
  local_storage_keys?: string[];
  session_storage_keys?: string[];
  cookies?: Record<string, string>;
  platform?: Platform | null;
  environment?: Environment | null;
  app_version?: string | null;
  browser?: string | null;
  os?: string | null;
  os_version?: string | null;
  device?: string | null;
  user_agent?: string | null;
  url?: string | null;
  method?: string | null;
}

export interface ILogResponse {
  id: string;
}
