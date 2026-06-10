import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts";
import AppRoutes from "../AppRoutes";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const nextPath = `${location.pathname}${location.search}`;

  return !isAuthenticated ? (
    <Navigate
      to={`${AppRoutes.client.public.SIGN_IN}?next=${encodeURIComponent(nextPath)}`}
      replace
    />
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;
