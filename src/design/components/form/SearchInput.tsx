// src/design/components/form/SearchInput.tsx
import React, { useId } from "react";
import { iconsLib } from "../../../assets";
import { cn } from "../../helpers";

export interface ISearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  onClear?: () => void;
  fullWidth?: boolean;
  searchableKeys?: string[];
  tooltip?: string;
  tooltipLabel?: string;
}

export const SearchInput: React.FC<ISearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  fullWidth = true,
  className,
  id,
  disabled,
  searchableKeys,
  tooltip,
  tooltipLabel,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hasValue = Boolean(value && String(value).length > 0);

  const keysText =
    searchableKeys && searchableKeys.length > 0
      ? searchableKeys.join(", ")
      : "";
  const effectiveTooltip =
    tooltip ||
    (keysText ? `${tooltipLabel || "Search by"}: ${keysText}` : undefined);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      const syntheticEvent = {
        target: { value: "" },
        currentTarget: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center",
        fullWidth ? "w-full" : "w-auto",
        className,
      )}
    >
      <div
        className={cn(
          "absolute left-3 flex items-center text-base-content/50 z-10",
          effectiveTooltip
            ? "tooltip tooltip-bottom sm:tooltip-right cursor-help pointer-events-auto"
            : "pointer-events-none",
        )}
        data-tip={effectiveTooltip}
      >
        <iconsLib.search className="h-4 w-4" />
      </div>

      <input
        {...props}
        id={inputId}
        type="search"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-md border-2 border-base-300 bg-base-100 py-2.5 pl-9 text-body-m text-base-content",
          effectiveTooltip && hasValue
            ? "pr-14"
            : effectiveTooltip || hasValue
              ? "pr-8"
              : "pr-4",
          "placeholder:text-base-content/40 transition-all duration-200 ease-out",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          disabled && "cursor-not-allowed bg-base-200 opacity-50",
        )}
      />

      {effectiveTooltip && (
        <div
          className={cn(
            "absolute flex items-center text-base-content/40 hover:text-base-content transition-colors z-10",
            hasValue && !disabled ? "right-8" : "right-2.5",
          )}
        >
          <div
            className="tooltip tooltip-top flex items-center"
            data-tip={effectiveTooltip}
          >
            <iconsLib.info className="h-4 w-4 cursor-help" />
          </div>
        </div>
      )}

      {hasValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 z-10 flex h-5 w-5 items-center justify-center rounded-full text-base-content/40 hover:bg-base-300 hover:text-base-content transition-colors"
          aria-label="Clear search"
          title="Clear"
        >
          <iconsLib.close className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
