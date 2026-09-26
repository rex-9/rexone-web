import type {
  TAccessStatus,
  TBillingInterval,
  TCouponType,
  TSubscriptionStatus,
  TTransactionStatus,
} from "./constants";

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  unit_amount: number;
  currency: string;
  interval: TBillingInterval | null;
  period_label: string;
  recurring: boolean;
  active: boolean;
  free?: boolean;
}

export interface ISubscription {
  id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string | null;

  status: TSubscriptionStatus;
  stripe_subscription_item_id: string;
  stripe_price_id: string;
  currency: string;
  unit_amount: number;
  quantity: number;
  interval: TBillingInterval;
  interval_count: number;

  payment_method_id: string | null;
  payment_method_type: string | null;

  current_period_start: string;
  current_period_end: string;

  started_at: string;
  ended_at: string | null;
  canceled_at: string | null;
  cancel_at: string | null;
  cancel_at_period_end: boolean;

  created_at: string;
  updated_at: string;

  user_id: string;
  product_id: string;

  // Status helpers
  active: boolean;
  canceled: boolean;
  past_due: boolean;
  ended: boolean;
  expired: boolean;
  scheduled_for_cancellation: boolean;
  cancelable: boolean;

  // Renewal
  renewing: boolean;
  days_until_renewal: number | null;
  days_until_period_end: number | null;

  // Payment method display
  payment_method_display: string | null;
  card_last4: string | null;
  card_brand: string | null;
  masked_card_number: string | null;

  // Product details
  product_name: string | null;
  price: string | null;
  period_label: string | null;

  // Coupon & discounts
  coupon?: IPurchaseCoupon | null;
}

export interface IPurchaseCoupon {
  id?: string;
  code: string;
  title?: string;
  coupon_type: string | number;
  discount_amount: number;
  original_amount: number;
  final_amount: number;
  currency: string;
}

export interface ITransaction {
  id: string;

  stripe_payment_intent_id: string;
  stripe_charge_id: string | null;
  stripe_customer_id: string | null;

  status: TTransactionStatus;

  payment_method_id: string | null;
  payment_method_type: string | null;

  unit_amount: number;
  price: string;
  currency: string;
  client_secret: string | null;

  paid_at: string | null;
  refunded_at: string | null;
  canceled_at: string | null;
  processing_at: string | null;

  amount_received: number;
  amount_capturable: number;

  created_at: string;
  updated_at: string;

  user_id: string;
  product_id: string | null;

  // Status helpers
  paid: boolean;
  pending: boolean;
  failed: boolean;
  requires_action: boolean;

  // Payment method display
  payment_method_display: string | null;
  card_last4: string | null;
  card_brand: string | null;
  masked_card_number: string | null;

  // Product details
  product_name: string | null;

  // Coupon & discounts
  coupon?: IPurchaseCoupon | null;
}

export interface IAccess {
  id: string;
  status: TAccessStatus | string;
  granted_at: string | null;
  expires_at: string | null;
  revoked_at?: string | null;
  expired_at?: string | null;
  product_id: string;
  product_name?: string | null;
  remaining_days?: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ICheckoutResponse {
  checkout_url?: string;
  session_id?: string;
  free_access_granted?: boolean;
  product_id?: string;
  access_id?: string;
  coupon_code?: string;
  discount_amount?: number;
}

export type { TCouponType } from "./constants";

export interface ICoupon {
  id: string;
  title: string;
  description: string | null;
  code: string;
  coupon_type: TCouponType;
  amount: number;
  currency: string | null;
  max_usage: number;
  max_usage_per_user: number;
  used_count: number;
  expires_at: string | null;
  referrer_id: string | null;
  target_role_ids: string[];
  target_user_ids: string[];
  target_user_emails?: string[];
  target_product_ids: string[];
  active: boolean;
  expired: boolean;
  exhausted: boolean;
  created_at: string;
  updated_at: string;
  discarded_at?: string | null;
  metadata?: Record<string, unknown> | null;
}

export type TPurchaseType = "trx" | "sbs";

export interface IUserCoupon {
  id: string;
  coupon_id: string;
  coupon_code?: string;
  coupon_title?: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  product_id: string;
  product_name?: string;
  purchase_id: string;
  purchase_type: TPurchaseType;
  discount_amount: number;
  original_amount: number;
  final_amount: number;
  currency: string;
  created_at: string;
}

export interface ICouponValidationResult {
  valid: boolean;
  error?: string;
  coupon?: ICoupon;
  original_amount?: number;
  discount_amount?: number;
  final_amount?: number;
  currency?: string;
}
