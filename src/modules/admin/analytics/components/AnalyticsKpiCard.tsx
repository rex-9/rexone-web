// src/modules/admin/analytics/components/AnalyticsKpiCard.tsx
import React from "react";
import { cn } from "../../../../design/helpers";

interface IAnalyticsKpiCardProps {
  title: string;
  value: string | number;
  deltaPct?: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subtitle?: string;
  iconClassName?: string;
}

export const AnalyticsKpiCard: React.FC<IAnalyticsKpiCardProps> = ({
  title,
  value,
  deltaPct,
  icon: Icon,
  subtitle,
  iconClassName,
}) => {
  const isPositive = typeof deltaPct === "number" && deltaPct > 0;
  const isNegative = typeof deltaPct === "number" && deltaPct < 0;

  return (
    <div className="rounded-md border border-base-300 bg-base-100 p-4 shadow-sm transition-all hover:border-base-content/20 md:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-body-s font-medium text-base-content opacity-70">
          {title}
        </span>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md bg-base-200 text-primary",
            iconClassName,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-heading-m font-bold text-base-content tracking-tight">
          {value}
        </span>

        {typeof deltaPct === "number" && (
          <div
            className={cn(
              "flex items-center gap-1 rounded px-2 py-0.5 text-caption font-semibold",
              isPositive
                ? "bg-emerald-500/10 text-emerald-500"
                : isNegative
                  ? "bg-rose-500/10 text-rose-500"
                  : "bg-base-200 text-base-content opacity-60",
            )}
          >
            <span>
              {isPositive ? "+" : ""}
              {deltaPct}%
            </span>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-caption text-base-content opacity-60">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AnalyticsKpiCard;
