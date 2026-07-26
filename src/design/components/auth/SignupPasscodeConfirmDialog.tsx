// src/design/components/auth/SignupPasscodeConfirmDialog.tsx

import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Dialog, PasscodeInput, TextLink } from "..";
import { AuthStep, TAuthStep } from "./type";
import { AuthController } from "../../../controllers";
import { useAuth, useToast } from "../../../contexts";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";

interface SignupPasscodeConfirmDialogProps {
  email: string;
  passcode: string;
  confirmPasscode: string;
  setConfirmPasscode: (value: string) => void;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
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
  const { success } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  // Check if this is a password reset flow
  const resetPasswordToken = searchParams.get("reset_password_token");

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

    // If this is a password reset flow
    if (resetPasswordToken) {
      setIsLoading(true);
      try {
        await AuthController.resetPassword(
          resetPasswordToken,
          passcode,
          confirmPasscode,
          setError,
          // Remove setMessage - it's not used
          () => {
            // Navigate to sign in (initial dialog) on success
            success("Passcode reset successfully!");
            onClose();
            navigate(AppRoutes.buildDialogUrl(AppRoutes.dialog.steps.initial));
          },
        );
      } catch (err: any) {
        setError(err.message || "Failed to reset passcode.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // If this is a Google sign-up with challenge token
    if (googleChallengeToken) {
      setIsLoading(true);
      try {
        const result = await AuthController.completeGoogleSignIn(
          passcode,
          googleChallengeToken,
        );
        if (result.success && result.token && result.user) {
          signin(result.token, result.user);
          success("Google sign in complete");
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
    navigateToStep(AuthStep.SIGNUP_INFO, { email, passcode });
  };

  const triggerSubmit = () => {
    if (formRef.current) {
      const event = new Event("submit", { bubbles: true, cancelable: true });
      formRef.current.dispatchEvent(event);
    }
  };

  // Show different title for reset password flow
  const isResetFlow = !!resetPasswordToken;

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title={isResetFlow ? "Confirm New Passcode" : "Confirm Passcode"}
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-8">
        {isResetFlow
          ? "Enter the same 6 digits again to confirm your new passcode."
          : "Enter the same 6 digits again to confirm."}
      </p>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-16">
        <div className="text-center">
          <p className="text-body-m text-base-content">
            {isResetFlow
              ? "Confirm your new passcode"
              : "Confirm your passcode"}
          </p>
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
          {isLoading ? "Resetting..." : "Continue"}
        </Button>
        <div className="text-center text-sm">
          <TextLink
            label="Use a different email"
            onClick={() => navigateToStep(AuthStep.INITIAL)}
          />
        </div>
      </form>
    </Dialog>
  );
};
