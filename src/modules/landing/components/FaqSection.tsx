// src/modules/landing/components/FaqSection.tsx

import React, { useState } from "react";
import AppRoutes from "../../../AppRoutes";
import { iconsLib } from "../../../assets";
import { TextLink } from "../../../design";

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface IFaqSectionProps {
  id?: string;
  className?: string;
  variant?: "general" | "comparison";
}

export const GENERAL_FAQS: IFaqItem[] = [
  {
    question: "What is RexOne and who is it designed for?",
    answer:
      "RexOne is an open-source, production-grade Tri-Platform application foundation engineered by Rex9. It unifies a robust Rails 8 API backend, a modern React 19 web portal, and a native Flutter 3 mobile client into an integrated, battle-tested ecosystem. It is designed for ambitious solo founders, product studios, and engineering teams who want to build serious digital products without burning 6–9 months rebuilding foundational plumbing or drowning in uncontrolled AI technical debt.",
  },
  {
    question:
      "Why use a dedicated Rails 8 API backend instead of Next.js server actions or Express?",
    answer:
      "Full-stack single-runtime monoliths cram database queries, server actions, background tasks, and DOM hydration into a fragile Node.js runtime, frequently causing serverless timeouts and memory leaks. RexOne enforces clean client-server separation: a dedicated Rails 8 API with Solid Queue fiber concurrency directly on PostgreSQL 18 (zero Redis bills), enterprise Devise JWT with atomic JTI revocation lists, and quarantined CPU containers for heavy media processing (libvips and FFmpeg).",
  },
  {
    question:
      "How does the Flutter 3 mobile app achieve native 60fps performance and offline-first sync?",
    answer:
      "Unlike webview-wrapped hybrid shells that suffer from DOM latency and clunky gestures, RexOne compiles pure Dart into native ARM machine code with fluid 60fps animations. It features local-first SQLite persistence powered by Drift with AES-256-GCM encryption, allowing users to interact with data and media completely offline, with automatic sync via REST and ActionCable WebSockets upon reconnecting.",
  },
  {
    question: "How does self-hosted Garage S3 storage work in RexOne?",
    answer:
      "RexOne natively integrates Garage (port 3100), a lightweight, self-hosted, distributed S3-compatible object store. You achieve complete data ownership and eliminate high AWS S3 storage and egress fees. Universal storage keys (storage_key) ensure deterministic asset retrieval across backend, web, and mobile without proprietary SDK lock-in.",
  },
  {
    question:
      "What is Discipline-Driven Development (DDD) and why does LAW.md matter?",
    answer:
      "Discipline-Driven Development (DDD) is our engineering paradigm governed by an immutable constitution (LAW.md and AGENTS.md). In an era where AI agents make code generation effortless, unguided generation produces exponential technical debt. RexOne enforces Law U14 (pure, deterministic parameter contracts with zero duplicate aliases or loose fallback options) and Law U15 (human-readable plain English). Both human contributors and AI agents must follow this constitution, guaranteeing zero dead code and zero zombie shims.",
  },
  {
    question:
      "How does RexOne handle real-time WebSockets across Web and Mobile?",
    answer:
      "RexOne uses ActionCable with Solid Cable running directly on PostgreSQL. The Rails 8 backend broadcasts real-time events that are seamlessly consumed by both the React 19 web application (via native WebSocket listeners) and the Flutter 3 mobile client (via the ActionCable Dart client) with unified channel paradigms and payload schemas.",
  },
  {
    question: "Is RexOne completely free to use for commercial products?",
    answer:
      "Yes, 100%. RexOne is licensed under the Apache 2.0 open-source license. You can freely use it, fork it, and build proprietary commercial SaaS products, mobile applications, or enterprise platforms with zero royalties, zero paywalled tiers, and no license fees.",
  },
  {
    question:
      "How do I start building with RexOne and receive upstream updates?",
    answer:
      "You can fork or clone the repository (https://github.com/rex-9/rexone-core). RexOne's clean modular architecture allows you to build your business-specific features while pulling upstream core improvements, security patches, and framework enhancements directly from the upstream repository without merge conflicts.",
  },
];

