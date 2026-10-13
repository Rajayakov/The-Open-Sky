# SITE AUDIT — The Open Sky

Audit date: **2026-10-13** (all "past/upcoming" judgements are relative to this date).
Scope: read-only audit of the local working tree. No application code, content, config, tests or remote state was changed.

---

## 1. Repository and version status

| Item | Verified value |
|---|---|
| Path | `/Users/Rajuna/projects/The-Open-Sky` |
| Branch / HEAD | `main` / `a9527a8` "Alpine Mist: finalize art-direction pass on mountains page" |
| Remote | `origin git@github.com:Rajayakov/The-Open-Sky.git`; `origin/main` = `5b666ac` (local `fetch --dry-run` only). **Local is 1 commit ahead (`a9527a8` not pushed).** |
| Working tree | **Dirty.** Source changes uncommitted: `src/data/mountains.ts`, `src/pages/mountains.astro`, `src/pages/mountains/kailash-2026.astro` (+229/−126). Also modified/untracked: `CLAUDE.md`, `package.json`, `package-lock.json`, `.gitignore`, `.claude/**`, `.agents/`, `DESIGN.md`, `graphify-out/`, `materials/`, new image `public/images/mountains/kailash-hero-sunset.jpg`. 45 status entries in total. |
| Vercel link | `.vercel/project.json` → project `the-open-sky`. Vercel CLI and `gh` are **not installed**; no authenticated deployment listing was possible. |
| Deployed alias | `https://the-open-sky.vercel.app` responds 200. **It does not match the local tree** (see below). |
| `yakovrajuna.com` | Named in PRODUCT.md. From this machine the domain does not resolve (curl status 000; no A/MX records). **Unverified** whether it is the live production domain. |
| Runtime | `package.json` requires Node ≥ 22.12. Default shell Node is **20.20.2** (Astro refuses to run). `/usr/local/bin/node` is v24.15.0 and builds fine. |

**Local vs deployed evidence** (fetched `the-open-sky.vercel.app/mountains`): deployed shows "4 places remaining", "Max 6 people", "6,638m", "September 20–30", a "Past Expeditions" block, and Apply links `mountains_schedule_*`. None of these exist in the local `mountains.astro`. Deployed home page text is identical to a fresh local build. So the deployed `/mountains` is an older version than HEAD, and uncommitted edits (group size 6 → 15, new hero image) are not deployed either. No evidence says which version the owner considers current — see decision D-9.

## 2. Route inventory (19 routes, all built successfully)

Build: `astro build` (Node 24, output to scratchpad) → 19 pages, 0 errors, 1 warning (see F-03).

| Type | Routes | Source |
|---|---|---|
| Home | `/` | `pages/index.astro` |
| Hubs | `/retreats`, `/mountains`, `/programs` | `retreats/index.astro`, `mountains.astro`, `programs.astro` |
| Single pages | `/mentorship`, `/music`, `/about`, `/connect` | matching `.astro` files |
| Retreat details (3) | `/retreats/mountain-autumn-2026`, `/retreats/winter-stillness-2026`, `/retreats/summer-fire-ceremony-2026` | `retreats/[slug].astro` ← `data/retreats.ts` |
| Mountain details (5) | `/mountains/kailash-2026` (static bespoke file), `/mountains/arunachala-2026`, `/mountains/annapurna`, `/mountains/georgian-highlands-september-2026`, `/mountains/pontic-alps-july-2026` | `kailash-2026.astro` + `mountains/[slug].astro` ← `data/mountains.ts` |
| Program details (3) | `/programs/inner-cartography-cohort-4`, `/programs/fire-season-cohort-2`, `/programs/roots-and-direction-open` | `programs/[slug].astro` ← `data/programs.ts` |

Routes that could not be verified in a browser: **all 19** (no browser was launched — see §6). Static HTML for all 19 was inspected.
Not routable: no `404.astro` (Vercel default 404 only), no sitemap, no robots.txt (both 404 on deployed alias).

## 3. Findings

Severity: P0 critical · P1 high · P2 medium · P3 low.

### P0

