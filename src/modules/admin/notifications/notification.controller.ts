import NotificationService from "./notification.service";
import { parseFromList } from "../../../services/api.service";
import { IAdminUser } from "../users";
import {
  IAdminNotificationDelivery,
  IAdminNotificationFormValues,
} from "./types";

class NotificationController {
  async getRecipients(
    onSuccess?: (users: IAdminUser[]) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
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
    } catch (error) {
      console.error("Error fetching notification recipients:", error);
      onError?.("An error occurred while loading notification recipients.");
    }
  }

  async createNotification(
    values: IAdminNotificationFormValues,
    onSuccess?: (delivered: IAdminNotificationDelivery) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await NotificationService.createNotification(values);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to send notification",
        );
        return;
      }

      onSuccess?.(data);
    } catch (error) {
      console.error("Error sending admin notification:", error);
      onError?.("An error occurred while sending the notification.");
    }
  }
}

export default new NotificationController();
