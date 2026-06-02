import React, { useEffect } from "react";
import { useAuth } from "../../../contexts";
import { googleLogout } from "@react-oauth/google";
import authController from "../../../controllers/auth.controller";

let isSignOutInProgress = false;

const SignOut: React.FC = () => {
  const { signout, currentUser, token } = useAuth();

  const handleSignout = async () => {
    if (token) {
      await authController.signOut();
    }

    if (currentUser?.provider === "google") {
      googleLogout();
    }

    signout();
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

export default SignOut;
