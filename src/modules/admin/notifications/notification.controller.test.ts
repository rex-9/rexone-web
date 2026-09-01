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
    it("calls onSuccess with templates on success", async () => {
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

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await NotificationController.getTemplates(onSuccess, onError);

      expect(NotificationService.getTemplates).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(mockTemplates);
      expect(onError).not.toHaveBeenCalled();
    });

    it("calls onError on failure", async () => {
      vi.mocked(NotificationService.getTemplates).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Server Error" },
          data: null,
        },
      } as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await NotificationController.getTemplates(onSuccess, onError);

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe("createNotification", () => {
    it("calls onSuccess when notification is broadcast or queued", async () => {
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

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await NotificationController.createNotification(
        formValues,
        onSuccess,
        onError,
      );

      expect(NotificationService.createNotification).toHaveBeenCalledWith(
        formValues,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockDelivery,
        "Notification sent",
      );
      expect(onError).not.toHaveBeenCalled();
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

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await NotificationController.createNotification(
        formValues,
        onSuccess,
        onError,
      );

      expect(onSuccess).toHaveBeenCalledWith(
        mockDelivery,
        "Notification queued",
      );
    });
  });
});
