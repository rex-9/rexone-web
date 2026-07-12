// src/design/components/button/Button.tsx

/**
 * Meritbox Design System - Button
 *
 * Primary, Secondary, and Tertiary button variants
 */

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
  const baseStyles = `
    inline-flex items-center justify-center whitespace-nowrap
    font-medium transition-all duration-200 ease-out
    rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-400
  `;

  const variants = {
    primary: cn(
      "bg-gold-500 text-navy-900 shadow-glow",
      "hover:bg-gold-600 hover:shadow-glow",
      "active:bg-gold-700 active:scale-[0.98]",
      disabled && "opacity-25 cursor-not-allowed",
    ),
    secondary: cn(
      "border-2 border-gold-500 text-gold-500 bg-transparent",
      "hover:bg-gold-500 hover:bg-opacity-10",
      "active:bg-gold-500 active:bg-opacity-20 active:scale-[0.98]",
      disabled && "opacity-30 cursor-not-allowed",
    ),
    tertiary: cn(
      "text-gray-700 dark:text-gray-300 bg-transparent",
      "hover:bg-gray-100 dark:hover:bg-gray-800",
      "active:bg-gray-200 dark:active:bg-gray-700 active:scale-[0.98]",
      disabled && "opacity-30 cursor-not-allowed",
    ),
  };

  const sizes = {
    sm: "px-3 py-1.5 text-body-s",
    md: "px-4 py-2.5 text-body-m",
    lg: "px-6 py-3.5 text-body-l",
  };

  const width = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        width,
        isLoading && "cursor-wait",
        className,
      )}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};
