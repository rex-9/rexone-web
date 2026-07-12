import React from "react";
import { Button, PasscodeInput, TextLink } from "..";

export interface ISignupPasscodeConfirmDialog {
  email: string;
  passcodeConfirmation: string;
  passcodeError: string;
  isLoading: boolean;
  error: string;
  onPasscodeConfirmationChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onUseDifferentEmail: () => void;
  onForgotPasscode: () => void;
}

export const SignupPasscodeConfirmDialog: React.FC<
  ISignupPasscodeConfirmDialog
> = ({
  email,
  passcodeConfirmation,
  passcodeError,
  isLoading,
  error,
  onPasscodeConfirmationChange,
  onSubmit,
  onUseDifferentEmail,
  onForgotPasscode,
}) => {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <p className="text-body-m text-base-content">
          {email ? (
            <>
              Confirm your passcode for{" "}
              <span className="font-semibold">{email}</span>
            </>
          ) : (
            "Confirm your passcode"
          )}
        </p>
        <p className="text-body-s text-base-content opacity-70 mt-4">
          Enter the same 6 digits again
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-16">
        <PasscodeInput
          idPrefix="confirm-passcode"
          value={passcodeConfirmation}
          onChange={onPasscodeConfirmationChange}
          label="Confirm Passcode"
          helperText="Enter the same 6 digits again"
          error={passcodeError}
          disabled={isLoading}
        />

        <Button
          variant="primary"
          type="submit"
          fullWidth
          disabled={isLoading || passcodeConfirmation.length !== 6}
        >
          {isLoading ? "Checking passcode..." : "Continue"}
        </Button>
      </form>

      <div className="text-center">
        <TextLink
          label="Use a different email"
          onClick={onUseDifferentEmail}
          className="text-body-s"
        />
        <div className="mt-4">
          <TextLink
            label="Forgot your passcode?"
            onClick={onForgotPasscode}
            className="text-body-s"
          />
        </div>
      </div>

      {error && <p className="text-caption text-error text-center">{error}</p>}
    </div>
  );
};
