// src/modules/admin/analytics/hooks/useAnalytics.ts
import { useQuery } from "@tanstack/react-query";
import { ANALYTICS_PERIODS, TAnalyticsPeriod } from "../../constants";
import analyticsController from "../analytics.controller";
import { IAnalyticsOverview, IAnalyticsParams } from "../types";

const TWO_MINUTES_MS = 2 * 60 * 1000;
const FIVE_MINUTES_MS = 5 * 60 * 1000;

export const getPeriodStaleTime = (
  period?: TAnalyticsPeriod | string,
  endDate?: string,
): number => {
  if (period === ANALYTICS_PERIODS.TODAY) {
    return TWO_MINUTES_MS;
  }
  if (
    period === ANALYTICS_PERIODS.YESTERDAY ||
    period === ANALYTICS_PERIODS.LAST_MONTH ||
    period === ANALYTICS_PERIODS.LAST_YEAR
  ) {
    return Infinity; // Completed historical period, immutable in IndexedDB
  }

  // If a custom period has an end_date before the start of today, it's immutable history
  if (period === ANALYTICS_PERIODS.CUSTOM && endDate) {
    const end = new Date(endDate);
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    if (end < startOfToday) {
      return Infinity;
    }
  }

  return FIVE_MINUTES_MS;
};

export const useAnalytics = (params?: IAnalyticsParams) => {
  const period = params?.period || ANALYTICS_PERIODS.THIRTY_DAYS;
  const queryParams: IAnalyticsParams = {
    period,
    start_date: params?.start_date,
    end_date: params?.end_date,
  };
  const staleTime = getPeriodStaleTime(period, params?.end_date);

  return useQuery<IAnalyticsOverview, Error>({
    queryKey: [
      "admin",
      "analytics",
      period,
      params?.start_date,
      params?.end_date,
    ],
    queryFn: async () => {
      const result = await analyticsController.getOverview(queryParams);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch analytics");
      }
      return result.data;
    },
    staleTime,
    refetchOnWindowFocus: period === ANALYTICS_PERIODS.TODAY,
  });
};
