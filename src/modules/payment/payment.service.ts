import AppRoutes from "../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../models";
import { api } from "../../services";
import {
  IAccess,
  ICheckoutResponse,
  ICouponValidationResult,
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

  // ===== ACCESSES =====
  async getAccesses(params?: { page?: number; limit?: number }): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAccess>[]>>
  > {
    const response = await api.get<IJsonApiResource<IAccess>[]>(
      AppRoutes.server.protected.ACCESSES,
      params,
    );
    return response;
  }

  async getActiveAccesses(params?: { page?: number; limit?: number }): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAccess>[]>>
  > {
    const response = await api.get<IJsonApiResource<IAccess>[]>(
      AppRoutes.server.protected.ACTIVE_ACCESSES,
      params,
    );
    return response;
  }

  // ===== CHECKOUT =====
  async validateCoupon(
    code: string,
    productId: string,
  ): Promise<IApiResponse<IApiEnvelope<ICouponValidationResult>>> {
    const response = await api.post<ICouponValidationResult>(
      AppRoutes.server.protected.PAYMENT_COUPONS_VALIDATE,
      {
        code: code.trim().toUpperCase(),
        product_id: productId,
      },
    );
    return response;
  }

  async createCheckout(
    productId: string,
    successUrl?: string,
    cancelUrl?: string,
    couponCode?: string,
  ): Promise<IApiResponse<IApiEnvelope<ICheckoutResponse>>> {
    const defaultSuccessUrl =
      window.location.origin +
      AppRoutes.client.protected.PAYMENT_SUCCESS +
      "?session_id={CHECKOUT_SESSION_ID}";

    const payload: Record<string, unknown> = {
      product_id: productId,
      success_url: successUrl || defaultSuccessUrl,
      cancel_url:
        cancelUrl ||
        window.location.origin + AppRoutes.client.protected.PAYMENT_CANCEL,
    };
    if (couponCode) {
      payload.coupon_code = couponCode.trim().toUpperCase();
    }

    const response = await api.post<ICheckoutResponse>(
      AppRoutes.server.protected.PAYMENT_SESSION,
      payload,
    );
    return response;
  }

  async getSessionStatus(
    sessionId: string,
  ): Promise<
    IApiResponse<IApiEnvelope<{ status: string; payment_status: string }>>
  > {
    const response = await api.get<{ status: string; payment_status: string }>(
      AppRoutes.withId(
        AppRoutes.server.protected.PAYMENT_SESSION_STATUS,
        sessionId,
      ),
    );
    return response;
  }
}

export default new PaymentService();
