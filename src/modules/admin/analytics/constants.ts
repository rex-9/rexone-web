// src/modules/admin/analytics/constants.ts
export const ANALYTICS_COLORS = {
  PRIMARY: "var(--color-primary, #ff5757)",
  SECONDARY: "var(--color-secondary, #ff7a7a)",
  ACCENT: "#38bdf8",
  SUCCESS: "#34d399",
  WARNING: "#fbbf24",
  PURPLE: "#a855f7",
  MUTED: "var(--color-base-content, #888888)",
} as const;

export const ANALYTICS_CARD_LABELS = {
  TOTAL_REVENUE: "Gross Revenue",
  NEW_USERS: "New Users",
  TOTAL_USERS: "Total Users",
  SUBSCRIPTIONS: "Active Subscriptions",
  AI_MESSAGES: "AI Messages",
  TOTAL_MESSAGES: "Total Messages",
  CLIENT_ERRORS: "Client Errors",
  FEEDBACKS: "Feedbacks",
} as const;
