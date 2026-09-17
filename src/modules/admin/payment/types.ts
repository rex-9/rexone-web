import type { TSortOrder } from "../../../hooks/useSort";
import type { ISubscription, ITransaction } from "../../payment/types";

export interface IAdminPaymentIdentity {
  product_code?: string | null;
  user_name?: string | null;
  username?: string | null;
  user_email?: string | null;
}

export type IAdminTransaction = ITransaction & IAdminPaymentIdentity;
export type IAdminSubscription = ISubscription & IAdminPaymentIdentity;

export interface IAdminTransactionFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  currency?: string;
  product_id?: string;
  user_id?: string;
  sort_by?: string;
  sort_order?: TSortOrder;
}

export interface IAdminSubscriptionFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  interval?: string;
  product_id?: string;
  user_id?: string;
  cancel_at_period_end?: boolean;
  sort_by?: string;
  sort_order?: TSortOrder;
}

export interface IAdminCouponFilters {
  page?: number;
  limit?: number;
  search?: string;
  coupon_type?: string;
  discarded?: boolean;
  referrer_id?: string;
  sort_by?: string;
  sort_order?: TSortOrder;
}

export interface IAdminUserCouponFilters {
  page?: number;
  limit?: number;
  coupon_id?: string;
  user_id?: string;
  product_id?: string;
  purchase_type?: string;
  search?: string;
  sort_by?: string;
  sort_order?: TSortOrder;
}

export interface ICreateCouponPayload {
  title: string;
  description?: string;
  code?: string;
  coupon_type: "percentage" | "fixed";
  amount: number;
  currency?: string;
  max_usage?: number;
  max_usage_per_user?: number;
  expires_at?: string;
  target_role_ids?: string[];
  target_user_ids?: string[];
  target_user_emails?: string[];
  target_product_ids?: string[];
}

export interface IBatchCreateCouponPayload {
  count: number;
  prefix?: string;
  coupon: ICreateCouponPayload;
}

