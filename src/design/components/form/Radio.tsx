import React from "react";
import { cn } from "../../utils";

export interface IRadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  children: React.ReactNode;
  containerClassName?: string;
}

export type RadioProps = IRadioProps;

export const Radio: React.FC<RadioProps> = ({
  children,
  className,
  containerClassName,
  ...props
}) => (
  <label
    className={cn(
      "flex items-center gap-8 rounded-md border border-base-300 px-12 text-body-s font-medium text-base-content",
      containerClassName,
    )}
  >
    <input
      {...props}
      type="radio"
      className={cn(
        "radio radio-sm border-base-content/40 checked:border-primary checked:bg-primary",
        className,
      )}
    />
    <span>{children}</span>
  </label>
);
