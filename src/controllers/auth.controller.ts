import AppRoutes from "../AppRoutes";
import { authService } from "../services";
import {
  IUser,
  IApiAuthResponse,
  IGoogleSignInCompleteData,
  IGoogleSignInStartData,
} from "../models";
import { apiHandler } from "../services";

export interface IPasscodeRetryMeta {
  remainingAttempts?: number;
  cooldownSeconds?: number;
  cooldownUntilMs?: number;
}

export interface IPasscodeSignInResult {
  success: boolean;
  shouldCountAttempt: boolean;
  statusCode?: number;
  retryMeta?: IPasscodeRetryMeta;
  errorMessage?: string;
  otpSent?: boolean;
}

export interface IGoogleSignInStartResult {
  success: boolean;
  statusCode?: number;
  passcodeRequired?: boolean;
  passcodeAction?: string;
  challengeToken?: string;
  user?: IUser;
  token?: string;
  errorMessage?: string;
}

export interface IGoogleSignInCompleteResult {
  success: boolean;
  statusCode?: number;
  retryAfterSeconds?: number;
  user?: IUser;
  token?: string;
  errorMessage?: string;
}

class AuthController {
  private extractGooglePasscodeAction(payload: unknown): string | undefined {
    const rawAction = this.findFieldValue(payload, [
      "passcode_action",
      "passcodeAction",
    ]);
    const normalized = this.normalizeString(rawAction)?.toLowerCase();
    return normalized || undefined;
  }

  private normalizeString(value: unknown): string | undefined {
    if (typeof value !== "string") return undefined;

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private normalizeBoolean(value: unknown): boolean | undefined {
    if (typeof value === "boolean") return value;

    if (typeof value === "number") {
      if (value === 1) return true;
      if (value === 0) return false;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "yes", "y"].includes(normalized)) return true;
      if (["false", "0", "no", "n"].includes(normalized)) return false;
    }

