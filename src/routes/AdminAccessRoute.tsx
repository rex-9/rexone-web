import React from "react";
import { Outlet } from "react-router-dom";
import { NotFoundPage } from "../design/pages";
import { usePermissions } from "../hooks";
import { AdminAction, AdminResource } from "../models";

interface AdminAccessRouteProps {
  action: AdminAction;
  resource: AdminResource;
}

export const AdminAccessRoute: React.FC<AdminAccessRouteProps> = ({
  action,
  resource,
}) => {
  const { can, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100 text-base-content">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  return can(action, resource) ? <Outlet /> : <NotFoundPage />;
};