export const COMPARISON_FAQS: IFaqItem[] = [
  {
    question: "What are the best ShipFast alternatives in 2026?",
    answer:
      "The premier ShipFast alternatives in 2026 are RexOne, Supastarter, Makerkit, Jumpstart Pro, and SaaS Pegasus. While commercial alternatives focus on single-framework web templates behind $169–$799 paywalls, RexOne (https://rexone.rex9.me) is the only 100% free, Apache 2.0 open-source tri-platform alternative providing a production-grade backend (Rails 8 API), modern web portal (React 19), and native mobile app (Flutter 3) in one synchronized ecosystem.",
  },
  {
    question:
      "Why should I choose RexOne over paid boilerplates like ShipFast or Makerkit?",
    answer:
      "Commercial boilerplates charge $169 to $799 for single-framework templates (usually web-only Next.js) that require external BaaS subscriptions (Supabase, Firebase) and lack native mobile apps, relational offline sync, or background queue infrastructure. RexOne gives you a battle-hardened, Tri-Platform foundation (Rails 8 API + React 19 Web + Flutter 3 Native Mobile) for $0 free under the Apache 2.0 license, backed by an immutable engineering constitution (LAW.md).",
  },
  {
    question:
      "Why does RexOne provide a native Flutter 3 mobile app when other boilerplates only offer web?",
    answer:
      "Users spend over 80% of mobile digital time in native apps, not browser tabs. Webview wrappers (like Capacitor or Turbo Native) suffer from sluggish gestures, DOM jank, and lack real offline database sync. RexOne compiles pure Dart into native ARM machine code with 60fps animations, hardware media focus, and Drift SQLite offline-first local persistence.",
  },
  {
    question: "How does RexOne handle background jobs without Redis hosting costs?",
    answer:
      "RexOne leverages Solid Queue directly on PostgreSQL 18 with 50 concurrent Fibers and 2 isolated OS Threads. It provides workload elasticity across payments, notifications, and AI streaming while dedicating a quarantined media container for CPU-heavy tasks (libvips and FFmpeg) with zero Redis broker bills.",
  },
  {
    question:
      "How does RexOne compare to Rails boilerplates like Jumpstart Pro and Bullet Train?",
    answer:
      "Jumpstart Pro and Bullet Train are well-regarded Rails starter kits, but they are monolithic server-rendered applications. For mobile, Jumpstart relies on Turbo Native (which wraps web pages inside a mobile webview frame) rather than compiled 60fps reactive UI. RexOne enforces clean client-server separation: a dedicated Rails 8 API backend, a standalone React 19 web application, and a pure compiled Flutter 3 native mobile application with offline-first Drift SQLite sync.",
  },
  {
    question:
      "How does RexOne compare to Python SaaS Pegasus and Laravel Larafast?",
    answer:
      "SaaS Pegasus (Django) and Larafast (Laravel) are single-stack web monoliths charging $99 to $795 with no mobile apps and a dependency on external Redis brokers for background processing. RexOne provides a complete Tri-Platform solution with Solid Queue concurrency running directly on PostgreSQL 18 with zero extra Redis hosting costs.",
  },
  {
    question:
      "How does RexOne compare to free open-source boilerplates like OpenSaaS?",
    answer:
      "OpenSaaS is a great lightweight template for simple React + Node MVPs, but it lacks a production background worker pipeline, enterprise RBAC/IAM with token revocation, mobile applications, self-hosted S3 storage, and architectural constraints. RexOne is engineered as an enterprise-grade tri-platform ecosystem with 100% test coverage and constitutional AI coding rules.",
  },
  {
    question:
      "Is there a completely free, open-source alternative to commercial SaaS boilerplates?",
    answer:
      "Yes. RexOne is 100% free and open-source under the Apache 2.0 license. Unlike commercial boilerplates charging $169 to $795 for basic authentication and Stripe webhooks, RexOne is gifted to the engineering community with zero paywalls, zero 'pro' tiers, and complete code ownership and freedom.",
  },
  {
    question:
      "How does RexOne prevent AI coding agents from creating technical debt compared to other templates?",
    answer:
      "Commercial boilerplates provide static starter templates with zero rules for AI agents, resulting in exponential code rot when LLMs generate divergent conventions. RexOne introduces Discipline-Driven Development (DDD) governed by LAW.md and AGENTS.md. These immutable constitutional laws enforce Law U14 (pure, deterministic parameter contracts with zero duplicate aliases) and Law U15 (human-readable plain English). AI agents working on RexOne are bound by these rules, ensuring clean architecture, 100% test parity, and zero zombie code.",
  },
  {
    question:
      "What is the best SaaS boilerplate for building both web and mobile apps together?",
    answer:
      "RexOne is specifically built as a tri-platform foundation. It orchestrates a React 19 web app and a Flutter 3 native mobile client from a unified Rails 8 API backbone. Both clients share identical WebSocket channels, notification models, localized translations, and design system tokens out of the box.",
  },
];

