// src/modules/admin/constants.ts

export const ADMIN_PAGE_SIZE = 20;

export const ADMIN_ACTIONS = {
  CREATE: "create",
  DELETE: "delete",
  READ: "read",
  UPDATE: "update",
} as const;

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

export const ADMIN_ROLE_NAMES = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  USER: "user",
} as const;

export const ADMIN_COMMON_LABELS = {
  ACTIVE: "Active",
  CANCEL: "Cancel",
  CUSTOM: "Custom",
  DELETE: "Delete",
  EDIT: "Edit",
  INACTIVE: "Inactive",
  NOT_AVAILABLE: "Not available",
  SYSTEM: "System",
  UNASSIGNED: "Unassigned",
} as const;
