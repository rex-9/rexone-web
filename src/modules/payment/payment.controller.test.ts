import { describe, it, expect, vi, beforeEach } from "vitest";
import PaymentController from "./payment.controller";
import { PaymentService } from "./index";
import { IAccess, IProduct, ISubscription, ITransaction } from "./types";

vi.mock("./index", () => ({
  PaymentService: {
    getProducts: vi.fn(),
    getAccesses: vi.fn(),
    getActiveAccesses: vi.fn(),
    getSubscriptions: vi.fn(),
    cancelSubscription: vi.fn(),
    resumeSubscription: vi.fn(),
    getTransactions: vi.fn(),
    createCheckout: vi.fn(),
    validateCoupon: vi.fn(),
  },
}));

const mockProduct: IProduct = {
  id: "prod-1",
  name: "Pro Plan",
  description: "Unlimited access",
  price: 29,
  currency: "USD",
  active: true,
  interval: "month",
} as any;

const mockAccess: IAccess = {
  id: "acc-1",
  product_id: "prod-1",
  status: "active",
  granted_at: "2026-09-01T00:00:00Z",
  expires_at: "2026-10-01T00:00:00Z",
  active: true,
} as any;

const mockSubscription: ISubscription = {
  id: "sub-1",
  product_id: "prod-1",
  status: "active",
  current_period_end: "2026-10-01T00:00:00Z",
} as any;

const mockTransaction: ITransaction = {
  id: "txn-1",
  unit_amount: 2900,
  price: "USD 29.00",
  currency: "USD",
  status: "completed",
  created_at: "2026-09-01T00:00:00Z",
} as any;

