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
  ForgotPasswordDialog,
} from ".";
import { AuthStep } from "./type";

// Map steps to their previous step
const stepHistory: Record<AuthStep, AuthStep | null> = {
  initial: null,
  "signin-passcode": "initial",
  "signup-passcode-create": "initial",
  "signup-passcode-confirm": "signup-passcode-create",
  "signup-info": "signup-passcode-create",
  "confirm-email": "signup-info",
  "forgot-password": "signin-passcode",
};

export const AuthDialog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get("dialog") === "auth";

  const step = (searchParams.get("step") as AuthStep) || "initial";
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
    // Clear sensitive data on close
    setPasscode("");
    setConfirmPasscode("");
  };

  const navigateToStep = (
    newStep: AuthStep,
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

  // Pass setter functions to child components
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
      case "initial":
        return (
          <InitialDialog
            email={email}
            navigateToStep={navigateToStep}
            updateUrl={updateUrl}
            onClose={handleClose}
          />
        );
      case "signin-passcode":
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
      case "signup-passcode-create":
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
      case "signup-passcode-confirm":
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
      case "signup-info":
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
      case "confirm-email":
        return (
          <ConfirmEmailDialog
            email={email}
            navigateToStep={navigateToStep}
            updateUrl={updateUrl}
            onClose={handleClose}
            onBack={handleBack}
          />
        );
      case "forgot-password":
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
