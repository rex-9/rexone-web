import React from "react";
import { cn } from "../../helpers";
import { TypographyVariant, TypographyVariants } from "../../constants";

export interface ITypographyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
  variant?: TypographyVariant;
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
        variant === TypographyVariants.PRIMARY
          ? primaryClasses
          : secondaryClasses,
        className,
      )}
    >
      {children}
    </p>
  );
};
