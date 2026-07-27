import React, { useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { getStripePromise } from "../../../utils";
import AlertMessage from "../AlertMessage";
import Button from "../Button";

interface IPaymentFormInnerProps {
  returnUrl: string;
}

const PaymentFormInner: React.FC<IPaymentFormInnerProps> = ({
  returnUrl,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submitPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!stripe || !elements) {
      setError("Payment form is not ready yet. Please wait a moment.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: returnUrl },
        redirect: "if_required",
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Payment could not be confirmed.",
        );
      }

      window.location.assign(returnUrl);
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "Payment failed. Please verify your details and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitPayment} className="w-full space-y-4">
      {error && <AlertMessage message={error} type="error" />}
      <div className="rounded-md border border-slate-300 bg-white p-4">
        <PaymentElement />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting || !stripe || !elements}
        fullWidth
        className="mt-2 rounded-md bg-[#1f2c6c] text-white hover:bg-[#182257]"
      >
        {isSubmitting ? "Processing..." : "Pay"}
      </Button>
    </form>
  );
};

export interface IPaymentFormProps {
  clientSecret: string;
  returnUrl: string;
  className?: string;
}

const PaymentForm: React.FC<IPaymentFormProps> = ({
  clientSecret,
  returnUrl,
  className,
}) => (
  <div className={className}>
    <Elements
      stripe={getStripePromise()}
      options={{
        clientSecret,
        appearance: { theme: "stripe" },
      }}
    >
      <PaymentFormInner returnUrl={returnUrl} />
    </Elements>
  </div>
);

export default PaymentForm;
