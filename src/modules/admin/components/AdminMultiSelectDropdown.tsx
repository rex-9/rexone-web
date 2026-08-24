import React from "react";
import { Dropdown } from "../../../design/components/form";

interface IAdminMultiSelectDropdownProps {
  options: Array<{ value: string; label: string }>;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const AdminMultiSelectDropdown: React.FC<
  IAdminMultiSelectDropdownProps
> = ({
  options,
  selectedValues,
  onChange,
  label,
  placeholder = "Select options",
  className,
  disabled,
}) => (
  <Dropdown
    multiple
    options={options}
    values={selectedValues}
    onValuesChange={onChange}
    label={label}
    placeholder={placeholder}
    className={className}
    disabled={disabled}
  />
);
