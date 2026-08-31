// src/modules/admin/analytics/components/RevenueChart.tsx
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IAnalyticsTimeSeriesPoint } from "../types";
import { formatUtcToLocalLabel } from "../helpers/analyticsDate.helper";

interface IRevenueChartProps {
  data: IAnalyticsTimeSeriesPoint[];
  grain?: "hourly" | "daily" | "monthly";
}

export const RevenueChart: React.FC<IRevenueChartProps> = ({
  data,
  grain = "daily",
}) => {
  return (
    <div className="rounded-md border border-base-300 bg-base-100 p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-body-m font-semibold text-base-content">
            Revenue & Paid Transactions
          </h3>
          <p className="text-caption text-base-content opacity-60">
            Gross revenue generated over the selected time range
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff5757" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ff5757" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-base-300"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: string) => formatUtcToLocalLabel(val, grain)}
              tick={{ fill: "currentColor", fontSize: 12, opacity: 0.6 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "currentColor", fontSize: 12, opacity: 0.6 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as IAnalyticsTimeSeriesPoint;
                  const formattedLabel = formatUtcToLocalLabel(
                    String(label),
                    grain,
                  );
                  return (
                    <div className="rounded-md border border-base-300 bg-base-100 p-3 shadow-xl">
                      <p className="text-caption font-semibold text-base-content opacity-80">
                        {formattedLabel}
                      </p>
                      <p className="mt-1 text-body-m font-bold text-primary">
                        ${item.revenue.toFixed(2)} USD
                      </p>
                      <p className="text-caption text-base-content opacity-70">
                        {item.transactions} transaction
                        {item.transactions === 1 ? "" : "s"}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#ff5757"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
