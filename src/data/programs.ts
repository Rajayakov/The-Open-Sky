import { isUpcomingDate } from './dates';

export interface Program {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  dateShort: string;
  /** ISO start day. Omitted for rolling enrollment (always current). */
  startDate?: string;
  duration: string;
  format: string;
  /** Omitted until the real limit is confirmed — rows that show it are hidden. */
  groupSize?: string;
  /** Replaces the default Open/Closed/Waitlist label on the hub when the real
   *  application state differs from those three. */
  statusLabel?: string;
  /** Cover photo for announcement cards. */
  cardImage?: string;
  /** Where this program lives, when not the default /programs/<slug>. */
  href?: string;
  /** false = kept in the data but not shown on the hub, homepage or in selectors. */
  listed?: boolean;
  status: 'open' | 'closed' | 'waitlist';
  body: string;
  structure: { phase: string; description: string }[];
  forWhom: string[];
}

export const programs: Program[] = [
  {
    slug: 'presence',
    href: '/programs',
    cardImage: '/images/portrait/yakov-flags.jpg',
    title: 'Присутствие',
    subtitle: 'Возвращение в центр',
    description: 'Закрытый клуб в Telegram: живые практики, ежедневная опора и наставления Якова Раджуны.',
    date: 'Monthly subscription',
    dateShort: 'Monthly',
    duration: '4-week cycle, then it repeats',
    format: '2 live practices per week · daily audio · Telegram club',
    statusLabel: 'Founders price until Nov 30',
    status: 'open',
    body: 'Четырёхнедельная онлайн-программа практики внимания и присутствия.',
    structure: [],
    forWhom: [],
  },
  {
    slug: 'inner-cartography-cohort-4',
    listed: false,
    title: 'Inner Cartography',
    subtitle: 'Cohort 4',
    description: 'An eight-week structured journey through the terrain of identity, purpose, and direction. Live sessions with Yakov, guided practices, intimate cohort.',
    date: 'June 5, 2026',
    startDate: '2026-06-05',
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
    listed: false,
    title: 'The Fire Season',
    subtitle: 'Cohort 2',
    description: 'A twelve-week intensive for people in the middle of a genuine life transition. Combines live sessions, written practice, and one private exchange with Yakov each month.',
    date: 'September 8, 2026',
    startDate: '2026-09-08',
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
    listed: false,
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

/** Programs shown on the hub and homepage. */
export const listedPrograms: Program[] = programs.filter((p) => p.listed !== false);

export function getProgram(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}

/** A program is current while its start day is ahead, or always when
 *  enrollment is rolling (no `startDate`). */
export function isCurrentProgram(p: Program, referenceDate: Date = new Date()): boolean {
  return !p.startDate || isUpcomingDate(p.startDate, referenceDate);
}

export function getCurrentPrograms(
  referenceDate: Date = new Date(),
  list: Program[] = listedPrograms
): Program[] {
  return list.filter((p) => isCurrentProgram(p, referenceDate));
}

export function getPastPrograms(
  referenceDate: Date = new Date(),
  list: Program[] = listedPrograms
): Program[] {
  return list.filter((p) => !isCurrentProgram(p, referenceDate));
}

/** The program to promote: the soonest dated open/waitlist cohort still
 *  ahead, otherwise a rolling-enrollment one. Undefined when none. */
export function getNextOpenProgram(
  referenceDate: Date = new Date(),
  list: Program[] = listedPrograms
): Program | undefined {
  const open = getCurrentPrograms(referenceDate, list).filter((p) => p.status !== 'closed');
  const dated = open
    .filter((p) => p.startDate)
    .sort((a, b) => a.startDate!.localeCompare(b.startDate!));
  return dated[0] ?? open.find((p) => !p.startDate);
}
