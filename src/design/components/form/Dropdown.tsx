// src/design/components/form/Dropdown.tsx

import React from "react";
import { cn } from "../../helpers";
import { DropdownSizes, type DropdownSize } from "../../constants";

export { DropdownSizes, type DropdownSize };

export interface IDropdownOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
}

interface IDropdownBaseProps {
  options: IDropdownOption[];
  label?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  size?: DropdownSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

type TSingleDropdownProps = IDropdownBaseProps & {
  value: string;
  onValueChange: (value: string) => void;
  multiple?: false;
};

type TMultiDropdownProps = IDropdownBaseProps & {
  value: string[];
  onValueChange: (value: string[]) => void;
  multiple: true;
};

export type IDropdownProps = TSingleDropdownProps | TMultiDropdownProps;

const sizeClasses: Record<DropdownSize, string> = {
  sm: "select-sm text-body-s h-9 min-h-9 px-3 py-1",
  md: "select-md text-body-m h-10 min-h-10 px-4 py-2",
  lg: "select-lg text-body-l h-12 min-h-12 px-4 py-2.5",
};

export const Dropdown: React.FC<IDropdownProps> = ({
  options,
  value,
  onValueChange,
  label,
  error,
  placeholder,
  className,
  containerClassName,
  disabled,
  size = DropdownSizes.MD,
  icon,
  fullWidth = true,
  multiple = false,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      (onValueChange as (value: string[]) => void)(
        Array.from(event.target.selectedOptions, (option) => option.value),
      );
      return;
    }

    (onValueChange as (value: string) => void)(event.target.value);
  };

  const hasEmptyOption = options.some((opt) => opt.value === "");

  // Group options if any option specifies a group
  const hasGroups = options.some((opt) => !!opt.group);
  const groupedOptions = React.useMemo(() => {
    if (!hasGroups) return null;
    const groups = new Map<string, IDropdownOption[]>();
    options.forEach((opt) => {
      const g = opt.group || "";
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(opt);
    });
    return Array.from(groups.entries());
  }, [options, hasGroups]);

  return (
    <div className={cn(fullWidth ? "w-full" : "w-auto", containerClassName)}>
      {label && (
        <label className="block text-body-s font-medium text-base-content/70 mb-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="pointer-events-none absolute left-3 z-10 flex items-center text-base-content/50">
            {icon}
          </div>
        )}
        <select
          {...props}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          multiple={multiple}
          className={cn(
            "select select-bordered w-full rounded-md font-medium",
            "bg-base-100 text-base-content",
            "border border-base-300",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "transition-colors duration-150",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            sizeClasses[size],
            icon && "pl-9",
            error && "border-error focus:ring-error/20 focus:border-error",
            className,
          )}
        >
          {placeholder && !hasEmptyOption && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {groupedOptions
            ? groupedOptions.map(([groupName, groupOpts]) =>
                groupName ? (
                  <optgroup key={groupName} label={groupName}>
                    {groupOpts.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ) : (
                  groupOpts.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                    >
                      {opt.label}
                    </option>
                  ))
                ),
              )
            : options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
        </select>
      </div>
      {error && <p className="mt-1 text-body-s text-error">{error}</p>}
    </div>
  );
};

export default Dropdown;
