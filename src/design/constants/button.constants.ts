// src/design/constants/button.constants.ts

/**
 * Rexone Design System - Button Constants & Types
 */

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
