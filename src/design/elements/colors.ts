// src/design/elements/colors.ts

export const colors = {
  // Brand
  gold: {
    400: "#F9E3A8",
    500: "#F8D57E",
    600: "#EAC065",
  },
  blue: {
    400: "#CBE1FF",
    500: "#9EC9FF",
    600: "#7FB8FF",
  },
  navy: {
    700: "#1A2A3A",
    900: "#14202E",
  },

  // Grays
  gray: {
    50: "#F8F9FA",
    100: "#F1F3F5",
    200: "#E9ECEF",
    300: "#DEE2E6",
    500: "#ADB5BD",
    700: "#495057",
    900: "#212529",
  },

  // Day theme
  day: {
    bg: {
      primary: "#FAFAF8",
      secondary: "#F5F5F3",
      tertiary: "#F0F0EE",
    },
  },

  // Night theme
  night: {
    bg: {
      primary: "#1A1A18",
      secondary: "#1F1F1D",
      tertiary: "#252523",
    },
    text: {
      primary: "#F5F5F5",
      secondary: "#D1D1D1",
      muted: "#9D9D9D",
    },
    surface: {
      card: "#1F1F1D",
      elevated: "#252523",
      border: "#2A2A28",
    },
    gold: {
      soft: "#E9D8A6",
      glow: "#F8D57E",
      warm: "#D4AF37",
    },
    charcoal: {
      darkest: "#1A1A18",
      dark: "#1F1F1D",
      base: "#252523",
    },
  },

  // Status
  semantic: {
    success: "#4CAF50",
    warning: "#FFC85C",
    error: "#F05454",
    info: "#74B3FF",
  },
} as const;
