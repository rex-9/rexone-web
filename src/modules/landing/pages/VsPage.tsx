// src/modules/landing/pages/VsPage.tsx

import React, { useEffect, useState } from "react";
import { icons, iconsLib, images } from "../../../assets";
import AppRoutes from "../../../AppRoutes";
import {
  Asset,
  Button,
  ButtonVariants,
  ComponentSizes,
  TextLink,
} from "../../../design";
import { FaqSection, LandingFooter } from "../components";

export interface ICompetitorInfo {
  id: string;
  name: string;
  price: string;
  creator: string;
  stack: string;
  target: string;
  pros: string[];
  cons: string[];
  whyRexOneWins: string;
}

export const ALL_COMPETITORS: ICompetitorInfo[] = [
  {
    id: "shipfast",
    name: "ShipFast",
    price: "$199 One-Time",
    creator: "Marc Lou",
    stack: "Next.js (App Router) + MongoDB / Supabase + Stripe + DaisyUI",
    target: "Solo indie hackers building quick web MVPs",
    pros: [
      "Fast initial setup for simple websites",
      "Active Twitter community",
      "Pre-built landing page blocks",
    ],
    cons: [
      "Web only (Zero mobile apps)",
      "No background queues (Serverless function timeouts)",
      "No enterprise IAM/RBAC",
      "No AI agent coding rules (Unguided vibe coding)",
    ],
    whyRexOneWins:
      "RexOne provides a true sovereign Tri-Platform foundation (Rails 8 API + React 19 Web + Flutter 3 Mobile with Drift SQLite offline sync) for $0 free, governed by immutable constitutional laws (LAW.md).",
  },
  {
    id: "makerkit",
    name: "Makerkit",
    price: "$199 – $649",
    creator: "Giancarlo Buomprisco",
    stack: "Next.js / Remix + Supabase / Firebase + Stripe / Paddle",
    target: "B2B SaaS multi-tenant web applications",
    pros: [
      "Multi-tenancy and team accounts",
      "Stripe & Lemon Squeezy billing",
      "Modern Turborepo layout",
    ],
    cons: [
      "Web only",
      "Expensive proprietary license",
      "Heavy lock-in to proprietary BaaS cloud bills",
      "No native mobile app",
    ],
    whyRexOneWins:
      "RexOne is 100% free under Apache 2.0 with zero SaaS subscription paywalls, includes a 60fps Flutter mobile app, and runs sovereign PostgreSQL 18 with Solid Queue and self-hosted Garage S3.",
  },
  {
    id: "supastarter",
    name: "Supastarter",
    price: "$199 – $599",
    creator: "Jonathan Wilke",
    stack: "Next.js 15 / Nuxt 3 + Supabase + Prisma / Drizzle + Stripe",
    target: "Modern TypeScript developers building SaaS",
    pros: [
      "Clean TypeScript architecture",
      "Built-in i18n localization",
      "Stripe and Lemon Squeezy",
    ],
    cons: [
      "Web only",
      "Strict 10s edge function execution limits",
      "No relational offline sync",
      "Paid commercial license per project",
    ],
    whyRexOneWins:
      "RexOne delivers cross-platform contract parity across React 19 and Flutter 3, with durable background processing (Solid Queue Fibers), relational offline caching (Drift), and zero licensing costs.",
  },
  {
    id: "jumpstart",
    name: "Jumpstart Pro",
    price: "$249/yr · $749",
    creator: "Chris Oliver (GoRails)",
    stack: "Ruby on Rails 8 + Hotwire (Turbo + Stimulus) + Devise + Stripe",
    target: "Ruby on Rails teams and solo founders",
    pros: [
      "Mature Rails ecosystem",
      "Multi-tenancy and billing via Pay gem",
      "Turbo Native mobile wrappers",
    ],
    cons: [
      "Turbo Native is just webviews in a frame, not compiled native reactive UI",
      "Monolithic server-rendered views without modern React SPA",
      "Closed-source paid seat license",
    ],
    whyRexOneWins:
      "RexOne separates concerns cleanly: an API-first Rails 8 Core + modern React 19 SPA + pure compiled Flutter 3 mobile app (not a sluggish webview). Plus, RexOne is 100% free and open-source.",
  },
  {
    id: "saasPegasus",
    name: "SaaS Pegasus",
    price: "$295 – $795",
    creator: "Cory Zue",
    stack: "Python / Django + React / HTMX + Celery + Stripe",
    target: "Python and AI software engineers",
    pros: [
      "Battle-tested Django backend",
      "OpenAPI docs",
      "Celery background tasks",
    ],
    cons: [
      "Web only (No mobile client)",
      "Monolithic architecture",
      "High cost for single-site licenses",
      "Redis hosting overhead",
    ],
    whyRexOneWins:
      "RexOne provides full native mobile coverage (Flutter 3), zero-Redis concurrency via Solid Queue on Postgres 18, self-hosted Garage S3 storage, and Apache 2.0 open-source sovereignty.",
  },
  {
    id: "bulletTrain",
    name: "Bullet Train",
    price: "$0 · $995 Pro",
    creator: "Andrew Culver",
    stack: "Ruby on Rails + Hotwire + Devise + CanCanCan",
    target: "Rails teams building complex multi-tenant apps",
    pros: [
      "Deep multi-tenant team scaffolding",
      "Open-source core",
      "Strong code generation",
    ],
    cons: [
      "Steep learning curve and complex DSL",
      "Rails monolith with no native mobile client",
      "Heavily paywalled Pro features",
    ],
    whyRexOneWins:
      "RexOne avoids complex framework DSLs by following plain English (Law U15) and pure parameter contracts (Law U14), with complete React 19 and Flutter 3 parity included freely.",
  },
  {
    id: "larafast",
    name: "Larafast & Spark",
    price: "$99 – $169",
    creator: "Sergei & Taylor Otwell",
    stack: "PHP / Laravel + Livewire / Vue + Stripe",
    target: "PHP and Laravel developers",
    pros: [
      "Familiar Laravel ecosystem",
      "Stripe billing scaffolding",
      "Clean admin layouts",
    ],
    cons: [
      "PHP web-only runtime",
      "No mobile apps",
      "Closed source paid per-domain licenses",
      "Redis queue requirement",
    ],
    whyRexOneWins:
      "RexOne provides a modern polyglot triad (Rails 8 API + React 19 SPA + Flutter 3 Mobile) with self-hosted S3 and zero external queue dependencies.",
  },
  {
    id: "openSaas",
    name: "Open SaaS & Indie Clones",
    price: "100% Free OSS",
    creator: "Wasp & Community",
    stack: "Wasp / Next.js + React + Node + Prisma",
    target: "Hobbyists and open-source experimenters",
    pros: ["Free open-source options", "Simple starter code"],
    cons: [
      "Incomplete architecture (missing enterprise RBAC, media pipelines, telemetry)",
      "No native mobile apps",
      "No AI agent coding laws",
    ],
    whyRexOneWins:
      "RexOne is an enterprise-grade reference foundation with 1,785+ passing tests, 23-resource RBAC, self-hosted S3, and strict constitutional AI agent rules.",
  },
];

