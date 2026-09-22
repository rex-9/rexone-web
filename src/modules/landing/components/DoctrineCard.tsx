// src/modules/landing/components/DoctrineCard.tsx

import React from "react";
import { iconsLib } from "../../../assets";

export interface IDoctrineTag {
  label: string;
  sublabel?: string;
}

export interface IFoundationPillar {
  icon: keyof typeof iconsLib;
  title: string;
  description: string;
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

const FOUNDATION_PILLARS: IFoundationPillar[] = [
  {
    icon: "key",
    title: "Identity & Hierarchical RBAC",
    description: "Devise JWT authentication with atomic JTI revocation lists, 23 canonical resources, and 5 granular actions.",
  },
  {
    icon: "banknotes",
    title: "Stripe Billing & Subscriptions",
    description: "Subscription tiers, one-time checkout, promotional/referral coupons, and automated webhook state machines.",
  },
  {
    icon: "archiveBox",
    title: "Universal Object Storage",
    description: "Self-hosted Garage S3 (port 3100) or AWS S3, pre-signed upload tickets, and polymorphic asset tracking.",
  },
  {
    icon: "arrowPath",
    title: "Real-Time WebSockets",
    description: "ActionCable & Solid Cable bi-directional events, live notification toasts, and instant client synchronization.",
  },
  {
    icon: "bell",
    title: "Multi-Channel Notifications",
    description: "Unified pipeline routing to In-App modals, OneSignal push notifications, and branded transactional emails.",
  },
  {
    icon: "sparkles",
    title: "Glass-Box Telemetry & AI",
    description: "Rails Pulse APM metrics, Rails Error Dashboard, Solid Queue job workers, and multi-model LLM chat profiles.",
  },
];

export const DoctrineCard: React.FC<IDoctrineCardProps> = ({
  pillText = "The Sovereign Doctrine",
  pillIcon,
  quote = "“Start from One. Not from Zero.”",
  description = "Whether you are launching an ambitious product without burning months rebuilding foundation basics from scratch, or learning professional full-stack development with the strongest, cleanest, and most disciplined engineering standards—RexOne unifies backend, web, and mobile into an immutable, battle-tested trinity forged under Constitutional Law with zero technical debt.",
  tags = DEFAULT_TAGS,
  className = "",
}) => {
  return (
    <article
      className={`relative rounded-3xl bg-glass-card/85 backdrop-blur-xl border border-glass-border p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] text-center overflow-hidden transition-all duration-500 hover:border-glass-border-hover hover:shadow-[0_0_35px_rgba(var(--color-primary-rgb),0.3)] ${className}`}
    >
      {/* Ambient Background Glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-dark/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
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
        <p className="text-sm sm:text-base text-base-content/80 leading-relaxed font-primary max-w-2xl mx-auto">
          {description}
        </p>

        {/* Sovereign Trinity Repository Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-1">
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

        {/* Foundation Fundamentals Grid (Never Rebuild from Scratch) */}
        <div className="pt-6 border-t border-glass-border/60">
          <h3 className="text-xs uppercase tracking-widest font-bold text-primary mb-4">
            Foundational Fundamentals Delivered on Day One • Full-Stack Masterclass Reference
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-left">
            {FOUNDATION_PILLARS.map((pillar, idx) => {
              const IconComponent = iconsLib[pillar.icon] || iconsLib.cube;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-glass-border bg-black/25 backdrop-blur-md hover:border-primary/40 hover:bg-black/40 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h4 className="font-semibold text-sm text-base-content group-hover:text-primary-light transition-colors">
                      {pillar.title}
                    </h4>
                  </div>
                  <p className="text-xs text-base-content/70 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
};
