// src/design/constants/badge.constants.ts

/**
 * Rexone Design System - Badge Constants & Categories
 */

export const ThemeVariants = {
  NIGHT: "night",
  DAY: "day",
} as const;

export type ThemeVariant = (typeof ThemeVariants)[keyof typeof ThemeVariants];
