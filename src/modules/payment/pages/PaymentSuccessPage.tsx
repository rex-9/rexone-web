import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";
import { Button } from "../../../design/components/button/Button";
import { ButtonVariants } from "../../../design/constants";
import AppRoutes from "../../../AppRoutes";
import { useTranslate, AppLocales } from "../../../locales";
import { PaymentController } from "..";

export const PaymentSuccessPage: React.FC = () => {
  const t = useTranslate();
  const { success } = useToast();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(!!sessionId);

  useEffect(() => {
    let active = true;
    if (sessionId) {
      void PaymentController.getSessionStatus(sessionId).then(() => {
        if (active) {
          setVerifying(false);
          success(t(AppLocales.Payment.SuccessDesc));
        }
      });
    } else {
      success(t(AppLocales.Payment.SuccessDesc));
    }

    return () => {
      active = false;
    };
  }, [sessionId, success, t]);

  return (
    <div className="max-w-md mx-auto w-full bg-base-100/70 border border-base-300 rounded-2xl p-8 shadow-xl backdrop-blur-md text-center space-y-4">
      <div className="text-5xl">🎉</div>
      <h1 className="text-2xl font-bold font-primary text-base-content">
        {t(AppLocales.Payment.SuccessTitle)}
      </h1>
      <p className="text-body-m text-base-content/70">
        {verifying
          ? "Confirming your subscription and activating your access..."
          : t(AppLocales.Payment.SuccessDesc)}
      </p>
      <div className="pt-2">
        <Link to={AppRoutes.client.protected.HOME} className="block w-full">
          <Button variant={ButtonVariants.PRIMARY} fullWidth disabled={verifying}>
            {t(AppLocales.Common.Home)}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
