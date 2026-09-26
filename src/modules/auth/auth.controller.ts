// src/controllers/auth.controller.ts

import AuthService from "./auth.service";
import { AppLocales, translate } from "../../locales";
import { IApiMeta, IApiResponseStatus, IJsonApiResource, IUser } from "../../models";
import { getApiError, parseRecord } from "../../services/api.service";
import { IGoogleSignInCompleteResult, IGoogleSignInStartResult } from "./types";
import { AUTH_ERRORS } from "./constants";

class AuthController {
  // Sign in with token from URL (email confirmation)
  async signInWithToken(token: string): Promise<{
    success: boolean;
    token?: string;
    user?: IUser;
    error?: string;
  }> {
    const response = await AuthService.signInWithToken(token);
    const { status, data, meta } = response.data || {};

    if (status?.success && meta?.token && data) {
      return {
        success: true,
        token: meta.token,
        user: parseRecord<IUser>(data),
      };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to sign in with token.",
    };
  }

  // Sign in with email/username + password (WITH attempt limiter)
  async signInWithEmailOrUsername(
    signinKey: string,
    password: string,
  ): Promise<{
    success: boolean;
    errorMessage?: string;
    token?: string;
    user?: IUser;
    remainingAttempts?: number;
    cooldownRemaining?: number;
    otpSent?: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await AuthService.signInWithEmailOrUsername(
      signinKey,
      password,
    );
    const { status, data, meta } = response.data || {};

    // OTP sent (unconfirmed user)
    if (status?.code === 200 && meta?.otp_sent) {
      return {
        success: false,
        otpSent: true,
        message:
          status.message ||
          translate(AppLocales.Auth.Shared.VerificationCodeSent),
      };
    }

    // Successful sign in
    if (status?.success && meta?.token && data) {
      return {
        success: true,
        token: meta.token,
        user: parseRecord<IUser>(data),
        message: status.message,
      };
    }

    // Failed attempt
    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Auth.Shared.SignInFailed),
      ),
      remainingAttempts: meta?.remaining_attempts,
      cooldownRemaining: meta?.cooldown_remaining,
    };
  }

  // Shared response handler
  private _handleAuthResponse(
    status: IApiResponseStatus | undefined,
    data: IJsonApiResource<IUser> | null | undefined,
    meta: IApiMeta | undefined,
    passwordRequired: boolean,
    challengeToken?: string,
  ) {
    if (status?.success) {
      if (passwordRequired) {
        if (!challengeToken) {
          return {
            success: false,
            statusCode: status.code,
            errorMessage: translate(AppLocales.Auth.Shared.GooglePasscodeRequired),
          };
        }
        return {
          success: true,
          statusCode: status.code,
          passwordRequired: true,
          challengeToken,
          user: data ? parseRecord<IUser>(data) : undefined,
        };
      }

      return {
        success: true,
        statusCode: status.code,
        passwordRequired: false,
        user: data ? parseRecord<IUser>(data) : undefined,
        token: meta?.token,
      };
    }

    return {
      success: false,
      statusCode: status?.code || 401,
      errorMessage:
        status?.error || translate(AppLocales.Auth.Shared.GoogleAuthenticationFailed),
    };
  }

  // Google sign in (NO password attempt limiter)
  async signInWithGoogle(token: string): Promise<IGoogleSignInStartResult> {
    const response = await AuthService.signInWithGoogle(token);
    const { status, data, meta } = response.data || {};

    const passwordRequired = meta?.password_required === true;
    const challengeToken = meta?.challenge_token || "";

    return this._handleAuthResponse(
      status,
      data,
      meta,
      passwordRequired,
      challengeToken,
    );
  }

  // Complete Google sign in (NO password attempt limiter, NO retry)
  async completeGoogleSignIn(
    password: string,
    challengeToken: string,
  ): Promise<IGoogleSignInCompleteResult> {
    const response = await AuthService.completeGoogleSignIn(
      password,
      challengeToken,
    );
    const { status, data, meta } = response.data || {};

    const result = this._handleAuthResponse(status, data, meta, false);
    return {
      success: result.success,
      statusCode: result.statusCode,
      errorMessage:
        result.errorMessage ||
        status?.error ||
        translate(AppLocales.Auth.Shared.GoogleSignInCompleteFailed),
      user: result.user,
      token: result.token,
    };
  }

  // Sign up with email
  async signUpWithEmail(
    username: string,
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await AuthService.signUpWithEmail(
      username,
      name,
      email,
      password,
      passwordConfirmation,
    );
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to sign up.",
    };
  }

  // Send confirmation email
  async sendConfirmationEmail(emailOrUsername: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await AuthService.sendConfirmationEmail(emailOrUsername);
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to send confirmation email.",
    };
  }

  // Confirm email with code
  async confirmEmailWithCode(
    emailOrUsername: string,
    confirmationCode: string,
  ): Promise<{
    success: boolean;
    token?: string;
    user?: IUser;
    message?: string;
    error?: string;
  }> {
    const response = await AuthService.confirmEmailWithCode(
      emailOrUsername,
      confirmationCode,
    );
    const { status, data, meta } = response.data || {};

    if (status?.success && meta?.token && data) {
      return {
        success: true,
        token: meta.token,
        user: parseRecord<IUser>(data),
        message: status.message,
      };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to confirm email code.",
    };
  }

  // Forgot password
  async sendForgotPasswordMail(email: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
    cooldownRemaining?: number;
  }> {
    const response = await AuthService.sendForgotPasswordMail(email);
    const { status, meta } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    const cooldownRemaining =
      typeof meta?.cooldown_remaining === "number"
        ? meta.cooldown_remaining
        : undefined;

    return {
      success: false,
      error: status?.error || response.error || "Failed to send password reset email.",
      cooldownRemaining,
    };
  }

  // Reset password
  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await AuthService.resetPassword(
      token,
      password,
      passwordConfirmation,
    );
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to reset password.",
    };
  }

  // Sign out
  async signOut(): Promise<boolean> {
    const response = await AuthService.signOut();
    const { status } = response.data || {};
    const statusError = status?.error || response.error;
    const isAlreadySignedOut =
      statusError === AUTH_ERRORS.UNAUTHORIZED ||
      statusError === AUTH_ERRORS.SIGNATURE_EXPIRED ||
      statusError === AUTH_ERRORS.NO_VERIFICATION_KEY;

    return Boolean(status?.success || isAlreadySignedOut);
  }
}

export default new AuthController();
