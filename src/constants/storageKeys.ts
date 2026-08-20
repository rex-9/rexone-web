export const StorageKeys = {
  LOCALE: "locale",
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
