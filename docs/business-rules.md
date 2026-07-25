# Business Rules

## Visual & motion direction
Permanent light premium product-storytelling direction and palette are documented in
CLAUDE.md's "Design tokens" section — do not restate them here. The central product
interaction is a reversible, scroll-driven unipole assembly (see docs/architecture.md).

## Company
ADINN Advertising Services Ltd — unipole (single-pole large-format) outdoor advertising.
Central editable company/contact info lives in `src/config/site.ts` only — never duplicate
contact details inside components.

## Single-page rule
Entire experience is one route (`/`). Sections in order: Header, Hero, What Is a Unipole,
Why Choose Unipole, Key Locations, Inventory, Day/Night, Ground to Sky, Growth Journey,
Campaigns, Industries, How It Works, FAQ, Enquiry, Footer. Product detail is a modal, never
a route. `?site=UNI-001` opens the modal on load/share; Back closes it.

## Inventory data model
Typed in `src/types/unipole.ts`, data in `src/data/unipoles.ts`. Fields: id, mediaCode,
title, state, city, area, roadName, landmark, description, size, width, height, totalSqFt,
facing, trafficDirection, roadType, illumination, displaySides, visibilityDistance,
minimumDuration, status, availableFrom, pricingMode, estimatedPrice, audience, peakHours,
images, dayImage, nightImage, mapUrl, features. Unverified fields must be clearly marked as
editable placeholders in code comments, not presented as confirmed data.

## Pricing
Always display "Price on Request". Optional itemized breakdown (media rental, printing,
installation, lighting, approvals, GST) only when data exists. Always show the standard
variability note. No fabricated numeric quotes.

## Availability
Only these statuses: Available, Temporarily Held, Booked, Upcoming. No booking calendar —
just start date + duration + a short availability note.

## Campaign Plan (client-side only)
"Add to Campaign" stores selected sites in `localStorage`, deduplicated by id. Toast is
compact (title, city/area, View Plan, Continue Browsing) — never a full modal. Drawer lists
selections with remove/clear/request-proposal actions. All localStorage access must be
guarded for browser-only execution.

## Enquiry form
Client-side validation only in phase one. No backend exists — success state must not imply
a server received the submission. Submission logic must be isolated (e.g. a single function)
so a real API can replace it later without touching the form UI.

## Maps
Use a plain "Open in Google Maps" link (`mapUrl` field) — never integrate a paid map API
without credentials.

## No fabrication
No fake statistics, testimonials, traffic counts, or availability. Use real ADINN photos
where supplied; otherwise use clearly labelled placeholder imagery/data.
