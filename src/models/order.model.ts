export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled";

export type OrderPaymentStatus =
  | "unpaid"
  | "processing"
  | "paid"
  | "partially_refunded"
  | "refunded"
  | "failed";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "expired"
  | "cancelled"
  | "partially_refunded"
  | "refunded";

export interface IOrder {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: OrderPaymentStatus;
  subtotal_cents?: number;
  discount_cents?: number;
  tax_cents?: number;
  total_cents: number;
  currency: string;
  paid_at?: string | null;
  created_at?: string;
  order_items?: unknown[];
}

export interface IPayment {
  id: string;
  payment_number: string;
  provider: "stripe";
  status: PaymentStatus;
  amount_cents: number;
  currency: string;
}

export interface ICreateOrderPayload {
  resource_id: string;
  quantity: number;
}

export interface IOrderData {
  order: IOrder;
}

export interface IOrderCheckoutData extends IOrderData {
  payment: IPayment;
  checkout_url: string;
}
