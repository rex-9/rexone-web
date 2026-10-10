// src/modules/landing/components/FeatureShowcase.tsx

import React, { useState, useMemo } from "react";
import { iconsLib } from "../../../assets";

export interface IFeaturePillar {
  id: string;
  icon: keyof typeof iconsLib;
  title: string;
  badge: string;
  capabilities: string[];
  differentiator: string;
}

export interface IMasterFeature {
  id: string;
  category: string;
  name: string;
  core: boolean;
  web: boolean;
  mobile: boolean;
  description: string;
  highlight?: string;
}

const PILLARS: IFeaturePillar[] = [
  {
    id: "identity",
    icon: "key",
    title: "Identity & Security",
    badge: "Day-One Ready",
    capabilities: [
      "Devise + JWT auth with atomic JTI token revocation lists",
      "Passwordless & 6-digit email passcode verification",
      "Native Google SSO with automated account linking",
      "Active single-platform session lock (prevents concurrent logins)",
      "Self-service account & data deletion (GDPR & Apple compliant)",
    ],
    differentiator:
      "Complete zero-trust lifecycle; zero vendor lock-in to Auth0 or Clerk ($$$).",
  },
  {
    id: "iam",
    icon: "shieldCheck",
    title: "IAM & Access Control",
    badge: "96+ Permissions",
    capabilities: [
      "Granular RBAC with 96+ system permissions across 23 resources",
      "Declarative user.can?(action, resource) authorization engine",
      "UI conditional render gates (<AccessGate> & AppAccessGate)",
      "Dynamic default role assignment on initial signup",
      "Client Admin management portal to toggle roles and permissions",
    ],
    differentiator:
      "Eliminates clumsy hardcoded roles; scales seamlessly from simple app to enterprise IAM.",
  },
  {
    id: "commerce",
    icon: "banknotes",
    title: "Universal Commerce",
    badge: "Multi-Provider",
    capabilities: [
      "Stripe Checkout sessions with webhook reconciliation",
      "Recurring subscription tiers, pause, cancel, and renewal flows",
      "One-time purchases, lifetime access & multi-currency limits",
      "Dynamic discount coupons & automated user referral codes",
      "Durable entitlement ledger (Access model) decoupling billing from access",
    ],
    differentiator:
      "Multi-provider architecture; entitlement engine divorces billing vendor from access rights.",
  },
  {
    id: "queues",
    icon: "cube",
    title: "Hybrid Solid Queue",
    badge: "0 Redis Costs",
    capabilities: [
      "Hybrid concurrency: 50 concurrent Fibers + 2 isolated OS Threads",
      "Zero Redis dependency—backed directly by PostgreSQL 18",
      "Quarantined media worker isolates CPU-bound libvips & FFmpeg",
      "Dynamic workload elasticity across payments, ai, and notifications",
      "Transactional recurring cron cleanup (config/recurring.yml)",
    ],
    differentiator:
      "Blazing fast concurrency on PostgreSQL; zero extra server RAM or external Redis costs.",
  },
  {
    id: "media",
    icon: "archiveBox",
    title: "S3 Storage & Media Engine",
    badge: "Self-Hosted S3",
    capabilities: [
      "Self-hosted Garage S3 on port 3100 API / 3101 Admin with zero egress bills",
      "Async image compression (libvips) to WebP and responsive thumbnails",
      "Multi-pass video transcoding (FFmpeg) with CRF tuning & poster capture",
      "Synchronized .srt subtitle and lyric extraction linked to assets",
      "Short-lived signed playback URLs (/playback) with expiration TTL",
    ],
    differentiator:
      "100% self-hosted object storage with zero egress fees; dedicated media container prevents CPU lockup.",
  },
  {
    id: "ai",
    icon: "sparkles",
    title: "Queued AI & Speech",
    badge: "30–60% Token Savings",
    capabilities: [
      "Multi-provider LLM gateway (DeepSeek V3/V4 + Google Gemini 2.5 Flash)",
      "Universal TOON serialization (saves 30–60% tokens; no raw JSON)",
      "Durable queued background execution surviving client disconnections",
      "Telegram-style 2,000-char message chunking with split_id ordering",
      "Binary MP3 Text-to-Speech & real-time 16kHz WebSocket STT streaming",
    ],
    differentiator:
      "Saves 30–60% tokens (no raw JSON); background queued inference survives client disconnects.",
  },
  {
    id: "clients",
    icon: "devicePhoneMobile",
    title: "Native Tri-Platform",
    badge: "1,785+ Tests",
    capabilities: [
      "Rails 8.1 API + React 19 SPA + pure Flutter 3 60fps native client",
      "Dual-app store architecture: side-by-side Prod & UAT with automated CI/CD",
      "Exact contract synchronization verified across 1,785+ automated tests",
      "Full localization parity in English (en), Spanish (es), and Burmese (my)",
      "Offline-first SQLite database (Drift) with AES-GCM encrypted media",
      "Synchronized X-Platform, X-Locale, and Bearer JWT transport headers",
    ],
    differentiator:
      "Exact contract parity across Web and Mobile; true 60fps native Flutter with offline-first sync.",
  },
  {
    id: "observability",
    icon: "chartBar",
    title: "Glass-Box Observability",
    badge: "0 SaaS Tax",
    capabilities: [
      "Rails Pulse APM: live request latency, slow queries, and queue wait times",
      "Rails Error Dashboard (RED): in-app exception tracking & stack traces",
      "Client log ingestion (/v1/client/logs) capturing unhandled client errors",
      "Dual administration: internal server Administrate + Client Admin API",
      "Docker 5-container topology with automated healthchecks (/up)",
    ],
    differentiator:
      "Zero external SaaS monitoring fees (Datadog/Sentry); complete operational visibility out of the box.",
  },
];

