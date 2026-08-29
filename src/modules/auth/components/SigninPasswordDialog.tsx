// src/design/components/auth/SigninPasswordDialog.tsx

import React, { useState, useEffect, useRef } from "react";
import { useAuth, useToast } from "../../../contexts";
import { useCountdown } from "../../../hooks";
import {
  Button,
  Dialog,
  PasswordInput,
  TextLink,
  FormContainer,
} from "../../../design/components";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { DialogAuthSteps, TAuthStep } from "..";
import { AuthController } from "..";
import { AppLocales, useTranslate } from "../../../locales";

interface ISigninPasswordDialogProps {
  email: string;
  password?: string;
  setPassword?: (value: string) => void;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
  onClose: () => void;
  onBack: () => void;
}

export const SigninPasswordDialog: React.FC<ISigninPasswordDialogProps> = ({
  email,
  password = "",
  setPassword = () => {},
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
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);
  const [hasFailureHistory, setHasFailureHistory] = useState(false);

  // Countdown for cooldown period
  const cooldown = useCountdown(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length !== 6 || cooldown.isActive) return;

    setIsLoading(true);
    const result = await AuthController.signInWithEmailOrUsername(
      email,
      password,
    );
    setIsLoading(false);

    if (result.success && result.token && result.user) {
      signin(result.token, result.user);
      success(t(AppLocales.Auth.SignInPasscode.SignInSuccess));
      cooldown.clear();
      setRemainingAttempts(3);
      setHasFailureHistory(false);
      setPassword("");
      setError("");
      onClose();
      navigate(AppRoutes.client.protected.HOME);
    } else if (result.otpSent) {
      info(t(AppLocales.Auth.SignInPasscode.VerificationSent));
      navigateToStep(DialogAuthSteps.CONFIRM_EMAIL, { email });
    } else if (result.cooldownRemaining && result.cooldownRemaining > 0) {
      // Cooldown active - start countdown
      cooldown.start(result.cooldownRemaining);
      setRemainingAttempts(0);
      setHasFailureHistory(true);
      setPassword("");
      setError(
        t(AppLocales.Auth.SignInPasscode.TooManyAttempts, {
          seconds: result.cooldownRemaining,
        }),
      );
    } else {
      // Failed attempt - update remaining attempts
      const attemptsLeft =
        result.remainingAttempts !== undefined
          ? result.remainingAttempts
          : Math.max(0, remainingAttempts - 1);
      setRemainingAttempts(attemptsLeft);
      setHasFailureHistory(true);
      setPassword("");

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
  const prevIsActiveRef = useRef(cooldown.isActive);
  useEffect(() => {
    if (prevIsActiveRef.current && !cooldown.isActive) {
      setRemainingAttempts(3);
      setError("");
      setPassword("");
    }
    prevIsActiveRef.current = cooldown.isActive;
  }, [cooldown.isActive, setPassword]);

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
    if (hasFailureHistory && remainingAttempts < 3) {
      return t(AppLocales.Auth.SignInPasscode.AttemptsRemaining, {
        attempts: remainingAttempts,
      });
    }
    return t(AppLocales.Auth.SignInPasscode.EnterPasscode);
  };

  const isSubmitDisabled =
    isLoading || cooldown.isActive || password.length !== 6;

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
      <p className="text-body-s text-base-content opacity-70 text-center mb-4">
        {t(AppLocales.Auth.SignInPasscode.Description)}
      </p>
      <FormContainer
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="text-center">
          <p className="text-body-m text-base-content">
            {t(AppLocales.Auth.SignInPasscode.Prompt)}{" "}
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        <PasswordInput
          idPrefix="signin-password"
          value={password}
          onChange={(value) => {
            setPassword(value);
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
            onClick={() => navigateToStep(DialogAuthSteps.INITIAL)}
            className="text-body-s"
          />
          <TextLink
            label={t(AppLocales.Auth.SignInPasscode.ForgotPasscode)}
            onClick={() =>
              navigateToStep(DialogAuthSteps.FORGOT_PASSWORD, { email })
            }
            className="text-body-s"
          />
        </div>
      </FormContainer>
    </Dialog>
  );
};
