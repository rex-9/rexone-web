import React from "react";
import { Navigate } from "react-router-dom";
import { NotFoundPage } from "../design/pages";
import { usePermissions } from "../hooks";
import { ADMIN_ACTIONS, ADMIN_NAV_ITEMS } from "../modules/admin";

export const AdminHomeRoute: React.FC = () => {
  const { can, isAdmin, isLoading, isSuperAdmin } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100 text-base-content">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  const entry = isAdmin
    ? ADMIN_NAV_ITEMS.find((item) =>
        item.superAdminOnly
          ? isSuperAdmin
          : can(item.action ?? ADMIN_ACTIONS.READ, item.resource),
      )
    : null;

  return entry ? <Navigate to={entry.to} replace /> : <NotFoundPage />;
};
