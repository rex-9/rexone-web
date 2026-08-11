import { AuthStep } from "./design/components/auth/type";

class AppRoutes {
  private static readonly API_VERSION = "/v1";

  private static api(path: string): string {
    return `${this.API_VERSION}${path}`;
  }

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
      AI: "/ai",
    },
  };

  static readonly server = {
    public: {
      // Authentication
      PEEK_USER: "/peek", // GET
      SIGN_UP: "/signup", // POST
      SIGN_IN_EMAIL: "/signin", // POST
      SIGN_IN_TOKEN: "/signin/token", // POST
      SIGN_IN_GOOGLE: "/signin/google", // POST
      SIGN_IN_GOOGLE_COMPLETE: "/signin/google/complete", // POST

      // Email confirmation
      SEND_EMAIL_CODE: "/confirmation/send_code", // POST
      CONFIRM_CODE: "/confirmation/confirm_code", // POST

      // Password
      FORGOT_PASSWORD: "/password/forgot", // POST
      RESET_PASSWORD: "/password/reset", // PUT
    },

    protected: {
      // Authentication
      SIGN_OUT: "/signout", // DELETE

      // Users
      USERS: AppRoutes.api("/users"), // GET
      CURRENT_USER: AppRoutes.api("/users/current"), // GET

      // Media
      UPLOAD_ASSET: AppRoutes.api("/media/upload"), // POST

      // Access
      ACCESS: AppRoutes.api("/access"), // GET
      CHECK_ACCESS: AppRoutes.api("/access/check"), // GET

      // Payments
      PAYMENT_SESSION: AppRoutes.api("/payment/session"), // POST
      PAYMENT_PRODUCTS: AppRoutes.api("/payment/products"), // GET
      PAYMENT_SUBSCRIPTIONS: AppRoutes.api("/payment/subscriptions"), // GET, POST
      PAYMENT_SUBSCRIPTION_CANCEL: AppRoutes.api(
        "/payment/subscriptions/:id/cancel",
      ), // POST
      PAYMENT_SUBSCRIPTION_RESUME: AppRoutes.api(
        "/payment/subscriptions/:id/resume",
      ), // POST
      PAYMENT_TRANSACTIONS: AppRoutes.api("/payment/transactions"), // GET

      // AI
      AI_CHAT: AppRoutes.api("/ai/chat"), // POST
      AI_HISTORY: AppRoutes.api("/ai/history"), // GET
      AI_CLEAR: AppRoutes.api("/ai/clear"), // DELETE
      AI_RENAME: AppRoutes.api("/ai/rename"), // PUT
      AI_ROOMS: AppRoutes.api("/ai/rooms"), // GET, POST
      AI_DELETE_ROOM: AppRoutes.api("/ai/rooms/:id"), // DELETE
      AI_SUMMARIZE: AppRoutes.api("/ai/summarize"), // POST
      AI_TRANSLATE: AppRoutes.api("/ai/translate"), // POST
      AI_ANALYZE: AppRoutes.api("/ai/analyze"), // POST
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
    const url = new URL(window.location.origin + AppRoutes.client.public.ROOT);

    url.searchParams.set(AppRoutes.dialog.param, AppRoutes.dialog.auth);
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
