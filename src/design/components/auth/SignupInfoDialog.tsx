// src/design/components/auth/SignupInfoDialog.tsx

import React, { useState } from "react";
import { Button, Dialog, TextInput } from "..";
import { useToast } from "../../../contexts";
import { AuthStep, TAuthStep } from "./type";
import { AuthController } from "../../../modules/auth";
import { AppLocales, useTranslate } from "../../../locales";

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
  const t = useTranslate();
  const { success } = useToast();
  const [fullName, setFullName] = useState(fullNameParam);
  const [username, setUsername] = useState(userNameParam);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || fullName.length < 2) {
      setError(t(AppLocales.Auth.SignUpInfo.FullNameRequired));
      return;
    }
    if (!username || username.length < 3) {
      setError(t(AppLocales.Auth.SignUpInfo.UsernameLength));
      return;
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      setError(t(AppLocales.Auth.SignUpInfo.UsernameFormat));
      return;
    }

    setIsLoading(true);
    await AuthController.signUpWithEmail(
      username,
      email,
      passcode,
      passcode, // passcode confirmation is same as passcode
      setError,
      () => {
        // After signup, navigate to verify email step
        navigateToStep(AuthStep.CONFIRM_EMAIL, { email, passcode });
        success(t(AppLocales.Auth.SignUpInfo.VerificationSent));
      },
    );
    setIsLoading(false);
  };

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title={t(AppLocales.Auth.SignUpInfo.Title)}
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-8">
        {t(AppLocales.Auth.SignUpInfo.Description)}
      </p>
      <form onSubmit={handleSubmit} className="space-y-16">
        <div className="text-center">
          <p className="text-body-m text-base-content">
            {t(AppLocales.Auth.SignUpInfo.Prompt)}
          </p>
        </div>
        <TextInput
          id="full-name"
          label={t(AppLocales.Auth.SignUpInfo.FullNameLabel)}
          type="text"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            updateUrl({ fullName: e.target.value });
          }}
          placeholder={t(AppLocales.Auth.SignUpInfo.FullNamePlaceholder)}
          helperText={t(AppLocales.Auth.SignUpInfo.FullNameHelper)}
          required
          fullWidth
          disabled={isLoading}
        />
        <TextInput
          id="username"
          label={t(AppLocales.Auth.SignUpInfo.UsernameLabel)}
          type="text"
          value={username}
          onChange={(e) => {
            const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
            setUsername(val);
            updateUrl({ username: val });
          }}
          placeholder={t(AppLocales.Auth.SignUpInfo.UsernamePlaceholder)}
          helperText={t(AppLocales.Auth.SignUpInfo.UsernameHelper)}
          required
          fullWidth
          disabled={isLoading}
        />
        <Button variant="primary" type="submit" fullWidth disabled={isLoading}>
          {isLoading
            ? t(AppLocales.Auth.SignUpInfo.CreatingAccount)
            : t(AppLocales.Auth.SignUpInfo.CreateAccount)}
        </Button>
        {error && (
          <p className="text-caption text-error text-center">{error}</p>
        )}
      </form>
    </Dialog>
  );
};
