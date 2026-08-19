import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";

export const ForgotPasscodePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract email from URL if provided and redirect to auth dialog forgot-passcode step.
    const params = new URLSearchParams(location.search);
    const email = params.get("email");

    if (email) {
      navigate(
        AppRoutes.buildDialogUrl(AppRoutes.dialog.steps.forgotPasscode, {
          email,
        }),
        { replace: true },
      );
    } else {
      navigate(
        AppRoutes.buildDialogUrl(AppRoutes.dialog.steps.forgotPasscode),
        { replace: true },
      );
    }
  }, [navigate, location]);

  return null;
};
