// src/design/components/auth/AuthDialog.tsx

import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  InitialDialog,
  SigninPasscodeDialog,
  SignupPasscodeCreateDialog,
  SignupPasscodeConfirmDialog,
  SignupInfoDialog,
  ConfirmEmailDialog,
  ForgotPasscodeDialog,
} from ".";
import { AuthStep, TAuthStep } from "..";

// Map steps to their previous step
const stepHistory: Record<TAuthStep, TAuthStep | null> = {
  [AuthStep.INITIAL]: null,
  [AuthStep.SIGNIN_PASSCODE]: AuthStep.INITIAL,
  [AuthStep.SIGNUP_PASSCODE_CREATE]: AuthStep.INITIAL,
  [AuthStep.SIGNUP_PASSCODE_CONFIRM]: AuthStep.SIGNUP_PASSCODE_CREATE,
  [AuthStep.SIGNUP_INFO]: AuthStep.SIGNUP_PASSCODE_CREATE,
  [AuthStep.CONFIRM_EMAIL]: AuthStep.SIGNUP_INFO,
  [AuthStep.FORGOT_PASSCODE]: AuthStep.SIGNIN_PASSCODE,
};

export const AuthDialog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get("dialog") === "auth";

  const step = (searchParams.get("step") as TAuthStep) || AuthStep.INITIAL;
  const email = searchParams.get("email") || "";
  const fullName = searchParams.get("fullName") || "";
  const username = searchParams.get("username") || "";

  // Store passcodes in memory, NOT in URL
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    [
      "dialog",
      "step",
      "email",
      "otp",
      "fullName",
      "username",
      "challenge_token",
    ].forEach((key) => params.delete(key));
    setSearchParams(params, { replace: true });
    setPasscode("");
    setConfirmPasscode("");
  };

  const navigateToStep = (
    newStep: TAuthStep,
    extra?: Record<string, string>,
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set("step", newStep);
    if (extra) {
      Object.entries(extra).forEach(([key, value]) => {
        // Never store passcodes in URL
        if (key !== "passcode" && key !== "confirmPasscode") {
          params.set(key, value);
        }
      });
    }
    setSearchParams(params, { replace: true });
  };

  const updatePasscode = (value: string) => setPasscode(value);
  const updateConfirmPasscode = (value: string) => setConfirmPasscode(value);

  const handleBack = () => {
    const prevStep = stepHistory[step];
    if (prevStep) {
      setPasscode("");
      setConfirmPasscode("");
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
      // Never store passcodes in URL
      if (key !== "passcode" && key !== "confirmPasscode") {
        if (value) params.set(key, value);
        else params.delete(key);
      }
    });
    setSearchParams(params, { replace: true });
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case AuthStep.INITIAL:
        return (
          <InitialDialog
            email={email}
            navigateToStep={navigateToStep}
            updateUrl={updateUrl}
            onClose={handleClose}
          />
        );
      case AuthStep.SIGNIN_PASSCODE:
        return (
          <SigninPasscodeDialog
            email={email}
            passcode={passcode}
            setPasscode={updatePasscode}
            navigateToStep={navigateToStep}
            onClose={handleClose}
            onBack={handleBack}
          />
        );
      case AuthStep.SIGNUP_PASSCODE_CREATE:
        return (
          <SignupPasscodeCreateDialog
            email={email}
            passcode={passcode}
            setPasscode={updatePasscode}
            navigateToStep={navigateToStep}
            onClose={handleClose}
            onBack={handleBack}
          />
        );
      case AuthStep.SIGNUP_PASSCODE_CONFIRM:
        return (
          <SignupPasscodeConfirmDialog
            email={email}
            passcode={passcode}
            confirmPasscode={confirmPasscode}
            setConfirmPasscode={updateConfirmPasscode}
            navigateToStep={navigateToStep}
            onClose={handleClose}
            onBack={handleBack}
          />
        );
      case AuthStep.SIGNUP_INFO:
        return (
          <SignupInfoDialog
            email={email}
            passcode={passcode}
            fullNameParam={fullName}
            userNameParam={username}
            navigateToStep={navigateToStep}
            updateUrl={updateUrl}
            onClose={handleClose}
            onBack={handleBack}
          />
        );
      case AuthStep.CONFIRM_EMAIL:
        return (
          <ConfirmEmailDialog
            email={email}
            navigateToStep={navigateToStep}
            updateUrl={updateUrl}
            onClose={handleClose}
            onBack={handleBack}
          />
        );
      case AuthStep.FORGOT_PASSCODE:
        return (
          <ForgotPasscodeDialog
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
