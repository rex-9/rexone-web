// src/design/components/overlay/ConfirmDialog.tsx

import React from "react";
import { Dialog } from "./Dialog";
import { Button } from "../button";
import { ButtonVariants, ButtonTypes } from "../../constants";

export interface IConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const ConfirmDialog: React.FC<IConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  isLoading = false,
  className,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className={className}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type={ButtonTypes.BUTTON}
            variant={ButtonVariants.TERTIARY}
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type={ButtonTypes.BUTTON}
            variant={
              isDestructive ? ButtonVariants.PRIMARY : ButtonVariants.SECONDARY
            }
            className={
              isDestructive
                ? "!bg-error !text-white hover:!bg-error/90"
                : ""
            }
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <p className="text-body-m text-base-content/80 py-3">{message}</p>
    </Dialog>
  );
};
