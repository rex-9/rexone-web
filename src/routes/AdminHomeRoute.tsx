import React from "react";
import { Navigate } from "react-router-dom";
import AppRoutes from "../AppRoutes";
import { useAuth } from "../contexts";
import { NotFoundPage } from "../design/pages";
import { usePermissions } from "../hooks";
import { AdminResource, hasAdminRole } from "../models";
import { ADMIN_ACTIONS } from "../modules/admin";

const adminEntryRoutes: Array<{
  action?: typeof ADMIN_ACTIONS.READ | typeof ADMIN_ACTIONS.CREATE;
  resource: AdminResource;
  path: string;
}> = [
  { resource: "users", path: AppRoutes.client.protected.admin.USERS },
  {
    resource: "notifications",
    path: AppRoutes.client.protected.admin.NOTIFICATIONS,
  },
  { resource: "products", path: AppRoutes.client.protected.admin.PRODUCTS },
  { resource: "rooms", path: AppRoutes.client.protected.admin.CHAT_ROOMS },
  {
    resource: "messages",
    path: AppRoutes.client.protected.admin.CHAT_MESSAGES,
  },
];

export const AdminHomeRoute: React.FC = () => {
  const { currentUser } = useAuth();
  const { can, isLoading } = usePermissions();
  const hasAdminAccess = hasAdminRole(currentUser?.role_names);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100 text-base-content">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  const entry = hasAdminAccess
    ? adminEntryRoutes.find((item) =>
        can(item.action ?? ADMIN_ACTIONS.READ, item.resource),
      )
    : null;

  return entry ? <Navigate to={entry.path} replace /> : <NotFoundPage />;
};
