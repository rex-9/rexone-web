import AppRoutes from "../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../models";
import { api } from "./api.service";

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  price_unit_amount: number;
  currency: string;
  cycle: string | null;
  period_label: string;
  recurring: boolean;
  active: boolean;
}

export interface ISubscription {
  id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;

  status: string;
  cycle: string;

  payment_method_id: string | null;
  payment_method_type: string | null;

  current_period_start: string | null;
  current_period_end: string | null;

  started_at: string;
  ended_at: string | null;
  canceled_at: string | null;

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

  // Renewal
  days_until_renewal: number | null;

  // Payment method display
  payment_method_display: string | null;
  card_last4: string | null;
  card_brand: string | null;
  masked_card_number: string | null;

  // Product details
  product_name: string | null;
  price: string | null;
  period_label: string | null;
}

export interface ITransaction {
  id: string;

  stripe_payment_intent_id: string;
  stripe_charge_id: string | null;
  stripe_customer_id: string;

  status: string;

  payment_method_id: string | null;
  payment_method_type: string | null;

  price_unit_amount: number;
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
  refunded: boolean;
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
}

export interface ICheckoutResponse {
  checkout_url: string;
  session_id: string;
}

class PaymentService {
  // ===== PRODUCTS =====
  async getProducts(): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IProduct>[]>>
  > {
    const response = await api.get<IJsonApiResource<IProduct>[]>(
      AppRoutes.server.protected.PAYMENT_PRODUCTS,
    );
    return response;
  }

  // ===== SUBSCRIPTIONS =====
  async getSubscriptions(): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<ISubscription>[]>>
  > {
    const response = await api.get<IJsonApiResource<ISubscription>[]>(
      AppRoutes.server.protected.PAYMENT_SUBSCRIPTIONS,
    );
    return response;
  }

  async cancelSubscription(
    subscriptionId: string,
  ): Promise<IApiResponse<IApiEnvelope<ISubscription>>> {
    const response = await api.post<ISubscription>(
      AppRoutes.server.protected.PAYMENT_SUBSCRIPTION_CANCEL.replace(
        ":id",
        subscriptionId,
      ),
    );
    return response;
  }

  async resumeSubscription(
    subscriptionId: string,
  ): Promise<IApiResponse<IApiEnvelope<ISubscription>>> {
    const response = await api.post<ISubscription>(
      AppRoutes.server.protected.PAYMENT_SUBSCRIPTION_RESUME.replace(
        ":id",
        subscriptionId,
      ),
    );
    return response;
  }

  // ===== TRANSACTIONS =====
  async getTransactions(): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<ITransaction>[]>>
  > {
    const response = await api.get<IJsonApiResource<ITransaction>[]>(
      AppRoutes.server.protected.PAYMENT_TRANSACTIONS,
    );
    return response;
  }

  // ===== CHECKOUT =====
  async createCheckout(
    productId: string,
    successUrl?: string,
    cancelUrl?: string,
  ): Promise<IApiResponse<IApiEnvelope<ICheckoutResponse>>> {
    const response = await api.post<ICheckoutResponse>(
      AppRoutes.server.protected.PAYMENT_SESSION,
      {
        product_id: productId,
        success_url:
          successUrl ||
          window.location.origin + AppRoutes.client.protected.PAYMENT_SUCCESS,
        cancel_url:
          cancelUrl ||
          window.location.origin + AppRoutes.client.protected.PAYMENT_CANCEL,
      },
    );
    return response;
  }
}

export default new PaymentService();
