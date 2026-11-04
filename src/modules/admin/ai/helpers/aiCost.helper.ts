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

export interface IAiTokenBreakdown {
  prompt: number | null;
  cached: number;
  uncached: number | null;
  completion: number | null;
  total: number | null;
  hasCacheHit: boolean;
}

export function resolveAiTokenBreakdown(
  promptTokens?: number | null,
  cachedTokens?: number | null,
  completionTokens?: number | null,
  totalTokens?: number | null,
): IAiTokenBreakdown {
  const prompt =
    promptTokens != null && !Number.isNaN(promptTokens)
      ? Math.max(promptTokens, 0)
      : null;
  const rawCached =
    cachedTokens != null && !Number.isNaN(cachedTokens)
      ? Math.max(cachedTokens, 0)
      : 0;
  const cached = prompt != null ? Math.min(rawCached, prompt) : rawCached;
  const uncached = prompt != null ? Math.max(prompt - cached, 0) : null;
  const completion =
    completionTokens != null && !Number.isNaN(completionTokens)
      ? Math.max(completionTokens, 0)
      : null;
  const total =
    totalTokens != null && !Number.isNaN(totalTokens)
      ? Math.max(totalTokens, 0)
      : prompt != null || completion != null
        ? (prompt ?? 0) + (completion ?? 0)
        : null;

  return {
    prompt,
    cached,
    uncached,
    completion,
    total,
    hasCacheHit: cached > 0,
  };
}

