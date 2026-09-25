import { PaymentService } from ".";
import { AppLocales, translate } from "../../locales";
import { getApiError, parsePagyList } from "../../services/api.service";
import {
  IAccess,
  ICouponValidationResult,
  IProduct,
  ISubscription,
  ITransaction,
} from "./types";
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
      const { records, pagination } = parsePagyList<IProduct>(response);
      return { success: true, products: records, pagination };
    }

    return {
      success: false,
      products: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Payment.Errors.LoadProducts),
      ),
    };
  }

  // ===== ACCESSES =====
  async getAccesses(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    accesses: IAccess[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await PaymentService.getAccesses(params);
    const { status } = response.data || {};

    if (status?.success) {
      const { records, pagination } = parsePagyList<IAccess>(response);
      return { success: true, accesses: records, pagination };
    }

    return {
      success: false,
      accesses: [],
      pagination: null,
      error: getApiError(
        response,
        "Failed to load accesses",
      ),
    };
  }

  async getActiveAccesses(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    accesses: IAccess[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await PaymentService.getActiveAccesses(params);
    const { status } = response.data || {};

    if (status?.success) {
      const { records, pagination } = parsePagyList<IAccess>(response);
      return { success: true, accesses: records, pagination };
    }

    return {
      success: false,
      accesses: [],
      pagination: null,
      error: getApiError(
        response,
        "Failed to load accesses",
      ),
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
      const { records, pagination } = parsePagyList<ISubscription>(response);
      return { success: true, subscriptions: records, pagination };
    }

    return {
      success: false,
      subscriptions: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Payment.Errors.LoadSubscriptions),
      ),
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
      error: getApiError(
        response,
        translate(AppLocales.Payment.Errors.CancelSubscription),
      ),
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
      error: getApiError(
        response,
        translate(AppLocales.Payment.Errors.ResumeSubscription),
      ),
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
      const { records, pagination } = parsePagyList<ITransaction>(response);
      return { success: true, transactions: records, pagination };
    }

    return {
      success: false,
      transactions: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Payment.Errors.LoadTransactions),
      ),
    };
  }

  // ===== CHECKOUT & COUPONS =====
  async validateCoupon(
    code: string,
    productId: string,
  ): Promise<{
    success: boolean;
    data?: ICouponValidationResult;
    error?: string;
    remaining_attempts?: number;
    cooldown_remaining?: number;
  }> {
    const response = await PaymentService.validateCoupon(code, productId);
    const { status, data } = response.data || {};

    if (status?.success && data?.valid) {
      return {
        success: true,
        data,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Payment.CheckoutDialog.InvalidCode),
      ),
      remaining_attempts: data?.remaining_attempts,
      cooldown_remaining: data?.cooldown_remaining,
    };
  }

  async createCheckout(
    productId: string,
    couponCode?: string,
  ): Promise<{
    success: boolean;
    checkoutUrl?: string;
    freeAccessGranted?: boolean;
    couponCode?: string;
    discountAmount?: number;
    error?: string;
  }> {
    const response = await PaymentService.createCheckout(
      productId,
      undefined,
      undefined,
      couponCode,
    );
    const { status, data } = response.data || {};

    if (status?.success) {
      if (data?.free_access_granted) {
        return {
          success: true,
          freeAccessGranted: true,
          couponCode: data.coupon_code,
          discountAmount: data.discount_amount,
        };
      }

      if (data?.checkout_url) {
        return {
          success: true,
          checkoutUrl: data.checkout_url,
          couponCode: data.coupon_code,
          discountAmount: data.discount_amount,
        };
      }
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Payment.Errors.CreateCheckout),
      ),
    };
  }

  async getSessionStatus(sessionId: string): Promise<{
    success: boolean;
    status?: string;
    paymentStatus?: string;
    error?: string;
  }> {
    const response = await PaymentService.getSessionStatus(sessionId);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        status: data.status,
        paymentStatus: data.payment_status,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to verify payment session"),
    };
  }
}

export default new PaymentController();
