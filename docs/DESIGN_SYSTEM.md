# RexOne High-Contrast Design System

> **A sovereign, high-contrast design system built for speed, precision, and longevity.**  
> Built with **Tailwind CSS v4** + **DaisyUI v5** on **React 19**.  
> Aesthetic Creed: High contrast, unapologetic, and stylish—Red & Black in daylight, Red & White in night, glowing neon on glass.

---

## 1. Architectural Overview & Philosophy

The RexOne Design System enforces absolute centralization and zero redundancy. It solves theme management, typography scaling, and brand consistency at the root layer rather than distributing styling debt into hundreds of individual React components.

### Core Principles
1. **Single Point of Truth**: Every color, font, border radius, and glow effect originates strictly from `src/design/elements/`.
2. **Zero Hardcoded Colors**: No component or controller may contain hex codes (`#hex`), raw RGBA strings, or hardcoded utility colors (`text-white`, `text-black`, `bg-white`, `bg-black`).
3. **Flicker-Free Theme Toggling**: Themes (`day` and `night`) switch instantaneously via CSS variables bound to the root HTML attribute (`<html data-theme="...">`). Zero React component re-renders. Zero `dark:` prefix clutter.
4. **No Dumb / Redundant Code**: DaisyUI 5 natively produces semantic utility classes (`bg-base-100`, `text-base-content`, `bg-primary`, `text-primary-content`, `border-base-300`, `bg-secondary`, `bg-accent`, `bg-neutral`). We do not re-map or duplicate these inside `tailwind.config.js`.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 19 + TypeScript | Component runtime & strict contract typing |
| **CSS Engine** | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first styling with native CSS-variable discovery |
| **Token & Component Primitives** | DaisyUI v5 | Semantic color tokens, badges, buttons, modals, form controls |
| **State & Theme Management** | Jotai (`atoms.themeAtom`) + DOM hook | Root theme attribute binding (`document.documentElement.setAttribute('data-theme', theme)`) |
| **Class Merging** | `clsx` + `tailwind-merge` (`cn` helper) | Conflict-free className merging and conditional class composition |

---

## 3. Typography Engine

