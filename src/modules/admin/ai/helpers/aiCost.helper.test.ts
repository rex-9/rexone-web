import { describe, expect, it } from "vitest";
import { formatAiCost } from "./aiCost.helper";

describe("formatAiCost", () => {
  it("formats positive costs with 6 decimal places and dollar prefix", () => {
    expect(formatAiCost(0.002646)).toBe("$0.002646");
    expect(formatAiCost(0.42)).toBe("$0.420000");
    expect(formatAiCost(15.750123)).toBe("$15.750123");
  });

  it("formats 0, null, undefined, or negative cost as $0.000000", () => {
    expect(formatAiCost(0)).toBe("$0.000000");
    expect(formatAiCost(null)).toBe("$0.000000");
    expect(formatAiCost(undefined)).toBe("$0.000000");
    expect(formatAiCost(-0.05)).toBe("$0.000000");
    expect(formatAiCost(NaN)).toBe("$0.000000");
  });

  it("appends currency code when showCurrency option is true", () => {
    expect(formatAiCost(0.002646, { showCurrency: true })).toBe("$0.002646 usd");
    expect(formatAiCost(0, { showCurrency: true })).toBe("$0.000000 usd");
  });
});
