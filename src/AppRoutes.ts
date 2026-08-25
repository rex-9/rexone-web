import { DialogParams } from "./constants";

class AppRoutes {
  private static readonly API_VERSION = "/v1";

  private static api(path: string): string {
    return `${this.API_VERSION}${path}`;
  }

  private static adminApi(path: string): string {
    return `${this.API_VERSION}/admin${path}`;
  }

  static readonly client = {
    public: {
      SIGN_IN: "/signin",
      SIGN_UP: "/signup",
      CONFIRM_EMAIL: "/email/confirm",
      FORGOT_PASSWORD: "/password/forgot",
      RESET_PASSWORD: "/password/reset",
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

      // Client Admin Dashboard
      admin: {
        HOME: AppRoutes.adminApi("/"),
      },
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

      // Save Client Log Errors
      CLIENT_LOGS: AppRoutes.api("/log/clients"), // POST

      // Users
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

      // API for Client Admin Dashboard
      admin: {
        USERS: AppRoutes.adminApi("/users"),
      },
    },
  };

  // Helper to build dialog URLs
  static buildDialogUrl(step: string, params?: Record<string, string>): string {
    const searchParams = new URLSearchParams();
    searchParams.set(DialogParams.DIALOG, DialogParams.AUTH);
    searchParams.set(DialogParams.STEP, step);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.set(key, value);
      });
    }

    return `${AppRoutes.client.public.ROOT}?${searchParams.toString()}`;
  }
}

export default AppRoutes;
