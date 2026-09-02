// src/design/elements/font.ts

/**
 * Rexone Design System - Typography Tokens
 *
 * Primary UI: Quicksand
 * Display: Clip
 * Handwritten: Storytime
 */

export const font = {
  fontFamily: {
    primary: '"Quicksand", sans-serif',
    display: '"Clip", cursive, sans-serif',
    handwritten: '"Storytime", cursive',
  },

  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  fontSize: {
    displayXL: { fontSize: "56px", lineHeight: "64px", fontWeight: 700 },
    displayL: { fontSize: "48px", lineHeight: "56px", fontWeight: 700 },
    displayM: { fontSize: "36px", lineHeight: "44px", fontWeight: 600 },
    h1: { fontSize: "32px", lineHeight: "40px", fontWeight: 600 },
    h2: { fontSize: "28px", lineHeight: "36px", fontWeight: 600 },
    h3: { fontSize: "24px", lineHeight: "32px", fontWeight: 600 },
    h4: { fontSize: "20px", lineHeight: "28px", fontWeight: 500 },
    bodyL: { fontSize: "18px", lineHeight: "28px", fontWeight: 400 },
    bodyM: { fontSize: "16px", lineHeight: "24px", fontWeight: 400 },
    bodyS: { fontSize: "14px", lineHeight: "20px", fontWeight: 400 },
    caption: { fontSize: "12px", lineHeight: "16px", fontWeight: 400 },
  },
} as const;

export const typography = font;

export type Font = typeof font;
export type TypographyTokens = typeof font;
export type FontSizeKey = keyof typeof font.fontSize;
export type FontWeightKey = keyof typeof font.fontWeight;
export type FontFamilyKey = keyof typeof font.fontFamily;
