// src/modules/admin/accesses/components/AdminAccessGrantDialog.tsx

import React, { useState } from "react";
import {
  Dialog,
  TextInput,
  TextArea,
  Button,
  FormContainer,
} from "../../../../design/components";
import {
  ButtonVariants,
  ButtonTypes,
  ButtonSizes,
} from "../../../../design/constants";
import type { IGrantAccessPayload } from "../types";
import {
  ADMIN_ACCESS_DURATION_OPTIONS,
  type TAdminAccessDurationOption,
} from "../constants";

interface IAdminAccessGrantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IGrantAccessPayload) => Promise<void>;
  isLoading?: boolean;
}

export const AdminAccessGrantDialog: React.FC<IAdminAccessGrantDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [emailsInput, setEmailsInput] = useState("");
  const [productCode, setProductCode] = useState("");
  const [durationOption, setDurationOption] =
    useState<TAdminAccessDurationOption>(ADMIN_ACCESS_DURATION_OPTIONS.DAYS_30);
  const [customDays, setCustomDays] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawTokens = emailsInput
      .split(/[,\n]/)
      .map((token: string) => token.trim())
      .filter(Boolean);

    if (rawTokens.length === 0) {
      setError("Please enter at least one valid user email or username.");
      return;
    }

    const emails: string[] = [];
    const usernames: string[] = [];
    rawTokens.forEach((token: string) => {
      if (token.includes("@")) {
        emails.push(token);
      } else {
        usernames.push(token);
      }
    });

    const trimmedCode = productCode.trim();
    if (!trimmedCode) {
      setError("Product code is required.");
      return;
    }

    if (!/^[A-Za-z0-9]{10}$/.test(trimmedCode)) {
      setError(
        "Product code must be 10 alphanumeric characters without special characters.",
      );
      return;
    }

    setError(null);
    let days: number | null = null;
    if (durationOption === ADMIN_ACCESS_DURATION_OPTIONS.DAYS_30) days = 30;
    else if (durationOption === ADMIN_ACCESS_DURATION_OPTIONS.DAYS_90)
      days = 90;
    else if (durationOption === ADMIN_ACCESS_DURATION_OPTIONS.DAYS_365)
      days = 365;
    else if (durationOption === ADMIN_ACCESS_DURATION_OPTIONS.CUSTOM)
      days = customDays;
    else if (durationOption === ADMIN_ACCESS_DURATION_OPTIONS.LIFETIME)
      days = null;

    await onSubmit({
      emails: emails.length > 0 ? emails : undefined,
      usernames: usernames.length > 0 ? usernames : undefined,
      code: trimmedCode,
      days,
    });
  };

  const handleClose = () => {
    if (isLoading) return;
    setError(null);
    setEmailsInput("");
    setProductCode("");
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Grant User Entitlement"
    >
      <FormContainer onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-error/10 p-3 text-caption text-error">
            {error}
          </div>
        )}

        <div>
          <TextArea
            label="User Emails or Usernames"
            placeholder="e.g. user1@example.com, username123, user2@company.com"
            value={emailsInput}
            onChange={(e) => setEmailsInput(e.target.value)}
            rows={3}
            required
          />
          <p className="mt-1 text-caption text-base-content opacity-60">
            Enter one or more email addresses or usernames (separated by commas
            or line breaks).
          </p>
        </div>

        <div>
          <TextInput
            label="Product Code"
            placeholder="e.g. A1b2C3d4E5"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            maxLength={10}
            required
          />
          <p className="mt-1 text-caption text-base-content opacity-60">
            10-character unique product code.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-caption font-medium text-base-content opacity-70">
            Entitlement Duration
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { id: ADMIN_ACCESS_DURATION_OPTIONS.DAYS_30, label: "30 Days" },
              { id: ADMIN_ACCESS_DURATION_OPTIONS.DAYS_90, label: "90 Days" },
              { id: ADMIN_ACCESS_DURATION_OPTIONS.DAYS_365, label: "1 Year" },
              { id: ADMIN_ACCESS_DURATION_OPTIONS.LIFETIME, label: "Lifetime" },
            ].map((option) => (
              <Button
                key={option.id}
                type={ButtonTypes.BUTTON}
                variant={
                  durationOption === option.id
                    ? ButtonVariants.PRIMARY
                    : ButtonVariants.SECONDARY
                }
                size={ButtonSizes.SM}
                onClick={() =>
                  setDurationOption(option.id as typeof durationOption)
                }
                className="w-full text-caption"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {durationOption === ADMIN_ACCESS_DURATION_OPTIONS.CUSTOM && (
          <TextInput
            label="Custom Duration (Days)"
            type="number"
            value={customDays.toString()}
            onChange={(e) => setCustomDays(parseInt(e.target.value, 10) || 0)}
          />
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type={ButtonTypes.BUTTON}
            variant={ButtonVariants.TERTIARY}
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type={ButtonTypes.SUBMIT}
            variant={ButtonVariants.PRIMARY}
            isLoading={isLoading}
          >
            Grant Access
          </Button>
        </div>
      </FormContainer>
    </Dialog>
  );
};
