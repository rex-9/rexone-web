import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { DialogAuthSteps } from "..";

export const ForgotPasscodePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract email from URL if provided and redirect to auth dialog forgot-passcode step.
    const params = new URLSearchParams(location.search);
    const email = params.get("email");

    if (email) {
      navigate(
        AppRoutes.buildDialogUrl(DialogAuthSteps.FORGOT_PASSCODE, {
          email,
        }),
        { replace: true },
      );
    } else {
      navigate(AppRoutes.buildDialogUrl(DialogAuthSteps.FORGOT_PASSCODE), {
        replace: true,
      });
    }
  }, [navigate, location]);

  return null;
};
