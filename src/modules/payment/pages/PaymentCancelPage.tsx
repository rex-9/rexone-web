import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";
import { Button } from "../../../design/components/button/Button";
import { PageLayout } from "../../../design/pages";

export const PaymentCancelPage: React.FC = () => {
  const { info } = useToast();

  useEffect(() => {
    info("Payment was canceled. You can try again anytime.");
  }, [info]);

  return (
    <PageLayout>
      <div className="text-display-xl text-center">😅</div>
      <h1 className="text-h1 font-semibold text-center">Payment Canceled</h1>
      <p className="text-body-m text-base-content/70 text-center">
        Your payment was not completed. You can try again anytime.
      </p>
      <Link to="/payment" className="w-full">
        <Button variant="primary" fullWidth>
          Try Again
        </Button>
      </Link>
    </PageLayout>
  );
};
