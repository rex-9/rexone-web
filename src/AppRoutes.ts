import { DialogParams } from "./modules/auth/constants";

class AppRoutes {
  private static readonly API_VERSION = "/v1";

  private static api(path: string): string {
    return `${this.API_VERSION}${path}`;
  }

  private static adminApi(path: string): string {
    return `${this.API_VERSION}/admin${path}`;
  }

  private static admin(path: string): string {
    return `/admin${path}`;
  }
  static withId(path: string, id: string): string {
    return path.replace(":id", id);
  }

  static readonly client = {
    public: {
      SIGN_IN: "/signin",
      SIGN_UP: "/signup",
      CONFIRM_EMAIL: "/email/confirm",
      FORGOT_PASSWORD: "/password/forgot",
      RESET_PASSWORD: "/password/reset",
      ANAPANA: "/anapana",
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
        HOME: AppRoutes.admin("/"),
        ANALYTICS: AppRoutes.admin("/analytics"),
        USERS: AppRoutes.admin("/users"),
        USERS_RECYCLE_BIN: AppRoutes.admin("/users/bin"),
        USER_CREATE: AppRoutes.admin("/users/create"),
        USER_EDIT: AppRoutes.admin("/users/:id/edit"),
        ROLES: AppRoutes.admin("/roles"),
        ROLE_CREATE: AppRoutes.admin("/roles/create"),
        ROLE_EDIT: AppRoutes.admin("/roles/:id/edit"),
        NOTIFICATIONS: AppRoutes.admin("/notifications"),
        PRODUCTS: AppRoutes.admin("/products"),
        PRODUCTS_RECYCLE_BIN: AppRoutes.admin("/products/bin"),
        PRODUCT_CREATE: AppRoutes.admin("/products/create"),
        PRODUCT_EDIT: AppRoutes.admin("/products/:id/edit"),
        ACCESSES: AppRoutes.admin("/accesses"),
        FEEDBACK: AppRoutes.admin("/feedback"),
        FEEDBACK_DETAIL: AppRoutes.admin("/feedback/:id"),
        LOGS: AppRoutes.admin("/logs"),
        LOG_DETAIL: AppRoutes.admin("/logs/:id"),
        CHAT_ROOMS: AppRoutes.admin("/chat/rooms"),
        CHAT_ROOM_EDIT: AppRoutes.admin("/chat/rooms/:id/edit"),
        CHAT_MESSAGES: AppRoutes.admin("/chat/messages"),
        CHAT_MESSAGE_EDIT: AppRoutes.admin("/chat/messages/:id/edit"),
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

      // Feedback
      FEEDBACK: AppRoutes.api("/feedbacks"), // POST
    },

    protected: {
      // Authentication
      SIGN_OUT: "/signout", // DELETE

      // Save Client Log Errors
      CLIENT_LOGS: AppRoutes.api("/log/clients"), // POST

      // Users
      USERS: AppRoutes.api("/users"), // GET
      CURRENT_USER: AppRoutes.api("/users/current"), // GET

      IAM_PERMISSIONS: AppRoutes.api("/iam/permissions/current"), // GET
      IAM_ROLES: AppRoutes.api("/iam/roles/current"), // GET

      // Media
      UPLOAD_ASSET: AppRoutes.api("/media/upload"), // POST

      // Accesses
      ACCESSES: AppRoutes.api("/accesses"), // GET
      ACTIVE_ACCESSES: AppRoutes.api("/accesses/active"), // GET
      CHECK_ACCESSES: AppRoutes.api("/accesses/check"), // GET

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

      // Feedback
      FEEDBACKS: AppRoutes.api("/feedbacks"), // GET

      // API for Client Admin Dashboard
      admin: {
        USERS: AppRoutes.adminApi("/users"), // GET, POST
        USER_ROLES: AppRoutes.adminApi("/iam/roles"), // GET
        USER_DETAIL: AppRoutes.adminApi("/users/:id"), // GET, PUT
        DISCARDED_USERS: AppRoutes.adminApi("/users/discarded"), // GET
        USER_DISCARD: AppRoutes.adminApi("/users/:id/discard"), // POST
        USER_UNDISCARD: AppRoutes.adminApi("/users/:id/undiscard"), // POST
        IAM_ROLES: AppRoutes.adminApi("/iam/roles"), // GET, POST
        IAM_ROLE_DETAIL: AppRoutes.adminApi("/iam/roles/:id"), // GET, PUT, DELETE
        IAM_PERMISSIONS: AppRoutes.adminApi("/iam/permissions"), // GET, POST
        IAM_PERMISSION_DETAIL: AppRoutes.adminApi("/iam/permissions/:id"), // GET, PUT, DELETE
        IAM_ROLE_PERMISSIONS: AppRoutes.adminApi("/iam/permissions"), // GET
        NOTIFICATIONS: AppRoutes.adminApi("/notifications"), // POST
        NOTIFICATION_TEMPLATES: AppRoutes.adminApi("/notifications/templates"), // GET
        PAYMENT_PRODUCTS: AppRoutes.adminApi("/payment/products"), // GET, POST
        DISCARDED_PAYMENT_PRODUCTS: AppRoutes.adminApi(
          "/payment/products/discarded",
        ), // GET
        PAYMENT_PRODUCT_DETAIL: AppRoutes.adminApi("/payment/products/:id"), // GET, PUT, DELETE
        PAYMENT_PRODUCT_DISCARD: AppRoutes.adminApi(
          "/payment/products/:id/discard",
        ), // POST
        PAYMENT_PRODUCT_UNDISCARD: AppRoutes.adminApi(
          "/payment/products/:id/undiscard",
        ), // POST
        CHAT_ROOMS: AppRoutes.adminApi("/chat/rooms"), // GET
        CHAT_ROOM_DETAIL: AppRoutes.adminApi("/chat/rooms/:id"), // GET, PUT, DELETE
        CHAT_MESSAGES: AppRoutes.adminApi("/chat/messages"), // GET
        CHAT_MESSAGE_DETAIL: AppRoutes.adminApi("/chat/messages/:id"), // GET, PUT, DELETE
        FEEDBACKS: AppRoutes.adminApi("/feedbacks"), // GET
        FEEDBACK_DETAIL: AppRoutes.adminApi("/feedbacks/:id"), // GET, PUT, DELETE
        ACCESSES: AppRoutes.adminApi("/accesses"), // GET, POST
        ACCESS_DETAIL: AppRoutes.adminApi("/accesses/:id"), // GET, PUT, DELETE
        LOGS: AppRoutes.api("/log/clients"), // GET, POST
        LOG_DETAIL: AppRoutes.api("/log/clients/:id"), // GET, DELETE
        LOG_RESOLVE: AppRoutes.api("/log/clients/:id/resolve"), // PUT
        LOG_UNRESOLVE: AppRoutes.api("/log/clients/:id/unresolve"), // PUT
        ANALYTICS_OVERVIEW: AppRoutes.adminApi("/analytics/overview"), // GET
      },
    },
  };

  // Helper to build dialog URLs
  static buildDialogUrl(step: string, params?: Record<string, string>): string {
    const searchParams = new URLSearchParams({
      [DialogParams.DIALOG]: DialogParams.AUTH,
      [DialogParams.STEP]: step,
    });

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.set(key, value);
      });
    }

    return `${AppRoutes.client.public.ROOT}?${searchParams.toString()}`;
  }
}

export default AppRoutes;
