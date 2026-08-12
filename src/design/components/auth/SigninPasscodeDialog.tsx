// src/design/components/auth/SigninPasscodeDialog.tsx

import React, { useState, useEffect, useRef } from "react";
import { useAuth, useToast } from "../../../contexts";
import { useCountdown } from "../../../hooks";
import { Button, Dialog, PasscodeInput, TextLink } from "..";
import { useNavigate } from "react-router-dom";
import { AuthStep, TAuthStep } from "./type";
import { AuthController } from "../../../modules/auth";

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
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);

  // Countdown for cooldown period
  const cooldown = useCountdown(0);

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
      success("Sign in successful");
      cooldown.clear();
      setRemainingAttempts(3);
      persistCooldownState(0);
      setPasscode("");
    } else if (result.otpSent) {
      info("Verification code sent.");
      navigateToStep(AuthStep.CONFIRM_EMAIL, { email });
    } else if (result.cooldownRemaining && result.cooldownRemaining > 0) {
      // Cooldown active - start countdown
      cooldown.start(result.cooldownRemaining);
      const until = Date.now() + result.cooldownRemaining * 1000;
      persistCooldownState(until);
      setRemainingAttempts(0);
      setPasscode("");
      setError(`Too many attempts. Try again in ${result.cooldownRemaining}s.`);
    } else {
      // Failed attempt - update remaining attempts
      const attemptsLeft = result.remainingAttempts ?? 3;
      setRemainingAttempts(attemptsLeft);
      setPasscode("");

      if (attemptsLeft > 0) {
        setError(`Incorrect passcode. ${attemptsLeft}/3 attempts remaining.`);
      } else {
        setError("No attempts remaining. Please wait.");
      }
    }
    setIsLoading(false);
  };

  // Reset attempts when cooldown expires
  useEffect(() => {
    if (!cooldown.isActive && cooldown.targetTimeMs > 0) {
      setRemainingAttempts(3);
      setError("");
      persistCooldownState(0);
      setPasscode("");
    }
  }, [cooldown.isActive]);

  const triggerSubmit = () => {
    if (formRef.current) {
      const event = new Event("submit", { bubbles: true, cancelable: true });
      formRef.current.dispatchEvent(event);
    }
  };

  // Helper text with countdown
  const getHelperText = (): string => {
    if (cooldown.isActive) {
      return `Wait ${cooldown.secondsLeft}s before trying again.`;
    }
    if (remainingAttempts === 0) {
      return "No attempts remaining. Please wait.";
    }
    if (remainingAttempts <= 2) {
      return `${remainingAttempts}/3 attempts remaining.`;
    }
    return "Enter your 6-digit passcode.";
  };

  const isSubmitDisabled =
    isLoading || cooldown.isActive || passcode.length !== 6;

  // Button text with countdown
  const getButtonText = (): string => {
    if (cooldown.isActive) {
      return `Try again in ${cooldown.secondsLeft}s`;
    }
    if (isLoading) {
      return "Signing in...";
    }
    if (remainingAttempts === 0) {
      return "Please wait...";
    }
    return "Sign In";
  };

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
          disabled={isLoading || cooldown.isActive}
          helperText={getHelperText()}
        />

        <Button
          variant="primary"
          type="submit"
          fullWidth
          disabled={isSubmitDisabled}
        >
          {getButtonText()}
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
