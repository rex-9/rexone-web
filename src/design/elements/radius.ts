// src/design/elements/radius.ts

/**
 * Border Radius Tokens
 *
 * Soft & gentle radius system matching mobile radius tokens.
 */

export const radius = {
  xs: "4px",
  sm: "8px",
  md: "12px", // Default
  lg: "16px",
  full: "999px",
} as const;

export type Radius = typeof radius;
export type RadiusKey = keyof typeof radius;
