import type {
  NotificationAudienceType,
  NotificationDeliveryChannel,
  NotificationEventCategory,
} from "./constants";

export interface IAdminNotificationFormValues {
  event: string;
  audience_type: NotificationAudienceType;
  user_ids: string[];
  role_ids: string[];
  send_push: boolean;
  send_socket: boolean;
  send_email: boolean;
}

export interface IAdminNotificationTemplate {
  id?: string;
  event: string;
  name: string;
  label?: string;
  description?: string | null;
  category: NotificationEventCategory | string;
  link?: string | null;
  cta_text?: string | null;
  clients: string[];
  admin?: boolean;
  unavailable_reason?: string;
  in_app_title?: string | null;
  in_app_body?: string | null;
  in_app_data?: Record<string, unknown>;
  push_title?: string | null;
  push_body?: string | null;
  push_template_id?: string | null;
  email_subject?: string | null;
  email_body?: string | null;
  email_template_id?: string | null;
  sent_count?: number;
  read_count?: number;
  discarded_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IAdminNotificationTemplateFormValues {
  event: string;
  name: string;
  description?: string;
  category: string;
  link?: string;
  cta_text?: string;
  clients: string[];
  admin: boolean;
  in_app_title?: string;
  in_app_body?: string;
  in_app_data?: Record<string, unknown>;
  push_title?: string;
  push_body?: string;
  push_template_id?: string;
  email_subject?: string;
  email_body?: string;
  email_template_id?: string;
}

export interface IAdminTemplateListParams {
  [key: string]: unknown;
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface IAdminNotificationDelivery {
  job_id: string;
  audience: NotificationAudienceType;
  recipient_count: number;
  channels: NotificationDeliveryChannel[];
}

export interface IAdminUserNotification {
  id: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  notification_id?: string | null;
  notification_event?: string | null;
  title: string;
  message: string;
  link?: string | null;
  clients: string[];
  metadata: Record<string, unknown>;
  operation_id?: string | null;
  operation_type?: string | null;
  operation_status?: string | null;
  read: boolean;
  read_at?: string | null;
  created_at: string;
  updated_at?: string;
  discarded_at?: string | null;
}

export interface IAdminUserNotificationListParams {
  [key: string]: unknown;
  page?: number;
  limit?: number;
  search?: string;
  user_id?: string;
  client?: string;
  status?: string;
  discarded?: boolean | string;
  sort_by?: string;
  sort_order?: string;
}
