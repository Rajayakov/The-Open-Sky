# CONTENT DECISIONS REQUIRED — The Open Sky

Only items that cannot be established from code or from the one confirmed fact (**Annapurna departs 25 March 2027**). Audit date 2026-10-13. Finding references (F-xx) point to `docs/SITE_AUDIT.md`.

Already settled — **not** questions: Annapurna `departureDate` becomes `2027-03-25`; events whose date has passed are treated as past; placeholder blocks with no real content are removed rather than filled.

---

### D-1 — Annapurna: end date, duration, route, group size
- **Question:** What are the end date (or number of days), route and maximum group for the 25 March 2027 Annapurna departure?
- **Conflict:** Site says `15–30 May 2027`, 16 days / 15 nights, Annapurna Sanctuary (Pokhara), Max 10, 1,700–4,130 m, with a 5-phase itinerary. `context/docs/Projects_AI_Optimized.md` says Annapurna-Muktinath, 14–21 days, max 8, starts Kathmandu, up to 3,800 m (and "May 2026").
- **Affects:** `/mountains` schedule card and sort order, `/mountains/annapurna`, `departureDate` logic, Event metadata.
- **Recommended default:** show only "25 March 2027" (start date) and hide duration/itinerary-specific claims until confirmed; keep status "Coming soon".
- **If unresolved:** the page shows either a start date with no duration, or the old unconfirmed 16-day/Sanctuary details beside a new date — an internally inconsistent offer.

### D-2 — What is actually next after Arunachala, and what are the real dates of the 2026 events?
- **Question:** For each 2026 event still shown — Arunachala (Nov 2026), retreat *Five days in the mountains* (Sep 2026), Kailash (20 Sep 2026), Inner Cartography Cohort 4 (5 Jun 2026) — did it run, and what is the next real date for each?
- **Conflict:** Home, `/retreats`, `/programs` and `/mountains/kailash-2026` present them as upcoming/open; today is 2026-10-13. Arunachala has only "November 2026" (code assumes 1 Nov).
- **Affects:** Home "Upcoming experiences", retreat/program hubs, Kailash page CTA, Arunachala featured status.
- **Recommended default:** treat anything dated before today as past; feature Arunachala only if the owner confirms an exact November date and that it is open; otherwise show Annapurna (25 Mar 2027).
- **If unresolved:** home keeps inviting visitors to events that have already taken place.

### D-3 — Is "Five days in the mountains" the same event as "Georgian Highlands"?
- **Question:** Are the Kazbegi retreat (Sep 2026, 5 days, 6–10 people) and the Georgian Highlands journey (14–20 Sep 2026, 7 days, max 8) one event or two? Which numbers are right, and are both still part of the programme?
- **Conflict:** Same region and month, different duration and capacity, stored in two data files and shown under two hubs; the journey also overlaps Kailash (20 Sep).
- **Affects:** `/retreats`, `/retreats/mountain-autumn-2026`, `/mountains/georgian-highlands-september-2026`, Home featured retreat, `FeaturedExperience`.
- **Recommended default:** none — evidence does not support one.
- **If unresolved:** two pages describe the same trip with contradictory facts; one of the two stays marked "upcoming".

### D-4 — Kailash 2026: group size, price disclosure, places
- **Question:** (a) Maximum group: 6 or 15? (b) May $3,500 / $700 deposit be published, or stay "on enquiry"? (c) Is "places remaining" something you will maintain? (d) Did Kailash run on 20 Sep 2026, and is there a 2027 departure?
- **Conflict:** Uncommitted data says `Max 15`; HEAD and deployed say `Max 6`; body copy says "Six people"; dead template code says $3,500, $700 deposit, "4 places remaining", "20–30 September"; live page says "Investment on enquiry".
- **Affects:** `/mountains/kailash-2026`, deployed `/mountains`, deletion of the dead block (F-05).
- **Recommended default:** keep "Investment on enquiry", show no places-remaining counter; group size per owner answer, copy generated from it.
- **If unresolved:** hero/FAQ say one number, body another; unapproved price/scarcity text remains one rename away from going live.

