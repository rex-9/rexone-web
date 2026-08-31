import React from "react";
import { cn } from "../../utils";
import { TypographyVariant, TypographyVariants } from "../../constants";

export interface ITypographyProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
  variant?: TypographyVariant | "primary" | "secondary";
}

export const Typography: React.FC<ITypographyProps> = ({
  children,
  variant = TypographyVariants.BODY_M,
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
