// src/design/components/auth/SignupPasscodeCreateDialog.tsx

import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Dialog, PasscodeInput, TextLink } from "..";
import { AuthStep, TAuthStep } from "./type";

interface SignupPasscodeCreateDialogProps {
  email: string;
  passcode: string;
  setPasscode: (value: string) => void;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
  onClose: () => void;
  onBack: () => void;
}

export const SignupPasscodeCreateDialog: React.FC<
  SignupPasscodeCreateDialogProps
> = ({ email, passcode, setPasscode, navigateToStep, onClose, onBack }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  // Check if this is a password reset flow
  const resetPasswordToken = searchParams.get("reset_password_token");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.length !== 6) {
      setError("Passcode must be 6 digits");
      return;
    }

    const extra: Record<string, string> = { email, passcode };

    // Pass reset token to confirm step if present
    if (resetPasswordToken) {
      extra.reset_password_token = resetPasswordToken;
    }

    navigateToStep(AuthStep.SIGNUP_PASSCODE_CONFIRM, extra);
  };

  const triggerSubmit = () => {
    if (formRef.current) {
      const event = new Event("submit", { bubbles: true, cancelable: true });
      formRef.current.dispatchEvent(event);
    }
  };

  // Show different subtitle for reset password flow
  const isResetFlow = !!resetPasswordToken;
  const subtitle = isResetFlow
    ? "Create a new passcode for your account."
    : "Choose a 6-digit passcode you'll remember.";

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title={isResetFlow ? "Reset Passcode" : "Create Passcode"}
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-8">
        {subtitle}
      </p>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-16">
        <div className="text-center">
          <p className="text-body-m text-base-content">
            {isResetFlow
              ? "Create a new passcode"
              : `Create a passcode for ${email}`}
          </p>
          <p className="text-body-s text-base-content opacity-70 mt-4">
            You will use this 6-digit passcode to sign in
          </p>
        </div>
        <PasscodeInput
          idPrefix="create-passcode"
          value={passcode}
          onChange={(value) => {
            setPasscode(value);
            setError("");
          }}
          onComplete={triggerSubmit}
          label="Create Passcode"
          helperText="Choose a 6-digit number you will remember"
          error={error}
          disabled={false}
        />
        <Button
          variant="primary"
          type="submit"
          fullWidth
          disabled={passcode.length !== 6}
        >
          Continue
        </Button>
        <div className="text-center">
          <TextLink
            label="Use a different email"
            onClick={() => navigateToStep(AuthStep.INITIAL)}
            className="text-body-s"
          />
          <div className="mt-4">
            <TextLink
              label="Forgot your passcode?"
              onClick={() =>
                navigateToStep(AuthStep.FORGOT_PASSCODE, { email })
              }
              className="text-body-s"
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};
