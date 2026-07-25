import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../components/button/Button";
import { LayoutPage } from "./LayoutPage";

export const PaymentCancelPage: React.FC = () => {
  const { info } = useToast();

  useEffect(() => {
    info("Payment was canceled. You can try again anytime.");
  }, []);

  return (
    <LayoutPage>
      <div className="text-6xl">😅</div>
      <h1 className="text-3xl font-bold">Payment Canceled</h1>
      <p className="text-gray-500">
        Your payment was not completed. You can try again anytime.
      </p>
      <Link to="/payment">
        <Button variant="primary" fullWidth>
          Try Again
        </Button>
      </Link>
    </LayoutPage>
  );
};
