// src/modules/payment/constants.ts

export const SUBSCRIPTION_STATUS = {
  INCOMPLETE: "incomplete",
  ACTIVE: "active",
  PAST_DUE: "past_due",
  CANCELED: "canceled",
  INCOMPLETE_EXPIRED: "incomplete_expired",
  UNPAID: "unpaid",
  TRIALING: "trialing",
  PAUSED: "paused",
} as const;

export type TSubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export const TRANSACTION_STATUS = {
  SUCCEEDED: "succeeded",
  PROCESSING: "processing",
  REQUIRES_ACTION: "requires_action",
  REQUIRES_CAPTURE: "requires_capture",
  REQUIRES_CONFIRMATION: "requires_confirmation",
  REQUIRES_PAYMENT_METHOD: "requires_payment_method",
  CANCELED: "canceled",
} as const;

export type TTransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];

export const PAYMENT_MODES = {
  SUBSCRIPTION: "subscription",
  PAYMENT: "payment",
} as const;

export type TPaymentMode = (typeof PAYMENT_MODES)[keyof typeof PAYMENT_MODES];

export const BILLING_INTERVALS = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
} as const;

export type TBillingInterval =
  (typeof BILLING_INTERVALS)[keyof typeof BILLING_INTERVALS];

export const ACCESS_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  REVOKED: "revoked",
} as const;

export type TAccessStatus = (typeof ACCESS_STATUS)[keyof typeof ACCESS_STATUS];

export const PAYMENT_CURRENCIES = {
  USD: "usd",
  MMK: "mmk",
  SGD: "sgd",
} as const;

export type TPaymentCurrency =
  (typeof PAYMENT_CURRENCIES)[keyof typeof PAYMENT_CURRENCIES];

export const PAYMENT_CURRENCY_OPTIONS = [
  { value: PAYMENT_CURRENCIES.USD, label: "USD ($)" },
  { value: PAYMENT_CURRENCIES.MMK, label: "MMK (Ks)" },
  { value: PAYMENT_CURRENCIES.SGD, label: "SGD ($)" },
] as const;

export const COUPON_TYPES = {
  PERCENTAGE: "percentage",
  FIXED: "fixed",
} as const;

export type TCouponType = (typeof COUPON_TYPES)[keyof typeof COUPON_TYPES];

export const MAX_PERCENTAGE_DISCOUNT = 100;

export const COUPON_SYNC_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
} as const;

export type TCouponSyncStatus =
  (typeof COUPON_SYNC_STATUS)[keyof typeof COUPON_SYNC_STATUS];

export const COUPON_METADATA_KEYS = {
  STATUS: "status",
  SYNC_ERROR: "sync_error",
  SYNCED_AT: "synced_at",
  FAILED_AT: "failed_at",
} as const;

/**
 * Official Stripe minimum charge amounts in minor currency units
 * Reference: https://docs.stripe.com/currencies#minimum-and-maximum-charge-amounts
 */
export const STRIPE_MINIMUM_AMOUNTS: Record<string, number> = {
  usd: 50, // $0.50 USD
  sgd: 50, // $0.50 SGD
  eur: 50, // €0.50 EUR
  gbp: 30, // £0.30 GBP
  aud: 50, // $0.50 AUD
  cad: 50, // $0.50 CAD
  chf: 50, // 0.50 CHF
  jpy: 50, // ¥50 JPY
  hkd: 400, // $4.00 HKD
  myr: 200, // 2.00 MYR
  thb: 1000, // 10.00 THB
  nzd: 50, // $0.50 NZD
  sek: 300, // 3.00 SEK
  nok: 300, // 3.00 NOK
  dkk: 250, // 2.50 DKK
  pln: 200, // 2.00 PLN
  inr: 50, // ₹0.50 INR
  brl: 50, // R$0.50 BRL
  mxn: 1000, // $10.00 MXN
  aed: 200, // 2.00 AED
  czk: 1500, // 15.00 CZK
  huf: 17500, // 175.00 HUF
  ron: 200, // 2.00 RON
  bgn: 100, // 1.00 BGN
  mmk: 50, // Fallback
};

export const getStripeMinimumAmount = (currency?: string): number => {
  if (!currency) return 50;
  return STRIPE_MINIMUM_AMOUNTS[currency.toLowerCase()] ?? 50;
};

