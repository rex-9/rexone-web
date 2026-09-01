// src/design/components/form/Toggle.tsx
// TODO: UI bug
import React from "react";
import { cn } from "../../helpers";

export interface IToggleProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: "left" | "right";
  size?: "sm" | "md" | "lg";
}

export function Toggle({
  checked,
  onCheckedChange,
  label,
  labelPosition = "right",
  size = "md",
  disabled,
  className,
  ...props
}: IToggleProps) {
  const sizes = {
    sm: {
      track: "w-12 h-5",
      thumb: "w-4 h-4",
      on: "translate-x-7",
    },
    md: {
      track: "w-16 h-6",
      thumb: "w-5 h-5",
      on: "translate-x-10",
    },
    lg: {
      track: "w-20 h-8",
      thumb: "w-7 h-7",
      on: "translate-x-12",
    },
  } as const;

  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex items-center rounded-full transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100",
        checked ? "bg-primary" : "bg-base-300",
        disabled && "cursor-not-allowed opacity-50",
        sizes[size].track,
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute left-1 rounded-full bg-base-100 shadow-sm transition-transform duration-200",
          sizes[size].thumb,
          checked ? sizes[size].on : "translate-x-0",
        )}
      />
    </button>
  );

  if (!label) return toggle;

  return (
    <label
      className={cn(
        "inline-flex items-center gap-3",
        labelPosition === "left" && "flex-row-reverse",
      )}
    >
      {toggle}
      <span className="text-body-m text-base-content/80">{label}</span>
    </label>
  );
}
