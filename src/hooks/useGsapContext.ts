"use client";

import { useEffect, useRef, type DependencyList, type RefObject } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

/**
 * Scopes a GSAP timeline/ScrollTrigger set to a container ref via `gsap.context()` and
 * reverts (kills tweens + ScrollTriggers) automatically on unmount or dependency change.
 * Every section that animates with GSAP should use this instead of calling
 * `gsap.timeline()` directly, to avoid leaked ScrollTriggers.
 *
 * `callback` receives the resolved scope element (rather than consumers closing over their
 * own returned ref) so it never reads a binding before it's declared.
 */
export function useGsapContext<T extends HTMLElement>(
  callback: (scope: T) => void | (() => void),
  deps: DependencyList = []
): RefObject<T | null> {
  const scopeRef = useRef<T | null>(null);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      if (scopeRef.current) return callback(scopeRef.current);
    }, scopeRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
