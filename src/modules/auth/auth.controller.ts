// src/controllers/auth.controller.ts

import { AuthService } from ".";
import AppRoutes from "../../AppRoutes";
import { IUser } from "../../models";
import { apiHandler } from "../../services";
import { IGoogleSignInCompleteResult, IGoogleSignInStartResult } from "./types";

const AUTH_ERRORS = {
  UNAUTHORIZED: "Unauthorized",
  SIGNATURE_EXPIRED: "Signature has expired",
  NO_VERIFICATION_KEY: "No verification key available",
} as const;

class AuthController {
  // Sign in with token from URL (email confirmation)
  async signInWithToken(
    token: string,
    setError: (message: string) => void,
    signin: (token: string, user: IUser) => void,
    onSuccess?: (token: string, user: IUser) => void,
  ): Promise<void> {
    await apiHandler(
      "signing in with token",
      () => AuthService.signInWithToken(token),
      setError,
      (data) => {
        signin(data.data!.token, data.data!.user);
        if (onSuccess) {
          onSuccess(data.data!.token, data.data!.user);
        }
      },
    );
  }

  // Sign in with email/username + password (WITH attempt limiter)
  async signInWithEmailOrUsername(
    signinKey: string,
    password: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    signin: (token: string, user: IUser) => void,
    navigate: (url: string) => void,
  ): Promise<{
    success: boolean;
    errorMessage?: string;
    remainingAttempts?: number;
    cooldownRemaining?: number;
    otpSent?: boolean;
  }> {
    try {
      const response = await AuthService.signInWithEmailOrUsername(
        signinKey,
        password,
      );
      const { status, data } = response.data || {};

      // OTP sent (unconfirmed user)
      if (status?.code === 200 && data?.otp_sent) {
        setMessage(status.message || "Verification code sent.");
        return { success: false, otpSent: true };
      }

      // Successful sign in
      if (status?.success && data?.token && data?.user) {
        setMessage(status.message);
        signin(data.token, data.user);
        navigate(AppRoutes.client.protected.HOME);
        return { success: true };
      }

      // ❌ Failed attempt
      const errorMessage = status?.error || "Incorrect passcode.";
      setError(errorMessage);

      return {
        success: false,
        errorMessage,
        remainingAttempts: data?.remaining_attempts,
        cooldownRemaining: data?.cooldown_remaining,
      };
    } catch {
      const errorMessage = "Failed to sign in.";
      setError(errorMessage);
      return { success: false, errorMessage };
    }
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
    setError: (message: string) => void,
    navigate: (url: string) => void,
  ): Promise<void> {
    await apiHandler(
      "signing up with email",
      () =>
        AuthService.signUpWithEmail(
          username,
          name,
          email,
          password,
          passwordConfirmation,
        ),
      setError,
      () =>
        navigate(
          `${AppRoutes.client.public.CONFIRM_EMAIL}?signin_key=${email}`,
        ),
    );
  }

  // Send confirmation email
  async sendConfirmationEmail(
    emailOrUsername: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    startCountdown: () => void,
  ): Promise<void> {
    await apiHandler(
      "sending confirmation email",
      () => AuthService.sendConfirmationEmail(emailOrUsername),
      setError,
      (data) => {
        setMessage(data.status.message);
        startCountdown();
      },
    );
  }

  // Confirm email with code
  async confirmEmailWithCode(
    emailOrUsername: string,
    confirmationCode: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    signin: (token: string, user: IUser) => void,
    navigate: (url: string) => void,
  ): Promise<void> {
    await apiHandler(
      "confirming email with code",
      () => AuthService.confirmEmailWithCode(emailOrUsername, confirmationCode),
      setError,
      (data) => {
        setMessage(data.status.message);
        signin(data.data!.token, data.data!.user);
        navigate(AppRoutes.client.protected.HOME);
      },
      () => setMessage(""),
    );
  }

  // Forgot password
  async sendForgotPasswordMail(
    email: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    startCountdown: () => void,
  ): Promise<void> {
    await apiHandler(
      "sending forgot password email",
      () => AuthService.sendForgotPasswordMail(email),
      setError,
      (data) => {
        setMessage(data.status.message);
        startCountdown();
      },
    );
  }

  // Reset password
  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string,
    setError: (message: string) => void,
    onSuccess?: () => void,
  ): Promise<void> {
    await apiHandler(
      "resetting password",
      () => AuthService.resetPassword(token, password, passwordConfirmation),
      setError,
      () => {
        if (onSuccess) onSuccess();
      },
    );
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const response = await AuthService.signOut();
      const { status } = response.data || {};
      const statusError = status?.error;
      const isAlreadySignedOut =
        statusError === AUTH_ERRORS.UNAUTHORIZED ||
        statusError === AUTH_ERRORS.SIGNATURE_EXPIRED ||
        statusError === AUTH_ERRORS.NO_VERIFICATION_KEY;

      if (status?.success || isAlreadySignedOut) {
        console.log("user signed out from server successfully.");
      } else {
        console.log("server signout failed.");
      }
    } catch (error) {
      console.log(`An error occurred during server sign out. error: ${error}`);
    }
  }
}

export default new AuthController();
