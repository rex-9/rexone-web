import React from "react";

export interface DropdownPickerProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const DropdownPicker: React.FC<DropdownPickerProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <select
      onChange={handleChange}
      value={value}
      className={`p-2 rounded-lg border border-base-300 bg-base-100 text-base-content ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default DropdownPicker;
