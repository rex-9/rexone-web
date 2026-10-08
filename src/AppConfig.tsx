// src/AppConfig.tsx
// ==============================================================================
// 🏛️ RexOne Web Centralized Application Configuration (Law U2 & Law U14)
// ==============================================================================
// Zero Fallback Security Boot Guard: Environment variables must be explicitly
// defined across all environments (dev, UAT, production). Missing variables
// halt execution immediately with clear diagnostic logs.
// ==============================================================================

function requireEnv(key: string): string {
  const val = (import.meta.env[key] as string | undefined)?.trim();
  if (val && val.length > 0) {
    return val;
  }

  const errorMsg = `🚨 [Security Boot Guard]: Missing required environment variable '${key}'. Please define it in your .env file.`;
  console.error(errorMsg);
  throw new Error(errorMsg);
}

function optionalEnv(key: string): string {
  return (import.meta.env[key] as string | undefined)?.trim() || "";
}

class AppConfig {
  static readonly IS_DEV = Boolean(import.meta.env.DEV);
  static readonly NODE_ENV = import.meta.env.NODE_ENV;
  static readonly APP_NAME = requireEnv("VITE_REACT_APP_NAME");

  // Public OAuth Credentials
  static readonly GOOGLE_CLIENT_ID = optionalEnv(
    "VITE_REACT_APP_GOOGLE_CLIENT_ID",
  );

  // Core API & Web Networking (Strict - Zero Fallback in all environments)
  static readonly SERVER_BASE_URL = requireEnv(
    "VITE_REACT_APP_SERVER_BASE_URL",
  );
  static readonly CLIENT_BASE_URL = requireEnv(
    "VITE_REACT_APP_CLIENT_BASE_URL",
  );
  static readonly SERVER_WS_BASE_URL = requireEnv(
    "VITE_REACT_APP_SERVER_WS_BASE_URL",
  );

  static readonly FROM_EMAIL = requireEnv("VITE_REACT_APP_FROM_EMAIL");

  // Firebase Configuration
  static readonly FIREBASE = {
    apiKey: optionalEnv("VITE_FIREBASE_API_KEY"),
    authDomain: optionalEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: optionalEnv("VITE_FIREBASE_PROJECT_ID"),
    appId: optionalEnv("VITE_FIREBASE_APP_ID"),
    measurementId: optionalEnv("VITE_FIREBASE_MEASUREMENT_ID"),
  };

  // Media upload limits
  static readonly MEDIA_MAX_NON_VIDEO_SIZE_MB = Number(
    import.meta.env.VITE_MEDIA_MAX_NON_VIDEO_SIZE_MB || 10,
  );
  static readonly MEDIA_MAX_VIDEO_SIZE_MB = Number(
    import.meta.env.VITE_MEDIA_MAX_VIDEO_SIZE_MB || 300,
  );
  static readonly MEDIA_MAX_FILE_COUNT = Number(
    import.meta.env.VITE_MEDIA_MAX_FILE_COUNT || 30,
  );
}

export default AppConfig;
