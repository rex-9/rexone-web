/**
 * Meritbox Design System - Color Tokens
 *
 * Colors that evoke: inner peace, mindfulness, warmth, hope, soft melanated light
 */

export const colors = {
  // Core Brand Colors
  gold: {
    400: "#F9E3A8",
    500: "#F8D57E", // Primary Brand Color - Kindness Gold
    600: "#EAC065",
  },

  blue: {
    400: "#CBE1FF",
    500: "#9EC9FF", // Secondary Brand Color - Clarity Blue
    600: "#7FB8FF",
  },

  navy: {
    700: "#1A2A3A",
    900: "#14202E", // Anchor Color - Deep Navy
  },

  // Utility Grays - Minimalist vibe
  gray: {
    50: "#F8F9FA",
    100: "#F1F3F5",
    200: "#E9ECEF",
    300: "#DEE2E6",
    500: "#ADB5BD",
    700: "#495057",
    900: "#212529",
  },

  // Background Colors - Light Mode (Warm Off-White)
  bg: {
    primary: "#FAFAF8", // Warm off-white instead of pure white
    secondary: "#F5F5F3", // Slightly darker warm gray
    tertiary: "#F0F0EE", // Even softer warm gray
  },

  // Semantic Colors (for status)
  semantic: {
    success: "#4CAF50",
    warning: "#FFC85C",
    error: "#F05454",
    info: "#74B3FF",
  },

  // Night Theme Colors - Soft Charcoal & Soft Gold (not pure black)
  night: {
    // Soft Charcoal backgrounds (softer, closer to light theme)
    charcoal: {
      darkest: "#1A1A18", // Soft dark gray (was #0D0D0D)
      dark: "#1F1F1D", // Softer charcoal (was #121110)
      base: "#252523", // Base charcoal (was #1A1A18)
    },
    // Soft Gold Accents for night mode
    gold: {
      soft: "#E9D8A6", // Soft gold accent
      glow: "#F8D57E", // Glowing gold (same as primary)
      warm: "#D4AF37", // Warm gold
    },
    // Text colors for night mode
    text: {
      primary: "#F5F5F5", // Soft white
      secondary: "#D1D1D1", // Light gray
      muted: "#9D9D9D", // Muted gray
    },
    // Surface colors
    surface: {
      card: "#1F1F1D", // Card background
      elevated: "#252523", // Elevated surfaces
      border: "#2A2A28", // Borders
    },
    // Background Colors - Dark Mode (Soft Charcoal)
    bg: {
      primary: "#1A1A18", // Soft dark gray (not pure black)
      secondary: "#1F1F1D", // Slightly lighter
      tertiary: "#252523", // Even lighter for depth
    },
  },
} as const;

// Type-safe color access
export type ColorToken = typeof colors;
export type GoldShade = keyof typeof colors.gold;
export type BlueShade = keyof typeof colors.blue;
export type NavyShade = keyof typeof colors.navy;
export type GrayShade = keyof typeof colors.gray;
export type SemanticColor = keyof typeof colors.semantic;
