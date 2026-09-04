import { parsePaginatedResponse, parseRecord } from "../../services/api.service";
import type { IApiPagination } from "../../models";
import NotificationService from "./notification.service";
import type { IInAppNotification, INotificationListParams } from "./types";

class NotificationController {
  async getNotifications(params?: INotificationListParams): Promise<{
    notifications: IInAppNotification[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await NotificationService.getNotifications(params);

    if (!response.data?.status?.success) {
      return {
        notifications: [],
        pagination: null,
        error: response.error || response.data?.status?.message,
      };
    }

    const parsed = parsePaginatedResponse<IInAppNotification>(response);
    return { notifications: parsed.records, pagination: parsed.pagination };
  }

  async markRead(id: string): Promise<{
    notification?: IInAppNotification;
    error?: string;
  }> {
    const response = await NotificationService.markRead(id);

    if (!response.data?.status?.success || !response.data.data) {
      return {
        error: response.error || response.data?.status?.message,
      };
    }

    return { notification: parseRecord<IInAppNotification>(response.data.data) };
  }

  async markAllRead(): Promise<{ error?: string }> {
    const response = await NotificationService.markAllRead();

    if (!response.data?.status?.success) {
      return { error: response.error || response.data?.status?.message };
    }

    return {};
  }
}

export default new NotificationController();
