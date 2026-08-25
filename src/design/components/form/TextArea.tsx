/**
 * Rexone Design System - TextArea Molecule
 *
 * Auto-expanding textarea with same visual language as input fields
 */

import React, { useId, useRef, useEffect } from "react";
import { cn } from "../../utils";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  autoExpand?: boolean;
  maxLength?: number;
  showCounter?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  helperText,
  error,
  fullWidth = true,
  autoExpand = true,
  maxLength,
  showCounter = false,
  className,
  id,
  value,
  disabled,
  rows = 3,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const generatedId = useId();
  const inputId = id || generatedId;
  const hasError = !!error;
  const displayText = error || helperText;
  const currentLength = typeof value === "string" ? value.length : 0;

  useEffect(() => {
    if (autoExpand && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoExpand]);

  return (
    <div className={cn("flex flex-col gap-1", fullWidth && "w-full")}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-base-content"
        >
          {label}
        </label>
      )}

      <textarea
        {...props}
        ref={textareaRef}
        id={inputId}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        rows={rows}
        className={cn(
          "w-full rounded-md border px-3 py-2 text-base bg-base-100 text-base-content",
          "placeholder:text-base-content/40",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-base-200",
          hasError
            ? "border-error focus:ring-error"
            : "border-base-300 hover:border-base-400",
          className,
        )}
      />

      <div className="flex justify-between items-center gap-2">
        {displayText && (
          <span
            className={cn(
              "text-xs",
              hasError ? "text-error" : "text-base-content/60",
            )}
          >
            {displayText}
          </span>
        )}

        {showCounter && maxLength && (
          <span
            className={cn(
              "text-xs ml-auto",
              currentLength > maxLength * 0.9
                ? "text-warning"
                : "text-base-content/50",
            )}
          >
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
