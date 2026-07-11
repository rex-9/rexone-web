import React from "react";
import { AlertMessage } from "../AlertMessage";
import { Button } from "../Button";
import { GoogleBtn } from "../GoogleBtn";
import { Input } from "../Input";

export interface IInitialDialog {
  isLoading: boolean;
  isBlocked: boolean;
  email: string;
  emailError: string;
  error: string;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onGoogleSignIn: () => void;
  onGoogleRetry: () => void;
}

const InitialDialog: React.FC<IInitialDialog> = ({
  isLoading,
  isBlocked,
  email,
  emailError,
  error,
  onEmailChange,
  onSubmit,
  onGoogleSignIn,
  onGoogleRetry,
}) => {
  return (
    <div className="space-y-16">
      <GoogleBtn onClick={onGoogleSignIn} isLoading={isLoading}>
        Continue with Google
      </GoogleBtn>
      {isBlocked && (
        <div className="space-y-8">
          <AlertMessage
            type="error"
            message="It looks like an ad blocker or privacy extension is blocking the Google sign in. Please disable it and try again."
          />
          <Button variant="primary" onClick={onGoogleRetry} fullWidth>
            Retry
          </Button>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-base-300" />
        </div>
        <div className="relative flex justify-center text-body-s">
          <span className="px-16 bg-base-100 text-base-content opacity-60">
            or
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-16">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="your@email.com"
          label="Email"
          error={emailError}
          helperText="Enter your email to sign in or create an account"
          required
          fullWidth
          disabled={isLoading}
        />

        <Button variant="primary" type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Checking..." : "Continue"}
        </Button>
      </form>

      {error && <p className="text-caption text-error text-center">{error}</p>}
    </div>
  );
};

export default InitialDialog;
