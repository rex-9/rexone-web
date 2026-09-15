# 🏛️ The Rexone Ecosystem

A unified, production-grade architectural blueprint spanning **Rexone Core** (Backend), **Rexone Web** (React SPA), and **Rexone Mobile** (Flutter App).

---

## 📖 Canonical Architecture & Documentation

To maintain a single source of truth and eliminate redundant duplication across repositories, the canonical ecosystem documentation is hosted and maintained centrally in **Rexone Core**:

- 🌐 **Ecosystem Architecture & Cross-Platform Contracts**:  
  [https://github.com/rex-9/rexone-core/blob/dev/ECOSYSTEM.md](https://github.com/rex-9/rexone-core/blob/dev/ECOSYSTEM.md)  
  *Contains the comprehensive cross-platform architecture, high-level topology, repository roles, feature parity matrix, real-time WebSocket protocol, shared data structures, and client telemetry.*

- 🗺️ **Visual Walkthrough**:  
  [https://github.com/rex-9/rexone-core/blob/dev/docs/VISUAL_WALKTHROUGH.md](https://github.com/rex-9/rexone-core/blob/dev/docs/VISUAL_WALKTHROUGH.md)  
  *A screenshot-driven, feature-by-feature visual tour of Rexone across Core, Web, Mobile, administration, and operations.*

- 📜 **Constitutional Law (`LAW.md`)**:  
  [https://github.com/rex-9/rexone-core/blob/dev/LAW.md](https://github.com/rex-9/rexone-core/blob/dev/LAW.md)  
  *The non-negotiable engineering laws governing API envelopes, pagination, data isolation, and architecture.*

---

## 💻 About Rexone Web

This repository (`rexone-web`) is the official browser client for the Rexone Ecosystem.

- **Technology**: React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Playwright, Vitest.
- **Repository Guide**: See [README.md](README.md) for setup, architecture, and developer workflows.
- **Web Constitutional Law**: See [LAW.md](LAW.md) for frontend-specific state and component laws.
