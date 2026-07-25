@AGENTS.md

# ADINN Unipole Website — Project Rules

Single-page cinematic Next.js site for ADINN Advertising Services Ltd, showcasing unipole
outdoor-advertising inventory. Full detail brief lives with the user; this file holds only
stable, durable rules. Session state lives in docs/context.md, docs/todo.md, docs/progress.md.

## Hard constraints
- ONE page only (`src/app/page.tsx` composes sections). No `/product`, `/site/[id]`, or any
  other route for inventory detail. Product detail = modal only.
- Modal open state syncs to `?site=<id>` query param via `useSearchParams`/`router.push`
  (shallow) in a Client Component. Browser Back must close it.
- Stack: Next.js App Router + TypeScript + Tailwind v4 + GSAP/ScrollTrigger + Lenis +
  Three.js (R3F/drei) + Framer Motion + lucide-react + clsx. No other animation/state libs.
- Lenis: smooth scroll only. GSAP: timelines/reveals/parallax/pinning. Three.js: hero +
  "What Is a Unipole" visual only. Framer Motion: modal/drawer/menu/toast only. Never mix
  systems on the same animation.
- Next.js 16: this repo runs a version ahead of common training data — see AGENTS.md.
  Turbopack is default (no `--turbopack` flag needed). `next lint` is removed; use
  `eslint` directly (already wired as `npm run lint`). searchParams/params are async on
  Server Components — irrelevant for our client-only modal sync, which uses the
  client-side `useSearchParams` hook instead.
- No backend/API in phase one. Enquiry form validates client-side only and must not claim
  server submission succeeded.
- No fake stats/testimonials/availability. Use clearly labelled editable placeholder data,
  centralized in `src/data/` and `src/config/site.ts`.

## Design tokens
Primary red #D71920, black #111111, white #FFFFFF, soft bg #F5F5F3, border #E4E4E1,
dark cinematic #080808, muted text #6B6B6B. Font: Outfit (next/font/google). Tokens live as
CSS variables in `src/app/globals.css` + Tailwind v4 `@theme`.

## Workflow
- Work one phase at a time (see docs/todo.md). Run `npm run lint` and `npm run build`
  after each phase; fix all errors before marking complete.
- Reuse motion utilities in `src/components/motion/` and hooks in `src/hooks/` — never
  duplicate a reveal/parallax/pin implementation inline in a section component.
- Report format: Completed / Files modified / Validation / Remaining issue / Next task.
