// src/design/constants/index.ts

/**
 * Rexone Design System - Component Constants
 *
 * Centralized constant values and types for component variants, sizes, and states.
 * Eliminates string literal duplication and prevents typos.
 */

// ============================================================
// COMPONENT SIZES
// ============================================================
export const ComponentSizes = {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
} as const;

export type ComponentSize =
  (typeof ComponentSizes)[keyof typeof ComponentSizes];

// ============================================================
// BUTTON VARIANTS & TYPES
// ============================================================
export const ButtonVariants = {
  PRIMARY: "primary",
  NEON: "neon",
  SECONDARY: "secondary",
  TERTIARY: "tertiary",
} as const;

export type ButtonVariant =
  (typeof ButtonVariants)[keyof typeof ButtonVariants];

export const ButtonTypes = {
  BUTTON: "button",
  SUBMIT: "submit",
  RESET: "reset",
} as const;

export type ButtonType = (typeof ButtonTypes)[keyof typeof ButtonTypes];

// ============================================================
// BADGE VARIANTS
// ============================================================
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

// ============================================================
// BADGE STATUS / PRIORITY / SEVERITY / ROLE / CATEGORY CONSTANTS
// ============================================================
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

export const BadgePriorities = {
  CRITICAL: "critical",
  URGENT: "urgent",
  HIGH: "high",
  MEDIUM: "medium",
  NORMAL: "normal",
  LOW: "low",
} as const;

export const BadgeSeverities = {
  FATAL: "fatal",
  ERROR: "error",
  WARN: "warn",
  WARNING: "warning",
  INFO: "info",
} as const;

export const BadgeRoles = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  SUPPORT_ADMIN: "support_admin",
  FEEDBACK_ADMIN: "feedback_admin",
} as const;

export const BadgeCategories = {
  BUG: "bug",
  FEATURE_REQUEST: "feature_request",
  IMPROVEMENT: "improvement",
  GENERAL: "general",
} as const;

// ============================================================
// INPUT & FORM VARIANTS
// ============================================================
export const InputVariants = {
  DEFAULT: "default",
  GLASS: "glass",
} as const;

export type InputVariant = (typeof InputVariants)[keyof typeof InputVariants];

export const FormVariants = {
  DEFAULT: "default",
  GLASS: "glass",
} as const;

export type FormVariant = (typeof FormVariants)[keyof typeof FormVariants];

// ============================================================
// DIALOG VARIANTS & SIZES
// ============================================================
export const DialogVariants = {
  DEFAULT: "default",
  CONFIRM: "confirm",
  ALERT: "alert",
} as const;

export type DialogVariant =
  (typeof DialogVariants)[keyof typeof DialogVariants];

// ============================================================
// TOAST & ALERT TYPES
// ============================================================
export const ToastTypes = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

export type ToastType = (typeof ToastTypes)[keyof typeof ToastTypes];

// ============================================================
// TYPOGRAPHY VARIANTS
// ============================================================
export const TypographyVariants = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  BODY_L: "body-l",
  BODY_M: "body-m",
  BODY_S: "body-s",
  CAPTION: "caption",
} as const;

export type TypographyVariant =
  (typeof TypographyVariants)[keyof typeof TypographyVariants];
