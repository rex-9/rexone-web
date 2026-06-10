import React, { useMemo, useState } from "react";
import AppConfig from "../../../AppConfig";
import AppRoutes from "../../../AppRoutes";
import { paymentService } from "../../../services";
import AlertMessage from "../AlertMessage";
import Button from "../Button";

export interface CheckoutButtonProps {
  productId?: string;
  priceId?: string;
  quantity?: number;
  className?: string;
  buttonClassName?: string;
  buttonVariant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  buttonLabel?: string;
  onCheckoutStarted?: () => void;
  onCheckoutComplete?: () => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  productId = AppConfig.STRIPE_PRODUCT_ID,
  priceId = AppConfig.STRIPE_PRICE_ID,
  quantity = 1,
  className,
  buttonClassName,
  buttonVariant = "primary",
  disabled = false,
  buttonLabel = "Pay Now",
  onCheckoutStarted,
  onCheckoutComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const checkoutUrls = useMemo(() => {
    const base = AppConfig.CLIENT_BASE_URL;
    return {
      successUrl: `${base}${AppRoutes.client.public.PAYMENT_SUCCESS}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${base}${AppRoutes.client.public.PAYMENT_CANCEL}`,
    };
  }, []);

  const onClick = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    setError("");
    onCheckoutStarted?.();

    try {
      const response = await paymentService.createCheckoutSession({
        product_id: productId,
        price_id: priceId,
        quantity,
        mode: "payment",
        success_url: checkoutUrls.successUrl,
        cancel_url: checkoutUrls.cancelUrl,
      });

      const status = response.data?.status;
      const payload = response.data?.data;
      const checkoutUrl =
        payload?.checkoutUrl || payload?.checkout_url || payload?.url;

      if (!status?.success) {
        throw new Error(status?.error || response.error || "Unable to start checkout.");
      }

      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }

      throw new Error(
        "Checkout session created without checkout URL. Please verify backend response includes checkout_url.",
      );
    } catch (checkoutError) {
      const message =
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to process payment right now. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
      onCheckoutComplete?.();
    }
  };

  return (
    <div className={className}>
      {error && <AlertMessage message={error} type="error" />}
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        fullWidth
        variant={buttonVariant}
        className={buttonClassName}
      >
        {isLoading ? "Redirecting..." : buttonLabel}
      </Button>
    </div>
  );
};

export default CheckoutButton;
