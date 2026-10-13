# SITE BLUEPRINT — The Open Sky

Target architecture for the **existing Astro 7 static site**. No stack change is proposed: the current problems are data and content discipline, not framework limits. Principles from CLAUDE.md / PRODUCT.md still apply: premium, calm, editorial, substantial; ceremonial, not transactional; remove before adding; no new component where an existing one can evolve.

Companion documents: `docs/SITE_AUDIT.md` (findings F-xx), `docs/CONTENT_DECISIONS_REQUIRED.md` (decisions D-x).

---

## 1. Page hierarchy and navigation

The current hierarchy already matches CLAUDE.md "Site Structure" and is kept:

```
/                         Home — threshold; what is happening next
├─ /retreats              Hub → /retreats/[slug]
├─ /mountains             Hub → /mountains/[slug]
├─ /programs              Hub → /programs/[slug]
├─ /mentorship            Single page (application by conversation)
├─ /music                 Single page
├─ /about                 Single page
└─ /connect               Single page (the one destination of every CTA)
```

Navigation (header + drawer + footer) stays: Live Retreats · Mountains · Online Programs · Mentorship · Music · About · Connect. Social set stays Telegram · Instagram · YouTube · Email (VK only if D-8 says so).

Structural changes recommended (small):
1. **Mountains** is the umbrella for all journeys; the hub title "Path of the Spirit" is kept as the page's heading but `<title>`/breadcrumb should say "Mountains" so nav, title and URL agree.
2. **Past events get a quiet place**, not deletion: a short "Where we have been" section at the foot of each hub, fed from the same data (status `past`). Detail pages of past events stay reachable but with a past-state header and no apply CTA (F-15).
3. Resolve the **retreat vs. mountain-journey overlap** (F-09, D-3): one event = one record on one hub.
4. Add `404.astro` and a footer-level "Connect" only (no new top-level pages).

## 2. Page purposes and primary journeys

| Page | Purpose | Primary journey (one action per view) |
|---|---|---|
| Home | Arrival; show the single next departure and the worlds | Atmosphere → *next departure* → hub/detail |
| Hubs | Show the worlds of one kind; upcoming first, past quietly after | Hub → detail |
| Detail (retreat/mountain/program) | Make the case for one departure; carry all practical facts | Read → Connect (source-tagged) |
| Mentorship | Explain a one-to-one relationship | Read → Connect |
| Music | Presence of the music practice | Listen (real links) → Telegram |
| About | Who leads this | Read → Connect |
| Connect | The only door: write to Yakov; secondary channels | Email (or form, D-5) |

## 3. Content structure

**Hub:** hero (photograph dominates) → *one* featured upcoming departure → other upcoming (sorted by `departureDate`) → quiet past section → single closing CTA. Never a catalogue grid; no prices on cards (CLAUDE.md Card System).

**Detail page** (shared skeleton, per-destination atmosphere — "one destination, one palette"):
1. Hero (title, one line, date, place) · 2. Opening note from Yakov · 3. Route/structure · 4. Practical facts (dates, duration, altitude, group size, difficulty) · 5. Included / not included / who it is for · 6. Testimonials *only if real and approved* · 7. FAQ · 8. Apply (Connect, source-tagged).
Rule: **a section with no real content is omitted**, not shown as a placeholder (fixes F-03).
The bespoke Kailash page remains a deliberate exception; if more bespoke pages appear, move them to a layout option rather than copy files.

## 4. Sources of truth

