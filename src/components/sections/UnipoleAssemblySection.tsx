"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { TextReveal } from "@/components/motion/TextReveal";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";
import { useInView } from "@/hooks/useInView";
import { ScrollTrigger } from "@/lib/gsap";
import { ASSEMBLY_STAGES } from "@/components/three/UnipoleModel";

const AssemblyScene = dynamic(() => import("@/components/three/AssemblyScene"), {
  ssr: false,
  loading: () => <CanvasFallback />,
});

function CanvasFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-gradient-to-b from-brand-soft to-brand-warm"
    />
  );
}

/**
 * Reversible, scroll-driven unipole assembly. The 3D model's transform is a pure function
 * of `progressRef.current` (see UnipoleModel), so scrolling up reverses it exactly — there is
 * no one-shot timeline to "undo". Desktop/tablet pin the stage via
 * `ScrollTrigger.matchMedia`; mobile ties progress to the section's natural scroll bounds
 * instead of pinning. Reduced motion shows the fully assembled model, static, with the final
 * stage text shown immediately (no scroll-gated reveal).
 */
export function UnipoleAssemblySection() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobileViewport();
  const progressRef = useRef(reducedMotion ? 1 : 0);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(canvasWrapperRef);
  const refreshedRef = useRef(false);

  useEffect(() => {
    if (inView && !refreshedRef.current) {
      refreshedRef.current = true;
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [inView]);

  const scopeRef = useGsapContext<HTMLElement>((scope) => {
    const numberEl = scope.querySelector<HTMLElement>("[data-stage-number]");
    const titleEl = scope.querySelector<HTMLElement>("[data-stage-title]");
    const descriptionEl = scope.querySelector<HTMLElement>("[data-stage-description]");
    const lineEl = scope.querySelector<HTMLElement>("[data-stage-line]");
    const stage = scope.querySelector<HTMLElement>("[data-assembly-stage]");

    const setStageText = (index: number) => {
      const active = ASSEMBLY_STAGES[index];
      if (numberEl) numberEl.textContent = String(index + 1).padStart(2, "0");
      if (titleEl) titleEl.textContent = active.title;
      if (descriptionEl) descriptionEl.textContent = active.description;
    };

    if (reducedMotion || !stage) {
      setStageText(ASSEMBLY_STAGES.length - 1);
      if (lineEl) lineEl.style.transform = "scaleX(1)";
      return;
    }

    let activeIndex = -1;
    const onProgress = (progress: number) => {
      progressRef.current = progress;
      if (lineEl) lineEl.style.transform = `scaleX(${progress})`;
      let index = 0;
      for (let i = ASSEMBLY_STAGES.length - 1; i >= 0; i -= 1) {
        if (progress >= ASSEMBLY_STAGES[i].at) {
          index = i;
          break;
        }
      }
      if (index !== activeIndex) {
        activeIndex = index;
        setStageText(index);
      }
    };
    setStageText(0);

    ScrollTrigger.matchMedia({
      "(min-width: 1024px)": () => {
        const trigger = ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: "+=2600",
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => onProgress(self.progress),
        });
        return () => trigger.kill();
      },
      "(min-width: 768px) and (max-width: 1023px)": () => {
        const trigger = ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: "+=1600",
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => onProgress(self.progress),
        });
        return () => trigger.kill();
      },
      "(max-width: 767px)": () => {
        const trigger = ScrollTrigger.create({
          trigger: stage,
          start: "top 85%",
          end: "bottom 40%",
          scrub: 0.5,
          onUpdate: (self) => onProgress(self.progress),
        });
        return () => trigger.kill();
      },
    });
  }, [reducedMotion]);

  const intensity = reducedMotion ? 0 : isMobile ? 0.4 : 1;

  return (
    <section
      id="unipole-assembly"
      ref={scopeRef}
      className="relative bg-brand-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <TextReveal
            as="h2"
            text="Engineered to Rise Above."
            className="font-semibold leading-[1.02] tracking-tight text-brand-black"
            style={{ fontSize: "var(--text-h2)" }}
            start="top 90%"
          />
          <TextReveal
            as="p"
            text="Every component comes together to create one high-impact brand presence."
            className="mt-6 max-w-lg text-base text-brand-secondary sm:text-lg"
            start="top 90%"
          />
        </div>
      </div>

      <div
        data-assembly-stage
        className="relative mt-12 lg:mt-16 lg:flex lg:min-h-screen lg:items-center"
      >
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-5 sm:px-8 lg:grid-cols-[280px_1fr] lg:items-center lg:gap-16 lg:px-12">
          <div className="order-2 lg:order-1">
            <div className="flex items-baseline gap-2">
              <span data-stage-number className="text-sm font-semibold text-brand-red">
                01
              </span>
              <span className="text-sm text-brand-muted">/ {String(ASSEMBLY_STAGES.length).padStart(2, "0")}</span>
            </div>
            <h3 data-stage-title className="mt-3 text-2xl font-semibold text-brand-black">
              {ASSEMBLY_STAGES[0].title}
            </h3>
            <p data-stage-description className="mt-2 max-w-xs text-sm text-brand-secondary">
              {ASSEMBLY_STAGES[0].description}
            </p>
            <div className="mt-6 h-px w-full max-w-[200px] bg-brand-border">
              <div
                data-stage-line
                className="h-px w-full origin-left scale-x-0 bg-brand-red"
              />
            </div>
          </div>

          <div
            ref={canvasWrapperRef}
            className="relative order-1 aspect-square w-full overflow-hidden rounded-3xl bg-brand-soft lg:order-2 lg:aspect-auto lg:h-[65vh]"
          >
            <AssemblyScene
              progressRef={progressRef}
              intensity={intensity}
              simplified={isMobile}
              frameloop={reducedMotion ? "demand" : inView ? "always" : "never"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
