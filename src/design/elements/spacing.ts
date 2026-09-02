// src/design/elements/spacing.ts

/**
 * Rexone Design System - Spacing Tokens
 * Sourced from the 4px/8px grid system.
 * Matches mobile AppSpacing tokens for cross-platform alignment.
 */

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  screenPadding: "24px",
  gutter: "16px",
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof typeof spacing;
