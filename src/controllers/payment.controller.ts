import { parseFromList } from "../services/api.service";
import PaymentService, {
  IProduct,
  ISubscription,
  ITransaction,
} from "../services/payment.service";

class PaymentController {
  // ===== PRODUCTS =====
  async getProducts(): Promise<{
    success: boolean;
    products?: IProduct[];
    error?: string;
  }> {
    try {
      const response = await PaymentService.getProducts();
      const { status, data } = response.data || {};

      if (status?.success && data) {
        const products = parseFromList<IProduct>(data);
        return { success: true, products };
      }
      return {
        success: false,
        error: status?.error || "Failed to fetch products",
      };
    } catch (error) {
      return { success: false, error: "An error occurred. Please try again." };
    }
  }

  // ===== SUBSCRIPTIONS =====
  async getSubscriptions(): Promise<{
    success: boolean;
    subscriptions?: ISubscription[];
    error?: string;
  }> {
    try {
      const response = await PaymentService.getSubscriptions();
      const { status, data } = response.data || {};

      if (status?.success && data) {
        const subscriptions = parseFromList<ISubscription>(data);
        return { success: true, subscriptions };
      }
      return {
        success: false,
        error: status?.error || "Failed to fetch subscriptions",
      };
    } catch (error) {
      return { success: false, error: "An error occurred. Please try again." };
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
        onError(status?.error || "Failed to cancel subscription");
      }
    } catch (error) {
      onError("An error occurred. Please try again.");
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
        onError(status?.error || "Failed to resume subscription");
      }
    } catch (error) {
      onError("An error occurred. Please try again.");
    }
  }

  // ===== TRANSACTIONS =====
  async getTransactions(): Promise<{
    success: boolean;
    transactions?: ITransaction[];
    error?: string;
  }> {
    try {
      const response = await PaymentService.getTransactions();
      const { status, data } = response.data || {};

      if (status?.success && data) {
        const transactions = parseFromList<ITransaction>(data);
        return { success: true, transactions };
      }
      return {
        success: false,
        error: status?.error || "Failed to fetch transactions",
      };
    } catch (error) {
      return { success: false, error: "An error occurred. Please try again." };
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
        onError(status?.error || "Failed to create checkout session");
      }
    } catch (error) {
      onError("An error occurred. Please try again.");
    }
  }
}

export default new PaymentController();
