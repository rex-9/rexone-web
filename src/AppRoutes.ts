import { DialogParams } from "./constants";

class AppRoutes {
  private static readonly API_VERSION = "/v1";

  private static api(path: string): string {
    return `${this.API_VERSION}${path}`;
  }

  private static adminApi(path: string): string {
    return `${this.API_VERSION}/admin${path}`;
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
      ADMIN: "/admin",
      ADMIN_USERS: "/admin/users",
      ADMIN_USERS_RECYCLE_BIN: "/admin/users/recycle-bin",
      ADMIN_USER_CREATE: "/admin/users/create",
      ADMIN_USER_EDIT: "/admin/users/:id/edit",
      ADMIN_ROLES: "/admin/roles",
      ADMIN_ROLE_CREATE: "/admin/roles/create",
      ADMIN_ROLE_EDIT: "/admin/roles/:id/edit",
      ADMIN_NOTIFICATIONS: "/admin/notifications",
      ADMIN_PRODUCTS: "/admin/products",
      ADMIN_PRODUCT_CREATE: "/admin/products/create",
      ADMIN_PRODUCT_EDIT: "/admin/products/:id/edit",
      ADMIN_CHAT_ROOMS: "/admin/chat/rooms",
      ADMIN_CHAT_ROOM_EDIT: "/admin/chat/rooms/:id/edit",
      ADMIN_CHAT_MESSAGES: "/admin/chat/messages",
      ADMIN_CHAT_MESSAGE_EDIT: "/admin/chat/messages/:id/edit",

      // Client Admin Dashboard
      admin: {
        HOME: "/admin",
        USERS: "/admin/users",
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
      USERS: AppRoutes.api("/users"), // GET
      CURRENT_USER: AppRoutes.api("/users/current"), // GET

      // Admin
      ADMIN_USERS: AppRoutes.adminApi("/users"), // GET, POST
      ADMIN_USER_ROLES: AppRoutes.adminApi("/users/roles"), // GET
      ADMIN_USER_DETAIL: AppRoutes.adminApi("/users/:id"), // GET, PATCH, PUT, DELETE
      ADMIN_DISCARDED_USERS: AppRoutes.adminApi("/users/discarded"), // GET
      ADMIN_USER_DISCARD: AppRoutes.adminApi("/users/:id/discard"), // POST
      ADMIN_USER_UNDISCARD: AppRoutes.adminApi("/users/:id/undiscard"), // POST
      ADMIN_IAM_ROLES: AppRoutes.adminApi("/iam/roles"), // GET, POST
      ADMIN_IAM_ROLE_DETAIL: AppRoutes.adminApi("/iam/roles/:id"), // GET, PATCH, DELETE
      ADMIN_IAM_ROLE_PERMISSIONS: AppRoutes.adminApi("/iam/roles/permissions"), // GET
      ADMIN_NOTIFICATIONS: AppRoutes.adminApi("/notifications"), // POST
      ADMIN_NOTIFICATION_RECIPIENTS: AppRoutes.adminApi("/notifications/recipients"), // GET
      ADMIN_NOTIFICATION_TEMPLATES: AppRoutes.adminApi("/notifications/templates"), // GET
      ADMIN_PAYMENT_PRODUCTS: AppRoutes.adminApi("/payment/products"), // GET, POST
      ADMIN_PAYMENT_PRODUCT_DETAIL: AppRoutes.adminApi("/payment/products/:id"), // GET, PATCH, DELETE
      ADMIN_CHAT_ROOMS: AppRoutes.adminApi("/chat/rooms"), // GET
      ADMIN_CHAT_ROOM_DETAIL: AppRoutes.adminApi("/chat/rooms/:id"), // GET, PATCH, DELETE
      ADMIN_CHAT_MESSAGES: AppRoutes.adminApi("/chat/messages"), // GET
      ADMIN_CHAT_MESSAGE_DETAIL: AppRoutes.adminApi("/chat/messages/:id"), // GET, PATCH, DELETE
      IAM_PERMISSIONS: AppRoutes.adminApi("/iam/permissions"), // GET

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
