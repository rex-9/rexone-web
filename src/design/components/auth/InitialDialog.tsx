// src/design/components/auth/InitialDialog.tsx

import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth, useToast } from "../../../contexts";
import { authController, userController } from "../../../controllers";
import { Button, GoogleButton, TextInput, AlertMessage, Dialog } from "..";
import AppRoutes from "../../../AppRoutes";
import { useNavigate } from "react-router-dom";
import { AuthStep } from "./type";

interface InitialDialogProps {
  email: string;
  navigateToStep: (step: AuthStep, extra?: Record<string, string>) => void;
  updateUrl: (params: Record<string, string | null>) => void;
  onClose: () => void;
}

export const InitialDialog: React.FC<InitialDialogProps> = ({
  email,
  navigateToStep,
  updateUrl,
  onClose,
}) => {
  const { signin, setGoogleChallengeToken } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [localEmail, setLocalEmail] = useState(email);
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(localEmail)) return;
    setIsLoading(true);
    try {
      const result = await userController.peekUser(localEmail, setError);

      if (result === "exists_confirmed") {
        // User exists and is confirmed → sign in with passcode
        navigateToStep("signin-passcode", { email: localEmail });
      } else if (result === "exists_unconfirmed") {
        // User exists but not confirmed → send new code and go to verify
        await authController.sendConfirmationEmail(
          localEmail,
          setError,
          () => {},
          () => {},
        );
        navigateToStep("confirm-email", { email: localEmail });
      } else {
        // New user → sign up flow
        navigateToStep("signup-passcode-create", { email: localEmail });
      }
    } catch (err: any) {
      setError(err.message || "Failed to check user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError("");
      try {
        const result = await authController.signInWithGoogle(
          tokenResponse.access_token,
        );
        if (result.success && result.token && result.user) {
          // Existing user - sign in directly
          signin(result.token, result.user);
          toast.showToast("success", "Signed in with Google");
          onClose();
          navigate(AppRoutes.client.protected.HOME);
        } else if (result.passcodeRequired && result.challengeToken) {
          // New user - show passcode setup
          setGoogleChallengeToken(result.challengeToken);
          navigateToStep("signup-passcode-create", {
            email: result.user?.email || "",
          });
        } else {
          setError(result.errorMessage || "Google sign in failed");
        }
      } catch (err: any) {
        setError(err.message || "Google sign in failed");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setIsBlocked(true);
      setError("Google sign in blocked. Please try again.");
    },
  });

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      title="Welcome to Meritbox"
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-8">
        Support dreams or make yours come true.
      </p>
      <div className="space-y-16">
        <GoogleButton
          onClick={() => handleGoogleSignIn()}
          isLoading={isLoading}
        >
          Continue with Google
        </GoogleButton>
        {isBlocked && (
          <div className="space-y-8">
            <AlertMessage
              type="error"
              message="Ad blocker detected. Please disable and retry."
            />
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              fullWidth
            >
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
        <form onSubmit={handleEmailSubmit} className="space-y-16">
          <TextInput
            id="email"
            type="email"
            value={localEmail}
            onChange={(e) => {
              setLocalEmail(e.target.value);
              updateUrl({ email: e.target.value });
            }}
            placeholder="your@email.com"
            label="Email"
            error={emailError}
            helperText="Enter your email to sign in or create an account"
            required
            fullWidth
            disabled={isLoading}
          />
          <Button
            variant="primary"
            type="submit"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Checking..." : "Continue"}
          </Button>
        </form>
        {error && (
          <p className="text-caption text-error text-center">{error}</p>
        )}
      </div>
    </Dialog>
  );
};
