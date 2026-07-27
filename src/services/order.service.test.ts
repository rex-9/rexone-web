import { beforeEach, describe, expect, it, vi } from "vitest";
import AppRoutes from "../AppRoutes";
import { api } from "./api.service";
import orderService from "./order.service";

const orderDto = {
  id: "order_123",
  order_number: "ORD-123",
  status: "pending" as const,
  payment_status: "unpaid" as const,
  subtotal_cents: 4900,
  discount_cents: 0,
  tax_cents: 0,
  total_cents: 4900,
  currency: "usd",
  paid_at: null,
  created_at: "2026-07-27T00:00:00Z",
  order_items: [
    {
      id: "item_123",
      name: "Annual plan",
      unit_price_cents: 4900,
      quantity: 1,
      total_cents: 4900,
    },
  ],
};

const success = <T>(data: T) => ({
  data: {
    status: { code: 200, success: true, message: "ok" },
    data,
  },
});

describe("OrderService", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("sends only business inputs and normalizes the Order response", async () => {
    const post = vi.spyOn(api, "post").mockResolvedValue(
      success({ order: orderDto }),
    );

    const response = await orderService.createOrder({
      resourceId: "price_basic",
      quantity: 1,
    });
    const order = response.data?.data;

    expect(post).toHaveBeenCalledWith(AppRoutes.server.public.CREATE_ORDER, {
      resource_id: "price_basic",
      quantity: 1,
    });
    expect(order).toMatchObject({
      id: "order_123",
      orderNumber: "ORD-123",
      paymentStatus: "unpaid",
      totalCents: 4900,
      orderItems: [
        {
          id: "item_123",
          unitPriceCents: 4900,
          totalCents: 4900,
        },
      ],
    });
    expect(order).not.toHaveProperty("payment_status");
    expect(order).not.toHaveProperty("order_number");
  });
});
