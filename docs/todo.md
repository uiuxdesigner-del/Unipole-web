# To-Do (priority order)

## Phase 1 — Audit and Foundation — COMPLETE (2026-07-24)
All items done; lint and build both pass. See docs/progress.md for detail.

## Phase 2 — Core Storytelling — COMPLETE (2026-07-25)
- [x] TextReveal, FadeBlurReveal, ParallaxMedia, ScrollProgress motion components
- [x] What Is a Unipole (sticky intro pane desktop / stacked mobile)
- [x] Why Choose Unipole Advertising (pinned scroll-driven benefit switcher desktop /
      stacked reveal mobile)
- [x] Key Locations (location-type categories, city filter chips, map-inspired SVG visual)
- [x] Three.js hero/unipole scene (dynamic import, ssr:false, reduced-motion + mobile
      fallback to the static gradient)

## Phase 2.5 — Light Premium Visual & Motion Refinement — COMPLETE (2026-07-25)
- [x] Light premium design tokens (globals.css + CLAUDE.md) replacing the dark-cinematic
      direction; `--text-h2` gap on major headings fixed
- [x] Header, MobileNavigation, HeroSection, WhatIsUnipole, WhyChooseUnipole, KeyLocations
      restyled to the light palette
- [x] Shared, reversible unipole model (`UnipoleModel.tsx`) + hero scene refactor
- [x] `UnipoleAssemblySection` — pinned scroll-driven assembly (desktop/tablet), no-pin
      scrub (mobile), stage indicator, reduced-motion static fallback
- [x] `useInView` (pause off-screen Canvas) + intensity-scaled mobile assembly

## Phase 3A — Unipole Inventory Browsing — COMPLETE (2026-07-25)
- [x] Data-driven search (title/media code/city/area/road/landmark/facing) + 5 filters
      (city/area/size/illumination/availability), memoised index, AND-combined
- [x] Results count, Reset Filters (disabled when no filter active), empty state
- [x] Responsive `UnipoleCard` grid (1/2/3 columns), muted status badges

## Phase 3B-1 — Product-Detail Modal — COMPLETE (2026-07-25)
- [x] `UnipoleDetailModal` + `UnipoleGallery`/`SpecificationGrid`/`AudiencePanel`/
      `AvailabilityPanel`/`LocationPanel`
- [x] `?site=<id>` URL sync (`useOpenUnipoleModal`/`useUnipoleModalState`), Back closes,
      Forward reopens, invalid id fails safely, Suspense-isolated for static rendering
- [x] Focus trap + restoration (`useFocusTrap`), Escape closes, Lenis stop/restart + body
      scroll lock
- [x] Share (Web Share API + clipboard fallback), Shortlist (local toggle), WhatsApp
      (real, prefilled from `siteConfig`), Maps link, Request Quote/Site Visit (honest
      local placeholders)
- [x] "Add to Campaign Plan" kept as an honest Phase 3B-2 placeholder in both the card and
      the modal

## Phase 3B-2 — Campaign Plan (next)
- [ ] `CampaignPlanProvider` (React context + localStorage, browser-guarded, dedupe by id)
- [ ] Campaign-plan drawer (list, remove, clear, request-proposal)
- [ ] Compact "Added to Plan" toast (title, city/area, View Plan, Continue Browsing)
- [ ] Wire `UnipoleCard` and `UnipoleDetailModal`'s "Add to Campaign" to the real provider

## Phase 4 — Supporting Cinematic Sections
- [ ] Day/Night comparison (draggable + keyboard)
- [ ] From Ground to Sky (pinned steps desktop / timeline mobile)
- [ ] Business Growth Journey
- [ ] Campaign Gallery (filterable, lightbox)
- [ ] Industries Served
- [ ] How It Works

## Phase 5 — Conversion Sections
- [ ] FAQ accordion
- [ ] Enquiry form (client-side validation, isolated submit logic)
- [ ] Footer
- [ ] site.ts contact data wired everywhere (no duplication)

## Phase 6 — Refinement
- [ ] Mobile/tablet responsive pass at 360/390/768/1024/1280/1440
- [ ] Accessibility audit (focus trap, aria, keyboard, contrast)
- [ ] Reduced-motion audit
- [ ] Performance pass (DPR limits, lazy-load, ScrollTrigger cleanup, no CLS)
- [ ] Final build + doc update
