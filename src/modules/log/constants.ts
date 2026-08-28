// src/modules/log/constants.ts

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
