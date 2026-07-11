import React from "react";
import { AppLocales } from "../../locales/app_locales";
import { Button } from ".";
import { useTranslation } from "react-i18next";
import AppRoutes from "../../AppRoutes";
import { useNavigate } from "react-router-dom";

export const SignOutBtn: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignout = async () => {
    navigate(AppRoutes.client.protected.SIGN_OUT);
  };

  return <Button onClick={handleSignout}>{t(AppLocales.SignOutButton)}</Button>;
};

export default SignOutBtn;
