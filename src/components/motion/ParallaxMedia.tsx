"use client";

import { type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionConfig } from "@/lib/motion-config";

interface ParallaxMediaProps {
  children: ReactNode;
  className?: string;
  mediaClassName?: string;
  /** Relative scroll speed — see `motionConfig.parallax` (1 = no movement). */
  speed?: number;
}

/**
 * Wraps any media node (image, gradient placeholder, video) in a vertical scroll parallax.
 * The wrapper must stay `overflow-hidden` since the inner media is oversized to cover the
 * parallax travel range.
 */
export function ParallaxMedia({
  children,
  className,
  mediaClassName,
  speed = motionConfig.parallax.main,
}: ParallaxMediaProps) {
  const reducedMotion = useReducedMotion();
  const shift = (speed - 1) * 100;

  const scopeRef = useGsapContext<HTMLDivElement>((scope) => {
    if (reducedMotion || shift === 0) return;
    const media = scope.querySelector<HTMLElement>("[data-parallax-media]");
    if (!media) return;
    gsap.fromTo(
      media,
      { yPercent: -shift },
      {
        yPercent: shift,
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, [reducedMotion, shift]);

  return (
    <div ref={scopeRef} className={`relative overflow-hidden ${className ?? ""}`}>
      <div data-parallax-media className={`absolute inset-0 scale-110 ${mediaClassName ?? ""}`}>
        {children}
      </div>
    </div>
  );
}
