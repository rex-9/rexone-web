import React from "react";
import { Button } from "../../../design/components/button";
import { cn } from "../../../design/utils";

interface IAdminStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType<{ className?: string }> | React.ReactNode;
  iconClassName?: string;
}

export const AdminState: React.FC<IAdminStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  icon,
  iconClassName,
}) => {
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return (
        <div
          className={cn(
            "mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-base-200 text-primary shadow-sm",
            iconClassName,
          )}
        >
          {icon}
        </div>
      );
    }
    const IconComponent = icon as React.ElementType<{ className?: string }>;
    return (
      <div
        className={cn(
          "mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-base-200 text-primary shadow-sm",
          iconClassName,
        )}
      >
        <IconComponent className="h-6 w-6" />
      </div>
    );
  };

  return (
    <div className="flex min-h-60 w-full flex-col items-center justify-center p-6 text-center">
      {renderIcon()}
      <h2 className="text-heading-s font-display font-semibold text-base-content md:text-heading-m">
        {title}
      </h2>
      {message && (
        <p className="mt-2 max-w-xl text-body-m text-base-content opacity-70">
          {message}
        </p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-4" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
