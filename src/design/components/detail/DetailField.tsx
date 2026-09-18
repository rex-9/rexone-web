// src/design/components/detail/DetailField.tsx
import React from "react";
import { cn } from "../../helpers";
import { CopyButton } from "./CopyButton";

export interface IDetailFieldProps {
  label: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
  valueClassName?: string;
  copyable?: boolean;
  copyValue?: string;
  mono?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  helperText?: React.ReactNode;
  fullWidth?: boolean;
}

export const DetailField: React.FC<IDetailFieldProps> = ({
  label,
  value,
  className,
  valueClassName,
  copyable,
  copyValue,
  mono,
  icon: Icon,
  badge,
  helperText,
  fullWidth,
}) => {
  const isEmpty =
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "");

  const stringValueToCopy =
    copyValue ??
    (typeof value === "string" || typeof value === "number"
      ? String(value)
      : undefined);

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-base-200/90 bg-base-200/30 p-3.5 sm:p-4 transition-all duration-200 hover:border-primary/40 hover:bg-base-200/60 hover:shadow-xs min-w-0",
        fullWidth && "col-span-full",
        className,
      )}
    >
      <dt className="flex items-center justify-between gap-2 min-w-0">
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/60 group-hover:text-base-content/85 transition-colors min-w-0 truncate">
          {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-primary/80" />}
          <span className="truncate">{label}</span>
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {badge}
          {copyable && stringValueToCopy && (
            <CopyButton text={stringValueToCopy} />
          )}
        </div>
      </dt>

      <dd
        className={cn(
          "mt-2 min-w-0 wrap-break-word text-sm font-semibold text-base-content",
          mono &&
            "font-mono text-xs text-base-content/90 bg-base-300/50 px-2.5 py-1 rounded-md border border-base-300/80 select-all max-w-full inline-block truncate",
          isEmpty && "text-base-content/35 font-normal italic",
          valueClassName,
        )}
      >
        {isEmpty ? "—" : value}
      </dd>

      {helperText && (
        <div className="mt-1 text-[11px] text-base-content/50 truncate">
          {helperText}
        </div>
      )}
    </div>
  );
};
