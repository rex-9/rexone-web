export interface IAdminNotificationFormValues {
  user_ids: string[];
  title: string;
  message: string;
  send_push: boolean;
  send_socket: boolean;
  send_email: boolean;
}

export interface IAdminNotificationDelivery {
  count?: number;
  users?: Record<string, IAdminNotificationDelivery>;
  socket?: boolean;
  push?: boolean;
  email?: boolean;
}
