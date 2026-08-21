// src/design/utils.ts

/**
 * Rexone Design System - Utility Functions
 *
 * Helper functions for working with design tokens and classes
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { colors, spacing, radius, shadows, typography } from "./elements";

// ============================================================
// CLASS NAME UTILITIES
// ============================================================

/**
 * Merge class names with Tailwind conflict resolution
 * @example cn("p-4", "p-8") => "p-8"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// COLOR UTILITIES
// ============================================================

/**
 * Get brand color value
 * @example getBrandColor('primary') => '#FF5E62'
 */
export function getBrandColor(brand: "primary" | "secondary" | "accent"): string {
  return colors[brand];
}

/**
 * Get a semantic color value
 * @example getSemanticColor('success') => '#10B981'
 */
export function getSemanticColor(
  color: "success" | "warning" | "error" | "info",
): string {
  return colors.semantic[color];
}

// ============================================================
// SPACING UTILITIES
// ============================================================

/**
 * Get a spacing value
 * @example getSpacing(16) => '16px'
 */
export function getSpacing(value: keyof typeof spacing): string {
  return spacing[value];
}

// ============================================================
// RADIUS UTILITIES
// ============================================================

/**
 * Get a radius value
 * @example getRadius('md') => '12px'
 */
export function getRadius(value: keyof typeof radius): string {
  return radius[value];
}

// ============================================================
// SHADOW UTILITIES
// ============================================================

/**
 * Get a shadow value
 * @example getShadow('sm') => '0px 2px 6px rgba(0, 0, 0, 0.08)'
 */
export function getShadow(value: keyof typeof shadows): string {
  return shadows[value];
}

// ============================================================
// TYPOGRAPHY UTILITIES
// ============================================================

/**
 * Get typography styles for a specific size
 * @example getTypography('h1') => { fontSize: '32px', lineHeight: '40px', fontWeight: 600 }
 */
export function getTypography(size: keyof typeof typography.fontSize) {
  return typography.fontSize[size];
}

// ============================================================
// CSS UTILITIES
// ============================================================

/**
 * Create a CSS variable reference
 * @example cssVar('primary') => 'var(--color-primary)'
 */
export function cssVar(token: string): string {
  return `var(--color-${token})`;
}

/**
 * Convert pixel value to rem
 * @example pxToRem(16) => '1rem'
 */
export function pxToRem(pixels: number, baseFontSize: number = 16): string {
  return `${pixels / baseFontSize}rem`;
}

/**
 * Convert rem to pixels
 * @example remToPx('1rem') => 16
 */
export function remToPx(rem: string, baseFontSize: number = 16): number {
  return parseFloat(rem) * baseFontSize;
}
