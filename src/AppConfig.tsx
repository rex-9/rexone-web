class AppConfig {
  static readonly NODE_ENV = import.meta.env.NODE_ENV;
  static readonly GOOGLE_CLIENT_ID = import.meta.env
    .VITE_REACT_APP_GOOGLE_CLIENT_ID;
  static readonly SERVER_BASE_URL =
    import.meta.env.VITE_REACT_APP_SERVER_BASE_URL || "http://localhost:3000";
  static readonly CLIENT_BASE_URL =
    import.meta.env.VITE_REACT_APP_CLIENT_BASE_URL || "http://localhost:4000";
  static readonly SERVER_WS_BASE_URL =
    import.meta.env.VITE_REACT_APP_SERVER_WS_BASE_URL || "ws://localhost:3000";
}

export default AppConfig;
