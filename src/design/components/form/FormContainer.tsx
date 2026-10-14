import React from "react";
import { useTranslate } from "../../../locales";
import { cn } from "../../helpers";
import { FormVariant, FormVariants } from "../../constants";

export interface IFormContainerProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  children: React.ReactNode;
  variant?: FormVariant;
  className?: string;
}

export const FormContainer = React.forwardRef<
  HTMLFormElement,
  IFormContainerProps
>(
  (
    {
      title,
      children,
      variant = FormVariants.DEFAULT,
      className,
      onSubmit,
      ...props
    },
    ref,
  ) => {
    const t = useTranslate();
    const isGlass = variant === FormVariants.GLASS;

    return (
      <form
        {...props}
        ref={ref}
        onSubmit={onSubmit}
        className={cn(
          "flex flex-col",
          isGlass &&
            "bg-glass-card border border-glass-border backdrop-blur-xl shadow-glass-card rounded-2xl p-6 sm:p-8 w-full max-w-md",
          className,
        )}
      >
        {title && (
          <h2
            className={cn(
              "text-2xl mb-4",
              isGlass &&
                "font-display text-center text-2xl md:text-3xl text-glow-white mb-6",
            )}
          >
            {t(title)}
          </h2>
        )}
        {children}
      </form>
    );
  },
);

FormContainer.displayName = "FormContainer";
