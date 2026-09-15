// src/modules/admin/notifications/notification.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import NotificationController from "./notification.controller";
import NotificationService from "./notification.service";
import type {
  IAdminNotificationFormValues,
  IAdminNotificationTemplateFormValues,
} from "./types";

vi.mock("./notification.service", () => ({
  default: {
    getTemplates: vi.fn(),
    getTemplate: vi.fn(),
    createTemplate: vi.fn(),
    updateTemplate: vi.fn(),
    discardTemplate: vi.fn(),
    undiscardTemplate: vi.fn(),
    createNotification: vi.fn(),
    getUserNotifications: vi.fn(),
    getUserNotification: vi.fn(),
    discardUserNotification: vi.fn(),
    undiscardUserNotification: vi.fn(),
    destroyUserNotification: vi.fn(),
    emptyUserNotificationsBin: vi.fn(),
    batchDiscardUserNotifications: vi.fn(),
    batchUndiscardUserNotifications: vi.fn(),
    batchDestroyUserNotifications: vi.fn(),
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

  describe("getTemplate", () => {
    it("returns template on success", async () => {
      const mockTemplate = {
        id: "tpl_1",
        event: "user.welcome",
        channels: ["email"],
        category: "marketing",
      };
      vi.mocked(NotificationService.getTemplate).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockTemplate,
        },
      } as never);

      const result = await NotificationController.getTemplate("tpl_1");

      expect(NotificationService.getTemplate).toHaveBeenCalledWith("tpl_1");
      expect(result.success).toBe(true);
      expect(result.template).toEqual(mockTemplate);
    });

    it("returns error on failure", async () => {
      vi.mocked(NotificationService.getTemplate).mockResolvedValue({
        data: {
          status: { code: 404, success: false, message: "Not found" },
          data: null,
        },
      } as never);

      const result = await NotificationController.getTemplate("tpl_99");

      expect(result.success).toBe(false);
      expect(result.template).toBeUndefined();
      expect(result.error).toBeTruthy();
    });
  });

  describe("createTemplate", () => {
    it("creates and returns template on success", async () => {
      const formValues: IAdminNotificationTemplateFormValues = {
        event: "account.alert",
        name: "Alert Template",
        category: "security",
        clients: ["web", "mobile"],
        admin: false,
        in_app_title: "Alert",
        in_app_body: "Security issue detected",
      };
      const mockTemplate = { id: "tpl_2", ...formValues };

      vi.mocked(NotificationService.createTemplate).mockResolvedValue({
        data: {
          status: { code: 201, success: true, message: "Created" },
          data: mockTemplate,
        },
      } as never);

      const result = await NotificationController.createTemplate(formValues);

      expect(NotificationService.createTemplate).toHaveBeenCalledWith(formValues);
      expect(result.success).toBe(true);
      expect(result.template).toEqual(mockTemplate);
    });

    it("returns error on creation failure", async () => {
      vi.mocked(NotificationService.createTemplate).mockResolvedValue({
        data: {
          status: { code: 422, success: false, message: "Validation error" },
          data: null,
        },
      } as never);

      const result = await NotificationController.createTemplate({
        event: "",
        name: "",
        category: "",
        clients: ["web", "mobile"],
        admin: false,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("updateTemplate", () => {
    it("updates and returns template on success", async () => {
      const updates = { in_app_title: "Updated Title" };
      const mockTemplate = { id: "tpl_1", event: "alert", name: "Alert", category: "security", admin: false, ...updates };

      vi.mocked(NotificationService.updateTemplate).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Updated" },
          data: mockTemplate,
        },
      } as never);

      const result = await NotificationController.updateTemplate("tpl_1", updates);

      expect(NotificationService.updateTemplate).toHaveBeenCalledWith("tpl_1", updates);
      expect(result.success).toBe(true);
      expect(result.template).toEqual(mockTemplate);
    });

    it("returns error on update failure", async () => {
      vi.mocked(NotificationService.updateTemplate).mockResolvedValue({
        data: {
          status: { code: 400, success: false, message: "Update error" },
          data: null,
        },
      } as never);

      const result = await NotificationController.updateTemplate("tpl_1", {});

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("discardTemplate", () => {
    it("returns success: true when discarded", async () => {
      vi.mocked(NotificationService.discardTemplate).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Deleted" },
          data: null,
        },
      } as never);

      const result = await NotificationController.discardTemplate("tpl_1");

      expect(NotificationService.discardTemplate).toHaveBeenCalledWith("tpl_1");
      expect(result.success).toBe(true);
    });

    it("returns error when discard fails", async () => {
      vi.mocked(NotificationService.discardTemplate).mockResolvedValue({
        data: {
          status: { code: 404, success: false, message: "Not found" },
          data: null,
        },
      } as never);

      const result = await NotificationController.discardTemplate("tpl_99");

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("undiscardTemplate", () => {
    it("returns success: true when restored", async () => {
      vi.mocked(NotificationService.undiscardTemplate).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Restored" },
          data: null,
        },
      } as never);

      const result = await NotificationController.undiscardTemplate("tpl_1");

      expect(NotificationService.undiscardTemplate).toHaveBeenCalledWith("tpl_1");
      expect(result.success).toBe(true);
    });

    it("returns error when restore fails", async () => {
      vi.mocked(NotificationService.undiscardTemplate).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Server error" },
          data: null,
        },
      } as never);

      const result = await NotificationController.undiscardTemplate("tpl_1");

      expect(result.success).toBe(false);
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

  describe("getUserNotifications", () => {
    it("returns notifications on success with array data", async () => {
      const mockList = [
        {
          id: "un_1",
          title: "Order Placed",
          message: "Your order has been placed",
          metadata: { order_id: "123" },
          read: false,
          created_at: "2026-09-01T00:00:00Z",
        },
      ];
      vi.mocked(NotificationService.getUserNotifications).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockList,
          meta: { pagination: { page: 1, total_count: 1 } },
        },
      } as never);

      const result = await NotificationController.getUserNotifications({ page: 1 });

      expect(NotificationService.getUserNotifications).toHaveBeenCalledWith({ page: 1 });
      expect(result.success).toBe(true);
      expect(result.notifications).toHaveLength(1);
      expect(result.notifications[0].id).toBe("un_1");
    });

    it("returns error on failure", async () => {
      vi.mocked(NotificationService.getUserNotifications).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Failed" },
          data: null,
        },
      } as never);

      const result = await NotificationController.getUserNotifications();

      expect(result.success).toBe(false);
      expect(result.notifications).toEqual([]);
      expect(result.error).toBeTruthy();
    });
  });

  describe("getUserNotification", () => {
    it("returns notification on success", async () => {
      const mockItem = {
        id: "un_1",
        title: "Order Placed",
        metadata: { order_id: "123" },
      };
      vi.mocked(NotificationService.getUserNotification).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockItem,
        },
      } as never);

      const result = await NotificationController.getUserNotification("un_1");

      expect(NotificationService.getUserNotification).toHaveBeenCalledWith("un_1");
      expect(result.success).toBe(true);
      expect(result.notification?.id).toBe("un_1");
    });

    it("returns error on failure", async () => {
      vi.mocked(NotificationService.getUserNotification).mockResolvedValue({
        data: {
          status: { code: 404, success: false, message: "Not found" },
          data: null,
        },
      } as never);

      const result = await NotificationController.getUserNotification("un_99");

      expect(result.success).toBe(false);
      expect(result.notification).toBeUndefined();
      expect(result.error).toBeTruthy();
    });
  });

  describe("discardUserNotification", () => {
    it("returns success on discard", async () => {
      vi.mocked(NotificationService.discardUserNotification).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Discarded" },
          data: null,
        },
      } as never);

      const result = await NotificationController.discardUserNotification("un_1");

      expect(NotificationService.discardUserNotification).toHaveBeenCalledWith("un_1");
      expect(result.success).toBe(true);
    });

    it("returns error on discard failure", async () => {
      vi.mocked(NotificationService.discardUserNotification).mockResolvedValue({
        data: {
          status: { code: 400, success: false, message: "Cannot discard" },
          data: null,
        },
      } as never);

      const result = await NotificationController.discardUserNotification("un_1");

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("undiscardUserNotification", () => {
    it("returns success on restore", async () => {
      vi.mocked(NotificationService.undiscardUserNotification).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Restored" },
          data: null,
        },
      } as never);

      const result = await NotificationController.undiscardUserNotification("un_1");

      expect(NotificationService.undiscardUserNotification).toHaveBeenCalledWith("un_1");
      expect(result.success).toBe(true);
    });

    it("returns error on restore failure", async () => {
      vi.mocked(NotificationService.undiscardUserNotification).mockResolvedValue({
        data: {
          status: { code: 400, success: false, message: "Cannot restore" },
          data: null,
        },
      } as never);

      const result = await NotificationController.undiscardUserNotification("un_1");

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("destroyUserNotification", () => {
    it("returns success on destroy", async () => {
      vi.mocked(NotificationService.destroyUserNotification).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Deleted" },
          data: null,
        },
      } as never);

      const result = await NotificationController.destroyUserNotification("un_1");

      expect(NotificationService.destroyUserNotification).toHaveBeenCalledWith("un_1");
      expect(result.success).toBe(true);
    });

    it("returns error on destroy failure", async () => {
      vi.mocked(NotificationService.destroyUserNotification).mockResolvedValue({
        data: {
          status: { code: 400, success: false, message: "Cannot delete" },
          data: null,
        },
      } as never);

      const result = await NotificationController.destroyUserNotification("un_1");

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("emptyUserNotificationsBin", () => {
    it("returns success and count on empty bin", async () => {
      vi.mocked(NotificationService.emptyUserNotificationsBin).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Emptied" },
          data: { count: 5 },
        },
      } as never);

      const result = await NotificationController.emptyUserNotificationsBin();

      expect(NotificationService.emptyUserNotificationsBin).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.count).toBe(5);
    });

    it("returns error on empty bin failure", async () => {
      vi.mocked(NotificationService.emptyUserNotificationsBin).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Server error" },
          data: null,
        },
      } as never);

      const result = await NotificationController.emptyUserNotificationsBin();

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("batchDiscardUserNotifications", () => {
    it("returns success and count on batch discard", async () => {
      vi.mocked(NotificationService.batchDiscardUserNotifications).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Batch discarded" },
          data: { count: 3 },
        },
      } as never);

      const result = await NotificationController.batchDiscardUserNotifications(["un_1", "un_2", "un_3"]);

      expect(NotificationService.batchDiscardUserNotifications).toHaveBeenCalledWith(["un_1", "un_2", "un_3"]);
      expect(result.success).toBe(true);
      expect(result.count).toBe(3);
    });

    it("returns error on batch discard failure", async () => {
      vi.mocked(NotificationService.batchDiscardUserNotifications).mockResolvedValue({
        data: {
          status: { code: 400, success: false, message: "Failed" },
          data: null,
        },
      } as never);

      const result = await NotificationController.batchDiscardUserNotifications(["un_1"]);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("batchUndiscardUserNotifications", () => {
    it("returns success and count on batch restore", async () => {
      vi.mocked(NotificationService.batchUndiscardUserNotifications).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Batch restored" },
          data: { count: 2 },
        },
      } as never);

      const result = await NotificationController.batchUndiscardUserNotifications(["un_1", "un_2"]);

      expect(NotificationService.batchUndiscardUserNotifications).toHaveBeenCalledWith(["un_1", "un_2"]);
      expect(result.success).toBe(true);
      expect(result.count).toBe(2);
    });

    it("returns error on batch restore failure", async () => {
      vi.mocked(NotificationService.batchUndiscardUserNotifications).mockResolvedValue({
        data: {
          status: { code: 400, success: false, message: "Failed" },
          data: null,
        },
      } as never);

      const result = await NotificationController.batchUndiscardUserNotifications(["un_1"]);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("batchDestroyUserNotifications", () => {
    it("returns success and count on batch destroy", async () => {
      vi.mocked(NotificationService.batchDestroyUserNotifications).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Batch deleted" },
          data: { count: 4 },
        },
      } as never);

      const result = await NotificationController.batchDestroyUserNotifications(["un_1", "un_2", "un_3", "un_4"]);

      expect(NotificationService.batchDestroyUserNotifications).toHaveBeenCalledWith(["un_1", "un_2", "un_3", "un_4"]);
      expect(result.success).toBe(true);
      expect(result.count).toBe(4);
    });

    it("returns error on batch destroy failure", async () => {
      vi.mocked(NotificationService.batchDestroyUserNotifications).mockResolvedValue({
        data: {
          status: { code: 400, success: false, message: "Failed" },
          data: null,
        },
      } as never);

      const result = await NotificationController.batchDestroyUserNotifications(["un_1"]);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });
});
