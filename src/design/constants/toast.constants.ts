// src/design/constants/toast.constants.ts

/**
 * RexOne Design System - Toast & Alert Types
 */

export const ToastTypes = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

export type TToastTypes = (typeof ToastTypes)[keyof typeof ToastTypes];
