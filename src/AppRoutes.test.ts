import { describe, expect, it } from "vitest";
import AppRoutes from "./AppRoutes";

describe("AppRoutes", () => {
  describe("isAuthEndpoint", () => {
    it("returns true for all defined authentication endpoints", () => {
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.public.PEEK_USER)).toBe(true);
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.public.SIGN_UP)).toBe(true);
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.public.SIGN_IN_EMAIL)).toBe(true);
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.public.SIGN_IN_TOKEN)).toBe(true);
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.public.SIGN_IN_GOOGLE)).toBe(true);
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.public.SIGN_IN_GOOGLE_COMPLETE)).toBe(true);
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.public.SEND_EMAIL_CODE)).toBe(true);
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.public.CONFIRM_CODE)).toBe(true);
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.public.FORGOT_PASSWORD)).toBe(true);
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.public.RESET_PASSWORD)).toBe(true);
    });

    it("returns true for endpoints with query parameters or full origins", () => {
      expect(AppRoutes.isAuthEndpoint("/peek?email=test%40example.com")).toBe(true);
      expect(AppRoutes.isAuthEndpoint("http://localhost:3000/signin")).toBe(true);
      expect(AppRoutes.isAuthEndpoint("https://api.rex9.me/confirmation/confirm_code")).toBe(true);
    });

    it("returns false for non-auth endpoints and protected routes", () => {
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.protected.SIGN_OUT)).toBe(false);
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.protected.USERS)).toBe(false);
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.public.FEEDBACK)).toBe(false);
      expect(AppRoutes.isAuthEndpoint(AppRoutes.server.protected.PAYMENT_SESSION)).toBe(false);
      expect(AppRoutes.isAuthEndpoint("")).toBe(false);
      expect(AppRoutes.isAuthEndpoint(undefined)).toBe(false);
    });
  });
});
