// src/modules/auth/constants.ts

export const DialogParams = {
  DIALOG: "dialog",
  STEP: "step",
  AUTH: "auth",
} as const;

export const DialogAuthSteps = {
  INITIAL: "initial",
  SIGNIN_PASSWORD: "signin-password",
  SIGNUP_PASSWORD_CREATE: "signup-password-create",
  SIGNUP_PASSWORD_CONFIRM: "signup-password-confirm",
  SIGNUP_INFO: "signup-info",
  CONFIRM_EMAIL: "confirm-email",
  FORGOT_PASSWORD: "forgot-password",
} as const;

export type TAuthStep = (typeof DialogAuthSteps)[keyof typeof DialogAuthSteps];

export const AUTH_ERRORS = {
  UNAUTHORIZED: "Unauthorized",
  SIGNATURE_EXPIRED: "Signature has expired",
  NO_VERIFICATION_KEY: "No verification key available",
} as const;

export const AUTH_PROVIDERS = {
  EMAIL: "email",
  GOOGLE: "google",
} as const;
