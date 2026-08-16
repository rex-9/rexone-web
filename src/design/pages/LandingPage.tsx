import React from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { AppLocales, useTranslate } from "../../locales";
import { Button, SignOutButton } from "../";
import { useAuth } from "../../contexts";

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const t = useTranslate();

  return (
    <>
      Landing Page
      <div className="w-48 flex flex-col justify-center items-center">
        {isAuthenticated ? (
          <SignOutButton />
        ) : (
          <Button
            variant="primary"
            onClick={() => navigate(AppRoutes.client.public.SIGN_IN)}
          >
            {t(AppLocales.Auth.SignInPasscode.SignIn)}
          </Button>
        )}
      </div>
    </>
  );
};
