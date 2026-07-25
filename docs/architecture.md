# Architecture

## Stack
Next.js 16 (App Router, Turbopack default), TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger,
Lenis, Three.js via @react-three/fiber + drei, Framer Motion, lucide-react, clsx.
Font: Outfit via `next/font/google`.

Next.js 16 notes (this repo is ahead of common training data — full docs in
`node_modules/next/dist/docs/`):
- Turbopack is default for `dev`/`build`; no flag needed.
- `next lint` removed; `npm run lint` runs `eslint` directly (flat config, `eslint.config.mjs`).
- Server Component `params`/`searchParams` are async — not used here; modal sync uses the
  client `useSearchParams` hook instead, which is unaffected.
- `cacheComponents`/PPR left disabled — not needed for a static marketing page.

## Directory layout
```
src/
├── app/                    layout.tsx, page.tsx, globals.css only
├── components/
│   ├── layout/              Header, MobileNavigation, Footer
│   ├── sections/             one component per homepage section
│   ├── inventory/             filters, card, detail modal, gallery, spec grid, availability
│   ├── campaign-plan/        provider, drawer, toast
│   ├── motion/                 reusable GSAP/Lenis/reveal utilities (components)
│   ├── three/                 UnipoleScene + fallback (dynamically imported, ssr:false)
│   └── ui/                    small shared primitives (buttons, badges, etc.)
├── config/site.ts           central editable company/contact data
├── data/                    unipoles.ts, campaigns.ts, faq.ts, site-content.ts
├── hooks/                   useLenis, useGsapContext, useReducedMotion
├── lib/                     gsap.ts (registration), animations.ts, motion-config.ts
└── types/                   unipole.ts, campaign.ts
```

## Motion architecture
- `SmoothScrollProvider` (Client Component, wraps app) owns the Lenis instance, ties it to
  GSAP's ticker, and exposes stop/start via context so modal/mobile-nav can pause it.
- `useGsapContext` wraps `gsap.context()` for scoped, auto-cleaned-up animations per
  component; every section using GSAP must clean up its ScrollTriggers on unmount.
- `useReducedMotion` reads `prefers-reduced-motion` and is checked by every motion utility
  to fall back to simple opacity fades / no pinning.
- Reusable primitives (`TextReveal`, `FadeBlurReveal`, `ParallaxMedia`, `ScrollProgress`)
  live in `components/motion/` — section components compose these, never call
  `gsap.timeline()` ad hoc with duplicated easing/stagger constants (those live in
  `lib/motion-config.ts`).

## State/data flow
- Inventory + campaigns + FAQ + site copy are static typed arrays in `src/data/`, imported
  by Server Components where possible; only components needing interactivity (filters,
  modal, card hover) are Client Components.
- Selected inventory id lives in the URL (`?site=`) via `useSearchParams`/`router.push`,
  read by a client wrapper that renders `UnipoleDetailModal`.
- Campaign plan state lives in `CampaignPlanProvider` (React context + localStorage,
  browser-guarded), consumed by inventory cards, the modal, and the drawer/toast.

## Decisions log
- 2026-07-25: Polymorphic components that take an `as` tag prop and forward a GSAP scope ref
  (e.g. `TextReveal`) must type `as` as a concrete tag union (`"h2" | "p" | ...`), not
  `ElementType` — the generic form collapses JSX `children` to `never` at `next build`'s
  type-check step (not caught by `next lint` or the editor). The ref must then be attached via
  a callback (`ref={(node) => { scopeRef.current = node as HTMLElement | null; }}`), not the
  `RefObject` directly, since each concrete tag has an incompatible specific `HTMLElement`
  subtype for its own `ref`.
- 2026-07-25: `ScrollTrigger.matchMedia()` nested inside a `useGsapContext` callback is the
  chosen pattern for "pin on desktop, plain stack on mobile" sections (`WhyChooseUnipoleSection`).
  GSAP tracks matchMedia-created tweens/triggers for cleanup as long as `matchMedia()` is
  called synchronously within the `gsap.context()` callback tree.
- 2026-07-25: `useGsapContext`'s callback now receives the resolved scope element as its
  argument (`(scope: T) => ...`) instead of consumers reading `scopeRef.current` off the
  hook's own returned ref inside that same callback. The latter tripped
  `eslint-plugin-react-hooks`'s `react-hooks/immutability` rule (binding read before its
  `const` declaration completes, even though the read only happens later inside an effect).
  Passing the element in avoids the self-referential closure entirely.
- 2026-07-24: Project created fresh at `C:\Users\Admin\adinn-unipole` (previous working
  directory was the OS user profile root, not a project folder).
- 2026-07-24: `SmoothScrollProvider`'s context exposes only `stop`/`start`, not the raw
  Lenis instance. The repo's `eslint-plugin-react-hooks` (Next 16 canary/React 19.2) flags
  both "setState in effect body" and "ref read during render" — storing the instance in
  ref-only and closing over it inside `stop`/`start` (invoked from event handlers, never
  render) satisfies both rules. `useReducedMotion` uses `useSyncExternalStore` instead of
  effect+setState for the same reason.
