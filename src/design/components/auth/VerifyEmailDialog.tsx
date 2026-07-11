import React from "react";
import { Button } from "../Button";
import { PasscodeBoxesInput } from "../PasscodeBoxesInput";
import { TextLink } from "../TextLink";

export interface IVerifyEmailDialog {
  email: string;
  otp: string;
  otpError: string;
  message: string;
  error: string;
  isLoading: boolean;
  resendCountdownActive: boolean;
  resendCountdownSecondsLeft: number;
  onOtpChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onResendCode: () => void;
  onUseDifferentEmail: () => void;
}

const VerifyEmailDialog: React.FC<IVerifyEmailDialog> = ({
  email,
  otp,
  otpError,
  message,
  error,
  isLoading,
  resendCountdownActive,
  resendCountdownSecondsLeft,
  onOtpChange,
  onSubmit,
  onResendCode,
  onUseDifferentEmail,
}) => {
  return (
    <div className="space-y-16">
      <form onSubmit={onSubmit} className="space-y-16">
        <PasscodeBoxesInput
          idPrefix="verify-email-code"
          value={otp}
          onChange={onOtpChange}
          label="Verification Code"
          error={otpError}
          helperText="Enter the 6-digit code sent to your email"
          disabled={isLoading}
        />

        <Button variant="primary" type="submit" fullWidth disabled={isLoading || otp.length !== 6}>
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-body-m text-base-content font-semibold">Verify your email</p>
        <p className="text-body-s text-base-content opacity-70 mt-4">We have sent a confirmation code to:</p>
        <p className="text-body-m text-base-content font-medium mt-2">{email}</p>
      </div>

      <div className="text-center">
        <TextLink
          label={
            resendCountdownActive
              ? `Resend code in ${resendCountdownSecondsLeft}s`
              : "Did not receive the code? Resend"
          }
          onClick={resendCountdownActive ? undefined : onResendCode}
          className={`text-body-s ${resendCountdownActive ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>

      <div className="text-center space-y-4">
        <p className="text-body-s text-base-content opacity-70">Check your inbox and enter the code to complete signup.</p>
        <TextLink label="Use a different email" onClick={onUseDifferentEmail} className="text-body-s" />
      </div>

      {message && <p className="text-caption text-success text-center">{message}</p>}
      {error && <p className="text-caption text-error text-center">{error}</p>}
    </div>
  );
};

export default VerifyEmailDialog;
