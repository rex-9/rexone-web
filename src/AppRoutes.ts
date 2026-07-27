class AppRoutes {
  // private static readonly PROTECTED_PREFIX = "/auth";

  static readonly client = {
    public: {
      SIGN_IN: "/signin",
      SIGN_UP: "/signup",
      CONFIRM_EMAIL: "/email/confirm",
      FORGOT_PASSWORD: "/password/forgot",
      RESET_PASSWORD: "/password/reset",
      PAYMENT: "/payment",
      PAYMENT_STATUS: "/payment/status",
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
      GET_PRODUCT_DETAILS: "/payments/product_details",
      CREATE_ORDER: "/orders",
      ORDER: "/orders",
    },
    protected: {
      SIGN_OUT: "/signout",
      PEEK_USER: "/users/peek",
      GET_CURRENT_USER: "/users/current",
      UPLOAD_ASSET: "/media/upload",
      DELIVER_MAIL: "/mail/deliver",
      CREATE_PAYMENT_INTENT: "/payments/payment_intents",
      GET_PAYMENT_STATUS: "/payments/status",
    },
  };
}

export default AppRoutes;
