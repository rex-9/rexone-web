export type TGoogleSsoFlowState =
  | "idle"
  | "verifying_google"
  | "passcode_required"
  | "submitting_passcode"
  | "authenticated"
  | "error";

export interface IGoogleSsoState {
  status: TGoogleSsoFlowState;
  challengeToken: string | null;
  retryAfterSeconds: number | null;
  errorMessage: string | null;
  errorCode: number | null;
}

export type TGoogleSsoAction =
  | { type: "RESET" }
  | { type: "VERIFY_GOOGLE_START" }
  | { type: "VERIFY_GOOGLE_SUCCESS_AUTHENTICATED" }
  | { type: "VERIFY_GOOGLE_PASSCODE_REQUIRED"; challengeToken: string }
  | {
      type: "VERIFY_GOOGLE_FAILED";
      errorMessage: string;
      errorCode?: number;
      retryAfterSeconds?: number;
    }
  | { type: "SUBMIT_PASSCODE_START" }
  | { type: "SUBMIT_PASSCODE_SUCCESS_AUTHENTICATED" }
  | {
      type: "SUBMIT_PASSCODE_FAILED";
      errorMessage: string;
      errorCode?: number;
      retryAfterSeconds?: number;
    }
  | { type: "CLEAR_CHALLENGE_TOKEN" };

export const initialGoogleSsoState: IGoogleSsoState = {
  status: "idle",
  challengeToken: null,
  retryAfterSeconds: null,
  errorMessage: null,
  errorCode: null,
};

export const googleSsoStateReducer = (
  state: IGoogleSsoState,
  action: TGoogleSsoAction,
): IGoogleSsoState => {
  switch (action.type) {
    case "RESET":
      return { ...initialGoogleSsoState };

    case "VERIFY_GOOGLE_START":
      return {
        status: "verifying_google",
        challengeToken: null,
        retryAfterSeconds: null,
        errorMessage: null,
        errorCode: null,
      };

    case "VERIFY_GOOGLE_SUCCESS_AUTHENTICATED":
      return {
        status: "authenticated",
        challengeToken: null,
        retryAfterSeconds: null,
        errorMessage: null,
        errorCode: null,
      };

    case "VERIFY_GOOGLE_PASSCODE_REQUIRED":
      return {
        status: "passcode_required",
        challengeToken: action.challengeToken,
        retryAfterSeconds: null,
        errorMessage: null,
        errorCode: null,
      };

    case "VERIFY_GOOGLE_FAILED":
      return {
        status: "error",
        challengeToken: null,
        retryAfterSeconds: action.retryAfterSeconds ?? null,
        errorMessage: action.errorMessage,
        errorCode: action.errorCode ?? null,
      };

    case "SUBMIT_PASSCODE_START":
      return {
        ...state,
        status: "submitting_passcode",
        retryAfterSeconds: null,
        errorMessage: null,
        errorCode: null,
      };

    case "SUBMIT_PASSCODE_SUCCESS_AUTHENTICATED":
      return {
        status: "authenticated",
        challengeToken: null,
        retryAfterSeconds: null,
        errorMessage: null,
        errorCode: null,
      };

    case "SUBMIT_PASSCODE_FAILED":
      return {
        status: "error",
        challengeToken: state.challengeToken,
        retryAfterSeconds: action.retryAfterSeconds ?? null,
        errorMessage: action.errorMessage,
        errorCode: action.errorCode ?? null,
      };

    case "CLEAR_CHALLENGE_TOKEN":
      return {
        ...state,
        challengeToken: null,
      };

    default:
      return state;
  }
};