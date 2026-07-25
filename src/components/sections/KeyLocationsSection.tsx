"use client";

import { useState } from "react";
import clsx from "clsx";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeBlurReveal } from "@/components/motion/FadeBlurReveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap";
import { motionConfig } from "@/lib/motion-config";
import { locationCategories } from "@/data/site-content";
import { siteConfig } from "@/config/site";

const OTHER_LOCATIONS_LABEL = "Other Tamil Nadu Locations";
const cityFilters = [...siteConfig.cities, OTHER_LOCATIONS_LABEL];

/** Illustrative marker positions on the abstract map — not real coordinates or inventory. */
const markers: { city: string; x: number; y: number }[] = [
  { city: "Chennai", x: 340, y: 90 },
  { city: "Madurai", x: 220, y: 235 },
  { city: "Coimbatore", x: 90, y: 190 },
  { city: "Trichy", x: 210, y: 170 },
  { city: "Salem", x: 150, y: 115 },
  { city: "Bengaluru", x: 60, y: 55 },
  { city: "Kerala", x: 45, y: 250 },
  { city: OTHER_LOCATIONS_LABEL, x: 270, y: 130 },
];

const routes = [
  "M40,225 Q120,130 210,160 T360,90",
  "M60,55 Q150,150 220,200 T340,235",
];

function LocationMarker({ x, y, active }: { x: number; y: number; active: boolean }) {
  return (
    <g>
      {active && (
        <circle
          cx={x}
          cy={y}
          r={10}
          className="fill-brand-red/30 motion-safe:animate-ping motion-reduce:animate-none"
        />
      )}
      <circle cx={x} cy={y} r={active ? 6 : 3.5} className={active ? "fill-brand-red" : "fill-brand-white/40"} />
    </g>
  );
}

function MapVisual({ activeCity }: { activeCity: string }) {
  const reducedMotion = useReducedMotion();

  const scopeRef = useGsapContext<HTMLDivElement>((scope) => {
    const paths = scope.querySelectorAll<SVGPathElement>("[data-route-path]");
    if (paths.length === 0) return;
    if (reducedMotion) {
      gsap.set(paths, { strokeDashoffset: 0 });
      return;
    }
    gsap.set(paths, { strokeDashoffset: 1 });
    gsap.to(paths, {
      strokeDashoffset: 0,
      ease: motionConfig.ease.inOut,
      stagger: motionConfig.stagger.loose,
      scrollTrigger: { trigger: scope, start: "top 75%", end: "top 30%", scrub: true },
    });
  }, [reducedMotion]);

  return (
    <div ref={scopeRef} className="flex h-full w-full items-center justify-center p-8">
      <svg
        viewBox="0 0 400 300"
        className="h-full w-full"
        role="img"
        aria-label="Illustrative map of unipole placement zones across Tamil Nadu and Bengaluru"
      >
        <g className="stroke-brand-white/10" strokeWidth={1}>
          {[60, 140, 220, 300].map((x) => (
            <line key={x} x1={x} y1={0} x2={x} y2={300} />
          ))}
          {[60, 130, 200, 270].map((y) => (
            <line key={y} x1={0} y1={y} x2={400} y2={y} />
          ))}
        </g>
        <g fill="none" stroke="var(--color-red)" strokeOpacity={0.55} strokeWidth={1.5}>
          {routes.map((d) => (
            <path key={d} data-route-path pathLength={1} strokeDasharray={1} d={d} />
          ))}
        </g>
        {markers.map((marker) => (
          <LocationMarker key={marker.city} x={marker.x} y={marker.y} active={marker.city === activeCity} />
        ))}
      </svg>
    </div>
  );
}

/**
 * Location-type overview + city filter chips + a decorative map. Filters drive which map
 * marker is highlighted only — this section previews coverage, it does not claim live
 * inventory counts (that belongs to Phase 3's Inventory grid).
 */
export function KeyLocationsSection() {
  const [activeCity, setActiveCity] = useState<string>(cityFilters[0]);

  return (
    <section id="key-locations" className="relative bg-brand-white py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <TextReveal
            as="h2"
            text="Key Locations"
            className="font-semibold uppercase leading-[0.98] tracking-tight text-brand-black"
            style={{ fontSize: "var(--text-h2)" }}
            start="top 90%"
          />
          <TextReveal
            as="p"
            text="Unipole placements across Tamil Nadu and beyond, spanning the road types and traffic zones that keep a brand consistently visible."
            className="mt-6 text-base text-brand-secondary sm:text-lg"
            start="top 90%"
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label="Filter map by city">
          {cityFilters.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setActiveCity(city)}
              aria-pressed={activeCity === city}
              className={clsx(
                "min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                activeCity === city
                  ? "border-brand-red bg-brand-red text-brand-white"
                  : "border-brand-border text-brand-black hover:border-brand-red/50"
              )}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <ParallaxMedia
            className="aspect-4/3 w-full rounded-3xl bg-brand-dark"
            speed={motionConfig.parallax.background}
          >
            <MapVisual activeCity={activeCity} />
          </ParallaxMedia>

          <div className="flex flex-col gap-5">
            {locationCategories.map((category, index) => (
              <FadeBlurReveal
                key={category.title}
                delay={(index % 3) * 0.05}
                className="flex items-start gap-4 border-b border-brand-border pb-5 last:border-0"
              >
                <span className="text-sm font-semibold text-brand-red">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold text-brand-black">{category.title}</h3>
                  <p className="mt-1 text-sm text-brand-muted">{category.description}</p>
                </div>
              </FadeBlurReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
