import { PaymentService } from ".";
import { parsePaginatedResponse } from "../../services/api.service";
import { IProduct, ISubscription, ITransaction } from "./types";
import { IApiPagination } from "../../models";

class PaymentController {
  // ===== PRODUCTS =====
  async getProducts(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    products: IProduct[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await PaymentService.getProducts(params);
    const { status } = response.data || {};

    if (status?.success) {
      const { records, pagination } =
        parsePaginatedResponse<IProduct>(response);
      return { success: true, products: records, pagination };
    }

    return {
      success: false,
      products: [],
      pagination: null,
      error: status?.error || response.error || "Failed to fetch products",
    };
  }

  // ===== SUBSCRIPTIONS =====
  async getSubscriptions(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    subscriptions: ISubscription[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await PaymentService.getSubscriptions(params);
    const { status } = response.data || {};

    if (status?.success) {
      const { records, pagination } =
        parsePaginatedResponse<ISubscription>(response);
      return { success: true, subscriptions: records, pagination };
    }

    return {
      success: false,
      subscriptions: [],
      pagination: null,
      error: status?.error || response.error || "Failed to fetch subscriptions",
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<{
    success: boolean;
    subscription?: ISubscription;
    message?: string;
    error?: string;
  }> {
    const response = await PaymentService.cancelSubscription(subscriptionId);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        subscription: data,
        message: status.message || "Subscription canceled successfully",
      };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to cancel subscription",
    };
  }

  async resumeSubscription(subscriptionId: string): Promise<{
    success: boolean;
    subscription?: ISubscription;
    message?: string;
    error?: string;
  }> {
    const response = await PaymentService.resumeSubscription(subscriptionId);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        subscription: data,
        message: status.message || "Subscription resumed successfully",
      };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to resume subscription",
    };
  }

  // ===== TRANSACTIONS =====
  async getTransactions(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    transactions: ITransaction[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await PaymentService.getTransactions(params);
    const { status } = response.data || {};

    if (status?.success) {
      const { records, pagination } =
        parsePaginatedResponse<ITransaction>(response);
      return { success: true, transactions: records, pagination };
    }

    return {
      success: false,
      transactions: [],
      pagination: null,
      error: status?.error || response.error || "Failed to fetch transactions",
    };
  }

  // ===== CHECKOUT =====
  async createCheckout(productId: string): Promise<{
    success: boolean;
    checkoutUrl?: string;
    error?: string;
  }> {
    const response = await PaymentService.createCheckout(productId);
    const { status, data } = response.data || {};

    if (status?.success && data?.checkout_url) {
      return {
        success: true,
        checkoutUrl: data.checkout_url,
      };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to create checkout session",
    };
  }
}

export default new PaymentController();
