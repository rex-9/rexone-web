# 🌙 Rexone Night Theme - Implementation Guide

## Overview

Night Theme is now fully integrated into Rexone Design System, creating an "inner sanctuary" experience perfect for self-reflection, inner peace, and quiet gratitude.

## 🎨 Night Theme Colors

### Deep Charcoal Backgrounds (No Harsh Blacks)

- **Darkest**: `#0D0D0D` - Deepest charcoal for main background
- **Dark**: `#121110` - Soft charcoal for secondary surfaces
- **Base**: `#1A1A18` - Base charcoal for elevated surfaces

### Soft Gold Accents

- **Soft**: `#E9D8A6` - Primary gold accent for night mode
- **Glow**: `#F8D57E` - Glowing gold (same as primary brand color)
- **Warm**: `#D4AF37` - Warm gold for highlights

### Text Colors

- **Primary**: `#F5F5F5` - Soft white for main text
- **Secondary**: `#D1D1D1` - Light gray for secondary text
- **Muted**: `#9D9D9D` - Muted gray for tertiary text

### Surface Colors

- **Card**: `#1F1F1D` - Card backgrounds
- **Elevated**: `#252523` - Elevated surfaces
- **Border**: `#2A2A28` - Borders and dividers

## 🎯 Theme Modes

The theme system now supports three modes:

1. **Auto** (Default) - Follows system preference
2. **Light** - Always light mode
3. **Dark** - Always night mode (the true Rexone experience)

## ✨ Special Features

### "Hidden Chamber" Effect

When switching to Night Mode for the first time:

- Screen fades smoothly
- Warm golden halo appears
- UI transforms slowly (300ms transition)
- Creates an addictive, ritual-like moment

### Smooth Transitions

- All colors transition smoothly (300ms ease-out)
- No flicker during theme changes
- Transitions disabled during theme toggle to prevent visual glitches

## 📦 Usage

### CSS Variables

All night theme colors are available as CSS variables:

```css
/* Backgrounds */
background-color: var(--mb-bg-primary); /* #0D0D0D in dark mode */
background-color: var(--mb-bg-secondary); /* #121110 in dark mode */

/* Text */
color: var(--mb-text-primary); /* #F5F5F5 in dark mode */
color: var(--mb-text-secondary); /* #D1D1D1 in dark mode */

/* Surfaces */
background-color: var(--mb-surface-card); /* #1F1F1D */
background-color: var(--mb-surface-elevated); /* #252523 */

/* Gold Accents */
color: var(--mb-gold-soft); /* #E9D8A6 */
box-shadow: var(--mb-shadow-glow); /* Golden glow */
```

### Tailwind Classes

Use Tailwind's `dark:` prefix for night theme styles:

```tsx
<div className="bg-white dark:bg-night-charcoal-darkest">
  <h1 className="text-navy-900 dark:text-night-text-primary">Title</h1>
</div>
```

### Component Usage

The `ThemeToggle` component cycles through: Auto → Light → Dark

```tsx
import { ThemeToggle } from "@/components";

<ThemeToggle />;
```

## 🎭 Design Philosophy

Night Theme embodies:

- **Inner Sanctuary** - Feels like meditation halls, temples, candles
- **Ritual** - Opening Rexone at night becomes a calming habit
- **Emotional Memory** - Merits feel more special in low-light, high-intimacy mode
- **Beautiful Contrast** - Gold accents POP on dark backgrounds

## 🔧 Implementation Details

### Files Modified

1. `src/design-system/atoms/colors.ts` - Added night theme color tokens
2. `src/design-system/tokens.css` - Added dark mode CSS variables
3. `src/design-system/tokens.js` - Added night theme for Tailwind
4. `src/components/ThemeToggle.tsx` - Enhanced with auto/light/dark modes
5. `src/atoms.ts` - Default theme changed to "auto"
6. `tailwind.config.js` - Added night theme colors
7. `src/index.css` - Added body background transitions

### CSS Variables Structure

- Light mode variables defined in `:root`
- Dark mode variables defined in `.dark` selector
- Smooth transitions applied globally
- Theme transition class prevents flicker

## 🚀 Next Steps

To fully utilize Night Theme in components:

1. Use CSS variables for colors
2. Add `dark:` Tailwind classes where needed
3. Test components in both light and dark modes
4. Consider making Night Mode the default for Reflection Mode

## 💡 Tips

- Night Mode works best with gold accents
- Use softer shadows in dark mode
- Text contrast is automatically handled via CSS variables
- The "hidden chamber" effect only triggers once per session

---

**Night Theme is now ready to create those beautiful, introspective moments.** 🌙✨
