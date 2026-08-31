import AppRoutes from "../../../AppRoutes";
import { IApiEnvelope, IApiResponse } from "../../../models";
import { api } from "../../../services";
import {
  IAdminNotificationDelivery,
  IAdminNotificationFormValues,
  IAdminNotificationTemplate,
} from "./types";
import {
  NOTIFICATION_AUDIENCE_TYPES,
  NOTIFICATION_DELIVERY_CHANNELS,
} from "./constants";
import type { NotificationDeliveryChannel } from "./constants";

class NotificationService {
  async getTemplates(): Promise<
    IApiResponse<IApiEnvelope<IAdminNotificationTemplate[]>>
  > {
    return api.get<IAdminNotificationTemplate[]>(
      AppRoutes.server.protected.admin.NOTIFICATION_TEMPLATES,
    );
  }

  async createNotification(
    values: IAdminNotificationFormValues,
  ): Promise<IApiResponse<IApiEnvelope<IAdminNotificationDelivery>>> {
    const channels = [
      values.send_socket ? NOTIFICATION_DELIVERY_CHANNELS.SOCKET : null,
      values.send_push ? NOTIFICATION_DELIVERY_CHANNELS.PUSH : null,
      values.send_email ? NOTIFICATION_DELIVERY_CHANNELS.EMAIL : null,
    ].filter(
      (channel): channel is NotificationDeliveryChannel => Boolean(channel),
    );

    return api.post<IAdminNotificationDelivery>(
      AppRoutes.server.protected.admin.NOTIFICATIONS,
      {
        audience: this.buildAudience(values),
        channels,
        event: values.event,
      },
    );
  }

  private buildAudience(values: IAdminNotificationFormValues) {
    if (values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ALL) {
      return { type: NOTIFICATION_AUDIENCE_TYPES.ALL };
    }

    if (values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES) {
      return { type: NOTIFICATION_AUDIENCE_TYPES.ROLES, role_ids: values.role_ids };
    }

    return { type: NOTIFICATION_AUDIENCE_TYPES.USERS, user_ids: values.user_ids };
  }
}

export default new NotificationService();
