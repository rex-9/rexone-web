// src/modules/feedback/feedback.controller.ts

import { feedbackService } from "./feedback.service";
import {
  ICreateFeedbackRequest,
  IFeedback,
  IFeedbackListParams,
} from "./types";
import { parsePaginatedResponse } from "../../services/api.service";
import {
  BROWSER_NAMES,
  OS_NAMES,
  USER_AGENT_TOKENS,
  type TBrowserName,
  type TOsName,
} from "../log/constants";

export class FeedbackController {
  private static detectBrowser(): TBrowserName {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    if (
      ua.includes(USER_AGENT_TOKENS.CHROME) &&
      !ua.includes(USER_AGENT_TOKENS.EDGE)
    ) {
      return BROWSER_NAMES.CHROME;
    }
    if (
      ua.includes(USER_AGENT_TOKENS.SAFARI) &&
      !ua.includes(USER_AGENT_TOKENS.CHROME)
    ) {
      return BROWSER_NAMES.SAFARI;
    }
    if (ua.includes(USER_AGENT_TOKENS.FIREFOX)) return BROWSER_NAMES.FIREFOX;
    if (ua.includes(USER_AGENT_TOKENS.EDGE)) return BROWSER_NAMES.EDGE;
    return BROWSER_NAMES.UNKNOWN;
  }

  private static detectOS(): TOsName {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    if (ua.includes(USER_AGENT_TOKENS.MAC_OS)) return OS_NAMES.MACOS;
    if (ua.includes(USER_AGENT_TOKENS.WINDOWS)) return OS_NAMES.WINDOWS;
    if (ua.includes(USER_AGENT_TOKENS.LINUX)) return OS_NAMES.LINUX;
    if (ua.includes(USER_AGENT_TOKENS.ANDROID)) return OS_NAMES.ANDROID;
    if (
      ua.includes(USER_AGENT_TOKENS.IPHONE) ||
      ua.includes(USER_AGENT_TOKENS.IPAD)
    ) {
      return OS_NAMES.IOS;
    }
    return OS_NAMES.UNKNOWN;
  }

  /**
   * Submits feedback with automatic device, browser, and route telemetry.
   * Frictionless: does not navigate or reload page.
   */
  static async submitFeedback(params: {
    content: string;
    rating?: number;
    metadata?: Record<string, unknown>;
  }): Promise<IFeedback> {
    const page =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "";
    const device =
      typeof window !== "undefined" && window.screen
        ? `${window.screen.width}x${window.screen.height}`
        : "Unknown Device";
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";
    const referrer =
      typeof document !== "undefined" ? document.referrer || null : null;
    const language =
      typeof navigator !== "undefined" ? navigator.language : "en";

    const feedback: ICreateFeedbackRequest = {
      content: params.content.trim(),
      rating: params.rating,
      page,
      browser: this.detectBrowser(),
      os: this.detectOS(),
      device,
      metadata: {
        ...params.metadata,
        pathname,
        referrer,
        language,
      },
    };

    const response = await feedbackService.submitFeedback(feedback);
    if (!response.data?.status?.success) {
      throw new Error(
        response.data?.status?.error ||
          response.data?.status?.message ||
          "Failed to submit feedback",
      );
    }

    const item = response.data.data;
    return {
      ...item.attributes,
      id: item.id,
    };
  }

  /**
   * Admin: fetch paginated feedbacks
   */
  static async getAdminFeedbacks(params?: IFeedbackListParams) {
    const response = await feedbackService.getAdminFeedbacks(params);
    return parsePaginatedResponse<IFeedback>(response);
  }
}

export default FeedbackController;
