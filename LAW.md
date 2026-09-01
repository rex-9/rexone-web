> [!IMPORTANT]
>
> ### 🏛️ The Foundation Creed
>
> **"Clarity before cleverness. Precision before haste. Simplicity without weakness. Strength without spectacle."**
>
> This document defines the non-negotiable architectural laws and engineering standards for **Rexone Web** (`rexone-web`). Every developer, agent, and contributor must adhere strictly to these rules. Zero exceptions.

---

## 🏛️ 1. Design System & Component Law

### 1.1 Zero Components Outside `src/design/` & Mandatory Component Reuse

- **Rule**: NEVER create custom UI components, buttons, inputs, modals, or base presentation widgets outside `src/design/`.
- All reusable UI atoms, molecules, and organisms live exclusively in:
  - `src/design/elements/` — Design tokens (colors, font, radius, shadows, keyframes, animations) configured into Tailwind & DaisyUI.
  - `src/design/components/` — Semantic UI components:
    - Form elements: `FormContainer`, `TextInput`, `TextArea`, `PasswordInput`, `Dropdown`, `Toggle`.
    - Buttons: `Button`, `GoogleButton`, `SignOutButton`.
    - Overlays: `Dialog`, `ConfirmDialog`, `LoadingOverlay`, `Toast`.
    - Common & Media: `NavBar`, `Badge`, `ProfileAvatar`, `Typography`, `TextLink`, `Image`/`Asset`, `Video`/`VideoPlayer`.
  - `src/design/pages/` — Shared layout shells, base pages (`LayoutPage`, `HomePage`, `NotFoundPage`).
- **Rule**: NEVER use raw HTML `<img>`, raw `<video>`, raw `<a>`, raw `<textarea>`, raw `<button>`, raw `<form>`, or ad-hoc containers in module dialogs or pages. Always re-use the Design System wrappers:
  - **Images / Icons**: Use `Asset` or `Image` (`src/design/components/media/Image.tsx`) with typed asset objects (`icons.*`, `images.*`) from `src/assets/`.
  - **Videos**: Use `Video` or `VideoPlayer` (`src/design/components/media/Video.tsx`) with typed video assets (`videos.*`).
  - **Links & Navigation**: Use `TextLink` (`src/design/components/common/TextLink.tsx`) for external URLs and styled link buttons, or React Router `<Link>`. Never write raw `<a href="...">` tags.
  - **Forms & Inputs**: Re-use `FormContainer`, `TextArea`, `TextInput`, `PasswordInput`, `Button`, and `Dialog`.
  - If a design element is missing, build it cleanly in `src/design/components/` first.

### 1.2 Automated Theming & Pure Tailwind Spacing

- **Pure Tailwind Spacing Scale**: The project strictly adheres to the standard Tailwind CSS spacing scale (`p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-6` = 24px, `gap-3`, `space-y-4`). Custom pixel spacing overrides are forbidden.
- **Rule**: NEVER import directly from `src/design/elements/` for inline styling in components. Always style with standard Tailwind utility classes and DaisyUI semantic tokens:
  - Backgrounds: `bg-base-100`, `bg-base-200`, `bg-base-300`, `bg-primary`, `bg-secondary`
  - Text: `text-primary`, `text-secondary`, `text-neutral`, `text-base-content`
  - Shadows: `shadow-sm`, `shadow-md`, `shadow-xl`, `shadow-neon`, `shadow-neon-lg`
  - Components: `btn`, `btn-primary`, `btn-outline`, `card`, `dropdown`, `modal`
- Both **Light (Day)** and **Dark (Night)** themes apply automatically through semantic theme classes.

---

## 🖼️ 2. Centralized Assets & Icons Law (`src/assets/`)

### 2.1 Clean Centralized Asset Registry & Component Rendering

