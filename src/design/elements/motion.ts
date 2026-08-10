// src/design/elements/motion.ts

/**
 * Rexone Design System - Motion Tokens
 *
 * Simple, consistent animation values for Tailwind
 */

export const motion = {
  // Durations (in milliseconds) - matches Tailwind's duration classes
  duration: {
    fast: 150, // duration-150
    normal: 200, // duration-200
    slow: 300, // duration-300
    slower: 500, // duration-500
  },

  // Easing - matches Tailwind's easing classes
  easing: {
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;
