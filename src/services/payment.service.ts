import AppRoutes from "../AppRoutes";
import type {
  IApiAuthResponse,
  IApiResponse,
  ICreatePaymentIntentResult,
  IPaymentStatusResult,
  PaymentIntentStatus,
} from "../models";
import { api } from "./api.service";

interface ICreatePaymentIntentDto {
  payment_intent_id: string;
  client_secret: string;
  status: PaymentIntentStatus;
}

interface IPaymentStatusDto {
  id: string;
  status: PaymentIntentStatus;
}

const normalizeCreatePaymentIntentResponse = (
  response: IApiResponse<IApiAuthResponse<ICreatePaymentIntentDto>>,
): IApiResponse<IApiAuthResponse<ICreatePaymentIntentResult>> => ({
  data: response.data
    ? {
        status: response.data.status,
        data: response.data.data
          ? {
              paymentIntentId: response.data.data.payment_intent_id,
              clientSecret: response.data.data.client_secret,
              status: response.data.data.status,
            }
          : undefined,
      }
    : null,
  error: response.error,
});

const normalizePaymentStatusResponse = (
  response: IApiResponse<IApiAuthResponse<IPaymentStatusDto>>,
): IApiResponse<IApiAuthResponse<IPaymentStatusResult>> => ({
  data: response.data
    ? {
        status: response.data.status,
        data: response.data.data
          ? {
              paymentIntentId: response.data.data.id,
              status: response.data.data.status,
            }
          : undefined,
      }
    : null,
  error: response.error,
});

class PaymentService {
  async createPaymentIntent(
    orderId: string,
    productId: string,
    priceId: string,
    quantity: number,
  ): Promise<IApiResponse<IApiAuthResponse<ICreatePaymentIntentResult>>> {
    const response = await api.post<
      IApiAuthResponse<ICreatePaymentIntentDto>
    >(AppRoutes.server.protected.CREATE_PAYMENT_INTENT, {
      payment: {
        product_id: productId,
        price_id: priceId,
        quantity,
        payment_method_type: "card",
        metadata: { order_id: orderId },
      },
    });

    return normalizeCreatePaymentIntentResponse(response);
  }

  async getPaymentStatus(
    paymentIntentId: string,
  ): Promise<IApiResponse<IApiAuthResponse<IPaymentStatusResult>>> {
    const response = await api.get<IApiAuthResponse<IPaymentStatusDto>>(
      AppRoutes.server.protected.GET_PAYMENT_STATUS,
      { payment_intent_id: paymentIntentId },
      { headers: { "X-Skip-Loading": "true" } },
    );

    return normalizePaymentStatusResponse(response);
  }
}

export default new PaymentService();