**F-01 — Past events presented as upcoming across the home page and hubs.**
- Where: `components/UpcomingSection.astro` (home), `ChapterRetreats/Mountains/Programs`, `FeaturedExperience.astro`, `retreats/index.astro`, `programs.astro`, `data/*.ts`.
- Evidence (today 2026-10-13): Home "Upcoming experiences" shows retreat *Five days in the mountains* "September 2026", *Kailash* "Sep 20, 2026", *Inner Cartography* "Jun 5, 2026" — all past. `/retreats` says "Upcoming — 3 retreats" listing Sep 2026, **Feb 2026**, **Jun 2026**. `/programs` lists Inner Cartography (start Jun 5 2026) as "Open", Fire Season (Sep 8 2026) "Closed". `/mountains/kailash-2026` still offers "Express Interest / JOIN" for 20 Sep 2026.
- Cause: `getNextJourney()`, `getNextOpenProgram()`, `getFeaturedRetreat()` ignore dates (first array match / manual `featured` flag); retreats and programs have free-text dates and no status/date field.
- Impact: credibility; visitors apply to departures that have already happened; home and `/mountains` disagree (hub already skips Kailash and features Arunachala, home still leads with Kailash).
- Fix: one data model with ISO dates + status (see Blueprint §4); compute upcoming/past from it; owner must supply real next dates (D-2, D-3).

**F-02 — Annapurna date conflicts with the confirmed fact.**
- Where: `data/mountains.ts` (`date: '15–30 May 2027'`, `dateShort: 'May 15, 2027'`, `departureDate: '2027-05-15'`, `duration: '16 days · 15 nights'`), `mountains.astro` (rendered in the schedule card), `/mountains/annapurna` hero.
- Evidence: confirmed departure is **25 March 2027**. Site shows 15 May. Duration (16 days), itinerary (Pokhara, Sanctuary), group (Max 10), altitude (1,700–4,130m) are all unconfirmed and conflict with `context/docs/Projects_AI_Optimized.md` ("Annapurna-Muktinath", 14–21 days, May 2026, max 8, Kathmandu start, up to 3,800m).
- Impact: flagship next departure is advertised with a wrong date; sort order and featured logic depend on `departureDate`.
- Fix: set departure to 2027-03-25 only; **do not derive an end date, duration or itinerary** — see D-1.

**F-03 — Unfinished placeholder content live on four expedition pages.**
- Where: `mountains/[slug].astro` (Highlights, Gallery, Testimonials blocks) → `/mountains/annapurna`, `/arunachala-2026`, `/georgian-highlands-september-2026`, `/pontic-alps-july-2026`.
- Evidence (in built HTML): "[Description of the specific landscape and what it demands and offers.]" ×1 and three more bracketed prompts, "[Testimonial 1/2/3 — to be added after the expedition.]", "Name Surname / Country · Year", six "Gallery · 0N" empty slots. `Annapurna` and `Arunachala` are linked from the hub, so visitors reach them.
- Impact: looks broken/unfinished on the two live offerings; undermines the premium positioning.
- Fix: remove empty sections until real content exists (restraint principle); write real highlights from owner-approved copy.

### P1

**F-04 — "Automatic" featured/upcoming logic is evaluated only at build time.** `getFeaturedExpedition()` / `getOtherUpcoming()` use `new Date()` in a static Astro build, so the hub changes only on redeploy. Also, when nothing is upcoming the fallback `pool = open` returns a **past** journey as featured (`data/mountains.ts:~290`). The Hero Card badge reads `status === 'upcoming' ? 'Open now'` and ignores `badge`, so Annapurna (`badge: 'soon'`) would show "Open now" once featured, while its schedule card says "Coming Soon". Impact: stale or wrong hub after any date passes without a rebuild. Fix: scheduled rebuild (Vercel cron deploy hook) or client-side date check; fix fallback and badge.

**F-05 — Dead Kailash block in `mountains/[slug].astro` carries conflicting facts and a price.** Astro's build warns: "Could not render `/mountains/kailash-2026` from route `/mountains/[slug]` as it conflicts with higher priority route". The static `kailash-2026.astro` wins, so the `isKailash` branch of `[slug].astro` (`klFaq`, markup from ~line 121 to ~600, plus its CSS) never renders. They contain: **$3,500 USD**, **$700 deposit**, "Max 6 people", "**Places remaining 4**", "September 20–30, 2026", "When the current allocation fills, pricing increases", "Mardi Himal 2025 · 12 participants", link `/connect?from=kailash-2026` (unrecognised param). The live Kailash page says "Investment on enquiry". Impact: if the bespoke file is renamed/removed, unapproved price and scarcity claims go public; maintenance confusion. Fix: delete dead block after owner confirms the facts (D-4).

**F-06 — Kailash group size conflict (uncommitted change).** `data/mountains.ts` working-tree: `Max 15 people` (HEAD: `Max 6`). Prose still hard-codes "Six people" (`kailash-2026.astro:148`, `[slug].astro:141`) and deployed hub says "Max 6". The Kailash page derives "places" from the data (`groupCount`), so the hero, FAQ and apply copy would say 15 while the body says six. Which is true is unconfirmed → D-4.

