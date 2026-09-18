// src/modules/admin/analytics/constants.ts
export const ANALYTICS_COLORS = {
  PRIMARY: "var(--color-primary)",
  SECONDARY: "var(--color-secondary)",
  ACCENT: "var(--color-accent)",
  SUCCESS: "var(--color-success)",
  WARNING: "var(--color-warning)",
  PURPLE: "var(--color-info)",
  MUTED: "var(--color-base-content)",
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
