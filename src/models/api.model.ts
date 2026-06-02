export interface IApiResponse<T> {
  data: T | null;
  error?: string;
}

export interface IApiAuthResponse<T> {
  status: {
    code: number;
    success: boolean;
    message: string;
    error?: string;
  };
  data?: T | null;
}

export interface IGoogleSignInStartData {
  passcode_required: boolean | string | number;
  passcode_action?: string;
  challenge_token?: string;
  flow_token?: string;
  passcode_setup_required?: boolean;
  requires_passcode_setup?: boolean;
  is_new_user?: boolean;
  new_account?: boolean;
  account_exists?: boolean;
  user?: import("./user.model").IUser;
  token?: string;
}

export interface IGoogleSignInCompleteData {
  user: import("./user.model").IUser;
  token: string;
}
