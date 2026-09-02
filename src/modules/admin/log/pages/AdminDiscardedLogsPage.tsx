// src/modules/admin/log/pages/AdminDiscardedLogsPage.tsx
import React from "react";
import { ADMIN_VIEW_MODES } from "../../constants";
import { AdminLogsPage } from "./AdminLogsPage";

export const AdminDiscardedLogsPage: React.FC = () => {
  return <AdminLogsPage view={ADMIN_VIEW_MODES.DISCARDED} />;
};
