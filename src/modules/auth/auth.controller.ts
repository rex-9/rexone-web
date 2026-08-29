// src/controllers/auth.controller.ts

import { AuthService } from ".";
import { IUser } from "../../models";
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
    const { status, data } = response.data || {};

    if (status?.success && data?.token && data?.user) {
      return {
        success: true,
        token: data.token,
        user: data.user,
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
    const { status, data } = response.data || {};

    // OTP sent (unconfirmed user)
    if (status?.code === 200 && data?.otp_sent) {
      return {
        success: false,
        otpSent: true,
        message: status.message || "Verification code sent.",
      };
    }

    // Successful sign in
    if (status?.success && data?.token && data?.user) {
      return {
        success: true,
        token: data.token,
        user: data.user,
        message: status.message,
      };
    }

    // Failed attempt
    return {
      success: false,
      error: status?.error || response.error || "Incorrect passcode.",
      remainingAttempts: data?.remaining_attempts,
      cooldownRemaining: data?.cooldown_remaining,
    };
  }

  // Shared response handler
  private _handleAuthResponse(
    status: Record<string, any> | undefined,
    data: Record<string, any> | undefined,
    passwordRequired: boolean,
    challengeToken?: string,
  ) {
    if (status?.success) {
      if (passwordRequired) {
        if (!challengeToken) {
          return {
            success: false,
            statusCode: status.code,
            errorMessage: "Google verification requires passcode setup.",
          };
        }
        return {
          success: true,
          statusCode: status.code,
          passwordRequired: true,
          challengeToken,
          user: data?.user,
        };
      }

      return {
        success: true,
        statusCode: status.code,
        passwordRequired: false,
        user: data?.user,
        token: data?.token,
      };
    }

    return {
      success: false,
      statusCode: status?.code || 401,
      errorMessage: status?.error || "Google authentication failed.",
    };
  }

  // Google sign in (NO password attempt limiter)
  async signInWithGoogle(token: string): Promise<IGoogleSignInStartResult> {
    const response = await AuthService.signInWithGoogle(token);
    const { status, data } = response.data || {};

    const passwordRequired = data?.password_required === true;
    const challengeToken = data?.challenge_token || "";

    return this._handleAuthResponse(
      status,
      data,
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
    const { status, data } = response.data || {};

    const result = this._handleAuthResponse(status, data, false);
    return {
      success: result.success,
      statusCode: result.statusCode,
      errorMessage:
        result.errorMessage ||
        status?.error ||
        "Failed to complete Google sign in.",
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
    const { status, data } = response.data || {};

    if (status?.success && data?.token && data?.user) {
      return {
        success: true,
        token: data.token,
        user: data.user,
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
  }> {
    const response = await AuthService.sendForgotPasswordMail(email);
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to send password reset email.",
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
    const statusError = status?.error;
    const isAlreadySignedOut =
      statusError === AUTH_ERRORS.UNAUTHORIZED ||
      statusError === AUTH_ERRORS.SIGNATURE_EXPIRED ||
      statusError === AUTH_ERRORS.NO_VERIFICATION_KEY;

    return Boolean(status?.success || isAlreadySignedOut);
  }
}

export default new AuthController();
