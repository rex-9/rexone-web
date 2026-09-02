// src/modules/admin/notifications/notification.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import NotificationController from "./notification.controller";
import NotificationService from "./notification.service";
import type { IAdminNotificationFormValues } from "./types";

vi.mock("./notification.service", () => ({
  default: {
    getTemplates: vi.fn(),
    createNotification: vi.fn(),
  },
}));

describe("NotificationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTemplates", () => {
    it("returns templates on success", async () => {
      const mockTemplates = [
        {
          id: "welcome_email",
          event: "user.welcome",
          channels: ["email"],
          category: "marketing",
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockTemplates,
        },
      };

      vi.mocked(NotificationService.getTemplates).mockResolvedValue(
        mockResponse as never,
      );

      const result = await NotificationController.getTemplates();

      expect(NotificationService.getTemplates).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.templates).toEqual(mockTemplates);
    });

    it("returns error on failure", async () => {
      vi.mocked(NotificationService.getTemplates).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Server Error" },
          data: null,
        },
      } as never);

      const result = await NotificationController.getTemplates();

      expect(result.success).toBe(false);
      expect(result.templates).toEqual([]);
      expect(result.error).toBeTruthy();
    });
  });

  describe("createNotification", () => {
    it("returns delivered info when notification is broadcast or queued", async () => {
      const formValues: IAdminNotificationFormValues = {
        event: "system.maintenance",
        audience_type: "all",
        role_ids: [],
        user_ids: [],
        send_email: true,
        send_socket: true,
        send_push: false,
      };

      const mockDelivery = {
        id: "del_1",
        audience_type: "all" as const,
        recipient_count: 100,
        channels: ["email" as const, "socket" as const],
        delivered_at: "2026-09-01T00:00:00Z",
      };

      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Notification sent" },
          data: mockDelivery,
        },
      };

      vi.mocked(NotificationService.createNotification).mockResolvedValue(
        mockResponse as never,
      );

      const result = await NotificationController.createNotification(formValues);

      expect(NotificationService.createNotification).toHaveBeenCalledWith(
        formValues,
      );
      expect(result.success).toBe(true);
      expect(result.delivered).toEqual(mockDelivery);
      expect(result.message).toBe("Notification sent");
    });

    it("handles 202 Accepted queued status", async () => {
      const formValues: IAdminNotificationFormValues = {
        event: "newsletter",
        audience_type: "all",
        role_ids: [],
        user_ids: [],
        send_email: true,
        send_socket: false,
        send_push: false,
      };

      const mockDelivery = {
        id: "del_2",
        audience_type: "all" as const,
        recipient_count: 5000,
        channels: ["email" as const],
        delivered_at: "2026-09-01T00:00:00Z",
      };

      const mockResponse = {
        data: {
          status: { code: 202, success: false, message: "Notification queued" },
          data: mockDelivery,
        },
      };

      vi.mocked(NotificationService.createNotification).mockResolvedValue(
        mockResponse as never,
      );

      const result = await NotificationController.createNotification(formValues);

      expect(result.success).toBe(true);
      expect(result.delivered).toEqual(mockDelivery);
      expect(result.message).toBe("Notification queued");
    });
  });
});
