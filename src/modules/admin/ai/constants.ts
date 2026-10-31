// src/modules/admin/ai/constants.ts

export const ADMIN_AI_FILTER = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export const ADMIN_AI_PROFILE_SORT_KEYS = {
  CREATED_AT: "created_at",
  KEY: "key",
  NAME: "name",
  TEMPERATURE: "temperature",
  PROVIDER: "provider",
  MODEL: "model",
  ENABLED: "enabled",
} as const;

export const ADMIN_AI_RUN_SORT_KEYS = {
  CREATED_AT: "created_at",
  LATENCY_MS: "latency_ms",
  TOTAL_TOKENS: "total_tokens",
  COST: "cost",
  FEATURE: "feature",
  STATUS: "status",
  MODEL: "model",
  PROVIDER: "provider",
} as const;

export const ADMIN_AI_RUN_STATUS = {
  QUEUED: "queued",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const AI_PRICING_CONSTANTS = {
  DECIMALS: 6,
  CURRENCY: "usd",
  CURRENCY_SYMBOL: "$",
} as const;

export type TAdminAiRunStatus =
  (typeof ADMIN_AI_RUN_STATUS)[keyof typeof ADMIN_AI_RUN_STATUS];

export const AI_CUSTOM_MODEL_OPTION = "__custom__";

export const ADMIN_AI_RUN_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: ADMIN_AI_RUN_STATUS.COMPLETED, label: "Completed" },
  { value: ADMIN_AI_RUN_STATUS.PROCESSING, label: "Processing" },
  { value: ADMIN_AI_RUN_STATUS.FAILED, label: "Failed" },
  { value: ADMIN_AI_RUN_STATUS.QUEUED, label: "Queued" },
] as const;

export const ADMIN_AI_PROFILE_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: ADMIN_AI_FILTER.ACTIVE, label: "Active" },
  { value: ADMIN_AI_FILTER.INACTIVE, label: "Inactive" },
] as const;
