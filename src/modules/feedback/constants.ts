// src/modules/feedback/constants.ts

export const FEEDBACK_STATUS = {
  NEW: "new",
  REVIEWED: "reviewed",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

export type TFeedbackStatus = (typeof FEEDBACK_STATUS)[keyof typeof FEEDBACK_STATUS];

export const FEEDBACK_CATEGORIES = {
  BUG: "bug",
  FEATURE_REQUEST: "feature_request",
  IMPROVEMENT: "improvement",
  GENERAL: "general",
} as const;

export type TFeedbackCategory = (typeof FEEDBACK_CATEGORIES)[keyof typeof FEEDBACK_CATEGORIES];

export const FEEDBACK_PRIORITIES = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export type TFeedbackPriority = (typeof FEEDBACK_PRIORITIES)[keyof typeof FEEDBACK_PRIORITIES];

export const FEEDBACK_RATINGS = {
  MIN: 1,
  MAX: 10,
  DEFAULT: 8,
} as const;
