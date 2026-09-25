// src/modules/payment/constants.test.ts
import { describe, it, expect } from "vitest";
import { getStripeMinimumAmount, STRIPE_MINIMUM_AMOUNTS } from "./constants";

describe("getStripeMinimumAmount", () => {
  it("returns 50 for USD, SGD, EUR, AUD, CAD", () => {
    expect(getStripeMinimumAmount("usd")).toBe(50);
    expect(getStripeMinimumAmount("USD")).toBe(50);
    expect(getStripeMinimumAmount("sgd")).toBe(50);
    expect(getStripeMinimumAmount("eur")).toBe(50);
    expect(getStripeMinimumAmount("aud")).toBe(50);
    expect(getStripeMinimumAmount("cad")).toBe(50);
  });

  it("returns 30 for GBP", () => {
    expect(getStripeMinimumAmount("gbp")).toBe(30);
    expect(getStripeMinimumAmount("GBP")).toBe(30);
  });

  it("returns 50 for JPY", () => {
    expect(getStripeMinimumAmount("jpy")).toBe(50);
    expect(getStripeMinimumAmount("JPY")).toBe(50);
  });

  it("returns higher minimums for currencies with higher thresholds", () => {
    expect(getStripeMinimumAmount("thb")).toBe(1000);
    expect(getStripeMinimumAmount("mxn")).toBe(1000);
    expect(getStripeMinimumAmount("hkd")).toBe(400);
    expect(getStripeMinimumAmount("myr")).toBe(200);
  });

  it("falls back to default 50 for unknown or empty currency", () => {
    expect(getStripeMinimumAmount("")).toBe(50);
    expect(getStripeMinimumAmount(undefined)).toBe(50);
    expect(getStripeMinimumAmount("xyz")).toBe(50);
  });

  it("matches all keys in STRIPE_MINIMUM_AMOUNTS", () => {
    for (const [currency, amount] of Object.entries(STRIPE_MINIMUM_AMOUNTS)) {
      expect(getStripeMinimumAmount(currency)).toBe(amount);
    }
  });
});