Replace free-text dates and per-page constants with typed records in `src/data/` (the three files exist already; extend, don't add a CMS).

| Datum | Single source | Rule |
|---|---|---|
| Event type | `kind: 'retreat' \| 'journey' \| 'program'` (optional unified `events.ts`; or keep three files with an identical base interface) | One record per real-world event |
| Start / end date | `startDate`, `endDate?` as ISO `YYYY-MM-DD`; `datePrecision: 'day' \| 'month' \| 'tba'` | Display strings are **generated** (`formatDateRange`), never typed; no invented days (F-23) |
| Status | `status: 'open' \| 'soon' \| 'waitlist' \| 'closed' \| 'past'` — `past` derived from date at build, may be overridden to `closed` | Replaces `status` + `upcoming` + `badge` triple in `MountainJourney` |
| Location | `location`, `region` | One field, used by cards and detail |
| Price | `price?: { amount, currency, deposit? }` or absent | **Absent = "on enquiry"**; nothing renders a price unless approved (D-4) |
| Participant limit | `groupMax: number` (+ optional `groupMin`) | Prose reads it via helper, never typed ("Six people" bug, F-06) |
| Availability / places remaining | `placesRemaining?: number` only if owner commits to maintain it | Otherwise do not display (F-05) |
| Contact | `src/data/site.ts`: `contactEmail`, `social: { telegram, instagram, youtube, vk? }`, `communitySize?` | Footer, Connect, Nav, CTAs, music read from here (F-08, F-13) |
| Attribution codes | Generated from records (`source = ${kind}_${slug}`), static codes only for fixed CTAs | Delete hand-maintained map entries (F-14) |

Selection logic (`getFeaturedExpedition`, `getNextJourney`, `getNextOpenProgram`, `getFeaturedRetreat`) moves into one `selectors.ts`: *upcoming = status open/soon and `startDate ≥ today`; featured = earliest upcoming; if none, no feature (never fall back to a past event)*. Because the site is static, the build date is the evaluation date: add a **daily Vercel deploy hook (cron)** so the hub rolls forward without a manual deploy (F-04).

## 5. Reusable components (only where there is real maintenance benefit)

Evolve existing components rather than add new ones:
- **Journey/Event card** — one component for all three kinds (today: `ProductCard`, `RetreatCard`, inline `pts-hero__card` markup in `mountains.astro`). Takes an event record; no price badge.
- **Facts list** — the Dates/Duration/Location/Group rows now duplicated in the Kailash page, `[slug].astro`, programs and retreats.
- **EventStatus** — one mapping from `status` → label/CTA behaviour (replaces `Open now` / `Coming Soon` / `Closed — next cohort TBA` string literals in 4 places).
- **ContactLink / SocialLinks** — reads `site.ts` (used by Nav ×2, Footer, ConnectSection, Connect, Community).
- **Existing unused components** (`Categories`, `ProductGrid`, `ProductCard`, `RetreatCard`, `MusicSection`, …) — confirm which routes import them; delete or fold in. No new component libraries.

## 6. Forms and enquiry

Keep "write to Yakov" as the ceremonial CTA. Open question D-5 decides between (a) mailto only (today; zero infrastructure) and (b) a minimal form posting to an email service/Vercel function. Whichever is chosen: one address, source tag attached, visible label on every field, a no-JS fallback, and the "Contact form" label on Home matches reality.

## 7. SEO requirements

- `site` set in `astro.config.mjs`; canonical on every page; sitemap (`@astrojs/sitemap`) and `robots.txt`; custom `404`.
- Open Graph / Twitter tags in `Base.astro`, with a per-page image prop (hero image).
- Unique `<title>` and description per page (present today) — align `/mountains` title with nav.
- JSON-LD `Event` for upcoming departures (date, location from data) and `Organization`/`Person` on About — **only from confirmed data**.
- Exactly one `<h1>` per page (Home currently has none, F-11).
- `lang="en"` present; add `hreflang` only if a Russian version is planned (D-10).

## 8. Accessibility requirements (WCAG AA, per PRODUCT.md)

Visible focus on dark backgrounds; `prefers-reduced-motion` honoured by `.reveal` and parallax; no information by colour alone (status labels carry text); explicit form labels; hero images that carry no information keep `alt=""`; contrast check on gold-on-navy labels and the dark hub sections; keyboard-operable `<details>` FAQs and the mobile drawer. Currently **unverified** (no browser run) — the audit only confirmed alt attributes and heading presence.

## 9. Testing requirements

Keep Playwright. Add, in order of value:
1. **Data tests (no browser, fast):** every record has valid ISO date, unique slug, `groupMax` > 0; no `status: open` with past `startDate`; every `source` code emitted by a CTA exists in the map.
2. **Build-output tests:** all 19+ routes exist; no bracketed placeholder text (`/\[[A-Z][^\]]+\]/`, "Name Surname", "Gallery · "); no `$`/price strings unless a record has a price; no `mailto:` other than `site.contactEmail`; exactly one h1 per page.
3. **Link test:** all internal links and images resolve in `dist/`; external links checked in CI as a warning, not a failure.
4. **Browser smoke (existing):** extend to detail routes; fix the `Page` type import so `astro check` passes (F-19).
5. Pin Node ≥ 22.12 (`.nvmrc`, Vercel setting) so local default matches `engines`.

## 10. Out of scope

No migration to another framework or CMS, no visual redesign, no new page types, no pricing display, no booking/payment flow.
