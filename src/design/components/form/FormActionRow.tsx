import React from "react";
import { useLoading } from "../../../contexts/LoadingContext";
import { Button } from "../button";

export interface IFormActionRowProps {
  submitLabel: string;
  cancelLabel: string;
  onCancel: () => void;
}

export type FormActionRowProps = IFormActionRowProps;

export const FormActionRow: React.FC<FormActionRowProps> = ({
  submitLabel,
  cancelLabel,
  onCancel,
}) => {
  const { isLoading, isOverlayLoading } = useLoading();
  const isSubmitting = isLoading && !isOverlayLoading;

  return (
    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-base-300 pt-4 sm:flex-row sm:justify-end">
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
};
