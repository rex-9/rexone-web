import AppRoutes from "../../../AppRoutes";
import type {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
} from "../../../models";
import { api } from "../../../services/api.service";
import type { ICoupon, IUserCoupon } from "../../payment/types";
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

class PaymentService {
  getTransactions(
    params?: IAdminTransactionFilters,
  ): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminTransaction>[]>>
  > {
    return api.get(
      AppRoutes.server.protected.admin.PAYMENT_TRANSACTIONS,
      params as Record<string, unknown>,
    );
  }

  getTransaction(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminTransaction>>>> {
    return api.get(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.PAYMENT_TRANSACTION_DETAIL,
        id,
      ),
    );
  }

  getSubscriptions(
    params?: IAdminSubscriptionFilters,
  ): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminSubscription>[]>>
  > {
    return api.get(
      AppRoutes.server.protected.admin.PAYMENT_SUBSCRIPTIONS,
      params as Record<string, unknown>,
    );
  }

  getSubscription(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminSubscription>>>> {
    return api.get(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.PAYMENT_SUBSCRIPTION_DETAIL,
        id,
      ),
    );
  }

  // ===== COUPONS =====
  getCoupons(
    params?: IAdminCouponFilters,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<ICoupon>[]>>> {
    return api.get(
      AppRoutes.server.protected.admin.PAYMENT_COUPONS,
      params as Record<string, unknown>,
    );
  }

  getCoupon(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<ICoupon>>>> {
    return api.get(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.PAYMENT_COUPON_DETAIL,
        id,
      ),
    );
  }

  createCoupon(
    payload: ICreateCouponPayload,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<ICoupon>>>> {
    return api.post(
      AppRoutes.server.protected.admin.PAYMENT_COUPONS,
      { coupon: payload },
    );
  }

  createBatchCoupons(
    payload: IBatchCreateCouponPayload,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<ICoupon>[]>>> {
    return api.post(
      AppRoutes.server.protected.admin.PAYMENT_COUPONS_BATCH,
      payload,
    );
  }

  updateCoupon(
    id: string,
    payload: Partial<ICreateCouponPayload>,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<ICoupon>>>> {
    return api.put(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.PAYMENT_COUPON_DETAIL,
        id,
      ),
      { coupon: payload },
    );
  }

  discardCoupon(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<ICoupon>>>> {
    return api.post(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.PAYMENT_COUPON_DISCARD,
        id,
      ),
    );
  }

  undiscardCoupon(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<ICoupon>>>> {
    return api.post(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.PAYMENT_COUPON_UNDISCARD,
        id,
      ),
    );
  }

  destroyCoupon(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.PAYMENT_COUPON_DETAIL,
        id,
      ),
    );
  }

  emptyRecycleBin(): Promise<IApiResponse<IApiEnvelope<{ count: number }>>> {
    return api.delete(AppRoutes.server.protected.admin.PAYMENT_COUPONS_BIN);
  }

  discardBatch(
    ids: string[],
  ): Promise<IApiResponse<IApiEnvelope<{ count: number }>>> {
    return api.post(
      AppRoutes.server.protected.admin.PAYMENT_COUPONS_DISCARD_BATCH,
      { ids },
    );
  }

  undiscardBatch(
    ids: string[],
  ): Promise<IApiResponse<IApiEnvelope<{ count: number }>>> {
    return api.post(
      AppRoutes.server.protected.admin.PAYMENT_COUPONS_UNDISCARD_BATCH,
      { ids },
    );
  }

  destroyBatch(
    ids: string[],
  ): Promise<IApiResponse<IApiEnvelope<{ count: number }>>> {
    return api.post(
      AppRoutes.server.protected.admin.PAYMENT_COUPONS_DESTROY_BATCH,
      { ids },
    );
  }

  getCouponRedemptions(
    id: string,
    params?: Record<string, unknown>,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IUserCoupon>[]>>> {
    return api.get(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.PAYMENT_COUPON_REDEMPTIONS,
        id,
      ),
      params,
    );
  }

  getUserCoupons(
    params?: IAdminUserCouponFilters,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IUserCoupon>[]>>> {
    return api.get(
      AppRoutes.server.protected.admin.PAYMENT_USER_COUPONS,
      params as Record<string, unknown>,
    );
  }
}

export default new PaymentService();
