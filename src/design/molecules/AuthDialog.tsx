import React, { useEffect, useRef, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppRoutes from "../../AppRoutes";
import { useAuth } from "../../contexts";
import authController, {
  type IPasscodeRetryMeta,
} from "../../controllers/auth.controller";
import { userController } from "../../controllers";
import { AppLocales } from "../../locales/app_locales";
import { useCountdown } from "../../utils";
import { Dialog } from ".";
import {
  ForgotPasswordDialog,
  InitialDialog,
  SigninPasscodeDialog,
  SignupInfoDialog,
  SignupPasscodeConfirmDialog,
  SignupPasscodeCreateDialog,
  VerifyEmailDialog,
} from "./auth";

type AuthStep =
  | "initial"
  | "signin-passcode"
  | "signup-passcode-create"
  | "signup-passcode-confirm"
  | "signup-info"
  | "verify-email"
  | "forgot-password";

interface IPersistedPasscodeRetryState {
  remainingAttempts: number;
  cooldownUntilMs: number;
  hasFailureHistory: boolean;
  cooldownLevel?: number;
}

const FALLBACK_ATTEMPTS_PER_WINDOW = 3;
const FALLBACK_COOLDOWN_SECONDS_BY_LEVEL = [30, 60, 120] as const;
const SENSITIVE_AUTH_QUERY_KEYS = [
  "passcode",
  "passcodeConfirmation",
  "confirmPasscode",
  "forgotPasscode",
  "resetPasscode",
] as const;

const getPasscodeRetryStorageKey = (signinKey: string): string =>
  `meritbox-passcode-retry-server:${signinKey.trim().toLowerCase() || "anonymous"}`;

const loadPersistedPasscodeRetryState = (
  signinKey: string,
): IPersistedPasscodeRetryState => {
  if (typeof window === "undefined") {
    return {
      remainingAttempts: FALLBACK_ATTEMPTS_PER_WINDOW,
      cooldownUntilMs: 0,
      hasFailureHistory: false,
      cooldownLevel: 0,
    };
  }

  const storageKey = getPasscodeRetryStorageKey(signinKey);
  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return {
      remainingAttempts: FALLBACK_ATTEMPTS_PER_WINDOW,
      cooldownUntilMs: 0,
      hasFailureHistory: false,
      cooldownLevel: 0,
    };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<IPersistedPasscodeRetryState>;
    const remainingAttempts =
      typeof parsed.remainingAttempts === "number" &&
      Number.isFinite(parsed.remainingAttempts)
        ? Math.max(0, Math.floor(parsed.remainingAttempts))
        : FALLBACK_ATTEMPTS_PER_WINDOW;
    const cooldownUntilMs =
      typeof parsed.cooldownUntilMs === "number" &&
      Number.isFinite(parsed.cooldownUntilMs)
        ? parsed.cooldownUntilMs
        : 0;
    const hasFailureHistory = parsed.hasFailureHistory === true;
    const cooldownLevel =
      typeof parsed.cooldownLevel === "number" &&
      Number.isFinite(parsed.cooldownLevel)
        ? Math.max(0, Math.min(3, Math.floor(parsed.cooldownLevel)))
        : 0;

    const isCooldownActive = cooldownUntilMs > Date.now();
    const normalizedRemainingAttempts =
      !isCooldownActive && remainingAttempts <= 0
        ? FALLBACK_ATTEMPTS_PER_WINDOW
        : remainingAttempts;

    return {
      remainingAttempts: normalizedRemainingAttempts,
      cooldownUntilMs: isCooldownActive ? cooldownUntilMs : 0,
      hasFailureHistory,
      cooldownLevel,
    };
  } catch {
    return {
      remainingAttempts: FALLBACK_ATTEMPTS_PER_WINDOW,
      cooldownUntilMs: 0,
      hasFailureHistory: false,
      cooldownLevel: 0,
    };
  }
};

const persistPasscodeRetryState = (
  signinKey: string,
  state: IPersistedPasscodeRetryState,
) => {
  if (typeof window === "undefined") return;

  const storageKey = getPasscodeRetryStorageKey(signinKey);
  window.localStorage.setItem(storageKey, JSON.stringify(state));
};

