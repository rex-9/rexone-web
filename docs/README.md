# RexOne Web: Technical Documentation & Frontend Reference

This directory serves as the technical documentation manual for **RexOne Web** (`rexone-web`), the sovereign React 19 desktop and mobile browser client for the RexOne ecosystem.

---

## 📚 Documentation Index

| Guide | Description | Canonical Path |
| :--- | :--- | :--- |
| **🎨 Design System & Tokens** | DaisyUI 5 tokens, scarlet phosphor neon palette, typography, and primitives | **[`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)** |
| **🌐 AI Discovery & GEO** | Generative Engine Optimization, crawler allowlists, llms.txt, and JSON-LD | **[`docs/SEO_GEO.md`](SEO_GEO.md)** |
| **🚀 Production Deployment** | Vite production builds, Coolify Docker deployment, and Nginx reverse proxy | **[`docs/DEPLOYMENT.md`](DEPLOYMENT.md)** |
| **🛡️ Architecture Invariant Checks** | Automated AST lint rules enforcing LAW.md (centralized keys, no raw cookies) | **[`docs/ARCHITECTURE_CHECKS.md`](ARCHITECTURE_CHECKS.md)** |
| **🌍 Worldwide Webmaster Guide** | Google Search Console, Bing, Yandex, Naver, IndexNow, and registry submissions | **[`docs/WORLDWIDE_REGISTRATION.md`](WORLDWIDE_REGISTRATION.md)** |

---

## 🏛️ Client Architecture & Directory Topology

RexOne Web enforces strict client-first separation across distinct functional layers:

```
src/
├── assets/          # Icons (Heroicons 2.0), brand logos, and audio assets
├── design/          # Reusable UI primitives, theme tokens, and layout shells
│   ├── components/  # Buttons, Inputs, Dialogs, Dropdowns, Tables, Player (Vidstack)
│   └── styles/      # Tailwind CSS v4 variables and DaisyUI 5 custom theme tokens
├── contexts/        # Cross-cutting React contexts (Auth, Theme, Toast, Loading)
├── hooks/           # Reusable stateful hooks (usePermissions, useSort, useTranslate)
├── locales/         # Type-safe i18n dictionaries (English, Spanish, Burmese)
├── modules/         # Cohesive, self-contained product domains
│   ├── admin/       # Operational admin consoles (Users, IAM, Products, Assets, Logs)
│   ├── auth/        # URL-addressable dialog state machine (Email, Passcode, OTP, OAuth)
│   ├── payment/     # Stripe Checkout, coupon validation, subscription cards
│   ├── media/       # Asset management, upload queue, and Vidstack player integration
│   ├── ai/          # Non-blocking queued chat, multi-chunk rendering, room history
│   └── landing/     # Sovereign public landing page, interactive REXONE neon sign
└── services/        # Low-level transport gateways (Fetch API interceptors, ActionCable)
```

---

## 🛠️ CLI Development & Quality Toolchain

All quality checks, linters, and test runners are exposed through standard npm scripts:

| Command | Purpose | Target |
| :--- | :--- | :--- |
| `npm run dev` | Launches local Vite development server with Hot Module Replacement (HMR) | `http://localhost:5173` |
| `npm run build` | Executes TypeScript typecheck (`tsc -b`) and bundles production assets | `dist/` |
| `npm run test` | Executes full Vitest unit test suite (35 suites, 312 tests) | Terminal |
| `npm run test:e2e` | Runs automated Playwright end-to-end user journey tests | Chromium / WebKit |
| `npm run check:architecture` | Verifies zero LAW.md violations (storage key conventions, direct cookies) | AST Scanner |
| `npm run check:locales` | Audits translation dictionaries for missing or unreferenced keys | Locale Validator |
| `npm run lint` | Runs ESLint with React Hooks and React Refresh rules | Codebase |

---

## 🎛️ Modular Admin Consoles & Operational Workflows

The Client Admin Portal (`/admin/*`) provides a protected, permission-governed operational environment under `src/modules/admin/`:

* **Access Control**: Users with only non-admin roles (e.g. `user`) receive 404 Not Found. Permissions in `user` role never leak into the admin portal.
* **Consoles**: Dedicated full-page workflows for Users, Roles & Permissions (IAM), Products & Pricing, Notifications & Broadcasts, Entitlements (Accesses), Media Asset Control, Version Catalogues, Chat Moderation, and Feedback Telemetry.
* **Unified Forms**: Reusable entity forms (`CREATE` and `EDIT` modes) with unified validation.
* **Action Guards & Safety**: Discard, restore (`undiscard`), and permanent deletion buttons are gated by granular `ADMIN_ACTIONS` permissions. Soft-deleted records are quarantined in dedicated Recycle Bins.

---

## 🎬 Media Streaming & Speech Worklets

* **Vidstack Media Player**: Universal player component supporting progressive MP4, HLS streams, dynamic dialogue gap bridging ($\le 800\text{ms}$ to prevent subtitle flicker during seeks), 60-second forward/backward RAM buffers, and in-memory WebVTT generation.
* **Live Speech Streaming**: AudioWorklet-based (`pcm-processor.js`) 16kHz mono linear PCM streaming over ActionCable WebSockets (`SpeechLiveChannel`) with real-time RMS voice energy tracking.
