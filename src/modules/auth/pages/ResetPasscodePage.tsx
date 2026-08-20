import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { DialogAuthSteps } from "..";

export const ResetPasscodePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("reset_password_token");
    const email = params.get("email");
    const error = params.get("error");

    // If there's an error, show it in the auth dialog
    if (error) {
      navigate(
        AppRoutes.buildDialogUrl(DialogAuthSteps.INITIAL, {
          error,
        }),
        { replace: true },
      );
      return;
    }

    // If token is missing, go back to forgot password
    if (!token) {
      navigate(AppRoutes.buildDialogUrl(DialogAuthSteps.FORGOT_PASSCODE), {
        replace: true,
      });
      return;
    }

    // If token exists, go to create passcode (reset password)
    navigate(
      AppRoutes.buildDialogUrl(DialogAuthSteps.SIGNUP_PASSCODE_CREATE, {
        reset_password_token: token,
        email: email || "",
      }),
      { replace: true },
    );
  }, [navigate, location.search]);

  return null;
};
