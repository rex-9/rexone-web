/**
 * Rexone Design System - Input Field Molecule
 *
 * Standard text input with label, helper text, and error states
 */

import React, { useId } from "react";
import { cn } from "../../utils";
import { InputVariant, InputVariants } from "../../constants";

export interface ITextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  variant?: InputVariant;
}

export const TextInput: React.FC<ITextInputProps> = ({
  label,
  helperText,
  error,
  fullWidth = true,
  variant = InputVariants.DEFAULT,
  className,
  id,
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hasError = !!error;
  const displayText = error || helperText;
  const isGlass = variant === InputVariants.GLASS;

  return (
    <div className={cn("flex flex-col", fullWidth && "w-full")}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-body-s font-medium mb-4",
            isGlass ? "text-glow-white" : "text-base-content",
          )}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        id={inputId}
        disabled={disabled}
        className={cn(
          "transition-all duration-200 ease-out focus:outline-none",
          isGlass
            ? "bg-transparent text-white border-0 border-b border-glass-border rounded-none px-0 py-3 text-base font-primary placeholder:text-white/50 focus:border-b-primary focus:ring-0 focus:shadow-[0_1px_0_0_var(--color-primary)]"
            : "px-4 py-3 rounded-md border-2 bg-base-100 text-base-content placeholder:text-base-content placeholder:opacity-40 focus:ring-2 focus:ring-primary focus:border-primary",
          hasError &&
            (isGlass
              ? "border-b-error focus:border-b-error"
              : "border-error focus:ring-error focus:border-error"),
          !hasError && !isGlass && "border-base-300",
          disabled &&
            (isGlass
              ? "opacity-50 cursor-not-allowed"
              : "opacity-50 cursor-not-allowed bg-base-200"),
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
