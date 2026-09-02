// src/helpers/date.helper.ts

const MONTH_ABBREVIATIONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Format a date/time value into 24-hour format: `01 Sept 26 - 13:51:40`
 */
export const formatDateTime = (
  value?: Date | string | number | null,
): string => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Not available";

  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTH_ABBREVIATIONS[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day} ${month} ${year} - ${hours}:${minutes}:${seconds}`;
};

export const formatAdminDate = formatDateTime;

export default formatDateTime;
