/* ─────────────────────────────────────────────────────
   Mountains data — expeditions and journeys
   ───────────────────────────────────────────────────── */

import { isUpcomingDate } from './dates';

/* ── Detailed journey (powers slug pages) ──────────── */

export interface MountainJourney {
  slug: string;
  title: string;
  terrain: string;
  description: string;
  date: string;
  dateShort: string;
  location: string;
  duration: string;
  altitude?: string;
  groupSize?: string;
  difficulty?: string;
  status: 'upcoming' | 'soon' | 'past';
  upcoming: boolean;
  bg: string;
  heroImage?: string;
  /** Tighter crop for the small floating Hero Card / Upcoming card thumbnails.
   *  Falls back to heroImage when a destination has no separate crop. */
  cardImage?: string;
  /** Short evocative line shown under the title on the Hero Card and the
   *  Featured Expedition section (e.g. "The Abode of Shiva"). */
  tagline?: string;
  /** Booking-state badge shown on the Schedule cards ("Open now" /
   *  "Coming Soon"). Deliberately separate from `status`, which drives
   *  list membership (getFeaturedExpedition/getOtherUpcoming both require
   *  status === 'upcoming') — a journey can be upcoming-and-listed while
   *  its dates or booking are still being finalised. Defaults to 'open'
   *  when omitted. */
  badge?: 'open' | 'soon';
  /** ISO date (YYYY-MM-DD), confirmed departures only — what the selectors sort by.
   *  Leave unset while the exact day is unconfirmed. */
  departureDate?: string;
  /** ISO month (YYYY-MM) — used only when the exact day is unconfirmed. Keeps
   *  the journey listed until that month ends; never makes it featured. */
  departureMonth?: string;
  structure?: { phase: string; description: string }[];
  forWhom?: string[];
  included?: string[];
}

export const journeys: MountainJourney[] = [
  {
    slug: 'kailash-2026',
    title: 'Kailash',
    terrain: 'Tibet',
    description:
      'Ten days around Mount Kailash — the sacred axis of the world. A kora at altitude through one of the most remote landscapes on earth.',
    date: 'September 2027',
    dateShort: 'Sep 2027',
    location: 'Tibet',
    duration: '10 days · 9 nights',
    altitude: '4,800–5,600m',
    groupSize: 'Max 15 people',
    difficulty: 'Demanding',
    status: 'upcoming',
    upcoming: true,
    bg: 'linear-gradient(160deg, #A8C0D8 0%, #4A6888 45%, #1A2C40 100%)',
    heroImage: '/images/mountains/kailash-hero-sunset.jpg',
    cardImage: '/images/mountains/kailash-featured.jpg',
    tagline: 'The Abode of Shiva',
    departureMonth: '2027-09',
    structure: [
      { phase: 'Days I–II', description: 'Arrival and acclimatisation. Lhasa or Kathmandu. First group gathering.' },
      { phase: 'Days III–IV', description: 'Transfer to the mountain. First encounter with Kailash. Preparation.' },
      { phase: 'Days V–VII', description: 'The kora — three days of circumambulation. High passes. Silence.' },
      { phase: 'Days VIII–X', description: 'Integration. Return journey. Closing ceremony.' },
    ],
    forWhom: [
      'People physically prepared for multi-day trekking at altitude above 5,000m',
      'Those drawn to pilgrimage as a form of inner work, not religious tourism',
      'People comfortable with remoteness, uncertainty, and extended silence',
    ],
    included: [
      'All permits and Tibet travel documents',
      'Accommodation throughout',
      'All meals on route',
      'Guided ceremonies and group process',
      'Emergency oxygen and altitude support',
      'Ground transport within Tibet',
    ],
  },
  {
    slug: 'arunachala-2026',
    title: 'Arunachala',
    terrain: 'Tamil Nadu, India',
    description:
      'A pilgrimage to Arunachala — the sacred mountain of southern India, embodiment of Shiva as pure light. Girivalam, silence, and inner fire.',
    date: 'November 2027',
    dateShort: 'Nov 2027',
    location: 'Tiruvannamalai, India',
    duration: '7 days · 6 nights',
    altitude: '800m',
    groupSize: 'Max 8 people',
    difficulty: 'Accessible',
    status: 'upcoming',
    upcoming: false,
    bg: 'linear-gradient(160deg, #D4A87A 0%, #8C5A3A 50%, #3A1E12 100%)',
    heroImage: '/images/mountains/arunachala-featured.jpg',
    tagline: 'The Mountain of Fire',
    badge: 'open',
    departureMonth: '2027-11',
    structure: [
      { phase: 'Days I–II', description: 'Arrival. First encounter with the mountain. Setting intention.' },
      { phase: 'Days III–V', description: 'Daily girivalam — circumambulation of the mountain. Early morning walks. Evening silence.' },
      { phase: 'Days VI–VII', description: 'Deep rest. Closing ceremony. Departure.' },
    ],
    forWhom: [
      'Those drawn to the south Indian pilgrimage tradition',
      'People seeking stillness rather than physical challenge',
      'Open to any background — no prior practice required',
    ],
    included: [
      'Accommodation in guesthouse near the mountain',
      'All meals',
      'Guided morning and evening practices',
      'Local transport',
    ],
  },
  {
    slug: 'annapurna',
    title: 'Annapurna',
    terrain: 'Nepal',
    description:
      'A fourteen-day pilgrimage to Muktinath through the Annapurna region — one of the world\'s most dramatic mountain landscapes. A living mountain: cloud, breath, and movement, not a static summit.',
    date: '25 March 2027',
    dateShort: 'Mar 25, 2027',
    location: 'Annapurna, Nepal',
    duration: '14 days',
    altitude: 'Up to 3,800m',
    groupSize: 'Max 8 people',
    status: 'upcoming',
    upcoming: true,
    bg: 'linear-gradient(160deg, #B8C8D0 0%, #6080A0 45%, #1E3048 100%)',
    heroImage: '/images/mountains/card-3.jpg',
    tagline: 'The Living Mountain',
    badge: 'soon',
    departureDate: '2027-03-25',
  },
  {
    slug: 'pontic-alps-july-2026',
    title: 'Pontic Alps',
    terrain: 'Eastern Turkey',
    description:
      'A six-day traverse through the lesser-known Pontic mountain range in eastern Turkey. Dense forest, high meadows, ancient routes.',
    date: 'July 2026',
    dateShort: 'July 2026',
    location: 'Kaçkar Mountains, Turkey',
    duration: '6 days · 5 nights',
    altitude: '1,800–3,200m',
    groupSize: 'Max 8 people',
    difficulty: 'Moderate–Demanding',
    status: 'past',
    upcoming: false,
    bg: 'linear-gradient(160deg, #B8A888 0%, #706050 55%, #352820 100%)',
    structure: [
      { phase: 'Day I', description: 'Arrival. Village guesthouse. Opening the journey.' },
      { phase: 'Days II–V', description: 'Daily treks through dense forest and high meadow.' },
      { phase: 'Day VI', description: 'Descent and closing. Return.' },
    ],
    forWhom: [
      'People who want less-visited terrain',
      'Those looking for a slightly more accessible mountain journey',
    ],
    included: [
      'Local guesthouse accommodation',
      'All meals',
      'Guided group work',
      'Transport from Istanbul or Trabzon',
    ],
  },
];

