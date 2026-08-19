// src/design/components/auth/SigninPasscodeDialog.tsx

import React, { useState, useEffect, useRef } from "react";
import { useAuth, useToast } from "../../../contexts";
import { useCountdown } from "../../../hooks";
import {
  Button,
  Dialog,
  PasscodeInput,
  TextLink,
} from "../../../design/components";
import { useNavigate } from "react-router-dom";
import { AuthStep, TAuthStep } from "..";
import { AuthController } from "..";
import { AppLocales, useTranslate } from "../../../locales";

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
  const t = useTranslate();
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
    const key = `passcode-retry:${email.trim().toLowerCase()}`;
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
    const key = `passcode-retry:${email.trim().toLowerCase()}`;
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
      success(t(AppLocales.Auth.SignInPasscode.SignInSuccess));
      cooldown.clear();
      setRemainingAttempts(3);
      persistCooldownState(0);
      setPasscode("");
    } else if (result.otpSent) {
      info(t(AppLocales.Auth.SignInPasscode.VerificationSent));
      navigateToStep(AuthStep.CONFIRM_EMAIL, { email });
    } else if (result.cooldownRemaining && result.cooldownRemaining > 0) {
      // Cooldown active - start countdown
      cooldown.start(result.cooldownRemaining);
      const until = Date.now() + result.cooldownRemaining * 1000;
      persistCooldownState(until);
      setRemainingAttempts(0);
      setPasscode("");
      setError(
        t(AppLocales.Auth.SignInPasscode.TooManyAttempts, {
          seconds: result.cooldownRemaining,
        }),
      );
    } else {
      // Failed attempt - update remaining attempts
      const attemptsLeft = result.remainingAttempts ?? 3;
      setRemainingAttempts(attemptsLeft);
      setPasscode("");

      if (attemptsLeft > 0) {
        setError(
          t(AppLocales.Auth.SignInPasscode.IncorrectPasscode, {
            attempts: attemptsLeft,
          }),
        );
      } else {
        setError(t(AppLocales.Auth.SignInPasscode.NoAttempts));
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
      return t(AppLocales.Auth.SignInPasscode.WaitToRetry, {
        seconds: cooldown.secondsLeft,
      });
    }
    if (remainingAttempts === 0) {
      return t(AppLocales.Auth.SignInPasscode.NoAttempts);
    }
    if (remainingAttempts <= 2) {
      return t(AppLocales.Auth.SignInPasscode.AttemptsRemaining, {
        attempts: remainingAttempts,
      });
    }
    return t(AppLocales.Auth.SignInPasscode.EnterPasscode);
  };

  const isSubmitDisabled =
    isLoading || cooldown.isActive || passcode.length !== 6;

  // Button text with countdown
  const getButtonText = (): string => {
    if (cooldown.isActive) {
      return t(AppLocales.Auth.SignInPasscode.TryAgainIn, {
        seconds: cooldown.secondsLeft,
      });
    }
    if (isLoading) {
      return t(AppLocales.Auth.SignInPasscode.SigningIn);
    }
    if (remainingAttempts === 0) {
      return t(AppLocales.Auth.SignInPasscode.PleaseWait);
    }
    return t(AppLocales.Auth.SignInPasscode.SignIn);
  };

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title={t(AppLocales.Auth.SignInPasscode.Title)}
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-8">
        {t(AppLocales.Auth.SignInPasscode.Description)}
      </p>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-16">
        <div className="text-center">
          <p className="text-body-m text-base-content">
            {t(AppLocales.Auth.SignInPasscode.Prompt)}{" "}
            <span className="font-semibold">{email}</span>
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
            label={t(AppLocales.Auth.Shared.UseDifferentEmail)}
            onClick={() => navigateToStep(AuthStep.INITIAL)}
          />
          <TextLink
            label={t(AppLocales.Auth.SignInPasscode.ForgotPasscode)}
            onClick={() => navigateToStep(AuthStep.FORGOT_PASSCODE, { email })}
          />
        </div>
      </form>
    </Dialog>
  );
};
