import React from "react";
import { AlertMessage } from "../AlertMessage";
import { Button } from "../Button";
import { PasscodeBoxesInput } from "../PasscodeBoxesInput";
import { TextLink } from "../TextLink";

export interface ISigninPasscodeDialog {
  email: string;
  mode?: "email" | "google";
  passcode: string;
  passcodeError: string;
  helperText: string;
  isLoading: boolean;
  isCooldownActive: boolean;
  cooldownSecondsLeft: number;
  shouldShowAttempts: boolean;
  attemptsLabel: string;
  error: string;
  isSubmitDisabled: boolean;
  onPasscodeChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onUseDifferentEmail: () => void;
  onForgotPassword: () => void;
}

const SigninPasscodeDialog: React.FC<ISigninPasscodeDialog> = ({
  email,
  mode = "email",
  passcode,
  passcodeError,
  helperText,
  isLoading,
  isCooldownActive,
  cooldownSecondsLeft,
  shouldShowAttempts,
  attemptsLabel,
  error,
  isSubmitDisabled,
  onPasscodeChange,
  onSubmit,
  onUseDifferentEmail,
  onForgotPassword,
}) => {
  const isGoogleMode = mode === "google";

  return (
    <div className="space-y-16">
      <div className="text-center">
        <p className="text-body-m text-base-content">
          {isGoogleMode ? (
            "Enter your passcode to continue with Google"
          ) : (
            <>
              Sign in to <span className="font-semibold">{email}</span>
            </>
          )}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-16">
        <PasscodeBoxesInput
          idPrefix="signin-passcode"
          value={passcode}
          onChange={onPasscodeChange}
          label="6-Digit Passcode"
          error={passcodeError}
          helperText={helperText}
          disabled={isLoading || isCooldownActive}
        />

        {shouldShowAttempts && (
          <p className="text-caption text-base-content opacity-70 text-center">{attemptsLabel}</p>
        )}

        {isCooldownActive && (
          <AlertMessage
            type="warning"
            message={
              isGoogleMode
                ? `Too many attempts. Please wait ${cooldownSecondsLeft} seconds.`
                : `Too many incorrect passcode attempts. Please wait ${cooldownSecondsLeft} seconds.`
            }
          />
        )}

        <Button variant="primary" type="submit" fullWidth disabled={isSubmitDisabled}>
          {isCooldownActive
            ? `Try again in ${cooldownSecondsLeft}s`
            : isLoading
              ? isGoogleMode
                ? "Verifying..."
                : "Signing in..."
              : "Sign In"}
        </Button>
      </form>

      <div className="text-center">
        <TextLink
          label={isGoogleMode ? "Back to sign in options" : "Use a different email"}
          onClick={onUseDifferentEmail}
          className="text-body-s"
        />
        <div className="mt-4">
          <TextLink
            label="Forgot your passcode?"
            onClick={onForgotPassword}
            className="text-body-s"
          />
        </div>
      </div>

      {error && <p className="text-caption text-error text-center">{error}</p>}
    </div>
  );
};

export default SigninPasscodeDialog;
