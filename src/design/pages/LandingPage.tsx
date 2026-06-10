import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppRoutes from "../../AppRoutes";
import { AppLocales } from "../../locales/app_locales";
import { Button, SignOutBtn } from "../";
import { useAuth } from "../../contexts";

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      Landing Page
      <div className="w-48 flex flex-col justify-center items-center">
        <Button
          variant="secondary"
          className="mb-3"
          onClick={() =>
            navigate(
              isAuthenticated
                ? AppRoutes.client.public.PAYMENT
                : `${AppRoutes.client.public.SIGN_IN}?next=${encodeURIComponent(
                    AppRoutes.client.public.PAYMENT,
                  )}`,
            )
          }
        >
          Pay Now
        </Button>
        {isAuthenticated ? (
          <SignOutBtn />
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
