// src/controllers/auth.controller.ts

import AppRoutes from "../AppRoutes";
import { authService } from "../services";
import { IUser } from "../models";
import { apiHandler } from "../services";

export interface IGoogleSignInStartResult {
  success: boolean;
  statusCode?: number;
  passcodeRequired?: boolean; // Only when new user
  challengeToken?: string; // Only when new user
  user?: IUser; // Only when existing user
  token?: string; // Only when existing user
  errorMessage?: string;
}

export interface IGoogleSignInCompleteResult {
  success: boolean;
  statusCode?: number;
  user?: IUser;
  token?: string;
  errorMessage?: string;
}

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
      () => authService.signInWithToken(token),
      setError,
      (data) => {
        signin(data.data!.token, data.data!.user);
        if (onSuccess) {
          onSuccess(data.data!.token, data.data!.user);
        }
      },
    );
  }

  // Sign in with email/username + passcode (WITH attempt limiter)
  async signInWithEmailOrUsername(
    signinKey: string,
    passcode: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    signin: (token: string, user: IUser) => void,
    navigate: (url: string) => void,
  ): Promise<{
    success: boolean;
    remainingAttempts?: number;
    cooldownRemaining?: number;
    otpSent?: boolean;
  }> {
    try {
      const response = await authService.signInWithEmailOrUsername(
        signinKey,
        passcode,
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
        remainingAttempts: data?.remaining_attempts,
        cooldownRemaining: data?.cooldown_remaining,
      };
    } catch {
      setError("Failed to sign in.");
      return { success: false };
    }
  }

  // Google sign in (NO passcode attempt limiter)
  async signInWithGoogle(token: string): Promise<IGoogleSignInStartResult> {
    const response = await authService.signInWithGoogle(token);
    const { status, data } = response.data || {};

    if (status?.success) {
      // Map backend password_required to frontend passcodeRequired
      const passcodeRequired = data?.password_required === true;

      const challengeToken = data?.challenge_token || data?.flow_token || "";

      if (passcodeRequired) {
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
          passcodeRequired: true,
          challengeToken,
          user: data?.user,
        };
      }

      return {
        success: true,
        statusCode: status.code,
        passcodeRequired: false,
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

  // Complete Google sign in (NO passcode attempt limiter, NO retry)
  async completeGoogleSignIn(
    passcode: string,
    challengeToken: string,
  ): Promise<IGoogleSignInCompleteResult> {
    const response = await authService.completeGoogleSignIn(
      passcode,
      challengeToken,
    );
    const { status, data } = response.data || {};

    if (status?.success && data?.token && data?.user) {
      return {
        success: true,
        statusCode: status.code,
        user: data.user,
        token: data.token,
      };
    }

    return {
      success: false,
      statusCode: status?.code || 422,
      errorMessage: status?.error || "Failed to complete Google sign in.",
    };
  }

  // Sign up with email
  async signUpWithEmail(
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    setError: (message: string) => void,
    navigate: (url: string) => void,
  ): Promise<void> {
    await apiHandler(
      "signing up with email",
      () =>
        authService.signUpWithEmail(
          username,
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
      () => authService.sendConfirmationEmail(emailOrUsername),
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
      () => authService.confirmEmailWithCode(emailOrUsername, confirmationCode),
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
      () => authService.sendForgotPasswordMail(email),
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
      () => authService.resetPassword(token, password, passwordConfirmation),
      setError,
      () => {
        if (onSuccess) onSuccess();
      },
    );
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const response = await authService.signOut();
      const { status } = response.data || {};
      const statusError = status?.error;
      const isAlreadySignedOut =
        statusError === "Unauthorized" ||
        statusError === "Signature has expired" ||
        statusError === "No verification key available";

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
