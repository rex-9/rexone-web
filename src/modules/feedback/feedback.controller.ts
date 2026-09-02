// src/modules/feedback/feedback.controller.ts
import { feedbackService } from "./feedback.service";
import { ICreateFeedbackRequest, IFeedback } from "./types";
import { parsePaginatedResponse } from "../../services/api.service";

export class FeedbackController {
  private static detectBrowser(): string {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    if (ua.includes("Chrome") && !ua.includes("Edg/")) return "Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edg/")) return "Edge";
    return "Browser";
  }

  private static detectOS(): string {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    if (ua.includes("Mac OS")) return "macOS";
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "Unknown OS";
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
  static async getAdminFeedbacks(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }) {
    const response = await feedbackService.getAdminFeedbacks(params);
    return parsePaginatedResponse<IFeedback>(response);
  }
}

export default FeedbackController;
