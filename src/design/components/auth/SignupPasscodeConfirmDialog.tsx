// src/design/components/auth/SignupPasscodeConfirmDialog.tsx

import React, { useState, useRef } from "react";
import { Button, Dialog, PasscodeInput, TextLink } from "..";
import { AuthStep } from "./type";
import { authController } from "../../../controllers";
import { useAuth, useToast } from "../../../contexts";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";

interface SignupPasscodeConfirmDialogProps {
  email: string;
  passcode: string;
  confirmPasscode: string;
  setConfirmPasscode: (value: string) => void;
  navigateToStep: (step: AuthStep, extra?: Record<string, string>) => void;
  onClose: () => void;
  onBack: () => void;
}

export const SignupPasscodeConfirmDialog: React.FC<
  SignupPasscodeConfirmDialogProps
> = ({
  email,
  passcode,
  confirmPasscode,
  setConfirmPasscode,
  navigateToStep,
  onClose,
  onBack,
}) => {
  const { signin, googleChallengeToken, setGoogleChallengeToken } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmPasscode.length !== 6) {
      setError("Passcode must be 6 digits");
      return;
    }
    if (confirmPasscode !== passcode) {
      setError("Passcodes do not match");
      setConfirmPasscode("");
      return;
    }

    // If this is a Google sign-up with challenge token
    if (googleChallengeToken) {
      setIsLoading(true);
      try {
        const result = await authController.completeGoogleSignIn(
          passcode,
          googleChallengeToken,
        );
        if (result.success && result.token && result.user) {
          signin(result.token, result.user);
          toast.showToast("success", "Google sign in complete");
          setGoogleChallengeToken(null);
          onClose();
          navigate(AppRoutes.client.protected.HOME);
        } else {
          setError(result.errorMessage || "Failed to complete sign in");
        }
      } catch (err: any) {
        setError(err.message || "Failed to complete sign in");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Normal email sign-up - go to info page
    navigateToStep("signup-info", { email, passcode });
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
      title="Confirm Passcode"
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-8">
        Enter the same 6 digits again to confirm.
      </p>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-16">
        <div className="text-center">
          <p className="text-body-m text-base-content">Confirm your passcode</p>
          <p className="text-body-s text-base-content opacity-70 mt-4">
            Enter the same 6 digits again
          </p>
        </div>
        <PasscodeInput
          idPrefix="confirm-passcode"
          value={confirmPasscode}
          onChange={(value) => {
            setConfirmPasscode(value);
            setError("");
          }}
          onComplete={triggerSubmit}
          label="Confirm Passcode"
          helperText="Enter the same 6 digits again"
          error={error}
          disabled={false}
        />
        <Button
          variant="primary"
          type="submit"
          fullWidth
          disabled={isLoading || confirmPasscode.length !== 6}
        >
          {isLoading ? "Completing..." : "Continue"}
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
