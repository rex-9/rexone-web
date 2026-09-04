export interface IInAppNotification {
  id: string;
  title?: string | null;
  message: string;
  event?: string | null;
  data: Record<string, unknown>;
  read: boolean;
  read_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface INotificationListParams {
  limit?: number;
  page?: number;
}
