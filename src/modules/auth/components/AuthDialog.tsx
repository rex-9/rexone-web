// src/design/components/auth/AuthDialog.tsx

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  InitialDialog,
  SigninPasswordDialog,
  SignupPasswordCreateDialog,
  SignupPasswordConfirmDialog,
  SignupInfoDialog,
  ConfirmEmailDialog,
  ForgotPasswordDialog,
} from ".";
import { DialogParams, DialogAuthSteps, TAuthStep } from "..";
import { useAuth } from "../../../contexts";

const SENSITIVE_AUTH_QUERY_KEYS = [
  "password",
  "confirmPassword",
  "password_confirmation",
] as const;

const AUTH_QUERY_KEYS = [
  DialogParams.DIALOG,
  DialogParams.STEP,
  "email",
  "otp",
  "fullName",
  "username",
  "challenge_token",
  "reset_password_token",
  "message",
  "error",
  ...SENSITIVE_AUTH_QUERY_KEYS,
] as const;

const SENSITIVE_AUTH_QUERY_KEY_SET = new Set<string>(
  SENSITIVE_AUTH_QUERY_KEYS,
);

// Map steps to their previous step
const stepHistory: Record<string, TAuthStep | null> = {
  [DialogAuthSteps.INITIAL]: null,
  [DialogAuthSteps.SIGNIN_PASSWORD]: DialogAuthSteps.INITIAL,
  [DialogAuthSteps.SIGNUP_PASSWORD_CREATE]: DialogAuthSteps.INITIAL,
  [DialogAuthSteps.SIGNUP_PASSWORD_CONFIRM]:
    DialogAuthSteps.SIGNUP_PASSWORD_CREATE,
  [DialogAuthSteps.SIGNUP_INFO]: DialogAuthSteps.SIGNUP_PASSWORD_CREATE,
  [DialogAuthSteps.CONFIRM_EMAIL]: DialogAuthSteps.SIGNUP_INFO,
  [DialogAuthSteps.FORGOT_PASSWORD]: DialogAuthSteps.SIGNIN_PASSWORD,
};

export const AuthDialog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const isOpen = searchParams.get(DialogParams.DIALOG) === DialogParams.AUTH;

  const rawStep = searchParams.get(DialogParams.STEP) || DialogAuthSteps.INITIAL;
  const email = searchParams.get("email") || "";
  const fullName = searchParams.get("fullName") || "";
  const username = searchParams.get("username") || "";

  // Store passwords in memory, NOT in URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signInCooldown, setSignInCooldown] = useState<{
    email: string;
    targetTimeMs: number;
  } | null>(null);

  useEffect(() => {
    const hasSensitiveParams = SENSITIVE_AUTH_QUERY_KEYS.some((key) =>
      searchParams.has(key),
    );

    if (!isAuthenticated && !hasSensitiveParams) return;

    const params = new URLSearchParams(searchParams);
    const keysToDelete = isAuthenticated
      ? AUTH_QUERY_KEYS
      : SENSITIVE_AUTH_QUERY_KEYS;

    keysToDelete.forEach((key) => params.delete(key));

    setPassword("");
    setConfirmPassword("");
    setSearchParams(params, { replace: true });
  }, [isAuthenticated, searchParams, setSearchParams]);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    AUTH_QUERY_KEYS.forEach((key) => params.delete(key));
    setSearchParams(params, { replace: true });
    setPassword("");
    setConfirmPassword("");
  };

  const navigateToStep = (
    newStep: TAuthStep,
    extra?: Record<string, string>,
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set("step", newStep);
    if (extra) {
      Object.entries(extra).forEach(([key, value]) => {
        if (key === "password") {
          setPassword(value);
          return;
        }
        if (key === "confirmPassword") {
          setConfirmPassword(value);
          return;
        }

        // Never store passwords in URL
        if (!SENSITIVE_AUTH_QUERY_KEY_SET.has(key)) {
          params.set(key, value);
        }
      });
    }
    setSearchParams(params, { replace: true });
  };

  const updatePassword = (value: string) => setPassword(value);
  const updateConfirmPassword = (value: string) => setConfirmPassword(value);

  const handleBack = () => {
    const prevStep = stepHistory[rawStep];
    if (prevStep) {
      setPassword("");
      setConfirmPassword("");
      const params = new URLSearchParams(searchParams);
      params.set("step", prevStep);
      if (email) params.set("email", email);
      if (fullName) params.set("fullName", fullName);
      if (username) params.set("username", username);
      setSearchParams(params, { replace: true });
    }
  };

  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      // Never store passwords in URL
      if (!SENSITIVE_AUTH_QUERY_KEY_SET.has(key)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
    });
    setSearchParams(params, { replace: true });
  };

  if (!isOpen || isAuthenticated) return null;

  const renderStep = () => {
    switch (rawStep) {
      case DialogAuthSteps.INITIAL:
        return (
          <InitialDialog
            email={email}
            navigateToStep={navigateToStep}
            updateUrl={updateUrl}
            onClose={handleClose}
          />
        );
      case DialogAuthSteps.SIGNIN_PASSWORD:
        return (
          <SigninPasswordDialog
            email={email}
            password={password}
            setPassword={updatePassword}
            navigateToStep={navigateToStep}
            onClose={handleClose}
            onBack={handleBack}
            cooldownTargetTimeMs={
              signInCooldown?.email === email
                ? signInCooldown.targetTimeMs
                : 0
            }
            onCooldownStart={(targetTimeMs: number) =>
              setSignInCooldown({ email, targetTimeMs })
            }
            onCooldownClear={() => setSignInCooldown(null)}
          />
        );
      case DialogAuthSteps.SIGNUP_PASSWORD_CREATE:
        return (
          <SignupPasswordCreateDialog
            email={email}
            password={password}
            setPassword={updatePassword}
            navigateToStep={navigateToStep}
            onClose={handleClose}
            onBack={handleBack}
          />
        );
      case DialogAuthSteps.SIGNUP_PASSWORD_CONFIRM:
        return (
          <SignupPasswordConfirmDialog
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            setConfirmPassword={updateConfirmPassword}
            navigateToStep={navigateToStep}
            onClose={handleClose}
            onBack={handleBack}
          />
        );
      case DialogAuthSteps.SIGNUP_INFO:
        return (
          <SignupInfoDialog
            email={email}
            password={password}
            fullNameParam={fullName}
            userNameParam={username}
            navigateToStep={navigateToStep}
            updateUrl={updateUrl}
            onClose={handleClose}
            onBack={handleBack}
          />
        );
      case DialogAuthSteps.CONFIRM_EMAIL:
        return (
          <ConfirmEmailDialog
            email={email}
            navigateToStep={navigateToStep}
            updateUrl={updateUrl}
            onClose={handleClose}
            onBack={handleBack}
          />
        );
      case DialogAuthSteps.FORGOT_PASSWORD:
        return (
          <ForgotPasswordDialog
            email={email}
            navigateToStep={navigateToStep}
            updateUrl={updateUrl}
            onClose={handleClose}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
};
