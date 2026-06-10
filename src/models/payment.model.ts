export interface ICreateCheckoutSessionPayload {
  productId?: string;
  priceId?: string;
  product_id?: string;
  price_id?: string;
  quantity?: number;
  mode?: "payment" | "subscription";
  successUrl?: string;
  cancelUrl?: string;
  success_url?: string;
  cancel_url?: string;
  metadata?: Record<string, string>;
}

export interface ICreatePaymentIntentPayload {
  amount?: number;
  currency?: string;
  paymentMethodType?: string;
  payment_method_type?: string;
  productId?: string;
  priceId?: string;
  product_id?: string;
  price_id?: string;
  quantity?: number;
  metadata?: Record<string, string>;
}

export interface IPaymentCheckoutSessionData {
  id?: string;
  sessionId?: string;
  session_id?: string;
  checkoutUrl?: string;
  checkout_url?: string;
  url?: string;
}

export interface IPaymentIntentData {
  id?: string;
  clientSecret?: string;
  client_secret?: string;
}

export interface IPaymentStatusData {
  id?: string;
  paymentStatus?: string;
  payment_status?: string;
  status?: string;
  amountTotal?: number;
  amount_total?: number;
  currency?: string;
  raw?: unknown;
}

export interface IStripeProductDetails {
  id: string;
  title: string;
  description?: string;
  photo?: string;
  photos?: string[];
  active?: boolean;
  metadata?: Record<string, string>;
}

export interface IStripePriceDetails {
  id: string;
  active?: boolean;
  currency: string;
  unit_amount: number;
  unit_amount_decimal?: string;
  display_amount?: string;
  type?: string;
  recurring?: unknown;
  metadata?: Record<string, string>;
}

export interface IProductDetailsResponseData {
  product: IStripeProductDetails;
  price: IStripePriceDetails;
}
