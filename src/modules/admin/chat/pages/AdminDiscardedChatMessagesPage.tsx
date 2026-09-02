// src/modules/admin/chat/pages/AdminDiscardedChatMessagesPage.tsx
import React from "react";
import { ADMIN_VIEW_MODES } from "../../constants";
import { AdminChatMessagesPage } from "./AdminChatMessagesPage";

export const AdminDiscardedChatMessagesPage: React.FC = () => {
  return <AdminChatMessagesPage view={ADMIN_VIEW_MODES.DISCARDED} />;
};
