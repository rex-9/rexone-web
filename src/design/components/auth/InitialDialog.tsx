// src/design/components/auth/InitialDialog.tsx

import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, useToast } from "../../../contexts";
import { AuthController, UserController } from "../../../controllers";
import { Button, GoogleButton, TextInput, Dialog } from "..";
import AppRoutes from "../../../AppRoutes";
import { AuthStep, TAuthStep } from "./type";

interface InitialDialogProps {
  email: string;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
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
  const [searchParams] = useSearchParams();
  const { success } = useToast();

  const [localEmail, setLocalEmail] = useState(email);
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [error, setError] = useState("");

  // Read session message from URL params
  const message = searchParams.get("message");
  const [displayMessage, setDisplayMessage] = useState(message || "");

  // Clear message param when dialog closes or user interacts
  const clearMessageParam = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("message");
    window.history.replaceState({}, "", url.toString());
  };

  // Set display message when URL param changes
  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      // Optionally clear the param after showing (so it doesn't persist on reload)
      // We'll clear on close or on user action.
    }
  }, [message]);

  // Clear message when user starts typing or interacts
  const handleEmailChange = (value: string) => {
    setLocalEmail(value);
    updateUrl({ email: value });
    if (displayMessage) {
      setDisplayMessage("");
      clearMessageParam();
    }
  };

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
      const result = await UserController.peekUser(localEmail);

      switch (result) {
        case "exists_confirmed":
          // Existing confirmed user
          navigateToStep(AuthStep.SIGNIN_PASSCODE, {
            email: localEmail,
          });
          break;

        case "exists_unconfirmed":
          // Existing but unconfirmed user
          await AuthController.sendConfirmationEmail(
            localEmail,
            setError,
            () => {},
            () => {},
          );

          navigateToStep(AuthStep.CONFIRM_EMAIL, {
            email: localEmail,
          });
          break;

        case "not_exists":
          // Definitely a new user
          navigateToStep(AuthStep.SIGNUP_PASSCODE_CREATE, {
            email: localEmail,
          });
          break;
      }
    } catch (err: any) {
      console.error("Failed to check user:", err);

      setError(err?.message || "Failed to check user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError("");

      try {
        const result = await AuthController.signInWithGoogle(
          tokenResponse.access_token,
        );

        if (result.success && result.token && result.user) {
          // Existing user - sign in directly
          signin(result.token, result.user);
          success("Signed in with Google");
          onClose();
          navigate(AppRoutes.client.protected.HOME);
        } else if (result.passcodeRequired && result.challengeToken) {
          // New user - show passcode setup
          setGoogleChallengeToken(result.challengeToken);

          navigateToStep(AuthStep.SIGNUP_PASSCODE_CREATE, {
            email: result.user?.email || "",
          });
        } else {
          setError(result.errorMessage || "Google sign in failed");
        }
      } catch (err: any) {
        setError(err?.message || "Google sign in failed");
      } finally {
        setIsLoading(false);
      }
    },

    onError: () => {
      setIsBlocked(true);
      setError("Google sign in failed. Please try again.");
    },
  });

  const handleClose = () => {
    clearMessageParam();
    onClose();
  };

  return (
    <Dialog
      isOpen={true}
      onClose={handleClose}
      title="Welcome to Rexone"
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
          <div className="space-y-4">
            <div className="bg-error/10 border border-error/30 rounded-lg p-4 text-center">
              <p className="text-error font-medium">⚠️ Ad Blocker Detected</p>
              <p className="text-sm text-gray-600 mt-1">
                Please disable your ad blocker and retry Google sign in.
              </p>
            </div>
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
            onChange={(e) => handleEmailChange(e.target.value)}
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
        {displayMessage && (
          <p className="text-caption text-warning text-center">
            {displayMessage}
          </p>
        )}
        {error && (
          <p className="text-caption text-error text-center">{error}</p>
        )}
      </div>
    </Dialog>
  );
};
