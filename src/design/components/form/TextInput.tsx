/**
 * Meritbox Design System - Input Field Molecule
 *
 * Standard text input with label, helper text, and error states
 */

import React from "react";
import { cn } from "../../utils";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  helperText,
  error,
  fullWidth = true,
  className,
  id,
  disabled,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  const displayText = error || helperText;

  return (
    <div className={cn("flex flex-col", fullWidth && "w-full")}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-body-s font-medium text-base-content mb-4"
        >
          {label}
        </label>
      )}

      <input
        {...props}
        id={inputId}
        disabled={disabled}
        className={cn(
          "px-16 py-12 rounded-m border-2 text-body-m",
          "bg-base-100 text-base-content",
          "placeholder:text-base-content placeholder:opacity-40",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          hasError
            ? "border-error focus:ring-error focus:border-error"
            : "border-base-300",
          disabled && "opacity-50 cursor-not-allowed bg-base-200",
          className,
        )}
      />

      {displayText && (
        <span
          className={cn(
            "text-caption mt-4",
            hasError ? "text-error" : "text-base-content opacity-60",
          )}
        >
          {displayText}
        </span>
      )}
    </div>
  );
};
