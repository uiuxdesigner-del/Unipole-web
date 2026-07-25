import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { HeroVisual } from "@/components/three/HeroVisual";

/**
 * Hero section: static layout/copy plus the Three.js unipole scene as the atmospheric
 * background layer (`HeroVisual` handles the dynamic import, ssr:false and reduced-motion
 * fallback).
 */
export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-brand-dark text-brand-white"
    >
      <HeroVisual />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 pb-20 pt-40 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-brand-white/60">
          ADINN Advertising Services
        </p>

        <h1
          className="max-w-5xl font-semibold uppercase leading-[0.95] tracking-tight"
          style={{ fontSize: "var(--text-hero)" }}
        >
          Is Your Brand
          <br />
          Being Seen?
        </h1>

        <p className="text-2xl font-medium text-brand-red sm:text-3xl">Rise Above the Noise.</p>

        <p className="max-w-xl text-base text-brand-white/70 sm:text-lg">
          Place your brand above the city with premium unipole advertising across
          high-impact roads, junctions, highways and commercial destinations.
        </p>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
          <Link
            href="#inventory"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
          >
            Explore Unipoles
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-brand-white/30 px-6 py-3 text-sm font-semibold transition-colors hover:border-brand-white"
          >
            Plan Your Campaign
          </Link>
          <Link
            href="#enquiry"
            className="inline-flex min-h-[44px] items-center justify-center px-2 text-sm font-semibold text-brand-white/80 underline-offset-4 transition-colors hover:text-brand-white hover:underline"
          >
            Talk to Our Team
          </Link>
        </div>
      </div>

      <div className="relative flex justify-center pb-8">
        <ArrowDown
          aria-hidden
          size={20}
          className="animate-bounce text-brand-white/50 motion-reduce:animate-none"
        />
        <span className="sr-only">Scroll to explore</span>
      </div>
    </section>
  );
}
