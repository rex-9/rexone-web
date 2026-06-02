import { colors, typography, spacing, radius, shadows } from './src/design/atoms';
import daisyui from 'daisyui';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    daisyui,
    plugin(({ addBase }) => {
      addBase({
        ':root, [data-theme="day"]': {
          '--color-primary': colors.gold[500],
          '--color-primary-content': colors.navy[900],
          '--color-secondary': colors.blue[500],
          '--color-secondary-content': colors.navy[900],
          '--color-accent': colors.gold[400],
          '--color-accent-content': colors.navy[900],
          '--color-neutral': colors.gray[700],
          '--color-neutral-content': '#FFFFFF',
          '--color-base-100': colors.bg.primary,
          '--color-base-200': colors.bg.secondary,
          '--color-base-300': colors.bg.tertiary,
          '--color-base-content': colors.navy[900],
          '--color-info': colors.semantic.info,
          '--color-success': colors.semantic.success,
          '--color-warning': colors.semantic.warning,
          '--color-error': colors.semantic.error,
        },
        '[data-theme="night"]': {
          '--color-primary': colors.night.gold.soft,
          '--color-primary-content': colors.night.charcoal.darkest,
          '--color-secondary': colors.blue[500],
          '--color-secondary-content': colors.night.text.primary,
          '--color-accent': colors.night.gold.glow,
          '--color-accent-content': colors.night.charcoal.darkest,
          '--color-neutral': colors.night.surface.elevated,
          '--color-neutral-content': colors.night.text.primary,
          '--color-base-100': colors.night.bg.primary,
          '--color-base-200': colors.night.bg.secondary,
          '--color-base-300': colors.night.bg.tertiary,
          '--color-base-content': colors.night.text.primary,
          '--color-info': colors.semantic.info,
          '--color-success': colors.semantic.success,
          '--color-warning': colors.semantic.warning,
          '--color-error': colors.semantic.error,
        },
      });
    }),
  ],
  theme: {
    extend: {
      // Meritbox Design System Colors
      colors: {
        gold: colors.gold,
        blue: colors.blue,
        navy: colors.navy,
        gray: colors.gray,
        grey: colors.gray, // British spelling alias
      },

      // Typography from Meritbox Design System
      fontFamily: {
        sans: [typography.fontFamily.primary],
        primary: [typography.fontFamily.primary],
        display: [typography.fontFamily.display],
        handwritten: [typography.fontFamily.handwritten],
      },

      fontSize: {
        // Display
        'display-xl': [typography.fontSize.displayXL.fontSize, {
          lineHeight: typography.fontSize.displayXL.lineHeight,
          fontWeight: typography.fontSize.displayXL.fontWeight,
        }],
        'display-l': [typography.fontSize.displayL.fontSize, {
          lineHeight: typography.fontSize.displayL.lineHeight,
          fontWeight: typography.fontSize.displayL.fontWeight,
        }],
        'display-m': [typography.fontSize.displayM.fontSize, {
          lineHeight: typography.fontSize.displayM.lineHeight,
          fontWeight: typography.fontSize.displayM.fontWeight,
        }],

        // Headings
        'h1': [typography.fontSize.h1.fontSize, {
          lineHeight: typography.fontSize.h1.lineHeight,
          fontWeight: typography.fontSize.h1.fontWeight,
        }],
        'h2': [typography.fontSize.h2.fontSize, {
          lineHeight: typography.fontSize.h2.lineHeight,
          fontWeight: typography.fontSize.h2.fontWeight,
        }],
        'h3': [typography.fontSize.h3.fontSize, {
          lineHeight: typography.fontSize.h3.lineHeight,
          fontWeight: typography.fontSize.h3.fontWeight,
        }],
        'h4': [typography.fontSize.h4.fontSize, {
          lineHeight: typography.fontSize.h4.lineHeight,
          fontWeight: typography.fontSize.h4.fontWeight,
        }],

        // Body
        'body-l': [typography.fontSize.bodyL.fontSize, {
          lineHeight: typography.fontSize.bodyL.lineHeight,
          fontWeight: typography.fontSize.bodyL.fontWeight,
        }],
        'body-m': [typography.fontSize.bodyM.fontSize, {
          lineHeight: typography.fontSize.bodyM.lineHeight,
          fontWeight: typography.fontSize.bodyM.fontWeight,
        }],
        'body-s': [typography.fontSize.bodyS.fontSize, {
          lineHeight: typography.fontSize.bodyS.lineHeight,
          fontWeight: typography.fontSize.bodyS.fontWeight,
        }],

        // Caption
        'caption': [typography.fontSize.caption.fontSize, {
          lineHeight: typography.fontSize.caption.lineHeight,
          fontWeight: typography.fontSize.caption.fontWeight,
        }],
      },

      fontWeight: {
        light: typography.fontWeight.light,
        regular: typography.fontWeight.regular,
        normal: typography.fontWeight.regular,
        medium: typography.fontWeight.medium,
        semibold: typography.fontWeight.semibold,
        bold: typography.fontWeight.bold,
      },

      spacing: spacing,

      borderRadius: radius,

      boxShadow: shadows,
    },
  },
  daisyui: {
    themes: [
      "day --default",
      "night --prefersdark",
    ],
    base: true,
    styled: true,
    utils: true,
  },
};
