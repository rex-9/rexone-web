// src/modules/feedback/types.ts
import {
  TFeedbackCategory,
  TFeedbackPriority,
  TFeedbackStatus,
} from "./constants";

export interface IFeedbackMetadata {
  app_version?: string;
  screen?: string;
  route?: string;
  locale?: string;
  user_agent?: string;
  [key: string]: unknown;
}

export interface IFeedback {
  id: string;
  content: string;
  rating?: number | null;
  category: TFeedbackCategory;
  priority: TFeedbackPriority;
  status: TFeedbackStatus;
  platform: string;
  app_version?: string | null;
  os?: string | null;
  device?: string | null;
  browser?: string | null;
  page?: string | null;
  metadata?: IFeedbackMetadata;
  admin_notes?: string | null;
  user_id?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ICreateFeedbackRequest {
  content: string;
  rating?: number;
  category?: TFeedbackCategory;
  priority?: TFeedbackPriority;
  app_version?: string;
  os?: string;
  device?: string;
  browser?: string;
  page?: string;
  metadata?: IFeedbackMetadata;
}

export interface IUpdateAdminFeedbackRequest {
  status?: TFeedbackStatus;
  category?: TFeedbackCategory;
  priority?: TFeedbackPriority;
  admin_notes?: string;
}

export interface IFeedbackListParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  status?: TFeedbackStatus;
  category?: TFeedbackCategory;
  priority?: TFeedbackPriority;
  platform?: string;
  user_id?: string;
}
