// src/design/components/auth/types.ts

export const AuthStep = {
  INITIAL: "initial",
  SIGNIN_PASSCODE: "signin-passcode",
  SIGNUP_PASSCODE_CREATE: "signup-passcode-create",
  SIGNUP_PASSCODE_CONFIRM: "signup-passcode-confirm",
  SIGNUP_INFO: "signup-info",
  CONFIRM_EMAIL: "confirm-email",
  FORGOT_PASSCODE: "forgot-passcode",
} as const;

export type TAuthStep = (typeof AuthStep)[keyof typeof AuthStep];
