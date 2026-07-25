"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";

const UnipoleScene = dynamic(() => import("@/components/three/UnipoleScene"), {
  ssr: false,
  loading: () => <StaticFallback />,
});

/** Same gradient used as the pre-hydration/loading state and the `prefers-reduced-motion` fallback. */
function StaticFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(55% 45% at 50% 32%, rgba(215,25,32,0.06), transparent 70%), radial-gradient(90% 60% at 50% 100%, rgba(17,17,17,0.05), transparent 70%)",
      }}
    />
  );
}

/**
 * Client-only boundary for the Three.js hero scene (dynamic import, ssr:false — `next/dynamic`
 * itself handles rendering nothing/the `loading` fallback until the client mounts). Renders
 * the static gradient instead of WebGL when `prefers-reduced-motion` is set, and passes a
 * coarse mobile check down so the scene can drop geometry/ground/antialiasing on phones.
 */
export function HeroVisual() {
  const reducedMotion = useReducedMotion();
  const simplified = useIsMobileViewport();

  return (
    <div aria-hidden className="hero-visual pointer-events-none absolute inset-0">
      {reducedMotion ? <StaticFallback /> : <UnipoleScene simplified={simplified} />}
    </div>
  );
}
