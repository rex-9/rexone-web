// src/modules/admin/analytics/helpers/analyticsDate.helper.test.ts
import { describe, it, expect } from "vitest";
import {
  calculateUtcRangeForPreset,
  calculateUtcRangeForMonth,
  calculateUtcRangeForYear,
  formatUtcToLocalLabel,
} from "./analyticsDate.helper";
import { ANALYTICS_PERIODS } from "../../constants";

describe("analyticsDate.helper", () => {
  it("calculates ISO UTC date ranges for presets", () => {
    const todayRange = calculateUtcRangeForPreset(ANALYTICS_PERIODS.TODAY);
    expect(todayRange.startDate).toBeDefined();
    expect(todayRange.endDate).toBeDefined();
    expect(new Date(todayRange.startDate).getTime()).toBeLessThan(
      new Date(todayRange.endDate).getTime(),
    );

    const yearRange = calculateUtcRangeForPreset(ANALYTICS_PERIODS.THIS_YEAR);
    expect(yearRange.startDate).toBeDefined();
    expect(yearRange.endDate).toBeDefined();
  });

  it("calculates ISO UTC date range for a specific month", () => {
    const monthRange = calculateUtcRangeForMonth(2026, 6); // July 2026 (0-indexed 6)
    expect(new Date(monthRange.startDate).getTime()).toBe(
      new Date(2026, 6, 1, 0, 0, 0, 0).getTime(),
    );
    expect(monthRange.endDate).toBeDefined();
  });

  it("calculates ISO UTC date range for a specific year", () => {
    const yearRange = calculateUtcRangeForYear(2025);
    expect(new Date(yearRange.startDate).getTime()).toBe(
      new Date(2025, 0, 1, 0, 0, 0, 0).getTime(),
    );
    expect(yearRange.endDate).toBeDefined();
  });

  it("formats UTC timestamp to local label based on grain", () => {
    const testUtc = "2026-08-31T12:00:00.000Z";
    expect(formatUtcToLocalLabel(testUtc, "hourly")).toBeTruthy();
    expect(formatUtcToLocalLabel(testUtc, "daily")).toBeTruthy();
    expect(formatUtcToLocalLabel(testUtc, "monthly")).toBeTruthy();
  });
});
