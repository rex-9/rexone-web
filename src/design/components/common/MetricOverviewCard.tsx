import React from "react";
import { cn } from "../../helpers";

export interface IMetricOverviewSection {
  key: string;
  content: React.ReactNode;
}

export interface IMetricOverviewCardProps {
  sections: readonly IMetricOverviewSection[];
  className?: string;
}

export const MetricOverviewCard: React.FC<IMetricOverviewCardProps> = ({
  sections,
  className,
}) => (
  <div
    className={cn(
      "grid overflow-hidden rounded-2xl border border-glass-border bg-glass-card backdrop-blur-md shadow-glass-card lg:grid-flow-col lg:auto-cols-fr",
      className,
    )}
  >
    {sections.map((section, index) => (
      <section
        key={section.key}
        className={cn(
          "min-w-0 p-4 md:p-5",
          index > 0 && "border-t border-glass-border/40 lg:border-l lg:border-t-0",
        )}
      >
        {section.content}
      </section>
    ))}
  </div>
);

export default MetricOverviewCard;
