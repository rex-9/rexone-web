import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { DialogAuthSteps } from "..";

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract email from URL if provided and redirect to auth dialog forgot-password step.
    const params = new URLSearchParams(location.search);
    const email = params.get("email");

    if (email) {
      navigate(
        AppRoutes.buildDialogUrl(DialogAuthSteps.FORGOT_PASSWORD, {
          email,
        }),
        { replace: true },
      );
    } else {
      navigate(AppRoutes.buildDialogUrl(DialogAuthSteps.FORGOT_PASSWORD), {
        replace: true,
      });
    }
  }, [navigate, location]);

  return null;
};

