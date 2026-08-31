// src/modules/landing/components/SkillCard.tsx

import React from "react";
import { ISkillItem } from "../types";
import { Badge, BadgeVariants, ComponentSizes } from "../../../design";

export interface ISkillCardProps {
  title: string;
  items: ISkillItem[];
}

export const SkillCard: React.FC<ISkillCardProps> = ({ title, items }) => {
  return (
    <article className="font-primary bg-glass-card border border-glass-border rounded-2xl p-5 md:p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-glass-card-hover hover:border-glass-border-hover hover:shadow-glass-card">
      <h4 className="text-center font-display text-xl text-glow-white mb-4 tracking-wide [text-shadow:0_0_8px_var(--color-glow-white),0_0_16px_var(--color-primary),0_0_24px_var(--color-primary-dark)]">
        {title}
      </h4>
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((item) => (
          <Badge
            key={item.name}
            variant={BadgeVariants.NEON}
            size={ComponentSizes.SM}
            href={item.url}
          >
            {item.name}
          </Badge>
        ))}
      </div>
    </article>
  );
};
