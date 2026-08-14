// src/initErrorLogging.ts

import { LogController } from "./modules/log";

/**
 * Determine if an error originates from an API call (should NOT be logged).
 */
function isApiError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    return true; // Axios error
  }
  if (error instanceof Error) {
    const stack = error.stack || "";
    return (
      stack.includes("axios") ||
      stack.includes("fetch") ||
      stack.includes("XMLHttpRequest") ||
      stack.includes("api.service") ||
      stack.includes("ApiService")
    );
  }
  return false;
}

/**
 * Initialize global error handlers – call once at app startup.
 */
export function initErrorLogging() {
  // Unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const error = event.reason;
    if (!isApiError(error)) {
      LogController.logError(error, {
        eventType: "unhandled_rejection",
      });
    }
  });

  // Runtime errors (excluding resource loading errors)
  window.addEventListener("error", (event) => {
    if (event.target && (event.target as HTMLElement).tagName === "SCRIPT") {
      return;
    }
    const error = event.error;
    if (error && !isApiError(error)) {
      LogController.logError(error, {
        eventType: "runtime_error",
        sourceFile: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
      });
    }
  });
}
