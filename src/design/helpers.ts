// src/design/utils.ts

/**
 * Rexone Design System - Utility Functions
 *
 * Helper functions for working with design tokens and classes
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { colors, radius, shadows, font } from "./elements";

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
 * @example getBrandColor('primary') => '#F8D57E'
 */
export function getBrandColor(
  brand: "primary" | "secondary" | "accent",
): string {
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
 * @example getFont('h1') => { fontSize: '32px', lineHeight: '40px', fontWeight: 600 }
 */
export function getFont(size: keyof typeof font.fontSize) {
  return font.fontSize[size];
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

// ============================================================
// BADGE VARIANT HELPERS
// ============================================================

import {
  BadgeCategories,
  BadgePriorities,
  BadgeRoles,
  BadgeSeverities,
  BadgeStatuses,
  BadgeVariant,
  BadgeVariants,
} from "./constants";

/**
 * Universal Badge Variant Mapping Helpers
 * Shared across Admin and non-Admin views to provide consistent status and priority styling.
 */

export const getStatusBadgeVariant = (
  status?: string | null,
): BadgeVariant => {
  switch (status?.toLowerCase()) {
    case BadgeStatuses.ACTIVE:
    case BadgeStatuses.RESOLVED:
    case BadgeStatuses.SUCCESS:
    case BadgeStatuses.COMPLETED:
    case BadgeStatuses.PAID:
      return BadgeVariants.SUCCESS;
    case BadgeStatuses.IN_PROGRESS:
    case BadgeStatuses.PENDING:
    case BadgeStatuses.TRIALING:
    case BadgeStatuses.WARNING:
      return BadgeVariants.WARNING;
    case BadgeStatuses.EXPIRED:
    case BadgeStatuses.REVOKED:
    case BadgeStatuses.FAILED:
    case BadgeStatuses.CLOSED:
    case BadgeStatuses.DISCARDED:
    case BadgeStatuses.ERROR:
    case BadgeStatuses.CANCELED:
    case BadgeStatuses.PAST_DUE:
      return BadgeVariants.ERROR;
    case BadgeStatuses.NEW:
    case BadgeStatuses.INFO:
      return BadgeVariants.INFO;
    case BadgeStatuses.PAUSED:
      return BadgeVariants.SECONDARY;
    default:
      return BadgeVariants.DEFAULT;
  }
};

export const getPriorityBadgeVariant = (
  priority?: string | null,
): BadgeVariant => {
  switch (priority?.toLowerCase()) {
    case BadgePriorities.CRITICAL:
    case BadgePriorities.URGENT:
      return BadgeVariants.ERROR;
    case BadgePriorities.HIGH:
      return BadgeVariants.WARNING;
    case BadgePriorities.MEDIUM:
    case BadgePriorities.NORMAL:
      return BadgeVariants.INFO;
    case BadgePriorities.LOW:
    default:
      return BadgeVariants.SECONDARY;
  }
};

export const getSeverityBadgeVariant = (
  severity?: string | null,
): BadgeVariant => {
  switch (severity?.toLowerCase()) {
    case BadgeSeverities.FATAL:
    case BadgeSeverities.ERROR:
      return BadgeVariants.ERROR;
    case BadgeSeverities.WARN:
    case BadgeSeverities.WARNING:
      return BadgeVariants.WARNING;
    case BadgeSeverities.INFO:
      return BadgeVariants.INFO;
    default:
      return BadgeVariants.SECONDARY;
  }
};

export const getRoleBadgeVariant = (
  role?: string | null,
): BadgeVariant => {
  switch (role?.toLowerCase()) {
    case BadgeRoles.SUPER_ADMIN:
      return BadgeVariants.ERROR;
    case BadgeRoles.ADMIN:
      return BadgeVariants.PRIMARY;
    case BadgeRoles.SUPPORT_ADMIN:
    case BadgeRoles.FEEDBACK_ADMIN:
      return BadgeVariants.INFO;
    default:
      return BadgeVariants.SECONDARY;
  }
};

export const getCategoryBadgeVariant = (
  category?: string | null,
): BadgeVariant => {
  switch (category?.toLowerCase()) {
    case BadgeCategories.BUG:
      return BadgeVariants.ERROR;
    case BadgeCategories.FEATURE_REQUEST:
      return BadgeVariants.PRIMARY;
    case BadgeCategories.IMPROVEMENT:
      return BadgeVariants.SUCCESS;
    default:
      return BadgeVariants.SECONDARY;
  }
};
