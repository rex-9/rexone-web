# Meritbox Design System - Quick Start Guide

## 🚀 Getting Started

The design system is now fully integrated into your project. Here's how to use it:

### 1. Import Tokens in TypeScript/React

```typescript
import { colors, typography, spacing, radius, shadows } from "@/design";
```

### 2. Use Tailwind Classes (Recommended)

```tsx
<div className="bg-gold-500 text-navy-900 p-16 rounded-m shadow-s">
  <h1 className="text-h1 font-semibold">Hello Meritbox Design System</h1>
  <p className="text-body-m">Using design system tokens</p>
</div>
```

### 3. Use CSS Variables

```css
.my-component {
  background: var(--mb-gold-500);
  padding: var(--mb-spacing-16);
  border-radius: var(--mb-radius-m);
}
```

## 🎨 Available Tokens

### Colors

- `gold-400`, `gold-500`, `gold-600`
- `blue-400`, `blue-500`, `blue-600`
- `navy-700`, `navy-900`
- `gray-50`, `gray-100`, `gray-300`, `gray-500`, `gray-700`, `gray-900`
- `success`, `warning`, `error`, `info`

### Typography Classes

- `text-display-xl`, `text-display-l`, `text-display-m`
- `text-h1`, `text-h2`, `text-h3`, `text-h4`
- `text-body-l`, `text-body-m`, `text-body-s`
- `text-caption`

### Spacing

- `p-4`, `p-8`, `p-12`, `p-16`, `p-20`, `p-24`, `p-32`, `p-40`, `p-48`, `p-64`, `p-80`
- Same for `m-*`, `gap-*`, etc.

### Radius

- `rounded-xs`, `rounded-s`, `rounded-m`, `rounded-l`, `rounded-full`

### Shadows

- `shadow-xs`, `shadow-s`, `shadow-m`, `shadow-glow`

## 📝 Example Component

```tsx
import React from "react";

export const Card = ({ title, children }) => {
  return (
    <div className="bg-white p-16 rounded-m shadow-s">
      <h2 className="text-h2 font-semibold text-navy-900 mb-8">{title}</h2>
      <p className="text-body-m text-gray-700">{children}</p>
    </div>
  );
};
```

## 🔧 Extending

To add new tokens:

1. Add to the appropriate atom file (`atoms/colors.ts`, etc.)
2. Import to Tailwind config
3. Use from Tailwind config

#########################################################################################################################

# Meritbox Design System

**Clean, warm, calming, modern, premium**

A robust, extensible design system built with Atomic Design principles, designed to evoke inner peace, mindfulness, warmth, hope, and soft melanated light.

## 🌱 Structure

```
design-system/
├── atoms/           # Foundation tokens
│   ├── colors.ts   # Color palette
│   ├── typography.ts # Typography system
│   ├── spacing.ts   # Spacing scale
│   ├── radius.ts    # Border radius
│   ├── shadows.ts   # Shadow system
│   ├── motion.ts    # Animation tokens
│   └── index.ts     # Atom exports
├── tokens.css       # CSS custom properties
├── tokens.js        # JavaScript tokens (for Tailwind)
├── types.ts         # TypeScript types
├── utils.ts         # Utility functions
├── index.ts         # Main export
└── README.md        # This file
```

## 🎨 Design Tokens

### Colors

**Core Brand Colors:**

- **Kindness Gold** (`gold-500`): `#F8D57E` - Primary brand color
- **Clarity Blue** (`blue-500`): `#9EC9FF` - Secondary brand color
- **Deep Navy** (`navy-900`): `#14202E` - Anchor color

**Utility Grays:**

- `gray-50` through `gray-900` - Minimalist grayscale palette

**Semantic Colors:**

- `success`: `#4CAF50`
- `warning`: `#FFC85C`
- `error`: `#F05454`
- `info`: `#74B3FF`

### Typography

**Font Family:** Inter (with SF Pro fallback)

**Font Scale:**

- Display: `display-xl`, `display-l`, `display-m`
- Headings: `h1`, `h2`, `h3`, `h4`
- Body: `body-l`, `body-m`, `body-s`
- Caption: `caption`

### Spacing

8-based spacing scale: `0`, `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `64`, `80`

### Radius

Soft, gentle radius system: `xs` (4px), `s` (8px), `m` (12px - default), `l` (16px), `full` (999px)

### Shadows

Subtle, Apple-quality shadows: `xs`, `s`, `m`, `glow`

### Motion

Gentle animations with durations and easing functions for fade & rise, hover scale, and glow pulse effects.

## 📦 Usage

### Import Tokens

```typescript
import { colors, typography, spacing, radius, shadows } from "@/design-system";
```

### Use in TypeScript/React

```typescript
import { colors, getColor, getSpacing } from "@/design-system";

// Direct access
const primaryColor = colors.gold[500];

// Using utilities
const gold = getColor("gold", 500);
const spacing = getSpacing(16);
```

### Use in Tailwind Classes

The tokens are automatically available in Tailwind:

```tsx
<div className="bg-gold-500 text-navy-900 p-8 rounded-m shadow-s">Content</div>
```

### Use CSS Variables

```css
.my-component {
  background-color: var(--mb-gold-500);
  padding: var(--mb-spacing-16);
  border-radius: var(--mb-radius-m);
  box-shadow: var(--mb-shadow-s);
}
```

### Typography Classes

```tsx
<h1 className="text-h1">Heading 1</h1>
<p className="text-body-m">Body text</p>
<span className="text-caption">Caption</span>
```

## 🔧 Extending the System

### Adding a New Color

1. Add to `atoms/colors.ts`:

```typescript
export const colors = {
  // ... existing colors
  newColor: {
    400: "#HEX",
    500: "#HEX",
    600: "#HEX",
  },
};
```

1. Import new color to Tailwind config.
2. Use from Tailwind config.

### Adding a New Spacing Value

1. Add to `atoms/spacing.ts`
2. Update Tailwind config
3. Use from Tailwind config

## 🎯 Design Principles

1. **Atomic Design**: Start with atoms, build up to molecules, organisms, templates, and pages
2. **Consistency**: Use tokens consistently throughout the application
3. **Extensibility**: Easy to modify, extend, or change
4. **Type Safety**: Full TypeScript support
5. **Accessibility**: Colors meet WCAG contrast requirements
6. **Emotional Design**: Every token evokes warmth, calm, and hope
