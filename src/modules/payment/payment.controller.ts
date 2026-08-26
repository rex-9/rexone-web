import { PaymentService } from ".";
import { AppLocales, translate } from "../../locales";
import { getApiError, parsePageList } from "../../services/api.service";
import { IProduct, ISubscription, ITransaction } from "./types";
import { IApiPagination } from "../../models";

class PaymentController {
  // ===== PRODUCTS =====
  async getProducts(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    products?: IProduct[];
    pagination?: IApiPagination | null;
    error?: string;
  }> {
    const response = await PaymentService.getProducts(params);
    const { status } = response.data || {};

    if (status?.success) {
      const { records, pagination } = parsePageList<IProduct>(response);
      return { success: true, products: records, pagination };
    }
    return {
      success: false,
      error: getApiError(response, translate(AppLocales.Payment.Errors.LoadProducts)),
    };
  }

  // ===== SUBSCRIPTIONS =====
  async getSubscriptions(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    subscriptions?: ISubscription[];
    pagination?: IApiPagination | null;
    error?: string;
  }> {
    const response = await PaymentService.getSubscriptions(params);
    const { status } = response.data || {};

    if (status?.success) {
      const { records, pagination } = parsePageList<ISubscription>(response);
      return { success: true, subscriptions: records, pagination };
    }
    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Payment.Errors.LoadSubscriptions),
      ),
    };
  }

  async cancelSubscription(
    subscriptionId: string,
    onSuccess: (data: ISubscription) => void,
    onError: (message: string) => void,
  ): Promise<void> {
    const response = await PaymentService.cancelSubscription(subscriptionId);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      onSuccess(data);
    } else {
      onError(
        getApiError(
          response,
          translate(AppLocales.Payment.Errors.CancelSubscription),
        ),
      );
    }
  }

  async resumeSubscription(
    subscriptionId: string,
    onSuccess: (data: ISubscription) => void,
    onError: (message: string) => void,
  ): Promise<void> {
    const response = await PaymentService.resumeSubscription(subscriptionId);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      onSuccess(data);
    } else {
      onError(
        getApiError(
          response,
          translate(AppLocales.Payment.Errors.ResumeSubscription),
        ),
      );
    }
  }

  // ===== TRANSACTIONS =====
  async getTransactions(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    transactions?: ITransaction[];
    pagination?: IApiPagination | null;
    error?: string;
  }> {
    const response = await PaymentService.getTransactions(params);
    const { status } = response.data || {};

    if (status?.success) {
      const { records, pagination } = parsePageList<ITransaction>(response);
      return { success: true, transactions: records, pagination };
    }
    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Payment.Errors.LoadTransactions),
      ),
    };
  }

  // ===== CHECKOUT =====
  async createCheckout(
    productId: string,
    onSuccess: (url: string) => void,
    onError: (message: string) => void,
  ): Promise<void> {
    const response = await PaymentService.createCheckout(productId);
    const { status, data } = response.data || {};

    if (status?.success && data?.checkout_url) {
      onSuccess(data.checkout_url);
    } else {
      onError(
        getApiError(
          response,
          translate(AppLocales.Payment.Errors.CreateCheckout),
        ),
      );
    }
  }
}

export default new PaymentController();
