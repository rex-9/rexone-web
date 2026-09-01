// src/modules/admin/products/product.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductController from "./product.controller";
import ProductService from "./product.service";
import type { IAdminProductFormValues } from "./types";

vi.mock("./product.service", () => ({
  default: {
    getProducts: vi.fn(),
    getProduct: vi.fn(),
    getDiscardedProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    discardProduct: vi.fn(),
    undiscardProduct: vi.fn(),
  },
}));

describe("ProductController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProducts", () => {
    it("calls onSuccess with parsed products and pagination", async () => {
      const mockProducts = [
        {
          id: "p1",
          name: "Pro Plan",
          price_unit_amount: 1999,
          currency: "USD",
          cycle: "month",
          active: true,
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockProducts,
          meta: {
            pagination: {
              page: 1,
              limit: 20,
              total_count: 1,
              total_pages: 1,
            },
          },
        },
      };

      vi.mocked(ProductService.getProducts).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ProductController.getProducts({ page: 1 }, onSuccess, onError);

      expect(ProductService.getProducts).toHaveBeenCalledWith({ page: 1 });
      expect(onSuccess).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "p1" })]),
        expect.objectContaining({ total_count: 1 }),
      );
      expect(onError).not.toHaveBeenCalled();
    });

    it("calls onError on failure", async () => {
      vi.mocked(ProductService.getProducts).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Server Error" },
          data: null,
        },
      } as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ProductController.getProducts(undefined, onSuccess, onError);

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe("getProduct", () => {
    it("calls onSuccess with parsed product on success", async () => {
      const mockProduct = { id: "p1", name: "Pro Plan" };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { product: mockProduct },
        },
      };

      vi.mocked(ProductService.getProduct).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ProductController.getProduct("p1", onSuccess, onError);

      expect(ProductService.getProduct).toHaveBeenCalledWith("p1");
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "p1", name: "Pro Plan" }),
      );
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("getDiscardedProducts", () => {
    it("calls onSuccess with discarded products list", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [{ id: "p2", name: "Old Plan" }],
          meta: {
            pagination: { page: 1, limit: 20, total_count: 1, total_pages: 1 },
          },
        },
      };

      vi.mocked(ProductService.getDiscardedProducts).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ProductController.getDiscardedProducts({ page: 1 }, onSuccess, onError);

      expect(ProductService.getDiscardedProducts).toHaveBeenCalledWith({ page: 1 });
      expect(onSuccess).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "p2" })]),
        expect.objectContaining({ total_count: 1 }),
      );
    });
  });

  describe("createProduct", () => {
    it("calls onSuccess with created product and message", async () => {
      const formValues: IAdminProductFormValues = {
        name: "Enterprise",
        description: "Enterprise tier",
        price_unit_amount: 9900,
        currency: "USD",
        cycle: "year",
        active: true,
      };

      const mockResponse = {
        data: {
          status: { code: 201, success: true, message: "Product created" },
          data: { product: { id: "p3", name: "Enterprise" } },
        },
      };

      vi.mocked(ProductService.createProduct).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ProductController.createProduct(formValues, onSuccess, onError);

      expect(ProductService.createProduct).toHaveBeenCalledWith(formValues);
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "p3" }),
        "Product created",
      );
    });
  });

  describe("updateProduct", () => {
    it("calls onSuccess with updated product", async () => {
      const formValues: IAdminProductFormValues = {
        name: "Enterprise Updated",
        description: "Updated description",
        price_unit_amount: 9900,
        currency: "USD",
        cycle: "year",
        active: true,
      };

      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Product updated" },
          data: { product: { id: "p3", name: "Enterprise Updated" } },
        },
      };

      vi.mocked(ProductService.updateProduct).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ProductController.updateProduct("p3", formValues, onSuccess, onError);

      expect(ProductService.updateProduct).toHaveBeenCalledWith("p3", formValues);
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "p3" }),
        "Product updated",
      );
    });
  });

  describe("discardProduct", () => {
    it("discards product and calls onSuccess with status message", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Product discarded" },
        },
      };

      vi.mocked(ProductService.discardProduct).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ProductController.discardProduct("p1", onSuccess, onError);

      expect(ProductService.discardProduct).toHaveBeenCalledWith("p1");
      expect(onSuccess).toHaveBeenCalledWith("Product discarded");
    });
  });

  describe("undiscardProduct", () => {
    it("undiscards product and calls onSuccess with status message", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Product restored" },
          data: { id: "p1" },
        },
      };

      vi.mocked(ProductService.undiscardProduct).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ProductController.undiscardProduct("p1", onSuccess, onError);

      expect(ProductService.undiscardProduct).toHaveBeenCalledWith("p1");
      expect(onSuccess).toHaveBeenCalledWith("Product restored");
    });
  });
});
