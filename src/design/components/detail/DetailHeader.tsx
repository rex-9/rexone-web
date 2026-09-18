// src/design/components/detail/DetailHeader.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { iconsLib } from "../../../assets";
import { Button } from "../button";
import { ButtonSizes, ButtonVariants } from "../../constants";
import { Breadcrumbs, type IBreadcrumbItem } from "../common/Breadcrumbs";
import { DateTime, DateTimeFormats } from "../common/DateTime";
import { CopyButton } from "./CopyButton";
import { cn } from "../../helpers";

export interface IDetailHeaderProps {
  breadcrumbs: IBreadcrumbItem[];
  title: React.ReactNode;
  description?: React.ReactNode;
  backTo: string;
  backLabel?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  statusBadge?: React.ReactNode;
  entityId?: string;
  timestamps?: {
    createdAt?: string | Date;
    updatedAt?: string | Date;
  };
  extraMeta?: React.ReactNode;
  className?: string;
}

export const DetailHeader: React.FC<IDetailHeaderProps> = ({
  breadcrumbs,
  title,
  description,
  backTo,
  backLabel,
  action,
  icon: Icon,
  badge,
  statusBadge,
  entityId,
  timestamps,
  extraMeta,
  className,
}) => {
  const navigate = useNavigate();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Top Navigation Row */}
      <div className="flex min-w-0 items-center justify-between gap-3">
        <Breadcrumbs items={breadcrumbs} className="min-w-0 flex-1" />
        <Button
          size={ButtonSizes.SM}
          variant={ButtonVariants.SECONDARY}
          className="shrink-0 gap-1.5"
          onClick={() => navigate(backTo)}
        >
          <iconsLib.arrowLeft className="h-4 w-4" />
          {backLabel ?? "Back"}
        </Button>
      </div>

      {/* Hero Card Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-base-300/90 bg-base-100/90 backdrop-blur-md p-5 sm:p-6 shadow-sm">
        {/* Top Scarlet Neon Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-primary-light to-transparent" />
        <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
            {Icon && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.15)]">
                <Icon className="h-6 w-6" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                {typeof title === "string" ? (
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-base-content truncate">
                    {title}
                  </h1>
                ) : (
                  title
                )}
                {statusBadge}
                {badge}
              </div>

              {description && (
                <div className="mt-1 text-xs sm:text-sm text-base-content/70 max-w-2xl">
                  {description}
                </div>
              )}

              {/* Entity Meta Strip */}
              {(entityId || timestamps || extraMeta) && (
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-base-content/60">
                  {entityId && (
                    <div className="flex items-center gap-1 font-mono rounded-md bg-base-200/80 px-2 py-0.5 border border-base-300/60">
                      <span className="text-[10px] uppercase font-bold text-base-content/40 tracking-wider">
                        ID:
                      </span>
                      <span className="truncate max-w-40 sm:max-w-xs">
                        {entityId}
                      </span>
                      <CopyButton
                        text={entityId}
                        className="h-4 w-4"
                        iconClassName="h-3 w-3"
                      />
                    </div>
                  )}

                  {timestamps?.createdAt && (
                    <div className="flex items-center gap-1">
                      <iconsLib.clock className="h-3.5 w-3.5 text-base-content/40" />
                      <span>
                        Created:{" "}
                        <DateTime
                          value={timestamps.createdAt}
                          format={DateTimeFormats.ADMIN}
                        />
                      </span>
                    </div>
                  )}

                  {timestamps?.updatedAt && (
                    <div className="flex items-center gap-1">
                      <span>
                        Updated:{" "}
                        <DateTime
                          value={timestamps.updatedAt}
                          format={DateTimeFormats.ADMIN}
                        />
                      </span>
                    </div>
                  )}

                  {extraMeta}
                </div>
              )}
            </div>
          </div>

          {action && (
            <div className="flex shrink-0 items-center gap-2.5 self-start sm:self-center flex-wrap">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
