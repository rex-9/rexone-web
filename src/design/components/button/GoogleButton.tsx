// src/design/components/button/GoogleButton.tsx

import React from "react";
import { cn } from "../../utils";
import { icons } from "../../../assets";
import { Image } from "..";

export interface IGoogleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const GoogleButton: React.FC<IGoogleButtonProps> = ({
  isLoading = false,
  fullWidth = true,
  disabled,
  className,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        "px-4 py-2.5 rounded-md",
        "font-medium text-body-m transition-all duration-200 ease-out",
        "bg-base-200 text-base-content border-2 border-base-300",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40",
        "flex items-center justify-center gap-3",
        "hover:bg-base-300 active:scale-[0.98]",
        (isLoading || disabled) && "opacity-50 cursor-not-allowed",
        fullWidth && "w-full",
        className,
      )}
    >
      <Image asset={icons.google} className="w-6 h-6 object-contain" />
      <span>{isLoading ? "Signing in..." : children}</span>
    </button>
  );
};
