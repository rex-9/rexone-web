import { IApiPagination } from "../../../models";
import { parseFromList } from "../../../services/api.service";
import ProductService, { AdminProductResponse } from "./product.service";
import {
  IAdminProduct,
  IAdminProductFormValues,
  IAdminProductListParams,
} from "./types";

const parseAdminProduct = (data: AdminProductResponse): IAdminProduct => {
  if ("attributes" in data) {
    return { ...data.attributes, id: data.id };
  }

  return data.product;
};

class ProductController {
  async getProducts(
    params?: IAdminProductListParams,
    onSuccess?: (products: IAdminProduct[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await ProductService.getProducts(params);
      const { status, data, meta } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to load products",
        );
        return;
      }

      onSuccess?.(parseFromList<IAdminProduct>(data), meta?.pagination);
    } catch (error) {
      console.error("Error fetching admin products:", error);
      onError?.("An error occurred while loading products.");
    }
  }

  async getProduct(
    id: string,
    onSuccess?: (product: IAdminProduct) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await ProductService.getProduct(id);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to load product",
        );
        return;
      }

      onSuccess?.(parseAdminProduct(data));
    } catch (error) {
      console.error("Error fetching admin product:", error);
      onError?.("An error occurred while loading the product.");
    }
  }

  async createProduct(
    values: IAdminProductFormValues,
    onSuccess?: (product: IAdminProduct, message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await ProductService.createProduct(values);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to create product",
        );
        return;
      }

      onSuccess?.(parseAdminProduct(data), status.message);
    } catch (error) {
      console.error("Error creating admin product:", error);
      onError?.("An error occurred while creating the product.");
    }
  }

  async updateProduct(
    id: string,
    values: IAdminProductFormValues,
    onSuccess?: (product: IAdminProduct, message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await ProductService.updateProduct(id, values);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to update product",
        );
        return;
      }

      onSuccess?.(parseAdminProduct(data), status.message);
    } catch (error) {
      console.error("Error updating admin product:", error);
      onError?.("An error occurred while updating the product.");
    }
  }

  async deleteProduct(
    id: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await ProductService.deleteProduct(id);
      const { status } = response.data || {};

      if (!status?.success) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to delete product",
        );
        return;
      }

      onSuccess?.(status.message);
    } catch (error) {
      console.error("Error deleting admin product:", error);
      onError?.("An error occurred while deleting the product.");
    }
  }
}

export default new ProductController();
