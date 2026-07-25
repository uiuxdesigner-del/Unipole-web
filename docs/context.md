# Project Context (latest)

## Status
Phase 1, Phase 2, Phase 2.5 (Light Premium Visual & Motion Refinement), Phase 3A (Inventory
Browsing) and Phase 3B-1 (Product-Detail Modal) all COMPLETE. Lint and build both pass.

## Milestone
The site runs the light premium visual direction (CLAUDE.md "Design tokens"), the reversible
scroll-driven unipole assembly, a data-driven inventory catalogue, and a full product-detail
modal opened via `?site=<id>`. Next milestone is Phase 3B-2 — Campaign Plan (provider,
localStorage, drawer, toast).

## Repo-state note (2026-07-25)
A prior local commit (`1f75e13`, "Complete Phase 2.5 and Phase 3A inventory") only staged the
**new** files from that work (UnipoleModel, AssemblyScene, UnipoleAssemblySection, useInView,
the inventory/ components, lib/inventory.ts) — it did **not** include the accompanying edits
to already-tracked files (globals.css, CLAUDE.md, Header/MobileNavigation/HeroSection/
HeroVisual, UnipoleScene, TextReveal, WhatIsUnipole/WhyChoose/KeyLocations, page.tsx, and the
docs). The working tree had reverted to a broken hybrid state (new files calling APIs, like
`TextReveal`'s `style` prop, that didn't exist on the reverted files — would have failed
`next build`). This session restored every missing edit from scratch (verified against the
known-good content built earlier) before starting Phase 3B-1, then re-verified with lint/build
before proceeding. If committing this session's work, stage the full working tree (not just
new files) to avoid the same gap recurring.

## Completed this session (2026-07-25, part 5 — Phase 3B-1)
- **URL routing** (`src/hooks/useUnipoleModal.ts`): `useOpenUnipoleModal()` (router.push,
  no `useSearchParams` — safe to call from every card with no Suspense requirement) and
  `useUnipoleModalState()` (reads `?site=`, exposes `close()`). `close()` uses `router.back()`
  when the modal was opened via our own `push` (module-level flag) so Back/Forward work
  naturally; otherwise `router.replace()` strips the param without leaving the site — handles
  a direct/refreshed `?site=` URL safely.
- **`UnipoleDetailModalController.tsx`**: resolves the id via `findUnipoleById` (new in
  `lib/inventory.ts`), renders `UnipoleDetailModal` inside `AnimatePresence`, and safely
  strips an invalid id (calls the same `close()`, no crash, no broken modal). Rendered in
  `page.tsx` inside `<Suspense fallback={null}>` so the rest of `/` keeps prerendering
  statically (confirmed: build output still shows `○ (Static)` for `/`).
- **`UnipoleDetailModal.tsx`** + panels (`UnipoleGallery`, `SpecificationGrid`,
  `AudiencePanel`, `AvailabilityPanel`, `LocationPanel`): 58/42 desktop split with
  independent gallery/details scroll and a pinned CTA row (flex-child-outside-scroll-area on
  desktop, `sticky bottom-0` on mobile where there's one shared scroll region), full-screen
  single-column on mobile. Framer Motion only (opacity+scale+y, opacity-only under reduced
  motion) — no GSAP on this modal. Focus trap + initial focus via new reusable
  `useFocusTrap` hook; focus restored to the originating `[data-view-details-id]` button on
  unmount; Escape closes; Lenis `stop()`/body-scroll-lock on mount, `start()`/restore on
  unmount (same pattern as `MobileNavigation.tsx`).
- Gallery always shows the "Photography coming soon" fallback right now (every record is
  `isPlaceholderData: true`) — the interactive Next/Image prev/next/thumbnail/counter path is
  fully implemented and activates automatically once real images are supplied. Specification
  grid only renders fields with a value. Audience panel shows only recorded data (no invented
  traffic/impressions). Availability panel's date+duration are local-only state, explicitly
  labelled as not a reservation. Pricing is always "Price on Request" + the standard
  variability note.
- CTAs: WhatsApp and "Open in Google Maps" are real actions (open a URL; WhatsApp number
  comes from `siteConfig.whatsapp`, prefilled with title/media code/city/area). Request Quote,
  Schedule Site Visit and Add to Campaign Plan are honest local-only placeholders (inline
  `role="status"` feedback, no backend, no fabricated success) — Add to Campaign Plan stays a
  placeholder through Phase 3B-2. Share uses the Web Share API with a clipboard-copy fallback
  and an honest unsupported-browser message; Shortlist is a local toggle, not persisted yet.
- `UnipoleCard.tsx`'s "View Details" now calls `useOpenUnipoleModal()` for real (no longer a
  placeholder message) — only "Add to Campaign" still shows the Phase-3A-style inline note.
