// src/modules/user/constants.ts

export const USER_PEEK_STATUS = {
  EXISTS_CONFIRMED: "exists_confirmed",
  EXISTS_UNCONFIRMED: "exists_unconfirmed",
  NOT_EXISTS: "not_exists",
  DISCARDED: "discarded",
} as const;

export type TUserPeekStatus =
  (typeof USER_PEEK_STATUS)[keyof typeof USER_PEEK_STATUS];
