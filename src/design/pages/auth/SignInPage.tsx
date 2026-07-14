// src/design/pages/auth/SignIn.tsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutPage } from "../LayoutPage";
import AppRoutes from "../../../AppRoutes";

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(AppRoutes.buildDialogUrl(AppRoutes.dialog.steps.initial), {
      replace: true,
    });
  }, [navigate]);

  return (
    <LayoutPage>
      <div />
    </LayoutPage>
  );
};
