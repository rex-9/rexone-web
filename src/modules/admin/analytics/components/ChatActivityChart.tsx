// src/modules/admin/analytics/components/ChatActivityChart.tsx
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IAnalyticsTimeSeriesPoint } from "../types";
import { formatUtcToLocalLabel } from "../helpers/analyticsDate.helper";
import { ANALYTICS_GRAINS, type TAnalyticsGrain } from "../../constants";

interface IChatActivityChartProps {
  data: IAnalyticsTimeSeriesPoint[];
  grain?: TAnalyticsGrain;
}

export const ChatActivityChart: React.FC<IChatActivityChartProps> = ({
  data,
  grain = ANALYTICS_GRAINS.DAILY,
}) => {
  return (
    <div className="rounded-md border border-base-300 bg-base-100 p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-body-m font-semibold text-base-content">
            Chat & AI Activity
          </h3>
          <p className="text-caption text-base-content opacity-60">
            User prompts vs AI assistant replies
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
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
                      <p className="mt-1 text-body-s font-semibold text-emerald-400">
                        User Messages: {item.user_messages}
                      </p>
                      <p className="text-body-s font-semibold text-purple-400">
                        AI Responses: {item.ai_messages}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
            />
            <Bar
              name="User Prompts"
              dataKey="user_messages"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              name="AI Replies"
              dataKey="ai_messages"
              fill="#c084fc"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChatActivityChart;
