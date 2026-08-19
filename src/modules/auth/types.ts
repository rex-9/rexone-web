import { IUser } from "../../models";

export interface IGoogleSignInStartResult {
  success: boolean;
  statusCode?: number;
  passcodeRequired?: boolean; // Only when new user
  challengeToken?: string; // Only when new user
  user?: IUser; // Only when existing user
  token?: string; // Only when existing user
  errorMessage?: string;
}

export interface IGoogleSignInCompleteResult {
  success: boolean;
  statusCode?: number;
  user?: IUser;
  token?: string;
  errorMessage?: string;
}

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