export interface IComparisonRow {
  feature: string;
  category: string;
  rexone: string;
  rexoneHighlight: boolean;
  shipfast: string;
  makerkit: string;
  supastarter: string;
  jumpstart: string;
  saasPegasus: string;
  bulletTrain: string;
  larafast: string;
  openSaas: string;
}

export const COMPARISON_DATA: IComparisonRow[] = [
  {
    feature: "Supported Platforms",
    category: "Architecture",
    rexone: "Tri-Platform (Rails 8 API + React 19 Web + Flutter 3 Mobile)",
    rexoneHighlight: true,
    shipfast: "Next.js Web Only (No Mobile)",
    makerkit: "Next.js / Remix Web Only",
    supastarter: "Next.js / Nuxt Web Only",
    jumpstart: "Rails Web + Turbo Webview",
    saasPegasus: "Django Web Only",
    bulletTrain: "Rails Monolith Web Only",
    larafast: "Laravel Web Only",
    openSaas: "Next.js Web Only",
  },
  {
    feature: "Pricing & License",
    category: "Cost & Sovereignty",
    rexone: "100% Free & Open-Source (Apache 2.0)",
    rexoneHighlight: true,
    shipfast: "$169 – $299 Paid (Proprietary)",
    makerkit: "$299 – $699 Paid (Proprietary)",
    supastarter: "$299 – $599 Paid (Proprietary)",
    jumpstart: "$249/yr or $749 Paid",
    saasPegasus: "$295 – $795 Paid (Proprietary)",
    bulletTrain: "$0 Core / $995 Pro",
    larafast: "$99 – $199 Paid",
    openSaas: "Free / $99 Paid",
  },
  {
    feature: "Native Mobile App",
    category: "Mobile",
    rexone:
      "Native Flutter 3 (iOS & Android) with Drift SQLite offline sync & Biometrics",
    rexoneHighlight: true,
    shipfast: "None",
    makerkit: "None",
    supastarter: "None",
    jumpstart: "Turbo Native (Webview wrapper)",
    saasPegasus: "None",
    bulletTrain: "None",
    larafast: "None",
    openSaas: "None",
  },
  {
    feature: "Offline Relational Persistence",
    category: "Mobile",
    rexone:
      "Drift SQLite (rexone_offline) with schema mirroring & AES-256 saves",
    rexoneHighlight: true,
    shipfast: "None (Breaks on disconnect)",
    makerkit: "None",
    supastarter: "None",
    jumpstart: "None (Webview requires network)",
    saasPegasus: "None",
    bulletTrain: "None",
    larafast: "None",
    openSaas: "None",
  },
  {
    feature: "AI Agent Constitution & Rules",
    category: "AI Governance",
    rexone:
      "Strict Constitutional Laws (LAW.md, AGENTS.md, Law U14 Pure Contracts, Law U15 Plain English)",
    rexoneHighlight: true,
    shipfast: "None (Unguided Vibe Coding)",
    makerkit: "Generic AI prompt docs",
    supastarter: "Generic cursor rules",
    jumpstart: "Standard conventions only",
    saasPegasus: "Standard developer docs",
    bulletTrain: "None",
    larafast: "None",
    openSaas: "None",
  },
  {
    feature: "Backend Engine & Concurrency",
    category: "Architecture",
    rexone:
      "Rails 8 API + Postgres 18 + Solid Queue (50 Fibers + 2 Threads, Zero Redis)",
    rexoneHighlight: true,
    shipfast: "Serverless Route Handlers (Timeouts)",
    makerkit: "Next.js Route Handlers + Supabase",
    supastarter: "Next.js Route Handlers + Supabase",
    jumpstart: "Rails 8 + Solid Queue / Sidekiq",
    saasPegasus: "Django + Celery + Redis",
    bulletTrain: "Rails + Sidekiq + Redis",
    larafast: "Laravel Queues + Redis",
    openSaas: "Node.js basic runtime",
  },
  {
    feature: "Object Storage Architecture",
    category: "Infrastructure",
    rexone:
      "Self-Hosted Garage S3 (Port 3100) or AWS S3 with zero egress bills",
    rexoneHighlight: true,
    shipfast: "Manual S3 / Cloudinary",
    makerkit: "Supabase Storage or AWS S3",
    supastarter: "Supabase Storage or AWS S3",
    jumpstart: "ActiveStorage cloud buckets",
    saasPegasus: "Cloud Storage",
    bulletTrain: "ActiveStorage cloud",
    larafast: "Flysystem cloud",
    openSaas: "Local or AWS S3",
  },
  {
    feature: "WebSockets & Real-Time Sync",
    category: "Real-Time",
    rexone: "ActionCable & Solid Cable native bidirectional WebSockets",
    rexoneHighlight: true,
    shipfast: "None out of the box",
    makerkit: "Supabase Realtime only",
    supastarter: "Supabase Realtime only",
    jumpstart: "ActionCable + Redis / Cable",
    saasPegasus: "Optional Channels setup",
    bulletTrain: "ActionCable + Redis",
    larafast: "Pusher / Reverb (Extra setup)",
    openSaas: "Basic socket demo",
  },
  {
    feature: "IAM & Role-Based Access Control",
    category: "Security",
    rexone:
      "Stateless JWT with JTI Atomic Revocation + 23-Resource Hierarchical RBAC (96+ permissions)",
    rexoneHighlight: true,
    shipfast: "NextAuth / Basic email magic links",
    makerkit: "Supabase / Firebase Auth (Teams)",
    supastarter: "Supabase Auth (Basic roles)",
    jumpstart: "Devise + Pundit (Teams)",
    saasPegasus: "Django standard permissions",
    bulletTrain: "CanCanCan + Teams",
    larafast: "Laravel Breeze / Jetstream",
    openSaas: "Basic user auth",
  },
  {
    feature: "Billing & Monetization",
    category: "Monetization",
    rexone:
      "Stripe Subscriptions + One-Time Purchases + Promotional Coupon Engine",
    rexoneHighlight: true,
    shipfast: "Stripe Checkout / Lemon Squeezy",
    makerkit: "Stripe / Lemon Squeezy",
    supastarter: "Stripe / Lemon Squeezy",
    jumpstart: "Stripe / Paddle Subscriptions",
    saasPegasus: "Stripe Subscriptions",
    bulletTrain: "Stripe Subscriptions",
    larafast: "Stripe / Lemon Squeezy",
    openSaas: "Stripe Checkout",
  },
  {
    feature: "Multi-Channel Notifications",
    category: "Communications",
    rexone:
      "Unified Pipeline: In-App WebSockets + OneSignal Push + Brevo Transactional Email",
    rexoneHighlight: true,
    shipfast: "Mailgun / Postmark basic email only",
    makerkit: "Resend email only",
    supastarter: "Resend email only",
    jumpstart: "Action Mailer email only",
    saasPegasus: "Django email backends",
    bulletTrain: "Action Mailer email only",
    larafast: "Laravel Mail email only",
    openSaas: "Basic email",
  },
  {
    feature: "Automated Test Coverage",
    category: "Quality Assurance",
    rexone:
      "100% Comprehensive: Vitest, Playwright E2E User Journeys, Rails Minitest, Flutter Tests",
    rexoneHighlight: true,
    shipfast: "Zero automated tests",
    makerkit: "Partial unit tests",
    supastarter: "Partial component tests",
    jumpstart: "Minitest suite",
    saasPegasus: "Django unit test suite",
    bulletTrain: "Minitest suite",
    larafast: "Pest / PHPUnit basic",
    openSaas: "Zero or minimal tests",
  },
];

