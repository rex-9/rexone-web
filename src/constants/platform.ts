// src/constants/platform.ts

export const Platform = {
  WEB: "web",
  ANDROID: "android",
  IOS: "ios",
  ALL: ["web", "android", "ios"] as const,
} as const;

export type TPlatform = (typeof Platform.ALL)[number];
