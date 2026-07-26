// src/design/components/auth/SigninPasscodeDialog.tsx

import React, { useState, useEffect, useRef } from "react";
import { useAuth, useToast } from "../../../contexts";
import { useCountdown } from "../../../hooks";
import { AuthController } from "../../../controllers";
import { Button, Dialog, PasscodeInput, TextLink } from "..";
import { useNavigate } from "react-router-dom";
import { AuthStep, TAuthStep } from "./type";

interface SigninPasscodeDialogProps {
  email: string;
  passcode: string;
  setPasscode: (value: string) => void;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
  onClose: () => void;
  onBack: () => void;
}

export const SigninPasscodeDialog: React.FC<SigninPasscodeDialogProps> = ({
  email,
  passcode,
  setPasscode,
  navigateToStep,
  onClose,
  onBack,
}) => {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const { success, info } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Use useCountdown hook (same as resend cooldown at ConfirmEmailDialog)
  const cooldown = useCountdown(0);
  const isCooldownActive = cooldown.isActive;
  const secondsLeft = cooldown.secondsLeft;

  // Track remaining attempts from backend
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);

  // Load persisted cooldown state from localStorage
  useEffect(() => {
    const key = `passcode-retry:${email}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const until = parsed.cooldownUntilMs || 0;
        if (until > Date.now()) {
          cooldown.startAt(until);
        }
      } catch {}
    }
  }, [email]);

  // Save cooldown state to localStorage
  const persistCooldownState = (cooldownUntilMs: number) => {
    const key = `passcode-retry:${email}`;
    localStorage.setItem(key, JSON.stringify({ cooldownUntilMs }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passcode.length !== 6) return;

    setIsLoading(true);
    const result = await AuthController.signInWithEmailOrUsername(
      email,
      passcode,
      setError,
      setMessage,
      signin,
      navigate,
    );

    if (result.success) {
      // Success - clear everything
      success("Sign in successful");
      cooldown.clear();
      setRemainingAttempts(3);
      persistCooldownState(0);
      setPasscode("");
    } else if (result.otpSent) {
      // OTP sent - unconfirmed user
      navigateToStep(AuthStep.CONFIRM_EMAIL, { email });
      info("Verification code sent.");
    } else if (result.cooldownRemaining && result.cooldownRemaining > 0) {
      // Cooldown active - use cooldown.start()
      cooldown.start(result.cooldownRemaining);
      const until = Date.now() + result.cooldownRemaining * 1000;
      persistCooldownState(until);
      setRemainingAttempts(0);
      setPasscode("");
      setError(`Too many attempts. Please wait ${result.cooldownRemaining}s.`);
    } else {
      // Failed attempt - update remaining attempts
      const attemptsLeft = result.remainingAttempts ?? 3;
      setRemainingAttempts(attemptsLeft);
      setPasscode("");
      setError(
        attemptsLeft > 0
          ? "Incorrect passcode. Try again."
          : "No attempts remaining.",
      );
    }
    setIsLoading(false);
  };

  // Reset attempts when cooldown expires
  useEffect(() => {
    if (!isCooldownActive && cooldown.targetTimeMs > 0) {
      setRemainingAttempts(3);
      setError("");
      persistCooldownState(0);
      setPasscode("");
    }
  }, [isCooldownActive]);

  const triggerSubmit = () => {
    if (formRef.current) {
      const event = new Event("submit", { bubbles: true, cancelable: true });
      formRef.current.dispatchEvent(event);
    }
  };

  // Helper text based on state (same pattern as ConfirmEmailDialog)
  const getHelperText = (): string => {
    if (isCooldownActive) {
      return `Wait ${secondsLeft}s before trying again.`;
    }
    if (remainingAttempts === 0) {
      return "No attempts remaining. Please wait for cooldown.";
    }
    if (remainingAttempts <= 2) {
      return `${remainingAttempts}/3 attempts remaining.`;
    }
    return "Enter your 6-digit passcode.";
  };

  const isSubmitDisabled =
    isLoading || isCooldownActive || passcode.length !== 6;

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title="Sign In"
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-8">
        Enter your 6-digit passcode to continue.
      </p>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-16">
        <div className="text-center">
          <p className="text-body-m text-base-content">
            Sign in to <span className="font-semibold">{email}</span>
          </p>
        </div>

        <PasscodeInput
          idPrefix="signin-passcode"
          value={passcode}
          onChange={(value) => {
            setPasscode(value);
            setError("");
          }}
          onComplete={triggerSubmit}
          label=""
          error={error}
          disabled={isLoading || isCooldownActive}
          helperText={getHelperText()}
        />

        <Button
          variant="primary"
          type="submit"
          fullWidth
          disabled={isSubmitDisabled}
        >
          {isCooldownActive
            ? `Try again in ${secondsLeft}s`
            : isLoading
              ? "Signing in..."
              : "Sign In"}
        </Button>

        <div className="flex justify-between text-sm">
          <TextLink
            label="Use a different email"
            onClick={() => navigateToStep(AuthStep.INITIAL)}
          />
          <TextLink
            label="Forgot your passcode?"
            onClick={() => navigateToStep(AuthStep.FORGOT_PASSCODE, { email })}
          />
        </div>
      </form>
    </Dialog>
  );
};
