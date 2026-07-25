# Progress Log

## 2026-07-25 (part 2)
- Built `WhyChooseUnipoleSection`: desktop uses `ScrollTrigger.matchMedia("(min-width: 1024px)")`
  inside the section's `useGsapContext` scope to pin the benefit stage and crossfade one
  `whyUnipoleBenefits` panel at a time via discrete step tweens (snap + scrub, not continuous
  blend) as the user scrolls, updating a 0N/06 text counter and dot progress row directly via
  DOM refs (no React state, to avoid re-renders fighting the GSAP-driven values). Mobile/tablet
  renders a separate `hidden lg:flex` / `lg:hidden` pair of DOM trees — the mobile one is a
  plain `FadeBlurReveal` stack, so there is no pinned/hidden content to fight with on small
  screens.
- Built `KeyLocationsSection`: added `locationCategories` to `site-content.ts` (Main Roads,
  Highways, City Junctions, Commercial Centres, City Entry Points, High-Traffic Areas). City
  filter chips come from `siteConfig.cities` plus a synthetic "Other Tamil Nadu Locations"
  option (kept local to the component, not written back into `site.ts`, since it's a UI-only
  addition). The map is a hand-built SVG (grid lines + two route paths + 8 markers at
  illustrative, non-geographic coordinates) — route paths use the `pathLength`/`strokeDasharray`
  trick so GSAP can scrub `strokeDashoffset` for a "draw-in" reveal; markers pulse via
  Tailwind's `animate-ping` (already neutralized under reduced motion by the global CSS
  override in `globals.css`, plus an explicit `motion-reduce:animate-none` for belt-and-braces).
- Built the Three.js hero scene. `src/components/three/UnipoleScene.tsx` is the actual R3F
  `Canvas` (single pole + display frame meshes, fog, ambient + directional light, a
  `CameraRig` doing slow sinusoidal drift with a clamped pointer-follow offset, `simplified`
  prop trims cylinder segments/drops the ground plane/disables antialiasing for phones).
  `src/components/three/HeroVisual.tsx` is the Client Component boundary: `next/dynamic` with
  `ssr:false` and a `loading` fallback equal to the old static gradient, plus a `reducedMotion`
  check that skips mounting the Canvas entirely (renders the gradient instead) rather than
  mounting a WebGL context just to hold it static. Added `src/hooks/useIsMobileViewport.ts`
  (same `useSyncExternalStore` shape as `useReducedMotion`) for the mobile check, specifically
  to avoid an effect+setState "mounted" flag that would have tripped
  `react-hooks/set-state-in-effect` (same rule family noted in the 2026-07-24 entry).
- Two errors only surfaced at `next build`'s type-check step (not `next lint`, not the editor):
  1. `TextReveal`'s `as?: ElementType` prop combined with attaching `scopeRef` via `ref=`
     collapsed the JSX `children` type to `never` — TypeScript's polymorphic-component +
     `ref` + generic `ElementType` combination is known to be fragile this way. Fixed by
     narrowing `as` to a concrete union (`"h1" | "h2" | "h3" | "h4" | "p" | "span" | "div"`).
  2. Narrowing the union then broke `ref` assignability (each tag's ref type is a different
     specific `HTMLElement` subtype, incompatible with the single `RefObject<HTMLElement | null>`
     from `useGsapContext`). Fixed by attaching the ref via a callback (`ref={(node) => {
     scopeRef.current = node as HTMLElement | null; }}`) instead of the `RefObject` directly.
- Validation: `npm run lint` clean, `npm run build` succeeds (static prerender of `/`). Dev
  server smoke test: started `next dev`, curled `/`, confirmed HTTP 200 and all four section
  ids (`home`, `what-is-unipole`, `why-unipole`, `key-locations`) present in the HTML, no
  errors in the dev server log. No headless-browser tool (chromium-cli/Playwright) was
  available in this environment to capture actual breakpoint screenshots — the dedicated
  360/390/768/1024/1280/1440 responsive audit remains a Phase 6 task.
- Phase 2 complete. Next: Phase 3 — Inventory and Product Popup.

## 2026-07-25 (part 1)
- Built the four reusable motion primitives in `src/components/motion/`: `TextReveal`
  (word-by-word masked reveal), `FadeBlurReveal` (fade + blur-to-clear + rise), `ParallaxMedia`
  (vertical scroll parallax wrapper for any media child), `ScrollProgress` (scrub-driven fill
  bar tracking a target section). All GSAP/ScrollTrigger-based, scoped via `useGsapContext`,
  and gated by `useReducedMotion` (static/no-op fallback).
- Hit a `react-hooks/immutability` lint error: components that closed over their own
  `useGsapContext`-returned ref inside that same hook's callback were flagged as reading a
  binding before declaration. Fixed by changing `useGsapContext`'s callback signature to
  receive the resolved scope element as an argument, rather than consumers reading
  `scopeRef.current` from the outer closure. Updated all four motion components accordingly.
- Built `WhatIsUnipoleSection` (`src/components/sections/WhatIsUnipoleSection.tsx`): sticky
  intro pane on desktop (heading + intro via `TextReveal`, `ScrollProgress`, a gradient-
  placeholder `ParallaxMedia` visual pending real photography) beside a stacked list of
  `unipoleFeatures` cards revealed with `FadeBlurReveal`. Wired into `page.tsx` after Hero.
- Validation: `npm run lint` clean, `npm run build` succeeds (static prerender of `/`).
- Phase 2 in progress. Pending: Why Choose Unipole (benefit switcher), Key Locations,
  Three.js hero scene.

## 2026-07-24
- Audited workspace (was OS user home directory, no project). User chose
  `C:\Users\Admin\adinn-unipole` as project location.
- Scaffolded Next.js 16 App Router project (TS, Tailwind v4, ESLint, src dir, @/* alias).
- Installed gsap, lenis, three, @react-three/fiber, @react-three/drei, framer-motion,
  lucide-react, clsx.
- Read Next.js 16 rendering-philosophy, version-16 upgrade guide, and fonts guide from
  local node_modules docs (this Next version postdates training data).
- Created CLAUDE.md project rules, docs/business-rules.md, docs/architecture.md,
  docs/todo.md, docs/context.md.
- Built design tokens + Outfit font (globals.css @theme, layout.tsx).
- Built types (unipole.ts, campaign.ts), data (unipoles.ts x6 placeholder sites,
  campaigns.ts, faq.ts, site-content.ts) and config/site.ts.
- Built motion foundation: useReducedMotion (useSyncExternalStore), useLenis (context),
  useGsapContext, lib/gsap.ts, lib/motion-config.ts, SmoothScrollProvider.
- Built Header + MobileNavigation (sticky/transparent, active-section indicator, Framer
  Motion mobile drawer with scroll lock).
- Built HeroSection foundation (static layout/copy) and wired into page.tsx.
- Fixed 4 eslint-plugin-react-hooks errors (set-state-in-effect, refs) by switching
  useReducedMotion to useSyncExternalStore and keeping the Lenis instance ref-only,
  exposing only stop/start through context.
- Validation: `npm run lint` clean, `npm run build` succeeds (static prerender of `/`),
  dev server smoke-tested — hero/header content renders, no console/hydration errors.
- Phase 1 complete. Pending: Phase 2 (What Is a Unipole, Why Choose Unipole, Key Locations,
  motion components, Three.js hero scene).
