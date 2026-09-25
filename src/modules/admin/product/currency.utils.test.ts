// src/modules/admin/product/currency.utils.test.ts
import { describe, it, expect } from "vitest";
import {
  getCurrencyDecimals,
  getCurrencySymbol,
  getSubunitName,
  toMajorUnits,
  toSmallestUnits,
  formatPriceFeedback,
} from "./currency.utils";

describe("currency.utils", () => {
  describe("getCurrencyDecimals", () => {
    it("returns 2 for USD, EUR, SGD, MMK", () => {
      expect(getCurrencyDecimals("usd")).toBe(2);
      expect(getCurrencyDecimals("USD")).toBe(2);
      expect(getCurrencyDecimals("eur")).toBe(2);
      expect(getCurrencyDecimals("sgd")).toBe(2);
      expect(getCurrencyDecimals("mmk")).toBe(2);
    });

    it("returns 0 for JPY, KRW, VND", () => {
      expect(getCurrencyDecimals("jpy")).toBe(0);
      expect(getCurrencyDecimals("JPY")).toBe(0);
      expect(getCurrencyDecimals("krw")).toBe(0);
      expect(getCurrencyDecimals("vnd")).toBe(0);
    });

    it("returns 3 for BHD, KWD", () => {
      expect(getCurrencyDecimals("bhd")).toBe(3);
      expect(getCurrencyDecimals("kwd")).toBe(3);
    });
  });

  describe("getCurrencySymbol", () => {
    it("returns correct symbols", () => {
      expect(getCurrencySymbol("usd")).toBe("$");
      expect(getCurrencySymbol("sgd")).toBe("S$");
      expect(getCurrencySymbol("mmk")).toBe("Ks");
      expect(getCurrencySymbol("eur")).toBe("€");
      expect(getCurrencySymbol("gbp")).toBe("£");
      expect(getCurrencySymbol("jpy")).toBe("¥");
    });
  });

  describe("getSubunitName", () => {
    it("returns correct subunit names", () => {
      expect(getSubunitName("usd")).toBe("cents");
      expect(getSubunitName("sgd")).toBe("cents");
      expect(getSubunitName("mmk")).toBe("pyas");
      expect(getSubunitName("gbp")).toBe("pence");
      expect(getSubunitName("jpy")).toBe("units");
    });
  });

  describe("toMajorUnits & toSmallestUnits conversion", () => {
    it("converts 2-decimal currencies accurately", () => {
      expect(toMajorUnits(1000, "usd")).toBe(10);
      expect(toMajorUnits(1050, "usd")).toBe(10.5);
      expect(toSmallestUnits(10.5, "usd")).toBe(1050);
      expect(toSmallestUnits(10, "usd")).toBe(1000);

      // MMK
      expect(toMajorUnits(500000, "mmk")).toBe(5000);
      expect(toSmallestUnits(5000, "mmk")).toBe(500000);
    });

    it("converts 0-decimal currencies accurately", () => {
      expect(toMajorUnits(1000, "jpy")).toBe(1000);
      expect(toSmallestUnits(1000, "jpy")).toBe(1000);
    });
  });

  describe("formatPriceFeedback", () => {
    it("provides readable live breakdown", () => {
      const feedbackUsd = formatPriceFeedback(10.5, "usd");
      expect(feedbackUsd).toBe("$10.50 USD (1,050 cents in database & Stripe)");

      const feedbackMmk = formatPriceFeedback(5000, "mmk");
      expect(feedbackMmk).toBe("Ks5000.00 MMK (500,000 pyas in database & Stripe)");

      const feedbackJpy = formatPriceFeedback(500, "jpy");
      expect(feedbackJpy).toBe("¥500 JPY (500 units in database & Stripe)");
    });
  });
});
