/* ─────────────────────────────────────────────────────
   Connect source attribution — maps every CTA's `source`
   query-param code to a human-readable label shown wherever
   a /connect submission lands (currently: the prefilled
   email body).
   ───────────────────────────────────────────────────── */

import { journeys } from './mountains';
import { retreats } from './retreats';
import { programs } from './programs';

const STATIC_SOURCES: Record<string, string> = {
  nav_header: 'Navigation → Header',
  nav_drawer: 'Navigation → Mobile Menu',
  footer_connect: 'Footer → Connect Link',
  home_mentorship_banner: 'Home → Mentorship Banner',
  home_connect_grid: 'Home → Connect Grid',
  about_cta: 'About → Closing CTA',
  music_cta: 'Music → Closing CTA',
  mentorship_cta: 'Mentorship → Closing CTA',
  programs_hub_cta: 'Programs → Closing CTA',
  retreats_hub_cta: 'Retreats → Closing CTA',
  mountains_hub_kailash_apply: 'Mountains Hub → Kailash Feature',
  mountains_hub_footer: 'Mountains Hub → Closing CTA',
  mountains_hub_past_1: 'Mountains Hub → Past Expedition Card 1',
  mountains_hub_past_2: 'Mountains Hub → Past Expedition Card 2',
  kailash2026_apply: 'Kailash 2026 → Final Apply',
};

const DYNAMIC_SOURCES: Record<string, string> = {};

journeys.forEach((j) => {
  DYNAMIC_SOURCES[`${j.slug}_apply`] = `${j.title} → Apply`;
});

retreats.forEach((r) => {
  DYNAMIC_SOURCES[`retreat_${r.slug}_cta`] = `${r.title} → Closing CTA`;
});

programs.forEach((p) => {
  DYNAMIC_SOURCES[`program_${p.slug}_overview`] = `${p.title} → Overview CTA`;
  DYNAMIC_SOURCES[`program_${p.slug}_cta`] = `${p.title} → Closing CTA`;
});

export const CONNECT_SOURCES: Record<string, string> = {
  ...STATIC_SOURCES,
  ...DYNAMIC_SOURCES,
};

export const DEFAULT_SOURCE_LABEL = 'Direct visit / untagged';

export function getSourceLabel(code: string | null | undefined): string {
  if (!code) return DEFAULT_SOURCE_LABEL;
  return CONNECT_SOURCES[code] ?? DEFAULT_SOURCE_LABEL;
}