export const AuthDialog: React.FC = () => {
  const CLOSE_ANIMATION_MS = 220;
  const { isAuthenticated, signin, googleSsoState, dispatchGoogleSsoAction } =
    useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const isOpen = searchParams.get("dialog") === "auth";

  const getPostSignInRoute = (): string => {
    const next = searchParams.get("next");
    if (!next) return AppRoutes.client.protected.HOME;

    // Only allow app-relative redirects.
    if (!next.startsWith("/") || next.startsWith("//")) {
      return AppRoutes.client.protected.HOME;
    }

    return next;
  };

  const getStepFromUrl = (): AuthStep => {
    const stepParam = searchParams.get("step");

    if (!stepParam) return "initial";

    const normalized = stepParam as AuthStep;
    const validSteps: AuthStep[] = [
      "initial",
      "signin-passcode",
      "signup-passcode-create",
      "signup-passcode-confirm",
      "signup-info",
      "verify-email",
      "forgot-password",
    ];

    return validSteps.includes(normalized) ? normalized : "initial";
  };

  const [step, setStep] = useState<AuthStep>(getStepFromUrl());
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [passcode, setPasscode] = useState("");
  const [passcodeConfirmation, setPasscodeConfirmation] = useState("");
  const [otp, setOtp] = useState(searchParams.get("otp") || "");
  const [fullName, setFullName] = useState(searchParams.get("fullName") || "");
  const [username, setUsername] = useState(searchParams.get("username") || "");
  const [resetPasswordToken, setResetPasswordToken] = useState(
    searchParams.get("reset_password_token") || "",
  );

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [googlePasscodeSetupRequired, setGooglePasscodeSetupRequired] =
    useState(false);

  const closeTimerRef = useRef<number | null>(null);
  const autoSubmittedSignInPasscodeRef = useRef("");
  const autoSubmittedCreatePasscodeRef = useRef("");
  const autoSubmittedConfirmPasscodeRef = useRef("");
  const autoSubmittedVerifyEmailOtpRef = useRef("");
  const signInRequestInFlightRef = useRef(false);
  const googleVerifyRequestInFlightRef = useRef(false);
  const googlePasscodeRequestInFlightRef = useRef(false);
  const wasCooldownActiveRef = useRef(false);

  const [serverRemainingAttempts, setServerRemainingAttempts] =
    useState<number>(
      () =>
        loadPersistedPasscodeRetryState(searchParams.get("email") || "")
          .remainingAttempts,
    );
  const [hasFailureHistory, setHasFailureHistory] = useState<boolean>(
    () =>
      loadPersistedPasscodeRetryState(searchParams.get("email") || "")
        .hasFailureHistory,
  );
  const [fallbackCooldownLevel, setFallbackCooldownLevel] = useState<number>(
    () =>
      loadPersistedPasscodeRetryState(searchParams.get("email") || "")
        .cooldownLevel ?? 0,
  );

  const remainingAttemptsRef = useRef(serverRemainingAttempts);
  const hasFailureHistoryRef = useRef(hasFailureHistory);
  const fallbackCooldownLevelRef = useRef(fallbackCooldownLevel);

  const signInCooldown = useCountdown(0);
  const googleRetryCountdown = useCountdown(0);
  const resendCodeCountdown = useCountdown(0);

  const cooldownSecondsLeft = signInCooldown.secondsLeft;
  const isCooldownActive = signInCooldown.isActive;
  const isGoogleRetryActive = googleRetryCountdown.isActive;

  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Never persist sensitive passcode-related fields in URL query params.
    SENSITIVE_AUTH_QUERY_KEYS.forEach((key) => params.delete(key));

    setSearchParams(params, { replace: true });
  };

  const syncRetryStateFromStorage = (): IPersistedPasscodeRetryState => {
    const persisted = loadPersistedPasscodeRetryState(email);
    setServerRemainingAttempts(persisted.remainingAttempts);
    setHasFailureHistory(persisted.hasFailureHistory);
    setFallbackCooldownLevel(persisted.cooldownLevel ?? 0);
    remainingAttemptsRef.current = persisted.remainingAttempts;
    hasFailureHistoryRef.current = persisted.hasFailureHistory;
    fallbackCooldownLevelRef.current = persisted.cooldownLevel ?? 0;
    signInCooldown.startAt(persisted.cooldownUntilMs);
    return persisted;
  };

  const applyServerRetryMeta = (
    retryMeta?: IPasscodeRetryMeta,
    options: {
      mode?: "success" | "failure";
      statusCode?: number;
      shouldCountAttempt?: boolean;
    } = {},
  ) => {
    const mode = options.mode ?? "failure";
    const now = Date.now();
    let nextRemainingAttempts = remainingAttemptsRef.current;
    let nextHasFailureHistory = hasFailureHistoryRef.current;
    let nextFallbackCooldownLevel = fallbackCooldownLevelRef.current;

    const hasServerMeta =
      retryMeta?.remainingAttempts !== undefined ||
      retryMeta?.cooldownSeconds !== undefined ||
      retryMeta?.cooldownUntilMs !== undefined;

    const shouldCountAttempt = options.shouldCountAttempt ?? mode === "success";

    const fallbackTriggeredStatus =
      mode === "failure" &&
      shouldCountAttempt &&
      [401, 429].includes(options.statusCode ?? -1);

    if (mode === "success") {
      nextRemainingAttempts = FALLBACK_ATTEMPTS_PER_WINDOW;
      nextHasFailureHistory = false;
      nextFallbackCooldownLevel = 0;
    } else {
      if (!shouldCountAttempt) {
        nextRemainingAttempts = remainingAttemptsRef.current;
      } else if (hasServerMeta && retryMeta?.remainingAttempts !== undefined) {
        nextRemainingAttempts = Math.max(0, retryMeta.remainingAttempts);
      } else if (fallbackTriggeredStatus) {
        const safeCurrentAttempts =
          remainingAttemptsRef.current > 0
            ? remainingAttemptsRef.current
            : FALLBACK_ATTEMPTS_PER_WINDOW;
        nextRemainingAttempts = Math.max(0, safeCurrentAttempts - 1);
      }

      nextHasFailureHistory = hasServerMeta
        ? retryMeta?.remainingAttempts !== undefined ||
          (retryMeta?.cooldownSeconds ?? 0) > 0 ||
          (retryMeta?.cooldownUntilMs ?? 0) > now
        : (fallbackTriggeredStatus || nextHasFailureHistory) &&
          shouldCountAttempt;
    }

    let cooldownFromUntil = retryMeta?.cooldownUntilMs ?? 0;
    let cooldownFromSeconds =
      retryMeta?.cooldownSeconds && retryMeta.cooldownSeconds > 0
        ? now + retryMeta.cooldownSeconds * 1000
        : 0;

    if (
      !hasServerMeta &&
      fallbackTriggeredStatus &&
      nextRemainingAttempts === 0
    ) {
      const nextLevel = Math.min(nextFallbackCooldownLevel + 1, 3);
      nextFallbackCooldownLevel = nextLevel;
      const durationSeconds =
        FALLBACK_COOLDOWN_SECONDS_BY_LEVEL[nextLevel - 1] ??
        FALLBACK_COOLDOWN_SECONDS_BY_LEVEL[
          FALLBACK_COOLDOWN_SECONDS_BY_LEVEL.length - 1
        ];
      cooldownFromSeconds = now + durationSeconds * 1000;
    }

    const nextCooldownUntilMs = Math.max(
      cooldownFromUntil,
      cooldownFromSeconds,
    );
    const normalizedCooldownUntilMs =
      nextCooldownUntilMs > now ? nextCooldownUntilMs : 0;

    if (normalizedCooldownUntilMs > now) {
      nextRemainingAttempts = 0;
      nextHasFailureHistory = true;
    }

    if (mode === "success") {
      nextFallbackCooldownLevel = 0;
    }

    setServerRemainingAttempts(nextRemainingAttempts);
    setHasFailureHistory(nextHasFailureHistory);
    setFallbackCooldownLevel(nextFallbackCooldownLevel);
    signInCooldown.startAt(normalizedCooldownUntilMs);

    persistPasscodeRetryState(email, {
      remainingAttempts: nextRemainingAttempts,
      cooldownUntilMs: normalizedCooldownUntilMs,
      hasFailureHistory: nextHasFailureHistory,
      cooldownLevel: nextFallbackCooldownLevel,
    });
  };

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    [
      "dialog",
      "step",
      "email",
      "passcode",
      "otp",
      "fullName",
      "username",
      "reset_password_token",
      "session_message",
    ].forEach((key) => params.delete(key));
    setSearchParams(params);

    setStep("initial");
    setEmail("");
    setOtp("");
    setPasscode("");
    setPasscodeConfirmation("");
    setFullName("");
    setUsername("");
    setResetPasswordToken("");
    setError("");
    setMessage("");
    setEmailError("");
    setOtpError("");
    setPasscodeError("");
    setGooglePasscodeSetupRequired(false);
    dispatchGoogleSsoAction({ type: "RESET" });
    googleRetryCountdown.clear();
    resendCodeCountdown.clear();
  };

  const startClosingDialog = () => {
    if (isClosing) return;

    setIsClosing(true);
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      handleClose();
      setIsClosing(false);
      closeTimerRef.current = null;
    }, CLOSE_ANIMATION_MS);
  };

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmailError("");
    setError("");
    setMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(
        "Please enter a valid email address. (e.g. example@domain.com)",
      );
      return;
    }

    setIsLoading(true);
    try {
      const userExists = await userController.peekUser(email, setError);
      if (userExists) {
        setStep("signin-passcode");
        updateUrlParams({ step: "signin-passcode", email, passcode: null });
      } else if (userExists === false) {
        setStep("signup-passcode-create");
        updateUrlParams({
          step: "signup-passcode-create",
          email,
          passcode: null,
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to check user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitGooglePasscode = async (passcodeToSubmit: string) => {
    if (
      googlePasscodeRequestInFlightRef.current ||
      isGoogleRetryActive ||
      !googleSsoState.challengeToken
    ) {
      return;
    }

    googlePasscodeRequestInFlightRef.current = true;
    setIsLoading(true);
    dispatchGoogleSsoAction({ type: "SUBMIT_PASSCODE_START" });
    let shouldResetGoogleFlow = false;

    try {
      const result = await authController.completeGoogleSignIn(
        passcodeToSubmit,
        googleSsoState.challengeToken,
      );

      if (result.success && result.token && result.user) {
        signin(result.token, result.user);
        dispatchGoogleSsoAction({
          type: "SUBMIT_PASSCODE_SUCCESS_AUTHENTICATED",
        });
        dispatchGoogleSsoAction({ type: "CLEAR_CHALLENGE_TOKEN" });
        setGooglePasscodeSetupRequired(false);
        navigate(getPostSignInRoute());
        return;
      }

      if (result.statusCode === 422) {
        setPasscodeError(result.errorMessage || "Invalid passcode.");
      } else if (result.statusCode === 429) {
        const waitSeconds = Math.max(1, result.retryAfterSeconds ?? 1);
        googleRetryCountdown.start(waitSeconds);
        setPasscodeError(
          `Too many attempts. Please wait ${waitSeconds} seconds and try again.`,
        );
      } else if (result.statusCode === 401) {
        setError(t(AppLocales.SignInGoogleFailure));
        shouldResetGoogleFlow = true;
      } else {
        setError(result.errorMessage || "Failed to complete Google sign in.");
        shouldResetGoogleFlow = true;
      }

      dispatchGoogleSsoAction({
        type: "SUBMIT_PASSCODE_FAILED",
        errorMessage: result.errorMessage || "Google sign in failed.",
        errorCode: result.statusCode,
        retryAfterSeconds: result.retryAfterSeconds,
      });
    } catch {
      setError("Failed to complete Google sign in.");
      shouldResetGoogleFlow = true;
      dispatchGoogleSsoAction({
        type: "SUBMIT_PASSCODE_FAILED",
        errorMessage: "Failed to complete Google sign in.",
      });
    } finally {
      if (shouldResetGoogleFlow) {
        dispatchGoogleSsoAction({ type: "CLEAR_CHALLENGE_TOKEN" });
        setGooglePasscodeSetupRequired(false);
      }
      googlePasscodeRequestInFlightRef.current = false;
      setIsLoading(false);
    }
  };

  const handleSignInPasscode = async () => {
    const isGooglePasscodeFlow =
      googleSsoState.status === "passcode_required" ||
      googleSsoState.status === "submitting_passcode";

    if (isGooglePasscodeFlow) {
      setPasscodeError("");
      setError("");
      setMessage("");

      if (passcode.length !== 6) {
        setPasscodeError("Passcode must be 6 digits");
        return;
      }

      await submitGooglePasscode(passcode);

      return;
    }

    const persisted = syncRetryStateFromStorage();
    if (
      persisted.cooldownUntilMs > Date.now() ||
      signInRequestInFlightRef.current
    ) {
      return;
    }

    const normalizedSigninKey = email.trim();
    if (!normalizedSigninKey) {
      setStep("initial");
      setPasscode("");
      setPasscodeError("Please enter your email before signing in.");
      updateUrlParams({ step: "initial", email: null, passcode: null });
      return;
    }

    setPasscodeError("");
    setError("");
    setMessage("");

    if (passcode.length !== 6) {
      setPasscodeError("Passcode must be 6 digits");
      return;
    }

    signInRequestInFlightRef.current = true;
    setIsLoading(true);

    try {
      const result = await authController.signInWithEmailOrUsername(
        normalizedSigninKey,
        passcode,
        setPasscodeError,
        setMessage,
        signin,
        navigate,
        getPostSignInRoute(),
      );

      if (result.success) {
        applyServerRetryMeta(result.retryMeta, {
          mode: "success",
          statusCode: result.statusCode,
          shouldCountAttempt: false,
        });
        return;
      }

      applyServerRetryMeta(result.retryMeta, {
        mode: "failure",
        statusCode: result.statusCode,
        shouldCountAttempt: result.shouldCountAttempt,
      });

      if (result.statusCode === 429) {
        const waitSeconds =
          result.retryMeta?.cooldownSeconds ??
          Math.max(
            0,
            Math.ceil(
              ((result.retryMeta?.cooldownUntilMs ?? 0) - Date.now()) / 1000,
            ),
          );
        setPasscodeError(
          `Too many incorrect passcode attempts. Please wait ${waitSeconds} seconds.`,
        );
      }
    } catch (err: any) {
      setPasscodeError(err.message || "Incorrect passcode. Please try again.");
    } finally {
      signInRequestInFlightRef.current = false;
      setIsLoading(false);
    }
  };

  const handleSignInPasscodeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleSignInPasscode();
  };

  const handleCreatePasscode = async () => {
    setPasscodeError("");
    setError("");

    if (passcode.length !== 6) {
      setPasscodeError("Passcode must be 6 digits");
      return;
    }

    setStep("signup-passcode-confirm");
    setPasscodeConfirmation("");
    updateUrlParams({ step: "signup-passcode-confirm", email, passcode });
  };

  const handleCreatePasscodeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleCreatePasscode();
  };

  const handleConfirmPasscode = async () => {
    setPasscodeError("");
    setError("");

    if (passcodeConfirmation.length !== 6) {
      setPasscodeError("Passcode must be 6 digits");
      return;
    }

    if (passcode !== passcodeConfirmation) {
      setPasscodeError("Passcodes do not match");
      return;
    }

    if (googlePasscodeSetupRequired) {
      await submitGooglePasscode(passcode);
      return;
    }

    if (resetPasswordToken) {
      setIsLoading(true);
      try {
        await authController.resetPassword(
          resetPasswordToken,
          passcode,
          passcodeConfirmation,
          setError,
          setMessage,
          () => {
            setResetPasswordToken("");
            const nextStep = email.trim() ? "signin-passcode" : "initial";
            setStep(nextStep);
            setPasscode("");
            setPasscodeConfirmation("");
            updateUrlParams({
              dialog: "auth",
              step: nextStep,
              reset_password_token: null,
              email: email.trim() || null,
              passcode: null,
            });
          },
        );
      } catch (err: any) {
        setError(err.message || "Failed to reset passcode. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setStep("signup-info");
    updateUrlParams({
      step: "signup-info",
      email,
      passcode,
      fullName: null,
      username: null,
    });
  };

  const handleConfirmPasscodeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleConfirmPasscode();
  };

  const handleSignUpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!fullName || fullName.length < 2) {
      setError("Please enter your full name");
      return;
    }

    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }

    setIsLoading(true);
    try {
      await authController.signUpWithEmail(
        username,
        email,
        passcode,
        passcodeConfirmation,
        setError,
        () => {
          setStep("verify-email");
          updateUrlParams({ step: "verify-email", email, passcode });
        },
      );
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    setError("");
    setMessage("");
    await authController.sendConfirmationEmail(
      email,
      setError,
      setMessage,
      () => resendCodeCountdown.start(30),
    );
  };

  const handleVerifyEmail = async () => {
    setOtpError("");
    setError("");
    setMessage("");

    if (otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      await authController.confirmEmailWithCode(
        email,
        otp,
        (err) => setOtpError(err),
        setMessage,
        signin,
      );
    } catch (err: any) {
      setOtpError(
        err.message || "Invalid verification code. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleVerifyEmail();
  };

  const handleForgotPasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    setIsLoading(true);
    try {
      await authController.sendForgotPasswordMail(
        email,
        setError,
        setMessage,
        () => resendCodeCountdown.start(60),
      );
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    switch (step) {
      case "signin-passcode":
        setStep("initial");
        setPasscode("");
        setPasscodeError("");
        setGooglePasscodeSetupRequired(false);
        dispatchGoogleSsoAction({ type: "RESET" });
        updateUrlParams({ step: "initial", email, passcode: null });
        break;
      case "signup-passcode-create":
        if (resetPasswordToken) {
          setStep("forgot-password");
          setPasscode("");
          setPasscodeConfirmation("");
          setPasscodeError("");
          setResetPasswordToken("");
          updateUrlParams({
            step: "forgot-password",
            email,
            passcode: null,
            reset_password_token: null,
          });
          break;
        }
        setStep("initial");
        setPasscode("");
        setPasscodeConfirmation("");
        setPasscodeError("");
        setGooglePasscodeSetupRequired(false);
        dispatchGoogleSsoAction({ type: "RESET" });
        updateUrlParams({ step: "initial", email, passcode: null });
        break;
      case "signup-passcode-confirm":
        setStep("signup-passcode-create");
        setPasscodeConfirmation("");
        setPasscodeError("");
        updateUrlParams({ step: "signup-passcode-create", email, passcode });
        break;
      case "signup-info":
        if (googlePasscodeSetupRequired) {
          setStep("signup-passcode-confirm");
          updateUrlParams({ step: "signup-passcode-confirm", email, passcode });
          break;
        }
        setStep("signup-passcode-confirm");
        setFullName("");
        setUsername("");
        updateUrlParams({ step: "signup-passcode-confirm", email, passcode });
        break;
      case "verify-email":
        setStep("signup-info");
        updateUrlParams({
          step: "signup-info",
          email,
          passcode,
          fullName,
          username,
        });
        break;
      case "forgot-password":
        setStep(
          googlePasscodeSetupRequired
            ? "signup-passcode-create"
            : "signin-passcode",
        );
        updateUrlParams({
          step: googlePasscodeSetupRequired
            ? "signup-passcode-create"
            : "signin-passcode",
          email,
        });
        break;
      default:
        break;
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (googleVerifyRequestInFlightRef.current) return;

      googleVerifyRequestInFlightRef.current = true;
      setIsLoading(true);
      setError("");
      setPasscodeError("");
      setGooglePasscodeSetupRequired(false);
      dispatchGoogleSsoAction({ type: "VERIFY_GOOGLE_START" });

      try {
        const result = await authController.signInWithGoogle(
          tokenResponse.access_token,
        );

        if (
          result.success &&
          result.passcodeRequired &&
          result.challengeToken
        ) {
          if (!result.passcodeAction) {
            setError(
              "Passcode setup action is missing from Google sign in response.",
            );
            dispatchGoogleSsoAction({
              type: "VERIFY_GOOGLE_FAILED",
              errorMessage:
                "Passcode setup action is missing from Google sign in response.",
            });
            return;
          }

          dispatchGoogleSsoAction({
            type: "VERIFY_GOOGLE_PASSCODE_REQUIRED",
            challengeToken: result.challengeToken,
          });
          setGooglePasscodeSetupRequired(true);
          setStep("signup-passcode-create");
          updateUrlParams({
            step: "signup-passcode-create",
            passcode: null,
          });
          return;
        }

        if (result.success && result.token && result.user) {
          signin(result.token, result.user);
          dispatchGoogleSsoAction({
            type: "VERIFY_GOOGLE_SUCCESS_AUTHENTICATED",
          });
          navigate(getPostSignInRoute());
          return;
        }

        if (result.statusCode === 401) {
          setError(t(AppLocales.SignInGoogleFailure));
        } else {
          setError(result.errorMessage || t(AppLocales.SignInGoogleFailure));
        }

        dispatchGoogleSsoAction({
          type: "VERIFY_GOOGLE_FAILED",
          errorMessage:
            result.errorMessage || t(AppLocales.SignInGoogleFailure),
          errorCode: result.statusCode,
        });
      } catch {
        setError(t(AppLocales.SignInGoogleFailure));
        dispatchGoogleSsoAction({
          type: "VERIFY_GOOGLE_FAILED",
          errorMessage: t(AppLocales.SignInGoogleFailure),
        });
      } finally {
        googleVerifyRequestInFlightRef.current = false;
        setIsLoading(false);
      }
    },
    onError: () => {
      setIsBlocked(true);
      setError(t(AppLocales.SignInGoogleFailure));
      dispatchGoogleSsoAction({
        type: "VERIFY_GOOGLE_FAILED",
        errorMessage: t(AppLocales.SignInGoogleFailure),
        errorCode: 401,
      });
    },
  });

  useEffect(() => {
    const sessionMessage = searchParams.get("session_message");
    if (!sessionMessage) return;

    setError(sessionMessage);
    setStep("initial");

    const params = new URLSearchParams(searchParams);
    params.delete("session_message");
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("session_message")]);

  useEffect(() => {
    const hasSensitiveParams = SENSITIVE_AUTH_QUERY_KEYS.some((key) =>
      searchParams.has(key),
    );

    if (!hasSensitiveParams) return;

    const params = new URLSearchParams(searchParams);
    SENSITIVE_AUTH_QUERY_KEYS.forEach((key) => params.delete(key));
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("reset_password_token") || "";
    setResetPasswordToken(tokenFromUrl);
    if (tokenFromUrl) {
      setStep("signup-passcode-create");
      setPasscode("");
      setPasscodeConfirmation("");
      setPasscodeError("");
      setError("");
      updateUrlParams({
        dialog: "auth",
        step: "signup-passcode-create",
        reset_password_token: tokenFromUrl,
        passcode: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("reset_password_token")]);

  useEffect(() => {
    remainingAttemptsRef.current = serverRemainingAttempts;
  }, [serverRemainingAttempts]);

  useEffect(() => {
    hasFailureHistoryRef.current = hasFailureHistory;
  }, [hasFailureHistory]);

  useEffect(() => {
    fallbackCooldownLevelRef.current = fallbackCooldownLevel;
  }, [fallbackCooldownLevel]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      startClosingDialog();
      applyServerRetryMeta(
        { remainingAttempts: 3, cooldownSeconds: 0 },
        { mode: "success" },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isOpen]);

  useEffect(() => {
    syncRetryStateFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    const handleWindowFocus = () => {
      syncRetryStateFromStorage();
    };

    window.addEventListener("focus", handleWindowFocus);
    return () => window.removeEventListener("focus", handleWindowFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (wasCooldownActiveRef.current && !signInCooldown.isActive) {
      setServerRemainingAttempts(FALLBACK_ATTEMPTS_PER_WINDOW);
      setHasFailureHistory(true);
      setPasscode("");
      setPasscodeError("");
      setError("");
      persistPasscodeRetryState(email, {
        remainingAttempts: FALLBACK_ATTEMPTS_PER_WINDOW,
        cooldownUntilMs: 0,
        hasFailureHistory: true,
        cooldownLevel: fallbackCooldownLevelRef.current,
      });
    }

    wasCooldownActiveRef.current = signInCooldown.isActive;

    if (signInCooldown.isActive || !signInCooldown.targetTimeMs) return;

    persistPasscodeRetryState(email, {
      remainingAttempts: serverRemainingAttempts,
      cooldownUntilMs: 0,
      hasFailureHistory,
      cooldownLevel: fallbackCooldownLevel,
    });
  }, [
    signInCooldown.isActive,
    signInCooldown.targetTimeMs,
    email,
    serverRemainingAttempts,
    hasFailureHistory,
    fallbackCooldownLevel,
  ]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const isGooglePasscodeFlow =
      googleSsoState.status === "passcode_required" ||
      googleSsoState.status === "submitting_passcode";

    if (step !== "signin-passcode") {
      autoSubmittedSignInPasscodeRef.current = "";
      return;
    }

    if (passcode.length !== 6) {
      autoSubmittedSignInPasscodeRef.current = "";
      return;
    }

    if (
      isLoading ||
      signInRequestInFlightRef.current ||
      googlePasscodeRequestInFlightRef.current ||
      (isGooglePasscodeFlow ? isGoogleRetryActive : isCooldownActive) ||
      autoSubmittedSignInPasscodeRef.current === passcode
    ) {
      return;
    }

    autoSubmittedSignInPasscodeRef.current = passcode;
    void handleSignInPasscode();
  }, [
    step,
    passcode,
    isLoading,
    isCooldownActive,
    isGoogleRetryActive,
    googleSsoState.status,
  ]);

  useEffect(() => {
    if (step !== "signup-passcode-create") {
      autoSubmittedCreatePasscodeRef.current = "";
      return;
    }

    if (passcode.length !== 6) {
      autoSubmittedCreatePasscodeRef.current = "";
      return;
    }

    if (
      isLoading ||
      autoSubmittedCreatePasscodeRef.current === passcode
    ) {
      return;
    }

    autoSubmittedCreatePasscodeRef.current = passcode;
    void handleCreatePasscode();
  }, [step, passcode, isLoading]);

  useEffect(() => {
    if (step !== "signup-passcode-confirm") {
      autoSubmittedConfirmPasscodeRef.current = "";
      return;
    }

    if (passcodeConfirmation.length !== 6) {
      autoSubmittedConfirmPasscodeRef.current = "";
      return;
    }

    const confirmKey = `${passcode}|${passcodeConfirmation}|${resetPasswordToken}|${googlePasscodeSetupRequired}`;

    if (
      isLoading ||
      autoSubmittedConfirmPasscodeRef.current === confirmKey
    ) {
      return;
    }

    autoSubmittedConfirmPasscodeRef.current = confirmKey;
    void handleConfirmPasscode();
  }, [
    step,
    passcode,
    passcodeConfirmation,
    resetPasswordToken,
    googlePasscodeSetupRequired,
    isLoading,
  ]);

  useEffect(() => {
    if (step !== "verify-email") {
      autoSubmittedVerifyEmailOtpRef.current = "";
      return;
    }

    if (otp.length !== 6) {
      autoSubmittedVerifyEmailOtpRef.current = "";
      return;
    }

    if (isLoading || autoSubmittedVerifyEmailOtpRef.current === otp) {
      return;
    }

    autoSubmittedVerifyEmailOtpRef.current = otp;
    void handleVerifyEmail();
  }, [step, otp, isLoading]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const isDialogVisible = isOpen || isClosing;
  const showBackButton = step !== "initial";
  const isGooglePasscodeFlow =
    googleSsoState.status === "passcode_required" ||
    googleSsoState.status === "submitting_passcode";
  const isGooglePasscodeSetupFlow =
    isGooglePasscodeFlow && googlePasscodeSetupRequired;
  const shouldShowAttempts =
    !isGooglePasscodeFlow &&
    !isCooldownActive &&
    hasFailureHistory &&
    serverRemainingAttempts < FALLBACK_ATTEMPTS_PER_WINDOW;

  const attemptsLabel = `Attempts remaining before cooldown: ${serverRemainingAttempts}/${FALLBACK_ATTEMPTS_PER_WINDOW}`;
  const cooldownHelperText = isGooglePasscodeFlow
    ? isGoogleRetryActive
      ? `Too many attempts. Please wait ${googleRetryCountdown.secondsLeft} seconds.`
      : isGooglePasscodeSetupFlow
        ? "Create and confirm your 6-digit passcode"
        : "Enter your 6-digit passcode to continue Google sign in"
    : isCooldownActive
      ? `Too many incorrect passcode attempts. Please wait ${cooldownSecondsLeft} seconds.`
      : "Enter your 6-digit passcode";

  if (!isDialogVisible) return null;

  return (
    <Dialog
      isOpen={isOpen && !isClosing}
      onClose={startClosingDialog}
      onBack={showBackButton ? handleBack : undefined}
    >
      <div className="space-y-20">
        <div className="text-center space-y-8">
          <h2 className="text-h3 sm:text-h2 font-bold tracking-[0.03em] text-gold-600 font-display">
            Welcome to Meritbox
          </h2>
          <p className="text-body-s font-primary text-base-content opacity-75">
            Support dreams or make yours come true where every merit counts.
          </p>
        </div>

        {step === "initial" && (
          <InitialDialog
            isLoading={isLoading}
            isBlocked={isBlocked}
            email={email}
            emailError={emailError}
            error={error}
            onEmailChange={(value: string) => {
              setEmail(value);
              updateUrlParams({ step: "initial", email: value });
            }}
            onSubmit={handleEmailSubmit}
            onGoogleSignIn={() => handleGoogleSignIn()}
            onGoogleRetry={() => window.location.reload()}
          />
        )}

        {step === "signin-passcode" && (
          <SigninPasscodeDialog
            email={email}
            mode={isGooglePasscodeFlow ? "google" : "email"}
            passcode={passcode}
            passcodeError={passcodeError}
            helperText={cooldownHelperText}
            isLoading={isLoading}
            isCooldownActive={
              isGooglePasscodeFlow ? isGoogleRetryActive : isCooldownActive
            }
            cooldownSecondsLeft={
              isGooglePasscodeFlow
                ? googleRetryCountdown.secondsLeft
                : cooldownSecondsLeft
            }
            shouldShowAttempts={shouldShowAttempts}
            attemptsLabel={attemptsLabel}
            error={error}
            isSubmitDisabled={
              isLoading ||
              (isGooglePasscodeFlow ? isGoogleRetryActive : isCooldownActive) ||
              passcode.length !== 6 ||
              signInRequestInFlightRef.current ||
              googlePasscodeRequestInFlightRef.current
            }
            onPasscodeChange={(value) => {
              if (isGooglePasscodeFlow ? isGoogleRetryActive : isCooldownActive)
                return;
              setPasscode(value);
              updateUrlParams({
                step: "signin-passcode",
                email,
                passcode: value,
              });
            }}
            onSubmit={handleSignInPasscodeSubmit}
            onUseDifferentEmail={() => {
              setStep("initial");
              setPasscode("");
              setPasscodeError("");
              setGooglePasscodeSetupRequired(false);
              dispatchGoogleSsoAction({ type: "RESET" });
              updateUrlParams({ step: "initial", email: null });
            }}
            onForgotPassword={() => {
              setStep("forgot-password");
              updateUrlParams({ step: "forgot-password", email });
            }}
          />
        )}

        {step === "signup-passcode-create" && (
          <SignupPasscodeCreateDialog
            email={email}
            passcode={passcode}
            passcodeError={passcodeError}
            isLoading={isLoading}
            error={error}
            onPasscodeChange={(value) => {
              setPasscode(value);
              updateUrlParams({
                step: "signup-passcode-create",
                email,
                passcode: value,
              });
            }}
            onSubmit={handleCreatePasscodeSubmit}
            onUseDifferentEmail={() => {
              setStep("initial");
              setPasscode("");
              setPasscodeConfirmation("");
              setGooglePasscodeSetupRequired(false);
              dispatchGoogleSsoAction({ type: "RESET" });
              updateUrlParams({ step: "initial", email: null });
            }}
            onForgotPasscode={() => {
              setStep("forgot-password");
              updateUrlParams({ step: "forgot-password", email });
            }}
          />
        )}

        {step === "signup-passcode-confirm" && (
          <SignupPasscodeConfirmDialog
            email={email}
            passcodeConfirmation={passcodeConfirmation}
            passcodeError={passcodeError}
            isLoading={isLoading}
            error={error}
            onPasscodeConfirmationChange={(value) => {
              setPasscodeConfirmation(value);
              updateUrlParams({
                step: "signup-passcode-confirm",
                email,
                passcode,
              });
            }}
            onSubmit={handleConfirmPasscodeSubmit}
            onUseDifferentEmail={() => {
              setStep("initial");
              setPasscode("");
              setPasscodeConfirmation("");
              setGooglePasscodeSetupRequired(false);
              dispatchGoogleSsoAction({ type: "RESET" });
              updateUrlParams({ step: "initial", email: null });
            }}
            onForgotPasscode={() => {
              setStep("forgot-password");
              updateUrlParams({ step: "forgot-password", email });
            }}
          />
        )}

        {step === "signup-info" && (
          <SignupInfoDialog
            fullName={fullName}
            username={username}
            isLoading={isLoading}
            error={error}
            onFullNameChange={(value) => {
              setFullName(value);
              updateUrlParams({
                step: "signup-info",
                email,
                passcode,
                fullName: value,
                username,
              });
            }}
            onUsernameChange={(value) => {
              const normalized = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
              setUsername(normalized);
              updateUrlParams({
                step: "signup-info",
                email,
                passcode,
                fullName,
                username: normalized,
              });
            }}
            onSubmit={handleSignUpSubmit}
          />
        )}

        {step === "verify-email" && (
          <VerifyEmailDialog
            email={email}
            otp={otp}
            otpError={otpError}
            message={message}
            error={error}
            isLoading={isLoading}
            resendCountdownActive={resendCodeCountdown.isActive}
            resendCountdownSecondsLeft={resendCodeCountdown.secondsLeft}
            onOtpChange={(value) => {
              setOtp(value);
              updateUrlParams({ step: "verify-email", email, otp: value });
            }}
            onSubmit={handleVerifyEmailSubmit}
            onResendCode={handleSendCode}
            onUseDifferentEmail={() => {
              setStep("initial");
              setEmail("");
              setPasscode("");
              setFullName("");
              setUsername("");
              setOtp("");
              updateUrlParams({ step: "initial", email: null });
            }}
          />
        )}

        {step === "forgot-password" && (
          <ForgotPasswordDialog
            email={email}
            message={message}
            error={error}
            isLoading={isLoading}
            resendCountdownActive={resendCodeCountdown.isActive}
            resendCountdownSecondsLeft={resendCodeCountdown.secondsLeft}
            onEmailChange={(value: string) => {
              setEmail(value);
              updateUrlParams({ step: "forgot-password", email: value });
            }}
            onSubmit={handleForgotPasswordSubmit}
            onBackToSignin={() => {
              setStep(
                googlePasscodeSetupRequired
                  ? "signup-passcode-create"
                  : "signin-passcode",
              );
              updateUrlParams({
                step: googlePasscodeSetupRequired
                  ? "signup-passcode-create"
                  : "signin-passcode",
                email,
              });
            }}
          />
        )}
      </div>
    </Dialog>
  );
};

export default AuthDialog;
