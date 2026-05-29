export interface Program {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  dateShort: string;
  duration: string;
  format: string;
  groupSize: string;
  status: 'open' | 'closed' | 'waitlist';
  body: string;
  structure: { phase: string; description: string }[];
  forWhom: string[];
}

export const programs: Program[] = [
  {
    slug: 'inner-cartography-cohort-4',
    title: 'Inner Cartography',
    subtitle: 'Cohort 4',
    description: 'An eight-week structured journey through the terrain of identity, purpose, and direction. Live sessions with Yakov, guided practices, intimate cohort.',
    date: 'June 5, 2026',
    dateShort: 'Jun 5, 2026',
    duration: '8 weeks',
    format: 'Live cohort · 12 participants',
    groupSize: '12 participants',
    status: 'open',
    body: 'Inner Cartography is a structured container for serious inner work. It combines weekly live sessions with Yakov, guided practices between sessions, and a small cohort of people doing real work — not networking, not inspiration-gathering, but honest, difficult inner cartography.',
    structure: [
      { phase: 'Weeks 1–2', description: 'Ground. What is actually happening. Not what you think should be happening.' },
      { phase: 'Weeks 3–4', description: 'Patterns. What keeps recurring and why.' },
      { phase: 'Weeks 5–6', description: 'Direction. What is asking to move.' },
      { phase: 'Weeks 7–8', description: 'Integration. What you carry forward.' },
    ],
    forWhom: [
      'People who have tried other programs and found them too comfortable',
      'Those in genuine transition — not just seeking inspiration',
      'People who can commit 4–5 hours per week to the work',
    ],
  },
  {
    slug: 'fire-season-cohort-2',
    title: 'The Fire Season',
    subtitle: 'Cohort 2',
    description: 'A twelve-week intensive for people in the middle of a genuine life transition. Combines live sessions, written practice, and one private exchange with Yakov each month.',
    date: 'September 8, 2026',
    dateShort: 'Sep 8, 2026',
    duration: '12 weeks',
    format: 'Cohort · 8 participants',
    groupSize: '8 participants',
    status: 'closed',
    body: 'The Fire Season is the deeper container. Fewer people, more time, more intensity. This program is for people who know what they are in the middle of — and who are ready for real accompaniment through it.',
    structure: [
      { phase: 'Month 1', description: 'Orientation. What the fire season is asking of you.' },
      { phase: 'Month 2', description: 'The middle. The part that cannot be skipped.' },
      { phase: 'Month 3', description: 'Emergence. What the fire leaves behind.' },
    ],
    forWhom: [
      'People already in transition — not contemplating one',
      'Those who have done serious inner work before',
      'People who can commit significant time and energy',
    ],
  },
  {
    slug: 'roots-and-direction-open',
    title: 'Roots & Direction',
    subtitle: 'Open enrollment',
    description: 'A six-week introductory program for those new to this kind of work. Pre-recorded teachings, weekly live Q&A, open enrollment.',
    date: 'Rolling enrollment',
    dateShort: 'Rolling start',
    duration: '6 weeks',
    format: 'Self-paced · Open enrollment',
    groupSize: 'Open',
    status: 'open',
    body: 'Roots & Direction is the entry point. It is for people who are curious but not yet certain. It gives a real taste of the work without requiring a significant commitment upfront.',
    structure: [
      { phase: 'Weeks 1–2', description: 'Roots. Where you actually come from.' },
      { phase: 'Weeks 3–4', description: 'Present terrain. What is true now.' },
      { phase: 'Weeks 5–6', description: 'Direction. What wants to move forward.' },
    ],
    forWhom: [
      'People new to this kind of work',
      'Those who cannot commit to a longer program yet',
      'Anyone curious about what this approach actually involves',
    ],
  },
];

export function getProgram(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}

export function getNextOpenProgram(): Program | undefined {
  return programs.find((p) => p.status === 'open' && p.date !== 'Rolling enrollment');
}
