import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts";
import AppRoutes from "../AppRoutes";
import { PageLayout } from "../design/pages";
import { useSocket } from "../hooks/useSocket";
import { NotificationBell } from "../modules/notification";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { notifications } = useSocket();

  if (!isAuthenticated) {
    return <Navigate to={AppRoutes.client.public.ROOT} replace />;
  }

  const isAdminPath = location.pathname.startsWith(
    AppRoutes.client.protected.admin.HOME,
  );
  const notificationSlot = (
    <NotificationBell liveNotifications={notifications} />
  );

  return (
    <PageLayout isAdmin={isAdminPath} notificationSlot={notificationSlot}>
      <Outlet />
    </PageLayout>
  );
};

export default ProtectedRoute;
