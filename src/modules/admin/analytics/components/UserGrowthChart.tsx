// src/modules/admin/analytics/components/UserGrowthChart.tsx
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

interface IUserGrowthChartProps {
  data: IAnalyticsTimeSeriesPoint[];
  grain?: "hourly" | "daily" | "monthly";
}

export const UserGrowthChart: React.FC<IUserGrowthChartProps> = ({
  data,
  grain = "daily",
}) => {
  return (
    <div className="rounded-md border border-base-300 bg-base-100 p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-body-m font-semibold text-base-content">
            User Registrations
          </h3>
          <p className="text-caption text-base-content opacity-60">
            New user accounts created over time
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
              <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
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
              allowDecimals={false}
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
                      <p className="mt-1 text-body-m font-bold text-sky-400">
                        {item.new_users} new user{item.new_users === 1 ? "" : "s"}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="new_users"
              stroke="#38bdf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#userGrowthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;
