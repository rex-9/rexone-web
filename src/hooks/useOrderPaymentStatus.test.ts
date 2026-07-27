import { describe, expect, it } from "vitest";
import { isTerminalPaymentStatus } from "./useOrderPaymentStatus";

describe("payment confirmation states", () => {
  it("keeps polling for incomplete PaymentIntents", () => {
    expect(isTerminalPaymentStatus("requires_payment_method")).toBe(false);
    expect(isTerminalPaymentStatus("processing")).toBe(false);
  });

  it("stops polling only at an authoritative terminal payment state", () => {
    expect(isTerminalPaymentStatus("succeeded")).toBe(true);
    expect(isTerminalPaymentStatus("canceled")).toBe(true);
  });
});
