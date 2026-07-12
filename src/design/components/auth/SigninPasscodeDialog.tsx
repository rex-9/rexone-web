// src/design/components/auth/SigninPasscodeDialog.tsx

import React, { useState, useEffect, useRef } from "react";
import { useAuth, useToast } from "../../../contexts";
import { useCountdown } from "../../../hooks";
import { authController } from "../../../controllers";
import { Button, Dialog, PasscodeInput, TextLink } from "..";
import { useNavigate } from "react-router-dom";
import { AuthStep } from "./type";

interface SigninPasscodeDialogProps {
  email: string;
  passcode: string;
  setPasscode: (value: string) => void;
  navigateToStep: (step: AuthStep, extra?: Record<string, string>) => void;
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
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cooldown state with localStorage persistence
  const [attempts, setAttempts] = useState(3);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const cooldown = useCountdown(
    Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)),
  );
  const isCooldownActive = cooldown.isActive;
  const secondsLeft = cooldown.secondsLeft;

  // Load persisted retry state from localStorage
  useEffect(() => {
    const key = `passcode-retry:${email}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAttempts(parsed.attempts ?? 3);
        const until = parsed.cooldownUntilMs || 0;
        if (until > Date.now()) {
          setCooldownUntil(until);
          cooldown.startAt(until);
        }
      } catch {}
    }
  }, [email]);

  // Save state to localStorage
  const persistRetryState = (attemptsLeft: number, cooldownUntilMs: number) => {
    const key = `passcode-retry:${email}`;
    localStorage.setItem(
      key,
      JSON.stringify({ attempts: attemptsLeft, cooldownUntilMs }),
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCooldownActive) return;
    if (passcode.length !== 6) {
      setError("Passcode must be 6 digits");
      return;
    }
    setIsLoading(true);
    setError("");
    const result = await authController.signInWithEmailOrUsername(
      email,
      passcode,
      setError,
      setMessage,
      signin,
      navigate,
    );

    if (result.success) {
      toast.showToast("success", "Sign in successful");
      // dialog closes automatically after navigation
    } else if (result.statusCode === 200 && result.otpSent) {
      // Backend sent verification email → go to verify step
      toast.showToast("info", "Verification code sent to your email");
      navigateToStep("verify-email", { email });
    } else {
      // Retry logic
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      if (newAttempts <= 0) {
        const waitSeconds = result.retryMeta?.cooldownSeconds || 30;
        const until = Date.now() + waitSeconds * 1000;
        setCooldownUntil(until);
        cooldown.start(waitSeconds);
        setError(`Too many attempts. Please wait ${waitSeconds}s.`);
        persistRetryState(0, until);
        setPasscode("");
      } else {
        setError(`Incorrect passcode. ${newAttempts} attempts remaining.`);
        persistRetryState(newAttempts, 0);
        setPasscode("");
      }
      setIsLoading(false);
    }
  };

  // Auto-submit trigger
  const triggerSubmit = () => {
    if (formRef.current) {
      // Dispatch a synthetic submit event
      const event = new Event("submit", { bubbles: true, cancelable: true });
      formRef.current.dispatchEvent(event);
    }
  };

  // Reset attempts when cooldown expires
  useEffect(() => {
    if (!isCooldownActive && cooldownUntil > 0) {
      setAttempts(3);
      setCooldownUntil(0);
      setError("");
      persistRetryState(3, 0);
      setPasscode("");
    }
  }, [isCooldownActive]);

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
          helperText={
            isCooldownActive ? `Wait ${secondsLeft}s before trying again` : ""
          }
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
            onClick={() => navigateToStep("initial")}
          />
          <TextLink
            label="Forgot your passcode?"
            onClick={() => navigateToStep("forgot-passcode", { email })}
          />
        </div>
      </form>
    </Dialog>
  );
};
