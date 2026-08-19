// src/design/components/auth/ForgotPasscodeDialog.tsx

import React, { useState } from "react";
import { useCountdown } from "../../../hooks";
import {
  Button,
  Dialog,
  TextInput,
  TextLink,
} from "../../../design/components";
import { useToast } from "../../../contexts";
import { AuthStep, TAuthStep } from "..";
import { AuthController } from "..";
import { AppLocales, useTranslate } from "../../../locales";

interface ForgotPasscodeDialogProps {
  email: string;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
  updateUrl: (params: Record<string, string | null>) => void;
  onClose: () => void;
  onBack: () => void;
}

export const ForgotPasscodeDialog: React.FC<ForgotPasscodeDialogProps> = ({
  email,
  navigateToStep,
  updateUrl,
  onClose,
  onBack,
}) => {
  const t = useTranslate();
  const { success } = useToast();
  const [localEmail, setLocalEmail] = useState(email);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cooldown = useCountdown(0);
  const isCooldown = cooldown.isActive;
  const secondsLeft = cooldown.secondsLeft;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await AuthController.sendForgotPasswordMail(
      localEmail,
      setError,
      setMessage,
      () => cooldown.start(60),
    );
    setIsLoading(false);
    if (!error) {
      success(t(AppLocales.Auth.ForgotPasscode.ResetLinkSent));
    }
  };

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title={t(AppLocales.Auth.ForgotPasscode.Title)}
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-8">
        {t(AppLocales.Auth.ForgotPasscode.Description)}
      </p>
      <form onSubmit={handleSubmit} className="space-y-16">
        <TextInput
          id="forgot-email"
          type="email"
          value={localEmail}
          onChange={(e) => {
            setLocalEmail(e.target.value);
            updateUrl({ email: e.target.value });
          }}
          placeholder={t(AppLocales.Auth.Shared.EmailPlaceholder)}
          label={t(AppLocales.Auth.Shared.EmailLabel)}
          required
          fullWidth
          disabled={isLoading}
        />
        <Button
          variant="primary"
          type="submit"
          fullWidth
          disabled={isLoading || isCooldown}
        >
          {isCooldown
            ? t(AppLocales.Auth.ForgotPasscode.ResendIn, {
                seconds: secondsLeft,
              })
            : isLoading
              ? t(AppLocales.Auth.ForgotPasscode.Sending)
              : t(AppLocales.Auth.ForgotPasscode.SendResetLink)}
        </Button>
        <div className="text-center text-sm">
          <TextLink
            label={t(AppLocales.Auth.ForgotPasscode.BackToSignIn)}
            onClick={() =>
              navigateToStep(AuthStep.SIGNIN_PASSCODE, { email: localEmail })
            }
          />
        </div>
      </form>
      {message && (
        <p className="text-caption text-success text-center">{message}</p>
      )}
      {error && <p className="text-caption text-error text-center">{error}</p>}
    </Dialog>
  );
};
