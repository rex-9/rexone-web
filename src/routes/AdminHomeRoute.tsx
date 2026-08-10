import React from "react";
import { Navigate } from "react-router-dom";
import AppRoutes from "../AppRoutes";
import { NotFoundPage } from "../design/pages";
import { usePermissions } from "../hooks";
import { AdminResource } from "../models";

const adminEntryRoutes: Array<{ resource: AdminResource; path: string }> = [
  { resource: "users", path: AppRoutes.client.protected.ADMIN_USERS },
  { resource: "chat_rooms", path: AppRoutes.client.protected.ADMIN_CHAT_ROOMS },
  {
    resource: "chat_messages",
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

  const entry = adminEntryRoutes.find((item) => can("read", item.resource));

  return entry ? <Navigate to={entry.path} replace /> : <NotFoundPage />;
};
