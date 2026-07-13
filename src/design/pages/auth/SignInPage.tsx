// src/design/pages/auth/SignIn.tsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutPage } from "../LayoutPage";
import AppRoutes from "../../../AppRoutes";

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = AppRoutes.buildDialogUrl(AppRoutes.dialog.steps.initial);
    navigate(url, { replace: true });
  }, [navigate]);

  return (
    <LayoutPage>
      <div />
    </LayoutPage>
  );
};
