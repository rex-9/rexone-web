import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";
import { Button } from "../../../design/components/button/Button";
import { ButtonVariants } from "../../../design/constants";
import { PageLayout } from "../../../design/pages/PageLayout";
import AppRoutes from "../../../AppRoutes";

export const PaymentCancelPage: React.FC = () => {
  const { info } = useToast();

  useEffect(() => {
    info("Payment was canceled. You can try again anytime.");
  }, [info]);

  return (
    <PageLayout enableAppServices>
      <div className="max-w-md mx-auto w-full bg-base-100/70 border border-base-300 rounded-2xl p-8 shadow-xl backdrop-blur-md text-center space-y-4">
        <div className="text-5xl">😅</div>
        <h1 className="text-2xl font-bold font-primary text-base-content">Payment Canceled</h1>
        <p className="text-body-m text-base-content/70">
          Your payment was not completed. You can try again anytime.
        </p>
        <div className="pt-2">
          <Link to={AppRoutes.client.protected.PAYMENT} className="block w-full">
            <Button variant={ButtonVariants.PRIMARY} fullWidth>
              Try Again
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};
