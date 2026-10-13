import { isUpcomingDate } from './dates';

export interface Retreat {
  slug: string;
  title: string;
  atmosphere: string;
  description: string;
  date: string;
  /** ISO date or month (YYYY-MM) — drives upcoming/past; `date` is display only. */
  startDate: string;
  location: string;
  duration: string;
  groupSize: string;
  format: string;
  bg: string;
  featured?: boolean;
  structure: { day: string; description: string }[];
  forWhom: string[];
  included: string[];
  faq: { question: string; answer: string }[];
}

export const retreats: Retreat[] = [
  {
    slug: 'winter-stillness-2026',
    title: 'Four days of stillness',
    atmosphere: 'Winter. A house by a frozen lake. Silence as practice.',
    description:
      'A winter retreat focused on stillness, writing, and deliberate rest. For people who need to stop, not to be inspired.',
    date: 'February 2026',
    startDate: '2026-02',
    location: 'Transcarpathia, Ukraine',
    duration: '4 Days · 3 Nights',
    groupSize: '5–8 people',
    format: 'Contemplative · Writing · Rest',
    featured: false,
    bg: 'radial-gradient(ellipse 60% 50% at 70% 20%, rgba(255,228,175,0.45), transparent 70%), linear-gradient(180deg, #8E6B40 0%, #4A371F 100%)',
    structure: [
      { day: 'Day I', description: 'Arrival. Unpacking. A very simple dinner. Early sleep.' },
      { day: 'Day II', description: 'A day of near-total silence. Morning walk. Afternoon writing. Fire at dusk.' },
      { day: 'Day III', description: 'Conversations begin. One ceremony. Shared reading.' },
      { day: 'Day IV', description: 'Closing. The return.' },
    ],
    forWhom: [
      'People who are exhausted and need real rest',
      'Writers, makers, and thinkers who have lost their thread',
      'Anyone who has been going too fast for too long',
    ],
    included: [
      'Accommodation in a renovated farmhouse',
      'All meals — simple winter food',
      'Guided sessions and ceremony',
      'Books and writing materials',
    ],
    faq: [
      {
        question: 'Will I be expected to share my writing?',
        answer: 'No. Writing is private unless you choose to share. There is no performance component.',
      },
      {
        question: 'What if I cannot handle silence?',
        answer:
          'That is exactly who this retreat is for. The discomfort is the work. You will not be left alone in it.',
      },
    ],
  },
  {
    slug: 'summer-fire-ceremony-2026',
    title: 'Summer fire ceremony',
    atmosphere: 'A solstice gathering. One night. Around fire.',
    description:
      'Not a retreat — a ceremony. A single evening gathering around a fire on the summer solstice. No agenda except what the fire asks for.',
    date: 'June 2026',
    startDate: '2026-06',
    location: 'Georgia (location shared on registration)',
    duration: '1 Evening',
    groupSize: '15–25 people',
    format: 'Ceremony · Fire · Open gathering',
    featured: false,
    bg: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,200,100,0.6), transparent 65%), linear-gradient(170deg, #C99C5C 0%, #4A371F 100%)',
    structure: [
      { day: 'Before dark', description: 'Arrival. Food. Meeting each other without agenda.' },
      { day: 'Dusk', description: 'The fire ceremony begins. Two hours around the fire.' },
      { day: 'After', description: 'Those who wish stay. No one is rushed out.' },
    ],
    forWhom: [
      'Anyone curious about ceremony without joining something',
      'People who have been to larger retreats and want something more direct',
      'Those already in Yakov\'s community who want to meet each other',
    ],
    included: ['Food and drink', 'The ceremony', 'Transport information'],
    faq: [
      {
        question: 'Is this only for people who have worked with Yakov before?',
        answer: 'No. It is open, with limited capacity. First-time participants are welcome.',
      },
    ],
  },
];

export function getRetreat(slug: string): Retreat | undefined {
  return retreats.find((r) => r.slug === slug);
}

export function getUpcomingRetreats(
  referenceDate: Date = new Date(),
  list: Retreat[] = retreats
): Retreat[] {
  return list
    .filter((r) => isUpcomingDate(r.startDate, referenceDate))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getPastRetreats(
  referenceDate: Date = new Date(),
  list: Retreat[] = retreats
): Retreat[] {
  return list
    .filter((r) => !isUpcomingDate(r.startDate, referenceDate))
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/** The next retreat still ahead, or undefined when none is scheduled. */
export function getNextRetreat(referenceDate: Date = new Date()): Retreat | undefined {
  return getUpcomingRetreats(referenceDate)[0];
}
