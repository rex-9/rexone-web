// src/design/constants/badge.constants.ts

/**
 * Rexone Design System - Badge Constants & Categories
 */

export const BadgeVariants = {
  DEFAULT: "default",
  NEON: "neon",
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  INFO: "info",
} as const;

export type BadgeVariant = (typeof BadgeVariants)[keyof typeof BadgeVariants];

export const BadgeStatuses = {
  ACTIVE: "active",
  RESOLVED: "resolved",
  SUCCESS: "success",
  COMPLETED: "completed",
  PAID: "paid",
  IN_PROGRESS: "in_progress",
  PENDING: "pending",
  TRIALING: "trialing",
  WARNING: "warning",
  EXPIRED: "expired",
  REVOKED: "revoked",
  FAILED: "failed",
  CLOSED: "closed",
  DISCARDED: "discarded",
  ERROR: "error",
  CANCELED: "canceled",
  PAST_DUE: "past_due",
  NEW: "new",
  INFO: "info",
  PAUSED: "paused",
} as const;

export type BadgeStatus = (typeof BadgeStatuses)[keyof typeof BadgeStatuses];

export const BadgePriorities = {
  CRITICAL: "critical",
  URGENT: "urgent",
  HIGH: "high",
  MEDIUM: "medium",
  NORMAL: "normal",
  LOW: "low",
} as const;

export type BadgePriority =
  (typeof BadgePriorities)[keyof typeof BadgePriorities];

export const BadgeSeverities = {
  FATAL: "fatal",
  ERROR: "error",
  WARN: "warn",
  WARNING: "warning",
  INFO: "info",
} as const;

export type BadgeSeverity =
  (typeof BadgeSeverities)[keyof typeof BadgeSeverities];

export const BadgeRoles = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  SUPPORT_ADMIN: "support_admin",
  FEEDBACK_ADMIN: "feedback_admin",
} as const;

export type BadgeRole = (typeof BadgeRoles)[keyof typeof BadgeRoles];

export const BadgeCategories = {
  BUG: "bug",
  FEATURE_REQUEST: "feature_request",
  IMPROVEMENT: "improvement",
  GENERAL: "general",
} as const;

export type BadgeCategory =
  (typeof BadgeCategories)[keyof typeof BadgeCategories];
