// src/design/components/auth/ConfirmEmailDialog.tsx

import React, { useState, useRef } from "react";
import { useAuth, useToast } from "../../../contexts";
import { authController } from "../../../controllers";
import { Button, Dialog, PasscodeInput, TextLink } from "..";
import { useCountdown } from "../../../hooks";
import { AuthStep, TAuthStep } from "./type";
import { useNavigate } from "react-router-dom";

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
    await authController.confirmEmailWithCode(
      email,
      otp,
      setError,
      (msg) => {
        setMessage(msg);
        success("Email verified successfully");
      },
      signin,
      navigate,
    );
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (isCooldown) return;
    await authController.sendConfirmationEmail(
      email,
      setError,
      setMessage,
      () => cooldown.start(30),
    );
    if (!error) {
      info("Resend email sent");
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
      title="Verify Your Email"
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-8">
        Enter the 6-digit code sent to your email.
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
          <PasscodeInput
            idPrefix="confirm-email-code"
            value={otp}
            onChange={(value) => {
              setOtp(value);
              updateUrl({ otp: value });
              setError("");
            }}
            onComplete={triggerSubmit}
            label="Verification Code"
            error={error}
            helperText="Enter the 6-digit code sent to your email"
            disabled={isLoading}
          />
          <Button
            variant="primary"
            type="submit"
            fullWidth
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-body-m text-base-content font-semibold">
            Verify your email
          </p>
          <p className="text-body-s text-base-content opacity-70 mt-4">
            We have sent a confirmation code to:
          </p>
          <p className="text-body-m text-base-content font-medium mt-2">
            {email}
          </p>
        </div>

        <div className="text-center">
          <TextLink
            label={
              isCooldown
                ? `Resend code in ${secondsLeft}s`
                : "Did not receive the code? Resend"
            }
            onClick={handleResend}
            className={`text-body-s ${isCooldown ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>

        <div className="text-center space-y-4">
          <p className="text-body-s text-base-content opacity-70">
            Check your inbox and enter the code to complete signup.
          </p>
          <TextLink
            label="Use a different email"
            onClick={() => navigateToStep(AuthStep.INITIAL)}
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
