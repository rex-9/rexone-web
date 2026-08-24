import React from "react";
import { Button } from "../button";

interface IAlertDialogProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  title?: string;
}

export const AlertDialog: React.FC<IAlertDialogProps> = ({
  isOpen,
  message,
  onClose,
  title = "Something went wrong",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-16"
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-alert-title"
    >
      <div className="w-full max-w-md rounded-lg bg-base-100 p-20 shadow-xl">
        <h2 id="global-alert-title" className="text-heading-s text-base-content">
          {title}
        </h2>
        <p className="mt-8 whitespace-pre-wrap text-body-m text-base-content/70">
          {message}
        </p>
        <div className="mt-20 flex justify-end">
          <Button type="button" onClick={onClose}>OK</Button>
        </div>
      </div>
    </div>
  );
};
