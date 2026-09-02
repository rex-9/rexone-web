// src/modules/log/types.ts

import { LOG_SEVERITIES, LOG_PLATFORMS, LOG_ENVIRONMENTS } from "./constants";

export type Severity = (typeof LOG_SEVERITIES)[keyof typeof LOG_SEVERITIES];
export type Platform = (typeof LOG_PLATFORMS)[keyof typeof LOG_PLATFORMS];
export type Environment = (typeof LOG_ENVIRONMENTS)[keyof typeof LOG_ENVIRONMENTS];

export interface ILogPayload {
  message: string;
  severity?: Severity;
  context?: Record<string, unknown>;
  stack_trace?: string[];
  local_storage_keys?: string[];
  session_storage_keys?: string[];
  cookies?: Record<string, string>;
  platform?: Platform | null;
  environment?: Environment | null;
  app_version?: string | null;
  browser?: string | null;
  os?: string | null;
  os_version?: string | null;
  device?: string | null;
  user_agent?: string | null;
  url?: string | null;
  method?: string | null;
}

export interface ILogResponse {
  id: string;
}
