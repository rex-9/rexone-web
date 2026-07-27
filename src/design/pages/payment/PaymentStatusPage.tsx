import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import {
  getPaymentOrderId,
  useOrderPaymentStatus,
} from "../../../hooks";
import { AlertMessage, Button, Typography } from "../../molecules";
import LayoutPage from "../LayoutPage";

const PaymentStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId: routeOrderId } = useParams<{ orderId: string }>();
  const orderId = useMemo(
    () => routeOrderId || getPaymentOrderId(window.sessionStorage),
    [routeOrderId],
  );
  const {
    error,
    isLoading,
    order,
    paymentIntentId,
    paymentStatus,
    refresh,
    timedOut,
  } = useOrderPaymentStatus({
    orderId,
    storage: window.sessionStorage,
  });

  const content = (() => {
    if (!orderId || !paymentIntentId) {
      return [
        "Payment not found",
        "We could not recover this payment session.",
      ];
    }
    if (paymentStatus === "succeeded") {
      return [
        "Payment confirmed",
        "Your payment has been confirmed by the server.",
      ];
    }
    if (paymentStatus === "canceled") {
      return ["Payment cancelled", "This payment was cancelled."];
    }
    if (paymentStatus === "requires_payment_method") {
      return [
        "Payment method required",
        "The payment needs a valid payment method.",
      ];
    }
    if (paymentStatus === "requires_action") {
      return [
        "Payment needs attention",
        "Additional payment authentication is required.",
      ];
    }
    return [
      "Payment is processing",
      "We are checking the latest payment status with the server.",
    ];
  })();

  return (
    <LayoutPage>
      <section className="w-full max-w-xl px-6 py-12">
        <Typography
          className="mb-3 text-3xl font-semibold"
          variant="primary"
        >
          {content[0]}
        </Typography>
        <Typography className="mb-6 text-base">{content[1]}</Typography>
        {order?.orderNumber && (
          <Typography className="mb-4 text-sm opacity-70">
            Order: {order.orderNumber}
          </Typography>
        )}
        {isLoading && (
          <Typography className="mb-4 text-sm opacity-70">
            Loading latest payment status...
          </Typography>
        )}
        {timedOut && (
          <AlertMessage
            message="Confirmation is taking longer than expected. You can refresh the status manually."
            type="error"
          />
        )}
        {error && <AlertMessage message={error} type="error" />}
        <div className="mt-6 flex flex-wrap gap-3">
          {timedOut && (
            <Button onClick={() => void refresh()} disabled={isLoading}>
              Refresh status
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => navigate(AppRoutes.client.public.ROOT)}
          >
            Back to Home
          </Button>
        </div>
      </section>
    </LayoutPage>
  );
};

export default PaymentStatusPage;
