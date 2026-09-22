# 🏛️ RexOne Web Architectural Law

> [!IMPORTANT]
>
> ### 📜 Unified Ecosystem Constitution (`LAW.md`)
>
> The single canonical source of truth for all architectural laws across the entire **RexOne Ecosystem** (`rex-9`) is maintained centrally in **RexOne Core**:
>
> 🔗 **Master Constitution**:
> [https://github.com/rex-9/rexone-core/blob/dev/LAW.md](https://github.com/rex-9/rexone-core/blob/dev/LAW.md)
>
> 💻 **RexOne Web Architectural Laws (Direct Anchor)**:
> [https://github.com/rex-9/rexone-core/blob/dev/LAW.md#-part-ii-rexone-web-architectural-laws-frontend--react-19](https://github.com/rex-9/rexone-core/blob/dev/LAW.md#-part-ii-rexone-web-architectural-laws-frontend--react-19)
>
> 🌐 **Universal Constitutional Principles (Direct Anchor)**:
> [https://github.com/rex-9/rexone-core/blob/dev/LAW.md#-universal-constitutional-principles-ecosystem-wide](https://github.com/rex-9/rexone-core/blob/dev/LAW.md#-universal-constitutional-principles-ecosystem-wide)

> > _"If you don't follow These LAWS, u're gay."_
> >
> > — _Newton'z Law_

---

## ⚡ RexOne Web Quick Reference (Client-Specific Highlights)

For the full binding text and universal ecosystem laws, always refer to the [Unified Master Constitution](https://github.com/rex-9/rexone-core/blob/dev/LAW.md).

| Law & Section                       | Core Architectural Rule                                                                                                                                                                 | Key Mechanism                                                                     |
| :---------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **W1. Design System & Components**  | Zero components outside `src/design/`. NEVER use raw HTML elements (`<img>`, `<button>`, `<a>`, `<textarea>`, `<select>`).                                                              | `src/design/components/` (`Asset`, `Button`, `TextLink`, `Dialog`, `TextInput`)   |
| **W2. Automated Theming & Spacing** | Strict adherence to standard Tailwind continuous scale (`p-2`, `w-55`, `w-65`, `w-90`, `h-90`, `max-w-55`, `shrink-0`). Zero custom pixel classes matching standard scale.              | Semantic Tailwind & DaisyUI tokens (`bg-base-100`, `text-primary`, `btn-primary`) |
| **W3. Centralized Assets & Media**  | ALL static assets registered in `src/assets/index.ts`. Zero inline SVGs; use `iconsLib` or `.svg` with `Asset`.                                                                         | `src/assets/index.ts`, `iconsLib`, `Asset`                                        |
| **W4. State Management**            | ZERO direct access to `localStorage`, `sessionStorage`, or `document.cookie`. Persistent state managed exclusively via Jotai.                                                           | `src/atoms.ts`, `AtomService.getAtom()`, `StorageKeys.*`                          |
| **W5. Loading Authority**           | Universal `LoadingContext` authority. NEVER declare redundant local loading states (`const [isLoading, setIsLoading] = useState(false)`).                                               | `useLoading()` (`const { isLoading, setLoading } = useLoading()`)                 |
| **W6. 4-Tier MVCS Layering**        | Strict separation: Models $\rightarrow$ Views $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Transport (`ApiService`). Bifurcate backend-facing logic vs UI-only hooks. | `<feature>.controller.ts`, `<feature>.service.ts`, `src/hooks/`                   |
| **W7. Client Admin Portal & RBAC**  | Non-admin roles have ZERO admin portal access. Admin capabilities scoped strictly to `*_admin` roles. Granular CUD button and route guards.                                             | `AdminRootRoute`, `can(action, resource)`, `usePermissions()`                     |
| **W8. Response Parsing**            | Universal Pagy pagination parsing. Zero manual Axios parsing or custom `limit: "all"` queries.                                                                                          | `parseResponse`, `parsePaginatedResponse` in `ApiService`                         |
| **W9. Lifecycle & Recycle Bin**     | Active views strictly use `discard` (soft delete) with `handleDiscard`. Hard deletion (`destroy` / `handleDestroy`) is strictly confined to Recycle Bin.                                | `ADMIN_ACTIONS.DISCARD`, `ADMIN_ACTIONS.UNDISCARD`, `ConfirmDialog`               |
| **W10. Module Boundaries**          | Feature domains live in `src/modules/<feature>/` (`components/`, `pages/`, flat root files). Shared utilities live in `src/design/`, `src/services/`, etc.                              | Clean encapsulation, zero circular dependencies                                   |
| **W11. Dashboard Separation**       | Client Admin Panel handles business KPIs, RBAC, feedback, client telemetry. Rails APM (Pulse, RED, Solid Queue) is reserved strictly for Rails Super Admins.                          | Pure client business UI, zero server APM duplication                             |

---

## 🌐 Universal Constitutional Highlights (Ecosystem-Wide)

| Universal Law                       | Ecosystem Architectural Principle                                                                                                                       | Client Implementation                                                             |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------- |
| **U2. Zero Loose Literals**         | Centralized constants/enums for all keys, statuses, providers, and action names. Zero magic strings.                                                     | `StorageKeys.*`, `ADMIN_ACTIONS.*`, centralized route constants                   |
| **U5. Lifecycle Hierarchy**         | Universal `discard` (soft delete) & `undiscard` (restore). Permanent `destroy` strictly confined to Recycle Bin.                                        | `handleDiscard` in active views, `handleDestroy` in recycle bin                   |
| **U6. Confirmation Dialogs**        | ALL destructive, irreversible actions gated behind explicit confirmation dialogs.                                                                       | `ConfirmDialog` component; raw browser popups strictly forbidden                  |
| **U9. Parameter Integrity**         | Strict, deterministic parameters. Zero fallback chains (`params[:a] || params[:b]`).                                                                    | Strongly typed request payloads matching backend strong parameters                |
| **U14. Zero Loose Code**            | Strict parameter contracts. Zero alias shims or fallback kwargs (`name: nil, user_name: nil`). Pass cohesive entities directly. Zero dead code.         | Strongly typed interfaces, zero loose params, clean deterministic signatures      |
| **U15. Human-Readable Code**        | Plain English naming, compact straightforward variables, zero alien/cryptic syntax. Easy to read and review.                                             | Self-documenting code, natural English identifiers, clean idiomatic control flow  |
