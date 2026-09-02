// src/modules/admin/access/components/AdminAccessExtendDialog.tsx

import React, { useState } from "react";
import {
  Dialog,
  TextInput,
  Button,
  FormContainer,
} from "../../../../design/components";
import { ButtonVariants, ButtonTypes } from "../../../../design/constants";
import { formatAdminDate } from "../../../../helpers";
import type { IAdminAccess, IExtendAccessPayload } from "../types";
import { useTranslate, AppLocales } from "../../../../locales";

interface IAdminAccessExtendDialogProps {
  isOpen: boolean;
  access: IAdminAccess | null;
  onClose: () => void;
  onSubmit: (id: string, data: IExtendAccessPayload) => Promise<void>;
  isLoading?: boolean;
}

export const AdminAccessExtendDialog: React.FC<
  IAdminAccessExtendDialogProps
> = ({ isOpen, access, onClose, onSubmit, isLoading = false }) => {
  const t = useTranslate();
  const [days, setDays] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !access) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!access.expires_at) {
      setError("Lifetime access cannot be extended");
      return;
    }

    if (days <= 0) {
      setError("Please enter a positive number of days");
      return;
    }

    setError(null);
    await onSubmit(access.id, { days });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t(AppLocales.Admin.Accesses.ExtendDialog.Title)}
    >
      <FormContainer onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-error/10 p-3 text-caption text-error">
            {error}
          </div>
        )}

        <div className="rounded-md bg-base-200 p-3 text-caption space-y-1">
          <div>
            <span className="font-semibold">{t(AppLocales.Admin.Accesses.Table.User)}:</span>{" "}
            {access.user_name || access.user_email || access.user_id}
          </div>
          <div>
            <span className="font-semibold">{t(AppLocales.Admin.Accesses.Table.Product)}:</span>{" "}
            {access.product_name || access.product_code || access.product_id}
          </div>
          <div>
            <span className="font-semibold">{t(AppLocales.Admin.Accesses.Table.ExpiresAt)}:</span>{" "}
            {access.expires_at
              ? formatAdminDate(access.expires_at)
              : t(AppLocales.Admin.Common.Status.Lifetime)}
          </div>
        </div>

        {!access.expires_at ? (
          <div className="rounded-md bg-warning/10 p-3 text-caption text-warning">
            {t(AppLocales.Admin.Common.Status.Lifetime)}
          </div>
        ) : (
          <TextInput
            label={t(AppLocales.Admin.Accesses.ExtendDialog.AdditionalDaysLabel)}
            placeholder={t(AppLocales.Admin.Accesses.ExtendDialog.AdditionalDaysPlaceholder)}
            type="number"
            value={days.toString()}
            onChange={(e) => setDays(parseInt(e.target.value, 10) || 0)}
            min={1}
            required
          />
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type={ButtonTypes.BUTTON}
            variant={ButtonVariants.TERTIARY}
            onClick={onClose}
            disabled={isLoading}
          >
            {t(AppLocales.Admin.Common.Actions.Cancel)}
          </Button>
          <Button
            type={ButtonTypes.SUBMIT}
            variant={ButtonVariants.PRIMARY}
            isLoading={isLoading}
            disabled={!access.expires_at || isLoading}
          >
            {t(AppLocales.Admin.Accesses.ExtendDialog.ExtendButton)}
          </Button>
        </div>
      </FormContainer>
    </Dialog>
  );
};

