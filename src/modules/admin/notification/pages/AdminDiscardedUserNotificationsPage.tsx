// src/modules/admin/notification/pages/AdminDiscardedUserNotificationsPage.tsx

import React from "react";
import { ADMIN_VIEW_MODES } from "../../constants";
import { AdminUserNotificationsPage } from "./AdminUserNotificationsPage";

export const AdminDiscardedUserNotificationsPage: React.FC = () => {
  return <AdminUserNotificationsPage view={ADMIN_VIEW_MODES.DISCARDED} />;
};
