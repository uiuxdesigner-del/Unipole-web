"use client";

import { useRef } from "react";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeBlurReveal } from "@/components/motion/FadeBlurReveal";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motionConfig } from "@/lib/motion-config";
import { whyUnipoleBenefits } from "@/data/site-content";

const TOTAL = whyUnipoleBenefits.length;
const STEP_DISTANCE = 550;

/**
 * Desktop: pinned scroll-driven benefit switcher — one large active title/description at a
 * time, crossfaded via a discrete step transition (not continuous scrub blur) as the pin
 * scrolls, with a 0N/06 counter and dot progress. Mobile: plain stacked reveal, no pinning.
 */
export function WhyChooseUnipoleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const scopeRef = useGsapContext<HTMLElement>((scope) => {
    if (reducedMotion) return;

    const panels = Array.from(scope.querySelectorAll<HTMLElement>("[data-benefit-panel]"));
    const dots = Array.from(scope.querySelectorAll<HTMLElement>("[data-benefit-dot]"));
    const counter = scope.querySelector<HTMLElement>("[data-benefit-counter]");
    const stage = scope.querySelector<HTMLElement>("[data-benefit-stage]");
    if (panels.length === 0 || !stage) return;

    gsap.set(panels, { autoAlpha: 0, y: 28 });
    gsap.set(panels[0], { autoAlpha: 1, y: 0 });

    ScrollTrigger.matchMedia({
      "(min-width: 1024px)": () => {
        let activeIndex = 0;

        const trigger = ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: `+=${(panels.length - 1) * STEP_DISTANCE}`,
          pin: true,
          scrub: 0.4,
          snap: panels.length > 1 ? 1 / (panels.length - 1) : undefined,
          onUpdate: (self) => {
            const index = Math.min(
              panels.length - 1,
              Math.round(self.progress * (panels.length - 1))
            );
            if (index === activeIndex) return;
            const prevIndex = activeIndex;
            activeIndex = index;

            gsap.to(panels[prevIndex], {
              autoAlpha: 0,
              y: -28,
              duration: motionConfig.duration.revealShort,
              ease: motionConfig.ease.out,
            });
            gsap.fromTo(
              panels[index],
              { autoAlpha: 0, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                duration: motionConfig.duration.revealShort,
                ease: motionConfig.ease.out,
              }
            );
            dots.forEach((dot, dotIndex) =>
              gsap.to(dot, { opacity: dotIndex === index ? 1 : 0.3, duration: 0.3 })
            );
            if (counter) counter.textContent = String(index + 1).padStart(2, "0");
          },
        });

        return () => trigger.kill();
      },
    });
  }, [reducedMotion]);

  return (
    <section
      id="why-unipole"
      ref={(node) => {
        sectionRef.current = node;
        scopeRef.current = node;
      }}
      className="relative bg-brand-soft py-24 text-brand-black sm:py-32 lg:py-0"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Desktop: pinned switcher */}
        <div data-benefit-stage className="hidden lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:gap-10">
          <div className="flex items-end justify-between gap-6">
            <TextReveal
              as="h2"
              text="Why Choose Unipole Advertising"
              className="max-w-2xl font-semibold uppercase leading-[0.98] tracking-tight text-brand-black"
              style={{ fontSize: "var(--text-h2)" }}
              start="top 90%"
            />
            <div className="whitespace-nowrap pb-1 text-sm font-medium tracking-widest text-brand-muted">
              <span data-benefit-counter>01</span>
              <span className="mx-1">/</span>
              <span>{String(TOTAL).padStart(2, "0")}</span>
            </div>
          </div>

          <ScrollProgress
            targetRef={sectionRef}
            className="max-w-xs bg-brand-border"
            barClassName="bg-brand-red"
          />

          <div className="relative mt-4 h-[280px]">
            {whyUnipoleBenefits.map((benefit) => (
              <div key={benefit.title} data-benefit-panel className="absolute inset-0 max-w-3xl">
                <h3
                  className="font-semibold leading-tight text-brand-black"
                  style={{ fontSize: "var(--text-display)" }}
                >
                  {benefit.title}
                </h3>
                <p className="mt-6 max-w-xl text-lg text-brand-secondary">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {whyUnipoleBenefits.map((benefit, index) => (
              <span
                key={benefit.title}
                data-benefit-dot
                className="h-1 flex-1 rounded-full bg-brand-red"
                style={{ opacity: index === 0 ? 1 : 0.3 }}
              />
            ))}
          </div>
        </div>

        {/* Mobile/tablet: stacked reveal, no pinning */}
        <div className="flex flex-col gap-6 py-4 lg:hidden">
          <TextReveal
            as="h2"
            text="Why Choose Unipole Advertising"
            className="font-semibold uppercase leading-[0.98] tracking-tight text-brand-black"
            style={{ fontSize: "var(--text-h2)" }}
            start="top 90%"
          />
          {whyUnipoleBenefits.map((benefit, index) => (
            <FadeBlurReveal
              key={benefit.title}
              delay={(index % 3) * 0.05}
              className="rounded-2xl border border-brand-border bg-brand-white p-6"
            >
              <span className="text-sm font-semibold text-brand-red">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-brand-black">{benefit.title}</h3>
              <p className="mt-2 text-brand-secondary">{benefit.description}</p>
            </FadeBlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
