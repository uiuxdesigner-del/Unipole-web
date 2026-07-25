"use client";

import { createContext, useContext } from "react";

export interface SmoothScrollContextValue {
  stop: () => void;
  start: () => void;
}

export const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  stop: () => {},
  start: () => {},
});

/**
 * Access stop/start controls for the shared Lenis instance (nested-safe via a counter).
 * The Lenis instance itself is intentionally not exposed here — reading it would mean
 * accessing a ref during render; components that need to pause/resume scrolling never
 * need the instance directly.
 */
export function useLenis() {
  return useContext(SmoothScrollContext);
}
