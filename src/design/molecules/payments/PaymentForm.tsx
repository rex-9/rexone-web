import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import AppConfig from "../../../AppConfig";
import AppRoutes from "../../../AppRoutes";
import {
  getStripe,
  getStripePublishableKey,
  paymentService,
} from "../../../services";
import { useAuth } from "../../../contexts";
import AlertMessage from "../AlertMessage";
import Button from "../Button";

const stripePromise = getStripe();

interface PaymentFormInnerProps {
  returnUrl: string;
}

const PaymentFormInner: React.FC<PaymentFormInnerProps> = ({ returnUrl }) => {
  const navigate = useNavigate();
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
        confirmParams: {
          return_url: returnUrl,
        },
        redirect: "if_required",
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment could not be confirmed.");
      }

      const intentStatus = result.paymentIntent?.status;
      const paymentIntentId = result.paymentIntent?.id;

      if (intentStatus === "succeeded") {
        const query = paymentIntentId ? `?payment_intent=${paymentIntentId}` : "";
        navigate(`${AppRoutes.client.public.PAYMENT_SUCCESS}${query}`);
        return;
      }

      if (intentStatus === "processing") {
        const query = paymentIntentId ? `?payment_intent=${paymentIntentId}` : "";
        navigate(`${AppRoutes.client.public.PAYMENT_STATUS}${query}`);
        return;
      }

      navigate(AppRoutes.client.public.PAYMENT_ERROR);
    } catch (paymentError) {
      const message =
        paymentError instanceof Error
          ? paymentError.message
          : "Payment failed. Please verify your details and try again.";
      setError(message);
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
        disabled={isSubmitting || !stripe}
        fullWidth
        className="mt-2 rounded-md bg-[#1f2c6c] text-white hover:bg-[#182257]"
      >
        {isSubmitting ? "Processing..." : "Pay"}
      </Button>
    </form>
  );
};

export interface PaymentFormProps {
  amount?: number;
  currency?: string;
  productId?: string;
  priceId?: string;
  quantity?: number;
  className?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency = "usd",
  productId = AppConfig.STRIPE_PRODUCT_ID,
  priceId = AppConfig.STRIPE_PRICE_ID,
  quantity = 1,
  className,
}) => {
  const { isAuthenticated } = useAuth();
  const [isPreparing, setIsPreparing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    setClientSecret("");
    setError("");
    setIsInitialized(false);
    setIsPreparing(false);
  }, [amount, currency, isAuthenticated, priceId, productId, quantity]);

  const initializePaymentIntent = async () => {
    if (isPreparing || isInitialized || !isAuthenticated) return;

    const publishableKey = getStripePublishableKey();
    if (!publishableKey) {
      setError("Stripe is not configured. Missing publishable key.");
      return;
    }

    setError("");
    setIsPreparing(true);

    try {
      const response = await paymentService.createPaymentIntent({
        amount,
        currency,
        product_id: productId,
        price_id: priceId,
        quantity,
        payment_method_type: "card",
      });

      const status = response.data?.status;
      const payload = response.data?.data;
      const secret = payload?.clientSecret || payload?.client_secret;

      if (status?.code === 401) {
        throw new Error("Your session is unauthorized. Please sign in again.");
      }

      if (!status?.success || !secret) {
        throw new Error(
          status?.error || response.error || "Unable to initialize payment.",
        );
      }

      setClientSecret(secret);
      setIsInitialized(true);
    } catch (initError) {
      const errorMessage =
        initError instanceof Error
          ? initError.message
          : "Unable to start payment. Please try again.";

      const normalized = errorMessage.toLowerCase();
      if (
        normalized.includes("network error") ||
        normalized.includes("err_connection_refused")
      ) {
        setError(
          "Payment server is unavailable. Ensure backend is running at VITE_REACT_APP_SERVER_BASE_URL.",
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsPreparing(false);
    }
  };

  const returnUrl = useMemo(
    () => `${AppConfig.CLIENT_BASE_URL}${AppRoutes.client.public.PAYMENT_STATUS}`,
    [],
  );

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "stripe" as const,
      },
    }),
    [clientSecret],
  );

  if (isPreparing) {
    return <p className="text-sm text-slate-600">Preparing secure payment form...</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-4 max-w-md">
        <AlertMessage
          message="You need to sign in or sign up before continuing."
          type="error"
          className="max-w-md"
        />
        <Button
          fullWidth
          onClick={() => {
            window.location.assign(
              `${AppRoutes.client.public.SIGN_IN}?next=${encodeURIComponent(
                AppRoutes.client.public.PAYMENT,
              )}`,
            );
          }}
        >
          Sign in to continue
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 max-w-md">
        <AlertMessage message={error} type="error" className="max-w-md" />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="space-y-4 max-w-md">
        <Button onClick={initializePaymentIntent} fullWidth disabled={isPreparing}>
          {isPreparing ? "Preparing..." : "Start secure payment"}
        </Button>
        <p className="text-xs text-slate-500">
          No payment intent is created until you click this button.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Elements stripe={stripePromise} options={options}>
        <PaymentFormInner returnUrl={returnUrl} />
      </Elements>
    </div>
  );
};

export default PaymentForm;