**F-07 — Attributed Kailash testimonials conflict with the data and are unverifiable.** `kailash-2026.astro:~285-300`: "Elena K., Moscow · Mardi Himal 2025", "David M., Berlin · Georgian Highlands **2024**", "Maria T., Tbilisi · Pontic Alps **2024**". Data says Georgian Highlands (Sep 2026) and Pontic Alps (Jul 2026) are 2026 expeditions; `pastExpeditions` lists Mardi Himal as "seven days" while the dead block says "12 participants". Cannot be verified from the repo. Impact: potentially fabricated or misdated social proof. Fix: owner confirms each quote and its attribution, or remove (D-6).

**F-08 — Two contact emails.** Footer (`Footer.astro:24`): `rajunayakov@gmail.com`. `/connect` button and mailto body (`connect.astro:37,163`): `yakov@rajuna.com`. `rajuna.com` has an MX record (Outlook), but whether the mailbox is monitored is unknown. Impact: enquiries split or lost. Fix: single constant after D-5.

**F-09 — Overlapping/duplicate Georgia offerings.** Retreat *Five days in the mountains* (Sep 2026, Kazbegi, 5 days, 6–10 people, "featured") and mountain journey *Georgian Highlands* (14–20 Sep 2026, Kazbegi, 7 days, Max 8, status `past`) cover the same place and month with different durations and group sizes; the Georgian journey also overlaps Kailash (20 Sep). Both exist in different data files and on different pages. Fix: determine whether these are one event or two (D-3).

**F-10 — Broken external link: VK.** `ConnectSection.astro:31` → `https://vk.com/yakovrajuna` returns **404**. VK is also not in the documented social set (Hero + Footer: Telegram, Instagram, YouTube, Email) and appears nowhere else. Fix: correct the URL or remove (D-8).

### P2

**F-11 — Home page has no `<h1>`.** `Hero.astro` renders the brand in `<p class="hero__name">`. Hurts accessibility/SEO. Fix: promote to `<h1>` without visual change.

**F-12 — SEO baseline missing.** No `<link rel="canonical">`, no Open Graph/Twitter tags, no sitemap, no robots.txt, no `site` in `astro.config.mjs`, no custom 404, no structured data (Event/Organization). Titles/descriptions exist on all 19 pages; `/mountains` title is "Path of the Spirit" while nav says "Mountains".

**F-13 — Hard-coded repeated facts.** "340+ members" (`Community`/`ConnectSection`) and "Over 340 people" (`connect.astro:49`) — owner-maintained number that will go stale. `FeaturedExperience.astro` hard-codes "6–10 people", "Autumn 2026" (data says "September 2026") and the title "Five days in the mountains" and slug. `ChapterRetreats` copy says retreats run "Five to eight days" (data: 1, 4, 5 days) and `ChapterRetreats`/`About` list "the Pontic Alps" as a retreat location although it is a mountain expedition in data. Programs chapter duplicates the programs array (`ChapterPrograms.astro`).

**F-14 — Attribution codes do not match the map.** `connectSources.ts` knows `mountains_hub_kailash_apply`, `mountains_hub_past_1/2`; the code emits `mountains_hub_${slug}_apply` (e.g. `mountains_hub_arunachala-2026_apply`), `mountains_final_cta`, and `from=kailash-2026` → all fall back to "Direct visit / untagged". `/programs` list CTAs (`programs.astro:71`) link to bare `/connect`; `retreats/index.astro:80` and `[slug]:176` pass `/connect` as `primaryHref` (attribution via `primarySource` not verified).

**F-15 — Past expedition pages show a wrong CTA state.** `mountains/[slug].astro`: any journey that is not `upcoming` renders "This expedition will be announced soon… Join the Telegram channel to be notified when applications open". For Georgian Highlands and Pontic Alps (both `past`) this is false. `status: 'soon'` / `isSoon` is defined but unused by any record. These two pages are not linked from the hub (orphans) but are published.

**F-16 — Programs data/copy inconsistencies.** Cohort 4 (Jun 5 2026) status "open" after its start; Fire Season "Closed — next cohort TBA" with no path forward; Roots & Direction "Self-paced · Open enrollment" vs description "weekly live Q&A" and "How it works" step 3 "The program begins on a specific day"; "Live cohort · 12 participants" duplicated in Format and Group rows. `getNextOpenProgram()` excludes the string `'Rolling enrollment'` by magic value.

**F-17 — `/connect` has no form.** The only contact mechanism is a `mailto:` link (body prefilled by JS). Home labels the card "Contact form". Users without a configured mail client get nothing. Not necessarily a defect if intentional — see Blueprint §6.

