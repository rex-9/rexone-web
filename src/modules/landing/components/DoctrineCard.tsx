// src/modules/landing/components/DoctrineCard.tsx

import React from "react";
import { iconsLib } from "../../../assets";

export interface IDoctrineTag {
  label: string;
  sublabel?: string;
}

export interface IDoctrineCardProps {
  pillText?: string;
  pillIcon?: React.ReactNode;
  quote?: string;
  description?: string;
  tags?: IDoctrineTag[];
  className?: string;
}

const DEFAULT_TAGS: IDoctrineTag[] = [
  { label: "RexOne Core", sublabel: "Rails 8 API" },
  { label: "RexOne Web", sublabel: "React 19 Client" },
  { label: "RexOne Mobile", sublabel: "Flutter Vanguard" },
];

export const DoctrineCard: React.FC<IDoctrineCardProps> = ({
  pillText = "The Sovereign Doctrine",
  pillIcon,
  quote = "“Start from One. Not from Zero.”",
  description = "Every new endeavor shouldn't mean burning money repetitively by wasting AI tokens on weak architecture or rebuilding foundation from scratch. RexOne unifies backend, web, and mobile into an immutable, battle-tested trinity—forged under Constitutional Law with zero technical debt.",
  tags = DEFAULT_TAGS,
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-3xl bg-glass-card/85 backdrop-blur-xl border border-glass-border p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] text-center overflow-hidden transition-all duration-500 hover:border-glass-border-hover hover:shadow-[0_0_35px_rgba(var(--color-primary-rgb),0.3)] ${className}`}
    >
      {/* Ambient Background Glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-dark/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-4">
        {/* Doctrine Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary-light text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.25)]">
          {pillIcon || <iconsLib.sparkles className="w-4 h-4 text-primary" />}
          <span>{pillText}</span>
        </div>

        {/* The Heart Quote */}
        <blockquote className="font-display text-2xl sm:text-4xl md:text-5xl font-normal tracking-wide text-glow-white [text-shadow:0_0_12px_var(--color-glow-white),0_0_25px_var(--color-primary),0_0_50px_var(--color-primary-dark)] py-1">
          {quote}
        </blockquote>

        {/* Glowing Gradient Accent Line */}
        <div className="w-24 h-0.5 mx-auto bg-linear-to-r from-transparent via-primary to-transparent shadow-[0_0_8px_var(--color-primary)]" />

        {/* Philosophy Explanation */}
        <p className="text-sm sm:text-base text-base-content/80 leading-relaxed font-primary">
          {description}
        </p>

        {/* Sovereign Trinity Repository Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border border-glass-border bg-glass-tag-bg text-base-content/90 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>
                  {tag.label}
                  {tag.sublabel ? ` • ${tag.sublabel}` : ""}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
