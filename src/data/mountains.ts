/* ─────────────────────────────────────────────────────
   Mountains data — expeditions and journeys
   ───────────────────────────────────────────────────── */

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
  /** ISO date (YYYY-MM-DD) — the only thing getFeaturedExpedition() sorts by. */
  departureDate?: string;
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
    date: 'September 20, 2026',
    dateShort: 'Sep 20, 2026',
    location: 'Tibet',
    duration: '10 days · 9 nights',
    altitude: '4,800–5,600m',
    groupSize: 'Max 6 people',
    difficulty: 'Demanding',
    status: 'upcoming',
    upcoming: true,
    bg: 'linear-gradient(160deg, #A8C0D8 0%, #4A6888 45%, #1A2C40 100%)',
    heroImage: '/images/mountains/kailash-hero.jpg',
    cardImage: '/images/mountains/kailash-featured.jpg',
    tagline: 'The Abode of Shiva',
    departureDate: '2026-09-20',
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
    date: 'November 2026',
    dateShort: 'Nov 2026',
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
    departureDate: '2026-11-01',
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
      'A multi-day traverse through the Annapurna massif — one of the world\'s most dramatic mountain landscapes. A living mountain: cloud, breath, and movement, not a static summit.',
    date: '15–30 May 2027',
    dateShort: 'May 15, 2027',
    location: 'Annapurna Sanctuary, Nepal',
    duration: '16 days · 15 nights',
    altitude: '1,700–4,130m',
    groupSize: 'Max 10 people',
    difficulty: 'Moderate–Demanding',
    status: 'upcoming',
    upcoming: true,
    bg: 'linear-gradient(160deg, #B8C8D0 0%, #6080A0 45%, #1E3048 100%)',
    heroImage: '/images/mountains/card-3.jpg',
    tagline: 'The Living Mountain',
    departureDate: '2027-05-15',
    structure: [
      { phase: 'Days I–II', description: 'Arrival in Pokhara. Gear check and acclimatisation briefing. First group gathering by the lake.' },
      { phase: 'Days III–VII', description: 'Ascent through rhododendron forest and terraced villages into high alpine terrain. Daily walking, 5–7 hours.' },
      { phase: 'Days VIII–X', description: 'The Sanctuary — a natural amphitheatre of peaks above 7,000m. Rest days, ceremony, and silence at altitude.' },
      { phase: 'Days XI–XV', description: 'Descent by a different route. Changing forest, changing air. Integration begins on the way down.' },
      { phase: 'Day XVI', description: 'Return to Pokhara. Closing circle. Departure.' },
    ],
    forWhom: [
      'People physically prepared for 5–7 hours of daily walking over two weeks',
      'Those drawn to a living, breathing landscape rather than a single summit push',
      'People comfortable with changing weather, cloud, and long unstructured days',
    ],
    included: [
      'All permits (ACAP + TIMS)',
      'Teahouse and lodge accommodation throughout',
      'All meals on route',
      'Guided ceremonies and group process',
      'Local trekking crew and porters',
      'Ground transport between Pokhara and the trailhead',
    ],
  },
  {
    slug: 'georgian-highlands-september-2026',
    title: 'Georgian Highlands',
    terrain: 'Greater Caucasus',
    description:
      'A seven-day traverse through the Greater Caucasus. Physical exertion as a doorway to interior terrain. Small group, high altitude, real conditions.',
    date: 'September 14–20, 2026',
    dateShort: 'Sep 14–20, 2026',
    location: 'Kazbegi region, Georgia',
    duration: '7 days · 6 nights',
    altitude: '2,400–3,500m',
    groupSize: 'Max 8 people',
    difficulty: 'Demanding',
    status: 'past',
    upcoming: false,
    bg: 'linear-gradient(160deg, #C8D0C8 0%, #8A9688 50%, #3A4035 100%)',
    structure: [
      { phase: 'Day I', description: 'Arrival in Tbilisi. Transfer to the mountains. First evening together.' },
      { phase: 'Days II–IV', description: 'Walking 5–7 hours daily. High terrain, changing weather. Evening conversations by fire.' },
      { phase: 'Day V', description: 'The hardest day. A ceremony at altitude. Silence and solitude.' },
      { phase: 'Days VI–VII', description: 'Descent. Integration. Return to Tbilisi at your own pace.' },
    ],
    forWhom: [
      'People physically fit enough to walk 5–7 hours per day on rough terrain',
      'Those who need interior movement as much as exterior challenge',
      'People comfortable with discomfort, uncertainty, and genuine exertion',
    ],
    included: [
      'Mountain guesthouse accommodation',
      'All meals on the route',
      'Guided ceremonies and group process',
      'Transport from Tbilisi and back',
      'Emergency mountain equipment',
    ],
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

export function getNextJourney(): MountainJourney | undefined {
  return journeys.find((j) => j.status === 'upcoming');
}

/** The single source of truth for "which expedition is featured right now" —
 *  the nearest open-for-applications departure, sorted automatically by
 *  date. Never hardcode a destination; this is what both the Hero Card and
 *  the Featured Expedition section on /mountains consume. */
export function getFeaturedExpedition(referenceDate: Date = new Date()): MountainJourney | null {
  const open = journeys.filter(
    (j): j is MountainJourney & { departureDate: string } =>
      j.status === 'upcoming' && !!j.departureDate
  );
  const upcoming = open.filter((j) => new Date(j.departureDate) >= referenceDate);
  const pool = upcoming.length > 0 ? upcoming : open;
  return (
    [...pool].sort(
      (a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
    )[0] ?? null
  );
}

/** Every open expedition except the currently featured one. */
export function getOtherUpcoming(featured: MountainJourney | null): MountainJourney[] {
  return journeys.filter((j) => j.status === 'upcoming' && j.slug !== featured?.slug);
}
