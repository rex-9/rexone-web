// src/modules/admin/components/AdminKpiCard.tsx
import React from "react";
import { cn } from "../../../design/helpers";

export interface IAdminKpiCardProps {
  title: string;
  value: React.ReactNode;
  deltaPct?: number;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  extra?: React.ReactNode;
  iconClassName?: string;
  className?: string;
  onClick?: () => void;
}

export const AdminKpiCard: React.FC<IAdminKpiCardProps> = ({
  title,
  value,
  deltaPct,
  icon: Icon,
  subtitle,
  badge,
  extra,
  iconClassName,
  className,
  onClick,
}) => {
  const isPositive = typeof deltaPct === "number" && deltaPct > 0;
  const isNegative = typeof deltaPct === "number" && deltaPct < 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-glass-border bg-glass-card p-4 backdrop-blur-md shadow-glass-card transition-all duration-300 hover:border-glass-border-hover hover:bg-glass-card-hover md:p-5",
        onClick && "cursor-pointer hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-body-s font-medium text-base-content opacity-70">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge}
          {Icon && (
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl bg-glass-card border border-glass-border text-primary shadow-glass-card backdrop-blur-md",
                iconClassName,
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-heading-m font-bold text-base-content tracking-tight">
          {value}
        </div>

        {typeof deltaPct === "number" && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-0.5 text-caption font-semibold",
              isPositive
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : isNegative
                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                  : "bg-glass-card border border-glass-border text-base-content/70",
            )}
          >
            <span>
              {isPositive ? "+" : ""}
              {deltaPct}%
            </span>
          </div>
        )}
      </div>

      {extra && <div className="mt-2">{extra}</div>}

      {subtitle && (
        <div className="mt-1 text-caption text-base-content opacity-60">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default AdminKpiCard;
