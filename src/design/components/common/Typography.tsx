import React from "react";
import { cn } from "../../utils";

export interface TypographyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "secondary",
  className = "text-base font-normal",
  ...props
}) => {
  const primaryClasses = "text-primary";
  const secondaryClasses = "text-base-content";
  return (
    <p
      {...props}
      className={cn(
        variant === "primary" ? primaryClasses : secondaryClasses,
        className,
      )}
    >
      {children}
    </p>
  );
};
