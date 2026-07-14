// src/design/components/auth/SignupInfoDialog.tsx

import React, { useState } from "react";
import { authController } from "../../../controllers";
import { Button, Dialog, TextInput } from "..";
import { useToast } from "../../../contexts";
import { AuthStep, TAuthStep } from "./type";

interface SignupInfoDialogProps {
  email: string;
  passcode: string;
  fullNameParam: string;
  userNameParam: string;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
  updateUrl: (params: Record<string, string | null>) => void;
  onClose: () => void;
  onBack: () => void;
}

export const SignupInfoDialog: React.FC<SignupInfoDialogProps> = ({
  email,
  passcode,
  fullNameParam,
  userNameParam,
  navigateToStep,
  updateUrl,
  onClose,
  onBack,
}) => {
  const toast = useToast();
  const [fullName, setFullName] = useState(fullNameParam);
  const [username, setUsername] = useState(userNameParam);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || fullName.length < 2) {
      setError("Please enter your full name");
      return;
    }
    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      setError(
        "Username can only contain lowercase letters, numbers, and underscores",
      );
      return;
    }

    setIsLoading(true);
    await authController.signUpWithEmail(
      username,
      email,
      passcode,
      passcode, // passcode confirmation is same as passcode
      setError,
      () => {
        // After signup, navigate to verify email step
        navigateToStep(AuthStep.CONFIRM_EMAIL, { email, passcode });
        toast.showToast(
          "success",
          "Verification email sent. Please check your inbox.",
        );
      },
    );
    setIsLoading(false);
  };

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title="Complete Profile"
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-8">
        Tell us a bit about yourself.
      </p>
      <form onSubmit={handleSubmit} className="space-y-16">
        <div className="text-center">
          <p className="text-body-m text-base-content">
            Almost done! Tell us a bit about yourself
          </p>
        </div>
        <TextInput
          id="full-name"
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            updateUrl({ fullName: e.target.value });
          }}
          placeholder="John Doe"
          helperText="Your real name (visible to others)"
          required
          fullWidth
          disabled={isLoading}
        />
        <TextInput
          id="username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => {
            const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
            setUsername(val);
            updateUrl({ username: val });
          }}
          placeholder="john_doe"
          helperText="Unique identifier (letters, numbers, underscores only)"
          required
          fullWidth
          disabled={isLoading}
        />
        <Button variant="primary" type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
        {error && (
          <p className="text-caption text-error text-center">{error}</p>
        )}
      </form>
    </Dialog>
  );
};
