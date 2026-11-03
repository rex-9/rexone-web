// src/modules/admin/constants.ts

import type React from "react";
import AppRoutes from "../../AppRoutes";
import { iconsLib } from "../../assets";
import { AppLocales } from "../../locales";

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
  AI_PROFILES: "ai_profiles",
  AI_RUNS: "ai_runs",
  AI_PRICES: "ai_prices",
  CHAT_ROOMS: "chat_rooms",
  CHAT_MESSAGES: "chat_messages",
  CLIENT_LOGS: "client_logs",
  CLIENT_VERSIONS: "client_versions",
  CLIENT_USER_VERSIONS: "client_user_versions",
  IAM_ROLES: "iam_roles",
  IAM_PERMISSIONS: "iam_permissions",
  IAM_USER_ROLES: "iam_user_roles",
  PAYMENT_PRODUCTS: "payment_products",
  PAYMENT_PAYMENTS: "payment_payments",
  PAYMENT_SUBSCRIPTIONS: "payment_subscriptions",
  PAYMENT_PURCHASES: "payment_purchases",
  PAYMENT_COUPONS: "payment_coupons",
  PAYMENT_USER_COUPONS: "payment_user_coupons",
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

export interface IAdminNavItem {
  labelKey: string;
  to: string;
  resource: TAdminResourceName;
  action?: typeof ADMIN_ACTIONS.READ | typeof ADMIN_ACTIONS.CREATE;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  superAdminOnly?: boolean;
}

export interface IAdminNavSection {
  id: string;
  labelKey: string;
  items: IAdminNavItem[];
}

export const ADMIN_NAV_SECTIONS: IAdminNavSection[] = [
  {
    id: "overview",
    labelKey: AppLocales.Admin.Nav.Sections.Overview,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Analytics,
        to: AppRoutes.client.protected.admin.ANALYTICS,
        resource: ADMIN_RESOURCES.ANALYTICS,
        icon: iconsLib.chartBar,
      },
    ],
  },
  {
    id: "commerce",
    labelKey: AppLocales.Admin.Nav.Sections.Commerce,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Products,
        to: AppRoutes.client.protected.admin.PRODUCTS,
        resource: ADMIN_RESOURCES.PAYMENT_PRODUCTS,
        icon: iconsLib.cube,
      },
      {
        labelKey: AppLocales.Admin.Nav.Items.Purchases,
        to: AppRoutes.client.protected.admin.PURCHASES,
        resource: ADMIN_RESOURCES.PAYMENT_PURCHASES,
        icon: iconsLib.banknotes,
      },
      {
        labelKey: AppLocales.Admin.Nav.Items.Subscriptions,
        to: AppRoutes.client.protected.admin.SUBSCRIPTIONS,
        resource: ADMIN_RESOURCES.PAYMENT_SUBSCRIPTIONS,
        icon: iconsLib.document,
      },
      {
        labelKey: AppLocales.Admin.Nav.Items.Coupons,
        to: AppRoutes.client.protected.admin.COUPONS,
        resource: ADMIN_RESOURCES.PAYMENT_COUPONS,
        icon: iconsLib.tag,
      },
      {
        labelKey: AppLocales.Admin.Nav.Items.Accesses,
        to: AppRoutes.client.protected.admin.ACCESSES,
        resource: ADMIN_RESOURCES.ACCESSES,
        icon: iconsLib.shieldCheck,
      },
    ],
  },
  {
    id: "iam",
    labelKey: AppLocales.Admin.Nav.Sections.Iam,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Users,
        to: AppRoutes.client.protected.admin.USERS,
        resource: ADMIN_RESOURCES.USERS,
        icon: iconsLib.userGroup,
      },
      {
        labelKey: AppLocales.Admin.Nav.Items.Roles,
        to: AppRoutes.client.protected.admin.ROLES,
        resource: ADMIN_RESOURCES.IAM_ROLES,
        icon: iconsLib.key,
        superAdminOnly: true,
      },
    ],
  },
  {
    id: "media",
    labelKey: AppLocales.Admin.Nav.Sections.Media,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Assets,
        to: AppRoutes.client.protected.admin.ASSETS,
        resource: ADMIN_RESOURCES.ASSETS,
        icon: iconsLib.photo,
      },
    ],
  },
  {
    id: "ai",
    labelKey: AppLocales.Admin.Nav.Sections.Ai,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.AiProfiles,
        to: AppRoutes.client.protected.admin.AI_PROFILES,
        resource: ADMIN_RESOURCES.AI_PROFILES,
        icon: iconsLib.sparkles,
      },
      {
        labelKey: AppLocales.Admin.Nav.Items.AiRuns,
        to: AppRoutes.client.protected.admin.AI_RUNS,
        resource: ADMIN_RESOURCES.AI_RUNS,
        icon: iconsLib.chartBar,
      },
    ],
  },
  {
    id: "support",
    labelKey: AppLocales.Admin.Nav.Sections.Support,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Feedback,
        to: AppRoutes.client.protected.admin.FEEDBACK,
        resource: ADMIN_RESOURCES.FEEDBACKS,
        icon: iconsLib.mail,
      },
    ],
  },
  {
    id: "observability",
    labelKey: AppLocales.Admin.Nav.Sections.Observability,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Logs,
        to: AppRoutes.client.protected.admin.LOGS,
        resource: ADMIN_RESOURCES.CLIENT_LOGS,
        icon: iconsLib.document,
      },
    ],
  },
  {
    id: "communication",
    labelKey: AppLocales.Admin.Nav.Sections.Communication,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Notifications,
        to: AppRoutes.client.protected.admin.NOTIFICATIONS,
        resource: ADMIN_RESOURCES.NOTIFICATIONS,
        icon: iconsLib.bellAlert,
      },
      {
        labelKey: AppLocales.Admin.Nav.Items.ChatRooms,
        to: AppRoutes.client.protected.admin.CHAT_ROOMS,
        resource: ADMIN_RESOURCES.CHAT_ROOMS,
        icon: iconsLib.chatBubbleLeftRight,
      },
      {
        labelKey: AppLocales.Admin.Nav.Items.ChatMessages,
        to: AppRoutes.client.protected.admin.CHAT_MESSAGES,
        resource: ADMIN_RESOURCES.CHAT_MESSAGES,
        icon: iconsLib.inboxStack,
      },
    ],
  },
  {
    id: "version-management",
    labelKey: AppLocales.Admin.Nav.Sections.VersionManagement,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Versions,
        to: AppRoutes.client.protected.admin.VERSIONS,
        resource: ADMIN_RESOURCES.CLIENT_VERSIONS,
        icon: iconsLib.tag,
        superAdminOnly: true,
      },
    ],
  },
];

export const ADMIN_NAV_ITEMS: IAdminNavItem[] = ADMIN_NAV_SECTIONS.flatMap(
  (section) => section.items,
);

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
  PURCHASES: "Purchases",
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
