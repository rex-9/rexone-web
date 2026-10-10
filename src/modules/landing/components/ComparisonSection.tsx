// src/modules/landing/components/ComparisonSection.tsx

import React, { useState } from "react";
import { iconsLib } from "../../../assets";
import AppRoutes from "../../../AppRoutes";
import { Button, ButtonVariants, ComponentSizes, TextLink } from "../../../design";

export interface ICompetitorSummary {
  id: string;
  name: string;
  tagline: string;
  price: string;
  stack: string;
  platforms: string;
  mobile: string;
  offline: string;
  queues: string;
  aiGovernance: string;
  fatalFlaw: string;
}

export const COMPETITORS: ICompetitorSummary[] = [
  {
    id: "shipfast",
    name: "ShipFast",
    tagline: "Next.js solo indie hacker boilerplate",
    price: "$199 (One-Time)",
    stack: "Next.js (App Router) + MongoDB / Supabase + Stripe + DaisyUI",
    platforms: "Web Only",
    mobile: "None (No mobile app)",
    offline: "None (Breaks on disconnect)",
    queues: "Serverless route handler timeouts",
    aiGovernance: "None (Unguided vibe coding)",
    fatalFlaw: "Web-only micro-MVP; zero native mobile apps, no background queue topology, brittle serverless timeouts.",
  },
  {
    id: "makerkit",
    name: "Makerkit",
    tagline: "Next.js / Remix B2B SaaS starter kit",
    price: "$199 – $649 (One-Time)",
    stack: "Next.js / Remix + Supabase / Firebase + Stripe / Paddle",
    platforms: "Web Only",
    mobile: "None (Web only)",
    offline: "None",
    queues: "Third-party edge functions",
    aiGovernance: "Generic AI prompt docs",
    fatalFlaw: "Closed-source paid seat license, vendor lock-in to proprietary BaaS cloud bills, no native mobile sync.",
  },
  {
    id: "supastarter",
    name: "Supastarter",
    tagline: "Modern TypeScript full-stack starter kit",
    price: "$199 – $599 (One-Time)",
    stack: "Next.js 15 / Nuxt 3 + Supabase + Prisma / Drizzle + Stripe",
    platforms: "Web Only",
    mobile: "None (No mobile app)",
    offline: "None",
    queues: "Edge API handlers (10s CPU limits)",
    aiGovernance: "Generic cursor rules",
    fatalFlaw: "No Flutter mobile client, no relational offline sync, strict 10s edge CPU execution limits, paid license per project.",
  },
  {
    id: "jumpstart",
    name: "Jumpstart Pro",
    tagline: "Rails 8 commercial starter kit",
    price: "$249/yr or $749 (Paid)",
    stack: "Ruby on Rails 8 + Hotwire (Turbo + Stimulus) + Devise + Stripe",
    platforms: "Rails Monolith + Turbo Webview",
    mobile: "Turbo Native (Webview wrapper)",
    offline: "None (Requires constant server connection)",
    queues: "Solid Queue / Sidekiq",
    aiGovernance: "None (Rails conventions only)",
    fatalFlaw: "Mobile is just web pages wrapped in a webview; closed-source commercial seat licensing; no modern React SPA.",
  },
  {
    id: "pegasus",
    name: "SaaS Pegasus",
    tagline: "Python / Django SaaS boilerplate",
    price: "$295 – $795 (One-Time)",
    stack: "Python / Django + HTMX / React + Celery + Stripe",
    platforms: "Django Web Only",
    mobile: "None (No mobile app)",
    offline: "None",
    queues: "Celery (Requires external Redis broker)",
    aiGovernance: "Standard developer docs",
    fatalFlaw: "Monolithic Python web-only stack; no mobile app; expensive paid commercial license; Redis hosting overhead.",
  },
  {
    id: "bullettrain",
    name: "Bullet Train",
    tagline: "Rails multi-tenant SaaS framework",
    price: "$0 Core / $995 Pro",
    stack: "Ruby on Rails + Hotwire + Devise + CanCanCan",
    platforms: "Rails Monolith",
    mobile: "None (Web only)",
    offline: "None",
    queues: "Sidekiq (Requires Redis broker)",
    aiGovernance: "None",
    fatalFlaw: "Complex meta-framework learning curve; server-rendered HTML only; no native Flutter app; expensive pro upsells.",
  },
  {
    id: "larafast",
    name: "Larafast & Spark",
    tagline: "Laravel SaaS starter kits",
    price: "$99 – $169 (One-Time)",
    stack: "PHP / Laravel + Livewire / Vue + Stripe",
    platforms: "Laravel Web Only",
    mobile: "None (No mobile app)",
    offline: "None",
    queues: "Laravel Queues (Requires Redis broker)",
    aiGovernance: "None",
    fatalFlaw: "PHP/Laravel web-only ecosystem; no compiled mobile client; proprietary paid licenses per domain.",
  },
  {
    id: "opensaas",
    name: "Open SaaS & Indie Clones",
    tagline: "Free open-source starter templates",
    price: "100% Free (Open Source)",
    stack: "Wasp / Next.js + React + Node + Prisma",
    platforms: "Web Only",
    mobile: "None",
    offline: "None",
    queues: "Basic Node intervals / cron",
    aiGovernance: "None",
    fatalFlaw: "Incomplete architecture (missing enterprise RBAC, self-hosted S3 storage, native mobile, and AI agent laws).",
  },
];