- Validation: `npm run lint` clean, `npm run build` succeeds, `/` still statically prerendered.
  Dev-server smoke test: `/`, `/?site=UNI-001`, `/?site=BOGUS` all return HTTP 200 with no
  server error and no entries in the dev log — confirms the controller never crashes the page
  for a missing/invalid id. No headless-browser tool was available to actually click through
  open/close/Back/Forward/focus-trap/gallery-nav — that interactive behaviour is unverified
  beyond code review and the server-level checks above.

## Completed earlier this session (2026-07-25, part 4 — Phase 3A)
Data-driven inventory catalogue: search (title/media code/city/area/road/landmark/facing) +
5 filters (city/area/size/illumination/availability) via `src/lib/inventory.ts`, results
count, Reset Filters, empty state, responsive `UnipoleCard` grid. Full detail in
docs/progress.md.

## Completed earlier this session (2026-07-25, part 3 — Phase 2.5)
Light premium visual direction (tokens in globals.css/CLAUDE.md), Header/Hero/section
restyle, shared reversible `UnipoleModel` + `UnipoleAssemblySection` (pinned scroll-driven
assembly, desktop/tablet pin via `ScrollTrigger.matchMedia`, no-pin scrub on mobile, reduced
motion shows the static assembled model). Full detail in docs/progress.md.

## Completed earlier this session (2026-07-25, part 2)
`WhyChooseUnipoleSection`, `KeyLocationsSection`, Three.js hero scene (`UnipoleScene`,
`HeroVisual`). Full detail in docs/progress.md.

## Completed earlier this session (2026-07-25, part 1)
The four motion primitives (`TextReveal`, `FadeBlurReveal`, `ParallaxMedia`,
`ScrollProgress`), `WhatIsUnipoleSection`. Full detail in docs/progress.md.

## Completed previous session (2026-07-24)
Project scaffold, design tokens, types/data, motion foundation, Header/MobileNavigation,
Hero foundation. Full detail in docs/progress.md.

## Pending (next session should continue here)
Phase 3B-2 — Campaign Plan (see docs/todo.md): `CampaignPlanProvider` (React context +
localStorage, browser-guarded, deduplicated by id), the drawer (list/remove/clear/request-
proposal), and the compact "Added to Plan" toast. Wire `UnipoleCard`'s and
`UnipoleDetailModal`'s "Add to Campaign" buttons to it (both currently show an honest
placeholder message).

## Architecture/decisions
See docs/architecture.md — includes the `useGsapContext`/`TextReveal` ref-typing decisions,
the `ScrollTrigger.matchMedia` pin/no-pin pattern, the `UnipoleModel` shared-progress-ref
design, the per-card-reveal rejection for filterable grids, and this session's URL-routing
hook split (`useOpenUnipoleModal` vs `useUnipoleModalState`) for Suspense isolation.

## Known issues / risks
- No real ADINN photography supplied yet — every inventory record is
  `isPlaceholderData: true`; the modal gallery and card images render a labelled fallback.
- Next.js 16 API surface differs from typical training data; verify against
  `node_modules/next/dist/docs/` before using any App Router API not already confirmed.
- `eslint-plugin-react-hooks` enforces "no setState in effect body" and "no ref read during
  render" — keep this in mind in Phase 3B-2 (`CampaignPlanProvider`'s localStorage sync is the
  next place this is likely to bite).
- No headless-browser/screenshot tool has been available in this environment across sessions;
  all visual/interactive verification has relied on code review + dev-server HTTP/log smoke
  tests. Flag to the user if a real visual QA pass is needed before launch.
- See "Repo-state note" above: if this session's work isn't committed with the full working
  tree, the same partial-commit gap will recur.

## Files touched
See docs/progress.md for the full file list per session.

## Next task
Phase 3B-2: `CampaignPlanProvider` (context + localStorage, browser-guarded, dedupe by id),
drawer (list/remove/clear/request-proposal), compact toast (title, city/area, View Plan,
Continue Browsing — never a full modal, per business-rules.md). Replace the "Add to Campaign"
placeholder in both `UnipoleCard.tsx` and `UnipoleDetailModal.tsx` with the real provider call.
