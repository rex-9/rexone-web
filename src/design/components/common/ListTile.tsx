// src/design/components/common/ListTile.tsx
import React from "react";
import { cn } from "../../helpers";

export interface IListTileProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  isDestructive?: boolean;
  className?: string;
  disabled?: boolean;
  contentPadding?: string;
}

export const ListTile: React.FC<IListTileProps> = ({
  leading,
  title,
  subtitle,
  trailing,
  onClick,
  isDestructive = false,
  className,
  disabled = false,
  contentPadding = "px-4 py-3",
  ...props
}) => {
  const isClickable = !!onClick && !disabled;

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "flex items-center gap-3.5 rounded-xl transition-all duration-200 select-none",
        isClickable &&
          "cursor-pointer hover:bg-white/5 active:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        contentPadding,
        className
      )}
      {...props}
    >
      {leading && (
        <div
          className={cn(
            "flex items-center justify-center shrink-0",
            isDestructive ? "text-error" : "text-base-content/80"
          )}
        >
          {leading}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-sm font-medium leading-snug truncate",
            isDestructive ? "text-error" : "text-base-content"
          )}
        >
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-base-content/60 leading-normal truncate mt-0.5">
            {subtitle}
          </div>
        )}
      </div>

      {trailing && (
        <div className="flex items-center justify-center shrink-0 text-base-content/60">
          {trailing}
        </div>
      )}
    </div>
  );
};
