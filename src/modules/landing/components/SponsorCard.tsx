// src/modules/landing/components/SponsorCard.tsx

import React from "react";
import { icons, iconsLib } from "../../../assets";
import { Button } from "../../../design/components/button";
import { ButtonVariants, ComponentSizes } from "../../../design/constants";
import { Asset, TextLink } from "../../../design";

export interface ISponsorCardProps {
  className?: string;
}

export const SponsorCard: React.FC<ISponsorCardProps> = ({
  className = "",
}) => {
  const sponsorUrl = "https://github.com/sponsors/rex-9";
  const githubUrl = "https://github.com/rex-9";

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto rounded-3xl bg-glass-card/90 backdrop-blur-xl border border-glass-border p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-500 hover:border-glass-border-hover hover:shadow-[0_0_35px_rgba(var(--color-primary-rgb),0.35)] text-left ${className}`}
    >
      {/* Subtle Ambient Glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-dark/25 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Avatar, Name, Handle, & Verified Tag */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left pb-6 border-b border-glass-border/70">
        {/* Avatar with Glowing Ring & Heart Badge */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 border-2 border-primary shadow-[0_0_18px_var(--color-primary)] bg-base-300/40 overflow-hidden">
            <img
              src="https://github.com/rex-9.png"
              alt="Rex (rex-9)"
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
              onError={(e) => {
                // Fallback to github icon if offline or image error
                (e.target as HTMLImageElement).src = icons.github.src;
              }}
            />
          </div>
          <div
            className="absolute -bottom-1 -right-1 bg-primary text-primary-content rounded-full p-1.5 shadow-[0_0_12px_var(--color-primary)] border border-primary-light/20"
            title="GitHub Sponsor"
          >
            <iconsLib.heart className="w-4 h-4 fill-current animate-pulse text-primary-content" />
          </div>
        </div>

        {/* Identity & Subtitle */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="font-display text-2xl sm:text-3xl font-normal text-glow-white tracking-wide [text-shadow:0_0_8px_var(--color-glow-white),0_0_16px_var(--color-primary)]">
              Rex
            </h3>
            <TextLink
              href={githubUrl}
              external
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-light transition-colors"
            >
              <span>@rex-9</span>
              <iconsLib.externalLink className="w-3.5 h-3.5" />
            </TextLink>
          </div>

          <p className="text-sm sm:text-base text-base-content/90 font-medium">
            Architect & Creator of the{" "}
            <span className="text-primary-light font-semibold">RexOne</span>{" "}
            Ecosystem
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 border border-primary/30 text-primary-light">
              <iconsLib.sparkles className="w-3 h-3 text-primary" />
              Open-Source Sponsor
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-base-200/50 border border-glass-border text-base-content/70">
              <iconsLib.shieldCheck className="w-3 h-3 text-base-content/80" />
              Apache 2.0 Licensed
            </span>
          </div>
        </div>
      </div>

      {/* Mission Body */}
      <div className="relative z-10 py-5 space-y-4">
        <p className="text-sm sm:text-base text-base-content/80 leading-relaxed">
          Directly back independent open-source engineering. Your sponsorship
          powers continuous architectural refinement, sovereign tooling, and
          guarantees a zero-technical-debt foundation for developers and
          autonomous AI agents.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm text-base-content/75">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-base-300/30 border border-glass-border/50">
            <span className="text-primary font-bold">🏛️</span>
            <span>Constitutional Law (`LAW.md`)</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-base-300/30 border border-glass-border/50">
            <span className="text-primary font-bold">⚡</span>
            <span>Zero Wasted Tokens or Plumbing</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-base-300/30 border border-glass-border/50">
            <span className="text-primary font-bold">🛡️</span>
            <span>1000+ Invariant Specs & Testing</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-base-300/30 border border-glass-border/50">
            <span className="text-primary font-bold">💎</span>
            <span>Complete Rails, React & Flutter Trinity</span>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-glass-border/70">
        <Button
          href={sponsorUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant={ButtonVariants.NEON}
          size={ComponentSizes.LG}
          className="w-full sm:w-auto py-3! px-7! text-sm! sm:text-base! font-bold tracking-wider inline-flex items-center justify-center gap-2.5"
        >
          <iconsLib.heart className="w-5 h-5 text-primary-light fill-current" />
          <span>Sponsor @rex-9 on GitHub</span>
          <iconsLib.externalLink className="w-4 h-4 text-glow-white/70" />
        </Button>

        <div className="flex items-center gap-2 text-xs text-base-content/50">
          <Asset
            src={icons.github.src}
            alt="GitHub"
            className="w-4 h-4 opacity-60"
          />
          <span>via GitHub Sponsors (100% direct)</span>
        </div>
      </div>
    </div>
  );
};