export const ComparisonSection: React.FC = () => {
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>("shipfast");

  const selectedCompetitor =
    COMPETITORS.find((c) => c.id === selectedCompetitorId) || COMPETITORS[0];

  return (
    <section
      id="Comparison"
      className="py-12 scroll-mt-20 space-y-8"
      aria-label="Architectural Comparison Section"
    >
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto space-y-3 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/40 bg-primary/15 text-primary-light backdrop-blur-md shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.3)]">
          <iconsLib.sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-bold tracking-wider uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            Architectural Head-to-Head · RexOne vs Starter Kits
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-normal tracking-wide text-white">
          Why Settle for a $300 Web-Only Template?
        </h2>

        <p className="text-sm sm:text-base text-base-content/85 max-w-3xl mx-auto leading-relaxed font-primary">
          Commercial starter kits often offer single-platform setups for{" "}
          <span className="text-white font-bold">$169 to $799</span> that can feel limiting when you need a real
          background queue, enterprise IAM, or a 60fps mobile app.{" "}
          <strong className="text-primary-light">RexOne gives you a battle-hardened, Tri-Platform architectural foundation for $0</strong>—because
          Discipline-Driven Development is about enduring engineering and open craftsmanship.
        </p>
      </div>

      {/* Competitor Selector: Balanced 4x2 Grid (4 Columns x 2 Rows) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 max-w-4xl mx-auto px-4">
        {COMPETITORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCompetitorId(c.id)}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide text-center flex items-center justify-center transition-all duration-300 cursor-pointer ${
              selectedCompetitorId === c.id
                ? "bg-primary text-white border border-primary shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.5)] scale-[1.02]"
                : "bg-glass-card/90 text-white/80 border border-glass-border hover:border-primary/50 hover:bg-glass-card-hover hover:text-white"
            }`}
          >
            vs {c.name}
          </button>
        ))}
      </div>

      {/* Active Competitor Faceoff Card */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-glass-card/90 backdrop-blur-xl border border-glass-border p-6 sm:p-8 md:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.6)] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border/70 pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                Direct Head-to-Head Comparison
              </span>
              <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-glow-white mt-1">
                RexOne (100% Free) vs {selectedCompetitor.name} ({selectedCompetitor.price})
              </h3>
              <p className="text-xs sm:text-sm text-base-content/70 mt-1">
                {selectedCompetitor.tagline} · {selectedCompetitor.stack}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                href={AppRoutes.client.public.VS}
                variant={ButtonVariants.NEON}
                size={ComponentSizes.SM}
                className="font-bold text-xs tracking-wider"
              >
                View Master Matrix on VS Page ↗
              </Button>
            </div>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RexOne Side */}
            <div className="rounded-2xl border border-primary/40 bg-primary/10 p-5 sm:p-6 space-y-4 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.15)]">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-lg text-primary-light flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                  RexOne Architecture Foundation
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-primary/20 text-primary-light border border-primary/40">
                  100% FREE (Apache 2.0)
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-base-content/90 font-primary">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <div>
                    <strong className="text-white">Tri-Platform Coverage:</strong> Rails 8 API + React 19 Web + pure Flutter 3 Native Mobile client.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <div>
                    <strong className="text-white">Native Mobile with Drift SQLite:</strong> 60fps compiled iOS &amp; Android apps with offline relational sync and biometric auth.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <div>
                    <strong className="text-white">Solid Queue Concurrency:</strong> 50 concurrent Fibers + 2 Threads directly on PostgreSQL 18 with zero Redis bills.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <div>
                    <strong className="text-white">Self-Hosted Garage S3:</strong> Dedicated storage on port 3100 with zero egress fees and automated media transcoding.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <div>
                    <strong className="text-white">Discipline-Driven Development (DDD):</strong> Immutable constitutional laws (<code>LAW.md</code> &amp; <code>AGENTS.md</code>) enforcing pure contracts (Law U14) and zero zombie code.
                  </div>
                </div>
              </div>
            </div>

            {/* Competitor Side */}
            <div className="rounded-2xl border border-glass-border bg-glass-card/90 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-lg text-white">
                  {selectedCompetitor.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-primary/15 text-primary-light border border-primary/30">
                  {selectedCompetitor.price}
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-base-content/75 font-primary">
                <div className="flex items-start gap-2">
                  <span className="text-error font-bold">✕</span>
                  <div>
                    <strong className="text-white">Platforms:</strong> {selectedCompetitor.platforms}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-error font-bold">✕</span>
                  <div>
                    <strong className="text-white">Mobile Support:</strong> {selectedCompetitor.mobile}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-error font-bold">✕</span>
                  <div>
                    <strong className="text-white">Offline Capability:</strong> {selectedCompetitor.offline}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-error font-bold">✕</span>
                  <div>
                    <strong className="text-white">Background Processing:</strong> {selectedCompetitor.queues}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-error font-bold">✕</span>
                  <div>
                    <strong className="text-white">AI Agent Guardrails:</strong> {selectedCompetitor.aiGovernance}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-glass-border/40 text-xs text-warning/90 font-mono">
                ⚠️ Architectural Trade-off: {selectedCompetitor.fatalFlaw}
              </div>
            </div>
          </div>

          {/* Quick Deep Dive Link */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-glass-border/70 text-xs text-base-content/60">
            <div className="flex flex-wrap items-center gap-2">
              <span>Looking for complete technical side-by-side details?</span>
              <TextLink to={AppRoutes.client.public.VS} className="text-primary hover:underline font-semibold inline-flex items-center gap-1">
                <span>Explore the Full VS Page &amp; Master Matrix</span>
                <span>→</span>
              </TextLink>
            </div>

            <Button
              href="https://github.com/rex-9/rexone-core"
              target="_blank"
              rel="noopener noreferrer"
              variant={ButtonVariants.TERTIARY}
              size={ComponentSizes.SM}
              className="text-xs border border-glass-border hover:border-primary"
            >
              Star on GitHub (Free Apache 2.0) ⭐
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
