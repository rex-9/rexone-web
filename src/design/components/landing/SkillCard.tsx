import React from "react";
import { ISkillItem } from "../../pages/landing.data";
import { colors } from "../../elements";

import { Badge } from "../common";
import { BadgeVariants, ComponentSizes } from "../../constants";

interface SkillCardProps {
  title: string;
  items: ISkillItem[];
}

export const SkillCard: React.FC<SkillCardProps> = ({ title, items }) => {
  return (
    <article className="font-primary bg-glass-card border border-glass-border rounded-[20px] p-5 md:p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-glass-card-hover hover:border-glass-border-hover hover:shadow-glass-card">
      <h4
        style={{
          textShadow: colors.effects.cardHeading,
        }}
        className="text-center font-display text-[22px] text-glow-white mb-4 tracking-wide"
      >
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
