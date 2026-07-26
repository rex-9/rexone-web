import AppRoutes from "../AppRoutes";
import { IApiAuthResponse, IApiResponse } from "../models";
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
  product_id: string;
  product_name: string;
  status: string;
  cycle: string;
  started_at: string;
  next_billing_at: string | null;
  ended_at: string | null;
  canceled_at: string | null;
  active: boolean;
  days_until_renewal: number | null;
  price: string;
  period_label: string;
}

export interface ITransaction {
  id: string;
  product_id: string;
  product_name: string;
  status: string;
  amount: string;
  price_unit_amount: number;
  currency: string;
  paid_at: string | null;
  refunded_at: string | null;
  paid: boolean;
  refunded: boolean;
}

export interface ICheckoutResponse {
  checkout_url: string;
  session_id: string;
}

class PaymentService {
  // ===== PRODUCTS =====
  async getProducts(): Promise<
    IApiResponse<IApiAuthResponse<{ products: IProduct[] }>>
  > {
    const response = await api.get<IApiAuthResponse<{ products: IProduct[] }>>(
      AppRoutes.server.protected.PAYMENT_PRODUCTS,
    );
    return response;
  }

  // ===== SUBSCRIPTIONS =====
  async getSubscriptions(): Promise<
    IApiResponse<IApiAuthResponse<{ subscriptions: ISubscription[] }>>
  > {
    const response = await api.get<
      IApiAuthResponse<{ subscriptions: ISubscription[] }>
    >(AppRoutes.server.protected.PAYMENT_SUBSCRIPTIONS);
    return response;
  }

  async cancelSubscription(
    subscriptionId: string,
  ): Promise<IApiResponse<IApiAuthResponse<{ subscription: ISubscription }>>> {
    const response = await api.post<
      IApiAuthResponse<{ subscription: ISubscription }>
    >(
      AppRoutes.server.protected.PAYMENT_SUBSCRIPTION_CANCEL.replace(
        ":id",
        subscriptionId,
      ),
    );
    return response;
  }

  async resumeSubscription(
    subscriptionId: string,
  ): Promise<IApiResponse<IApiAuthResponse<{ subscription: ISubscription }>>> {
    const response = await api.post<
      IApiAuthResponse<{ subscription: ISubscription }>
    >(
      AppRoutes.server.protected.PAYMENT_SUBSCRIPTION_RESUME.replace(
        ":id",
        subscriptionId,
      ),
    );
    return response;
  }

  // ===== TRANSACTIONS =====
  async getTransactions(): Promise<
    IApiResponse<IApiAuthResponse<{ transactions: ITransaction[] }>>
  > {
    const response = await api.get<
      IApiAuthResponse<{ transactions: ITransaction[] }>
    >(AppRoutes.server.protected.PAYMENT_TRANSACTIONS);
    return response;
  }

  // ===== CHECKOUT =====
  async createCheckout(
    productId: string,
    successUrl?: string,
    cancelUrl?: string,
  ): Promise<IApiResponse<IApiAuthResponse<ICheckoutResponse>>> {
    const response = await api.post<IApiAuthResponse<ICheckoutResponse>>(
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
