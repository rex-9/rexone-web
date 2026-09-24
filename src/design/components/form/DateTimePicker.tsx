/**
 * RexOne Design System - DateTimePicker Molecule
 *
 * DaisyUI date and time picker supporting datetime-local, date, and time modes
 * with clear button, validation states, and standard labeling.
 */

import React, { useId, useMemo } from "react";
import { iconsLib } from "../../../assets";
import { cn } from "../../helpers";
import { InputVariant, InputVariants } from "../../constants";
import {
  localDateTimeInputToUtcIso,
  utcToLocalDateTimeInput,
  localDateInputToUtcIso,
  utcToLocalDateInput,
  type TDateTimeValue,
} from "../../../helpers/date.helper";

export type DateTimePickerType = "datetime-local" | "date" | "time";

const LOCAL_DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Normalizes an incoming date/time value (Core UTC ISO string, Date, or local string)
 * into the browser local string format required by HTML5 date and time inputs.
 */
export const toBrowserInputValue = (
  value: TDateTimeValue,
  type: DateTimePickerType,
): string => {
  if (!value) return "";
  const str = typeof value === "string" ? value.trim() : "";

  if (type === "datetime-local") {
    if (str && LOCAL_DATETIME_PATTERN.test(str)) return str;
    return utcToLocalDateTimeInput(value);
  }

  if (type === "date") {
    if (str && LOCAL_DATE_PATTERN.test(str)) return str;
    return utcToLocalDateInput(value);
  }

  // type === "time"
  if (typeof value === "string") {
    if (value.includes("T")) {
      const local = utcToLocalDateTimeInput(value);
      return local.slice(11, 16);
    }
    return value;
  }
  return utcToLocalDateTimeInput(value).slice(11, 16);
};

/**
 * Converts a browser native input string (local time) into the Core UTC ISO format.
 */
export const toUtcOutputValue = (
  localValue: string,
  type: DateTimePickerType,
): string => {
  if (!localValue) return "";

  if (type === "datetime-local") {
    return localDateTimeInputToUtcIso(localValue) ?? "";
  }

  if (type === "date") {
    return localDateInputToUtcIso(localValue) ?? "";
  }

  return localValue;
};

export interface IDateTimePickerProps {
  label?: string;
  labelClassName?: string;
  helperText?: string;
  error?: string;
  value?: TDateTimeValue;
  onChange?: (utcValue: string, localValue?: string) => void;
  type?: DateTimePickerType;
  min?: TDateTimeValue;
  max?: TDateTimeValue;
  step?: string | number;
  disabled?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  variant?: InputVariant;
  tooltip?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
}

export const DateTimePicker: React.FC<IDateTimePickerProps> = ({
  label,
  labelClassName,
  helperText,
  error,
  value = "",
  onChange,
  type = "datetime-local",
  min,
  max,
  step,
  disabled = false,
  clearable = true,
  fullWidth = true,
  variant = InputVariants.DEFAULT,
  tooltip,
  placeholder,
  className,
  id,
  required = false,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hasError = !!error;
  const displayText = error || helperText;
  const isGlass = variant === InputVariants.GLASS;

  const browserValue = useMemo(
    () => toBrowserInputValue(value, type),
    [value, type],
  );
  const browserMin = useMemo(
    () => (min ? toBrowserInputValue(min, type) : undefined),
    [min, type],
  );
  const browserMax = useMemo(
    () => (max ? toBrowserInputValue(max, type) : undefined),
    [max, type],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawLocal = e.target.value;
    const utcVal = toUtcOutputValue(rawLocal, type);
    onChange?.(utcVal, rawLocal);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("", "");
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
        <input
          id={inputId}
          type={type}
          value={browserValue}
          onChange={handleChange}
          min={browserMin}
          max={browserMax}
          step={step}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={cn(
            "w-full transition-all duration-200 ease-out focus:outline-none",
            isGlass
              ? "bg-transparent text-base-content border-0 border-b border-glass-border rounded-none px-0 py-2.5 text-base font-primary focus:border-b-primary focus:ring-0 focus:shadow-[0_1px_0_0_var(--color-primary)]"
              : "px-4 py-2.5 rounded-lg border-2 bg-base-100 text-base-content focus:ring-2 focus:ring-primary focus:border-primary",
            clearable && browserValue && !disabled ? "pr-10" : "",
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

        {clearable && browserValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors"
            title="Clear date"
            aria-label="Clear date"
          >
            <iconsLib.close className="h-3.5 w-3.5" />
          </button>
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
