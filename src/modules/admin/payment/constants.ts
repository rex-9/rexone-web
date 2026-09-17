export const ADMIN_TRANSACTION_SORT_KEYS = {
  CREATED_AT: "created_at",
  PAID_AT: "paid_at",
  UNIT_AMOUNT: "unit_amount",
  STATUS: "status",
  CURRENCY: "currency",
} as const;

export const ADMIN_SUBSCRIPTION_SORT_KEYS = {
  CREATED_AT: "created_at",
  STARTED_AT: "started_at",
  CURRENT_PERIOD_END: "current_period_end",
  UNIT_AMOUNT: "unit_amount",
  STATUS: "status",
  INTERVAL: "interval",
} as const;

export const ADMIN_COUPON_SORT_KEYS = {
  CREATED_AT: "created_at",
  CODE: "code",
  TITLE: "title",
  AMOUNT: "amount",
  USED_COUNT: "used_count",
  EXPIRES_AT: "expires_at",
} as const;

export const ADMIN_USER_COUPON_SORT_KEYS = {
  CREATED_AT: "created_at",
  DISCOUNT_AMOUNT: "discount_amount",
  FINAL_AMOUNT: "final_amount",
  PURCHASE_TYPE: "purchase_type",
  USER_EMAIL: "user_email",
  PRODUCT_NAME: "product_name",
  COUPON_CODE: "coupon_code",
} as const;

