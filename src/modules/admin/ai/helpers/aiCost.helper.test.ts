import { describe, expect, it } from "vitest";
import {
  formatAiCost,
  formatAiRatePerMillion,
  resolveAiTokenBreakdown,
} from "./aiCost.helper";

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

describe("formatAiRatePerMillion", () => {
  it("formats sub-dollar rates with 3 decimals and >= $1 rates with 2 decimals", () => {
    expect(formatAiRatePerMillion(0.14)).toBe("$0.140 / 1M");
    expect(formatAiRatePerMillion(2.5)).toBe("$2.50 / 1M");
    expect(formatAiRatePerMillion(null)).toBe("—");
  });
});

describe("resolveAiTokenBreakdown", () => {
  it("splits prompt tokens into cache hit and cache miss (uncached) tokens", () => {
    expect(resolveAiTokenBreakdown(1000, 600, 250, 1250)).toEqual({
      prompt: 1000,
      cached: 600,
      uncached: 400,
      completion: 250,
      total: 1250,
      hasCacheHit: true,
    });
  });

  it("marks cache miss when cached tokens is 0 or absent and clamps cached <= prompt", () => {
    expect(resolveAiTokenBreakdown(800, 0, 120, 920)).toEqual({
      prompt: 800,
      cached: 0,
      uncached: 800,
      completion: 120,
      total: 920,
      hasCacheHit: false,
    });

    expect(resolveAiTokenBreakdown(500, 900, 100, null)).toEqual({
      prompt: 500,
      cached: 500,
      uncached: 0,
      completion: 100,
      total: 600,
      hasCacheHit: true,
    });
  });
});
