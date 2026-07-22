import type { OrderPaymentStatus } from "../models";

export const POLL_INTERVAL_MS = 2_000;
export const POLL_TIMEOUT_MS = 60_000;

export const isTerminalPaymentStatus = (status: OrderPaymentStatus) =>
  ["paid", "failed", "partially_refunded", "refunded"].includes(status);
