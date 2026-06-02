import React from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { TextLink } from "../TextLink";

export interface IForgotPasswordDialog {
  email: string;
  message: string;
  error: string;
  isLoading: boolean;
  resendCountdownActive: boolean;
  resendCountdownSecondsLeft: number;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onBackToSignin: () => void;
}

const ForgotPasswordDialog: React.FC<IForgotPasswordDialog> = ({
  email,
  message,
  error,
  isLoading,
  resendCountdownActive,
  resendCountdownSecondsLeft,
  onEmailChange,
  onSubmit,
  onBackToSignin,
}) => {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <p className="text-body-m text-base-content opacity-70">
          Enter your email and we will send you a link to reset your passcode.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-16">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="your@email.com"
          label="Email"
          required
          fullWidth
          disabled={isLoading}
        />

        <Button variant="primary" type="submit" fullWidth disabled={isLoading || resendCountdownActive}>
          {resendCountdownActive
            ? `Resend in ${resendCountdownSecondsLeft}s`
            : isLoading
              ? "Sending..."
              : "Send Passcode Reset Link"}
        </Button>
      </form>

      {message && <p className="text-caption text-success text-center">{message}</p>}
      {error && <p className="text-caption text-error text-center">{error}</p>}

      <div className="text-center">
        <TextLink label="Back to Sign In" onClick={onBackToSignin} className="text-body-s" />
      </div>
    </div>
  );
};

export default ForgotPasswordDialog;
