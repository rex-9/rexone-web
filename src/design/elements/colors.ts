// src/design/elements/colors.ts

export const colors = {
  // Brand (Unified across Light & Dark themes)
  primary: "#FF5E62",
  secondary: "#FF7556",
  accent: "#FF2A4B",

  // Semantic (Unified across Light & Dark themes)
  semantic: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#38BDF8",
  },

  // Day Theme (Light Mode)
  day: {
    background: "#FAFAF8",
    surface: "#FFFFFF",
    card: "#F5F5F3",
    border: "#E5E7EB",
    divider: "#F3F4F6",
    textPrimary: "#111827",
    textSecondary: "#4B5563",
    textMuted: "#9CA3AF",
  },

  // Night Theme (Dark Mode - Rex9 Aesthetic)
  night: {
    background: "#080808",
    surface: "#12060A",
    card: "#16080E",
    border: "#2A1018",
    divider: "#1F0B13",
    textPrimary: "#FFFFFF",
    textSecondary: "#E2D4D8",
    textMuted: "#8E7E84",
  },

  // Glassmorphism Tokens
  glass: {
    nav: "rgba(18, 6, 10, 0.80)",
    card: "rgba(22, 8, 14, 0.60)",
    border: "rgba(255, 94, 98, 0.22)",
  },
} as const;

export type Colors = typeof colors;
