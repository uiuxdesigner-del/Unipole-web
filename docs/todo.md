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

## Phase 3 — Inventory and Product Popup (next)
- [ ] Inventory filters + cards + empty state
- [ ] UnipoleDetailModal (gallery, specs, audience, availability, pricing, location, CTAs)
- [ ] ?site= query sync + Back-closes-modal behaviour
- [ ] CampaignPlanProvider + drawer + toast (localStorage, dedupe)

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
