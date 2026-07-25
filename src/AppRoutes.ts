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
      PAYMENT: "/payment",
      PAYMENT_SUCCESS: "/payment/success",
      PAYMENT_CANCEL: "/payment/cancel",
    },
  };

  static readonly server = {
    public: {
      SIGN_UP: "/signup", // POST
      SIGN_IN_EMAIL: "/signin", // POST
      SIGN_IN_TOKEN: "/signin/token", // POST
      SIGN_IN_GOOGLE: "/signin/google", // POST
      SIGN_IN_GOOGLE_COMPLETE: "/signin/google/complete", // POST
      SEND_EMAIL_CODE: "/confirmation/send_code", // POST
      CONFIRM_CODE: "/confirmation/confirm_code", // POST
      FORGOT_PASSWORD: "/password/forgot", // POST
      RESET_PASSWORD: "/password/reset", // PUT
    },
    protected: {
      SIGN_OUT: "/signout", // DELETE
      PEEK_USER: "/users/peek", // GET
      CURRENT_USER: "/users/current", // GET
      UPLOAD_ASSET: "/media/upload", // POST
      ACCESS: "/access", // GET
      CHECK_ACCESS: "/access/check", // GET
      PAYMENT_SESSION: "/payment/session", // POST
      PAYMENT_PRODUCTS: "/payment/products", // GET
      PAYMENT_SUBSCRIPTIONS: "/payment/subscriptions", // GET, POST, DELETE
      PAYMENT_TRANSACTIONS: "/payment/transactions", // GET
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