All typography tokens are centralized in [`src/design/elements/font.ts`](file:///Users/rex/Desktop/Dev/rexone/rexone-web/src/design/elements/font.ts) and imported in [`src/design/styles/fonts.css`](file:///Users/rex/Desktop/Dev/rexone/rexone-web/src/design/styles/fonts.css).

```
src/design/elements/font.ts (Tokens)
       │
       ▼
tailwind.config.js (addBase :root injection)
       │
       ▼
src/design/styles/index.css (Applied globally to html, body)
```

### Font Families

| Token | Family Name | Fallbacks | Tailwind Utility | Primary Usage |
| :--- | :--- | :--- | :--- | :--- |
| `primary` | `"Quicksand"` | `sans-serif` | `font-primary`, default `sans` | General UI, body text, form fields, buttons, navigation, headers |
| `display` | `"Clip"` | `cursive, sans-serif` | `font-display` | Landing hero titles, high-impact section headlines, neon signs |
| `handwritten`| `"Storytime"` | `cursive` | `font-handwritten` | Signature notes, quotes, bespoke editorial accents |
| `mono` | *System Monospace* | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` | `font-mono` | IDs, UUIDs, coupon codes, hashes, tokens, timestamps, JSON telemetry, data tables |

### Global Typography Inheritance
- `html` and `body` automatically inherit `var(--font-primary)`.
- Default Tailwind `font-sans` is mapped to `[font.fontFamily.primary]`.
- Default Tailwind `font-mono` is mapped to `[font.fontFamily.mono]`.
- **To swap fonts globally**: Update [`src/design/styles/fonts.css`](file:///Users/rex/Desktop/Dev/rexone/rexone-web/src/design/styles/fonts.css) and [`src/design/elements/font.ts`](file:///Users/rex/Desktop/Dev/rexone/rexone-web/src/design/elements/font.ts). The entire application updates automatically without touching any UI components.

---

## 4. Color & Theme Architecture

All colors are centralized in [`src/design/elements/colors.ts`](file:///Users/rex/Desktop/Dev/rexone/rexone-web/src/design/elements/colors.ts).

### Brand & Accent Colors
- **Rex9 Scarlet Red (Primary)**: `#FF2238`
- **Primary Light**: `#FF5263`
- **Primary Dark**: `#CC1125`
- **Glow Outer Core**: `#5C0916` (RGB: `92, 9, 22`)
- **Glow White Core**: `#FFF2F4`

### Theme Contrast Matrix

| Semantic Token | Day Mode (`day`) | Night Mode (`night`) | Description |
| :--- | :--- | :--- | :--- |
| `primary` | `#FF2238` | `#FF2238` | Iconic Rex9 scarlet red brand identity |
| `primary-content` | `#FFFFFF` | `#FFFFFF` | Crisp high-contrast white text on red buttons |
| `base-100` | `#FFFFFF` | `#160B11` | Main page background (pure white vs deep wine noir) |
| `base-200` | `#FFFFFF` | `#1C0D16` | Surface containers, card backgrounds |
| `base-300` | `#F8F8FA` | `#2A1420` | Secondary cards, subtle panels, dividers, borders |
| `base-content` | `#000000` | `#FFFFFF` | Main body text (**pure black in day, pure white in night**) |
| `secondary` | `#FF4D2E` | `#FF5263` | Secondary action highlights |
| `accent` | `#FF0D2D` | `#FF2238` | Tertiary accents and dynamic indicators |
| `neutral` | `#F8F8FA` | `#2A1420` | Neutral surfaces |
| `neutral-content` | `#000000` | `#FFFFFF` | High-contrast text on neutral surfaces |

### Semantic Status Indicators
All semantic indicators enforce `#FFFFFF` foreground text (`*-content`) for AAA contrast:
- **Info**: `#38BDF8` (`text-info`, `bg-info/10`, `border-info/30`)
- **Success**: `#10B981` (`text-success`, `bg-success/10`, `border-success/30`)
- **Warning**: `#F59E0B` (`text-warning`, `bg-warning/10`, `border-warning/30`)
- **Error**: `#EF4444` (`text-error`, `bg-error/10`, `border-error/30`)

### Glassmorphism & Neon Effects
Centralized in `colors.glass` and `colors.effects`:
- **Glass Nav**: `rgba(22, 7, 13, 0.75)`
- **Glass Card**: `rgba(35, 12, 20, 0.38)` with `border: rgba(255, 34, 56, 0.22)`
- **Glass Card Hover**: `rgba(50, 16, 28, 0.55)` with `border: rgba(255, 34, 56, 0.55)`
- **Neon Sign**: Multi-layer box/text shadows radiating from `var(--color-glow-white)` through `var(--color-primary)` to `var(--color-glow-outer)`.

---

## 5. Clean Tailwind Configuration (`tailwind.config.js`)

In accordance with Dante's principle of zero redundancy, `theme.extend.colors` only declares custom Rex9 extensions that DaisyUI does not natively supply:

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    daisyui,
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--font-primary': font.fontFamily.primary,
          '--font-display': font.fontFamily.display,
          '--font-handwritten': font.fontFamily.handwritten,
          '--font-mono': font.fontFamily.mono,
        },
        ':root, [data-theme="day"]': {
          '--color-primary': colors.day.primary,
          '--color-primary-rgb': colors.day.primaryRgb,
          '--color-primary-light': colors.day.primaryLight,
          '--color-primary-dark': colors.day.primaryDark,
          '--color-glow-white': colors.day.glowWhite,
          '--color-glow-outer': colors.day.glowOuter,
          '--color-glow-outer-rgb': colors.day.glowOuterRgb,
          '--color-primary-content': colors.text.night.primary,
          '--color-secondary': colors.secondary,
          '--color-secondary-content': colors.text.night.primary,
          '--color-accent': colors.accent,
          '--color-accent-content': colors.text.night.primary,
          '--color-base-100': colors.day.background,
          '--color-base-200': colors.day.surface,
          '--color-base-300': colors.day.card,
          '--color-base-content': colors.text.day.primary,
          '--color-base-content-rgb': colors.text.day.primaryRgb,
          '--color-neutral': colors.day.card,
          '--color-neutral-content': colors.text.day.primary,
          '--color-border': colors.day.border,
          '--color-divider': colors.day.divider,
          '--color-info': colors.semantic.info,
          '--color-info-content': colors.text.night.primary,
          '--color-success': colors.semantic.success,
          '--color-success-content': colors.text.night.primary,
          '--color-warning': colors.semantic.warning,
          '--color-warning-content': colors.text.night.primary,
          '--color-error': colors.semantic.error,
          '--color-error-content': colors.text.night.primary,
        },
        '[data-theme="night"]': {
          '--color-primary': colors.night.primary,
          '--color-primary-rgb': colors.night.primaryRgb,
          '--color-primary-light': colors.night.primaryLight,
          '--color-primary-dark': colors.night.primaryDark,
          '--color-glow-white': colors.night.glowWhite,
          '--color-glow-outer': colors.night.glowOuter,
          '--color-glow-outer-rgb': colors.night.glowOuterRgb,
          '--color-primary-content': colors.text.night.primary,
          '--color-secondary': colors.night.primaryLight,
          '--color-secondary-content': colors.text.night.primary,
          '--color-accent': colors.night.primary,
          '--color-accent-content': colors.text.night.primary,
          '--color-base-100': colors.night.background,
          '--color-base-200': colors.night.surface,
          '--color-base-300': colors.night.card,
          '--color-base-content': colors.text.night.primary,
          '--color-base-content-rgb': colors.text.night.primaryRgb,
          '--color-neutral': colors.night.card,
          '--color-neutral-content': colors.text.night.primary,
          '--color-border': colors.night.border,
          '--color-divider': colors.night.divider,
          '--color-info': colors.semantic.info,
          '--color-info-content': colors.text.night.primary,
          '--color-success': colors.semantic.success,
          '--color-success-content': colors.text.night.primary,
          '--color-warning': colors.semantic.warning,
          '--color-warning-content': colors.text.night.primary,
          '--color-error': colors.semantic.error,
          '--color-error-content': colors.text.night.primary,
        },
      });
    }),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
          content: 'var(--color-primary-content)',
        },
        glow: {
          white: 'var(--color-glow-white)',
          outer: 'var(--color-glow-outer)',
        },
        glass: colors.glass,
      },
      fontFamily: {
        ...font.fontFamily,
        sans: [font.fontFamily.primary],
        mono: [font.fontFamily.mono],
      },
    },
  },
  daisyui: {
    themes: ["day --default", "night --prefersdark"],
    base: true,
    styled: true,
    utils: true,
  },
};
```

---

## 6. How Theme Switching Works

The theme system operates with zero latency and zero React re-render cascades:

```
[User clicks ThemeToggle.tsx]
           │
           ▼
