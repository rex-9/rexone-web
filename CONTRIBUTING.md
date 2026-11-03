# Contributing to RexOne Web

Thank you for contributing to **RexOne Web**! 🌐

RexOne Web is an enterprise-grade React 19, TypeScript, and Vite single-page application engineered under **Discipline-Driven Development (DDD)**.

---

## 🏛️ Constitutional Law

All web development is governed by **[`LAW.md`](LAW.md)** and **[`ECOSYSTEM.md`](ECOSYSTEM.md)**.
- **Law W1 (Universal Provider Isolation)**: Storage uses `storage_key`. No raw vendor SDKs in UI components.
- **Law U12 (Zero Loose Code)**: Strict, deterministic TypeScript interfaces for all props and API responses.
- **Law U13 (Human-Readable Code)**: No alien syntax, dense nested ternaries, or unreadable regex hacks.

---

## 🛠️ Local Development & Pre-Commit Verification

Before opening a pull request, run the full verification pipeline:

```bash
# 1. Vitest Unit & Component Tests
npm test

# 2. Architectural Guardrail Linter
npm run check:architecture

# 3. Locales Parity & Diagnostic Checker (100% key parity required)
npm run check:locales

# 4. Production Build Verification
npm run build
```

---

## 🤖 AI-Assisted Contributions

AI pair programmers are welcome, but unvetted "AI Slop" is rejected.
- Every PR must disclose AI tools used.
- Tests and architecture checks must pass 100%.
- For details, see the [RexOne AI Contribution Policy](https://github.com/rex-9/rexone-core/blob/dev/docs/AI_CONTRIBUTION_POLICY.md).
