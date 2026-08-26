import AppRoutes from "../../../AppRoutes";
import { IAdminPageMeta } from "../constants";

export const ADMIN_NOTIFICATION_PAGE_TITLES = {
  LIST: "Notifications",
} as const;

export const ADMIN_NOTIFICATION_PAGE_META: Record<string, IAdminPageMeta> = {
  [AppRoutes.client.protected.admin.NOTIFICATIONS]: {
    title: ADMIN_NOTIFICATION_PAGE_TITLES.LIST,
  },
};

export const NOTIFICATION_AUDIENCE_TYPES = {
  ALL: "all",
  ROLES: "roles",
  USERS: "users",
} as const;

export type NotificationAudienceType =
  (typeof NOTIFICATION_AUDIENCE_TYPES)[keyof typeof NOTIFICATION_AUDIENCE_TYPES];

export const NOTIFICATION_DELIVERY_CHANNELS = {
  EMAIL: "email",
  PUSH: "push",
  SOCKET: "socket",
} as const;

export type NotificationDeliveryChannel =
  (typeof NOTIFICATION_DELIVERY_CHANNELS)[keyof typeof NOTIFICATION_DELIVERY_CHANNELS];

export const NOTIFICATION_FIELDS = {
  AUDIENCE_TYPE: "audience_type",
  EVENT: "event",
  ROLE_IDS: "role_ids",
  SEND_EMAIL: "send_email",
  SEND_PUSH: "send_push",
  SEND_SOCKET: "send_socket",
  USER_IDS: "user_ids",
} as const;

export const NOTIFICATION_EVENT_CATEGORIES = {
  AUTHENTICATION: "authentication",
  BROADCAST: "broadcast",
  PAYMENT: "payment",
} as const;

export type NotificationEventCategory =
  (typeof NOTIFICATION_EVENT_CATEGORIES)[keyof typeof NOTIFICATION_EVENT_CATEGORIES];

export const NOTIFICATION_KEYBOARD_KEYS = {
  ADD_RECIPIENT: "Enter",
  REMOVE_RECIPIENT: "Backspace",
  SEPARATOR: ",",
} as const;

export const NOTIFICATION_LOCALES = {
  Actions: {
    ClearAllRoles: "admin.notifications.actions.clear_all_roles",
    ClearAllUsers: "admin.notifications.actions.clear_all_users",
    RemoveRecipient: "admin.notifications.actions.remove_recipient",
    SelectAllRoles: "admin.notifications.actions.select_all_roles",
    SelectAllUsers: "admin.notifications.actions.select_all_users",
    Send: "admin.notifications.actions.send",
  },
  Errors: {
    LoadRecipients: "admin.notifications.errors.load_recipients",
    LoadTemplates: "admin.notifications.errors.load_templates",
    Send: "admin.notifications.errors.send",
  },
  Labels: {
    All: "admin.notifications.labels.all",
    AllUsers: "admin.notifications.labels.all_users",
    Audience: "admin.notifications.labels.audience",
    Delivery: "admin.notifications.labels.delivery",
    Email: "admin.notifications.labels.email",
    Event: "admin.notifications.labels.event",
    InApp: "admin.notifications.labels.in_app",
    Push: "admin.notifications.labels.push",
    Recipients: "admin.notifications.labels.recipients",
    SelectedRoles: "admin.notifications.labels.selected_roles",
    SelectedUsers: "admin.notifications.labels.selected_users",
  },
  Validation: {
    DeliveryChannelRequired:
      "admin.notifications.validation.delivery_channel_required",
    EventRequired: "admin.notifications.validation.event_required",
    RoleRequired: "admin.notifications.validation.role_required",
    UserRequired: "admin.notifications.validation.user_required",
  },
} as const;

export const NOTIFICATION_DELIVERY_FIELDS = [
  {
    field: NOTIFICATION_FIELDS.SEND_PUSH,
    channel: NOTIFICATION_DELIVERY_CHANNELS.PUSH,
    label: NOTIFICATION_LOCALES.Labels.Push,
  },
  {
    field: NOTIFICATION_FIELDS.SEND_SOCKET,
    channel: NOTIFICATION_DELIVERY_CHANNELS.SOCKET,
    label: NOTIFICATION_LOCALES.Labels.InApp,
  },
  {
    field: NOTIFICATION_FIELDS.SEND_EMAIL,
    channel: NOTIFICATION_DELIVERY_CHANNELS.EMAIL,
    label: NOTIFICATION_LOCALES.Labels.Email,
  },
] as const;
