import React, { useEffect } from "react";
import { useAuth } from "../../../contexts";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { AuthController } from "../../../modules/auth";

let isSignOutInProgress = false;

export const SignOutPage: React.FC = () => {
  const { signout, currentUser, token } = useAuth();
  const navigate = useNavigate();

  const handleSignout = React.useCallback(async () => {
    if (token) {
      await AuthController.signOut();
    }

    if (currentUser?.provider === "google") {
      googleLogout();
    }

    signout();
  }, [token, currentUser, signout]);

  useEffect(() => {
    if (isSignOutInProgress) return;

    isSignOutInProgress = true;
    void handleSignout().finally(() => {
      isSignOutInProgress = false;
    });
  }, [handleSignout]);

  return null; // No UI
};
