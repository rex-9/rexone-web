// src/modules/log/types.ts

import { SEVERITIES, PLATFORMS, ENVIRONMENTS } from "./constants";

export type Severity = (typeof SEVERITIES)[number];
export type Platform = (typeof PLATFORMS)[number];
export type Environment = (typeof ENVIRONMENTS)[number];

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
