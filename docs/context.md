# Project Context (latest)

## Status
Phase 1 and Phase 2 — Core Storytelling both COMPLETE. Lint and build both pass.

## Milestone
Phase 2 done: motion primitives, What Is a Unipole, Why Choose Unipole, Key Locations, and
the Three.js hero scene are all shipped. Next milestone is Phase 3 — Inventory and Product
Popup.

## Completed this session (2026-07-25, part 2)
- Built `WhyChooseUnipoleSection.tsx`: desktop is a GSAP `ScrollTrigger.matchMedia`
  (`min-width: 1024px`) pinned benefit switcher — one crossfaded panel at a time (discrete
  step tween, not continuous scrub), 0N/06 counter, dot progress, `ScrollProgress` bar.
  Mobile/tablet is a plain `FadeBlurReveal`-stacked list, no pinning, matched via CSS
  breakpoint (not JS media check) so the pinned DOM simply isn't in that layout.
- Built `KeyLocationsSection.tsx`: `locationCategories` (new in `site-content.ts`) listed via
  `FadeBlurReveal`, city filter chips (`siteConfig.cities` + "Other Tamil Nadu Locations")
  that highlight a marker on a decorative SVG map, route-line draw-in scrubbed via GSAP
  (`pathLength`/`strokeDashoffset`), marker pulse via Tailwind `animate-ping` +
  `motion-reduce:animate-none`. Marker coordinates are illustrative, not real geodata; no
  inventory counts are shown here (that stays in Phase 3's Inventory grid).
- Built the Three.js hero scene: `src/components/three/UnipoleScene.tsx` (R3F `Canvas`,
  simplified pole + display frame + fog/lighting, slow sinusoidal camera drift, clamped
  mouse-follow offset, `simplified` prop drops the ground plane/antialiasing/geometry detail)
  and `HeroVisual.tsx` (client boundary: `next/dynamic(..., { ssr: false })`, renders the
  existing gradient instead of mounting WebGL when `useReducedMotion()` is true). Added
  `useIsMobileViewport` hook (mirrors `useReducedMotion`'s `useSyncExternalStore` pattern) so
  the mobile-complexity check doesn't need an effect+setState mount flag. Wired into
  `HeroSection.tsx` in place of the old inline gradient div.
- Two TypeScript build errors surfaced only at `next build` (not caught by `next lint` or the
  editor): `TextReveal`'s polymorphic `as={ElementType}` + `ref` combo collapsed JSX
  `children` to `never`; fixed by narrowing `as` to a concrete tag union and attaching the
  scope ref via a callback ref instead of passing the `RefObject` directly (see
  docs/architecture.md decisions log).
- Validation: `npm run lint` clean, `npm run build` succeeds (static prerender of `/`), dev
  server smoke-tested — all four section ids (`home`, `what-is-unipole`, `why-unipole`,
  `key-locations`) present in the served HTML, no server/console errors in the dev log.
  Full visual breakpoint audit (360/390/768/1024/1280/1440) is still Phase 6 work; no browser
  automation tool was available in this environment to screenshot it now.

## Completed earlier this session (2026-07-25, part 1)
- Built `src/components/motion/{TextReveal,FadeBlurReveal,ParallaxMedia,ScrollProgress}.tsx`
  (GSAP + ScrollTrigger, `useReducedMotion`-gated, scoped via `useGsapContext`).
- Fixed a `react-hooks/immutability` lint error surfaced by this: `useGsapContext`'s callback
  now receives the resolved scope element as a parameter instead of consumers closing over
  their own not-yet-declared ref (see docs/architecture.md decisions log).
- Built `src/components/sections/WhatIsUnipoleSection.tsx` (sticky intro pane + progress bar
  + gradient-placeholder `ParallaxMedia` visual on desktop, stacked `FadeBlurReveal` feature
  cards from `unipoleFeatures` data) and wired it into `src/app/page.tsx` after `HeroSection`.

## Completed previous session (2026-07-24)
- Confirmed no existing project (working directory was OS user profile root); created new
  project at `C:\Users\Admin\adinn-unipole` with user's approval.
- Scaffolded Next.js 16 (App Router, TS, Tailwind v4, ESLint flat config, src dir, @/* alias).
- Installed gsap, lenis, three, @react-three/fiber, @react-three/drei, framer-motion,
  lucide-react, clsx.
- Read Next.js 16 upgrade/rendering docs from node_modules (ahead of training data) — notes
  captured in CLAUDE.md and docs/architecture.md.
- Created CLAUDE.md, docs/business-rules.md, docs/architecture.md, docs/todo.md,
  .claude/commands/hi.md, .claude/commands/bye.md.
- Design tokens + Outfit font: `src/app/globals.css` (@theme, brand colors, clamp() type
  scale, reduced-motion global override), `src/app/layout.tsx` (Outfit via next/font/google).
- Types: `src/types/unipole.ts`, `src/types/campaign.ts`.
- Data: `src/data/unipoles.ts` (6 placeholder sites), `campaigns.ts`, `faq.ts`,
  `site-content.ts`; `src/config/site.ts` (central contact/nav config).
- Motion foundation: `src/hooks/useReducedMotion.ts` (useSyncExternalStore),
  `src/hooks/useLenis.ts` (context: stop/start only), `src/hooks/useGsapContext.ts`,
  `src/lib/gsap.ts`, `src/lib/motion-config.ts`,
  `src/components/motion/SmoothScrollProvider.tsx` (wraps app in layout.tsx).
- `src/components/layout/Header.tsx` (sticky, transparent-over-hero, active-section
  indicator, desktop nav) + `MobileNavigation.tsx` (Framer Motion full-screen menu, Lenis +
  body scroll lock, Escape to close).
- `src/components/sections/HeroSection.tsx` (static foundation layout/copy; word reveal,
  atmosphere motion and the Three.js scene are Phase 2 work) wired into `src/app/page.tsx`.

## Pending (next session should continue here)
Phase 3 — Inventory and Product Popup (see docs/todo.md): inventory filters + cards + empty
state, `UnipoleDetailModal`, `?site=` query sync with Back-closes-modal, CampaignPlanProvider
+ drawer + toast.

## Architecture/decisions
See docs/architecture.md, including the react-hooks lint-driven decision to keep the Lenis
instance ref-only (not in context state) and use `useSyncExternalStore` for reduced-motion.

## Known issues / risks
- No real ADINN photography supplied yet — inventory/campaign/installation images use
  clearly labelled placeholders (`isPlaceholderData: true` on inventory records) until real
  assets are provided. `public/images/` subfolders referenced by data files do not contain
  files yet.
- Next.js 16 API surface differs from typical training data; verify against
  `node_modules/next/dist/docs/` before using any App Router API not already confirmed.
- `eslint-plugin-react-hooks` in this repo enforces "no setState in effect body" and "no
  ref read during render" — keep this in mind when adding new hooks/providers in later
  phases (filters state, campaign plan provider, modal open state, etc.).

## Files touched
See docs/progress.md 2026-07-24 and 2026-07-25 entries for the full list.

## Next task
Phase 3: inventory filters + cards + empty state, reading from `src/data/unipoles.ts` /
`src/types/unipole.ts`. Filters must be client-side only and browser-guarded (see the
`react-hooks/set-state-in-effect` and ref-read-during-render notes below before adding filter
state).
