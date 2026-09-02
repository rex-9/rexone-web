// src/design/constants/sizes.constants.ts

/**
 * Rexone Design System - Size Constants
 */

export const ComponentSizes = {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
} as const;

export type ComponentSize =
  (typeof ComponentSizes)[keyof typeof ComponentSizes];

export const DropdownSizes = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

export type DropdownSize = (typeof DropdownSizes)[keyof typeof DropdownSizes];

export const ButtonSizes = {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
} as const;

export type ButtonSize = (typeof ButtonSizes)[keyof typeof ButtonSizes];

export const BadgeSizes = {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

export type BadgeSize = (typeof BadgeSizes)[keyof typeof BadgeSizes];
