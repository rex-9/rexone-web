// src/design/components/detail/DetailSection.tsx
import React from "react";
import { cn } from "../../helpers";

export interface IDetailSectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  accent?: boolean;
}

export const DetailSection: React.FC<IDetailSectionProps> = ({
  title,
  description,
  icon: Icon,
  badge,
  actions,
  children,
  className,
  contentClassName,
  accent = false,
}) => (
  <section
    className={cn(
      "relative overflow-hidden rounded-2xl border border-base-300/80 bg-base-100/90 backdrop-blur-md shadow-xs transition-all duration-200 hover:border-primary",
      className,
    )}
  >
    {accent && (
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary via-primary-light to-transparent" />
    )}

    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-base-200/90 px-5 py-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary shadow-xs">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold tracking-tight text-base-content truncate">
              {title}
            </h2>
            {badge}
          </div>
          {description && (
            <p className="mt-0.5 text-xs text-base-content/65 truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </header>

    <div className={cn("p-5 sm:p-6", contentClassName)}>{children}</div>
  </section>
);
