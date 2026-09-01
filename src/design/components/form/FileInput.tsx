// src/design/components/form/FileInput.tsx

import React, { useRef } from "react";
import { cn } from "../../helpers";
import { Button } from "../button";
import { ButtonVariants, ComponentSizes } from "../../constants";

export interface IFileInputProps {
  label?: string;
  accept?: string;
  buttonText?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onChange: (file: File | null) => void;
}

export const FileInput: React.FC<IFileInputProps> = ({
  label,
  accept,
  buttonText = "Choose File",
  helperText,
  error,
  disabled = false,
  fullWidth = true,
  className,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasError = !!error;
  const displayText = error || helperText;

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onChange(files[0]);
    } else {
      onChange(null);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-1", fullWidth && "w-full", className)}
    >
      {label && (
        <span className="text-body-s font-medium text-base-content">
          {label}
        </span>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />

      <Button
        type="button"
        variant={ButtonVariants.SECONDARY}
        size={ComponentSizes.MD}
        disabled={disabled}
        onClick={handleClick}
        className="w-full sm:w-auto"
      >
        {buttonText}
      </Button>

      {displayText && (
        <span
          className={cn(
            "text-xs transition-colors duration-200",
            hasError ? "text-error font-medium" : "text-base-content/60",
          )}
        >
          {displayText}
        </span>
      )}
    </div>
  );
};
