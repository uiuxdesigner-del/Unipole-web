"use client";

import { useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SmoothScrollContext, type SmoothScrollContextValue } from "@/hooks/useLenis";

/**
 * Owns the single Lenis instance for the page and ties its raf loop to GSAP's ticker so
 * ScrollTrigger stays in sync. Disabled (native scroll fallback) when the user prefers
 * reduced motion. Wrap the whole app once, at the layout level.
 *
 * The instance lives in a ref (never in state/render output) — stop/start close over the
 * ref and are only ever invoked from event handlers or effects, never read during render.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const stopCountRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();

    if (reducedMotion) {
      return;
    }

    const instance = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });
    lenisRef.current = instance;

    instance.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (typeof document === "undefined" || !("fonts" in document)) return;
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const value = useMemo<SmoothScrollContextValue>(
    () => ({
      stop: () => {
        stopCountRef.current += 1;
        lenisRef.current?.stop();
      },
      start: () => {
        stopCountRef.current = Math.max(0, stopCountRef.current - 1);
        if (stopCountRef.current === 0) {
          lenisRef.current?.start();
        }
      },
    }),
    []
  );

  return (
    <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
  );
}
