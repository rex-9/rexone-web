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
  event: string;
  label: string;
  category: NotificationEventCategory | string;
  admin_available: boolean;
  unavailable_reason?: string;
}

export interface IAdminNotificationDelivery {
  job_id: string;
  audience: NotificationAudienceType;
  recipient_count: number;
  channels: NotificationDeliveryChannel[];
}
