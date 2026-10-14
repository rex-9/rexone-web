import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";
import { googleLogout } from "@react-oauth/google";
import { AuthController } from "../../../modules/auth";
import { AnalyticsService } from "../../../services";
import AppRoutes from "../../../AppRoutes";

let isSignOutInProgress = false;

export const SignOutPage: React.FC = () => {
  const { signout, currentUser, token } = useAuth();
  const navigate = useNavigate();

  const handleSignout = React.useCallback(async () => {
    try {
      await AnalyticsService.logSignOut();
      if (token) {
        await AuthController.signOut();
      }

      if (currentUser?.provider === "google") {
        googleLogout();
      }
    } finally {
      signout();
      navigate(AppRoutes.client.public.ROOT, { replace: true });
    }
  }, [token, currentUser, signout, navigate]);

  useEffect(() => {
    if (isSignOutInProgress) return;

    isSignOutInProgress = true;
    void handleSignout().finally(() => {
      isSignOutInProgress = false;
    });
  }, [handleSignout]);

  return null; // No UI
};
