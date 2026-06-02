/**
 * Meritbox Design System - Border Radius Tokens
 *
 * Soft & gentle radius system for a calming, warm feel
 */

export const radius = {
  xs: "4px",
  s: "8px",
  m: "12px", // Default
  l: "16px",
  full: "999px",
} as const;

export type RadiusToken = typeof radius;
export type RadiusValue = keyof typeof radius;
