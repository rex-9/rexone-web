import {
  ANALYTICS_GRAINS,
  ANALYTICS_PERIODS,
  TAnalyticsPeriod,
} from "../../constants";

export interface IUtcDateRange {
  startDate: string; // ISO 8601 UTC
  endDate: string; // ISO 8601 UTC
}

/**
 * Calculates local start/end boundaries for a given period in browser local time,
 * then converts them into ISO 8601 UTC strings to send to the backend.
 */
export const calculateUtcRangeForPreset = (
  period: TAnalyticsPeriod,
): IUtcDateRange => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  let localStart: Date;
  let localEnd: Date;

  switch (period) {
    case ANALYTICS_PERIODS.TODAY:
      localStart = new Date(year, month, date, 0, 0, 0, 0);
      localEnd = new Date(year, month, date, 23, 59, 59, 999);
      break;

    case ANALYTICS_PERIODS.YESTERDAY:
      localStart = new Date(year, month, date - 1, 0, 0, 0, 0);
      localEnd = new Date(year, month, date - 1, 23, 59, 59, 999);
      break;

    case ANALYTICS_PERIODS.SEVEN_DAYS:
      localStart = new Date(year, month, date - 6, 0, 0, 0, 0);
      localEnd = new Date(year, month, date, 23, 59, 59, 999);
      break;

    case ANALYTICS_PERIODS.THIS_MONTH:
      localStart = new Date(year, month, 1, 0, 0, 0, 0);
      localEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
      break;

    case ANALYTICS_PERIODS.LAST_MONTH:
      localStart = new Date(year, month - 1, 1, 0, 0, 0, 0);
      localEnd = new Date(year, month, 0, 23, 59, 59, 999);
      break;

    case ANALYTICS_PERIODS.THIS_YEAR:
      localStart = new Date(year, 0, 1, 0, 0, 0, 0);
      localEnd = new Date(year, 11, 31, 23, 59, 59, 999);
      break;

    case ANALYTICS_PERIODS.LAST_YEAR:
      localStart = new Date(year - 1, 0, 1, 0, 0, 0, 0);
      localEnd = new Date(year - 1, 11, 31, 23, 59, 59, 999);
      break;

    case ANALYTICS_PERIODS.THIRTY_DAYS:
    default:
      localStart = new Date(year, month, date - 29, 0, 0, 0, 0);
      localEnd = new Date(year, month, date, 23, 59, 59, 999);
      break;
  }

  return {
    startDate: localStart.toISOString(),
    endDate: localEnd.toISOString(),
  };
};

/**
 * Calculates local start/end boundaries for a specific month in browser local time
 * and converts to ISO 8601 UTC strings.
 */
export const calculateUtcRangeForMonth = (
  year: number,
  monthIndex: number,
): IUtcDateRange => {
  const localStart = new Date(year, monthIndex, 1, 0, 0, 0, 0);
  const localEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

  return {
    startDate: localStart.toISOString(),
    endDate: localEnd.toISOString(),
  };
};

/**
 * Calculates local start/end boundaries for a specific year in browser local time
 * and converts to ISO 8601 UTC strings.
 */
export const calculateUtcRangeForYear = (year: number): IUtcDateRange => {
  const localStart = new Date(year, 0, 1, 0, 0, 0, 0);
  const localEnd = new Date(year, 11, 31, 23, 59, 59, 999);

  return {
    startDate: localStart.toISOString(),
    endDate: localEnd.toISOString(),
  };
};

/**
 * Formats a UTC ISO timestamp or date key into local browser representation for chart display.
 */
export const formatUtcToLocalLabel = (
  utcIsoString: string,
  grain: "hourly" | "daily" | "monthly",
): string => {
  try {
    const d = new Date(utcIsoString);
    if (isNaN(d.getTime())) return utcIsoString;

    if (grain === ANALYTICS_GRAINS.HOURLY) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (grain === ANALYTICS_GRAINS.MONTHLY) {
      return d.toLocaleDateString([], { month: "short", year: "numeric" });
    }
    // daily
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return utcIsoString;
  }
};
