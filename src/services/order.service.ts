import AppRoutes from "../AppRoutes";
import type { IApiAuthResponse, IApiResponse } from "../models";
import type {
  ICreateOrderPayload,
  IOrderCheckoutData,
  IOrderData,
} from "../models/order.model";
import { api } from "./api.service";

class OrderService {
  createOrder(
    payload: ICreateOrderPayload,
  ): Promise<IApiResponse<IApiAuthResponse<IOrderData>>> {
    return api.post(AppRoutes.server.public.CREATE_ORDER, payload);
  }

  startCheckout(
    orderId: string,
  ): Promise<IApiResponse<IApiAuthResponse<IOrderCheckoutData>>> {
    return api.post(`${AppRoutes.server.public.ORDER}/${orderId}/checkout`);
  }

  getOrder(
    orderId: string,
    options?: { skipLoading?: boolean },
  ): Promise<IApiResponse<IApiAuthResponse<IOrderData>>> {
    return api.get(
      `${AppRoutes.server.public.ORDER}/${orderId}`,
      undefined,
      options?.skipLoading
        ? { headers: { "X-Skip-Loading": "true" } }
        : undefined,
    );
  }
}

export default new OrderService();
