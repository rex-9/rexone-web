import React from "react";
import { Button, PasscodeInput, TextLink } from "..";

export interface ISignupPasscodeCreateDialog {
  email: string;
  passcode: string;
  passcodeError: string;
  isLoading: boolean;
  error: string;
  onPasscodeChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onUseDifferentEmail: () => void;
  onForgotPasscode: () => void;
}

export const SignupPasscodeCreateDialog: React.FC<
  ISignupPasscodeCreateDialog
> = ({
  email,
  passcode,
  passcodeError,
  isLoading,
  error,
  onPasscodeChange,
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
              Create a passcode for{" "}
              <span className="font-semibold">{email}</span>
            </>
          ) : (
            "Create your passcode"
          )}
        </p>
        <p className="text-body-s text-base-content opacity-70 mt-4">
          You will use this 6-digit passcode to sign in
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-16">
        <PasscodeInput
          idPrefix="create-passcode"
          value={passcode}
          onChange={onPasscodeChange}
          label="Create Passcode"
          helperText="Choose a 6-digit number you will remember"
          error={passcodeError}
          disabled={isLoading}
        />

        <Button
          variant="primary"
          type="submit"
          fullWidth
          disabled={isLoading || passcode.length !== 6}
        >
          Continue
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
