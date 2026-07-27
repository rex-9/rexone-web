import AppRoutes from "../AppRoutes";
import type { IApiAuthResponse, IApiResponse } from "../models";
import type {
  ICreateOrderInput,
  IOrder,
  IOrderItem,
  IPurchasableResource,
} from "../models/order.model";
import { api } from "./api.service";

interface IOrderItemDto {
  id: string;
  name: string;
  unit_price_cents: number;
  quantity: number;
  total_cents: number;
}

interface IOrderDto {
  id: string;
  order_number: string;
  status: IOrder["status"];
  payment_status: IOrder["paymentStatus"];
  subtotal_cents: number;
  discount_cents: number;
  tax_cents: number;
  total_cents: number;
  currency: string;
  paid_at: string | null;
  created_at: string;
  order_items: IOrderItemDto[];
}

interface IOrderDataDto {
  order: IOrderDto;
}

interface IResourceDetailsDto {
  product: {
    id: string;
    title: string;
    description?: string;
    photo?: string;
    photos?: string[];
  };
  price: {
    id: string;
    currency: string;
    unit_amount: number;
    display_amount?: string;
  };
}

const normalizeOrderItem = (item: IOrderItemDto): IOrderItem => ({
  id: item.id,
  name: item.name,
  unitPriceCents: item.unit_price_cents,
  quantity: item.quantity,
  totalCents: item.total_cents,
});

const normalizeOrder = (order: IOrderDto): IOrder => ({
  id: order.id,
  orderNumber: order.order_number,
  status: order.status,
  paymentStatus: order.payment_status,
  subtotalCents: order.subtotal_cents,
  discountCents: order.discount_cents,
  taxCents: order.tax_cents,
  totalCents: order.total_cents,
  currency: order.currency,
  paidAt: order.paid_at,
  createdAt: order.created_at,
  orderItems: (order.order_items ?? []).map(normalizeOrderItem),
});

const normalizeResponse = <TDto, TDomain>(
  response: IApiResponse<IApiAuthResponse<TDto>>,
  normalize: (data: TDto) => TDomain,
): IApiResponse<IApiAuthResponse<TDomain>> => ({
  data: response.data
    ? {
        status: response.data.status,
        data: response.data.data ? normalize(response.data.data) : undefined,
      }
    : null,
  error: response.error,
});

class OrderService {
  async createOrder(
    input: ICreateOrderInput,
  ): Promise<IApiResponse<IApiAuthResponse<IOrder>>> {
    const response = await api.post<IApiAuthResponse<IOrderDataDto>>(
      AppRoutes.server.public.CREATE_ORDER,
      { resource_id: input.resourceId, quantity: input.quantity },
    );
    return normalizeResponse(response, (data) => normalizeOrder(data.order));
  }

  async getOrder(
    orderId: string,
    options?: { skipLoading?: boolean },
  ): Promise<IApiResponse<IApiAuthResponse<IOrder>>> {
    const response = await api.get<IApiAuthResponse<IOrderDataDto>>(
      `${AppRoutes.server.public.ORDER}/${orderId}`,
      undefined,
      options?.skipLoading
        ? { headers: { "X-Skip-Loading": "true" } }
        : undefined,
    );
    return normalizeResponse(response, (data) => normalizeOrder(data.order));
  }

  async getPurchasableResource(input: {
    productId: string;
    resourceId: string;
  }): Promise<IApiResponse<IApiAuthResponse<IPurchasableResource>>> {
    const response = await api.get<IApiAuthResponse<IResourceDetailsDto>>(
      AppRoutes.server.public.GET_PRODUCT_DETAILS,
      { product_id: input.productId, price_id: input.resourceId },
    );
    return normalizeResponse(response, (data) => ({
      id: data.product.id,
      title: data.product.title,
      description: data.product.description ?? "",
      imageUrl: data.product.photo ?? data.product.photos?.[0] ?? "",
      priceId: data.price.id,
      currency: data.price.currency,
      unitAmountCents: data.price.unit_amount,
      displayAmount:
        data.price.display_amount ??
        `${(data.price.unit_amount / 100).toFixed(2)} ${data.price.currency.toUpperCase()}`,
    }));
  }
}

export default new OrderService();
