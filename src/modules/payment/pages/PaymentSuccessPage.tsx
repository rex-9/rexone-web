import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";
import { Button } from "../../../design/components/button/Button";
import { ButtonVariants } from "../../../design/constants";
import AppRoutes from "../../../AppRoutes";
import { useTranslate, AppLocales } from "../../../locales";

export const PaymentSuccessPage: React.FC = () => {
  const t = useTranslate();
  const { success } = useToast();

  useEffect(() => {
    success(t(AppLocales.Payment.SuccessDesc));
  }, [success, t]);

  return (
    <div className="max-w-md mx-auto w-full bg-base-100/70 border border-base-300 rounded-2xl p-8 shadow-xl backdrop-blur-md text-center space-y-4">
      <div className="text-5xl">🎉</div>
      <h1 className="text-2xl font-bold font-primary text-base-content">
        {t(AppLocales.Payment.SuccessTitle)}
      </h1>
      <p className="text-body-m text-base-content/70">
        {t(AppLocales.Payment.SuccessDesc)}
      </p>
      <div className="pt-2">
        <Link to={AppRoutes.client.protected.HOME} className="block w-full">
          <Button variant={ButtonVariants.PRIMARY} fullWidth>
            {t(AppLocales.Common.Home)}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
