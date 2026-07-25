// src/design/pages/auth/ConfirmEmail.tsx

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, useToast } from "../../../contexts";
import { authController } from "../../../controllers";
import AppRoutes from "../../../AppRoutes";

export const ConfirmEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signin } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authToken = params.get("auth_token");
    const error = params.get("error");
    const email = params.get("email") || params.get("signin_key");

    // Handle auth_token from email confirmation link
    if (authToken) {
      authController.signInWithToken(
        authToken,
        () => {},
        (token, user) => {
          signin(token, user);
          success("Email confirmed successfully!");
          navigate(AppRoutes.client.protected.HOME, { replace: true });
        },
        (errorMsg) => {
          console.error("error", `Confirmation failed: ${errorMsg}`);
          const url = AppRoutes.client.public.SIGN_IN;
          navigate(url, { replace: true });
        },
      );
      return;
    }

    // Handle error from confirmation link
    if (error) {
      console.error("error", `Confirmation failed: ${error}`);
      const url = AppRoutes.client.public.SIGN_IN;
      navigate(url, { replace: true });
      return;
    }

    // If email is provided, open verify email dialog
    if (email) {
      navigate(
        AppRoutes.buildDialogUrl(AppRoutes.dialog.steps.confirmEmail, {
          email,
        }),
        { replace: true },
      );
      return;
    }

    // Fallback: go to initial auth dialog
    const url = AppRoutes.client.public.SIGN_IN;
    navigate(url, { replace: true });
  }, [navigate, location, signin]);

  return null;
};
