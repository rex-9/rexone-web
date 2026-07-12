export type AuthStep =
  | "initial"
  | "signin-passcode"
  | "signup-passcode-create"
  | "signup-passcode-confirm"
  | "signup-info"
  | "verify-email"
  | "forgot-passcode";
