/**
 * Meritbox Design System - Type Definitions
 *
 * TypeScript types for type-safe design system usage
 */

import type {
  ColorToken,
  GoldShade,
  BlueShade,
  NavyShade,
  GrayShade,
  SemanticColor,
} from "./atoms/colors";
import type { TypographyToken, FontWeight, FontSize } from "./atoms/typography";
import type { SpacingToken, SpacingValue } from "./atoms/spacing";
import type { RadiusToken, RadiusValue } from "./atoms/radius";
import type { ShadowToken, ShadowValue } from "./atoms/shadows";
import type { MotionToken, Duration, Easing } from "./atoms/motion";

// Re-export all types
export type {
  ColorToken,
  GoldShade,
  BlueShade,
  NavyShade,
  GrayShade,
  SemanticColor,
  TypographyToken,
  FontWeight,
  FontSize,
  SpacingToken,
  SpacingValue,
  RadiusToken,
  RadiusValue,
  ShadowToken,
  ShadowValue,
  MotionToken,
  Duration,
  Easing,
};

// Design System Theme Interface
export interface DesignSystemTheme {
  colors: ColorToken;
  typography: TypographyToken;
  spacing: SpacingToken;
  radius: RadiusToken;
  shadows: ShadowToken;
  motion: MotionToken;
}
