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

export type PaymentTransactionStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "expired"
  | "cancelled"
  | "partially_refunded"
  | "refunded";

export interface IOrderItem {
  id: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  totalCents: number;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
  paidAt: string | null;
  createdAt: string;
  orderItems: IOrderItem[];
}

export interface IPaymentTransaction {
  id: string;
  paymentNumber: string;
  provider: "stripe";
  status: PaymentTransactionStatus;
  amountCents: number;
  currency: string;
  paymentMethodType: string | null;
  paidAt: string | null;
  failedAt: string | null;
  createdAt: string;
}

export interface ICreateOrderInput {
  resourceId: string;
  quantity: number;
}

export interface IPurchasableResource {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  priceId: string;
  currency: string;
  unitAmountCents: number;
  displayAmount: string;
}
