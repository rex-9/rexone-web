// src/modules/log/constants.ts

// ===== ENUM CONSTANTS =====
export const LOG_SEVERITIES = {
  DEBUG: "debug",
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  CRITICAL: "critical",
} as const;

export const SEVERITIES = Object.values(LOG_SEVERITIES);

export const LOG_PLATFORMS = {
  WEB: "web",
  IOS: "ios",
  ANDROID: "android",
} as const;

export const PLATFORMS = Object.values(LOG_PLATFORMS);

export const LOG_ENVIRONMENTS = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
} as const;

export const ENVIRONMENTS = Object.values(LOG_ENVIRONMENTS);

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
