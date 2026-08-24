import React from "react";
import { Button } from "../../../design/components/button";
import { ADMIN_COMMON_LABELS } from "../constants";

interface IFormActionRowProps {
  submitLabel: string;
  isSubmitting?: boolean;
  cancelLabel?: string;
  onCancel: () => void;
}

export const FormActionRow: React.FC<IFormActionRowProps> = ({
  submitLabel,
  isSubmitting = false,
  cancelLabel = ADMIN_COMMON_LABELS.CANCEL,
  onCancel,
}) => (
  <div className="mt-24 flex flex-col-reverse gap-12 border-t border-base-300 pt-16 sm:flex-row sm:justify-end">
    <Button
      type="button"
      variant="tertiary"
      onClick={onCancel}
      disabled={isSubmitting}
    >
      {cancelLabel}
    </Button>
    <Button type="submit" isLoading={isSubmitting}>
      {submitLabel}
    </Button>
  </div>
);
