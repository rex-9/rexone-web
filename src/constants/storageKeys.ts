export const StorageKeys = {
  LOCALE: "locale",
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  MARKERS: "markers",
  START_TIME: "startTime",
  END_TIME: "endTime",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
