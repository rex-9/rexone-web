import { IApiPagination } from "../../../models";
import { AppLocales, translate } from "../../../locales";
import { parsePaginatedResponse, parseRecord } from "../../../services/api.service";
import ProductService from "./product.service";
import {
  IAdminProduct,
  IAdminProductFormValues,
  IAdminProductListParams,
} from "./types";

class ProductController {
  async getProducts(
    params?: IAdminProductListParams,
    onSuccess?: (products: IAdminProduct[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await ProductService.getProducts(params);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            translate(AppLocales.Admin.Products.Errors.LoadList),
        );
        return;
      }

      const { records, pagination } = parsePaginatedResponse(response);
      onSuccess?.(records, pagination ?? undefined);
  }

  async getProduct(
    id: string,
    onSuccess?: (product: IAdminProduct) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await ProductService.getProduct(id);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            translate(AppLocales.Admin.Products.Errors.LoadOne),
        );
        return;
      }

      onSuccess?.(parseRecord("attributes" in data ? data : data.product));
  }

  async getDiscardedProducts(
    params?: IAdminProductListParams,
    onSuccess?: (products: IAdminProduct[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await ProductService.getDiscardedProducts(params);
    const { status, data } = response.data || {};

    if (!status?.success || !data) {
      onError?.(
        status?.error ||
          status?.message ||
          response.error ||
          translate(AppLocales.Admin.Products.Errors.LoadList),
      );
      return;
    }

    const { records, pagination } = parsePaginatedResponse(response);
    onSuccess?.(records, pagination ?? undefined);
  }

  async createProduct(
    values: IAdminProductFormValues,
    onSuccess?: (product: IAdminProduct | undefined, message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await ProductService.createProduct(values);
      const { status, data } = response.data || {};

      if (!status?.success) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            translate(AppLocales.Admin.Products.Errors.Create),
        );
        return;
      }

      onSuccess?.(
        data
          ? parseRecord("attributes" in data ? data : data.product)
          : undefined,
        status.message,
      );
  }

  async updateProduct(
    id: string,
    values: IAdminProductFormValues,
    onSuccess?: (product: IAdminProduct, message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await ProductService.updateProduct(id, values);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            translate(AppLocales.Admin.Products.Errors.Update),
        );
        return;
      }

      onSuccess?.(
        parseRecord("attributes" in data ? data : data.product),
        status.message,
      );
  }

  async discardProduct(
    id: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await ProductService.discardProduct(id);
      const { status } = response.data || {};

      if (!status?.success) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            translate(AppLocales.Admin.Products.Errors.Discard),
        );
        return;
      }

    onSuccess?.(status.message);
  }

  async restoreProduct(
    id: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await ProductService.restoreProduct(id);
    const { status, data } = response.data || {};

    if (!status?.success || !data) {
      onError?.(
        status?.error ||
          status?.message ||
          response.error ||
          translate(AppLocales.Admin.Products.Errors.Update),
      );
      return;
    }

    onSuccess?.(status.message);
  }
}

export default new ProductController();
