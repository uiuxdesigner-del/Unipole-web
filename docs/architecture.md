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
│   ├── sections/             one component per homepage section (incl. UnipoleAssemblySection)
│   ├── inventory/             InventorySection/Filters/Card/EmptyState, UnipoleDetailModal +
│   │                            its panels (Gallery/SpecificationGrid/AudiencePanel/
│   │                            AvailabilityPanel/LocationPanel), UnipoleDetailModalController
│   ├── campaign-plan/        provider, drawer, toast (Phase 3B-2)
│   ├── motion/                 reusable GSAP/Lenis/reveal utilities (components)
│   ├── three/                 UnipoleModel (shared grouped mesh, progress-driven) +
│   │                            UnipoleScene (hero) + AssemblyScene, both dynamically
│   │                            imported (ssr:false) via their section's Client wrapper
│   └── ui/                    small shared primitives (buttons, badges, etc.)
├── config/site.ts           central editable company/contact data
├── data/                    unipoles.ts, campaigns.ts, faq.ts, site-content.ts
├── hooks/                   useLenis, useGsapContext, useReducedMotion, useIsMobileViewport,
│                              useInView, useFocusTrap, useUnipoleModal
├── lib/                     gsap.ts (registration), motion-config.ts, inventory.ts
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
- Selected inventory id lives in the URL (`?site=`), split across two hooks in
  `useUnipoleModal.ts`: `useOpenUnipoleModal()` (router.push only — no `useSearchParams`, so
  any card can call it without a Suspense boundary) and `useUnipoleModalState()` (reads
  `useSearchParams`, exposes `close()` — the component using this one must be wrapped in
  `<Suspense>` or the whole page opts out of static rendering). `UnipoleDetailModalController`
  is the sole consumer of the latter and is rendered inside `<Suspense fallback={null}>` in
  `page.tsx`.
- Campaign plan state will live in `CampaignPlanProvider` (React context + localStorage,
  browser-guarded), consumed by inventory cards, the modal, and the drawer/toast — Phase 3B-2.

## Decisions log
- 2026-07-25: URL-driven UI state read via `useSearchParams()` forces a component out of
  static rendering unless wrapped in `<Suspense>`. Since the "open" action (many inventory
  cards) never needs to *read* the current params — only `push` a new one — it's split into
  its own hook (`useOpenUnipoleModal`) that uses only `useRouter`/`usePathname`, so cards
  don't force a Suspense boundary. Only the single controller that *reads* `?site=` needs one.
- 2026-07-25: `UnipoleDetailModal`'s close behaviour: `open()` sets a module-level flag before
  `router.push`; `close()` calls `router.back()` if that flag is set (correct/expected for the
  normal open→close flow, and symmetric with "Browser Back closes the modal"), otherwise
  `router.replace()` to strip `?site=` without navigating away — handles a direct/refreshed
  `?site=` URL safely (no prior in-app history entry to go back to).
- 2026-07-25: `useFocusTrap` (Tab-cycle + initial focus) is a standalone reusable hook, not
  inlined in the modal — the Phase 3B-2 campaign drawer should reuse it rather than
  re-implementing focus trapping.
- 2026-07-25: A prior local commit only staged newly-created files, not edits to already-
  tracked files, leaving the working tree in a broken hybrid state (see docs/context.md
  "Repo-state note"). All missing edits were manually restored this session before Phase
  3B-1 began, and re-verified with lint/build. No git commands were run to fix this — the
  working tree was corrected directly; committing is left to the user.
- 2026-07-25: `UnipoleModel.tsx` is the single source of truth for the unipole mesh: 7 groups
  (foundation/pole/support/frame/panel/lighting/campaign surface), each with an assembled
  position and an "exploded" offset. A group's transform is `assembled + offset *
  (1 - smoothstep(localProgress))`, so the whole model is a pure function of one `progressRef`
  number (0–1, read via `useFrame`, never React state) — scrolling up reverses it exactly with
  no separate "reverse" code path. `UnipoleScene` (hero) renders it at a constant progress of
  1; `AssemblyScene` drives it from `UnipoleAssemblySection`'s `ScrollTrigger.onUpdate`.
- 2026-07-25: Data-driven, frequently-re-rendered lists (the inventory grid — re-filters on
  every keystroke) must not use `FadeBlurReveal`/GSAP `ScrollTrigger` per item. Re-creating a
  `ScrollTrigger` context every time the filtered set changes is wasteful and looks janky for
  content that's added/removed/reordered live. Reserve scroll-triggered reveal primitives for
  content that mounts once (a section's static header, a fixed list) — this applies to Phase
  4's Campaign Gallery too, which will face the same filterable-grid situation.
- 2026-07-25: `src/lib/inventory.ts` holds filter-option derivation, search-index
  normalization, the combined filter predicate, and now `findUnipoleById` — kept out of the
  section/modal components so they stay wiring-only. `STATUS_LABELS`/`STATUS_BADGE_CLASSES`/
  `ILLUMINATION_LABELS`/`DISPLAY_SIDES_LABELS` live there too, as the single source shared by
  the card badge, the filter `<select>` options, and the modal's specification grid.
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
