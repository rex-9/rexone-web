import NotificationService from "./notification.service";
import { parseFromList } from "../../../services/api.service";
import { IAdminUser } from "../users";
import {
  IAdminNotificationDelivery,
  IAdminNotificationFormValues,
  IAdminNotificationTemplate,
} from "./types";

class NotificationController {
  async getTemplates(
    onSuccess?: (templates: IAdminNotificationTemplate[]) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await NotificationService.getTemplates();
    const { status, data } = response.data || {};

    if (!status?.success || !data) {
      onError?.(status?.error || status?.message || response.error || "Failed to load notification templates");
      return;
    }

    onSuccess?.(data);
  }

  async getRecipients(
    onSuccess?: (users: IAdminUser[]) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await NotificationService.getRecipients();
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to load notification recipients",
        );
        return;
      }

      onSuccess?.(parseFromList<IAdminUser>(data));
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
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to send notification",
        );
        return;
      }

      onSuccess?.(data, status.message);
  }
}

export default new NotificationController();
