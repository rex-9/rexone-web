// src/design/constants/typography.constants.ts

/**
 * Rexone Design System - Typography Variants
 */

export const TypographyVariants = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  BODY_L: "body-l",
  BODY_M: "body-m",
  BODY_S: "body-s",
  CAPTION: "caption",
} as const;

export type TypographyVariant =
  (typeof TypographyVariants)[keyof typeof TypographyVariants];
