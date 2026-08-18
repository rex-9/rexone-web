import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../components/button/Button";
import { LayoutPage } from "./LayoutPage";

export const PaymentSuccessPage: React.FC = () => {
  const { success } = useToast();

  useEffect(() => {
    success("Payment successful! Welcome aboard! 🎉");
  }, [success]);

  return (
    <LayoutPage>
      <div className="text-display-xl text-center">🎉</div>
      <h1 className="text-h1 font-semibold text-center">Payment Successful!</h1>
      <p className="text-body-m text-base-content/70 text-center">
        Thank you for your purchase. You now have full access.
      </p>
      <Link to="/home" className="w-full">
        <Button variant="primary" fullWidth>
          Go to Dashboard
        </Button>
      </Link>
    </LayoutPage>
  );
};
