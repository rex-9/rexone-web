import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppRoutes from "../../AppRoutes";
import { AppLocales } from "../../locales/app_locales";
import { Button, SignOutButton } from "../";
import { useAuth } from "../../contexts";

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            {t(AppLocales.SignInButton)}
          </Button>
        )}
      </div>
    </>
  );
};

export default LandingPage;
