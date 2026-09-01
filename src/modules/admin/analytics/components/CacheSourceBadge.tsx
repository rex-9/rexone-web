// src/modules/admin/analytics/components/CacheSourceBadge.tsx
import React from "react";
import { iconsLib } from "../../../../assets";
import { cn } from "../../../../design/helpers";

interface ICacheSourceBadgeProps {
  isFetching: boolean;
  isHistorical: boolean;
  className?: string;
}

export const CacheSourceBadge: React.FC<ICacheSourceBadgeProps> = ({
  isFetching,
  isHistorical,
  className,
}) => {
  if (isFetching) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-caption font-medium text-sky-400",
          className,
        )}
      >
        <span className="loading loading-spinner loading-xs" />
        <span>Fetching live from server...</span>
      </div>
    );
  }

  if (isHistorical) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-caption font-medium text-emerald-400",
          className,
        )}
      >
        <iconsLib.shieldCheck className="h-3.5 w-3.5" />
        <span>IndexedDB Cached (0ms server load)</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-200/60 px-3 py-1 text-caption font-medium text-base-content opacity-80",
        className,
      )}
    >
      <iconsLib.clock className="h-3.5 w-3.5" />
      <span>Live session (Auto-refreshed)</span>
    </div>
  );
};

export default CacheSourceBadge;
