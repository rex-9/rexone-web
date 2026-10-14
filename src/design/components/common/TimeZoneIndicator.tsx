import React from "react";
import { iconsLib } from "../../../assets";
import { useBrowserTimeZone } from "../../../hooks";
import { AppLocales, useTranslate } from "../../../locales";

export const TimeZoneIndicator: React.FC = () => {
  const { timeZone, utcOffset } = useBrowserTimeZone();
  const t = useTranslate();
  const label = t(AppLocales.Common.LocalTimeZone);

  return (
    <div
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-glass-border bg-glass-card px-2.5 text-caption font-semibold text-base-content/75 shadow-glass-card backdrop-blur-md"
      title={`${label}: ${timeZone} (${utcOffset})`}
      aria-label={`${label}: ${timeZone}, ${utcOffset}`}
    >
      <iconsLib.clock className="h-4 w-4 text-primary" />
      <span>{utcOffset}</span>
      <span className="hidden xl:inline">· {timeZone}</span>
    </div>
  );
};
