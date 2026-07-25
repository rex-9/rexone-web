import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../components/button/Button";
import { LayoutPage } from "./LayoutPage";

export const PaymentSuccessPage: React.FC = () => {
  const { success } = useToast();

  useEffect(() => {
    success("Payment successful! Welcome aboard! 🎉");
  }, []);

  return (
    <LayoutPage>
      <div className="text-6xl">🎉</div>
      <h1 className="text-3xl font-bold">Payment Successful!</h1>
      <p className="text-gray-500">
        Thank you for your purchase. You now have full access.
      </p>
      <Link to="/home">
        <Button variant="primary" fullWidth>
          Go to Dashboard
        </Button>
      </Link>
    </LayoutPage>
  );
};
