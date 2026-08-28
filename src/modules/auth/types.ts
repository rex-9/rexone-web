import { IUser } from "../../models";

export interface IGoogleSignInStartResult {
  success: boolean;
  statusCode?: number;
  passwordRequired?: boolean; // Only when new user
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
