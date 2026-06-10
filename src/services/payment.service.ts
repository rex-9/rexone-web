import AppRoutes from "../AppRoutes";
import { IApiAuthResponse, IApiResponse } from "../models";
import {
  ICreateCheckoutSessionPayload,
  ICreatePaymentIntentPayload,
  IPaymentCheckoutSessionData,
  IPaymentIntentData,
  IProductDetailsResponseData,
  IPaymentStatusData,
} from "../models/payment.model";
import { api } from "./api.service";

class PaymentService {
  async createCheckoutSession(
    payload: ICreateCheckoutSessionPayload,
  ): Promise<IApiResponse<IApiAuthResponse<IPaymentCheckoutSessionData>>> {
    return api.post<IApiAuthResponse<IPaymentCheckoutSessionData>>(
      AppRoutes.server.public.CREATE_CHECKOUT_SESSION,
      payload,
    );
  }

  async createPaymentIntent(
    payload: ICreatePaymentIntentPayload,
  ): Promise<IApiResponse<IApiAuthResponse<IPaymentIntentData>>> {
    return api.post<IApiAuthResponse<IPaymentIntentData>>(
      AppRoutes.server.public.CREATE_PAYMENT_INTENT,
      payload,
    );
  }

  async getPaymentStatus(params: {
    id?: string;
    session_id?: string;
    payment_intent?: string;
    payment_intent_id?: string;
  }): Promise<IApiResponse<IApiAuthResponse<IPaymentStatusData>>> {
    return api.get<IApiAuthResponse<IPaymentStatusData>>(
      AppRoutes.server.public.GET_PAYMENT_STATUS,
      params,
    );
  }

  async getPaymentDetails(params: {
    id?: string;
    session_id?: string;
    payment_intent?: string;
    product_id?: string;
    price_id?: string;
    quantity?: number;
  }): Promise<IApiResponse<IApiAuthResponse<IPaymentStatusData>>> {
    return api.get<IApiAuthResponse<IPaymentStatusData>>(
      AppRoutes.server.public.GET_PAYMENT_DETAILS,
      params,
    );
  }

  async listCustomerPayments(
    customerId: string,
  ): Promise<IApiResponse<IApiAuthResponse<IPaymentStatusData[]>>> {
    return api.get<IApiAuthResponse<IPaymentStatusData[]>>(
      `${AppRoutes.server.public.LIST_CUSTOMER_PAYMENTS}/${customerId}`,
    );
  }

  async getProductDetails(params: {
    product_id: string;
    price_id: string;
  }): Promise<IApiResponse<IApiAuthResponse<IProductDetailsResponseData>>> {
    return api.get<IApiAuthResponse<IProductDetailsResponseData>>(
      AppRoutes.server.public.GET_PRODUCT_DETAILS,
      params,
    );
  }
}

export default new PaymentService();
