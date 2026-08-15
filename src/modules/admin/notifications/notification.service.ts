import AppRoutes from "../../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../../models";
import { api } from "../../../services";
import { IAdminUser } from "../users";
import {
  IAdminNotificationDelivery,
  IAdminNotificationFormValues,
} from "./types";

class NotificationService {
  async getRecipients(): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>[]>>
  > {
    return api.get<IJsonApiResource<IAdminUser>[]>(
      AppRoutes.server.protected.ADMIN_NOTIFICATION_RECIPIENTS,
    );
  }

  async createNotification(
    values: IAdminNotificationFormValues,
  ): Promise<
    IApiResponse<
      IApiEnvelope<{ delivered: IAdminNotificationDelivery }>
    >
  > {
    return api.post<{ delivered: IAdminNotificationDelivery }>(
      AppRoutes.server.protected.ADMIN_NOTIFICATIONS,
      {
        notification: values,
      },
    );
  }
}

export default new NotificationService();
