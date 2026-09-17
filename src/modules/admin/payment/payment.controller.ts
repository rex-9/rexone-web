import type { IApiPagination } from "../../../models";
import { getApiError, parsePagyList, parseRecord } from "../../../services/api.service";
import PaymentService from "./payment.service";
import type {
  IAdminCouponFilters,
  IAdminSubscription,
  IAdminSubscriptionFilters,
  IAdminTransaction,
  IAdminTransactionFilters,
  IAdminUserCouponFilters,
  IBatchCreateCouponPayload,
  ICreateCouponPayload,
} from "./types";
import type { ICoupon, IUserCoupon } from "../../payment/types";

class PaymentController {
  async getTransactions(params?: IAdminTransactionFilters) {
    const response = await PaymentService.getTransactions(params);
    if (response.data?.status?.success) {
      const { records, pagination } =
        parsePagyList<IAdminTransaction>(response);
      return { success: true as const, transactions: records, pagination };
    }
    return {
      success: false as const,
      transactions: [],
      pagination: null as IApiPagination | null,
      error: getApiError(response, "Failed to load transactions"),
    };
  }

  async getTransaction(id: string) {
    const response = await PaymentService.getTransaction(id);
    const body = response.data?.data;
    return response.data?.status?.success && body
      ? { success: true as const, transaction: parseRecord<IAdminTransaction>(body as unknown as IAdminTransaction) }
      : {
          success: false as const,
          error: getApiError(response, "Failed to load transaction"),
        };
  }

  async getSubscriptions(params?: IAdminSubscriptionFilters) {
    const response = await PaymentService.getSubscriptions(params);
    if (response.data?.status?.success) {
      const { records, pagination } =
        parsePagyList<IAdminSubscription>(response);
      return { success: true as const, subscriptions: records, pagination };
    }
    return {
      success: false as const,
      subscriptions: [],
      pagination: null as IApiPagination | null,
      error: getApiError(response, "Failed to load subscriptions"),
    };
  }

  async getSubscription(id: string) {
    const response = await PaymentService.getSubscription(id);
    const body = response.data?.data;
    return response.data?.status?.success && body
      ? { success: true as const, subscription: parseRecord<IAdminSubscription>(body as unknown as IAdminSubscription) }
      : {
          success: false as const,
          error: getApiError(response, "Failed to load subscription"),
        };
  }

  // ===== COUPONS =====
  async getCoupons(params?: IAdminCouponFilters) {
    const response = await PaymentService.getCoupons(params);
    if (response.data?.status?.success) {
      const { records, pagination } = parsePagyList<import("../../payment/types").ICoupon>(response);
      return { success: true as const, coupons: records, pagination };
    }
    return {
      success: false as const,
      coupons: [],
      pagination: null as IApiPagination | null,
      error: getApiError(response, "Failed to load coupons"),
    };
  }

  async getCoupon(id: string) {
    const response = await PaymentService.getCoupon(id);
    const body = response.data?.data;
    return response.data?.status?.success && body
      ? { success: true as const, coupon: parseRecord<ICoupon>(body as unknown as ICoupon) }
      : {
          success: false as const,
          error: getApiError(response, "Failed to load coupon"),
        };
  }

  async createCoupon(payload: ICreateCouponPayload) {
    const response = await PaymentService.createCoupon(payload);
    const body = response.data?.data;
    return response.data?.status?.success && body
      ? { success: true as const, coupon: parseRecord<ICoupon>(body as unknown as ICoupon) }
      : {
          success: false as const,
          error: getApiError(response, "Failed to create coupon"),
        };
  }

  async createBatchCoupons(payload: IBatchCreateCouponPayload) {
    const response = await PaymentService.createBatchCoupons(payload);
    if (response.data?.status?.success) {
      const { records } = parsePagyList<ICoupon>(response);
      return { success: true as const, coupons: records };
    }
    return {
      success: false as const,
      coupons: [],
      error: getApiError(response, "Failed to create coupons"),
    };
  }

  async updateCoupon(id: string, payload: Partial<ICreateCouponPayload>) {
    const response = await PaymentService.updateCoupon(id, payload);
    const body = response.data?.data;
    return response.data?.status?.success && body
      ? { success: true as const, coupon: parseRecord<ICoupon>(body as unknown as ICoupon) }
      : {
          success: false as const,
          error: getApiError(response, "Failed to update coupon"),
        };
  }

  async discardCoupon(id: string) {
    const response = await PaymentService.discardCoupon(id);
    return response.data?.status?.success
      ? { success: true as const }
      : {
          success: false as const,
          error: getApiError(response, "Failed to discard coupon"),
        };
  }

  async undiscardCoupon(id: string) {
    const response = await PaymentService.undiscardCoupon(id);
    return response.data?.status?.success
      ? { success: true as const }
      : {
          success: false as const,
          error: getApiError(response, "Failed to restore coupon"),
        };
  }

  async destroyCoupon(id: string) {
    const response = await PaymentService.destroyCoupon(id);
    return response.data?.status?.success
      ? { success: true as const }
      : {
          success: false as const,
          error: getApiError(response, "Failed to destroy coupon"),
        };
  }

  async emptyRecycleBin() {
    const response = await PaymentService.emptyRecycleBin();
    return response.data?.status?.success
      ? {
          success: true as const,
          count:
            (response.data.data as unknown as { count?: number })?.count ?? 0,
        }
      : {
          success: false as const,
          error: getApiError(response, "Failed to empty recycle bin"),
        };
  }

  async discardBatch(ids: string[]) {
    const response = await PaymentService.discardBatch(ids);
    return response.data?.status?.success
      ? {
          success: true as const,
          count:
            (response.data.data as unknown as { count?: number })?.count ??
            ids.length,
        }
      : {
          success: false as const,
          error: getApiError(response, "Failed to discard coupons"),
        };
  }

  async undiscardBatch(ids: string[]) {
    const response = await PaymentService.undiscardBatch(ids);
    return response.data?.status?.success
      ? {
          success: true as const,
          count:
            (response.data.data as unknown as { count?: number })?.count ??
            ids.length,
        }
      : {
          success: false as const,
          error: getApiError(response, "Failed to restore coupons"),
        };
  }

  async destroyBatch(ids: string[]) {
    const response = await PaymentService.destroyBatch(ids);
    return response.data?.status?.success
      ? {
          success: true as const,
          count:
            (response.data.data as unknown as { count?: number })?.count ??
            ids.length,
        }
      : {
          success: false as const,
          error: getApiError(response, "Failed to permanently destroy coupons"),
        };
  }

  async getCouponRedemptions(id: string, params?: IAdminUserCouponFilters) {
    const response = await PaymentService.getCouponRedemptions(id, params as Record<string, unknown>);
    if (response.data?.status?.success) {
      const { records, pagination } = parsePagyList<IUserCoupon>(response);
      return { success: true as const, redemptions: records, pagination };
    }
    return {
      success: false as const,
      redemptions: [],
      pagination: null as IApiPagination | null,
      error: getApiError(response, "Failed to load coupon redemptions"),
    };
  }

  async getUserCoupons(params?: IAdminUserCouponFilters) {
    const response = await PaymentService.getUserCoupons(params);
    if (response.data?.status?.success) {
      const { records, pagination } = parsePagyList<IUserCoupon>(response);
      return { success: true as const, userCoupons: records, pagination };
    }
    return {
      success: false as const,
      userCoupons: [],
      pagination: null as IApiPagination | null,
      error: getApiError(response, "Failed to load redemptions ledger"),
    };
  }
}

export default new PaymentController();
