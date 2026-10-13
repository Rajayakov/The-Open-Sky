/* Date-based selection and upcoming-list filtering.
   Pure data tests — no browser. Dates are fixed so they never rot. */
import { test, expect } from '@playwright/test';
import {
  journeys, getJourney, getFeaturedExpedition, getOtherUpcoming, hasDeparted,
  type MountainJourney,
} from '../src/data/mountains';
import { retreats, getUpcomingRetreats, getPastRetreats, getNextRetreat } from '../src/data/retreats';
import { programs, getCurrentPrograms, getPastPrograms, getNextOpenProgram, type Program } from '../src/data/programs';
import { isUpcomingDate } from '../src/data/dates';

const d = (iso: string) => new Date(`${iso}T12:00:00Z`);

const trip = (slug: string, extra: Partial<MountainJourney>): MountainJourney =>
  ({ slug, title: slug, terrain: '', description: '', date: '', dateShort: '', location: '', duration: '',
     status: 'upcoming', upcoming: true, bg: '', ...extra });

const fixtures = [
  trip('past', { departureDate: '2026-09-20' }),
  trip('today', { departureDate: '2026-10-13' }),
  trip('soonest', { departureDate: '2026-12-01' }),
  trip('later', { departureDate: '2027-03-25' }),
  trip('month-only', { departureMonth: '2026-11' }),
  trip('undated', {}),
  trip('archived', { departureDate: '2026-11-15', status: 'past' }),
];

test.describe('isUpcomingDate', () => {
  test('past, present-day and future days', () => {
    expect(isUpcomingDate('2026-10-12', d('2026-10-13'))).toBe(false);
    expect(isUpcomingDate('2026-10-13', d('2026-10-13'))).toBe(true);
    expect(isUpcomingDate('2026-10-14', d('2026-10-13'))).toBe(true);
  });
  test('month-only dates stay upcoming until the month ends', () => {
    expect(isUpcomingDate('2026-09', d('2026-10-13'))).toBe(false);
    expect(isUpcomingDate('2026-10', d('2026-10-31'))).toBe(true);
    expect(isUpcomingDate('2026-11', d('2026-10-13'))).toBe(true);
  });
});

test.describe('featured expedition selection', () => {
  test('earliest future departure wins; past, archived and month-only are skipped', () => {
    expect(getFeaturedExpedition(d('2026-10-01'), fixtures)?.slug).toBe('today');
    expect(getFeaturedExpedition(d('2026-10-14'), fixtures)?.slug).toBe('soonest');
  });
  test('a departure today is still featured; the next day it rolls forward', () => {
    expect(getFeaturedExpedition(d('2026-12-01'), fixtures)?.slug).toBe('soonest');
    expect(getFeaturedExpedition(d('2026-12-02'), fixtures)?.slug).toBe('later');
  });
  test('returns null — never a past journey — when nothing is upcoming', () => {
    expect(getFeaturedExpedition(d('2027-03-26'), fixtures)).toBeNull();
  });
  test('other-upcoming list drops past items and keeps dated ones in order', () => {
    const ref = d('2026-10-14');
    const featured = getFeaturedExpedition(ref, fixtures);
    expect(getOtherUpcoming(featured, ref, fixtures).map((j) => j.slug))
      .toEqual(['month-only', 'later', 'undated']);
    expect(getOtherUpcoming(null, d('2026-12-02'), fixtures).map((j) => j.slug))
      .toEqual(['later', 'undated']); // month-only (Nov) has now expired
  });
  test('hasDeparted mirrors the same rules', () => {
    expect(hasDeparted(fixtures[0], d('2026-10-13'))).toBe(true);
    expect(hasDeparted(fixtures[1], d('2026-10-13'))).toBe(false);
    expect(hasDeparted(fixtures[6], d('2026-10-13'))).toBe(true);
  });
});

test.describe('retreats and programs lists', () => {
  const r = (slug: string, startDate: string) => ({ ...retreats[0], slug, startDate });
  const rs = [r('old', '2026-02'), r('now', '2026-10'), r('next', '2027-01-10')];
  test('retreats split into upcoming and past', () => {
    const ref = d('2026-10-13');
    expect(getUpcomingRetreats(ref, rs).map((x) => x.slug)).toEqual(['now', 'next']);
    expect(getPastRetreats(ref, rs).map((x) => x.slug)).toEqual(['old']);
    expect(getUpcomingRetreats(d('2027-02-01'), rs)).toEqual([]);
  });
  const p = (slug: string, extra: Partial<Program>): Program =>
    ({ ...programs[0], slug, status: 'open', ...extra });
  const ps = [
    p('past-cohort', { startDate: '2026-06-05' }),
    p('rolling', { startDate: undefined }),
    p('future-cohort', { startDate: '2026-12-01' }),
    p('closed-future', { startDate: '2026-11-01', status: 'closed' }),
  ];
  test('programs: past cohorts are excluded, rolling is always current', () => {
    const ref = d('2026-10-13');
    expect(getCurrentPrograms(ref, ps).map((x) => x.slug)).toEqual(['rolling', 'future-cohort', 'closed-future']);
    expect(getPastPrograms(ref, ps).map((x) => x.slug)).toEqual(['past-cohort']);
    expect(getNextOpenProgram(ref, ps)?.slug).toBe('future-cohort');
    expect(getNextOpenProgram(d('2026-12-02'), ps)?.slug).toBe('rolling');
  });
});

test.describe('live data on a fixed reference date (2026-10-13)', () => {
  const ref = d('2026-10-13');
  test('nothing already past is presented as upcoming', () => {
    const featured = getFeaturedExpedition(ref);
    const listed = [featured, ...getOtherUpcoming(featured, ref)].filter(Boolean) as MountainJourney[];
    for (const j of listed) expect(hasDeparted(j, ref), j.slug).toBe(false);
    // Kailash was rescheduled to Sep 2027 (month-only): listed, never featured.
    expect(listed.map((j) => j.slug)).toEqual(['annapurna', 'kailash-2026', 'arunachala-2026']);
    expect(getUpcomingRetreats(ref)).toEqual([]);
    expect(getNextOpenProgram(ref)?.slug).toBe('presence');
  });
  test('Annapurna canonical record', () => {
    const a = getJourney('annapurna')!;
    expect(a.departureDate).toBe('2027-03-25');
    expect(a.duration).toBe('14 days');
    expect(a.groupSize).toBe('Max 8 people');
    expect(getFeaturedExpedition(ref)?.slug).toBe('annapurna');
  });
  test('no removed offering remains in the data', () => {
    const blob = JSON.stringify({ journeys, retreats });
    expect(blob).not.toMatch(/kazbe|georgian/i);
  });
});
