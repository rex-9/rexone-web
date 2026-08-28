// src/constants/platform.ts

export const Platform = {
  WEB: "web",
  MOBILE: "mobile",
  ALL: ["web", "mobile"] as const,
} as const;

export type TPlatform = (typeof Platform.ALL)[number];
