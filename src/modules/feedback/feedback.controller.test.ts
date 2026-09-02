import { describe, it, expect, vi, beforeEach } from "vitest";
import FeedbackController from "./feedback.controller";
import { feedbackService } from "./feedback.service";

vi.mock("./feedback.service", () => ({
  feedbackService: {
    submitFeedback: vi.fn(),
    getAdminFeedbacks: vi.fn(),
  },
}));

describe("FeedbackController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("submitFeedback", () => {
    it("submits feedback with telemetry and returns flattened item", async () => {
      vi.mocked(feedbackService.submitFeedback).mockResolvedValue({
        data: {
          status: { code: 201, success: true, message: "Feedback submitted" },
          data: {
            id: "fb-1",
            type: "feedback",
            attributes: {
              content: "Great app!",
              rating: 5,
              status: "new",
              category: "general",
              created_at: "2026-09-01T00:00:00Z",
            } as any,
          },
        },
      });

      const result = await FeedbackController.submitFeedback({
        content: "Great app!",
        rating: 5,
      });

      expect(feedbackService.submitFeedback).toHaveBeenCalledWith(
        expect.objectContaining({
          content: "Great app!",
          rating: 5,
        }),
      );
      expect(result.id).toBe("fb-1");
      expect(result.content).toBe("Great app!");
    });

    it("throws error when submission fails", async () => {
      vi.mocked(feedbackService.submitFeedback).mockResolvedValue({
        data: {
          status: { code: 422, success: false, message: "Validation error", error: "Content too short" },
          data: null as any,
        },
      });

      await expect(
        FeedbackController.submitFeedback({ content: "Hi" }),
      ).rejects.toThrow("Content too short");
    });
  });

  describe("getAdminFeedbacks", () => {
    it("fetches paginated feedbacks", async () => {
      vi.mocked(feedbackService.getAdminFeedbacks).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [
            {
              id: "fb-1",
              type: "feedback",
              attributes: {
                content: "Issue found",
                status: "new",
                created_at: "2026-09-01T00:00:00Z",
              },
            },
          ] as any,
          meta: {
            pagination: { current_page: 1, total_pages: 1, total_count: 1, limit: 10 },
          } as any,
        },
      });

      const result = await FeedbackController.getAdminFeedbacks({ page: 1, limit: 10 });
      expect(feedbackService.getAdminFeedbacks).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(result.records.length).toBe(1);
    });
  });
});
