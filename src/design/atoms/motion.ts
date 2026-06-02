/**
 * Meritbox Design System - Motion & Animation Tokens
 *
 * Gentle animations for dopamine and emotional connection
 */

export const motion = {
  // Durations (in milliseconds)
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },

  // Easing functions
  easing: {
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  // Common animations
  animations: {
    fadeRise: {
      duration: 200,
      easing: "cubic-bezier(0, 0, 0.2, 1)",
      properties: {
        opacity: [0, 1],
        transform: ["translateY(8px)", "translateY(0)"],
      },
    },
    hoverScale: {
      scale: 1.02,
      duration: 200,
      easing: "cubic-bezier(0, 0, 0.2, 1)",
    },
    glowPulse: {
      duration: 2000,
      easing: "ease-in-out",
      iteration: "infinite",
      properties: {
        opacity: [0.6, 1, 0.6],
        transform: ["scale(1)", "scale(1.05)", "scale(1)"],
      },
    },
  },
} as const;

export type MotionToken = typeof motion;
export type Duration = (typeof motion.duration)[keyof typeof motion.duration];
export type Easing = (typeof motion.easing)[keyof typeof motion.easing];
