// src/modules/log/log.controller.ts
import AppConfig from "../../AppConfig";
import { AtomService } from "../../services";
import LogService from "./log.service";
import { ILogPayload, BROWSER_NAMES, OS_NAMES } from "./types";

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
    if (chromeMatch && !ua.includes("Edg/") && !ua.includes("OPR/")) {
      return { name: BROWSER_NAMES.CHROME, version: chromeMatch[1] };
    }

    // Safari
    const safariMatch = ua.match(/Safari\/(\d+\.\d+)/);
    if (safariMatch && !ua.includes("Chrome/")) {
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
    if (ua.includes("Linux") && !ua.includes("Android")) {
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
      const deviceKeywords = [
        "Pixel",
        "Galaxy",
        "iPhone",
        "iPad",
        "MacBook",
        "ThinkPad",
        "XPS",
      ];
      for (const part of parts) {
        for (const keyword of deviceKeywords) {
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
      if (parts.length >= 3 && parts[1]?.includes("Android")) {
        return parts.slice(1, 3).join(" ") || null;
      }

      return parts[0] || null;
    }

    // Fallback based on OS
    if (ua.includes("Android")) return "Android Device";
    if (ua.includes("iPhone")) return "iPhone";
    if (ua.includes("iPad")) return "iPad";
    if (ua.includes("Macintosh")) return "Mac";
    if (ua.includes("Windows")) return "PC";
    if (ua.includes("Linux")) return "Linux PC";

    return null;
  }

  /**
   * Detect platform from user agent
   */
  private detectPlatform(userAgent: string): "web" | "ios" | "android" | null {
    const ua = userAgent.toLowerCase();
    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) {
      return "ios";
    }
    if (ua.includes("android")) {
      return "android";
    }
    if (
      ua.includes("macintosh") ||
      ua.includes("windows") ||
      ua.includes("linux")
    ) {
      return "web";
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

    const userAgent = navigator.userAgent;
    const browser = this.parseBrowser(userAgent);
    const os = this.parseOS(userAgent);
    const device = this.parseDevice(userAgent);
    const platform = this.detectPlatform(userAgent);

    const storageSnapshot = this.getStorageSnapshot();

    const payload: ILogPayload = {
      message,
      severity: "error",
      context: context || {},
      stack_trace: stack || [],
      ...storageSnapshot,
      ...options,
      platform: platform || undefined,
      environment: AppConfig.NODE_ENV || undefined,
      url: window.location.href,
      method: "GET",
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
      type: "storage_issue",
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
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) sessionKeys.push(key);
      }

      const cookies: Record<string, string> = {};
      document.cookie.split(";").forEach((cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key) cookies[key] = value || "";
      });

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
