// src/modules/admin/chat/pages/AdminDiscardedChatRoomsPage.tsx
import React from "react";
import { ADMIN_VIEW_MODES } from "../../constants";
import { AdminChatRoomsPage } from "./AdminChatRoomsPage";

export const AdminDiscardedChatRoomsPage: React.FC = () => {
  return <AdminChatRoomsPage view={ADMIN_VIEW_MODES.DISCARDED} />;
};
