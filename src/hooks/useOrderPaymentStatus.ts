import { useCallback, useEffect, useRef, useState } from "react";
import type {
  IOrder,
  PaymentIntentStatus,
} from "../models";
import { orderService, paymentService } from "../services";
import {
  clearPaymentSession,
  getPaymentIntentId,
} from "./useOrderPayment";

export const POLL_INTERVAL_MS = 2_000;
export const POLL_TIMEOUT_MS = 60_000;

export const isTerminalPaymentStatus = (status: PaymentIntentStatus) =>
  ["succeeded", "canceled"].includes(status);

export const useOrderPaymentStatus = ({
  orderId,
  storage,
}: {
  orderId: string;
  storage: Storage;
}) => {
  const [paymentIntentId] = useState(() =>
    getPaymentIntentId(storage, orderId),
  );
  const [order, setOrder] = useState<IOrder | null>(null);
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentIntentStatus | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!orderId || !paymentIntentId) return null;
    setError("");

    const [orderResponse, statusResponse] = await Promise.all([
      orderService.getOrder(orderId, { skipLoading: true }),
      paymentService.getPaymentStatus(paymentIntentId),
    ]);
    const latestOrder = orderResponse.data?.data;
    const latestPayment = statusResponse.data?.data;

    if (!orderResponse.data?.status.success || !latestOrder) {
      throw new Error(
        orderResponse.data?.status.error ||
          orderResponse.error ||
          "Unable to load the order.",
      );
    }
    if (!statusResponse.data?.status.success || !latestPayment) {
      throw new Error(
        statusResponse.data?.status.error ||
          statusResponse.error ||
          "Unable to load payment status.",
      );
    }

    setOrder(latestOrder);
    setPaymentStatus(latestPayment.status);
    if (latestPayment.status === "succeeded") {
      clearPaymentSession(storage, orderId);
    }
    return latestPayment.status;
  }, [orderId, paymentIntentId, storage]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setTimedOut(false);
    startedAt.current = Date.now();
    try {
      await fetchStatus();
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Unable to refresh payment status.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatus]);

  useEffect(() => {
    if (!orderId || !paymentIntentId) return;
    let active = true;
    startedAt.current = Date.now();

    const poll = async () => {
      try {
        const latest = await fetchStatus();
        if (!active || !latest || isTerminalPaymentStatus(latest)) return;
        if (Date.now() - startedAt.current >= POLL_TIMEOUT_MS) {
          setTimedOut(true);
          return;
        }
        timer.current = setTimeout(poll, POLL_INTERVAL_MS);
      } catch (pollError) {
        if (active) {
          setError(
            pollError instanceof Error
              ? pollError.message
              : "Unable to check payment status.",
          );
        }
      }
    };

    void poll();
    return () => {
      active = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [fetchStatus, orderId, paymentIntentId]);

  return {
    error,
    isLoading,
    order,
    paymentIntentId,
    paymentStatus,
    refresh,
    timedOut,
  };
};
