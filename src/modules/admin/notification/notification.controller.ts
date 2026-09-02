import NotificationService from "./notification.service";
import { getApiError } from "../../../services/api.service";
import { translate } from "../../../locales";
import {
  IAdminNotificationDelivery,
  IAdminNotificationFormValues,
  IAdminNotificationTemplate,
} from "./types";
import { NOTIFICATION_LOCALES } from "./constants";

class NotificationController {
  async getTemplates(): Promise<{
    success: boolean;
    templates: IAdminNotificationTemplate[];
    error?: string;
  }> {
    const response = await NotificationService.getTemplates();
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        templates: data,
      };
    }

    return {
      success: false,
      templates: [],
      error: getApiError(
        response,
        translate(NOTIFICATION_LOCALES.Errors.LoadTemplates),
      ),
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
        translate(NOTIFICATION_LOCALES.Errors.Send),
      ),
    };
  }
}

export default new NotificationController();
