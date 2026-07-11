import React from "react";
import { clsx } from "ts-clsx";

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
      className={clsx(
        variant === "primary" ? primaryClasses : secondaryClasses,
        className,
      )}
    >
      {children}
    </p>
  );
};

export default Typography;
