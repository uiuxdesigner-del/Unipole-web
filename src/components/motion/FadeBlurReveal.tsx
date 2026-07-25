"use client";

import { type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionConfig } from "@/lib/motion-config";

interface FadeBlurRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  start?: string;
}

/**
 * Fade + blur-to-clear + rise reveal for a single block on scroll into view. Falls back to
 * a plain static block when `prefers-reduced-motion` is set.
 */
export function FadeBlurReveal({
  children,
  className,
  delay = 0,
  y = 32,
  start = "top 85%",
}: FadeBlurRevealProps) {
  const reducedMotion = useReducedMotion();

  const scopeRef = useGsapContext<HTMLDivElement>((scope) => {
    if (reducedMotion) return;
    gsap.set(scope, { opacity: 0, y, filter: "blur(12px)" });
    gsap.to(scope, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      delay,
      duration: motionConfig.duration.fade,
      ease: motionConfig.ease.out,
      scrollTrigger: { trigger: scope, start },
    });
  }, [reducedMotion, delay, y, start]);

  return (
    <div ref={scopeRef} className={className}>
      {children}
    </div>
  );
}
