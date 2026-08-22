export const DialogParams = {
  DIALOG: "dialog",
  STEP: "step",
  AUTH: "auth",
} as const;

export const DialogAuthSteps = {
  INITIAL: "initial",
  SIGNIN_PASSCODE: "signin-passcode",
  SIGNUP_PASSCODE_CREATE: "signup-passcode-create",
  SIGNUP_PASSCODE_CONFIRM: "signup-passcode-confirm",
  SIGNUP_INFO: "signup-info",
  CONFIRM_EMAIL: "confirm-email",
  FORGOT_PASSCODE: "forgot-passcode",
} as const;

export type TAuthStep = (typeof DialogAuthSteps)[keyof typeof DialogAuthSteps];
