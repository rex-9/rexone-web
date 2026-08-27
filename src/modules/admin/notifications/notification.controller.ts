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
  async getTemplates(
    onSuccess?: (templates: IAdminNotificationTemplate[]) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await NotificationService.getTemplates();
    const { status, data } = response.data || {};

    if (!status?.success || !data) {
      onError?.(
        getApiError(response, translate(NOTIFICATION_LOCALES.Errors.LoadTemplates)),
      );
      return;
    }

    onSuccess?.(data);
  }

  async createNotification(
    values: IAdminNotificationFormValues,
    onSuccess?: (delivered: IAdminNotificationDelivery, message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await NotificationService.createNotification(values);
      const { status, data } = response.data || {};
      const isQueued = status?.code === 202;

      if ((!status?.success && !isQueued) || !data) {
        onError?.(
          getApiError(response, translate(NOTIFICATION_LOCALES.Errors.Send)),
        );
        return;
      }

      onSuccess?.(data, status.message);
  }
}

export default new NotificationController();
