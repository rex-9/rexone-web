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
  ): Promise<IApiResponse<IApiEnvelope<IAdminNotificationDelivery>>> {
    const channels = [
      values.send_socket ? "socket" : null,
      values.send_push ? "push" : null,
      values.send_email ? "email" : null,
    ].filter((channel): channel is string => Boolean(channel));

    return api.post<IAdminNotificationDelivery>(
      AppRoutes.server.protected.ADMIN_NOTIFICATIONS,
      {
        audience: this.buildAudience(values),
        channels,
        title: values.title,
        message: values.message,
      },
    );
  }

  private buildAudience(values: IAdminNotificationFormValues) {
    if (values.audience_type === "all") {
      return { type: "all" };
    }

    if (values.audience_type === "roles") {
      return { type: "roles", role_ids: values.role_ids };
    }

    return { type: "users", user_ids: values.user_ids };
  }
}

export default new NotificationService();
