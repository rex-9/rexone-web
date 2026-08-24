export interface IAdminNotificationFormValues {
  event: string;
  audience_type: "users" | "roles" | "all";
  user_ids: string[];
  role_ids: string[];
  send_push: boolean;
  send_socket: boolean;
  send_email: boolean;
}

export interface IAdminNotificationTemplate {
  event: string;
  label: string;
  category: "authentication" | "broadcast" | "payment" | string;
  admin_available: boolean;
  unavailable_reason?: string;
}

export interface IAdminNotificationDelivery {
  job_id?: string;
  audience?: "users" | "roles" | "all";
  recipient_count?: number;
  channels?: string[];
  count?: number;
  users?: Record<string, IAdminNotificationDelivery>;
  socket?: boolean;
  push?: boolean;
  email?: boolean;
}
