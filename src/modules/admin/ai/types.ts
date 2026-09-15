import type { TSortOrder } from "../../../hooks/useSort";

export interface IAdminAiProfile {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
  provider: string;
  model: string;
  temperature?: number | null;
  max_output_tokens?: number | null;
  context_max_tokens?: number | null;
  history_max_messages?: number | null;
  timeout_seconds?: number | null;
  system_prompt?: string | null;
  settings?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface IAdminAiProfileFormValues {
  key?: string;
  provider?: string;
  name: string;
  enabled: boolean;
  model: string;
  temperature?: number | null;
  max_output_tokens?: number | null;
  context_max_tokens?: number | null;
  history_max_messages?: number | null;
  timeout_seconds?: number | null;
  system_prompt?: string | null;
  settings?: Record<string, unknown> | null;
}

export interface IAdminAiProfileListParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: TSortOrder;
  status?: string;
  provider?: string;
  model?: string;
  search?: string;
}

export interface IAdminAiRun {
  id: string;
  ai_profile_id?: string | null;
  profile_key?: string | null;
  user_id?: string | null;
  chat_message_id?: string | null;
  feature?: string | null;
  provider?: string | null;
  model?: string | null;
  status: string;
  input_messages_count?: number | null;
  input_chars?: number | null;
  output_chars?: number | null;
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  total_tokens?: number | null;
  latency_ms?: number | null;
  error?: string | null;
  request_metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface IAdminAiRunListParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: TSortOrder;
  status?: string;
  feature?: string;
  provider?: string;
  model?: string;
  profile_id?: string;
  profile_key?: string;
  user_id?: string;
  chat_message_id?: string;
  search?: string;
}
