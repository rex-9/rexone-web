// src/modules/feedback/feedback.controller.ts
import { feedbackService } from "./feedback.service";
import { ICreateFeedbackRequest, IFeedback } from "./types";
import { parsePaginatedResponse } from "../../services";

export class FeedbackController {
  private static detectBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome") && !ua.includes("Edg/")) return "Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edg/")) return "Edge";
    return "Browser";
  }

  private static detectOS(): string {
    const ua = navigator.userAgent;
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
    const feedback: ICreateFeedbackRequest = {
      content: params.content.trim(),
      rating: params.rating,
      page: window.location.pathname + window.location.search,
      browser: this.detectBrowser(),
      os: this.detectOS(),
      device: `${window.screen.width}x${window.screen.height}`,
      metadata: {
        ...params.metadata,
        pathname: window.location.pathname,
        referrer: document.referrer || null,
        language: navigator.language,
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
