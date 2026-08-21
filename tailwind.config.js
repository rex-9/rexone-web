// tailwind.config.js
import { colors, typography, spacing, radius, shadows, motion } from './src/design/elements';
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
          '--color-primary': colors.primary,
          '--color-primary-content': '#FFFFFF',
          '--color-secondary': colors.secondary,
          '--color-secondary-content': '#FFFFFF',
          '--color-accent': colors.accent,
          '--color-accent-content': '#FFFFFF',
          '--color-base-100': colors.day.background,
          '--color-base-200': colors.day.surface,
          '--color-base-300': colors.day.card,
          '--color-base-content': colors.day.textPrimary,
          '--color-border': colors.day.border,
          '--color-divider': colors.day.divider,
          '--color-info': colors.semantic.info,
          '--color-success': colors.semantic.success,
          '--color-warning': colors.semantic.warning,
          '--color-error': colors.semantic.error,
        },
        '[data-theme="night"]': {
          '--color-primary': colors.primary,
          '--color-primary-content': '#FFFFFF',
          '--color-secondary': colors.secondary,
          '--color-secondary-content': '#FFFFFF',
          '--color-accent': colors.accent,
          '--color-accent-content': '#FFFFFF',
          '--color-base-100': colors.night.background,
          '--color-base-200': colors.night.surface,
          '--color-base-300': colors.night.card,
          '--color-base-content': colors.night.textPrimary,
          '--color-border': colors.night.border,
          '--color-divider': colors.night.divider,
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
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        glass: colors.glass,
      },
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight,
      fontSize: typography.fontSize,
      spacing: spacing,
      borderRadius: radius,
      boxShadow: shadows,
      keyframes: {
        fadeRise: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      animation: {
        'fade-rise': `fadeRise ${motion.duration.normal}ms ${motion.easing.easeOut}`,
        'glow-pulse': `glowPulse ${motion.duration.slower}ms ease-in-out infinite`,
        'fade-in': `fadeRise ${motion.duration.fast}ms ${motion.easing.easeIn}`,
        'slide-up': `fadeRise ${motion.duration.slow}ms ${motion.easing.easeOut}`,
      },
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