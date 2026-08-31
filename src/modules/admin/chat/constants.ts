import AppRoutes from "../../../AppRoutes";
import { IAdminPageMeta } from "../constants";

export const ADMIN_CHAT_PAGE_TITLES = {
  MESSAGE_EDIT: "Edit Chat Message",
  MESSAGES: "Chat Messages",
  ROOM_EDIT: "Edit Chat Room",
  ROOMS: "Chat Rooms",
} as const;

export const ADMIN_CHAT_TABLE_HEADERS = {
  LAST_MESSAGE: "Last message",
  MESSAGE: "Message",
  MESSAGES: "Messages",
  ROLE: "Role",
  ROOM: "Room",
  ROOM_ID: "Room ID",
} as const;

export const ADMIN_CHAT_MESSAGE_TABLE_KEYS = {
  ACTIONS: "actions",
  CONTENT: "content",
  CREATED: "created",
  ROLE: "role",
  ROOM: "room",
} as const;

export const ADMIN_CHAT_ROOM_TABLE_KEYS = {
  ACTIONS: "actions",
  CREATED: "created",
  LAST_MESSAGE: "last",
  MESSAGES: "messages",
  TITLE: "title",
} as const;

export const ADMIN_CHAT_PAGE_META: Record<string, IAdminPageMeta> = {
  [AppRoutes.client.protected.admin.CHAT_ROOMS]: {
    title: ADMIN_CHAT_PAGE_TITLES.ROOMS,
  },
  [AppRoutes.client.protected.admin.CHAT_ROOM_EDIT]: {
    title: ADMIN_CHAT_PAGE_TITLES.ROOM_EDIT,
  },
  [AppRoutes.client.protected.admin.CHAT_MESSAGES]: {
    title: ADMIN_CHAT_PAGE_TITLES.MESSAGES,
  },
  [AppRoutes.client.protected.admin.CHAT_MESSAGE_EDIT]: {
    title: ADMIN_CHAT_PAGE_TITLES.MESSAGE_EDIT,
  },
};
