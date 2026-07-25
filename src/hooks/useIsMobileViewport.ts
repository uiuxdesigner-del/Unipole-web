"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 767px)";

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
 * Coarse mobile-viewport check, hydration-safe via `useSyncExternalStore` (mirrors
 * `useReducedMotion`). Used to trim WebGL scene complexity on phones without an
 * effect+setState mount flag.
 */
export function useIsMobileViewport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