/* ── Index page — past expedition gallery ───────────── */

export interface PastExpedition {
  id: string;
  name: string;
  region: string;
  summary: string;
  bg: string;
}

export const pastExpeditions: PastExpedition[] = [
  {
    id: 'mardi-himal',
    name: 'Mardi Himal',
    region: 'Nepal',
    summary: 'A high-altitude traverse above the clouds. Seven days on the ridge between sky and earth.',
    bg: 'linear-gradient(160deg, #7898B8 0%, #3A5878 50%, #18283A 100%)',
  },
  {
    id: 'himalayas',
    name: 'Himalayas',
    region: 'Nepal',
    summary: 'The world\'s highest mountain range as initiation. A journey that remaps the interior landscape.',
    bg: 'linear-gradient(160deg, #A0B4C8 0%, #506880 50%, #1E2C3A 100%)',
  },
  {
    id: 'nepal-2024',
    name: 'Nepal',
    region: 'Nepal',
    summary: 'Sacred valleys and ancient routes through the roof of the world. Group of seven, twelve days.',
    bg: 'linear-gradient(160deg, #8898A8 0%, #4A6078 50%, #1A2A38 100%)',
  },
  {
    id: 'india-2024',
    name: 'India',
    region: 'South India',
    summary: 'Southern pilgrimage through Arunachala and the Deccan highlands. Fire, silence, and earth.',
    bg: 'linear-gradient(160deg, #C8A07A 0%, #7A5040 50%, #302018 100%)',
  },
];

/* ── Helpers ─────────────────────────────────────────── */

export function getJourney(slug: string): MountainJourney | undefined {
  return journeys.find((j) => j.slug === slug);
}

/** Open (status 'upcoming'), still ahead of the reference date. A confirmed
 *  `departureDate` is used when present, otherwise `departureMonth`; a journey
 *  with neither is treated as undated and stays listed. */
export function isListedUpcoming(j: MountainJourney, referenceDate: Date = new Date()): boolean {
  if (j.status !== 'upcoming') return false;
  const when = j.departureDate ?? j.departureMonth;
  return !when || isUpcomingDate(when, referenceDate);
}

/** True when the journey is over: marked past, or its date has gone by. */
export function hasDeparted(j: MountainJourney, referenceDate: Date = new Date()): boolean {
  return j.status === 'past' || !isListedUpcoming(j, referenceDate);
}

/** Eligible to be *featured*: open, with a confirmed exact departure day that
 *  is not in the past. Month-only dates are never featured (never invent a day). */
export function isUpcomingWithDate(
  j: MountainJourney,
  referenceDate: Date = new Date()
): j is MountainJourney & { departureDate: string } {
  return j.status === 'upcoming' && !!j.departureDate && isUpcomingDate(j.departureDate, referenceDate);
}

/** The single source of truth for "which expedition is featured right now" —
 *  the earliest future confirmed `departureDate` among eligible journeys.
 *  Consumed by the homepage featured card and the Mountains page. Returns
 *  null when nothing qualifies (it never falls back to a past journey). */
export function getFeaturedExpedition(
  referenceDate: Date = new Date(),
  list: MountainJourney[] = journeys
): MountainJourney | null {
  return (
    list
      .filter((j) => isUpcomingWithDate(j, referenceDate))
      .sort((a, b) => a.departureDate.localeCompare(b.departureDate))[0] ?? null
  );
}

/** Every other upcoming expedition, soonest first (undated/month-only ones
 *  sort by their month, then fully undated last). Past ones are excluded. */
export function getOtherUpcoming(
  featured: MountainJourney | null,
  referenceDate: Date = new Date(),
  list: MountainJourney[] = journeys
): MountainJourney[] {
  const key = (j: MountainJourney) => j.departureDate ?? j.departureMonth;
  return list
    .filter((j) => j.slug !== featured?.slug && isListedUpcoming(j, referenceDate))
    .sort((a, b) => {
      const ka = key(a);
      const kb = key(b);
      if (!ka) return 1;
      if (!kb) return -1;
      return ka.localeCompare(kb);
    });
}
