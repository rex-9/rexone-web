import AppRoutes from "../../AppRoutes";

export const ADMIN_PAGE_SIZE = 20;

export const ADMIN_ACTIONS = {
  CREATE: "create",
  DELETE: "delete",
  READ: "read",
  UPDATE: "update",
} as const;

export const ADMIN_TABLE_ACTION_TYPES = {
  DELETE: "delete",
  DISCARD: "discard",
  EDIT: "edit",
  RESTORE: "restore",
} as const;

export type TAdminTableActionType =
  (typeof ADMIN_TABLE_ACTION_TYPES)[keyof typeof ADMIN_TABLE_ACTION_TYPES];

export const ADMIN_RESOURCES = {
  MESSAGES: "messages",
  NOTIFICATIONS: "notifications",
  PRODUCTS: "products",
  ROLES: "roles",
  ROOMS: "rooms",
  USERS: "users",
} as const;

export type TAdminResourceName =
  (typeof ADMIN_RESOURCES)[keyof typeof ADMIN_RESOURCES];

export const ADMIN_PAGE_TITLES = {
  CHAT_MESSAGE_EDIT: "Edit Chat Message",
  CHAT_MESSAGES: "Chat Messages",
  CHAT_ROOM_EDIT: "Edit Chat Room",
  CHAT_ROOMS: "Chat Rooms",
  NOTIFICATIONS: "Notifications",
  PRODUCT_CREATE: "Create Product",
  PRODUCT_EDIT: "Edit Product",
  PRODUCTS: "Products",
  ROLE_CREATE: "Create Role",
  ROLE_EDIT: "Edit Role",
  ROLES: "Roles",
  USER_CREATE: "Create User",
  USER_EDIT: "Edit User",
  USERS_RECYCLE_BIN: "User Recycle Bin",
  USERS: "Users",
} as const;

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
}

export const ADMIN_PAGE_META: Record<string, IAdminPageMeta> = {
  [AppRoutes.client.protected.ADMIN_USERS]: {
    title: ADMIN_PAGE_TITLES.USERS,
    actionLabel: "Create user",
    actionTo: AppRoutes.client.protected.ADMIN_USER_CREATE,
    actionResource: ADMIN_RESOURCES.USERS,
  },
  [AppRoutes.client.protected.ADMIN_USERS_RECYCLE_BIN]: {
    title: ADMIN_PAGE_TITLES.USERS_RECYCLE_BIN,
    description: "Restore discarded users or permanently remove them.",
  },
  [AppRoutes.client.protected.ADMIN_USER_CREATE]: {
    title: ADMIN_PAGE_TITLES.USER_CREATE,
    description: "Add a user account using the admin user endpoint.",
  },
  [AppRoutes.client.protected.ADMIN_USER_EDIT]: {
    title: ADMIN_PAGE_TITLES.USER_EDIT,
    description: "Update account details and admin-assigned fields.",
  },
  [AppRoutes.client.protected.ADMIN_ROLES]: {
    title: ADMIN_PAGE_TITLES.ROLES,
    actionLabel: "Create role",
    actionTo: AppRoutes.client.protected.ADMIN_ROLE_CREATE,
    actionResource: ADMIN_RESOURCES.ROLES,
  },
  [AppRoutes.client.protected.ADMIN_ROLE_CREATE]: {
    title: ADMIN_PAGE_TITLES.ROLE_CREATE,
  },
  [AppRoutes.client.protected.ADMIN_ROLE_EDIT]: {
    title: ADMIN_PAGE_TITLES.ROLE_EDIT,
  },
  [AppRoutes.client.protected.ADMIN_NOTIFICATIONS]: {
    title: ADMIN_PAGE_TITLES.NOTIFICATIONS,
  },
  [AppRoutes.client.protected.ADMIN_PRODUCTS]: {
    title: ADMIN_PAGE_TITLES.PRODUCTS,
    actionLabel: "Create product",
    actionTo: AppRoutes.client.protected.ADMIN_PRODUCT_CREATE,
    actionResource: ADMIN_RESOURCES.PRODUCTS,
  },
  [AppRoutes.client.protected.ADMIN_PRODUCT_CREATE]: {
    title: ADMIN_PAGE_TITLES.PRODUCT_CREATE,
  },
  [AppRoutes.client.protected.ADMIN_PRODUCT_EDIT]: {
    title: ADMIN_PAGE_TITLES.PRODUCT_EDIT,
  },
  [AppRoutes.client.protected.ADMIN_CHAT_ROOMS]: {
    title: ADMIN_PAGE_TITLES.CHAT_ROOMS,
  },
  [AppRoutes.client.protected.ADMIN_CHAT_ROOM_EDIT]: {
    title: ADMIN_PAGE_TITLES.CHAT_ROOM_EDIT,
  },
  [AppRoutes.client.protected.ADMIN_CHAT_MESSAGES]: {
    title: ADMIN_PAGE_TITLES.CHAT_MESSAGES,
  },
  [AppRoutes.client.protected.ADMIN_CHAT_MESSAGE_EDIT]: {
    title: ADMIN_PAGE_TITLES.CHAT_MESSAGE_EDIT,
  },
};

export const ADMIN_NAV_SECTION_LABEL = "Manage";

export const ADMIN_NAV_LABELS = {
  CHAT_MESSAGES: "Chat Messages",
  CHAT_ROOMS: "Chat Rooms",
  NOTIFICATIONS: "Notifications",
  PRODUCTS: "Products",
  ROLES: "Roles",
  USERS: "Users",
} as const;

export const ADMIN_ROLE_NAMES = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  USER: "user",
} as const;

export const ADMIN_TABLE_HEADERS = {
  ACTIONS: "",
  CREATED: "Created",
  CYCLE: "Cycle",
  EMAIL: "Email",
  LAST_MESSAGE: "Last message",
  MESSAGE: "Message",
  MESSAGES: "Messages",
  PERMISSIONS: "Permissions",
  PRICE: "Price",
  PRODUCT: "Product",
  ROLE: "Role",
  ROOM: "Room",
  ROOM_ID: "Room ID",
  STATUS: "Status",
  TYPE: "Type",
  USER: "User",
  USERS: "Users",
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
  SYSTEM: "System",
  RESTORE: "Restore",
  UNASSIGNED: "Unassigned",
} as const;
