/**
 * Meritbox Design System - Button Molecule
 *
 * Primary, Secondary, and Tertiary/Ghost button variants
 * Soft, calm, self-reflective, and addictive
 */

import React from "react";
import { clsx } from "ts-clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  disabled = false,
  className,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 ease-out rounded-m focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-400";

  const variantClasses = {
    primary: clsx(
      "bg-primary text-primary-content shadow-glow",
      !disabled && "hover:bg-primary-focus hover:shadow-glow",
      !disabled &&
        "active:bg-primary-focus active:shadow-[inset_0px_2px_4px_rgba(0,0,0,0.1)] active:scale-[0.98]",
      disabled && "opacity-25 cursor-not-allowed"
    ),
    secondary: clsx(
      "border-[1.5px] border-primary text-primary bg-transparent",
      !disabled && "hover:bg-primary hover:bg-opacity-10",
      !disabled && "active:bg-primary active:bg-opacity-20 active:scale-[0.98]",
      disabled && "opacity-30 cursor-not-allowed"
    ),
    tertiary: clsx(
      "text-base-content bg-transparent",
      !disabled && "hover:bg-base-200",
      !disabled && "active:bg-base-300 active:scale-[0.98]",
      disabled && "opacity-30 cursor-not-allowed"
    ),
  };

  const sizeClasses = {
    sm: "px-12 py-8 text-body-s",
    md: "px-16 py-12 text-body-m",
    lg: "px-20 py-16 text-body-l",
  };

  const widthClass = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClass,
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
