// src/design/constants/form.constants.ts

/**
 * Rexone Design System - Form & Input Constants
 */

export const InputVariants = {
  DEFAULT: "default",
  GLASS: "glass",
} as const;

export type InputVariant = (typeof InputVariants)[keyof typeof InputVariants];

export const FormVariants = {
  DEFAULT: "default",
  GLASS: "glass",
} as const;

export type FormVariant = (typeof FormVariants)[keyof typeof FormVariants];
