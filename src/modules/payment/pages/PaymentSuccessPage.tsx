import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";
import { Button } from "../../../design/components/button/Button";
import { ButtonVariants } from "../../../design/constants";
import { LayoutPage } from "../../../design/pages/LayoutPage";
import AppRoutes from "../../../AppRoutes";

export const PaymentSuccessPage: React.FC = () => {
  const { success } = useToast();

  useEffect(() => {
    success("Payment successful! Welcome aboard! 🎉");
  }, [success]);

  return (
    <LayoutPage>
      <div className="max-w-md mx-auto w-full bg-base-100/70 border border-base-300 rounded-2xl p-8 shadow-xl backdrop-blur-md text-center space-y-4">
        <div className="text-5xl">🎉</div>
        <h1 className="text-2xl font-bold font-primary text-base-content">Payment Successful!</h1>
        <p className="text-body-m text-base-content/70">
          Thank you for your purchase. You now have full access.
        </p>
        <div className="pt-2">
          <Link to={AppRoutes.client.protected.HOME} className="block w-full">
            <Button variant={ButtonVariants.PRIMARY} fullWidth>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </LayoutPage>
  );
};
