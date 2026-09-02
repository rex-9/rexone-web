// src/design/elements/shadows.ts
import { colors } from "./colors";

/**
 * Rexone Design System - Shadow Tokens
 * Sourced directly from colors.ts
 */

export const shadows = {
  xs: `0px 1px 3px ${colors.shadows.blackXs}`,
  sm: `0px 2px 6px ${colors.shadows.blackSm}`,
  md: `0px 4px 12px ${colors.shadows.blackMd}`,
  glow: `0px 0px 20px ${colors.shadows.glow}`,
  neon: `0 0 8px ${colors.primary}, 0 0 25px ${colors.primaryDark}`,
  "neon-lg": `0 0 8px ${colors.primary}, 0 0 25px ${colors.primaryDark}, 0 0 50px ${colors.glowOuter}`,
  "glass-card": `0 6px 30px ${colors.shadows.glassCard}`,
  "glass-hover": `0 8px 32px ${colors.shadows.glassHover}`,
} as const;

export type Shadows = typeof shadows;
export type ShadowKey = keyof typeof shadows;
