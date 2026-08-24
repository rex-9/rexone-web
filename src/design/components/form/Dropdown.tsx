// src/design/components/form/Dropdown.tsx

import React from "react";
import { cn } from "../../utils";

export interface DropdownProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  values?: string[];
  multiple?: boolean;
  onValueChange?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  values,
  multiple = false,
  onValueChange,
  onValuesChange,
  label,
  error,
  placeholder = "Select an option",
  className,
  disabled,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      onValuesChange?.(
        Array.from(event.target.selectedOptions, (option) => option.value),
      );
      return;
    }

    onValueChange?.(event.target.value);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-body-s font-medium text-base-content/70 mb-1.5">
          {label}
        </label>
      )}
      <select
        {...props}
        multiple={multiple}
        value={multiple ? values : (value ?? "")}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-2.5 text-body-m rounded-md",
          "bg-base-100 text-base-content",
          "border border-base-300",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "hover:border-base-400",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-error focus:ring-error",
          className,
        )}
      >
        {!multiple && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-body-s text-error">{error}</p>}
    </div>
  );
};
