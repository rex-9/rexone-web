// src/design/components/button/Button.tsx

import React from "react";
import { cn } from "../../helpers";
import {
  ButtonVariant,
  ButtonVariants,
  ComponentSize,
  ComponentSizes,
} from "../../constants";

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ComponentSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<IButtonProps> = ({
  variant = ButtonVariants.PRIMARY,
  size = ComponentSizes.MD,
  fullWidth = false,
  isLoading = false,
  disabled = false,
  type = "button",
  href,
  target,
  rel,
  className,
  children,
  ...props
}) => {
  const isGlass = variant === ButtonVariants.GLASS && !disabled && !isLoading;

  const variants: Record<ButtonVariant, string> = {
    // Primary: Normal state has border with emerald text -> Hover turns solid emerald with bright box shadow
    [ButtonVariants.PRIMARY]:
      "border border-glass-border bg-glass-tag-bg text-primary font-bold tracking-wider hover:bg-primary hover:text-primary-content hover:border-primary hover:shadow-neon-lg active:scale-95 transition-all duration-300",

    // Glass: Frosted emerald glass card button matching the card styling
    [ButtonVariants.GLASS]:
      "relative overflow-hidden border border-glass-border bg-glass-card backdrop-blur-md text-glow-white font-bold tracking-wider [text-shadow:0_0_6px_var(--color-glow-white),0_0_12px_var(--color-primary),0_0_20px_var(--color-primary-dark)] hover:bg-primary hover:text-primary-content hover:border-primary hover:shadow-neon-lg hover:[text-shadow:0_0_8px_var(--color-glow-white),0_0_16px_var(--color-primary)] active:scale-95 transition-all duration-400",

    // Secondary: Outlined emerald button
    [ButtonVariants.SECONDARY]:
      "border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20 transition-all duration-300",

    // Flat: Borderless subtle button with transparent background
    [ButtonVariants.FLAT]:
      "bg-transparent text-base-content/80 hover:text-base-content hover:bg-glass-card/50 active:bg-glass-card transition-all duration-200",
  };

  const sizes: Partial<Record<ComponentSize, string>> = {
    [ComponentSizes.XS]: "px-2 py-1 text-caption",
    [ComponentSizes.SM]: "px-3 py-1 text-body-s",
    [ComponentSizes.MD]: "px-4 py-2 text-body-m",
    [ComponentSizes.LG]: "px-6 py-3 text-body-l",
    [ComponentSizes.XL]: "px-8 py-4 text-body-l font-bold",
  };

  const buttonClasses = cn(
    "inline-flex items-center justify-center whitespace-nowrap select-none",
    "font-medium transition-all duration-200 ease-out",
    "rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40",
    variants[variant],
    sizes[size] || sizes[ComponentSizes.MD],
    fullWidth && "w-full",
    (disabled || isLoading) && "opacity-40 cursor-not-allowed pointer-events-none",
    isLoading && "cursor-wait",
    className,
  );

  const glassBorders = isGlass && (
    <>
      <span className="absolute top-0 -left-full w-full h-px bg-linear-to-r from-transparent to-primary animate-neon-border-1" />
      <span className="absolute -top-full right-0 w-px h-full bg-linear-to-b from-transparent to-primary animate-neon-border-2" />
      <span className="absolute bottom-0 -right-full w-full h-px bg-linear-to-l from-transparent to-primary animate-neon-border-3" />
      <span className="absolute -bottom-full left-0 w-px h-full bg-linear-to-t from-transparent to-primary animate-neon-border-4" />
    </>
  );

  const innerContent = isLoading ? (
    <span className="loading loading-spinner loading-sm" />
  ) : (
    children
  );

  if (href) {
    const isBlank = target === "_blank";
    return (
      <a
        href={href}
        target={target}
        rel={rel || (isBlank ? "noopener noreferrer" : undefined)}
        className={buttonClasses}
        onClick={
          props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>
        }
      >
        {glassBorders}
        {innerContent}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      {...props}
      className={buttonClasses}
    >
      {glassBorders}
      {innerContent}
    </button>
  );
};
