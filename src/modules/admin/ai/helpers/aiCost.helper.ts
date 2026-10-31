// src/modules/admin/ai/helpers/aiCost.helper.ts
import { AI_PRICING_CONSTANTS } from "../constants";

export interface IFormatAiCostOptions {
  showCurrency?: boolean;
}

export function formatAiCost(
  cost?: number | null,
  options?: IFormatAiCostOptions,
): string {
  const amount = cost != null && !Number.isNaN(cost) && cost > 0 ? cost : 0;
  const formattedNumber = amount.toFixed(AI_PRICING_CONSTANTS.DECIMALS);
  const symbol = AI_PRICING_CONSTANTS.CURRENCY_SYMBOL;

  if (options?.showCurrency) {
    return `${symbol}${formattedNumber} ${AI_PRICING_CONSTANTS.CURRENCY}`;
  }

  return `${symbol}${formattedNumber}`;
}

export function formatAiRatePerMillion(rate?: number | null): string {
  if (rate == null || Number.isNaN(rate)) return "—";
  const symbol = AI_PRICING_CONSTANTS.CURRENCY_SYMBOL;
  return `${symbol}${Number(rate).toFixed(rate < 1 ? 3 : 2)} / 1M`;
}

