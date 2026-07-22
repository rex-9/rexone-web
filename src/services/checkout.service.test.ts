import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IOrder, IOrderCheckoutData } from "../models";
import orderService from "./order.service";
import {
  CHECKOUT_ORDER_ID_KEY,
  claimCheckoutSubmission,
  getCheckoutOrderId,
  redirectToCheckout,
  retryOrderCheckout,
  startNewOrderCheckout,
} from "./checkout.service";

const order: IOrder = {
  id: "order_123",
  order_number: "ORD-123",
  status: "pending",
  payment_status: "unpaid",
  total_cents: 4900,
  currency: "usd",
};

const checkout: IOrderCheckoutData = {
  order,
  payment: {
    id: "payment_123",
    payment_number: "PAY-123",
    provider: "stripe",
    status: "pending",
    amount_cents: 4900,
    currency: "usd",
  },
  checkout_url: "https://checkout.stripe.com/example",
};

const success = <T>(data: T) => ({
  data: { status: { code: 200, success: true, message: "ok" }, data },
});

const memoryStorage = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
  };
};

describe("Order Checkout flow", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("creates an Order with only resource_id and quantity, then checks out its ID", async () => {
    const storage = memoryStorage();
    const create = vi.spyOn(orderService, "createOrder").mockResolvedValue(success({ order }));
    const start = vi.spyOn(orderService, "startCheckout").mockResolvedValue(success(checkout));

    await startNewOrderCheckout("price_basic", 1, storage);

    expect(create).toHaveBeenCalledWith({ resource_id: "price_basic", quantity: 1 });
    expect(start).toHaveBeenCalledWith("order_123");
    expect(start.mock.calls[0]).toHaveLength(1);
    expect(storage.getItem(CHECKOUT_ORDER_ID_KEY)).toBe("order_123");
  });

  it("preserves the Order ID when Checkout creation fails", async () => {
    const storage = memoryStorage();
    vi.spyOn(orderService, "createOrder").mockResolvedValue(success({ order }));
    vi.spyOn(orderService, "startCheckout").mockResolvedValue({ data: null, error: "Stripe unavailable" });

    await expect(startNewOrderCheckout("price_basic", 1, storage)).rejects.toThrow("Stripe unavailable");
    expect(getCheckoutOrderId(storage)).toBe("order_123");
  });

  it("retries Checkout for the existing Order without creating another one", async () => {
    const storage = memoryStorage();
    const create = vi.spyOn(orderService, "createOrder");
    const start = vi.spyOn(orderService, "startCheckout").mockResolvedValue(success(checkout));

    await retryOrderCheckout("order_123", storage);

    expect(create).not.toHaveBeenCalled();
    expect(start).toHaveBeenCalledWith("order_123");
  });

  it("redirects to the backend checkout_url", () => {
    const assign = vi.fn();
    redirectToCheckout(checkout.checkout_url, assign);
    expect(assign).toHaveBeenCalledWith(checkout.checkout_url);
  });

  it("prevents duplicate checkout submissions", () => {
    const lock = { current: false };
    expect(claimCheckoutSubmission(lock)).toBe(true);
    expect(claimCheckoutSubmission(lock)).toBe(false);
  });
});