const MASTER_FEATURES: IMasterFeature[] = [
  // 🔐 Identity & Auth
  {
    id: "auth-email-passcode",
    category: "Identity & Auth",
    name: "Email & 6-Digit Passcode Auth",
    core: true,
    web: true,
    mobile: true,
    description:
      "Passwordless and passcode registration with instant 6-digit confirmation codes.",
  },
  {
    id: "auth-google-sso",
    category: "Identity & Auth",
    name: "Google SSO & Challenge Flow",
    core: true,
    web: true,
    mobile: true,
    description:
      "Native Google Sign-In with backend token exchange and automated account linking.",
  },
  {
    id: "auth-jwt-revocation",
    category: "Identity & Auth",
    name: "JWT JTI Token Revocation",
    core: true,
    web: true,
    mobile: true,
    description:
      "Atomic revocation lists via Devise-JWT JTI database column; zero loose tokens.",
  },
  {
    id: "auth-single-session",
    category: "Identity & Auth",
    name: "Active Single-Platform Session",
    core: true,
    web: true,
    mobile: true,
    description:
      "Detects and invalidates obsolete sessions per platform automatically on new sign-ins.",
  },
  {
    id: "auth-brute-force",
    category: "Identity & Auth",
    name: "Brute-Force Rate Limiting",
    core: true,
    web: true,
    mobile: true,
    description:
      "Rack::Attack defense with escalating cooldown delays on repeated failed password attempts.",
  },
  {
    id: "auth-password-reset",
    category: "Identity & Auth",
    name: "6-Digit Password Reset Flow",
    core: true,
    web: true,
    mobile: true,
    description:
      "Timed 10-minute PIN reset lifecycle sent securely via email with token verification.",
  },
  {
    id: "auth-account-deletion",
    category: "Identity & Auth",
    name: "Self-Service Account Deletion",
    core: true,
    web: true,
    mobile: true,
    description:
      "Full GDPR & Apple Store guideline compliance; wipes user records, tokens, and storage assets.",
  },

  // 🛡️ Access Control & IAM
  {
    id: "iam-roles-permissions",
    category: "IAM & Access",
    name: "Hierarchical Roles & 96+ Permissions",
    core: true,
    web: true,
    mobile: true,
    description:
      "Fine-grained permissions mapped across 23 canonical system resources with custom action grants.",
  },
  {
    id: "iam-declarative-can",
    category: "IAM & Access",
    name: "Declarative user.can? Engine",
    core: true,
    web: true,
    mobile: true,
    description:
      "Consistent permission checking in controllers, models, and domain service boundaries.",
  },
  {
    id: "iam-ui-gates",
    category: "IAM & Access",
    name: "Declarative UI Access Gates",
    core: false,
    web: true,
    mobile: true,
    description:
      "<AccessGate> (React) and AppAccessGate (Flutter) conditionally rendering protected UI components.",
  },
  {
    id: "iam-admin-manager",
    category: "IAM & Access",
    name: "Client Admin IAM Manager",
    core: true,
    web: true,
    mobile: false,
    description:
      "Interactive web dashboard to create roles, assign permissions, and audit user privilege grants.",
  },

  // 💳 Commerce & Billing
  {
    id: "commerce-stripe-checkout",
    category: "Commerce & Billing",
    name: "Stripe Checkout & Handoff",
    core: true,
    web: true,
    mobile: true,
    description:
      "Hosted redirect (Web) and seamless in-app WebView (Flutter) with multi-currency handling.",
  },
  {
    id: "commerce-subscriptions",
    category: "Commerce & Billing",
    name: "Recurring Subscriptions",
    core: true,
    web: true,
    mobile: true,
    description:
      "Tier upgrades, downgrades, cancellations, and resumptions with webhook reconciliation.",
  },
  {
    id: "commerce-lifetime",
    category: "Commerce & Billing",
    name: "One-Time & Lifetime Purchases",
    core: true,
    web: true,
    mobile: true,
    description:
      "Lifetime product licenses and consumable digital credits with permanent entitlement grants.",
  },
  {
    id: "commerce-iap",
    category: "Commerce & Billing",
    name: "Multi-Provider In-App Purchases",
    core: true,
    web: false,
    mobile: true,
    description:
      "Unified entitlement contracts matching Google Play Billing and Apple StoreKit standards.",
  },
  {
    id: "commerce-coupons",
    category: "Commerce & Billing",
    name: "Dynamic Discount Coupons",
    core: true,
    web: true,
    mobile: true,
    description:
      "Percentage and fixed-amount discounts with usage limits, date windows, and targeting restrictions.",
  },
  {
    id: "commerce-referrals",
    category: "Commerce & Billing",
    name: "Automated User Referral Program",
    core: true,
    web: true,
    mobile: true,
    description:
      "Automatic coupon generation on signup; rewards referring users upon friend purchase.",
  },
  {
    id: "commerce-entitlements",
    category: "Commerce & Billing",
    name: "Durable Entitlement Ledger",
    core: true,
    web: true,
    mobile: true,
    description:
      "Access records grant and expire feature access independently of payment vendor state machines.",
  },
  {
    id: "commerce-webhooks",
    category: "Commerce & Billing",
    name: "Idempotent Webhook Processing",
    core: true,
    web: false,
    mobile: false,
    description:
      "Cryptographically verified Stripe webhooks stored in Payment::WebhookEvent with replay protection.",
  },

  // ⚡ Queues & Concurrency
  {
    id: "queue-solid-queue",
    category: "Queues & Jobs",
    name: "Solid Queue Hybrid Concurrency",
    core: true,
    web: false,
    mobile: false,
    description:
      "50 concurrent Fibers (I/O) + 2 OS Threads (media/cron) backed strictly by PostgreSQL 18.",
  },
  {
    id: "queue-zero-redis",
    category: "Queues & Jobs",
    name: "Zero Redis Infrastructure Tax",
    core: true,
    web: false,
    mobile: false,
    description:
      "Eliminates Redis daemons entirely; reduces RAM footprint and cloud bills to $0.",
  },
  {
    id: "queue-media-worker",
    category: "Queues & Jobs",
    name: "Quarantined Media Worker",
    core: true,
    web: false,
    mobile: false,
    description:
      "Dedicated container for CPU-bound libvips & FFmpeg; never starves I/O payment webhooks.",
  },
  {
    id: "queue-elastic-balance",
    category: "Queues & Jobs",
    name: "Workload Elasticity & Auto-Failover",
    core: true,
    web: false,
    mobile: false,
    description:
      "Fibers instantly pivot to whichever queue (payments, ai, notifications, default) surges.",
  },
  {
    id: "queue-recurring-cron",
    category: "Queues & Jobs",
    name: "Transactional Recurring Cron",
    core: true,
    web: false,
    mobile: false,
    description:
      "Automated cron schedules (config/recurring.yml) clean expired cache, rotate logs, and sync tables.",
  },

  // 📦 Media & S3
  {
    id: "media-garage-s3",
    category: "Media & Storage",
    name: "Self-Hosted Garage S3",
    core: true,
    web: false,
    mobile: false,
    description:
      "High-throughput self-hosted S3 storage on port 3100 API / 3101 Admin with zero egress costs.",
  },
  {
    id: "media-universal-keys",
    category: "Media & Storage",
    name: "Universal S3 Storage Keys",
    core: true,
    web: true,
    mobile: true,
    description:
      "Deterministic storage paths (user/{id}/... and admin/...) replacing vendor-specific IDs.",
  },
  {
    id: "media-image-libvips",
    category: "Media & Storage",
    name: "Async Image Optimization (libvips)",
    core: true,
    web: false,
    mobile: false,
    description:
      "Background WebP conversion, auto-rotation, and responsive thumbnail variant generation.",
  },
  {
    id: "media-video-ffmpeg",
    category: "Media & Storage",
    name: "Video Transcoding & Poster Capture",
    core: true,
    web: false,
    mobile: false,
    description:
      "Multi-pass H.264/AAC compression, CRF tuning, and automated video poster extraction via FFmpeg.",
  },
  {
    id: "media-subtitles-srt",
    category: "Media & Storage",
    name: "Synchronized SRT Subtitles & Lyrics",
    core: true,
    web: false,
    mobile: true,
    description:
      "Automatic subtitle parsing and child asset linking (parent_asset_id) for synchronized lyrics.",
  },
  {
    id: "media-signed-playback",
    category: "Media & Storage",
    name: "Short-Lived Signed Playback URLs",
    core: true,
    web: true,
    mobile: true,
    description:
      "Secure signed playback URLs (/playback) with expiration TTL preventing unauthorized downloads.",
  },
  {
    id: "media-offline-drift",
    category: "Media & Storage",
    name: "Offline SQLite Downloads (Drift)",
    core: false,
    web: false,
    mobile: true,
    description:
      "AES-GCM encrypted media downloads saved to local Drift SQLite database on native mobile.",
  },

  // 🤖 AI & Speech
  {
    id: "ai-multi-provider",
    category: "AI & Speech",
    name: "Multi-Provider LLM Engine",
    core: true,
    web: true,
    mobile: true,
    description:
      "Seamless gateway switching between DeepSeek (V3/V4) and Google Gemini (2.5 Flash).",
  },
  {
    id: "ai-toon-serialization",
    category: "AI & Speech",
    name: "Universal TOON Serialization",
    core: true,
    web: true,
    mobile: true,
    description:
      "Token-Oriented Object Notation saves 30–60% tokens; models never parse or emit raw JSON.",
  },
  {
    id: "ai-queued-execution",
    category: "AI & Speech",
    name: "Durable Background Queued Chat",
    core: true,
    web: true,
    mobile: true,
    description:
      "Completions run in background Solid Queue; user receives response even if app disconnects.",
  },
  {
    id: "ai-telegram-chunking",
    category: "AI & Speech",
    name: "Telegram-Style Message Chunking",
    core: true,
    web: true,
    mobile: true,
    description:
      "Intelligent 2,000-character boundary splitting with split_id and sequential indexing.",
  },
  {
    id: "ai-telemetry-cost",
    category: "AI & Speech",
    name: "AI Run Telemetry & Cost Tracking",
    core: true,
    web: true,
    mobile: false,
    description:
      "Ai::Run records prompt/completion tokens, latency, model parameters, and financial costs.",
  },
  {
    id: "ai-speech-tts",
    category: "AI & Speech",
    name: "Binary Text-to-Speech (TTS)",
    core: true,
    web: true,
    mobile: true,
    description:
      "High-fidelity binary MP3 synthesis via Azure Speech / Nova with full SSML markup support.",
  },
  {
    id: "ai-speech-stt-live",
    category: "AI & Speech",
    name: "Live 16kHz STT Audio Streaming",
    core: true,
    web: true,
    mobile: true,
    description:
      "Bidirectional real-time microphone audio streaming over persistent Action Cable WebSocket.",
  },

  // 🔔 Notifications
  {
    id: "notify-tri-channel",
    category: "Notifications",
    name: "Tri-Channel Notification Orchestrator",
    core: true,
    web: true,
    mobile: true,
    description:
      "Dispatches notifications across In-App, Mobile Push, and Transactional Email in one call.",
  },
  {
    id: "notify-onesignal-push",
    category: "Notifications",
    name: "Mobile Push via OneSignal",
    core: true,
    web: false,
    mobile: true,
    description:
      "Device-tagged push notifications with custom sound alerts and localized notification payloads.",
  },
  {
    id: "notify-brevo-email",
    category: "Notifications",
    name: "Transactional Email via Brevo",
    core: true,
    web: false,
    mobile: false,
    description:
      "Responsive HTML email templates with master shell layout and dynamic client URL normalization.",
  },
  {
    id: "notify-in-app-inbox",
    category: "Notifications",
    name: "Persistent In-App Notification Inbox",
    core: true,
    web: true,
    mobile: true,
    description:
      "User notification inbox with Pagy pagination, read/unread states, and soft-delete capabilities.",
  },
  {
    id: "notify-action-cable",
    category: "Notifications",
    name: "Real-Time WebSocket Alerts",
    core: true,
    web: true,
    mobile: true,
    description:
      "Instant visual toast banners delivered through user-scoped Action Cable WebSocket channels.",
  },

  // 📱 Client Experience
  {
    id: "client-design-system",
    category: "Client Experience",
    name: "Design System & Theming Parity",
    core: false,
    web: true,
    mobile: true,
    description:
      "Synchronized Tailwind CSS v4 (Web) and Material 3 (Flutter) with Dark and Light modes.",
  },
  {
    id: "client-localization",
    category: "Client Experience",
    name: "Full Localization (en, es, my)",
    core: true,
    web: true,
    mobile: true,
    description:
      "100% translated in English, Spanish, and Burmese with automatic X-Locale header injection.",
  },
  {
    id: "client-error-logging",
    category: "Client Experience",
    name: "Client Error Ingest Telemetry",
    core: true,
    web: true,
    mobile: true,
    description:
      "Automatic capture of unhandled client exceptions (/v1/client/logs) with full stack traces.",
  },
  {
    id: "client-feedback-system",
    category: "Client Experience",
    name: "In-App User Feedback System",
    core: true,
    web: true,
    mobile: true,
    description:
      "1–10 star ratings with automated category triage (bug, feature request, improvement).",
  },
  {
    id: "client-version-upgrader",
    category: "Client Experience",
    name: "Semantic In-App Version Upgrader",
    core: true,
    web: true,
    mobile: true,
    description:
      "Semantic version verification against Client::Version; enforces mandatory splash updates.",
  },
  {
    id: "client-deep-linking",
    category: "Client Experience",
    name: "Universal Deep Linking & Continue URLs",
    core: false,
    web: true,
    mobile: true,
    description:
      "Universal URI scheme (rexone://) and safe continue URL auth routing with backstack preservation.",
  },
  {
    id: "client-dual-app-architecture",
    category: "Client Experience",
    name: "Dual-App Store Architecture (Prod vs UAT)",
    core: false,
    web: false,
    mobile: true,
    description:
      "Separate application IDs and schemes enabling side-by-side Prod and UAT installation on the same physical device.",
  },
  {
    id: "client-mobile-cicd-pipeline",
    category: "Client Experience",
    name: "Automated Android CI/CD & Play Store Rollout",
    core: false,
    web: false,
    mobile: true,
    description:
      "GitHub Actions pipeline with dynamic build numbering and automated delivery to Google Play Internal testing tracks.",
  },

  // 📊 Ops, Observability & Admin
  {
    id: "ops-rails-pulse",
    category: "Ops & Admin",
    name: "Rails Pulse Performance APM",
    core: true,
    web: false,
    mobile: false,
    description:
      "Live real-time APM tracking request durations, slow SQL queries, and queue wait times.",
  },
  {
    id: "ops-rails-error-dashboard",
    category: "Ops & Admin",
    name: "Rails Error Dashboard (RED)",
    core: true,
    web: false,
    mobile: false,
    description:
      "In-app exception monitoring with stack traces, environment parameters, and resolution flags.",
  },
  {
    id: "ops-administrate",
    category: "Ops & Admin",
    name: "Administrate Server Operations Portal",
    core: true,
    web: false,
    mobile: false,
    description:
      "Secure server-rendered operations back-office mounted at /admin for core maintenance.",
  },
  {
    id: "ops-client-admin",
    category: "Ops & Admin",
    name: "Client Admin Management Portal",
    core: true,
    web: true,
    mobile: false,
    description:
      "Headless administrative web interface for users, IAM roles, products, assets, and telemetry.",
  },
  {
    id: "ops-docker-compose",
    category: "Ops & Admin",
    name: "Docker 5-Container Topology",
    core: true,
    web: false,
    mobile: false,
    description:
      "Orchestrated composition (api, waka, media, db, garage) with automated /up healthchecks.",
  },

  // 🛡️ Quality, Security & Law
  {
    id: "law-constitutional",
    category: "Quality & Security",
    name: "Constitutional Law (LAW.md)",
    core: true,
    web: true,
    mobile: true,
    description:
      "Law U14 (zero dead shims/dead code) & Law U15 (human-readable plain English) strictly enforced.",
  },
  {
    id: "law-agent-rules",
    category: "Quality & Security",
    name: "AI Agent Operational Rules (AGENTS.md)",
    core: true,
    web: true,
    mobile: true,
    description:
      "Strict isolation rules: AI agents forbidden from reading .env, destructive git, or dirty docs.",
  },
  {
    id: "quality-tests",
    category: "Quality & Security",
    name: "1,785+ Automated Test Suite",
    core: true,
    web: true,
    mobile: true,
    description:
      "1,071 RSpec specs + 372 Vitest frontend tests + 342 Flutter tests guaranteeing integrity.",
  },
  {
    id: "security-boot-guard",
    category: "Quality & Security",
    name: "Security Boot Guard & CORS",
    core: true,
    web: false,
    mobile: false,
    description:
      "Refuses to boot if critical production keys match placeholders or fail high-entropy checks.",
  },
  {
    id: "law-strict-utc",
    category: "Quality & Security",
    name: "Strict UTC Transport (Law U10)",
    core: true,
    web: true,
    mobile: true,
    description:
      "Database and API strictly communicate in UTC ISO 8601; clients handle local presentation.",
  },
];

