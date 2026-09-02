import AppConfig from "../../AppConfig";
import AtomService from "../../services/atom.service";
import LogService from "./log.service";
import { ILogPayload, Platform } from "./types";
import {
  BROWSER_NAMES,
  DEVICE_FALLBACK_NAMES,
  DEVICE_KEYWORD_LIST,
  HTTP_METHODS,
  LOG_PLATFORMS,
  LOG_SEVERITIES,
  LOG_TYPES,
  OS_NAMES,
  PLATFORM_UA_TOKENS,
  USER_AGENT_TOKENS,
} from "./constants";

class LogController {
  /**
   * Parse browser name and version from user agent
   */
  private parseBrowser(
    userAgent: string,
  ): { name: string; version: string } | null {
    const ua = userAgent;

    // Chrome
    const chromeMatch = ua.match(/Chrome\/(\d+\.\d+)/);
    if (
      chromeMatch &&
      !ua.includes(USER_AGENT_TOKENS.EDGE) &&
      !ua.includes(USER_AGENT_TOKENS.OPERA)
    ) {
      return { name: BROWSER_NAMES.CHROME, version: chromeMatch[1] };
    }

    // Safari
    const safariMatch = ua.match(/Safari\/(\d+\.\d+)/);
    if (safariMatch && !ua.includes(USER_AGENT_TOKENS.CHROME)) {
      return { name: BROWSER_NAMES.SAFARI, version: safariMatch[1] };
    }

    // Firefox
    const firefoxMatch = ua.match(/Firefox\/(\d+\.\d+)/);
    if (firefoxMatch) {
      return { name: BROWSER_NAMES.FIREFOX, version: firefoxMatch[1] };
    }

    // Edge
    const edgeMatch = ua.match(/Edg\/(\d+\.\d+)/);
    if (edgeMatch) {
      return { name: BROWSER_NAMES.EDGE, version: edgeMatch[1] };
    }

    // Opera
    const operaMatch = ua.match(/OPR\/(\d+\.\d+)/);
    if (operaMatch) {
      return { name: BROWSER_NAMES.OPERA, version: operaMatch[1] };
    }

    return null; // Unknown browser → don't send
  }

  /**
   * Parse OS name and version from user agent
   */
  private parseOS(
    userAgent: string,
  ): { name: string; version: string | null } | null {
    const ua = userAgent;

    // Android
    const androidMatch = ua.match(/Android (\d+\.\d+)/);
    if (androidMatch) {
      return { name: OS_NAMES.ANDROID, version: androidMatch[1] };
    }

    // iOS / iPadOS
    const iosMatch = ua.match(/OS (\d+[._]\d+)/);
    if (iosMatch) {
      return { name: OS_NAMES.IOS, version: iosMatch[1].replace("_", ".") };
    }

    // macOS
    const macMatch = ua.match(/Mac OS X (\d+[._]\d+)/);
    if (macMatch) {
      return { name: OS_NAMES.MACOS, version: macMatch[1].replace("_", ".") };
    }

    // Windows
    const winMatch = ua.match(/Windows NT (\d+\.\d+)/);
    if (winMatch) {
      return { name: OS_NAMES.WINDOWS, version: winMatch[1] };
    }

    // Linux (desktop, not Android)
    if (
      ua.includes(USER_AGENT_TOKENS.LINUX) &&
      !ua.includes(USER_AGENT_TOKENS.ANDROID)
    ) {
      return { name: OS_NAMES.LINUX, version: null };
    }

    return null; // Unknown OS → don't send
  }

  /**
   * Parse device model from user agent
   */
  private parseDevice(userAgent: string): string | null {
    const ua = userAgent;

    // Try to extract model from parentheses
    const modelMatch = ua.match(/\(([^)]+)\)/);
    if (modelMatch) {
      const parts = modelMatch[1].split(";").map((p) => p.trim());

      // Look for specific device models
      for (const part of parts) {
        for (const keyword of DEVICE_KEYWORD_LIST) {
          if (part.includes(keyword)) {
            return part;
          }
        }
      }

      // Return the first part if it looks like a device
      if (parts.length > 0 && parts[0].includes(" ")) {
        return parts[0];
      }

      // If we have Android and model info, combine them
      if (parts.length >= 3 && parts[1]?.includes(USER_AGENT_TOKENS.ANDROID)) {
        return parts.slice(1, 3).join(" ") || null;
      }

      return parts[0] || null;
    }

