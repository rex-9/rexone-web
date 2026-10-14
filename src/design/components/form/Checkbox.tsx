import React from "react";
import { cn } from "../../helpers";

export interface ICheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  children?: React.ReactNode;
  containerClassName?: string;
}

export type CheckboxProps = ICheckboxProps;

export const Checkbox: React.FC<CheckboxProps> = ({
  children,
  className,
  containerClassName,
  ...props
}) => {
  const checkboxInput = (
    <input
      {...props}
      type="checkbox"
      className={cn(
        "checkbox checkbox-primary checkbox-sm border-2 border-base-content/60 bg-base-200/60 hover:border-primary focus:border-primary checked:border-primary checked:bg-primary transition-colors disabled:opacity-60",
        className,
      )}
    />
  );

  if (!children && !containerClassName) {
    return checkboxInput;
  }

  return (
    <label
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-xl border border-glass-border bg-glass-card hover:bg-glass-card-hover shadow-glass-card backdrop-blur-md px-3 py-2 text-body-s font-medium text-base-content transition-colors",
        containerClassName,
      )}
    >
      {checkboxInput}
      {children ? <span>{children}</span> : null}
    </label>
  );
};

export default Checkbox;
