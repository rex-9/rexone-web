import React, { useRef, useState } from "react";
import AppConfig from "../../../AppConfig";
import {
  claimCheckoutSubmission,
  redirectToCheckout,
  startNewOrderCheckout,
} from "../../../services";
import AlertMessage from "../AlertMessage";
import Button from "../Button";

export interface CheckoutButtonProps {
  priceId?: string;
  quantity?: number;
  className?: string;
  disabled?: boolean;
  buttonLabel?: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  priceId = AppConfig.STRIPE_PRICE_ID,
  quantity = 1,
  className,
  disabled = false,
  buttonLabel = "Pay Now",
}) => {
  const submittingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onClick = async () => {
    // The ref closes the gap before React commits the disabled state.
    if (disabled || !claimCheckoutSubmission(submittingRef)) return;
    setIsLoading(true);
    setError("");

    try {
      if (!priceId) throw new Error("Stripe Price ID is not configured.");
      const checkout = await startNewOrderCheckout(
        priceId,
        quantity,
        window.sessionStorage,
      );
      redirectToCheckout(checkout.checkout_url, window.location.assign.bind(window.location));
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start checkout. Please try again.",
      );
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      {error && <AlertMessage message={error} type="error" />}
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        fullWidth
        className="mt-2 rounded-md bg-[#1f2c6c] text-white hover:bg-[#182257]"
      >
        {isLoading ? "Redirecting to Stripe..." : buttonLabel}
      </Button>
    </div>
  );
};

export default CheckoutButton;
