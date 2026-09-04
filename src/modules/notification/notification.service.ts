import AppRoutes from "../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../models";
import { api } from "../../services";
import type { IInAppNotification, INotificationListParams } from "./types";

class NotificationService {
  async getNotifications(
    params?: INotificationListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IInAppNotification>[]>>> {
    return api.get<IJsonApiResource<IInAppNotification>[]>(
      AppRoutes.server.protected.NOTIFICATIONS,
      params ? { ...params } : undefined,
    );
  }

  async markRead(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IInAppNotification>>>> {
    return api.put<IJsonApiResource<IInAppNotification>>(
      AppRoutes.withId(AppRoutes.server.protected.NOTIFICATION_READ, id),
    );
  }

  async markAllRead(): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.put<null>(AppRoutes.server.protected.NOTIFICATIONS_READ_ALL);
  }
}

export default new NotificationService();
