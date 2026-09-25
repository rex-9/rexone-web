// src/modules/admin/product/currency.utils.ts

export const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
]);

export const THREE_DECIMAL_CURRENCIES = new Set([
  "bhd",
  "jod",
  "kwd",
  "omr",
  "tnd",
]);

/**
 * Returns number of decimal places for a currency code (e.g. 2 for USD, 0 for JPY)
 */
export const getCurrencyDecimals = (currency?: string): number => {
  const code = (currency || "usd").toLowerCase();
  if (ZERO_DECIMAL_CURRENCIES.has(code)) return 0;
  if (THREE_DECIMAL_CURRENCIES.has(code)) return 3;
  return 2;
};

/**
 * Returns symbol or prefix for a currency (e.g. '$' for USD, 'Ks' for MMK)
 */
export const getCurrencySymbol = (currency?: string): string => {
  const code = (currency || "usd").toUpperCase();
  switch (code) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "SGD":
      return "S$";
    case "MMK":
      return "Ks";
    case "AUD":
      return "A$";
    case "CAD":
      return "C$";
    default:
      return code;
  }
};

/**
 * Returns the name of the smallest sub-unit for the currency (e.g. cents, pyas, units)
 */
export const getSubunitName = (currency?: string): string => {
  const code = (currency || "usd").toLowerCase();
  if (getCurrencyDecimals(code) === 0) return "units";
  if (code === "mmk") return "pyas";
  if (code === "gbp") return "pence";
  return "cents";
};

/**
 * Converts minor/smallest unit (integer stored in DB / Stripe) to major units for user input
 * e.g., 1000 cents -> 10.00 dollars
 */
export const toMajorUnits = (
  smallestUnits: number,
  currency?: string,
): number => {
  if (!smallestUnits || isNaN(smallestUnits)) return 0;
  const decimals = getCurrencyDecimals(currency);
  if (decimals === 0) return smallestUnits;
  return Number((smallestUnits / Math.pow(10, decimals)).toFixed(decimals));
};

/**
 * Converts major units (entered by user in UI) to smallest integer units for DB and Stripe
 * e.g., 10.50 dollars -> 1050 cents
 */
export const toSmallestUnits = (
  majorUnits: number,
  currency?: string,
): number => {
  if (!majorUnits || isNaN(majorUnits)) return 0;
  const decimals = getCurrencyDecimals(currency);
  if (decimals === 0) return Math.round(majorUnits);
  return Math.round(majorUnits * Math.pow(10, decimals));
};

/**
 * Formats a real-time conversion string for input feedback
 * e.g. "$10.50 USD (1,050 cents in database & Stripe)"
 */
export const formatPriceFeedback = (
  majorAmount: number,
  currency?: string,
): string => {
  const cur = (currency || "usd").toUpperCase();
  const symbol = getCurrencySymbol(cur);
  const decimals = getCurrencyDecimals(cur);
  const smallest = toSmallestUnits(majorAmount, cur);
  const subunit = getSubunitName(cur);
  const formattedMajor =
    decimals === 0 ? majorAmount.toString() : majorAmount.toFixed(decimals);

  return `${symbol}${formattedMajor} ${cur} (${smallest.toLocaleString()} ${subunit} in database & Stripe)`;
};