atoms.themeAtom updated in Jotai
           │
           ▼
useTheme() hook executes:
document.documentElement.setAttribute('data-theme', theme)
           │
           ▼
Browser activates matching CSS variables on :root:
--color-base-100, --color-base-content, --color-primary, etc.
           │
           ▼
Entire DOM updates styles natively in CSS in < 1ms
```

---

## 7. Component Library Catalog (`src/design/components/`)

### Action Controls
- **`Button`**: Primary (Rex9 red), Secondary, Tertiary, Danger, Glass. Natively applies `text-primary-content` on solid red buttons.
- **`AdminTableActions`**: Compact square icon buttons for high-density administrative tables.

### Form Inputs
- **`TextInput`**: Underline-glass or boxed-bordered variant with theme-adaptive label and error states.
- **`TextArea`**: Auto-resizing or fixed multi-line input with interactive `hover:border-primary`.
- **`PasswordInput`**: High-security 6-digit segmented passcode control with auto-advance, backspace handling, paste distribution, masked characters, and `font-mono`/`font-primary`.
- **`SearchInput`**: Debounced search field with search-by metadata tooltips and clear button.
- **`Dropdown`**: Single and multi-select select input with optgroup support.
- **`Checkbox` & `Radio`**: High-contrast styled checkboxes and radios with `checked:bg-primary` and `hover:border-primary`.
- **`Toggle`**: Accessible toggle switch with smooth slide animation.
- **`FileInput`**: Stylized file upload with file type constraints and trigger buttons.
- **`DateTimePicker`**: DaisyUI-styled date and time picker supporting `datetime-local`, `date`, and `time` modes, clear action, min/max range constraints, and field-level error messages.
- **`NumberInput`**: DaisyUI-styled numeric input with automatic sanitization stripping invalid leading zeroes (e.g. `05` $\rightarrow$ `5`, `00` $\rightarrow$ `0`, while preserving decimals like `0.5`), min/max bounds clamping, stepper controls, and prefix/suffix adornments.

### Overlays & Dialogs
- **`Dialog`**: Accessible modal with focus containment, ESC key dismissal, click-outside backdrop (`.modal-backdrop`), and smooth transitions.
- **`ConfirmDialog`**: Standalone destructive / confirmation action prompt.
- **`LoadingOverlay`**: Non-blocking global spinner with subtle dimming scrim (`bg-black/20`).

### Detail & Presentation Primitives
- **`DetailHeader`**: Resource detail view header with title, back navigation, status badge, and action slots.
- **`DetailSection`**: Grouped card section with optional accent line and `hover:border-primary`.
- **`DetailGrid`**: Responsive 1-to-4 column grid layout for key-value resource attributes.
- **`DetailField`**: Individual label/value pair supporting text, badges, code (`font-mono`), copy buttons, and links.
- **`CopyButton`**: Clipboard copy button with tactile visual feedback.

---

## 8. Constitutional Rules for Developers

When contributing code to `rexone-web`, adhere strictly to these rules:

1. **NO Hardcoded Hex Codes**:
   - ❌ `<div style={{ color: "#FF2238" }}>`
   - ✅ `<div className="text-primary">` or `<div style={{ color: "var(--color-primary)" }}>`

2. **NO Hardcoded `text-white` or `text-black`**:
   - ❌ `<span className="text-black dark:text-white">`
   - ❌ `<span className="text-white">` (on default background)
   - ✅ `<span className="text-base-content">`
   - ✅ `<span className="text-primary-content">` (on `bg-primary` buttons/badges)

3. **NO Redundant Tailwind Color Definitions**:
   - Do not add `base`, `neutral`, `secondary`, or `accent` to `theme.extend.colors`. DaisyUI provides them natively.

4. **Monospace for Code, Tokens & Telemetry**:
   - Any UUID, hash, coupon code, date/time timestamp, or technical token MUST use `font-mono`.

5. **Interactive Borders Must Use `hover:border-primary`**:
   - All interactive cards, tiles, and form inputs must use `hover:border-primary` to produce the signature Rex9 red glow on interaction.
