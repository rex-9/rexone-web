// src/design/elements/keyframes.ts
import { colors } from "./colors";

/**
 * Rexone Design System - Animation Keyframes & Motion
 * Sourced directly from Rex9 design system
 */

export const keyframes = {
  shine: {
    "0%": {
      color: colors.glowOuter,
      textShadow: "none",
    },
    "100%": {
      color: colors.glowWhite,
      textShadow: colors.effects.heroSign,
    },
  },
  blink: {
    "0%, 22%, 36%, 75%": {
      color: colors.glowWhite,
      textShadow: colors.effects.heroSign,
    },
    "28%, 33%": {
      color: colors.primary,
      textShadow: "none",
    },
    "82%, 97%": {
      color: colors.primaryDark,
      textShadow: "none",
    },
  },
  flicker: {
    "from, to, 24%, 42%, 68%": { opacity: "1" },
    "4%, 12%, 17%, 46%, 56%, 58%, 70%": { opacity: "0.9" },
    "6%": { opacity: "0.85" },
    "8%, 14%, 44%, 72%, 95%": { opacity: "0.95" },
    "10%": { opacity: "0.9" },
    "11%": { opacity: "0.922" },
    "16%, 28%": { opacity: "0.98" },
    "19%, 37%, 45%, 93%, 97%": { opacity: "0.93" },
    "20%, 60%": { opacity: "0.99" },
    "26%": { opacity: "0.94" },
    "38%": { opacity: "0.5" },
    "39%": { opacity: "0.96" },
  },
  bounce: {
    "0%": { transform: "translateY(8px)" },
    "100%": { transform: "translateY(-8px)" },
  },
  btnAnim1: {
    "0%": { left: "-100%" },
    "50%, 100%": { left: "100%" },
  },
  btnAnim2: {
    "0%": { top: "-100%" },
    "50%, 100%": { top: "100%" },
  },
  btnAnim3: {
    "0%": { right: "-100%" },
    "50%, 100%": { right: "100%" },
  },
  btnAnim4: {
    "0%": { bottom: "-100%" },
    "50%, 100%": { bottom: "100%" },
  },
} as const;

export const animations = {
  "hero-sign": "shine 2s forwards, flicker 3s infinite",
  "flicker-char": "shine 2s forwards, blink 3s 2s infinite",
  "fast-flicker-char": "shine 2s forwards, blink 10s 1s infinite",
  "neon-border-1": "btnAnim1 1s linear infinite",
  "neon-border-2": "btnAnim2 1s linear infinite 0.25s",
  "neon-border-3": "btnAnim3 1s linear infinite 0.5s",
  "neon-border-4": "btnAnim4 1s linear infinite 0.75s",
  "down-bounce": "bounce 1.2s alternate-reverse infinite ease-in-out",
} as const;
