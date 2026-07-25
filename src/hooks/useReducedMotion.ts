"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Reads `prefers-reduced-motion` via useSyncExternalStore (not effect+setState) so it is
 * hydration-safe. Every motion utility (Lenis, GSAP reveals/pinning, the Three.js scene)
 * must check this and fall back to a static/simple-fade experience.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
