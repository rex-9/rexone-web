// src/modules/payment/constants.ts

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  PAST_DUE: "past_due",
  CANCELED: "canceled",
  ENDED: "ended",
  EXPIRED: "expired",
} as const;

export type TSubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export const TRANSACTION_STATUS = {
  PAID: "paid",
  REFUNDED: "refunded",
  FAILED: "failed",
  PENDING: "pending",
  REQUIRES_ACTION: "requires_action",
  CANCELED: "canceled",
} as const;

export type TTransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];

export const PAYMENT_MODES = {
  SUBSCRIPTION: "subscription",
  PAYMENT: "payment",
} as const;

export type TPaymentMode = (typeof PAYMENT_MODES)[keyof typeof PAYMENT_MODES];