export const FeatureShowcase: React.FC<{ id?: string }> = ({
  id = "Features",
}) => {
  const [activeTab, setActiveTab] = useState<"pillars" | "matrix">("pillars");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    MASTER_FEATURES.forEach((f) => set.add(f.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredFeatures = useMemo(() => {
    return MASTER_FEATURES.filter((feature) => {
      const matchesCategory =
        selectedCategory === "All" || feature.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        feature.name.toLowerCase().includes(q) ||
        feature.description.toLowerCase().includes(q) ||
        feature.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id={id} className="py-12 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/40 bg-primary/15 text-primary-light backdrop-blur-md shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.3)]">
            <iconsLib.sparkles className="w-4 h-4 text-primary drop-shadow-[0_0_6px_var(--color-primary)]" />
            <span className="text-xs font-bold tracking-wider uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              Tri-Platform Architectural Capabilities
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-white">
            Architectural Feature Showcase
          </h2>

          <p className="text-sm sm:text-base text-base-content/80 leading-relaxed font-primary">
            Every generic foundation problem solved on Day One across Rails 8,
            React 19, and Flutter 3. Seamlessly scan the 8 core pillars or dive
            into the comprehensive master matrix.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-glass-card/90 border border-glass-border backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <button
              type="button"
              onClick={() => setActiveTab("pillars")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer ${
                activeTab === "pillars"
                  ? "bg-primary text-white shadow-[0_0_15px_var(--color-primary)] font-extrabold"
                  : "text-base-content/70 hover:text-white hover:bg-glass-card-hover"
              }`}
            >
              <span>⚡ 8 Core Pillars</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === "pillars"
                    ? "bg-primary-dark/50 text-white font-bold"
                    : "bg-white/10 text-base-content/80"
                }`}
              >
                Quick Scan
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("matrix")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer ${
                activeTab === "matrix"
                  ? "bg-primary text-white shadow-[0_0_15px_var(--color-primary)] font-extrabold"
                  : "text-base-content/70 hover:text-white hover:bg-glass-card-hover"
              }`}
            >
              <span>🏛️ Master Feature Matrix</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === "matrix"
                    ? "bg-primary-dark/50 text-white font-bold"
                    : "bg-white/10 text-base-content/80"
                }`}
              >
                {MASTER_FEATURES.length} Features
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: 8 Core Pillars (Quick Scan) */}
        {activeTab === "pillars" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {PILLARS.map((pillar) => {
                const IconComponent = iconsLib[pillar.icon] || iconsLib.cube;
                return (
                  <div
                    key={pillar.id}
                    className="group relative rounded-2xl border border-glass-border bg-glass-card/90 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.25)] hover:-translate-y-1"
                  >
                    <div>
                      {/* Top Row: Icon + Badge */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 group-hover:shadow-[0_0_12px_var(--color-primary)] transition-all duration-300">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-primary/15 text-primary-light border border-primary/30">
                          {pillar.badge}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg text-white mb-3 group-hover:text-primary-light transition-colors">
                        {pillar.title}
                      </h3>

                      {/* Capabilities List */}
                      <ul className="space-y-2 mb-5 text-xs text-base-content/80">
                        {pillar.capabilities.map((cap, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5 shrink-0">
                              ✓
                            </span>
                            <span className="leading-relaxed">{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Differentiator Footer Callout */}
                    <div className="pt-3 border-t border-glass-border/60">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-primary block mb-1">
                        Differentiator vs Traditional Stacks
                      </span>
                      <p className="text-xs text-base-content/90 font-medium italic leading-relaxed">
                        &ldquo;{pillar.differentiator}&rdquo;
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats Banner */}
            <div className="rounded-2xl border border-glass-border bg-glass-card/90 backdrop-blur-xl p-5 sm:p-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-primary drop-shadow-[0_0_8px_var(--color-primary)]">
                    1,785+
                  </div>
                  <div className="text-xs text-base-content/70 mt-0.5 font-medium">
                    Passing Automated Tests
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-primary drop-shadow-[0_0_8px_var(--color-primary)]">
                    $0
                  </div>
                  <div className="text-xs text-base-content/70 mt-0.5 font-medium">
                    Redis &amp; Egress Hostage Bills
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-primary drop-shadow-[0_0_8px_var(--color-primary)]">
                    3 Platforms
                  </div>
                  <div className="text-xs text-base-content/70 mt-0.5 font-medium">
                    Rails 8 + React 19 + Flutter 3
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-primary drop-shadow-[0_0_8px_var(--color-primary)]">
                    100% Free
                  </div>
                  <div className="text-xs text-base-content/70 mt-0.5 font-medium">
                    Apache 2.0 Open Source License
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Master Feature Matrix (All Features Table) */}
        {activeTab === "matrix" && (
          <div className="rounded-3xl border border-glass-border bg-glass-card/90 backdrop-blur-xl p-5 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-5 border-b border-glass-border/60">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-primary text-black font-bold shadow-[0_0_10px_var(--color-primary)]"
                        : "bg-glass-card border border-glass-border text-base-content/80 hover:border-primary/40 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Real-Time Search Box */}
              <div className="relative min-w-60">
                <iconsLib.search className="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any capability or feature..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-glass-card border border-glass-border text-xs text-white placeholder-base-content/40 focus:outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.3)] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Feature Counter */}
            <div className="flex items-center justify-between text-xs text-base-content/70">
              <span>
                Showing{" "}
                <strong className="text-primary font-bold">
                  {filteredFeatures.length}
                </strong>{" "}
                of {MASTER_FEATURES.length} architectural features
              </span>
              <span className="hidden sm:inline italic">
                Scroll horizontally on mobile to inspect platform availability
              </span>
            </div>

            {/* The Master Table */}
            <div className="overflow-x-auto rounded-2xl border border-glass-border bg-glass-card/90">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-glass-border bg-glass-card backdrop-blur-xl text-base-content/90 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold min-w-50">
                      Feature &amp; Capability
                    </th>
                    <th className="py-3.5 px-3 font-semibold text-center w-24">
                      Core (Rails)
                    </th>
                    <th className="py-3.5 px-3 font-semibold text-center w-24">
                      Web (React)
                    </th>
                    <th className="py-3.5 px-3 font-semibold text-center w-24">
                      Mobile (Flutter)
                    </th>
                    <th className="py-3.5 px-4 font-semibold min-w-70">
                      Production Reality
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border/40">
                  {filteredFeatures.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-base-content/60 text-sm"
                      >
                        No features found matching &ldquo;{searchQuery}&rdquo;.
                      </td>
                    </tr>
                  ) : (
                    filteredFeatures.map((feature, idx) => (
                      <tr
                        key={feature.id}
                        className={`transition-colors duration-150 hover:bg-primary/5 ${
                          idx % 2 === 0 ? "bg-transparent" : "bg-white/1.5"
                        }`}
                      >
                        {/* Category */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 border border-glass-border text-base-content/80">
                            {feature.category}
                          </span>
                        </td>

                        {/* Feature Name */}
                        <td className="py-3 px-4 font-bold text-white tracking-wide">
                          {feature.name}
                        </td>

                        {/* Core (Rails) */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {feature.core ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs font-bold shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.3)]">
                              ✓
                            </span>
                          ) : (
                            <span className="text-base-content/30 font-bold">
                              —
                            </span>
                          )}
                        </td>

                        {/* Web (React) */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {feature.web ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs font-bold shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.3)]">
                              ✓
                            </span>
                          ) : (
                            <span className="text-base-content/30 font-bold">
                              —
                            </span>
                          )}
                        </td>

                        {/* Mobile (Flutter) */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {feature.mobile ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs font-bold shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.3)]">
                              ✓
                            </span>
                          ) : (
                            <span className="text-base-content/30 font-bold">
                              —
                            </span>
                          )}
                        </td>

                        {/* Description & Production Reality */}
                        <td className="py-3 px-4 text-base-content/80 leading-relaxed font-normal">
                          {feature.description}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
