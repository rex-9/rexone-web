import AppRoutes from "../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../models";
import { api } from "../../services";
import {
  ICheckoutResponse,
  IProduct,
  ISubscription,
  ITransaction,
} from "./types";

class PaymentService {
  // ===== PRODUCTS =====
  async getProducts(params?: { page?: number; limit?: number }): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IProduct>[]>>
  > {
    const response = await api.get<IJsonApiResource<IProduct>[]>(
      AppRoutes.server.protected.PAYMENT_PRODUCTS,
      params,
    );
    return response;
  }

  // ===== SUBSCRIPTIONS =====
  async getSubscriptions(params?: { page?: number; limit?: number }): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<ISubscription>[]>>
  > {
    const response = await api.get<IJsonApiResource<ISubscription>[]>(
      AppRoutes.server.protected.PAYMENT_SUBSCRIPTIONS,
      params,
    );
    return response;
  }

  async cancelSubscription(
    subscriptionId: string,
  ): Promise<IApiResponse<IApiEnvelope<ISubscription>>> {
    const response = await api.post<ISubscription>(
      AppRoutes.withId(
       AppRoutes.server.protected.PAYMENT_SUBSCRIPTION_CANCEL,
        subscriptionId,
      ),
    );
    return response;
  }

  async resumeSubscription(
    subscriptionId: string,
  ): Promise<IApiResponse<IApiEnvelope<ISubscription>>> {
    const response = await api.post<ISubscription>(
      AppRoutes.withId(
        AppRoutes.server.protected.PAYMENT_SUBSCRIPTION_RESUME,
        subscriptionId,
      ),
    );
    return response;
  }

  // ===== TRANSACTIONS =====
  async getTransactions(params?: { page?: number; limit?: number }): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<ITransaction>[]>>
  > {
    const response = await api.get<IJsonApiResource<ITransaction>[]>(
      AppRoutes.server.protected.PAYMENT_TRANSACTIONS,
      params,
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