**F-18 — Music page lists platforms without links.** `music.astro:143-146`: Spotify "Full discography", Apple Music "Full discography", Bandcamp "name your price", YouTube — rendered as non-link text. Whether these profiles exist is unverified. Home also shows "Bone & Fire · 2024", "Fire Ceremony · Live", "Mountain Sessions" as unlinked titles.

**F-19 — Tests are smoke-only and one is invalid.** `tests/site-check.spec.ts` covers 8 top-level routes (loads, console errors, nav links, home images). No test covers detail pages, dates, placeholders, external links or the featured logic. `astro check` reports 1 error (`ts(1484)` `Page` must be a type-only import) and an unused function. `tests/example.spec.ts` is a stub.

### P3

- **F-20 Unused / heavy assets**: `hero-2.jpg`, `hero-5.jpg`, `hero-7.jpg`, `card-4.jpg`, `kailash-hero.jpg` (≈3.5 MB) are not referenced by `src/`. Hub hero `hero.jpg` is 1.3 MB with no responsive sizes/WebP. `public/images/mountains/card-3.jpg` is used as Annapurna's image — subject cannot be confirmed from code.
- **F-21 External Google Fonts, four families** (Source Serif 4, Fraunces, Inter Tight, Syne) loaded render-blocking in `Base.astro`; check which are actually used.
- **F-22 Dead code**: `isSoon`, `pastExpeditions` (only used in the dead Kailash block), `collectConsoleErrors` test helper, `Categories.astro`/`ProductGrid.astro`/`ProductCard.astro`/`RetreatCard.astro`/`MusicSection.astro` etc. — not referenced from any route in this audit (import graph not exhaustively traced).
- **F-23 `departureDate` precision**: Arunachala has `departureDate: '2026-11-01'` against the display date "November 2026" — an assumed day used for sorting/featuring.
- **F-24 README.md is the Astro template**; CLAUDE.md/DESIGN.md/PRODUCT.md are the real documentation.

## 4. Consistency matrix (key repeated values)

| Fact | Locations | Status |
|---|---|---|
| Kailash group size | data (WT: 15; HEAD: 6), prose "Six people", dead block "Max 6", deployed "Max 6" | **Conflict** |
| Kailash dates | data "20 September 2026"; dead block "September 20–30"; deployed "September 20–30" | Conflict with duration "10 days" ("20–30" = 11 days inclusive) |
| Kailash price | dead block $3,500 / $700; live page "on enquiry" | **Conflict** |
| Annapurna date | data 15–30 May 2027; **confirmed 25 Mar 2027** | **Wrong** |
| Georgia Sep 2026 | retreat (5d, 6–10) vs journey (7d, max 8) | **Conflict** |
| Email | gmail (footer) vs rajuna.com (connect) | **Conflict** |
| Telegram members | "340+" ×2 | Hard-coded |
| Social | Telegram/YouTube/Instagram 200 OK; VK 404 | VK broken |

## 5. Verified facts vs unresolved questions

Verified: route list and build result; all internal `href`/`src` paths in built HTML resolve (0 broken); all `<img>` have `alt`; every page has title + description + `lang="en"`; one `<h1>` on every page except Home; Telegram/YouTube/Instagram URLs return HTTP 200; VK returns 404; deployed `/mountains` differs from HEAD; Annapurna confirmed departure 25 Mar 2027.
Unresolved: see `docs/CONTENT_DECISIONS_REQUIRED.md`.

## 6. Checks performed

| Check | Result |
|---|---|
| `git status`, log, remote, `fetch --dry-run`, `rev-list` | Done (see §1) |
| `astro build` (Node 24, outDir in scratchpad; repo `dist/` untouched) | Pass, 19 pages, 1 route-conflict warning |
| Built-HTML scan: titles, meta, h1, canonical/OG, alt, internal link/asset existence, placeholder strings | Done (script, results above) |
| `astro check` | 1 error (test file), 0 warnings, 1 hint |
| HTTP checks: deployed alias for 5 pages, sitemap, robots, 404; 4 social URLs; DNS for `yakovrajuna.com`, `rajuna.com` | Done |
| **Not run:** Playwright suite and any browser/screenshot | Skipped deliberately: the suite launches a browser and writes screenshots; project memory restricts browser launches to explicit requests. Console errors, responsive layout, focus order, colour contrast and reduced-motion therefore remain **unverified**. |
| **Not run:** Vercel dashboard/CLI, GitHub API, external link check beyond the 4 social URLs, Lighthouse | Unavailable or out of scope |
