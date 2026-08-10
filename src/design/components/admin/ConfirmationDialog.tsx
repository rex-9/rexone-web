import React from "react";
import { Button } from "../button";
import { Dialog } from "../overlay";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  isLoading = false,
  onConfirm,
  onClose,
}) => (
  <Dialog
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    footer={
      <>
        <Button variant="tertiary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-body-m text-base-content opacity-80">{message}</p>
  </Dialog>
);
