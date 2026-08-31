// src/modules/admin/analytics/hooks/useAnalytics.test.ts
import { describe, it, expect } from "vitest";
import { getPeriodStaleTime } from "./useAnalytics";
import { ANALYTICS_PERIODS } from "../../constants";

describe("useAnalytics - Stale Time Calculation", () => {
  it("assigns 2 minutes stale time for today (live period)", () => {
    expect(getPeriodStaleTime(ANALYTICS_PERIODS.TODAY)).toBe(2 * 60 * 1000);
  });

  it("assigns Infinity stale time for yesterday (closed daily period)", () => {
    expect(getPeriodStaleTime(ANALYTICS_PERIODS.YESTERDAY)).toBe(Infinity);
  });

  it("assigns Infinity stale time for last_month (immutable historical period in IndexedDB)", () => {
    expect(getPeriodStaleTime(ANALYTICS_PERIODS.LAST_MONTH)).toBe(Infinity);
  });

  it("assigns Infinity stale time for last_year (immutable historical period in IndexedDB)", () => {
    expect(getPeriodStaleTime(ANALYTICS_PERIODS.LAST_YEAR)).toBe(Infinity);
  });

  it("assigns default 5 minutes stale time for dynamic 7d and 30d periods", () => {
    expect(getPeriodStaleTime(ANALYTICS_PERIODS.SEVEN_DAYS)).toBe(
      5 * 60 * 1000,
    );
    expect(getPeriodStaleTime(ANALYTICS_PERIODS.THIRTY_DAYS)).toBe(
      5 * 60 * 1000,
    );
    expect(getPeriodStaleTime(ANALYTICS_PERIODS.THIS_MONTH)).toBe(
      5 * 60 * 1000,
    );
  });

  it("assigns Infinity stale time for past completed custom months", () => {
    expect(
      getPeriodStaleTime(ANALYTICS_PERIODS.CUSTOM, "2026-05-31T23:59:59.999Z"),
    ).toBe(Infinity);
  });
});
