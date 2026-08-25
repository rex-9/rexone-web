import { PaymentService } from ".";
import { AppLocales, translate } from "../../locales";
import { parsePaginatedResponse } from "../../services/api.service";
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
    try {
      const response = await PaymentService.getProducts(params);
      const { status } = response.data || {};

      if (status?.success) {
        const { records, pagination } =
          parsePaginatedResponse<IProduct>(response);
        return { success: true, products: records, pagination };
      }
      return {
        success: false,
        error: status?.error || translate(AppLocales.Payment.Errors.LoadProducts),
      };
    } catch {
      return { success: false, error: translate(AppLocales.Payment.Errors.Unexpected) };
    }
  }

  // ===== SUBSCRIPTIONS =====
  async getSubscriptions(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    subscriptions?: ISubscription[];
    pagination?: IApiPagination | null;
    error?: string;
  }> {
    try {
      const response = await PaymentService.getSubscriptions(params);
      const { status } = response.data || {};

      if (status?.success) {
        const { records, pagination } =
          parsePaginatedResponse<ISubscription>(response);
        return { success: true, subscriptions: records, pagination };
      }
      return {
        success: false,
        error:
          status?.error || translate(AppLocales.Payment.Errors.LoadSubscriptions),
      };
    } catch {
      return { success: false, error: translate(AppLocales.Payment.Errors.Unexpected) };
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    onSuccess: (data: ISubscription) => void,
    onError: (message: string) => void,
  ): Promise<void> {
    try {
      const response = await PaymentService.cancelSubscription(subscriptionId);
      const { status, data } = response.data || {};

      if (status?.success && data) {
        onSuccess(data);
      } else {
        onError(
          status?.error || translate(AppLocales.Payment.Errors.CancelSubscription),
        );
      }
    } catch (error) {
      console.error(error);
      onError(translate(AppLocales.Payment.Errors.Unexpected));
    }
  }

  async resumeSubscription(
    subscriptionId: string,
    onSuccess: (data: ISubscription) => void,
    onError: (message: string) => void,
  ): Promise<void> {
    try {
      const response = await PaymentService.resumeSubscription(subscriptionId);
      const { status, data } = response.data || {};

      if (status?.success && data) {
        onSuccess(data);
      } else {
        onError(
          status?.error || translate(AppLocales.Payment.Errors.ResumeSubscription),
        );
      }
    } catch (error) {
      console.error(error);
      onError(translate(AppLocales.Payment.Errors.Unexpected));
    }
  }

  // ===== TRANSACTIONS =====
  async getTransactions(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    transactions?: ITransaction[];
    pagination?: IApiPagination | null;
    error?: string;
  }> {
    try {
      const response = await PaymentService.getTransactions(params);
      const { status } = response.data || {};

      if (status?.success) {
        const { records, pagination } =
          parsePaginatedResponse<ITransaction>(response);
        return { success: true, transactions: records, pagination };
      }
      return {
        success: false,
        error:
          status?.error || translate(AppLocales.Payment.Errors.LoadTransactions),
      };
    } catch {
      return { success: false, error: translate(AppLocales.Payment.Errors.Unexpected) };
    }
  }

  // ===== CHECKOUT =====
  async createCheckout(
    productId: string,
    onSuccess: (url: string) => void,
    onError: (message: string) => void,
  ): Promise<void> {
    try {
      const response = await PaymentService.createCheckout(productId);
      const { status, data } = response.data || {};

      if (status?.success && data?.checkout_url) {
        onSuccess(data.checkout_url);
      } else {
        onError(status?.error || translate(AppLocales.Payment.Errors.CreateCheckout));
      }
    } catch (error) {
      console.error(error);
      onError(translate(AppLocales.Payment.Errors.Unexpected));
    }
  }
}

export default new PaymentController();
