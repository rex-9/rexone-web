import { describe, expect, it } from "vitest";
import { isTerminalPaymentStatus } from "../../services/payment-status.service";

describe("payment confirmation states", () => {
  it("keeps polling for unpaid and processing Orders", () => {
    expect(isTerminalPaymentStatus("unpaid")).toBe(false);
    expect(isTerminalPaymentStatus("processing")).toBe(false);
  });

  it("stops polling only at an authoritative terminal payment state", () => {
    expect(isTerminalPaymentStatus("paid")).toBe(true);
    expect(isTerminalPaymentStatus("failed")).toBe(true);
    expect(isTerminalPaymentStatus("partially_refunded")).toBe(true);
    expect(isTerminalPaymentStatus("refunded")).toBe(true);
  });
});