- **Rule**: ALL static assets (images, icons, SVGs, videos, audio/sounds) MUST be registered and exported through `src/assets/index.ts` (`images`, `icons`, `videos`, `sounds`, `iconsLib`).
- **Rule**: ZERO hardcoded inline SVGs (`<svg>...</svg>`) in pages or components. Always register the icon in `iconsLib` in `src/assets/index.ts` or add a standalone `.svg` asset under `src/assets/icons/` and render via `Asset`.
- **Rule**: ZERO direct/scattered raw file imports (`.svg`, `.png`, `.jpg`, `.mp4`, `.mp3`) across components. All imports go through `src/assets/`.
- **Rule**: ZERO raw `<img>` or `<video>` tags. Always render assets via `Asset` (or `Image`) and `VideoPlayer` (or `Video`).

### 2.2 Distributed Centralized Dynamic Assets

- **Rule**: NEVER store raw media URL strings directly on domain entities or state models.
- ALL media (avatars, attachments, covers, cards, audio, video, docs) is managed through the backend's distributed centralized `assets` system (`type`, `storage_key`, `resource_model`, `resource_id`).
- When uploading assets (such as user avatars):
  - Pass `{ type: "avatar", resource_model: "user", resource_id: currentUser?.id }`.
  - Display avatars using the semantic [`ProfileAvatar`](file:///Users/rex/Desktop/Dev/rexone/rexone-web/src/design/components/common/ProfileAvatar.tsx) or [`Asset`](file:///Users/rex/Desktop/Dev/rexone/rexone-web/src/design/components/media/Image.tsx) components.

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
  - `src/constants/platform.ts` — Platform identifiers (`Platform.WEB`, `Platform.ANDROID`, `Platform.IOS`).
  - `src/constants/index.ts` — Shared barrel export.
- **Module-Specific Constants** MUST live inside their respective module:
  - `src/modules/auth/constants.ts` — `DialogParams`, `DialogAuthSteps`, `TAuthStep`, `AUTH_ERRORS`, `AUTH_PROVIDERS`.
  - `src/modules/ai/constants.ts` — `AI_CHAT_ROLES`, `AI_MESSAGE_STATUS`, `AI_SOCKET_EVENTS`, `AI_DEFAULTS`.
  - `src/modules/payment/constants.ts` — `SUBSCRIPTION_STATUS`, `TRANSACTION_STATUS`, `PAYMENT_MODES`.
  - `src/modules/log/constants.ts` — `SEVERITIES`, `PLATFORMS`, `ENVIRONMENTS`, `BROWSER_NAMES`, `OS_NAMES`.
  - `src/modules/admin/constants.ts` — `ADMIN_PAGE_SIZE`, `ADMIN_ACTIONS`, `ADMIN_ROLE_NAMES`, `ADMIN_COMMON_LABELS`.
- Every module barrel (`src/modules/<name>/index.ts`) MUST export its `constants`.

---

## 🌐 5. Architecture & Layering Law (Strict MVCS Pattern)

### 5.1 Server-Business Logic Authority vs. Client-Business Logic

- **Server-Business Logic in Core**: All primary application business logic (or **server-business logic**)—including authorization rules, access lifecycles, pricing, rate limits, payment transactions, AI pipelines, and database integrity—is handled exclusively in `rexone-core`.
- **Zero Server-Business Logic Duplication**: The web client MUST NEVER duplicate, re-implement, or re-calculate server-business logic. This prevents writing duplicate business rules across Web and Mobile.
- **Client-Business Logic Focus**: The web client strictly limits its logic to **client-business logic** (frontend state management, user interaction orchestration, local form validations, UI state transitions, and responsive presentation).

### 5.2 Strict 4-Tier MVCS Separation of Concerns

```
Model Layer (src/models/ & src/modules/*/types.ts)
       │  (Typed interfaces, request/response models, state schemas)
View Layer (src/design/pages/ or src/modules/*/components/ & pages/)
       ↓  (Triggers actions, manages local form input states, consumes reactive atoms/hooks)
Controller Layer (src/modules/*/*.controller.ts)
       ↓  (Orchestrates backend-facing client-business logic, coordinates services, returns typed results)
Service Layer (src/services/ & src/modules/*/*.service.ts)
       ↓  (Formats request payloads, calls ApiService, returns IApiResponse)
Transport Layer (src/services/api.service.ts)
       ↓  (Global Axios instance, JWT/Platform/Locale headers, centralized 401 interceptor)
```

- **Views (Pages / Components / Dialogs)**:
  - **PURE presentation and user interaction**.
  - **Zero direct API calls** (`axios`, `fetch`, direct `*.service.ts` calls). All external operations MUST route through a Controller.
  - **Zero server-business logic calculations** or raw network envelope unwrapping.
  - **Owns local UI state** (form input state, field-level validation errors, local UI loading flags, dialog transitions, toast notifications).
  - Only consumes reactive state (Jotai atoms, React Contexts, custom Hooks) and invokes Controller methods.

- **Controllers (`*.controller.ts`)**:
  - **Coordinate backend-facing client-business logic**, data transformations, and service orchestration.
  - **Lean Controller Logic Law**: Controller logic must remain lean and minimal — focused strictly on data typing, request formatting, JSON restructuring, and response parsing. Server-business logic stays in Core.
  - **Zero UI Logic or UI Callbacks Law**: Controllers MUST NOT accept UI callbacks (`setError`, `setSuccess`, `setLoading`, `navigate`, `toast`, `onSuccess`, `onError`).
  - **Pure Strongly-Typed Async Return Values**: Every controller method MUST return a clean, strongly-typed result object (e.g. `Promise<{ success: boolean; data?: T; error?: string }>` or `Promise<{ success: boolean; token?: string; user?: IUser; error?: string }>`).
  - The calling View / Hook inspects the returned result and is solely responsible for UI transitions, setting local error messages, or navigating routes.
  - Call Services for remote HTTP / WebSocket operations.
  - Update shared reactive state (Jotai atoms) upon success or failure where global state sync is required.

- **Services (`*.service.ts`)**:
  - **Exclusively handle remote HTTP/WebSocket transport** via `api` (`ApiService`).
  - **Shared Services (`src/services/`)**: Application-wide infrastructure services used by any controller or hook (`api.service.ts`, `socket.service.ts`, `atom.service.ts`).
  - **Module Services (`src/modules/<name>/<name>.service.ts`)**: Feature-specific API clients (`auth.service.ts`, `ai.service.ts`, `payment.service.ts`, `feedback.service.ts`). Placed at module root unless a domain expands to require multiple service files. When necessary, module services can be imported and utilized by other domain controllers.
  - Strongly typed with `Promise<IApiResponse<IApiEnvelope<T>>>`.
  - Zero UI state, zero DOM access, zero component references.

- **Transport (`api.service.ts`)**:
  - Global axios instance with automatic JWT header injection (`Authorization: Bearer <token>`), platform header (`X-Platform: web`), and locale header (`X-Locale`).
  - Centralized 401 token expiration / session revocation interceptor.

### 5.3 Two-Way Client-Business Logic Architecture

The web client strictly bifurcates its **client-business logic** based on its connection to the backend:

1. **Backend-Facing Client-Business Logic (`Controller` + `Service`)**:
   - Any client logic involving API endpoints, server state, persistence, network serialization, or remote orchestration MUST flow through `<feature>.controller.ts` and `<feature>.service.ts`.
   - Handled inside `<feature>.controller.ts`.
   - Stays lean: data typing, JSON payload restructuring, API envelope parsing, and error mapping.

2. **Non-Backend / UI-Only Client-Business Logic (`Custom Hooks`)**:
   - Any client-business logic that is purely clientside (local calculations, timer countdowns, scroll physics, keyboard shortcuts, DOM measurements, animation timings, audio player playback state) MUST be handled by **Custom React Hooks** (`src/hooks/use*.ts` or `src/modules/*/hooks/use*.ts`).
   - Does NOT require a controller or service.

3. **Complex Client-Business Logic Involving UI State Orchestration**:
   - If a client workflow is large, stateful, or deeply intertwined with UI reactivity (e.g. multi-step auth wizard flow, real-time WebSocket chat streaming with message queueing), a **Custom Hook** MUST be used to bridge the View and Controller.
   - The Hook manages the reactive UI state and calls the Controller for backend operations, keeping the Controller lean and the View declarative.

---

## 🔐 6. RBAC & Client-Side Authorization Law

The client-side RBAC system strictly synchronizes with the backend's three-tier administrative hierarchy:

### 6.1 Three-Tier Administrative Hierarchy

1. **`super_admin` (Full System Authority)**:
   - Full access to all administration features, routes, user management, and IAM governance.
   - Admin sidebar renders **ALL** administrative navigation items.
2. **`admin` (Standard Administrator)**:
   - Full operational access across domain resources (`feedbacks`, `payments`, `ai`, `assets`, `logs`, `notifications`).
   - **Strict Restriction**: Restricted from `users` and `iam`. Admin sidebar hides User Management and IAM navigation items.
3. **Partial Admin (`*_admin` Suffix Naming Law)**:
   - Users who possess the base `user` role plus a specific `*_admin` role (e.g. `feedback_admin`, `payment_admin`, `ai_admin`).
   - **Sidebar Visibility Law**: Partial admins **ONLY see the specific admin sidebar navigation items corresponding to the `read_<resource>` permissions under their `*_admin` role** (e.g. a user with `feedback_admin` role only sees the Feedbacks admin nav item).

### 6.2 Permission Evaluation & UI Guards

- `currentUser.permissions` are grouped by resource (`{ users: ["read", "create", ...], feedbacks: ["read", "update"], ... }`).
- Client UI, protected routes, and side navigation bars enforce permissions via `usePermissions()` hook or permission guards.
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
  - **Folders (Multi-file Collections)**:
    - `components/` — Feature-specific UI components, dialogs, modals, and input cards (folder because it contains multiple components).
    - `pages/` — Feature-specific route screens and views (folder because it contains multiple pages/views).
  - **Flat Single Files (Directly under module root)**:
    - `<feature>.controller.ts` — Single domain controller orchestrating client-business logic.
    - `<feature>.service.ts` — Single API communication service.
    - `constants.ts` — Single domain constants & enums file.
    - `types.ts` — Single TypeScript interfaces, request/response models file.
    - `index.ts` — Clean barrel exporting public module interface.
  - **Multi-Service / Multi-Controller Exception**:
    - Do NOT create `controllers/` or `services/` folders when there is only one controller or service file.
    - If a large module expands in complexity and requires multiple separate services (e.g. `src/modules/admin/users/user.service.ts` and `src/modules/admin/iam/iam.service.ts`), dedicated subfolders may be created. Otherwise, keep them flat at the module root.
- Code outside `src/modules/` is strictly application-wide shared infrastructure (`src/design/`, `src/services/`, `src/constants/`, `src/contexts/`, `src/models/`, `src/routes/`, `src/locales/`, `src/helpers/`, `src/hooks/`, `src/atoms.ts`).

---

## ⏰ 11. UTC Transport & Client-Side Local Timezone Law

- **Rule**: The backend API operates exclusively in UTC.
- **Rule**: Web client MUST convert user local dates and range boundaries to UTC ISO 8601 strings (`start_date`, `end_date`) before dispatching API requests.
- **Rule**: Web client MUST parse and format all UTC timestamps received from the backend into the user's browser local timezone for presentation (e.g. `toLocaleDateString`, `toLocaleTimeString`, chart axis labels).

---

## 📚 12. Documentation Synchronization Law

- **Rule**: After EVERY feature creation, modification, or bugfix:
  - **`README.md`** MUST be updated with newly added screens, user workflows, feature capabilities, or configuration variables.
  - **`ECOSYSTEM.md`** MUST be updated if changes affect cross-platform feature parity, shared contracts, WebSocket events, or communication protocols between Web, Mobile, and Core.
  - **`LAW.md`** represents the non-negotiable constitutional framework; it should ONLY be modified when establishing, refining, or expanding fundamental architectural laws and engineering standards.
