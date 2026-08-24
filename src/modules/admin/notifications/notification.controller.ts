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
    onSuccess?: (delivered: IAdminNotificationDelivery) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
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
  }
}

export default new NotificationController();
