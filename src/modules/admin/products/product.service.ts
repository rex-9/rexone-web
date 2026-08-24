import AppRoutes from "../../../AppRoutes";
import {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
} from "../../../models";
import { api } from "../../../services";
import {
  IAdminProduct,
  IAdminProductFormValues,
  IAdminProductListParams,
} from "./types";

export type AdminProductResponse =
  | IJsonApiResource<IAdminProduct>
  | { product: IAdminProduct };

class ProductService {
  async getProducts(
    params?: IAdminProductListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminProduct>[]>>> {
    return api.get<IJsonApiResource<IAdminProduct>[]>(
      AppRoutes.server.protected.ADMIN_PAYMENT_PRODUCTS,
      params ? { page: params.page, limit: params.limit } : undefined,
    );
  }

  async getProduct(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminProductResponse>>> {
    return api.get<AdminProductResponse>(
      AppRoutes.withId(AppRoutes.server.protected.ADMIN_PAYMENT_PRODUCT_DETAIL, id),
    );
  }

  async createProduct(
    values: IAdminProductFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminProductResponse>>> {
    return api.post<AdminProductResponse>(
      AppRoutes.server.protected.ADMIN_PAYMENT_PRODUCTS,
      { product: values },
    );
  }

  async updateProduct(
    id: string,
    values: IAdminProductFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminProductResponse>>> {
    return api.put<AdminProductResponse>(
      AppRoutes.withId(AppRoutes.server.protected.ADMIN_PAYMENT_PRODUCT_DETAIL, id),
      {
        product: values,
      },
    );
  }

  async deleteProduct(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.ADMIN_PAYMENT_PRODUCT_DETAIL, id),
    );
  }
}

export default new ProductService();
