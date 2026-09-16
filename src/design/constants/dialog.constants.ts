// src/design/constants/dialog.constants.ts

/**
 * RexOne Design System - Dialog Variants
 */

export const DialogVariants = {
  DEFAULT: "default",
  CONFIRM: "confirm",
  ALERT: "alert",
} as const;

export type DialogVariant =
  (typeof DialogVariants)[keyof typeof DialogVariants];
