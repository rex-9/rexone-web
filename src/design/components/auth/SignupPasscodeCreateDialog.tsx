// src/design/components/auth/SignupPasscodeCreateDialog.tsx

import React, { useState, useRef } from "react";
import { Button, Dialog, PasscodeInput, TextLink } from "..";
import { AuthStep } from "./type";

interface SignupPasscodeCreateDialogProps {
  email: string;
  passcode: string;
  setPasscode: (value: string) => void;
  navigateToStep: (step: AuthStep, extra?: Record<string, string>) => void;
  onClose: () => void;
  onBack: () => void;
}

export const SignupPasscodeCreateDialog: React.FC<
  SignupPasscodeCreateDialogProps
> = ({ email, passcode, setPasscode, navigateToStep, onClose, onBack }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.length !== 6) {
      setError("Passcode must be 6 digits");
      return;
    }

    const extra: Record<string, string> = { email, passcode };
    navigateToStep("signup-passcode-confirm", extra);
  };

  const triggerSubmit = () => {
    if (formRef.current) {
      const event = new Event("submit", { bubbles: true, cancelable: true });
      formRef.current.dispatchEvent(event);
    }
  };

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title="Create Passcode"
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-8">
        Choose a 6-digit passcode you'll remember.
      </p>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-16">
        <div className="text-center">
          <p className="text-body-m text-base-content">
            Create a passcode for <span className="font-semibold">{email}</span>
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
            onClick={() => navigateToStep("initial")}
            className="text-body-s"
          />
          <div className="mt-4">
            <TextLink
              label="Forgot your passcode?"
              onClick={() => navigateToStep("forgot-passcode", { email })}
              className="text-body-s"
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};
