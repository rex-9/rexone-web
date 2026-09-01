// src/modules/admin/feedback/feedback.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminFeedbackController from "./feedback.controller";
import AdminFeedbackService from "./feedback.service";

vi.mock("./feedback.service", () => ({
  default: {
    getFeedbacks: vi.fn(),
    getFeedback: vi.fn(),
    updateFeedback: vi.fn(),
  },
}));

describe("AdminFeedbackController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFeedbacks", () => {
    it("returns paginated feedbacks on success", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [
            {
              id: "fb_1",
              type: "feedback",
              attributes: {
                id: "fb_1",
                content: "Great app!",
                rating: 5,
                category: "general",
                priority: "low",
                status: "new",
                created_at: "2026-09-01T00:00:00Z",
                updated_at: "2026-09-01T00:00:00Z",
              },
            },
          ],
          meta: {
            pagination: {
              page: 1,
              limit: 20,
              total_count: 1,
              total_pages: 1,
            },
          },
        },
      };

      vi.mocked(AdminFeedbackService.getFeedbacks).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminFeedbackController.getFeedbacks();

      expect(result.success).toBe(true);
      expect(result.feedbacks.length).toBe(1);
      expect(result.feedbacks[0].content).toBe("Great app!");
    });
  });

  describe("updateFeedback", () => {
    it("updates feedback status successfully", async () => {
      vi.mocked(AdminFeedbackService.updateFeedback).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Updated" },
          data: {
            id: "fb_1",
            type: "feedback",
            attributes: {
              id: "fb_1",
              status: "resolved",
              admin_notes: "Fixed in v1.2",
            },
          },
        },
      } as never);

      const result = await AdminFeedbackController.updateFeedback("fb_1", {
        status: "resolved",
        admin_notes: "Fixed in v1.2",
      });

      expect(result.success).toBe(true);
      expect(result.feedback?.status).toBe("resolved");
    });
  });
});
