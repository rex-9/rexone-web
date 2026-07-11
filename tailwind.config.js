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
          '--color-primary': colors.gold[500],
          '--color-primary-content': colors.navy[900],
          '--color-secondary': colors.blue[500],
          '--color-secondary-content': colors.navy[900],
          '--color-accent': colors.gold[400],
          '--color-accent-content': colors.navy[900],
          '--color-neutral': colors.gray[700],
          '--color-neutral-content': '#FFFFFF',
          '--color-base-100': colors.day.bg.primary,
          '--color-base-200': colors.day.bg.secondary,
          '--color-base-300': colors.day.bg.tertiary,
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
      // ===== COLORS =====
      colors: {
        gold: colors.gold,
        blue: colors.blue,
        navy: colors.navy,
        gray: colors.gray,
        grey: colors.gray, // British spelling alias
      },

      // ===== TYPOGRAPHY =====
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight,
      fontSize: typography.fontSize,

      // ===== SPACING =====
      spacing: spacing,

      // ===== RADIUS =====
      borderRadius: radius,

      // ===== SHADOWS =====
      boxShadow: shadows,

      // ===== ANIMATIONS =====
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