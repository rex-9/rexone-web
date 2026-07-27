import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IOrder } from "../models";
import { orderService, paymentService } from "../services";
import {
  createOrderPaymentIntent,
  getPaymentIntentId,
  getPaymentOrderId,
} from "./useOrderPayment";

const order: IOrder = {
  id: "order_123",
  orderNumber: "ORD-123",
  status: "pending",
  paymentStatus: "unpaid",
  subtotalCents: 4900,
  discountCents: 0,
  taxCents: 0,
  totalCents: 4900,
  currency: "usd",
  paidAt: null,
  createdAt: "2026-07-28T00:00:00Z",
  orderItems: [],
};

const success = <T>(data: T) => ({
  data: {
    status: { code: 200, success: true, message: "ok" },
    data,
  },
});

const memoryStorage = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
  };
};

describe("Order Payment flow", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("creates an Order before requesting a price-based PaymentIntent", async () => {
    const storage = memoryStorage();
    vi.spyOn(orderService, "createOrder").mockResolvedValue(success(order));
    const createIntent = vi
      .spyOn(paymentService, "createPaymentIntent")
      .mockResolvedValue(
        success({
          paymentIntentId: "pi_123",
          clientSecret: "secret_123",
          status: "requires_payment_method" as const,
        }),
      );

    await createOrderPaymentIntent({
      productId: "prod_123",
      quantity: 1,
      resourceId: "price_123",
      storage,
    });

    expect(createIntent).toHaveBeenCalledWith(
      "order_123",
      "prod_123",
      "price_123",
      1,
    );
    expect(getPaymentOrderId(storage)).toBe("order_123");
    expect(getPaymentIntentId(storage, "order_123")).toBe("pi_123");
  });
});