describe("PaymentController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProducts", () => {
    it("returns paginated products on success", async () => {
      vi.mocked(PaymentService.getProducts).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [{ id: "prod-1", type: "product", attributes: mockProduct }] as any,
          meta: { pagination: { current_page: 1, total_pages: 1, total_count: 1, limit: 10 } } as any,
        },
      });

      const result = await PaymentController.getProducts();
      expect(result.success).toBe(true);
      expect(result.products.length).toBe(1);
      expect(result.products[0].id).toBe("prod-1");
    });

    it("returns error on failure", async () => {
      vi.mocked(PaymentService.getProducts).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Error" },
          data: null as any,
        },
      });

      const result = await PaymentController.getProducts();
      expect(result.success).toBe(false);
      expect(result.products).toEqual([]);
    });
  });

  describe("getAccesses and getActiveAccesses", () => {
    it("returns user access entitlements", async () => {
      vi.mocked(PaymentService.getAccesses).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [{ id: "acc-1", type: "access", attributes: mockAccess }] as any,
          meta: { pagination: { current_page: 1, total_pages: 1, total_count: 1, limit: 10 } } as any,
        },
      });

      const result = await PaymentController.getAccesses();
      expect(result.success).toBe(true);
      expect(result.accesses.length).toBe(1);
    });

    it("returns active accesses", async () => {
      vi.mocked(PaymentService.getActiveAccesses).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [{ id: "acc-1", type: "access", attributes: mockAccess }] as any,
          meta: { pagination: { current_page: 1, total_pages: 1, total_count: 1, limit: 10 } } as any,
        },
      });

      const result = await PaymentController.getActiveAccesses();
      expect(result.success).toBe(true);
      expect(result.accesses.length).toBe(1);
    });
  });

  describe("getSubscriptions, cancelSubscription, resumeSubscription", () => {
    it("returns subscriptions", async () => {
      vi.mocked(PaymentService.getSubscriptions).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [{ id: "sub-1", type: "subscription", attributes: mockSubscription }] as any,
          meta: { pagination: { current_page: 1, total_pages: 1, total_count: 1, limit: 10 } } as any,
        },
      });

      const result = await PaymentController.getSubscriptions();
      expect(result.success).toBe(true);
      expect(result.subscriptions.length).toBe(1);
    });

    it("cancels a subscription", async () => {
      vi.mocked(PaymentService.cancelSubscription).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Subscription canceled" },
          data: { ...mockSubscription, status: "canceled" },
        },
      });

      const result = await PaymentController.cancelSubscription("sub-1");
      expect(result.success).toBe(true);
      expect(result.message).toBe("Subscription canceled");
    });

    it("resumes a subscription", async () => {
      vi.mocked(PaymentService.resumeSubscription).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Subscription resumed" },
          data: mockSubscription,
        },
      });

      const result = await PaymentController.resumeSubscription("sub-1");
      expect(result.success).toBe(true);
      expect(result.message).toBe("Subscription resumed");
    });
  });

  describe("getTransactions", () => {
    it("returns paginated transactions", async () => {
      vi.mocked(PaymentService.getTransactions).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [{ id: "txn-1", type: "transaction", attributes: mockTransaction }] as any,
          meta: { pagination: { current_page: 1, total_pages: 1, total_count: 1, limit: 10 } } as any,
        },
      });

      const result = await PaymentController.getTransactions();
      expect(result.success).toBe(true);
      expect(result.transactions.length).toBe(1);
    });
  });

  describe("createCheckout", () => {
    it("handles checkout URL redirection response", async () => {
      vi.mocked(PaymentService.createCheckout).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { checkout_url: "https://checkout.stripe.com/test" },
        },
      });

      const result = await PaymentController.createCheckout("prod-1");
      expect(result.success).toBe(true);
      expect(result.checkoutUrl).toBe("https://checkout.stripe.com/test");
    });

    it("handles free access grant response", async () => {
      vi.mocked(PaymentService.createCheckout).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Free access granted" },
          data: { free_access_granted: true },
        },
      });

      const result = await PaymentController.createCheckout("free-prod");
      expect(result.success).toBe(true);
      expect(result.freeAccessGranted).toBe(true);
    });

    it("passes coupon code to checkout creation", async () => {
      vi.mocked(PaymentService.createCheckout).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: {
            checkout_url: "https://checkout.stripe.com/test",
            coupon_code: "SAVE20",
            discount_amount: 200,
          },
        },
      });

      const result = await PaymentController.createCheckout("prod-1", "SAVE20");
      expect(result.success).toBe(true);
      expect(result.couponCode).toBe("SAVE20");
      expect(PaymentService.createCheckout).toHaveBeenCalledWith(
        "prod-1",
        undefined,
        undefined,
        "SAVE20",
      );
    });
  });

  describe("validateCoupon", () => {
    it("returns validation result when coupon is valid", async () => {
      vi.mocked(PaymentService.validateCoupon).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Valid" },
          data: {
            valid: true,
            original_amount: 1000,
            discount_amount: 200,
            final_amount: 800,
            currency: "usd",
          },
        },
      });

      const result = await PaymentController.validateCoupon("SAVE20", "prod-1");
      expect(result.success).toBe(true);
      expect(result.data?.discount_amount).toBe(200);
      expect(result.data?.final_amount).toBe(800);
    });

    it("returns error and attempt data when coupon validation fails", async () => {
      vi.mocked(PaymentService.validateCoupon).mockResolvedValue({
        data: {
          status: { code: 422, success: false, message: "Invalid coupon" },
          data: {
            valid: false,
            remaining_attempts: 2,
            cooldown_remaining: 0,
          } as any,
        },
      });

      const result = await PaymentController.validateCoupon("INVALID", "prod-1");
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.remaining_attempts).toBe(2);
      expect(result.cooldown_remaining).toBe(0);
    });

    it("returns cooldown data when rate limited", async () => {
      vi.mocked(PaymentService.validateCoupon).mockResolvedValue({
        data: {
          status: { code: 429, success: false, message: "Too many attempts" },
          data: {
            valid: false,
            remaining_attempts: 0,
            cooldown_remaining: 30,
          } as any,
        },
      });

      const result = await PaymentController.validateCoupon("INVALID", "prod-1");
      expect(result.success).toBe(false);
      expect(result.remaining_attempts).toBe(0);
      expect(result.cooldown_remaining).toBe(30);
    });
  });
});
