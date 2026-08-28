// src/modules/admin/constants.ts

export const ADMIN_PAGE_SIZE = 20;

export const ADMIN_ACTIONS = {
  CREATE: "create",
  DELETE: "delete",
  READ: "read",
  UPDATE: "update",
  DISCARD: "discard",
  EDIT: "edit",
  RESTORE: "restore",
} as const;

export type TAdminActionsType =
  (typeof ADMIN_ACTIONS)[keyof typeof ADMIN_ACTIONS];

export const ADMIN_RESOURCES = {
  USERS: "users",
  ROLES: "roles",
  PRODUCTS: "products",
  NOTIFICATIONS: "notifications",
  ROOMS: "rooms",
  MESSAGES: "messages",
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

export const ADMIN_NAV_SECTION_LABEL = "Manage";

export const ADMIN_NAV_LABELS = {
  CHAT_MESSAGES: "Chat Messages",
  CHAT_ROOMS: "Chat Rooms",
  NOTIFICATIONS: "Notifications",
  PRODUCTS: "Products",
  ROLES: "Roles",
  USERS: "Users",
} as const;

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
  EDIT: "Edit",
  INACTIVE: "Inactive",
  NOT_AVAILABLE: "Not available",
  OPENRECYCLEBIN: "Open recycle bin",
  RESTORE: "Restore",
  SYSTEM: "System",
  UNASSIGNED: "Unassigned",
} as const;