### D-5 — Single contact address, and email vs form
- **Question:** Which address receives enquiries — `rajunayakov@gmail.com` or `yakov@rajuna.com`? Is `mailto:` enough, or do you want an on-site form?
- **Conflict:** Footer uses gmail; `/connect` uses rajuna.com (DNS shows an Outlook MX, mailbox status unknown).
- **Affects:** Footer, `/connect`, prefilled email body with source tag, any form.
- **Recommended default:** the address you actually read daily; keep mailto (matches the "no forms" voice of the copy).
- **If unresolved:** enquiries split across two inboxes; one may be unmonitored.

### D-6 — Are the Kailash-page testimonials real and approved?
- **Question:** Do "Elena K. (Moscow, Mardi Himal 2025)", "David M. (Berlin, Georgian Highlands 2024)" and "Maria T. (Tbilisi, Pontic Alps 2024)" exist, with permission, with these years?
- **Conflict:** the data lists Georgian Highlands (Sep 2026) and Pontic Alps (Jul 2026) as 2026 expeditions; Mardi Himal is "seven days" in one place and "12 participants" in another.
- **Affects:** `/mountains/kailash-2026`; chapter testimonials on Home (`TestimonialBlock`) should be checked the same way.
- **Recommended default:** remove any quote you cannot confirm; do not alter attributions.
- **If unresolved:** unverifiable social proof stays on the most important page.

### D-7 — Status of past expeditions and their pages
- **Question:** Should Georgian Highlands, Pontic Alps and the pre-2026 expeditions (Mardi Himal, Himalayas, Nepal 2024, India 2024) be shown publicly as "past", and with which facts (year, participants)?
- **Conflict:** pages exist but have placeholder sections and a wrong "announced soon" CTA; the old "Past expeditions" block exists in the deployed hub but not in the local code; `pastExpeditions` data conflicts with other text.
- **Affects:** `/mountains` (past section), two detail pages.
- **Recommended default:** a short past section with name, region, year only; unpublish detail pages for events with no real content.
- **If unresolved:** orphan pages with placeholders remain reachable.

### D-8 — Is VK an official channel?
- **Question:** Keep VK (correct URL?) or remove it?
- **Conflict:** `https://vk.com/yakovrajuna` returns 404; CLAUDE.md lists only Telegram, Instagram, YouTube, Email.
- **Affects:** Home "Connect" grid.
- **Recommended default:** remove until a working URL is supplied.
- **If unresolved:** a visible dead link on Home.

### D-9 — Which version is canonical for deployment?
- **Question:** Should the uncommitted working tree (and unpushed `a9527a8`) replace what is at `the-open-sky.vercel.app`, and what is the production domain (`yakovrajuna.com` does not resolve from this machine)?
- **Conflict:** local HEAD ≠ `origin/main` ≠ deployed `/mountains`.
- **Affects:** every deployment/testing step; implementation cannot be validated against a known baseline.
- **Recommended default:** commit the working tree on a branch after D-4 is answered; keep production untouched until approved.
- **If unresolved:** changes may be compared against, or deployed over, an unknown baseline.

### D-10 — Counts and claims that need an owner source
- **Question:** Keep "340+ members" / "Over 340 people" for Telegram (a number you will update), and "4–6 retreats per year" / "Fifteen years" on About? Are the Spotify, Apple Music and Bandcamp profiles real (links)? Is a Russian-language version planned?
- **Conflict:** numbers are hard-coded in 3 places; the Music page lists platforms with no links; the retreat chapter copy ("five to eight days") disagrees with the data (1, 4, 5 days).
- **Affects:** Home, `/connect`, `/music`, `/about`, retreat chapter copy.
- **Recommended default:** drop the member count (or keep it as one maintained value); list only platforms with a real URL; keep English only.
- **If unresolved:** stale numbers and unlinked "where to listen" entries remain.