    // Fallback based on OS
    if (ua.includes(USER_AGENT_TOKENS.ANDROID))
      return DEVICE_FALLBACK_NAMES.ANDROID;
    if (ua.includes(USER_AGENT_TOKENS.IPHONE))
      return DEVICE_FALLBACK_NAMES.IPHONE;
    if (ua.includes(USER_AGENT_TOKENS.IPAD)) return DEVICE_FALLBACK_NAMES.IPAD;
    if (ua.includes(USER_AGENT_TOKENS.MACINTOSH))
      return DEVICE_FALLBACK_NAMES.MAC;
    if (ua.includes(USER_AGENT_TOKENS.WINDOWS)) return DEVICE_FALLBACK_NAMES.PC;
    if (ua.includes(USER_AGENT_TOKENS.LINUX))
      return DEVICE_FALLBACK_NAMES.LINUX_PC;

    return null;
  }

  /**
   * Detect platform from user agent
   */
  private detectPlatform(userAgent: string): Platform | null {
    const ua = userAgent.toLowerCase();
    if (
      ua.includes(PLATFORM_UA_TOKENS.IPHONE) ||
      ua.includes(PLATFORM_UA_TOKENS.IPAD) ||
      ua.includes(PLATFORM_UA_TOKENS.IOS)
    ) {
      return LOG_PLATFORMS.IOS;
    }
    if (ua.includes(PLATFORM_UA_TOKENS.ANDROID)) {
      return LOG_PLATFORMS.ANDROID;
    }
    if (
      ua.includes(PLATFORM_UA_TOKENS.MACINTOSH) ||
      ua.includes(PLATFORM_UA_TOKENS.WINDOWS) ||
      ua.includes(PLATFORM_UA_TOKENS.LINUX)
    ) {
      return LOG_PLATFORMS.WEB;
    }
    return null;
  }

  /**
   * Centralized logging method – auto-captures storage snapshot.
   */
  async logError(
    error: Error | string,
    context?: Record<string, unknown>,
    options?: Partial<ILogPayload>,
  ): Promise<void> {
    console.error(
      "Client Error:",
      typeof error === "string" ? error : error.message,
    );

    const message = typeof error === "string" ? error : error.message;
    const stack = error instanceof Error ? error.stack?.split("\n") : [];

    const userAgent =
      typeof navigator !== "undefined" ? navigator.userAgent : "";
    const browser = this.parseBrowser(userAgent);
    const os = this.parseOS(userAgent);
    const device = this.parseDevice(userAgent);
    const platform = this.detectPlatform(userAgent);

    const storageSnapshot = this.getStorageSnapshot();

    const payload: ILogPayload = {
      message,
      severity: LOG_SEVERITIES.ERROR,
      context: context || {},
      stack_trace: stack || [],
      ...storageSnapshot,
      ...options,
      platform: platform || undefined,
      environment: AppConfig.NODE_ENV || undefined,
      url:
        typeof window !== "undefined"
          ? window.location.href
          : "http://localhost",
      method: HTTP_METHODS.GET,
      user_agent: userAgent,
    };

    // Only add browser if detected
    if (browser) {
      payload.browser = `${browser.name} ${browser.version}`;
    }

    // Only add OS if detected
    if (os) {
      payload.os = os.name;
      if (os.version !== null) {
        payload.os_version = os.version;
      }
    }

    // Only add device if detected
    if (device) {
      payload.device = device;
    }

    await LogService.createLog(payload);
  }

  /**
   * Log a specific storage issue.
   */
  async logStorageIssue(
    key: string,
    expected: unknown,
    actual: unknown,
    context?: Record<string, unknown>,
  ): Promise<void> {
    const error = new Error(`Storage mismatch for key: ${key}`);
    await this.logError(error, {
      storageKey: key,
      expectedValue: expected,
      actualValue: actual,
      type: LOG_TYPES.STORAGE_ISSUE,
      ...context,
    });
  }

  /**
   * Capture current storage state using AtomService.
   */
  private getStorageSnapshot() {
    try {
      const localKeys = AtomService.getKeys();

      const sessionKeys: string[] = [];
      if (typeof sessionStorage !== "undefined") {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) sessionKeys.push(key);
        }
      }

      const cookies: Record<string, string> = {};
      if (typeof document !== "undefined" && document.cookie) {
        document.cookie.split(";").forEach((cookie) => {
          const [key, value] = cookie.trim().split("=");
          if (key) cookies[key] = value || "";
        });
      }

      return {
        local_storage_keys: localKeys,
        session_storage_keys: sessionKeys,
        cookies,
      };
    } catch {
      return {
        local_storage_keys: [],
        session_storage_keys: [],
        cookies: {},
      };
    }
  }
}

export default new LogController();
