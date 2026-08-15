import React from "react";
import { Navigate } from "react-router-dom";
import AppRoutes from "../AppRoutes";
import { NotFoundPage } from "../design/pages";
import { usePermissions } from "../hooks";
import { AdminResource } from "../models";

const adminEntryRoutes: Array<{
  action?: "read" | "create";
  resource: AdminResource;
  path: string;
}> = [
  { resource: "users", path: AppRoutes.client.protected.ADMIN_USERS },
  {
    resource: "notifications",
    path: AppRoutes.client.protected.ADMIN_NOTIFICATIONS,
  },
  { resource: "rooms", path: AppRoutes.client.protected.ADMIN_CHAT_ROOMS },
  {
    resource: "messages",
    path: AppRoutes.client.protected.ADMIN_CHAT_MESSAGES,
  },
];

export const AdminHomeRoute: React.FC = () => {
  const { can, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100 text-base-content">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  const entry = adminEntryRoutes.find((item) =>
    can(item.action ?? "read", item.resource),
  );

  return entry ? <Navigate to={entry.path} replace /> : <NotFoundPage />;
};
