import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AppRoutes from "../AppRoutes";
import { NotFoundPage } from "../design/pages";
import { usePermissions } from "../hooks";
import { ADMIN_ACTIONS, ADMIN_NAV_ITEMS } from "../modules/admin";
import { AdminLayout } from "../modules/admin/components/AdminLayout";
import type { AdminAction, AdminResource } from "../modules/admin/role";

type TAdminRootRouteProps =
  | {
      action?: never;
      resource?: never;
      superAdminOnly?: boolean;
    }
  | {
      action: AdminAction;
      resource: AdminResource;
      superAdminOnly?: boolean;
    };

export const AdminRootRoute: React.FC<TAdminRootRouteProps> = ({
  action,
  resource,
  superAdminOnly = false,
}) => {
  const location = useLocation();
  const { can, isAdmin, isLoading, isSuperAdmin } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100 text-base-content">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  if (action && resource) {
    const isAllowed = superAdminOnly
      ? isSuperAdmin
      : isAdmin && can(action, resource);

    return isAllowed ? <Outlet /> : <NotFoundPage />;
  }

  const isAllowed = superAdminOnly ? isSuperAdmin : isAdmin;
  if (!isAllowed) {
    return <NotFoundPage />;
  }

  const normalizedPath = location.pathname.replace(/\/+$/, "");
  if (normalizedPath === AppRoutes.client.protected.admin.HOME) {
    const entry = ADMIN_NAV_ITEMS.find((item) =>
      item.superAdminOnly
        ? isSuperAdmin
        : can(item.action ?? ADMIN_ACTIONS.READ, item.resource),
    );

    return (
      <Navigate
        to={entry?.to ?? AppRoutes.client.protected.admin.SETTINGS}
        replace
      />
    );
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};