export { COMPARISON_FAQS } from "../components/FaqSection";

export const VsPage: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const vsNavItems = [
    { label: "Starter Kits", href: "#starter-kits" },
    { label: "Matrix", href: "#matrix" },
    { label: "Comparison FAQs", href: "#faq" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const categories = [
    "All",
    "Architecture",
    "Cost & Sovereignty",
    "Mobile",
    "AI Governance",
    "Infrastructure",
    "Security",
    "Monetization",
  ];

  const filteredRows =
    filterCategory === "All"
      ? COMPARISON_DATA
      : COMPARISON_DATA.filter((row) => row.category === filterCategory);

  // Set page title and metadata on mount
  useEffect(() => {
    const originalTitle = document.title;
    document.title =
      "RexOne VS Page: Best SaaS Boilerplates & Starter Kits Compared (2026)";

    // Enforce night theme for consistent branding
    const prevTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "night");

    if (window.location.hash) {
      const targetId = window.location.hash.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }

    return () => {
      document.title = originalTitle;
      if (prevTheme) {
        document.documentElement.setAttribute("data-theme", prevTheme);
      }
    };
  }, []);

  return (
    <div
      data-page="landing"
      data-theme="night"
      className="min-h-screen w-full text-glow-white font-primary selection:bg-primary selection:text-primary-content bg-repeat bg-fixed relative"
      style={{
        backgroundImage: `url(${images.darkBrickWall.src})`,
        cursor: `url(${images.spotCursor.src}) 15 15, auto`,
      }}
    >
      <style>{`
        [data-page="landing"],
        [data-page="landing"] a,
        [data-page="landing"] button,
        [data-page="landing"] input,
        [data-page="landing"] textarea,
        [data-page="landing"] select {
          cursor: url(${images.spotCursor.src}) 15 15, auto !important;
        }
      `}</style>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-glass-border bg-glass-nav backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-between w-full">
            {/* Left: Brand Logo & Wordmark */}
            <TextLink
              to={AppRoutes.client.public.ROOT}
              className="flex items-center gap-3 no-underline select-none group text-base-content! hover:no-underline"
              aria-label="RexOne Home"
            >
              <Asset
                asset={icons.logo}
                className="h-8 sm:h-9 w-8 sm:w-9 shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.6)]"
              />
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-glow-white [text-shadow:0_0_7px_var(--color-glow-white),0_0_15px_rgba(var(--color-primary-rgb),0.85),0_0_30px_rgba(var(--color-primary-rgb),0.5)]">
                  RexOne
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-primary/15 text-primary-light border border-primary/30">
                  VS
                </span>
              </div>
            </TextLink>

            {/* Middle: Navigation Links (matching Home Nav Bar) */}
            <div className="flex items-center space-x-6 lg:space-x-8 font-primary text-sm sm:text-[15px] font-medium tracking-normal text-base-content">
              {vsNavItems.map((item) => (
                <TextLink
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-base-content/75! hover:text-white! transition-colors duration-200 hover:no-underline"
                >
                  {item.label}
                </TextLink>
              ))}
            </div>

            {/* Right: Star Button (Styled like the Enter button on Home Landing Page) */}
            <Button
              href="https://github.com/rex-9/rexone-core"
              target="_blank"
              rel="noopener noreferrer"
              variant={ButtonVariants.PRIMARY}
              size={ComponentSizes.SM}
              className="font-semibold shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)] px-5 py-2 text-sm inline-flex items-center gap-2"
            >
              <iconsLib.sparkles className="w-4 h-4 text-warning fill-warning" />
              <span>Star on GitHub</span>
            </Button>
          </nav>

          {/* Mobile Navigation Header */}
          <div className="flex md:hidden items-center justify-between w-full h-full">
            {/* Left: Brand Logo & Title */}
            <TextLink
              to={AppRoutes.client.public.ROOT}
              className="flex items-center gap-2.5 no-underline select-none text-base-content! hover:no-underline"
              aria-label="RexOne Home"
            >
              <Asset
                asset={icons.logo}
                className="h-8 w-8 shrink-0 select-none drop-shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.6)]"
              />
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-glow-white [text-shadow:0_0_7px_var(--color-glow-white),0_0_15px_rgba(var(--color-primary-rgb),0.85),0_0_30px_rgba(var(--color-primary-rgb),0.5)]">
                  RexOne
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase bg-primary/15 text-primary-light border border-primary/30">
                  VS
                </span>
              </div>
            </TextLink>

            {/* Right: Star & Toggle */}
            <div className="flex items-center gap-2">
              <Button
                href="https://github.com/rex-9/rexone-core"
                target="_blank"
                rel="noopener noreferrer"
                variant={ButtonVariants.PRIMARY}
                size={ComponentSizes.SM}
                className="py-1.5! px-3! text-xs font-semibold font-primary inline-flex items-center gap-1.5 shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.35)]"
              >
                <iconsLib.sparkles className="w-3.5 h-3.5 text-warning fill-warning" />
                <span>Star</span>
              </Button>

              <Button
                variant={ButtonVariants.TERTIARY}
                aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1! text-base-content bg-transparent! border-0 shadow-none hover:bg-transparent! focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <iconsLib.close className="w-7 h-7 text-primary" />
                ) : (
                  <iconsLib.menu className="w-7 h-7 text-primary" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-glass-nav backdrop-blur-2xl border-b border-glass-border-hover py-4 px-6">
            <div className="flex flex-col space-y-3 text-center font-primary text-base font-medium">
              {vsNavItems.map((item) => (
                <TextLink
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="py-2 text-base-content/75! hover:text-white! transition-colors duration-200 hover:no-underline"
                >
                  {item.label}
                </TextLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-12 md:pt-16 pb-0 flex-1">
        <div className="space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-6 max-w-4xl mx-auto font-primary">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/40 bg-primary/15 text-primary-light shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.3)]">
              <iconsLib.sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                2026 SaaS Boilerplate &amp; Starter Kit Master Guide
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-wide sm:tracking-wider text-glow-white [text-shadow:0_0_8px_var(--color-glow-white),0_0_20px_var(--color-primary),0_0_40px_var(--color-primary-dark)] leading-tight">
              RexOne VS. <br /> SaaS Starter Universe
            </h1>

            <p className="text-sm sm:text-base text-base-content/90 max-w-3xl mx-auto leading-relaxed font-primary">
              Looking for a sovereign, open-source{" "}
              <strong>ShipFast alternative</strong>?{" "}
              <strong className="text-primary-light font-bold">RexOne</strong>{" "}
              is the premier 100% free, Apache 2.0 open-source alternative to
              paid boilerplates like ShipFast ($169–$299) and Makerkit
              ($199–$649). RexOne is not merely competing with boilerplates — it
              is competing with entire platform teams. Comparing RexOne to
              single-framework templates is like comparing a loaded aircraft
              carrier to a speedboat: while they charge hundreds of dollars for
              single-framework templates, RexOne equips you with a complete
              sovereign tri-platform foundation spanning{" "}
              <strong className="text-white">
                Rails 8 API, React 19 Web, and Flutter 3 Mobile
              </strong>{" "}
              — governed by immutable constitutional laws for AI coding agents
              under Discipline-Driven Development. Compare features, pricing,
              and architecture trade-offs below.
            </p>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 max-w-4xl mx-auto font-primary">
              <div className="p-4 sm:p-5 rounded-2xl bg-glass-card/90 border border-glass-border backdrop-blur-xl text-center hover:border-primary/50 hover:bg-glass-card-hover hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.25)] transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary font-display drop-shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.6)]">
                  $0
                </div>
                <div className="text-xs text-white/80 mt-1 font-medium">
                  100% Free &amp; Open-Source
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-glass-card/90 border border-glass-border backdrop-blur-xl text-center hover:border-primary/50 hover:bg-glass-card-hover hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.25)] transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                  3 Stacks
                </div>
                <div className="text-xs text-white/80 mt-1 font-medium">
                  Rails 8 + React 19 + Flutter
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-glass-card/90 border border-glass-border backdrop-blur-xl text-center hover:border-primary/50 hover:bg-glass-card-hover hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.25)] transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-extrabold text-accent font-display drop-shadow-[0_0_12px_rgba(var(--color-accent-rgb),0.6)]">
                  0 Shims
                </div>
                <div className="text-xs text-white/80 mt-1 font-medium">
                  Zero Tech Debt (LAW.md)
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-glass-card/90 border border-glass-border backdrop-blur-xl text-center hover:border-primary/50 hover:bg-glass-card-hover hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.25)] transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-extrabold text-warning font-display drop-shadow-[0_0_12px_rgba(var(--color-warning-rgb),0.6)]">
                  9 Months
                </div>
                <div className="text-xs text-white/80 mt-1 font-medium">
                  Time Saved to Launch
                </div>
              </div>
            </div>
          </section>

          {/* Starter Kits Spotlight Cards Grid */}
          <section id="starter-kits" className="space-y-6 font-primary">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wide">
                Every Major SaaS Starter Kit Analyzed &amp; Compared
              </h2>
              <p className="text-base-content/80 text-sm sm:text-base max-w-2xl mx-auto">
                We left nobody behind. Here is how RexOne compares against every
                prominent starter kit in the software engineering landscape:
              </p>
            </div>

            {/* Heartfelt Shoutout & Gratitude to Fellow Builders */}
            <div className="rounded-2xl bg-glass-card/90 border border-primary/30 p-4 sm:p-4.5 backdrop-blur-xl shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.12)] max-w-4xl mx-auto text-left flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.25)]">
                <iconsLib.heart className="w-4.5 h-4.5 text-primary-light fill-primary/30" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-primary-light">
                    Independent Craftsman Shoutout
                  </span>
                  <span className="text-white/30 hidden sm:inline">•</span>
                  <span className="text-xs text-white/60">
                    Respect to Fellow Builders
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-base-content/85 leading-relaxed">
                  RexOne is built 100% independently from scratch under{" "}
                  <code className="text-primary-light font-mono text-[11px] sm:text-xs">
                    LAW.md
                  </code>{" "}
                  ~ not derived from any template. We have pure respect for
                  fellow makers like{" "}
                  <strong className="text-white">Marc Lou</strong>,{" "}
                  <strong className="text-white">Giancarlo</strong>,{" "}
                  <strong className="text-white">Jonathan</strong>,{" "}
                  <strong className="text-white">Chris</strong>,{" "}
                  <strong className="text-white">Cory</strong>,{" "}
                  <strong className="text-white">Andrew</strong>,{" "}
                  <strong className="text-white">Sergei &amp; Taylor</strong>,
                  and the <strong className="text-white">Wasp community</strong>
                  . Shipping software takes immense grit, and we celebrate their
                  success. RexOne isn&apos;t here to compete... just offering an
                  open, free tri-platform home. Much love to all builders! 🤝💖
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5 items-stretch">
              {ALL_COMPETITORS.map((comp) => (
                <div
                  key={comp.id}
                  className="group relative rounded-2xl border border-glass-border bg-glass-card/90 backdrop-blur-xl p-4 sm:p-4.5 flex flex-col justify-between transition-all duration-300 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.25)] hover:-translate-y-1 font-primary h-full"
                >
                  {/* Top Section: Title, Creator Tribute, Target, and Flaws */}
                  <div className="space-y-2.5">
                    {/* Title & Price Row */}
                    <div className="flex items-start justify-between gap-2 min-h-9.5">
                      <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-primary-light transition-colors leading-tight line-clamp-2">
                        {comp.name}
                      </h3>
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary/15 text-primary-light border border-primary/30">
                        {comp.price}
                      </span>
                    </div>

                    {/* Creator Appreciation Tag */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono leading-none">
                      <span className="text-white/50 text-[10px]">
                        Crafted by
                      </span>
                      <span className="font-semibold text-primary-light">
                        {comp.creator}
                      </span>
                      <span className="text-[11px]">👏</span>
                    </div>

                    {/* Target Audience Row */}
                    <div className="text-[11px] sm:text-xs text-base-content/75 leading-snug line-clamp-1 min-h-4.5">
                      {comp.target}
                    </div>

                    {/* Critical Flaws Box */}
                    <div className="rounded-xl bg-[#16050a]/90 border border-rose-500/25 p-3 space-y-1.5 min-h-26.25 flex flex-col justify-start">
                      <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 shrink-0">
                        <span className="text-xs">⚠️</span>
                        <span>Critical Flaws</span>
                      </div>
                      <ul className="space-y-1 text-xs text-rose-300/90 leading-snug">
                        {comp.cons.slice(0, 2).map((con, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold shrink-0 leading-tight">
                              ✕
                            </span>
                            <span className="line-clamp-2">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Section: Why RexOne Wins Box Aligned to Bottom */}
                  <div className="mt-2.5">
                    <div className="rounded-xl bg-primary/15 border border-primary/35 p-3 space-y-1 text-xs leading-relaxed min-h-30 flex flex-col justify-start">
                      <div className="font-bold text-white flex items-center gap-1.5 text-xs shrink-0">
                        <span>🛡️</span>
                        <span className="text-primary-light font-display">
                          Why RexOne Wins
                        </span>
                      </div>
                      <p className="text-white/90 text-[11px] sm:text-xs leading-relaxed">
                        {comp.whyRexOneWins}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Feature Comparison Table */}
          <section id="matrix" className="space-y-6 font-primary">
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wide">
                  Master Architectural Comparison Matrix
                </h2>
                <p className="text-sm text-base-content/80 mt-1">
                  Uncompromising side-by-side comparison across all 8 major
                  starter kits and alternative platforms.
                </p>
              </div>

              {/* Category Filter Pills: Clean, organized flex layout */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-mono uppercase tracking-wider text-base-content/60 mr-1 hidden sm:inline">
                  Filter by Category:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                      filterCategory === cat
                        ? "bg-primary text-white font-bold shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.6)] border border-primary-light scale-[1.02]"
                        : "bg-primary/15 text-primary-light/90 border border-primary/30 hover:bg-primary/25 hover:text-white hover:border-primary/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-glass-border bg-glass-card/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] scrollbar-thin">
              <table className="w-full text-left text-xs sm:text-sm min-w-[2760px] border-separate border-spacing-0">
                <thead className="bg-glass-card backdrop-blur-xl border-b border-glass-border font-mono text-xs uppercase tracking-wider text-base-content/80">
                  <tr>
                    <th className="py-4 px-4 sm:px-6 w-48 sm:w-60 min-w-48 sm:min-w-60 max-w-48 sm:max-w-60 sticky left-0 z-40 bg-[#16050a] border-r border-b border-glass-border text-white">
                      Capability
                    </th>
                    <th className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 md:sticky md:left-59.5 z-40 text-primary-light font-bold bg-[#260811] border-r border-b border-glass-border shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
                      🛡️ RexOne (100% Free)
                    </th>
                    <th className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 border-b border-glass-border">
                      ⚡ ShipFast
                    </th>
                    <th className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 border-b border-glass-border">
                      🏢 Makerkit
                    </th>
                    <th className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 border-b border-glass-border">
                      🚀 Supastarter
                    </th>
                    <th className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 border-b border-glass-border">
                      🚂 Jumpstart Pro
                    </th>
                    <th className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 border-b border-glass-border">
                      🦄 SaaS Pegasus
                    </th>
                    <th className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 border-b border-glass-border">
                      🚄 Bullet Train
                    </th>
                    <th className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 border-b border-glass-border">
                      ⚡ Larafast &amp; Spark
                    </th>
                    <th className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 border-b border-glass-border">
                      🌐 Open SaaS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border/40 font-primary">
                  {filteredRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-primary/10 transition-colors group"
                    >
                      <td className="py-4 px-4 sm:px-6 w-48 sm:w-60 min-w-48 sm:min-w-60 max-w-48 sm:max-w-60 sticky left-0 z-30 bg-[#16050a] border-r border-b border-glass-border/40 group-hover:bg-[#1f070e] transition-colors">
                        <div className="font-semibold text-white">
                          {row.feature}
                        </div>
                        <span className="text-[10px] font-mono text-primary-light/80 uppercase">
                          {row.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 md:sticky md:left-59.5 z-30 bg-[#22070f] border-r border-b border-glass-border/40 font-semibold text-white group-hover:bg-[#2b0a14] transition-colors shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
                        <div className="flex items-start gap-1.5">
                          <span className="text-primary font-bold">✓</span>
                          <span>{row.rexone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 text-base-content/80 border-b border-glass-border/40">
                        {row.shipfast}
                      </td>
                      <td className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 text-base-content/80 border-b border-glass-border/40">
                        {row.makerkit}
                      </td>
                      <td className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 text-base-content/80 border-b border-glass-border/40">
                        {row.supastarter}
                      </td>
                      <td className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 text-base-content/80 border-b border-glass-border/40">
                        {row.jumpstart}
                      </td>
                      <td className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 text-base-content/80 border-b border-glass-border/40">
                        {row.saasPegasus}
                      </td>
                      <td className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 text-base-content/80 border-b border-glass-border/40">
                        {row.bulletTrain}
                      </td>
                      <td className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 text-base-content/80 border-b border-glass-border/40">
                        {row.larafast}
                      </td>
                      <td className="py-4 px-4 sm:px-6 w-70 min-w-70 max-w-70 text-base-content/80 border-b border-glass-border/40">
                        {row.openSaas}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Comparison FAQs Section */}
          <FaqSection variant="comparison" id="faq" />

          {/* Bottom CTA Banner */}
          <section className="p-8 sm:p-12 rounded-3xl bg-glass-card/95 border border-primary/50 backdrop-blur-xl text-center space-y-6 shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.25)] font-primary">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-glow-white [text-shadow:0_0_8px_var(--color-glow-white),0_0_20px_var(--color-primary),0_0_40px_var(--color-primary-dark)]">
              Start from One. Not from Zero.
            </h2>
            <p className="text-base-content/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Bypass 6 to 9 months of repetitive infrastructure slog. Fork
              RexOne today to maintain your sovereign codebase while receiving
              upstream architectural updates and framework enhancements directly
              into your downstream repo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
              <Button
                href="https://github.com/rex-9/rexone-core/fork"
                target="_blank"
                rel="noopener noreferrer"
                variant={ButtonVariants.SECONDARY}
                size={ComponentSizes.LG}
                className="w-full sm:w-auto font-semibold px-6 sm:px-8 py-3 text-sm sm:text-base text-center justify-center"
              >
                Fork on GitHub 🍴
              </Button>
              <Button
                href="https://github.com/sponsors/rex-9"
                target="_blank"
                rel="noopener noreferrer"
                variant={ButtonVariants.NEON}
                size={ComponentSizes.LG}
                className="w-full sm:w-auto font-bold px-6 sm:px-8 py-3 text-sm sm:text-base shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.5)] text-center justify-center"
              >
                Support &amp; Sponsor 💖
              </Button>
              <Button
                href="https://github.com/rex-9/rexone-core"
                target="_blank"
                rel="noopener noreferrer"
                variant={ButtonVariants.PRIMARY}
                size={ComponentSizes.LG}
                className="w-full sm:w-auto font-semibold px-6 sm:px-8 py-3 text-sm sm:text-base text-center justify-center inline-flex items-center gap-2"
              >
                <iconsLib.sparkles className="w-4 h-4 text-warning fill-warning" />
                <span>Star on GitHub</span>
              </Button>
            </div>
          </section>
        </div>

        {/* Unified Footer Component (Source of Truth) */}
        <LandingFooter activePage="vs" />
      </main>
    </div>
  );
};

export default VsPage;
