// src/modules/admin/analytics/pages/AdminAnalyticsPage.tsx
import React, { useState } from "react";
import { iconsLib } from "../../../../assets";
import { useDocumentTitle } from "../../../../hooks";
import { ANALYTICS_PERIODS, ANALYTICS_PERIOD_LABELS } from "../../constants";
import { AdminState, PageHeader } from "../../components";
import {
  AnalyticsKpiCard,
  AnalyticsPeriodSelector,
  CacheSourceBadge,
  ChatActivityChart,
  NotificationChannelsChart,
  RevenueChart,
  UserGrowthChart,
} from "../components";
import { ISelectedPeriodOption } from "../components/AnalyticsPeriodSelector";
import { calculateUtcRangeForPreset } from "../helpers/analyticsDate.helper";
import { useAnalytics } from "../hooks/useAnalytics";

export const AdminAnalyticsPage: React.FC = () => {
  useDocumentTitle("Analytics — Admin Panel");

  const [selectedOption, setSelectedOption] = useState<ISelectedPeriodOption>(
    () => {
      const { startDate, endDate } = calculateUtcRangeForPreset(
        ANALYTICS_PERIODS.THIRTY_DAYS,
      );
      return {
        period: ANALYTICS_PERIODS.THIRTY_DAYS,
        startDate,
        endDate,
        label: ANALYTICS_PERIOD_LABELS[ANALYTICS_PERIODS.THIRTY_DAYS],
      };
    },
  );

  const { data, isLoading, isFetching, error, refetch } = useAnalytics({
    period: selectedOption.period,
    start_date: selectedOption.startDate,
    end_date: selectedOption.endDate,
  });

  const isHistorical =
    selectedOption.period === ANALYTICS_PERIODS.LAST_MONTH ||
    selectedOption.period === ANALYTICS_PERIODS.LAST_YEAR ||
    selectedOption.period === ANALYTICS_PERIODS.YESTERDAY ||
    selectedOption.period === ANALYTICS_PERIODS.CUSTOM;

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        {/* Skeleton Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded bg-base-300" />
            <div className="h-4 w-72 animate-pulse rounded bg-base-300 opacity-60" />
          </div>
          <div className="h-10 w-64 animate-pulse rounded bg-base-300" />
        </div>

        {/* Skeleton KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-md border border-base-300 bg-base-100 p-4"
            />
          ))}
        </div>

        {/* Skeleton Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-md border border-base-300 bg-base-100 p-5"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <AdminState
        title="Unable to load analytics"
        message={error?.message || "Failed to retrieve analytics overview."}
        actionLabel="Try Again"
        onAction={() => refetch()}
      />
    );
  }

  const { kpis, time_series, breakdowns, grain } = data;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Analytics Overview"
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>Real-time system health and operational growth.</span>
            <span className="rounded bg-base-200 px-2 py-0.5 text-caption font-medium text-base-content opacity-80">
              🕒 Local Time ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </span>
          </span>
        }
        action={
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <AnalyticsPeriodSelector
              selected={selectedOption}
              onSelect={(nextOption) => setSelectedOption(nextOption)}
              disabled={isFetching}
            />
            <CacheSourceBadge
              isFetching={isFetching}
              isHistorical={isHistorical}
            />
          </div>
        }
      />

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsKpiCard
          title="Gross Revenue"
          value={`$${kpis.period_revenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          deltaPct={kpis.revenue_delta_pct}
          icon={iconsLib.banknotes}
          subtitle={`All-time: $${kpis.total_revenue.toLocaleString()}`}
        />

        <AnalyticsKpiCard
          title="New Users"
          value={kpis.new_users.toLocaleString()}
          deltaPct={kpis.users_delta_pct}
          icon={iconsLib.userGroup}
          subtitle={`Total users: ${kpis.total_users.toLocaleString()}`}
        />

        <AnalyticsKpiCard
          title="Active Subscriptions"
          value={kpis.active_subscriptions.toLocaleString()}
          icon={iconsLib.cube}
          subtitle={`${kpis.period_transactions} transactions this period`}
        />

        <AnalyticsKpiCard
          title="Total Messages"
          value={kpis.total_messages.toLocaleString()}
          deltaPct={kpis.messages_delta_pct}
          icon={iconsLib.chatBubbleLeftRight}
          subtitle={`${kpis.user_messages} user / ${kpis.ai_messages} AI`}
        />
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-md border border-base-300 bg-base-100 p-3.5 shadow-sm">
          <div>
            <p className="text-caption font-medium text-base-content opacity-60">
              Unresolved Errors
            </p>
            <p className="text-body-l font-bold text-rose-500">
              {kpis.unresolved_errors}
            </p>
          </div>
          <span className="rounded bg-rose-500/10 px-2 py-1 text-caption font-semibold text-rose-500">
            {kpis.period_errors} logged
          </span>
        </div>

        <div className="flex items-center justify-between rounded-md border border-base-300 bg-base-100 p-3.5 shadow-sm">
          <div>
            <p className="text-caption font-medium text-base-content opacity-60">
              User Feedbacks
            </p>
            <p className="text-body-l font-bold text-base-content">
              {kpis.period_feedbacks}
            </p>
          </div>
          <span className="rounded bg-base-200 px-2 py-1 text-caption font-semibold text-base-content opacity-70">
            This period
          </span>
        </div>

        <div className="flex items-center justify-between rounded-md border border-base-300 bg-base-100 p-3.5 shadow-sm">
          <div>
            <p className="text-caption font-medium text-base-content opacity-60">
              AI Conversion
            </p>
            <p className="text-body-l font-bold text-purple-400">
              {kpis.user_messages > 0
                ? `${Math.round((kpis.ai_messages / kpis.user_messages) * 100)}%`
                : "100%"}
            </p>
          </div>
          <span className="rounded bg-purple-500/10 px-2 py-1 text-caption font-semibold text-purple-400">
            Response rate
          </span>
        </div>
      </div>

      {/* Primary 2x2 Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={time_series} grain={grain} />
        <UserGrowthChart data={time_series} grain={grain} />
        <ChatActivityChart data={time_series} grain={grain} />
        <NotificationChannelsChart breakdowns={breakdowns} />
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
