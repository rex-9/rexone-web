import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { DialogAuthSteps } from "..";

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(AppRoutes.buildDialogUrl(DialogAuthSteps.INITIAL), {
      replace: true,
    });
  }, [navigate]);

  return <div />;
};

export default SignInPage;