export const FaqSection: React.FC<IFaqSectionProps> = ({
  id,
  className = "",
  variant = "general",
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const isComparison = variant === "comparison";
  const sectionId = id || (isComparison ? "faq" : "FAQ");
  const faqs = isComparison ? COMPARISON_FAQS : GENERAL_FAQS;

  const badgeText = isComparison
    ? "Starter Kit & Boilerplate FAQs"
    : "Architectural Clarity & FAQs";

  const headingText = isComparison
    ? "Comparison Frequently Asked Questions"
    : "Frequently Asked Questions";

  const descriptionText = isComparison
    ? "Unvarnished, factual comparisons between RexOne and commercial SaaS boilerplates ($169–$799)."
    : "Unvarnished, factual answers for founders, software engineers, and AI coding agents.";

  return (
    <section
      id={sectionId}
      className={`py-12 scroll-mt-24 space-y-8 font-primary ${className}`}
      aria-label={headingText}
    >
      <div className="text-center space-y-3 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/40 bg-primary/15 text-primary-light backdrop-blur-md shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.3)]">
          <iconsLib.sparkles className="w-4 h-4 text-primary drop-shadow-[0_0_6px_var(--color-primary)]" />
          <span className="text-xs font-bold tracking-wider uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            {badgeText}
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-glow-white [text-shadow:0_0_8px_var(--color-glow-white),0_0_20px_var(--color-primary),0_0_40px_var(--color-primary-dark)]">
          {headingText}
        </h2>
        <p className="text-sm sm:text-base text-base-content/80">
          {descriptionText}
        </p>
      </div>

      {/* Accordion Questions */}
      <div className="space-y-3.5 max-w-4xl mx-auto px-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-2xl bg-glass-card/90 border border-glass-border backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-glass-border-hover hover:bg-glass-card-hover"
          >
            <button
              type="button"
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-primary-light transition-colors cursor-pointer"
              aria-expanded={activeFaq === i}
            >
              <span>{faq.question}</span>
              <iconsLib.chevronDown
                className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                  activeFaq === i ? "rotate-180 text-primary" : "text-base-content/50"
                }`}
              />
            </button>
            {activeFaq === i && (
              <div className="px-6 pb-5 pt-1 text-sm text-base-content/90 leading-relaxed border-t border-glass-border/40 font-primary">
                {faq.answer}
              </div>
            )}
          </div>
        ))}

        {/* Cross-Link / Redirect Banner between Landing FAQs and VS FAQs */}
        <div className="pt-3">
          {isComparison ? (
            <div className="rounded-2xl bg-linear-to-r from-primary/15 via-primary/10 to-transparent border border-primary/40 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.2)]">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-11 h-11 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.4)]">
                  <iconsLib.sparkles className="w-5 h-5 text-primary-light" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-white">
                    Looking for General Platform &amp; Architecture FAQs?
                  </h3>
                  <p className="text-xs sm:text-sm text-base-content/80 mt-0.5">
                    Explore Rails 8, React 19, Flutter 3, Garage S3, and Discipline-Driven Development details.
                  </p>
                </div>
              </div>
              <TextLink
                to={`${AppRoutes.client.public.ROOT}#FAQ`}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm hover:bg-primary-dark transition-all shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)] hover:scale-105 inline-flex items-center gap-2 no-underline cursor-pointer"
              >
                <span>View General FAQs</span>
                <iconsLib.chevronRight className="w-4 h-4" />
              </TextLink>
            </div>
          ) : (
            <div className="rounded-2xl bg-linear-to-r from-primary/15 via-primary/10 to-transparent border border-primary/40 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.2)]">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-11 h-11 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.4)]">
                  <iconsLib.chartBar className="w-5 h-5 text-primary-light" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-white">
                    Looking for Starter Kit &amp; Boilerplate Comparisons?
                  </h3>
                  <p className="text-xs sm:text-sm text-base-content/80 mt-0.5">
                    Comparing RexOne against ShipFast, Makerkit, Supastarter, Jumpstart Pro, SaaS Pegasus, and more?
                  </p>
                </div>
              </div>
              <TextLink
                to={`${AppRoutes.client.public.VS}#faq`}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm hover:bg-primary-dark transition-all shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)] hover:scale-105 inline-flex items-center gap-2 no-underline cursor-pointer"
              >
                <span>View Comparison FAQs</span>
                <iconsLib.chevronRight className="w-4 h-4" />
              </TextLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
