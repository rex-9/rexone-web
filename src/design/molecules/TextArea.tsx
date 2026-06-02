/**
 * Meritbox Design System - TextArea Molecule
 *
 * Auto-expanding textarea with same visual language as input fields
 */

import React, { useRef, useEffect } from "react";
import { clsx } from "ts-clsx";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
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
    <div className={clsx("flex flex-col", fullWidth && "w-full")}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-body-s font-medium text-base-content mb-4"
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
        className={clsx(
          "px-16 py-12 rounded-m border text-body-m resize-none",
          "bg-base-100 text-base-content",
          "placeholder:text-base-content placeholder:opacity-40",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          hasError
            ? "border-error focus:ring-error focus:border-error"
            : "border-base-300",
          disabled && "opacity-50 cursor-not-allowed bg-base-200",
          className
        )}
      />

      <div className="flex justify-between items-center mt-4">
        {displayText && (
          <span
            className={clsx(
              "text-caption",
              hasError ? "text-error" : "text-base-content opacity-60"
            )}
          >
            {displayText}
          </span>
        )}

        {showCounter && maxLength && (
          <span
            className={clsx(
              "text-caption ml-auto",
              currentLength > maxLength * 0.9
                ? "text-warning"
                : "text-base-content opacity-50"
            )}
          >
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default TextArea;
