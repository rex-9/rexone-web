// src/design/components/auth/ConfirmEmailDialog.tsx

import React, { useState, useRef } from "react";
import { useAuth, useToast } from "../../../contexts";
import {
  Button,
  Dialog,
  PasswordInput,
  TextLink,
} from "../../../design/components";
import { useCountdown } from "../../../hooks";
import { DialogAuthSteps, TAuthStep } from "..";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { AuthController } from "..";
import { AppLocales, useTranslate } from "../../../locales";

interface ConfirmEmailDialogProps {
  email: string;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
  updateUrl: (params: Record<string, string | null>) => void;
  onClose: () => void;
  onBack: () => void;
}

export const ConfirmEmailDialog: React.FC<ConfirmEmailDialogProps> = ({
  email,
  navigateToStep,
  updateUrl,
  onClose,
  onBack,
}) => {
  const { signin } = useAuth();
  const t = useTranslate();
  const navigate = useNavigate();
  const { success, info } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cooldown = useCountdown(0);
  const isCooldown = cooldown.isActive;
  const secondsLeft = cooldown.secondsLeft;

  const handleVerify = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError("");
    setMessage("");

    const result = await AuthController.confirmEmailWithCode(email, otp);
    setIsLoading(false);

    if (result.success && result.token && result.user) {
      setMessage(result.message || "");
      success(t(AppLocales.Auth.ConfirmEmail.Verified));
      signin(result.token, result.user);
      navigate(AppRoutes.client.protected.HOME);
    } else {
      setError(result.error || "Failed to confirm email code.");
    }
  };

  const handleResend = async () => {
    if (isCooldown) return;
    setError("");
    setMessage("");

    const result = await AuthController.sendConfirmationEmail(email);

    if (result.success) {
      setMessage(result.message || "");
      cooldown.start(30);
      info(t(AppLocales.Auth.ConfirmEmail.Resent));
    } else {
      setError(result.error || "Failed to send confirmation email.");
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

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title={t(AppLocales.Auth.ConfirmEmail.Title)}
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-8">
        {t(AppLocales.Auth.ConfirmEmail.Description)}
      </p>
      <div className="space-y-16">
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="space-y-16"
        >
          <PasswordInput
            idPrefix="confirm-email-code"
            value={otp}
            onChange={(value: string) => {
              setOtp(value);
              updateUrl({ otp: value });
              setError("");
            }}
            onComplete={triggerSubmit}
            label={t(AppLocales.Auth.ConfirmEmail.FieldLabel)}
            error={error}
            helperText={t(AppLocales.Auth.ConfirmEmail.FieldHelper)}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            type="submit"
            fullWidth
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading
              ? t(AppLocales.Auth.ConfirmEmail.Verifying)
              : t(AppLocales.Auth.ConfirmEmail.VerifyEmail)}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-body-m text-base-content font-semibold">
            {t(AppLocales.Auth.ConfirmEmail.Prompt)}
          </p>
          <p className="text-body-s text-base-content opacity-70 mt-4">
            {t(AppLocales.Auth.ConfirmEmail.SentTo)}
          </p>
          <p className="text-body-m text-base-content font-medium mt-2">
            {email}
          </p>
        </div>

        <div className="text-center">
          <TextLink
            label={
              isCooldown
                ? t(AppLocales.Auth.ConfirmEmail.ResendIn, {
                    seconds: secondsLeft,
                  })
                : t(AppLocales.Auth.ConfirmEmail.Resend)
            }
            onClick={handleResend}
            className={`text-body-s ${isCooldown ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>

        <div className="text-center space-y-4">
          <p className="text-body-s text-base-content opacity-70">
            {t(AppLocales.Auth.ConfirmEmail.InboxInstruction)}
          </p>
          <TextLink
            label={t(AppLocales.Auth.Shared.UseDifferentEmail)}
            onClick={() => navigateToStep(DialogAuthSteps.INITIAL)}
            className="text-body-s"
          />
        </div>

        {message && (
          <p className="text-caption text-success text-center">{message}</p>
        )}
        {error && (
          <p className="text-caption text-error text-center">{error}</p>
        )}
      </div>
    </Dialog>
  );
};
