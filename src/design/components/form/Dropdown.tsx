// src/design/components/form/Dropdown.tsx

import React from "react";
import { cn } from "../../utils";

interface IDropdownCommonProps {
  options: Array<{ value: string; label: string }>;
  label?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

interface IDropdownSingleProps extends IDropdownCommonProps {
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface IDropdownMultipleProps extends IDropdownCommonProps {
  multiple: true;
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export type DropdownProps = IDropdownSingleProps | IDropdownMultipleProps;

export const Dropdown: React.FC<DropdownProps> = (props) => {
  const {
    options,
    label,
    error,
    placeholder = "Select an option",
    className,
    disabled,
  } = props;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (props.multiple) {
      props.onValueChange?.(
        Array.from(event.target.selectedOptions, (option) => option.value),
      );
      return;
    }

    props.onValueChange?.(event.target.value);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-body-s font-medium text-base-content/70 mb-1.5">
          {label}
        </label>
      )}
      <select
        multiple={props.multiple ?? false}
        value={props.value ?? (props.multiple ? [] : "")}
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
        {!props.multiple && (
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
