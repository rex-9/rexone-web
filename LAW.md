> [!IMPORTANT]
> ### 🏛️ The Foundation Creed
> **"Clarity before cleverness. Precision before haste. Simplicity without weakness. Strength without spectacle."**
>
> This document defines the non-negotiable architectural laws and engineering standards for **Rexone Web** (`rexone-web`). Every developer, agent, and contributor must adhere strictly to these rules. Zero exceptions.

---

## 🏛️ 1. Design System & Component Law

### 1.1 Zero Components Outside `src/design/`
- **Rule**: NEVER create custom UI components, buttons, inputs, modals, or base presentation widgets outside `src/design/`.
- All reusable UI atoms, molecules, and organisms live exclusively in:
  - `src/design/elements/` — Design tokens (colors, typography, spacing, radius, shadows, motion).
  - `src/design/components/` — Semantic UI components (`Button`, `Dropdown`, `TextInput`, `PasscodeInput`, `Toggle`, `Dialog`, `Toast`, `Image`, `Video`, `NavBar`, `ProfileAvatar`, etc.).
  - `src/design/pages/` — Shared layout shells, base pages (`LayoutPage`, `HomePage`, `ProfilePage`, `NotFoundPage`).

### 1.2 Automated Theming via DaisyUI & Tailwind Tokens
- Design tokens (colors, fonts, spacings, radius) are injected directly into Tailwind CSS and DaisyUI configuration.
- **Rule**: NEVER hardcode hex codes (`#ffffff`, `#1a1a1a`), rgb values, or arbitrary pixel widths in components.
- Use standard semantic Tailwind and DaisyUI utility classes:
  - Backgrounds: `bg-base-100`, `bg-base-200`, `bg-base-300`, `bg-primary`, `bg-secondary`
  - Text: `text-primary`, `text-secondary`, `text-neutral`, `text-base-content`
  - Components: `btn`, `btn-primary`, `btn-outline`, `card`, `dropdown`, `modal`
- Both **Light (Day)** and **Dark (Night)** themes apply automatically through semantic theme classes.

---

## 🖼️ 2. Distributed Centralized Assets Law

