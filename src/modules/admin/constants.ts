// src/modules/admin/constants.ts

export const ADMIN_PAGE_SIZE = 20;

export const ADMIN_VIEW_MODES = {
  ACTIVE: "active",
  DISCARDED: "discarded",
} as const;

export type TAdminViewMode =
  (typeof ADMIN_VIEW_MODES)[keyof typeof ADMIN_VIEW_MODES];

export const ADMIN_ACTIONS = {
  CREATE: "create",
  DELETE: "delete",
  READ: "read",
  UPDATE: "update",
  EDIT: "edit",
  DISCARD: "discard",
  UNDISCARD: "undiscard",
  DESTROY: "destroy",

  EXTEND: "extend",
  REVOKE: "revoke",

  REVIEW: "review",
  INSPECT: "inspect",
} as const;

export const ADMIN_ACTION_CATEGORIES = {
  NEUTRAL: "neutral",
  DANGER: "danger",
  SUCCESS: "success",
} as const;

export type TAdminActionCategory =
  (typeof ADMIN_ACTION_CATEGORIES)[keyof typeof ADMIN_ACTION_CATEGORIES];

export type TAdminActionsType =
  (typeof ADMIN_ACTIONS)[keyof typeof ADMIN_ACTIONS];

export const ADMIN_RESOURCES = {
  // Top-level domain resources
  USERS: "users",
  ACCESSES: "accesses",
  ASSETS: "assets",
  NOTIFICATIONS: "notifications",
  USER_NOTIFICATIONS: "user_notifications",
  FEEDBACKS: "feedbacks",
  ANALYTICS: "analytics",
  SPEECH: "speech",

  // Module-namespaced resources
  CHAT_ROOMS: "chat_rooms",
  CHAT_MESSAGES: "chat_messages",
  AI_PROFILES: "ai_profiles",
  AI_RUNS: "ai_runs",
  CLIENT_LOGS: "client_logs",
  CLIENT_VERSIONS: "client_versions",
  CLIENT_USER_VERSIONS: "client_user_versions",
  IAM_ROLES: "iam_roles",
  IAM_PERMISSIONS: "iam_permissions",
  IAM_USER_ROLES: "iam_user_roles",
  PAYMENT_PRODUCTS: "payment_products",
  PAYMENT_PAYMENTS: "payment_payments",
  PAYMENT_SUBSCRIPTIONS: "payment_subscriptions",
  PAYMENT_TRANSACTIONS: "payment_transactions",
  PAYMENT_COUPONS: "payment_coupons",
  PAYMENT_USER_COUPONS: "payment_user_coupons",

  // Aliases for seamless component compatibility
  ROOMS: "chat_rooms",
  MESSAGES: "chat_messages",
  LOGS: "client_logs",
  CLIENTS: "client_logs",
  VERSIONS: "client_versions",
  USER_VERSIONS: "client_user_versions",
  ROLES: "iam_roles",
  PERMISSIONS: "iam_permissions",
  PRODUCTS: "payment_products",
  PAYMENTS: "payment_payments",
  SUBSCRIPTIONS: "payment_subscriptions",
  TRANSACTIONS: "payment_transactions",
  COUPONS: "payment_coupons",
  USER_COUPONS: "payment_user_coupons",
} as const;

export type TAdminResourceName =
  (typeof ADMIN_RESOURCES)[keyof typeof ADMIN_RESOURCES];

export const ADMIN_PERMISSION_ACTION_ORDER: string[] = [
  ADMIN_ACTIONS.READ,
  ADMIN_ACTIONS.CREATE,
  ADMIN_ACTIONS.UPDATE,
  ADMIN_ACTIONS.DELETE,
];

export const ADMIN_PERMISSION_FALLBACKS = {
  NULL_RESOURCE: "null",
  UNASSIGNED_RESOURCE: "unassigned",
} as const;

export interface IAdminPageMeta {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  actionResource?: TAdminResourceName;
  hasRecycleBin?: boolean;
}

export const ADMIN_NAV_SECTION_LABELS = {
  OVERVIEW: "Overview",
  IAM: "IAM",
  CHAT: "Chat",
  AI: "AI Control Panel",
  COMMERCE: "Commerce",
  COMMUNICATION: "Communication",
  SUPPORT: "Support",
  OBSERVABILITY: "Observability",
  MEDIA: "Media",
  VERSION_MANAGEMENT: "Version Management",
} as const;

export const ADMIN_NAV_LABELS = {
  ANALYTICS: "Analytics",
  AI_PROFILES: "AI Profiles",
  AI_RUNS: "AI Runs",
  CHAT_MESSAGES: "Chat Messages",
  CHAT_ROOMS: "Chat Rooms",
  NOTIFICATIONS: "Notifications",
  PRODUCTS: "Products",
  TRANSACTIONS: "Transactions",
  SUBSCRIPTIONS: "Subscriptions",
  COUPONS: "Coupons",
  USER_COUPONS: "Redemptions",
  ACCESSES: "Access",
  FEEDBACK: "Feedback Inbox",
  LOGS: "Client Logs & Telemetry",
  ROLES: "Roles",
  USERS: "Users",
  ASSETS: "Assets",
  VERSIONS: "Versions",
  USER_VERSIONS: "User Versions",
} as const;

export const ANALYTICS_PERIODS = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  SEVEN_DAYS: "7d",
  THIRTY_DAYS: "30d",
  THIS_MONTH: "this_month",
  LAST_MONTH: "last_month",
  THIS_YEAR: "this_year",
  LAST_YEAR: "last_year",
  CUSTOM: "custom",
} as const;

export type TAnalyticsPeriod =
  (typeof ANALYTICS_PERIODS)[keyof typeof ANALYTICS_PERIODS];

export const ANALYTICS_GRAINS = {
  HOURLY: "hourly",
  DAILY: "daily",
  MONTHLY: "monthly",
} as const;

export type TAnalyticsGrain =
  (typeof ANALYTICS_GRAINS)[keyof typeof ANALYTICS_GRAINS];

export const ANALYTICS_PERIOD_LABELS: Record<TAnalyticsPeriod, string> = {
  [ANALYTICS_PERIODS.TODAY]: "Today",
  [ANALYTICS_PERIODS.YESTERDAY]: "Yesterday",
  [ANALYTICS_PERIODS.SEVEN_DAYS]: "Last 7 days",
  [ANALYTICS_PERIODS.THIRTY_DAYS]: "Last 30 days",
  [ANALYTICS_PERIODS.THIS_MONTH]: "This month",
  [ANALYTICS_PERIODS.LAST_MONTH]: "Last month",
  [ANALYTICS_PERIODS.THIS_YEAR]: "This year",
  [ANALYTICS_PERIODS.LAST_YEAR]: "Last year",
  [ANALYTICS_PERIODS.CUSTOM]: "Custom Range",
};

export const ADMIN_TABLE_HEADERS = {
  ACTIONS: "",
  CREATED: "Created",
  STATUS: "Status",
} as const;

export const ADMIN_COMMON_LABELS = {
  ACTIVE: "Active",
  CANCEL: "Cancel",
  CUSTOM: "Custom",
  DELETE: "Delete",
  DISCARD: "Discard",
  DESTROY: "Destroy",
  EDIT: "Edit",
  EXTEND: "Extend",
  INACTIVE: "Inactive",
  INSPECT: "Inspect",
  NOT_AVAILABLE: "Not available",
  OPENRECYCLEBIN: "Open recycle bin",
  UNDISCARD: "Restore",
  REVIEW: "Review",
  REVOKE: "Revoke",
  SYSTEM: "System",
  UNASSIGNED: "Unassigned",
} as const;
