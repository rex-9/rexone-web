/**
 * RexOne Design System - NumberInput Molecule
 *
 * Validated numeric input component that prevents redundant leading zeroes
 * (e.g. typing "05" normalizes to "5"), enforces min/max boundaries,
 * supports decimals and optional prefix/suffix add-ons.
 */

import React, { useId, useState, useEffect } from "react";
import { iconsLib } from "../../../assets";
import { cn } from "../../helpers";
import { InputVariant, InputVariants } from "../../constants";

export interface INumberInputProps {
  label?: string;
  labelClassName?: string;
  helperText?: string;
  error?: string;
  value?: number | string;
  onChange?: (value: number | undefined, rawString: string) => void;
  min?: number;
  max?: number;
  step?: number;
  allowDecimals?: boolean;
  allowNegative?: boolean;
  placeholder?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: InputVariant;
  tooltip?: string;
  className?: string;
  id?: string;
  showSteppers?: boolean;
  required?: boolean;
}

/**
 * Sanitizes numeric string by eliminating invalid leading zeros.
 * Examples:
 *   "05" -> "5"
 *   "00" -> "0"
 *   "0.5" -> "0.5" (preserved when allowDecimals=true)
 *   "-05" -> "-5"
 */
export const sanitizeNumericInput = (
  raw: string,
  allowDecimals = true,
  allowNegative = false,
): string => {
  if (!raw) return "";

  let cleaned = raw.trim();

  // Handle negative sign
  const isNegative = allowNegative && cleaned.startsWith("-");
  if (isNegative) {
    cleaned = cleaned.slice(1);
  }

  // Remove all non-numeric characters (except single decimal point if allowed)
  if (allowDecimals) {
    const parts = cleaned.split(".");
    const integerPart = parts[0].replace(/\D/g, "");
    if (parts.length > 1) {
      const decimalPart = parts.slice(1).join("").replace(/\D/g, "");
      cleaned = `${integerPart}.${decimalPart}`;
    } else {
      cleaned = integerPart;
    }
  } else {
    cleaned = cleaned.replace(/\D/g, "");
  }

  // Strip leading zeroes from integer portion: e.g. "05" -> "5", "00" -> "0", ".5" -> "0.5"
  if (cleaned.startsWith(".")) {
    cleaned = `0${cleaned}`;
  } else if (cleaned.startsWith("0") && cleaned.length > 1 && !cleaned.startsWith("0.")) {
    cleaned = cleaned.replace(/^0+/, "");
    if (cleaned === "" || cleaned.startsWith(".")) {
      cleaned = `0${cleaned}`;
    }
  }

  return isNegative && cleaned ? `-${cleaned}` : cleaned;
};

export const NumberInput: React.FC<INumberInputProps> = ({
  label,
  labelClassName,
  helperText,
  error,
  value,
  onChange,
  min,
  max,
  step = 1,
  allowDecimals = true,
  allowNegative = false,
  placeholder = "0",
  prefix,
  suffix,
  disabled = false,
  fullWidth = true,
  variant = InputVariants.DEFAULT,
  tooltip,
  className,
  id,
  showSteppers = false,
  required = false,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hasError = !!error;
  const displayText = error || helperText;
  const isGlass = variant === InputVariants.GLASS;

  const [rawInput, setRawInput] = useState<string>(
    value !== undefined && value !== null ? String(value) : "",
  );

  useEffect(() => {
    const formatted = value !== undefined && value !== null ? String(value) : "";
    setRawInput(formatted);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNumericInput(
      e.target.value,
      allowDecimals,
      allowNegative,
    );
    setRawInput(sanitized);

    if (sanitized === "" || sanitized === "-") {
      onChange?.(undefined, sanitized);
      return;
    }

    const parsed = allowDecimals ? parseFloat(sanitized) : parseInt(sanitized, 10);
    if (!Number.isNaN(parsed)) {
      onChange?.(parsed, sanitized);
    }
  };

  const handleBlur = () => {
    if (!rawInput) return;

    let parsed = allowDecimals ? parseFloat(rawInput) : parseInt(rawInput, 10);
    if (Number.isNaN(parsed)) {
      setRawInput("");
      onChange?.(undefined, "");
      return;
    }

    if (min !== undefined && parsed < min) {
      parsed = min;
    }
    if (max !== undefined && parsed > max) {
      parsed = max;
    }

    const normalized = String(parsed);
    setRawInput(normalized);
    onChange?.(parsed, normalized);
  };

  const handleStep = (direction: 1 | -1) => {
    if (disabled) return;
    const current = parseFloat(rawInput || "0") || 0;
    let next = current + direction * step;

    if (min !== undefined && next < min) next = min;
    if (max !== undefined && next > max) next = max;

    if (!allowDecimals) next = Math.round(next);

    const normalized = String(next);
    setRawInput(normalized);
    onChange?.(next, normalized);
  };

  return (
    <div className={cn("flex flex-col", fullWidth && "w-full")}>
      {label && (
        <div className="flex items-center gap-1.5 mb-1">
          <label
            htmlFor={inputId}
            className={cn(
              "text-body-s font-medium text-base-content",
              labelClassName,
            )}
          >
            {label}
          </label>
          {tooltip && (
            <div
              className="tooltip tooltip-top flex items-center text-base-content/50 hover:text-base-content transition-colors cursor-help"
              data-tip={tooltip}
            >
              <iconsLib.info className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      )}

      <div className="relative flex items-center w-full">
        {prefix && (
          <span className="absolute left-3 flex items-center text-base-content/60 pointer-events-none text-sm font-medium z-10">
            {prefix}
          </span>
        )}

        <input
          id={inputId}
          type="text"
          inputMode={allowDecimals ? "decimal" : "numeric"}
          value={rawInput}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full transition-all duration-200 ease-out focus:outline-none font-mono",
            isGlass
              ? "bg-transparent text-base-content border-0 border-b border-glass-border rounded-none px-0 py-2.5 text-base font-primary focus:border-b-primary focus:ring-0 focus:shadow-[0_1px_0_0_var(--color-primary)]"
              : "px-4 py-2.5 rounded-lg border-2 bg-base-100 text-base-content placeholder:text-base-content/40 focus:ring-2 focus:ring-primary focus:border-primary",
            prefix ? "pl-8" : "",
            suffix || showSteppers ? "pr-14" : "",
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

        {suffix && (
          <span className="absolute right-3 flex items-center text-base-content/60 pointer-events-none text-sm font-medium">
            {suffix}
          </span>
        )}

        {showSteppers && !disabled && (
          <div className="absolute right-1 flex flex-col border-l border-base-300 h-8 justify-center">
            <button
              type="button"
              onClick={() => handleStep(1)}
              className="px-2 hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors flex items-center justify-center text-xs"
              tabIndex={-1}
            >
              <iconsLib.chevronUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => handleStep(-1)}
              className="px-2 hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors flex items-center justify-center text-xs"
              tabIndex={-1}
            >
              <iconsLib.chevronDown className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {displayText && (
        <span
          className={cn(
            "text-caption mt-1.5 transition-colors duration-200",
            hasError ? "text-error" : "text-base-content/60",
          )}
        >
          {displayText}
        </span>
      )}
    </div>
  );
};
