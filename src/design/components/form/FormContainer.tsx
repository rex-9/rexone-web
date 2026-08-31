import React from "react";
import { cn } from "../../utils";
import { FormVariant, FormVariants } from "../../constants";
import { useTranslate } from "../../../locales";

export interface IFormContainerProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  children: React.ReactNode;
  variant?: FormVariant;
  className?: string;
}

export const FormContainer: React.FC<IFormContainerProps> = ({
  title,
  children,
  variant = FormVariants.DEFAULT,
  className,
  onSubmit,
  ...props
}) => {
  const t = useTranslate();
  const isGlass = variant === FormVariants.GLASS;

  return (
    <form
      {...props}
      onSubmit={onSubmit}
      className={cn(
        "flex flex-col",
        isGlass
          ? "bg-glass-form border border-glass-border backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(107,20,38,0.35)] rounded-[18px] p-6 sm:p-8 w-[440px] max-w-[92vw]"
          : "bg-base-100 p-4 rounded",
        className,
      )}
    >
      {title && (
        <h2
          className={cn(
            "text-2xl mb-4",
            isGlass && "font-display text-center text-[28px] md:text-[34px] text-glow-white mb-6",
          )}
        >
          {t(title)}
        </h2>
      )}
      {children}
    </form>
  );
};
