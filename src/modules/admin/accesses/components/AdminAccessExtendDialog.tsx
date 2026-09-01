// src/modules/admin/accesses/components/AdminAccessExtendDialog.tsx

import React, { useState } from "react";
import {
  Dialog,
  TextInput,
  Button,
  FormContainer,
} from "../../../../design/components";
import type { IAdminAccess, IExtendAccessPayload } from "../types";

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
      title="Extend Entitlement Expiration"
    >
      <FormContainer onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-error/10 p-3 text-caption text-error">
            {error}
          </div>
        )}

        <div className="rounded-md bg-base-200 p-3 text-caption space-y-1">
          <div>
            <span className="font-semibold">User:</span>{" "}
            {access.user_name || access.user_email || access.user_id}
          </div>
          <div>
            <span className="font-semibold">Product:</span>{" "}
            {access.product_name || access.product_code || access.product_id}
          </div>
          <div>
            <span className="font-semibold">Current Expiry:</span>{" "}
            {access.expires_at
              ? new Date(access.expires_at).toLocaleDateString()
              : "Never (Lifetime)"}
          </div>
        </div>

        {!access.expires_at ? (
          <div className="rounded-md bg-warning/10 p-3 text-caption text-warning">
            This entitlement has Lifetime validity and cannot be extended.
          </div>
        ) : (
          <TextInput
            label="Add Additional Days"
            type="number"
            value={days.toString()}
            onChange={(e) => setDays(parseInt(e.target.value, 10) || 0)}
            min={1}
            required
          />
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="tertiary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!access.expires_at || isLoading}
          >
            Extend Expiration
          </Button>
        </div>
      </FormContainer>
    </Dialog>
  );
};
