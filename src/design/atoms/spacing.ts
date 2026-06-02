/**
 * Meritbox Design System - Spacing Tokens
 *
 * 8-based spacing scale for consistent spacing throughout the system
 */

export const spacing = {
  0: "0",
  4: "4px",
  8: "8px",
  12: "12px",
  16: "16px",
  20: "20px",
  24: "24px",
  32: "32px",
  40: "40px",
  48: "48px",
  64: "64px",
  80: "80px",
} as const;

export type SpacingToken = typeof spacing;
export type SpacingValue = keyof typeof spacing;
