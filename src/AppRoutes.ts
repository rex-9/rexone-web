import { AuthStep } from "./design/components/auth/type";

class AppRoutes {
  // private static readonly PROTECTED_PREFIX = "/auth";

  static readonly client = {
    public: {
      SIGN_IN: "/signin",
      SIGN_UP: "/signup",
      CONFIRM_EMAIL: "/email/confirm",
      FORGOT_PASSCODE: "/passcode/forgot",
      RESET_PASSCODE: "/passcode/reset",
      ROOT: "/",
    },
    protected: {
      SIGN_OUT: "/signout",
      HOME: "/home",
      PROFILE: "/profile",
    },
  };

  static readonly server = {
    public: {
      SIGN_UP: "/signup",
      SIGN_IN_EMAIL: "/signin",
      SIGN_IN_TOKEN: "/signin/token",
      SIGN_IN_GOOGLE: "/signin/google",
      SIGN_IN_GOOGLE_COMPLETE: "/signin/google/complete",
      SEND_EMAIL_CODE: "/confirmation/send_code",
      CONFIRM_CODE: "/confirmation/confirm_code",
      FORGOT_PASSWORD: "/password/forgot",
      RESET_PASSWORD: "/password/reset",
    },
    protected: {
      SIGN_OUT: "/signout",
      PEEK_USER: "/users/peek",
      GET_CURRENT_USER: "/users/current",
      UPLOAD_ASSET: "/media/upload",
    },
  };

  // Dialog constants for URL params
  static readonly dialog = {
    param: "dialog",
    auth: "auth",
    steps: {
      initial: AuthStep.INITIAL,
      signinPasscode: AuthStep.SIGNIN_PASSCODE,
      signupPasscodeCreate: AuthStep.SIGNUP_PASSCODE_CREATE,
      signupPasscodeConfirm: AuthStep.SIGNUP_PASSCODE_CONFIRM,
      signupInfo: AuthStep.SIGNUP_INFO,
      confirmEmail: AuthStep.CONFIRM_EMAIL,
      forgotPasscode: AuthStep.FORGOT_PASSCODE,
    },
  };

  // Helper to build dialog URLs
  static buildDialogUrl(step: string, params?: Record<string, string>): string {
    const url = new URL(window.location.origin + this.client.public.ROOT);
    url.searchParams.set(this.dialog.param, this.dialog.auth);
    url.searchParams.set("step", step);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }
    return url.pathname + url.search;
  }
}

export default AppRoutes;
