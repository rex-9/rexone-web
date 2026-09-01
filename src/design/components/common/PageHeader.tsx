// src/design/components/common/PageHeader.tsx
import React from "react";
import { cn } from "../../helpers";

export interface IPageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<IPageHeaderProps> = ({
  title,
  description,
  action,
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          {typeof title === "string" ? (
            <h1 className="text-title-1 font-bold tracking-tight text-base-content">
              {title}
            </h1>
          ) : (
            title
          )}
          {description && (
            <div className="mt-1 max-w-3xl text-body-m text-base-content opacity-70">
              {description}
            </div>
          )}
        </div>
        {action && (
          <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
            {action}
          </div>
        )}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};
