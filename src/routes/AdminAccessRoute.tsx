import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts";
import { NotFoundPage } from "../design/pages";
import { usePermissions } from "../hooks";
import { AdminAction, AdminResource, hasAdminRole } from "../models";

interface AdminAccessRouteProps {
  action: AdminAction;
  resource: AdminResource;
  superAdminOnly?: boolean;
}

export const AdminAccessRoute: React.FC<AdminAccessRouteProps> = ({
  action,
  resource,
  superAdminOnly = false,
}) => {
  const { currentUser } = useAuth();
  const { can, isLoading } = usePermissions();
  const hasAdminAccess = hasAdminRole(currentUser?.role_names);
  const isSuperAdmin = currentUser?.role_names?.includes("super_admin") ?? false;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100 text-base-content">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  if (superAdminOnly) {
    return isSuperAdmin ? <Outlet /> : <NotFoundPage />;
  }

  return hasAdminAccess && can(action, resource) ? <Outlet /> : <NotFoundPage />;
};
