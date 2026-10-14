// src/design/constants/button.constants.ts

/**
 * RexOne Design System - Button Constants & Types
 */

export const ButtonVariants = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  FLAT: "flat",
  GLASS: "glass",
} as const;

export type ButtonVariant =
  (typeof ButtonVariants)[keyof typeof ButtonVariants];

export const ButtonTypes = {
  BUTTON: "button",
  SUBMIT: "submit",
  RESET: "reset",
} as const;

export type ButtonType = (typeof ButtonTypes)[keyof typeof ButtonTypes];
