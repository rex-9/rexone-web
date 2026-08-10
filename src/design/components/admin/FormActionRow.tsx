import React from "react";
import { Button } from "../button";

interface FormActionRowProps {
  submitLabel: string;
  isSubmitting?: boolean;
  onCancel: () => void;
}

export const FormActionRow: React.FC<FormActionRowProps> = ({
  submitLabel,
  isSubmitting = false,
  onCancel,
}) => (
  <div className="mt-24 flex flex-col-reverse gap-12 border-t border-base-300 pt-16 sm:flex-row sm:justify-end">
    <Button
      type="button"
      variant="tertiary"
      onClick={onCancel}
      disabled={isSubmitting}
    >
      Cancel
    </Button>
    <Button type="submit" isLoading={isSubmitting}>
      {submitLabel}
    </Button>
  </div>
);
