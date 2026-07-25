"use client";

import { useId, useMemo, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionConfig } from "@/lib/motion-config";

type TextRevealTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface TextRevealProps {
  text: string;
  as?: TextRevealTag;
  className?: string;
  style?: CSSProperties;
  start?: string;
}

/**
 * Word-by-word scroll reveal (masked translateY + fade). Falls back to static text when
 * `prefers-reduced-motion` is set.
 */
export function TextReveal({
  text,
  as: Tag = "p",
  className,
  style,
  start = "top 85%",
}: TextRevealProps) {
  const reducedMotion = useReducedMotion();
  const words = useMemo(() => text.split(" "), [text]);
  const uid = useId();

  const scopeRef = useGsapContext<HTMLElement>((scope) => {
    if (reducedMotion) return;
    const targets = scope.querySelectorAll<HTMLElement>("[data-reveal-word]");
    gsap.set(targets, { yPercent: 120, opacity: 0 });
    gsap.to(targets, {
      yPercent: 0,
      opacity: 1,
      duration: motionConfig.duration.reveal,
      ease: motionConfig.ease.out,
      stagger: motionConfig.stagger.tight,
      scrollTrigger: { trigger: scope, start },
    });
  }, [reducedMotion, text, start]);

  return (
    <Tag
      ref={(node) => {
        scopeRef.current = node as HTMLElement | null;
      }}
      className={className}
      style={style}
    >
      {words.map((word, index) => (
        <span key={`${uid}-${index}`} className="inline-block overflow-hidden align-top">
          <span data-reveal-word className="inline-block will-change-transform">
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
