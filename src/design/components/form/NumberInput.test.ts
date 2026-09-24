import { describe, expect, it } from "vitest";
import { sanitizeNumericInput } from "./NumberInput";

describe("sanitizeNumericInput", () => {
  it("strips leading zeros from integers (e.g. 05 -> 5)", () => {
    expect(sanitizeNumericInput("05")).toBe("5");
    expect(sanitizeNumericInput("007")).toBe("7");
    expect(sanitizeNumericInput("0123")).toBe("123");
  });

  it("handles standalone zero and multiple zeros properly (e.g. 00 -> 0)", () => {
    expect(sanitizeNumericInput("0")).toBe("0");
    expect(sanitizeNumericInput("00")).toBe("0");
    expect(sanitizeNumericInput("000")).toBe("0");
  });

  it("preserves valid decimal fractions starting with 0. (e.g. 0.5)", () => {
    expect(sanitizeNumericInput("0.5")).toBe("0.5");
    expect(sanitizeNumericInput("0.05")).toBe("0.05");
    expect(sanitizeNumericInput("0.00")).toBe("0.00");
  });

  it("removes non-numeric characters", () => {
    expect(sanitizeNumericInput("abc123def")).toBe("123");
    expect(sanitizeNumericInput("$50.00")).toBe("50.00");
  });

  it("normalizes leading zero when decimals are typed without leading digit (e.g. .5 -> 0.5)", () => {
    expect(sanitizeNumericInput(".5")).toBe("0.5");
  });

  it("handles negative numbers if allowNegative is enabled", () => {
    expect(sanitizeNumericInput("-05", true, true)).toBe("-5");
    expect(sanitizeNumericInput("-10", true, true)).toBe("-10");
  });
});
