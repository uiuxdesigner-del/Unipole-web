# Progress Log

## 2026-07-25 (part 5 — Phase 3B-1: Product-Detail Modal)
- Found the working tree had reverted to its post-Phase-2 state: a prior local commit only
  staged brand-new files, not the accompanying edits to already-tracked files (globals.css,
  CLAUDE.md, Header/Hero/UnipoleScene/TextReveal/section restyles, page.tsx wiring, docs).
  Restored every missing edit from known-good content before starting Phase 3B-1, then
  reverified with `npm run lint`/`npm run build` (both clean) before proceeding. See
  docs/context.md "Repo-state note" and docs/architecture.md decisions log.
- Built the URL-routing split in `src/hooks/useUnipoleModal.ts`: `useOpenUnipoleModal()`
  (push-only, no `useSearchParams`, safe for every card) and `useUnipoleModalState()` (reads
  `?site=`, exposes `close()` — back() if we pushed it, else replace() to strip the param
  safely for a direct/refreshed URL). `UnipoleDetailModalController.tsx` resolves the id via
  the new `findUnipoleById` (lib/inventory.ts), renders the modal in `AnimatePresence`, and
  strips an invalid id via the same `close()` — never crashes, never shows a broken modal.
  Rendered in `page.tsx` inside `<Suspense fallback={null}>` so `/` still prerenders
  statically (build output still shows `○ (Static)`).
- Built `UnipoleDetailModal.tsx` + `UnipoleGallery`/`SpecificationGrid`/`AudiencePanel`/
  `AvailabilityPanel`/`LocationPanel`. Desktop: 58/42 split, gallery column has no independent
  scroll, details column does (`lg:overflow-y-auto` on the content div only, CTA row as a
  separate non-scrolling flex sibling below it — the classic sticky-footer-without-`sticky`
  pattern). Mobile: single scroll region for the whole modal, CTA row uses real
  `sticky bottom-0` since there's no independent inner scroll container to lean on there.
  New `useFocusTrap` hook (Tab-cycle + initial focus, reusable by the Phase 3B-2 drawer);
  focus restored to the `[data-view-details-id]` button on unmount; Escape closes; Lenis
  `stop()`/body-scroll-lock on mount, `start()`/restore on unmount, mirroring
  `MobileNavigation.tsx`'s existing pattern exactly.
- Gallery/specs/audience/availability/location/pricing all follow business-rules.md exactly:
  gallery falls back to "Photography coming soon" (every record is still placeholder data),
  spec grid drops empty fields, audience shows only recorded data, availability date/duration
  are local-only and explicitly non-reserving, pricing is always "Price on Request" + the
  variability note, maps link is honest when `mapUrl` is missing. WhatsApp/Share are real
  actions (WhatsApp number from `siteConfig.whatsapp`, never hardcoded elsewhere); Request
  Quote/Site Visit/Add to Campaign are honest local placeholders (inline feedback, no
  backend). `UnipoleCard`'s "View Details" now really opens the modal — only "Add to Campaign"
  still shows a placeholder message, in both the card and the modal, until Phase 3B-2.
- Validation: `npm run lint` clean, `npm run build` succeeds (`/` still static). Dev-server
  smoke test: `/`, `/?site=UNI-001`, `/?site=BOGUS` all HTTP 200, no server/log errors — proves
  the controller never crashes for a missing/invalid id. No headless-browser tool was
  available to click through open/close/Back/Forward/focus-trap/gallery-nav — not claimed as
  visually verified.
- Phase 3B-1 complete. Next: Phase 3B-2 — CampaignPlanProvider + drawer + toast.

## 2026-07-25 (part 4 — Phase 3A: Unipole Inventory Browsing)
- New `src/lib/inventory.ts`: `getFilterOptions` derives city/area/size/illumination/status
  option lists straight from `src/data/unipoles.ts` (no hand-maintained lists to drift out of
  sync); `buildSearchIndex` normalizes each record's searchable fields once; `filterUnipoles`
  AND-combines search with all five filters. Shared `STATUS_LABELS`/`STATUS_BADGE_CLASSES`/
  `ILLUMINATION_LABELS` so the card badge and the filter select options can't show different
  wording for the same value.
- New `src/components/inventory/`: `InventorySection.tsx`, `InventoryFilters.tsx` (search +
  5 native selects + reset + `aria-live` results count), `UnipoleCard.tsx`, and
  `InventoryEmptyState.tsx`. Wired into `page.tsx` after `KeyLocationsSection` at
  `id="inventory"` — matching the `#inventory` anchors already in `siteConfig.nav`/Hero CTA.
- Deliberately did **not** reuse `FadeBlurReveal`/GSAP `ScrollTrigger` on individual cards —
  the grid re-renders on every keystroke/filter change, and re-creating a `ScrollTrigger`
  context that often is wasteful and janky. Only the static header block uses `TextReveal`.
- No real photography exists for any record yet, so `UnipoleCard` renders a labelled
  "Photography coming soon" panel instead of pointing `next/image` at a nonexistent file.
- "View Details" and "Add to Campaign" were both honest placeholders in this phase (View
  Details became real in Phase 3B-1 above).
- Validation: `npm run lint` clean, `npm run build` succeeds. Dev-server smoke test: HTTP 200,
  all inventory DOM ids present, results count read "6 sites" at the unfiltered default state.
- Phase 3A complete.

## 2026-07-25 (part 3 — Phase 2.5: Light Premium Visual & Motion Refinement)
- Rewrote design tokens to a predominantly light palette (globals.css + CLAUDE.md) and
  restyled Header, MobileNavigation, HeroSection, WhatIsUnipoleSection,
  WhyChooseUnipoleSection (was fully dark) and KeyLocationsSection to match. Fixed a
  pre-existing gap where major `<h2>`s had no explicit font-size (added `--text-h2` via a new
  `style` prop on `TextReveal`).
- Built the reversible unipole assembly: `UnipoleModel.tsx` (shared 7-group mesh, pure
  function of a mutable progress ref — reversal is structural, not a rewound timeline),
  `AssemblyScene.tsx` (Canvas), `UnipoleAssemblySection.tsx` (pin+scrub on desktop/tablet via
  `ScrollTrigger.matchMedia`, no-pin scrub on mobile, DOM-ref-driven stage indicator, reduced
  motion shows the static assembled model). Refactored `UnipoleScene.tsx` (hero) onto the
  same shared model. New hooks: `useInView` (pause off-screen Canvas rendering), reused
  `useIsMobileViewport` for exploded-offset intensity scaling.
- `npm run lint` and `npm run build` both pass.
- Phase 2.5 complete.

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
