// src/modules/admin/analytics/components/AnalyticsPeriodSelector.tsx
import React, { useMemo } from "react";
import { iconsLib } from "../../../../assets";
import {
  ANALYTICS_PERIODS,
  ANALYTICS_PERIOD_LABELS,
  TAnalyticsPeriod,
} from "../../constants";
import {
  calculateUtcRangeForMonth,
  calculateUtcRangeForPreset,
  calculateUtcRangeForYear,
} from "../helpers/analyticsDate.helper";

export const APP_INCEPTION_YEAR = 2026;
export const APP_INCEPTION_MONTH = 8; // 0-indexed: 8 = September 2026

export interface ISelectedPeriodOption {
  period: TAnalyticsPeriod;
  startDate: string; // ISO 8601 UTC
  endDate: string;   // ISO 8601 UTC
  label: string;
}

interface IAnalyticsPeriodSelectorProps {
  selected: ISelectedPeriodOption;
  onSelect: (option: ISelectedPeriodOption) => void;
  disabled?: boolean;
}

interface IPresetOption {
  id: string;
  period: TAnalyticsPeriod;
  label: string;
}

export const AnalyticsPeriodSelector: React.FC<
  IAnalyticsPeriodSelectorProps
> = ({ selected, onSelect, disabled = false }) => {
  const appInceptionDate = useMemo(
    () => new Date(APP_INCEPTION_YEAR, APP_INCEPTION_MONTH, 1, 0, 0, 0, 0),
    [],
  );

  // Generate past completed months (only down to September 2026)
  const pastMonths = useMemo(() => {
    const months: Array<{
      id: string;
      label: string;
      startDate: string;
      endDate: string;
    }> = [];
    const now = new Date();

    for (let i = 2; i <= 60; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      if (d < appInceptionDate) break;

      const year = d.getFullYear();
      const month = d.getMonth();
      const monthLabel = d.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      const { startDate, endDate } = calculateUtcRangeForMonth(year, month);

      months.push({
        id: `month-${year}-${month + 1}`,
        label: monthLabel,
        startDate,
        endDate,
      });
    }

    return months;
  }, [appInceptionDate]);

  // Generate past completed years (only down to 2026)
  const pastYears = useMemo(() => {
    const years: Array<{
      id: string;
      label: string;
      startDate: string;
      endDate: string;
    }> = [];
    const currentYear = new Date().getFullYear();

    for (
      let targetYear = currentYear - 2;
      targetYear >= APP_INCEPTION_YEAR;
      targetYear--
    ) {
      const { startDate, endDate } = calculateUtcRangeForYear(targetYear);

      years.push({
        id: `year-${targetYear}`,
        label: `Year ${targetYear}`,
        startDate,
        endDate,
      });
    }

    return years;
  }, []);

  const standardPresets = useMemo(() => {
    const now = new Date();
    const presets: IPresetOption[] = [
      {
        id: ANALYTICS_PERIODS.TODAY,
        period: ANALYTICS_PERIODS.TODAY,
        label: ANALYTICS_PERIOD_LABELS[ANALYTICS_PERIODS.TODAY],
      },
      {
        id: ANALYTICS_PERIODS.YESTERDAY,
        period: ANALYTICS_PERIODS.YESTERDAY,
        label: ANALYTICS_PERIOD_LABELS[ANALYTICS_PERIODS.YESTERDAY],
      },
      {
        id: ANALYTICS_PERIODS.SEVEN_DAYS,
        period: ANALYTICS_PERIODS.SEVEN_DAYS,
        label: ANALYTICS_PERIOD_LABELS[ANALYTICS_PERIODS.SEVEN_DAYS],
      },
      {
        id: ANALYTICS_PERIODS.THIRTY_DAYS,
        period: ANALYTICS_PERIODS.THIRTY_DAYS,
        label: ANALYTICS_PERIOD_LABELS[ANALYTICS_PERIODS.THIRTY_DAYS],
      },
      {
        id: ANALYTICS_PERIODS.THIS_MONTH,
        period: ANALYTICS_PERIODS.THIS_MONTH,
        label: ANALYTICS_PERIOD_LABELS[ANALYTICS_PERIODS.THIS_MONTH],
      },
    ];

    // Only show "Last month" if last month is >= September 2026
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    if (lastMonthDate >= appInceptionDate) {
      presets.push({
        id: ANALYTICS_PERIODS.LAST_MONTH,
        period: ANALYTICS_PERIODS.LAST_MONTH,
        label: ANALYTICS_PERIOD_LABELS[ANALYTICS_PERIODS.LAST_MONTH],
      });
    }

    // "This year"
    presets.push({
      id: ANALYTICS_PERIODS.THIS_YEAR,
      period: ANALYTICS_PERIODS.THIS_YEAR,
      label: ANALYTICS_PERIOD_LABELS[ANALYTICS_PERIODS.THIS_YEAR],
    });

    // Only show "Last year" if last year >= 2026
    if (now.getFullYear() - 1 >= APP_INCEPTION_YEAR) {
      presets.push({
        id: ANALYTICS_PERIODS.LAST_YEAR,
        period: ANALYTICS_PERIODS.LAST_YEAR,
        label: ANALYTICS_PERIOD_LABELS[ANALYTICS_PERIODS.LAST_YEAR],
      });
    }

    return presets;
  }, [appInceptionDate]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    // Check standard preset
    const preset = standardPresets.find((p) => p.id === value);
    if (preset) {
      const { startDate, endDate } = calculateUtcRangeForPreset(preset.period);
      onSelect({
        period: preset.period,
        startDate,
        endDate,
        label: preset.label,
      });
      return;
    }

    // Check past month
    const pastMonth = pastMonths.find((m) => m.id === value);
    if (pastMonth) {
      onSelect({
        period: ANALYTICS_PERIODS.CUSTOM,
        startDate: pastMonth.startDate,
        endDate: pastMonth.endDate,
        label: pastMonth.label,
      });
      return;
    }

    // Check past year
    const pastYear = pastYears.find((y) => y.id === value);
    if (pastYear) {
      onSelect({
        period: ANALYTICS_PERIODS.CUSTOM,
        startDate: pastYear.startDate,
        endDate: pastYear.endDate,
        label: pastYear.label,
      });
    }
  };

  const currentValue = useMemo(() => {
    if (selected.period === ANALYTICS_PERIODS.CUSTOM && selected.startDate) {
      const monthMatch = pastMonths.find(
        (m) => m.startDate === selected.startDate,
      );
      if (monthMatch) return monthMatch.id;

      const yearMatch = pastYears.find(
        (y) => y.startDate === selected.startDate,
      );
      if (yearMatch) return yearMatch.id;
    }
    return selected.period;
  }, [pastMonths, pastYears, selected]);

  return (
    <div className="relative inline-flex items-center">
      <div className="pointer-events-none absolute left-3 flex items-center text-base-content opacity-60">
        <iconsLib.clock className="h-4 w-4" />
      </div>

      <select
        value={currentValue}
        disabled={disabled}
        onChange={handleSelectChange}
        className="h-10 cursor-pointer appearance-none rounded-md border border-base-300 bg-base-100 pl-9 pr-10 text-body-s font-semibold text-base-content shadow-sm transition-colors hover:border-primary focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <optgroup label="Standard Presets">
          {standardPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </optgroup>

        {pastMonths.length > 0 && (
          <optgroup label="Previous Completed Months">
            {pastMonths.map((month) => (
              <option key={month.id} value={month.id}>
                {month.label}
              </option>
            ))}
          </optgroup>
        )}

        {pastYears.length > 0 && (
          <optgroup label="Previous Completed Years">
            {pastYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.label}
              </option>
            ))}
          </optgroup>
        )}
      </select>

      <div className="pointer-events-none absolute right-3 flex items-center text-base-content opacity-60">
        <iconsLib.chevronDown className="h-4 w-4" />
      </div>
    </div>
  );
};

export default AnalyticsPeriodSelector;
