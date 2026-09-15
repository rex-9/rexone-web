// src/modules/admin/ai/constants.ts

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

export type TAdminAiRunStatus =
  (typeof ADMIN_AI_RUN_STATUS)[keyof typeof ADMIN_AI_RUN_STATUS];

export const AI_PROVIDERS = {
  DEEPSEEK: "deepseek",
  GEMINI: "gemini",
} as const;

export const AI_PROVIDER_OPTIONS = [
  { value: "deepseek", label: "DeepSeek" },
  { value: "gemini", label: "Google Gemini" },
] as const;

export const AI_PROVIDER_MODELS: Record<
  string,
  { value: string; label: string }[]
> = {
  deepseek: [
    { value: "deepseek-chat", label: "DeepSeek Chat (V3)" },
    { value: "deepseek-reasoner", label: "DeepSeek Reasoner (R1)" },
    { value: "deepseek-v4-flash", label: "DeepSeek V4 Flash" },
  ],
  gemini: [
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  ],
};

export const AI_PROFILE_KEY_PRESETS = [
  { value: "chat_default", label: "chat_default (Default Chat)" },
  { value: "customer_support", label: "customer_support (Customer Support)" },
  { value: "code_assistant", label: "code_assistant (Code Assistant)" },
  { value: "summarize", label: "summarize (Summarization)" },
  { value: "translate", label: "translate (Translation)" },
  { value: "analyze", label: "analyze (Analysis)" },
] as const;

export const ADMIN_AI_RUN_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "completed", label: "Completed" },
  { value: "processing", label: "Processing" },
  { value: "failed", label: "Failed" },
  { value: "queued", label: "Queued" },
] as const;

export const ADMIN_AI_FEATURE_OPTIONS = [
  { value: "", label: "All Features" },
  { value: "chat", label: "Chat" },
  { value: "summarize", label: "Summarize" },
  { value: "translate", label: "Translate" },
  { value: "analyze", label: "Analyze" },
] as const;

export const ADMIN_AI_PROFILE_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;