- **Rule**: NEVER store raw media URL strings directly on domain entities or state models.
- ALL media (avatars, attachments, covers, cards, audio, video, docs) is managed through the backend's distributed centralized `assets` system (`type`, `storage_key`, `resource_model`, `resource_id`).
- When uploading assets (such as user avatars):
  - Pass `{ type: "avatar", resource_model: "user", resource_id: currentUser?.id }`.
  - Display avatars using the semantic [`ProfileAvatar`](file:///Users/rex/Desktop/Dev/rexone/rexone-web/src/design/components/common/ProfileAvatar.tsx) or [`Image`](file:///Users/rex/Desktop/Dev/rexone/rexone-web/src/design/components/media/Image.tsx) components.

---

## 💾 3. State Management & Storage Law

### 3.1 Zero Direct Local/Session Storage Access
- **Rule**: NEVER call `localStorage.getItem()`, `localStorage.setItem()`, `sessionStorage`, or `document.cookie` directly in components, pages, or controllers.
- **Rule**: ALL persistent and reactive state MUST go through Jotai atoms defined in `src/atoms.ts` using `AtomService.getAtom()` with typed `StorageKeys`.
- Standard keys are centralized in `src/constants/storageKeys.ts` (`StorageKeys.LOCALE`, `StorageKeys.TOKEN`, `StorageKeys.USER`, `StorageKeys.THEME`).

---

## 🗂️ 4. Constants & Enums Organization Law

### 4.1 Zero Loose String Literals or Magic Numbers
- **Rule**: There must be ZERO loose magic string literals, status strings, event names, or magic numbers scattered across the app.
- Every constant must be strongly typed using `as const`.

### 4.2 Strict Colocation of Constants
- **Application-wide Shared Constants** live in `src/constants/`:
  - `src/constants/storageKeys.ts` — Storage keys (`StorageKeys`).
  - `src/constants/platform.ts` — Platform identifiers (`Platform.WEB`, `Platform.MOBILE`).
  - `src/constants/index.ts` — Shared barrel export.
- **Module-Specific Constants** MUST live inside their respective module:
  - `src/modules/auth/constants.ts` — `DialogParams`, `DialogAuthSteps`, `TAuthStep`, `AUTH_ERRORS`, `AUTH_PROVIDERS`.
  - `src/modules/ai/constants.ts` — `AI_CHAT_ROLES`, `AI_MESSAGE_STATUS`, `AI_SOCKET_EVENTS`, `AI_DEFAULTS`.
  - `src/modules/payment/constants.ts` — `SUBSCRIPTION_STATUS`, `TRANSACTION_STATUS`, `PAYMENT_MODES`.
  - `src/modules/log/constants.ts` — `SEVERITIES`, `PLATFORMS`, `ENVIRONMENTS`, `BROWSER_NAMES`, `OS_NAMES`.
  - `src/modules/admin/constants.ts` — `ADMIN_PAGE_SIZE`, `ADMIN_ACTIONS`, `ADMIN_ROLE_NAMES`, `ADMIN_COMMON_LABELS`.
- Every module barrel (`src/modules/<name>/index.ts`) MUST export its `constants`.

---

## 🌐 5. Architecture & Layering Law

### 5.1 Strict 4-Tier Separation of Concerns
```
View Layer (Pages / Components)
       ↓  (Triggers actions, consumes state)
Controller Layer (src/modules/*/controllers)
       ↓  (Orchestrates flow, loading, error handling)
Service Layer (src/modules/*/services)
       ↓  (Formats payload & calls API)
Transport Layer (src/services/api.service.ts)
```

- **Views (Pages/Components)**:
  - PURE presentation and user interaction.
  - Zero direct API calls (`axios`, `fetch`).
  - Zero direct business logic calculations.
  - Only consume reactive state (Jotai atoms, Contexts) and invoke Controller methods.
- **Controllers (`*.controller.ts`)**:
  - Coordinate business workflows, manage validation, set loading/error messages.
  - Call Services for remote operations.
  - Update reactive state upon success or failure.
- **Services (`*.service.ts`)**:
  - Exclusively handle remote HTTP/WebSocket calls via `api` (`ApiService`).
  - Strongly typed with `IApiResponse<IApiEnvelope<T>>`.
  - Zero UI state or component references.
- **Transport (`api.service.ts`)**:
  - Global axios instance with automatic JWT header injection (`Authorization: Bearer <token>`), platform header (`X-Platform: web`), and locale header (`X-Locale`).
  - Centralized 401 token expiration / session revocation interceptor.

---

## 🔐 6. RBAC & Client-Side Authorization Law

- `currentUser.permissions` are grouped by resource (`{ users: ["read", "create", ...], products: [...] }`).
- Client UI and routes enforce permissions via `usePermissions()` hook or permission guards:
  - `super_admin`: Full access across all administration areas.
  - `admin`: Full access EXCEPT `users` and `iam` (roles/permissions management).
  - Custom roles: Access strictly granted based on action permissions matching `create`, `read`, `update`, `delete`.
- Zero hardcoded bypasses in UI logic.

---

## 📄 7. Pagination & API Envelope Law

### 7.1 Mandatory Pagination for All List Endpoints
- **Rule**: ALL collection/list responses from the backend MUST be paginated. Never consume unpaginated arrays for lists.
- Use `IPaginatedResult<T>` and `IApiPagination` from `src/models/api.model.ts`.

### 7.2 Mandatory Centralized Response Parsing
- **Rule**: NEVER manually parse raw axios responses with ad-hoc logic.
- ALWAYS use the centralized parsing utilities from `src/services/api.service.ts`:
  - `parseResponse<T>(response)` — Extracts single entity and status envelope.
  - `parsePaginatedResponse<T>(response)` — Extracts paginated record array and `PaginationMeta`.
  - `parseFromList<T>(data)` — Safely normalizes collection payload arrays.
  - `apiHandler(...)` — Centralized try/catch and error extraction wrapper for async workflows.

---

## 🌍 8. Localization Law

- **Rule**: Every user-facing text, error message, button label, and placeholder MUST be localized through `src/locales/`.
- Key structure is strongly typed in `src/locales/app_locales.ts` (`AppLocales.Auth.*`, `AppLocales.Errors.*`, etc.).
- Use `translate(AppLocales.Some.Key)` or `const { t } = useTranslate()` in components.
- When sending requests to `rexone-core`, `api.service.ts` automatically attaches the active locale via `X-Locale: en|my|es`.

---

## 🧪 9. End-to-End (E2E) Testing Law (Playwright)

- **Rule**: Every core user journey, auth flow, error state, and payment path MUST have corresponding Playwright E2E tests in `e2e/specs/`.
- Test runners (`scripts/test.sh` / `npx playwright test`) must pass with 0 failures before any pull request is merged.
- E2E tests must use Page Object Models (`e2e/pages/`) and import constants cleanly from `src/modules/*/constants` without pulling UI/DOM modules into Node test execution.

---

## 🧱 10. Module Boundary Law

- **Rule**: Everything belonging to a feature domain MUST live inside `src/modules/<feature_name>/`:
  - `constants.ts` — Feature-specific constants & enums.
  - `types.ts` — TypeScript interfaces, requests, responses.
  - `<feature>.controller.ts` — Business controller(s).
  - `<feature>.service.ts` — Backend API service(s).
  - `components/` — Feature-specific UI components.
  - `pages/` — Feature-specific routes and views.
  - `index.ts` — Clean barrel exporting public interface.
- Code outside `src/modules/` is strictly application-wide shared infrastructure (`src/design/`, `src/services/`, `src/constants/`, `src/contexts/`, `src/models/`, `src/routes/`, `src/locales/`, `src/helpers/`, `src/hooks/`, `src/atoms.ts`).
