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

  const handleSignout = async () => {
    if (token) {
      await AuthController.signOut();
    }

    if (currentUser?.provider === "google") {
      googleLogout();
    }

    signout();
    navigate(AppRoutes.client.public.ROOT, { replace: true });
    console.log("logged out successfully.");
  };

  useEffect(() => {
    if (isSignOutInProgress) return;

    isSignOutInProgress = true;
    void handleSignout().finally(() => {
      isSignOutInProgress = false;
    });
  }, []);

  return null; // No UI
};
