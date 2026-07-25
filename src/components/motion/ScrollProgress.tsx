"use client";

import { type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollProgressProps {
  targetRef: RefObject<HTMLElement | null>;
  className?: string;
  barClassName?: string;
}

/** Thin fill bar tracking scroll progress through `targetRef` — for long/stepped sections. */
export function ScrollProgress({ targetRef, className, barClassName }: ScrollProgressProps) {
  const reducedMotion = useReducedMotion();

  const scopeRef = useGsapContext<HTMLDivElement>((scope) => {
    const bar = scope.querySelector<HTMLElement>("[data-progress-bar]");
    if (!bar || !targetRef.current) return;
    if (reducedMotion) {
      gsap.set(bar, { scaleX: 1 });
      return;
    }
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: targetRef.current, start: "top top", end: "bottom bottom", scrub: true },
    });
  }, [reducedMotion, targetRef]);

  return (
    <div ref={scopeRef} className={`h-1 w-full overflow-hidden rounded-full bg-brand-border ${className ?? ""}`}>
      <div data-progress-bar className={`h-full w-full origin-left bg-brand-red ${barClassName ?? ""}`} />
    </div>
  );
}
