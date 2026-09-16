// src/modules/landing/helpers/landingDomain.helper.ts

/**
 * Checks if the current window/hostname corresponds to the Rex9 landing deployment (rexone.rex9.me).
 *
 * When hosted on `rexone.rex9.me`, the frontend runs as a portfolio showcase where the "Enter"
 * app action button should be hidden. On all other domains/hostnames (e.g., localhost, rexone.me),
 * the "Enter" button remains visible.
 *
 * @param hostname Optional hostname to test (defaults to window.location.hostname)
 * @returns true if running on rexone.rex9.me (or www.rexone.rex9.me), false otherwise
 */
export const isRex9LandingDomain = (hostname?: string): boolean => {
  const host =
    hostname ??
    (typeof window !== "undefined" ? window.location.hostname : "");
  const normalized = host.trim().toLowerCase();
  return normalized === "rexone.rex9.me" || normalized === "www.rexone.rex9.me";
};
