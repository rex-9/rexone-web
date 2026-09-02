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
  UNKNOWN: "Browser",
} as const;

export type TBrowserName = (typeof BROWSER_NAMES)[keyof typeof BROWSER_NAMES];

export const OS_NAMES = {
  ANDROID: "Android",
  IOS: "iOS",
  MACOS: "macOS",
  WINDOWS: "Windows",
  LINUX: "Linux",
  UNKNOWN: "Unknown OS",
} as const;

export type TOsName = (typeof OS_NAMES)[keyof typeof OS_NAMES];

export const USER_AGENT_TOKENS = {
  CHROME: "Chrome",
  SAFARI: "Safari",
  FIREFOX: "Firefox",
  EDGE: "Edg/",
  OPERA: "OPR/",
  MAC_OS: "Mac OS",
  MACINTOSH: "Macintosh",
  WINDOWS: "Windows",
  LINUX: "Linux",
  ANDROID: "Android",
  IPHONE: "iPhone",
  IPAD: "iPad",
  IOS: "OS",
} as const;

export const DEVICE_FALLBACK_NAMES = {
  ANDROID: "Android Device",
  IPHONE: "iPhone",
  IPAD: "iPad",
  MAC: "Mac",
  PC: "PC",
  LINUX_PC: "Linux PC",
  UNKNOWN: "Unknown Device",
} as const;

export const DEVICE_KEYWORDS = {
  PIXEL: "Pixel",
  GALAXY: "Galaxy",
  IPHONE: "iPhone",
  IPAD: "iPad",
  MACBOOK: "MacBook",
  THINKPAD: "ThinkPad",
  XPS: "XPS",
} as const;

export const DEVICE_KEYWORD_LIST = Object.values(DEVICE_KEYWORDS);

export const PLATFORM_UA_TOKENS = {
  IPHONE: "iphone",
  IPAD: "ipad",
  IOS: "ios",
  ANDROID: "android",
  MACINTOSH: "macintosh",
  WINDOWS: "windows",
  LINUX: "linux",
} as const;

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

export const LOG_TYPES = {
  STORAGE_ISSUE: "storage_issue",
} as const;
