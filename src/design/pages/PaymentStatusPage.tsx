import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import type { IOrder } from "../../models";
import {
  clearCheckoutOrder,
  getCheckoutOrderId,
  isTerminalPaymentStatus,
  orderService,
  POLL_INTERVAL_MS,
  POLL_TIMEOUT_MS,
  redirectToCheckout,
  retryOrderCheckout,
} from "../../services";
import { AlertMessage, Button, Typography } from "../molecules";
import LayoutPage from "./LayoutPage";

const PaymentStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCancellation = location.pathname === AppRoutes.client.public.PAYMENT_CANCEL;
  const orderId = useMemo(() => getCheckoutOrderId(window.sessionStorage), []);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return null;
    setError("");
    const response = await orderService.getOrder(orderId, { skipLoading: true });
    const envelope = response.data;
    if (!envelope?.status.success || !envelope.data?.order) {
      throw new Error(envelope?.status.error || response.error || "Unable to load the order.");
    }
    setOrder(envelope.data.order);
    if (envelope.data.order.payment_status === "paid") {
      clearCheckoutOrder(window.sessionStorage);
    }
    return envelope.data.order;
  }, [orderId]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setTimedOut(false);
    startedAt.current = Date.now();
    try {
      await fetchOrder();
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Unable to refresh the order.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchOrder]);

  useEffect(() => {
    if (isCancellation || !orderId) return;
    let active = true;
    startedAt.current = Date.now();

    const poll = async () => {
      try {
        const latest = await fetchOrder();
        if (!active || !latest || isTerminalPaymentStatus(latest.payment_status)) return;
        if (Date.now() - startedAt.current >= POLL_TIMEOUT_MS) {
          setTimedOut(true);
          return;
        }
        timer.current = setTimeout(poll, POLL_INTERVAL_MS);
      } catch (pollError) {
        if (active) setError(pollError instanceof Error ? pollError.message : "Unable to check payment status.");
      }
    };

    void poll();
    return () => {
      active = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [fetchOrder, isCancellation, orderId]);

  const retry = async () => {
    if (!orderId || isRetrying) return;
    setIsRetrying(true);
    setError("");
    try {
      const checkout = await retryOrderCheckout(orderId, window.sessionStorage);
      redirectToCheckout(checkout.checkout_url, window.location.assign.bind(window.location));
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError.message : "Unable to retry payment.");
    } finally {
      setIsRetrying(false);
    }
  };

  const content = (() => {
    if (isCancellation) return ["Payment was not completed", "Your existing order is saved. You can try payment again without creating a new order."];
    if (!orderId) return ["Order not found", "We could not recover the order for this checkout."];
    if (order?.payment_status === "paid") return ["Payment confirmed", "Your payment has been confirmed by the server."];
    if (order?.payment_status === "processing") return ["Payment is processing", "Stripe is processing the payment. This page will keep checking."];
    if (order?.payment_status === "failed") return ["Payment failed", "The payment could not be completed."];
    if (order?.payment_status === "refunded") return ["Payment refunded", "This payment has been refunded."];
    if (order?.payment_status === "partially_refunded") return ["Payment partially refunded", "This payment has been partially refunded."];
    return ["Waiting for payment confirmation", "We are checking the authoritative order status with the server."];
  })();

  return (
    <LayoutPage>
      <section className="w-full max-w-xl px-6 py-12">
        <Typography className="mb-3 text-3xl font-semibold" variant="primary">{content[0]}</Typography>
        <Typography className="mb-6 text-base">{content[1]}</Typography>
        {order?.order_number && <Typography className="mb-4 text-sm opacity-70">Order: {order.order_number}</Typography>}
        {isLoading && <Typography className="mb-4 text-sm opacity-70">Loading latest payment status...</Typography>}
        {timedOut && <AlertMessage message="Confirmation is taking longer than expected. You can refresh the order status manually." type="error" />}
        {error && <AlertMessage message={error} type="error" />}
        <div className="mt-6 flex flex-wrap gap-3">
          {isCancellation && orderId && <Button onClick={retry} disabled={isRetrying}>{isRetrying ? "Redirecting..." : "Try payment again"}</Button>}
          {!isCancellation && timedOut && <Button onClick={refresh} disabled={isLoading}>Refresh status</Button>}
          <Button variant="secondary" onClick={() => navigate(AppRoutes.client.public.ROOT)}>Back to Home</Button>
        </div>
      </section>
    </LayoutPage>
  );
};

export default PaymentStatusPage;
