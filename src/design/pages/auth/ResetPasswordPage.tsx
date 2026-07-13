import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("reset_password_token");
    const email = params.get("email");
    const error = params.get("error");

    // If there's an error, show it in the auth dialog
    if (error) {
      const url = AppRoutes.buildDialogUrl(AppRoutes.dialog.steps.initial, {
        error,
      });
      navigate(url, { replace: true });
      return;
    }

    // If token is missing, go back to forgot password
    if (!token) {
      const url = AppRoutes.buildDialogUrl(
        AppRoutes.dialog.steps.forgotPassword,
      );
      navigate(url, { replace: true });
      return;
    }

    // If token exists, go to create passcode (reset password)
    const url = AppRoutes.buildDialogUrl(
      AppRoutes.dialog.steps.signupPasscodeCreate,
      { reset_password_token: token, email: email || "" },
    );
    navigate(url, { replace: true });
  }, [navigate, location.search]);

  return null;
};
