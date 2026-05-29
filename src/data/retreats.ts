export interface Retreat {
  slug: string;
  title: string;
  atmosphere: string;
  description: string;
  date: string;
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
    slug: 'mountain-autumn-2026',
    title: 'Five days in the mountains',
    atmosphere: 'High terrain, small group, real conversations.',
    description:
      'A retreat built around walking, ceremony, and the kind of honest exchange that only happens when people are tired enough to stop performing. Set in the Georgian Greater Caucasus.',
    date: 'September 2026',
    location: 'Kazbegi, Georgia',
    duration: '5 Days · 4 Nights',
    groupSize: '6–10 people',
    format: 'Expedition · Ceremony · Group',
    featured: true,
    bg: 'radial-gradient(ellipse 70% 60% at 35% 35%, rgba(255,228,175,0.65), transparent 60%), linear-gradient(160deg, #C19763 0%, #6B4F33 70%, #3A2A18 100%)',
    structure: [
      {
        day: 'Day I',
        description:
          'Arrival. First dinner together. An opening ceremony to mark the beginning of something intentional.',
      },
      {
        day: 'Day II',
        description:
          'A long walk into the mountain. Physical challenge as a way of getting past the social layer. Evening by fire.',
      },
      {
        day: 'Day III',
        description:
          'The hardest day. A ceremony at altitude. Silence. Space for what needs to surface.',
      },
      {
        day: 'Day IV',
        description:
          'Integration. Slower movement. Conversation in pairs and as a group. A meal prepared together.',
      },
      {
        day: 'Day V',
        description:
          'A closing ceremony. Departure without rush. The long drive back feels different from the drive in.',
      },
    ],
    forWhom: [
      'People at a genuine crossroads in their life',
      'Those who have tried therapy, coaching, or self-help and want something more embodied',
      'People who can be physically active for several hours a day',
      'Those who are willing to be honest, even when it is uncomfortable',
    ],
    included: [
      'All accommodation (mountain guesthouses)',
      'All meals — simple, nourishing, shared',
      'All ceremonies and guided sessions',
      'Transport from Tbilisi',
      'Emergency mountain equipment',
    ],
    faq: [
      {
        question: 'Do I need mountaineering experience?',
        answer:
          'No. You need to be comfortable walking 4–6 hours per day on uneven terrain. Fitness matters more than technical skill.',
      },
      {
        question: 'What kind of ceremony is involved?',
        answer:
          'Non-religious, non-dogmatic practices. Fire ceremony, breath work, and structured group process. Nothing will be asked of you that violates your personal beliefs.',
      },
      {
        question: 'How is this different from a hiking trip?',
        answer:
          'The physical journey is a container for the inner one. We walk in order to arrive somewhere internally, not just geographically.',
      },
    ],
  },
  {
    slug: 'winter-stillness-2026',
    title: 'Four days of stillness',
    atmosphere: 'Winter. A house by a frozen lake. Silence as practice.',
    description:
      'A winter retreat focused on stillness, writing, and deliberate rest. For people who need to stop, not to be inspired.',
    date: 'February 2026',
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

export function getFeaturedRetreat(): Retreat | undefined {
  return retreats.find((r) => r.featured);
}
