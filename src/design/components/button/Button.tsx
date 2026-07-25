// src/design/components/button/Button.tsx

import React from "react";
import { cn } from "../../utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className,
  children,
  ...props
}) => {
  const variants = {
    primary: "bg-gold-500 text-navy-900 hover:bg-gold-600 active:bg-gold-700",
    secondary:
      "border-2 border-gold-500 text-gold-500 hover:bg-gold-500/10 active:bg-gold-500/20",
    tertiary: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-body-s",
    md: "px-4 py-2.5 text-body-m",
    lg: "px-6 py-3.5 text-body-l",
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap",
        "font-medium transition-all duration-200 ease-out",
        "rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-400",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        (disabled || isLoading) && "opacity-50 cursor-not-allowed",
        isLoading && "cursor-wait",
        className,
      )}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        children
      )}
    </button>
  );
};
