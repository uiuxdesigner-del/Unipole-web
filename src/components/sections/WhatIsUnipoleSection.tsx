"use client";

import { useRef } from "react";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeBlurReveal } from "@/components/motion/FadeBlurReveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { motionConfig } from "@/lib/motion-config";
import { unipoleFeatures } from "@/data/site-content";

/**
 * Sticky intro pane (desktop) + stacked feature reveal. The visual pane is a gradient
 * placeholder — swapped for real unipole photography once supplied (see docs/context.md).
 */
export function WhatIsUnipoleSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="what-is-unipole"
      ref={sectionRef}
      className="relative bg-brand-soft py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <TextReveal
              as="h2"
              text="What Is a Unipole?"
              className="font-semibold uppercase leading-[0.98] tracking-tight text-brand-black"
              start="top 90%"
            />
            <TextReveal
              as="p"
              text="A unipole is a large-format outdoor structure mounted on a single engineered pole, elevated above rooftops and street clutter so a brand is visible from far down the road — day and night."
              className="mt-6 max-w-lg text-base text-brand-muted sm:text-lg"
              start="top 90%"
            />

            <ScrollProgress targetRef={sectionRef} className="mt-10 max-w-xs" />

            <ParallaxMedia
              className="mt-10 aspect-[4/5] w-full rounded-3xl"
              speed={motionConfig.parallax.background}
            >
              <div className="h-full w-full bg-gradient-to-br from-brand-dark via-brand-black to-brand-red/30" />
            </ParallaxMedia>
          </div>

          <div className="flex flex-col gap-6">
            {unipoleFeatures.map((feature, index) => (
              <FadeBlurReveal
                key={feature.title}
                delay={(index % 3) * 0.06}
                className="rounded-2xl border border-brand-border bg-brand-white p-6 sm:p-8"
              >
                <span className="text-sm font-semibold text-brand-red">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3
                  className="mt-2 font-semibold text-brand-black"
                  style={{ fontSize: "var(--text-h3)" }}
                >
                  {feature.title}
                </h3>
                <p className="mt-2 text-brand-muted">{feature.description}</p>
              </FadeBlurReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
