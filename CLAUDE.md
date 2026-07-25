@AGENTS.md

# ADINN Unipole Website — Project Rules

Single-page Next.js site for ADINN Advertising Services Ltd, showcasing unipole
outdoor-advertising inventory as a light, premium product-storytelling experience (Apple/
Sony/Lexus-style — not a dark cinematic site; see Design tokens below). Full detail brief
lives with the user; this file holds only stable, durable rules. Session state lives in
docs/context.md, docs/todo.md, docs/progress.md.

## Hard constraints
- ONE page only (`src/app/page.tsx` composes sections). No `/product`, `/site/[id]`, or any
  other route for inventory detail. Product detail = modal only.
- Modal open state syncs to `?site=<id>` query param via `useSearchParams`/`router.push`
  (shallow) in a Client Component. Browser Back must close it.
- Stack: Next.js App Router + TypeScript + Tailwind v4 + GSAP/ScrollTrigger + Lenis +
  Three.js (R3F/drei) + Framer Motion + lucide-react + clsx. No other animation/state libs.
- Lenis: smooth scroll only (the only smooth-scroll engine — never add a second one), synced
  to the GSAP ticker + `ScrollTrigger.update` in `SmoothScrollProvider`. GSAP: timelines/
  reveals/parallax/pinning. Three.js: hero scene + the reversible unipole assembly section
  only, sharing one grouped model (`components/three/UnipoleModel.tsx`) driven by a mutable
  progress ref, never React state per frame. Framer Motion: modal/drawer/menu/toast only.
  Never mix systems on the same animation.
- Next.js 16: this repo runs a version ahead of common training data — see AGENTS.md.
  Turbopack is default (no `--turbopack` flag needed). `next lint` is removed; use
  `eslint` directly (already wired as `npm run lint`). searchParams/params are async on
  Server Components — irrelevant for our client-only modal sync, which uses the
  client-side `useSearchParams` hook instead.
- No backend/API in phase one. Enquiry form validates client-side only and must not claim
  server submission succeeded.
- No fake stats/testimonials/availability. Use clearly labelled editable placeholder data,
  centralized in `src/data/` and `src/config/site.ts`.

## Design tokens — light premium direction (permanent, set 2026-07-25 Phase 2.5)
The site is predominantly light: white `#FFFFFF` / warm-white `#FAFAF8` / soft grey
`#F5F5F3` backgrounds (~70–80% of the page), black `#111111` heading text, secondary text
`#666666`, muted/label text `#8A8A86`, border `#E5E5E2` (strong `#D8D8D4`), ADINN red
`#D71920` as a controlled accent (labels, active states, CTAs — never full paragraphs), soft
red tint `#FFF4F4`. Dark `#0A0A0A` is reserved for small, purposeful accents (e.g. one
decorative map card) — never a full-page or full-section treatment. Font: Outfit
(next/font/google). Editorial clamp() type scale (`--text-hero`, `--text-display`,
`--text-h2`, `--text-h3`, `--text-body-lg`) in `src/app/globals.css`; apply `--text-h2` via
inline `style` to every major section `<h2>` (Tailwind has no matching utility class for it).
Tokens live as CSS variables in `src/app/globals.css` + Tailwind v4 `@theme`.

## Workflow
- Work one phase at a time (see docs/todo.md). Run `npm run lint` and `npm run build`
  after each phase; fix all errors before marking complete.
- Reuse motion utilities in `src/components/motion/` and hooks in `src/hooks/` — never
  duplicate a reveal/parallax/pin implementation inline in a section component.
- Report format: Completed / Files modified / Validation / Remaining issue / Next task.
