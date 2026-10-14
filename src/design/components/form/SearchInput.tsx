// src/design/components/form/SearchInput.tsx
import React, { useId, useState } from "react";
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
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
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
      {effectiveTooltip && isTooltipOpen && (
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-0 z-30 mb-1.5 max-w-sm sm:max-w-md animate-in fade-in slide-in-from-bottom-1 duration-150"
        >
          <div className="flex items-center gap-1.5 rounded-lg border border-glass-border bg-base-300/95 px-2.5 py-1 text-xs text-base-content shadow-lg backdrop-blur-md">
            <iconsLib.info className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="font-medium leading-tight">{effectiveTooltip}</span>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute left-3 z-10 flex items-center text-base-content/50">
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
          "w-full rounded-xl border border-glass-border bg-glass-card shadow-glass-card backdrop-blur-md py-2.5 pl-9 text-body-m text-base-content hover:border-glass-border-hover",
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
          effectiveTooltip && hasValue
            ? "pr-16"
            : effectiveTooltip || hasValue
              ? "pr-9"
              : "pr-4",
          "placeholder:text-base-content/40 transition-all duration-200 ease-out",
          "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
          disabled && "cursor-not-allowed bg-glass-card-hover opacity-40",
        )}
      />

      {(effectiveTooltip || (hasValue && !disabled)) && (
        <div className="absolute right-2.5 z-10 flex items-center gap-1.5">
          {hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-5 w-5 items-center justify-center rounded-full text-base-content/40 hover:bg-glass-card-hover hover:text-base-content transition-colors"
              aria-label="Clear search"
              title="Clear"
            >
              <iconsLib.close className="h-3.5 w-3.5" />
            </button>
          )}

          {effectiveTooltip && (
            <button
              type="button"
              onClick={() => setIsTooltipOpen((prev) => !prev)}
              onMouseEnter={() => setIsTooltipOpen(true)}
              onMouseLeave={() => setIsTooltipOpen(false)}
              onFocus={() => setIsTooltipOpen(true)}
              onBlur={() => setIsTooltipOpen(false)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-base-content/40 hover:text-base-content transition-colors cursor-help focus:outline-none focus:text-base-content"
              aria-label={effectiveTooltip}
            >
              <iconsLib.info className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
