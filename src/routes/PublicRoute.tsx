import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts";
import AppRoutes from "../AppRoutes";
import { PageLayout } from "../design/pages";

export const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Navigate to={AppRoutes.client.protected.HOME} />
  ) : (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
};
