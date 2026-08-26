import React from "react";
import { cn } from "../../utils";

export interface FormContainerProps {
  title?: string;
  children: React.ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  className?: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  title,
  children,
  onSubmit,
  className,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "w-full",
        className,
      )}
    >
      {title && <h2 className="mb-4 text-2xl">{title}</h2>}
      {children}
    </form>
  );
};
