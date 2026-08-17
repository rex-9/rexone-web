import React from "react";
import { AppLocales, useTranslate } from "../../../locales";
import { Button } from "..";
import AppRoutes from "../../../AppRoutes";
import { useNavigate } from "react-router-dom";

export const SignOutButton: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate();

  const handleSignout = async () => {
    navigate(AppRoutes.client.protected.SIGN_OUT);
  };

  return <Button onClick={handleSignout}>{t(AppLocales.Auth.SignOut)}</Button>;
};
