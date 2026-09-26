// src/modules/admin/notification/notification.controller.ts

import NotificationService from "./notification.service";
import {
  getApiError,
  parsePagyList,
  parseRecord,
} from "../../../services/api.service";
import { translate, AppLocales } from "../../../locales";
import {
  IAdminNotificationDelivery,
  IAdminNotificationFormValues,
  IAdminNotificationTemplate,
  IAdminNotificationTemplateFormValues,
  IAdminTemplateListParams,
  IAdminUserNotification,
  IAdminUserNotificationListParams,
} from "./types";

class NotificationController {
  async getTemplates(params?: IAdminTemplateListParams): Promise<{
    success: boolean;
    templates: IAdminNotificationTemplate[];
    pagination?: any;
    error?: string;
  }> {
    const response = await NotificationService.getTemplates(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      if (Array.isArray(data)) {
        const templates = data.map((item: any) =>
          parseRecord<IAdminNotificationTemplate>(item),
        );
        return {
          success: true,
          templates,
          pagination: response.data?.meta?.pagination,
        };
      }

      const parsed =
        parsePagyList<IAdminNotificationTemplate>(response);
      return {
        success: true,
        templates: parsed.records,
        pagination: parsed.pagination,
      };
    }

    return {
      success: false,
      templates: [],
      error: getApiError(
        response,
        translate(AppLocales.Admin.Notifications.Errors.LoadTemplates),
      ),
    };
  }

  async getTemplate(id: string): Promise<{
    success: boolean;
    template?: IAdminNotificationTemplate;
    error?: string;
  }> {
    const response = await NotificationService.getTemplate(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        template: parseRecord<IAdminNotificationTemplate>(data as any),
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Notifications.Errors.LoadTemplates),
      ),
    };
  }

  async createTemplate(values: IAdminNotificationTemplateFormValues): Promise<{
    success: boolean;
    template?: IAdminNotificationTemplate;
    error?: string;
  }> {
    const response = await NotificationService.createTemplate(values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        template: parseRecord<IAdminNotificationTemplate>(data as any),
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to create notification template"),
    };
  }

  async updateTemplate(
    id: string,
    values: Partial<IAdminNotificationTemplateFormValues>,
  ): Promise<{
    success: boolean;
    template?: IAdminNotificationTemplate;
    error?: string;
  }> {
    const response = await NotificationService.updateTemplate(id, values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        template: parseRecord<IAdminNotificationTemplate>(data as any),
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to update notification template"),
    };
  }

  async discardTemplate(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await NotificationService.discardTemplate(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to delete template"),
    };
  }

  async undiscardTemplate(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await NotificationService.undiscardTemplate(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to restore template"),
    };
  }

  async createNotification(values: IAdminNotificationFormValues): Promise<{
    success: boolean;
    delivered?: IAdminNotificationDelivery;
    message?: string;
    error?: string;
  }> {
    const response = await NotificationService.createNotification(values);
    const { status, data } = response.data || {};
    const isQueued = status?.code === 202;

    if ((status?.success || isQueued) && data) {
      return {
        success: true,
        delivered: data,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Notifications.Errors.Send),
      ),
    };
  }

  // ===== USER NOTIFICATIONS (LIFECYCLE & INSPECTION) =====

  async getUserNotifications(params?: IAdminUserNotificationListParams): Promise<{
    success: boolean;
    notifications: IAdminUserNotification[];
    pagination?: any;
    error?: string;
  }> {
    const response = await NotificationService.getUserNotifications(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      if (Array.isArray(data)) {
        const notifications = data.map((item: any) =>
          parseRecord<IAdminUserNotification>(item),
        );
        return {
          success: true,
          notifications,
          pagination: response.data?.meta?.pagination,
        };
      }

      const parsed = parsePagyList<IAdminUserNotification>(response);
      return {
        success: true,
        notifications: parsed.records,
        pagination: parsed.pagination,
      };
    }

    return {
      success: false,
      notifications: [],
      error: getApiError(response, "Failed to load user notifications"),
    };
  }

  async getUserNotification(id: string): Promise<{
    success: boolean;
    notification?: IAdminUserNotification;
    error?: string;
  }> {
    const response = await NotificationService.getUserNotification(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        notification: parseRecord<IAdminUserNotification>(data as any),
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to load user notification"),
    };
  }

  async discardUserNotification(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await NotificationService.discardUserNotification(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to discard user notification"),
    };
  }

  async undiscardUserNotification(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await NotificationService.undiscardUserNotification(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to restore user notification"),
    };
  }

  async destroyUserNotification(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await NotificationService.destroyUserNotification(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to permanently delete user notification"),
    };
  }

  async emptyUserNotificationsBin(): Promise<{
    success: boolean;
    count?: number;
    error?: string;
  }> {
    const response = await NotificationService.emptyUserNotificationsBin();
    const { status, data } = response.data || {};

    if (status?.success) {
      return { success: true, count: data?.count };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to empty user notifications recycle bin"),
    };
  }

  async batchDiscardUserNotifications(ids: string[]): Promise<{
    success: boolean;
    count?: number;
    error?: string;
  }> {
    const response = await NotificationService.batchDiscardUserNotifications(ids);
    const { status, data } = response.data || {};

    if (status?.success) {
      return { success: true, count: data?.count };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to batch discard user notifications"),
    };
  }

  async batchUndiscardUserNotifications(ids: string[]): Promise<{
    success: boolean;
    count?: number;
    error?: string;
  }> {
    const response = await NotificationService.batchUndiscardUserNotifications(ids);
    const { status, data } = response.data || {};

    if (status?.success) {
      return { success: true, count: data?.count };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to batch restore user notifications"),
    };
  }

  async batchDestroyUserNotifications(ids: string[]): Promise<{
    success: boolean;
    count?: number;
    error?: string;
  }> {
    const response = await NotificationService.batchDestroyUserNotifications(ids);
    const { status, data } = response.data || {};

    if (status?.success) {
      return { success: true, count: data?.count };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to batch delete user notifications"),
    };
  }
}

export default new NotificationController();