    return undefined;
  }

  private extractGooglePasscodeRequired(payload: unknown): boolean {
    const rawValue = this.findFieldValue(payload, [
      "passcode_required",
      "passcodeRequired",
    ]);

    const normalizedBoolean = this.normalizeBoolean(rawValue);
    if (normalizedBoolean !== undefined) return normalizedBoolean;

    const normalizedString = this.normalizeString(rawValue)?.toLowerCase();
    if (!normalizedString) return false;

    if (
      ["required", "setup", "set", "create", "new"].includes(normalizedString)
    ) {
      return true;
    }

    return false;
  }

  private extractRetryAfterSeconds(payload: unknown): number | undefined {
    const retryAfterRaw = this.findFieldValue(payload, [
      "retry_after",
      "retryAfter",
      "retry_after_seconds",
      "retryAfterSeconds",
    ]);

    const normalized = this.normalizeNumber(retryAfterRaw);
    if (normalized === undefined) return undefined;

    return Math.max(0, Math.ceil(normalized));
  }

  private parseAuthError<T>(response: {
    data: IApiAuthResponse<T> | null;
    error?: string;
  }): {
    statusCode?: number;
    errorMessage: string;
  } {
    const statusCode = response.data?.status?.code;
    const errorMessage =
      response.data?.status?.error ||
      response.error ||
      response.data?.status?.message ||
      "Authentication failed.";

    return {
      statusCode,
      errorMessage,
    };
  }

  private findFieldValue(
    source: unknown,
    keys: string[],
    maxDepth = 4,
  ): unknown {
    if (!source || typeof source !== "object") return undefined;

    const queue: Array<{ node: unknown; depth: number }> = [
      { node: source, depth: 0 },
    ];
    const visited = new Set<object>();

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;

      const { node, depth } = current;
      if (!node || typeof node !== "object") continue;

      const objectNode = node as Record<string, unknown>;
      if (visited.has(objectNode)) continue;
      visited.add(objectNode);

      for (const [key, value] of Object.entries(objectNode)) {
        if (keys.includes(key)) {
          return value;
        }

        if (depth < maxDepth && value && typeof value === "object") {
          queue.push({ node: value, depth: depth + 1 });
        }
      }
    }

    return undefined;
  }

  private normalizeNumber(value: unknown): number | undefined {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return undefined;
  }

  private normalizeTimestampMs(value: unknown): number | undefined {
    const asNumber = this.normalizeNumber(value);
    if (asNumber !== undefined) {
      if (asNumber > 1e12) return asNumber;
      if (asNumber > 1e9) return asNumber * 1000;
    }

    if (typeof value === "string") {
      const dateMs = Date.parse(value);
      if (Number.isFinite(dateMs)) {
        return dateMs;
      }
    }

    return undefined;
  }

  private extractPasscodeRetryMeta(payload: unknown): IPasscodeRetryMeta {
    const remainingAttemptsRaw = this.findFieldValue(payload, [
      "remaining_attempts",
      "attempts_remaining_before_cooldown",
      "attempts_remaining",
      "remainingAttempts",
      "attemptsLeft",
    ]);

    const cooldownSecondsRaw = this.findFieldValue(payload, [
      "retry_after",
      "retry_after_seconds",
      "cooldown_seconds",
      "cooldown_remaining",
      "cooldownSeconds",
      "wait_seconds",
      "waitSeconds",
    ]);

    const cooldownUntilRaw = this.findFieldValue(payload, [
      "cooldown_until",
      "cooldownUntil",
      "retry_at",
      "retryAt",
      "unlock_at",
      "unlockAt",
      "cooldown_expires_at",
      "cooldownExpiresAt",
    ]);

    const remainingAttempts = this.normalizeNumber(remainingAttemptsRaw);
    const cooldownSecondsValue = this.normalizeNumber(cooldownSecondsRaw);
    const normalizedCooldownSeconds =
      cooldownSecondsValue === undefined
        ? undefined
        : cooldownSecondsValue > 1000
          ? Math.ceil(cooldownSecondsValue / 1000)
          : Math.ceil(cooldownSecondsValue);

    let cooldownUntilMs = this.normalizeTimestampMs(cooldownUntilRaw);
    if (
      !cooldownUntilMs &&
      normalizedCooldownSeconds &&
      normalizedCooldownSeconds > 0
    ) {
      cooldownUntilMs = Date.now() + normalizedCooldownSeconds * 1000;
    }

    return {
      remainingAttempts:
        remainingAttempts === undefined
          ? undefined
          : Math.max(0, Math.floor(remainingAttempts)),
      cooldownSeconds:
        normalizedCooldownSeconds === undefined
          ? undefined
          : Math.max(0, normalizedCooldownSeconds),
      cooldownUntilMs,
    };
  }

  async signInWithToken(
    token: string,
    setError: (message: string) => void,
    signin: (token: string, user: IUser) => void,
  ): Promise<void> {
    await apiHandler(
      "signing in with token",
      () => authService.signInWithToken(token),
      setError,
      (data) => signin(data.data!.token, data.data!.user),
    );
  }

  async signInWithEmailOrUsername(
    signinKey: string,
    passcode: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    signin: (token: string, user: IUser) => void,
    navigate: (url: string) => void,
  ): Promise<IPasscodeSignInResult> {
    try {
      const response = await authService.signInWithEmailOrUsername(
        signinKey,
        passcode,
      );
      const { status, data } = response.data || {};
      const retryMeta = this.extractPasscodeRetryMeta(response.data);
      const statusCode = status?.code;

      if (statusCode === 200 && status?.success && data?.otp_sent) {
        return {
          success: false,
          shouldCountAttempt: false,
          statusCode,
          otpSent: true,
          retryMeta,
          errorMessage: status?.message || "Verification code sent.",
        };
      }

      if (status?.success && data?.token && data?.user) {
        setMessage(status.message);
        signin(data.token, data.user);
        navigate(AppRoutes.client.protected.HOME);
        return {
          success: true,
          shouldCountAttempt: false,
          statusCode,
          retryMeta: {
            ...retryMeta,
            remainingAttempts: retryMeta.remainingAttempts ?? 3,
            cooldownSeconds: 0,
            cooldownUntilMs: 0,
          },
        };
      }

      const errorMessage =
        status?.error ||
        response.error ||
        status?.message ||
        "Incorrect passcode. Please try again.";
      const normalizedError = errorMessage.toLowerCase();
      const shouldCountAttempt =
        [401, 403, 422, 429].includes(status?.code ?? -1) ||
        retryMeta.remainingAttempts !== undefined ||
        (retryMeta.cooldownSeconds ?? 0) > 0 ||
        (retryMeta.cooldownUntilMs ?? 0) > Date.now() ||
        /(passcode|password|credential|invalid|incorrect|wrong|unauthor)/.test(
          normalizedError,
        );

      setError(errorMessage);
      setMessage("");

      return {
        success: false,
        shouldCountAttempt,
        statusCode,
        retryMeta,
        errorMessage,
      };
    } catch (error) {
      const errorMessage = "Failed to sign in. Please try again.";
      setError(errorMessage);
      setMessage("");
      return {
        success: false,
        shouldCountAttempt: false,
        statusCode: undefined,
        retryMeta: undefined,
        errorMessage,
      };
    }
  }

  async signInWithGoogle(token: string): Promise<IGoogleSignInStartResult> {
    const response = await authService.signInWithGoogle(token);
    const { status, data } = response.data || {};

    if (status?.success) {
      const passcodeRequired = this.extractGooglePasscodeRequired(
        response.data,
      );
      const challengeToken = data?.challenge_token || data?.flow_token;
      const passcodeAction = this.extractGooglePasscodeAction(response.data);

      if (passcodeRequired) {
        if (!challengeToken || !passcodeAction) {
          return {
            success: false,
            statusCode: status.code,
            errorMessage:
              "Google verification requires passcode setup metadata.",
          };
        }

        return {
          success: true,
          statusCode: status.code,
          passcodeRequired: true,
          passcodeAction,
          challengeToken,
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

    const { statusCode, errorMessage } =
      this.parseAuthError<IGoogleSignInStartData>(response);
    return {
      success: false,
      statusCode,
      errorMessage,
    };
  }

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

    const { statusCode, errorMessage } =
      this.parseAuthError<IGoogleSignInCompleteData>(response);
    const retryAfterSeconds = this.extractRetryAfterSeconds(response.data);

    return {
      success: false,
      statusCode,
      retryAfterSeconds,
      errorMessage,
    };
  }

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

  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    navigate: (url: string) => void,
  ): Promise<void> {
    await apiHandler(
      "resetting password",
      () => authService.resetPassword(token, password, passwordConfirmation),
      setError,
      (data) => {
        setMessage(data.status.message);
        navigate(AppRoutes.client.public.SIGN_IN);
      },
    );
  }

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
