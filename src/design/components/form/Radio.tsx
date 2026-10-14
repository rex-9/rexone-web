import React from "react";
import { cn } from "../../helpers";

export interface IRadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  children: React.ReactNode;
  containerClassName?: string;
}

export type RadioProps = IRadioProps;

export const Radio: React.FC<RadioProps> = ({
  children,
  className,
  containerClassName,
  ...props
}) => {
  const radioInput = (
    <input
      {...props}
      type="radio"
      className={cn(
        "radio radio-primary radio-sm border-2 border-base-content/60 bg-base-200/60 hover:border-primary focus:border-primary checked:border-primary checked:bg-primary transition-colors disabled:opacity-60",
        className,
      )}
    />
  );

  if (!children && !containerClassName) {
    return radioInput;
  }

  return (
    <label
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-xl border border-glass-border bg-glass-card hover:bg-glass-card-hover shadow-glass-card backdrop-blur-md px-3 py-2 text-body-s font-medium text-base-content transition-colors",
        containerClassName,
      )}
    >
      {radioInput}
      {children ? <span>{children}</span> : null}
    </label>
  );
};
