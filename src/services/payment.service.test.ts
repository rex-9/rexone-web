import { beforeEach, describe, expect, it, vi } from "vitest";
import AppRoutes from "../AppRoutes";
import { api } from "./api.service";
import paymentService from "./payment.service";

const success = <T>(data: T) => ({
  data: {
    status: { code: 200, success: true, message: "ok" },
    data,
  },
});

describe("PaymentService", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("creates a price-based PaymentIntent without sending an amount", async () => {
    const post = vi.spyOn(api, "post").mockResolvedValue(
      success({
        payment_intent_id: "pi_123",
        client_secret: "secret_123",
        status: "requires_payment_method" as const,
      }),
    );

    const response = await paymentService.createPaymentIntent(
      "order_123",
      "prod_123",
      "price_123",
      2,
    );

    expect(post).toHaveBeenCalledWith(
      AppRoutes.server.protected.CREATE_PAYMENT_INTENT,
      {
        payment: {
          product_id: "prod_123",
          price_id: "price_123",
          quantity: 2,
          payment_method_type: "card",
          metadata: { order_id: "order_123" },
        },
      },
    );
    expect(post.mock.calls[0]?.[1]).not.toHaveProperty("amount");
    expect(post.mock.calls[0]?.[1]).not.toHaveProperty("amount_cents");
    expect(response.data?.data).toEqual({
      paymentIntentId: "pi_123",
      clientSecret: "secret_123",
      status: "requires_payment_method",
    });
  });
});
