export interface MountainJourney {
  slug: string;
  title: string;
  terrain: string;
  description: string;
  date: string;
  dateShort: string;
  location: string;
  duration: string;
  altitude: string;
  groupSize: string;
  difficulty: string;
  upcoming: boolean;
  bg: string;
  structure: { phase: string; description: string }[];
  forWhom: string[];
  included: string[];
}

export const journeys: MountainJourney[] = [
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
    upcoming: true,
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
    date: 'July 2026 — dates TBC',
    dateShort: 'July 2026',
    location: 'Kaçkar Mountains, Turkey',
    duration: '6 days · 5 nights',
    altitude: '1,800–3,200m',
    groupSize: 'Max 8 people',
    difficulty: 'Moderate–Demanding',
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

export function getJourney(slug: string): MountainJourney | undefined {
  return journeys.find((j) => j.slug === slug);
}

export function getNextJourney(): MountainJourney | undefined {
  return journeys.find((j) => j.upcoming);
}
