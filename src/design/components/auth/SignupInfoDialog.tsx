import React from "react";
import { Button, TextInput } from "..";

export interface ISignupInfoDialog {
  fullName: string;
  username: string;
  isLoading: boolean;
  error: string;
  onFullNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const SignupInfoDialog: React.FC<ISignupInfoDialog> = ({
  fullName,
  username,
  isLoading,
  error,
  onFullNameChange,
  onUsernameChange,
  onSubmit,
}) => {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <p className="text-body-m text-base-content">
          Almost done! Tell us a bit about yourself
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-16">
        <TextInput
          id="full-name"
          type="text"
          value={fullName}
          onChange={(event) => onFullNameChange(event.target.value)}
          placeholder="John Doe"
          label="Full Name"
          helperText="Your real name (visible to others)"
          required
          fullWidth
          disabled={isLoading}
        />

        <TextInput
          id="username"
          type="text"
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
          placeholder="john_doe"
          label="Username"
          helperText="Unique identifier (letters, numbers, underscores only)"
          required
          fullWidth
          disabled={isLoading}
        />

        <Button variant="primary" type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {error && <p className="text-caption text-error text-center">{error}</p>}
    </div>
  );
};
