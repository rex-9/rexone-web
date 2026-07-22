import AppRoutes from "../AppRoutes";

const DISALLOWED_POST_AUTH_PATHS = new Set([
  AppRoutes.client.public.ROOT,
  AppRoutes.client.public.SIGN_IN,
  AppRoutes.client.public.SIGN_UP,
  AppRoutes.client.public.CONFIRM_EMAIL,
  AppRoutes.client.public.FORGOT_PASSWORD,
  AppRoutes.client.public.RESET_PASSWORD,
  AppRoutes.client.protected.SIGN_OUT,
]);

export const getSafePostAuthRoute = (next?: string | null): string => {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return AppRoutes.client.protected.HOME;
  }

  const pathname = next.split(/[?#]/, 1)[0];
  if (DISALLOWED_POST_AUTH_PATHS.has(pathname)) {
    return AppRoutes.client.protected.HOME;
  }

  return next;
};
