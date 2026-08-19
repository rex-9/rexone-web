import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { LayoutPage } from "../../../design/pages";

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home with dialog=auth param
    navigate(AppRoutes.client.public.SIGN_IN, {
      replace: true,
    });
  }, [navigate]);

  return (
    <LayoutPage>
      <div />
    </LayoutPage>
  );
};
