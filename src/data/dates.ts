/* ─────────────────────────────────────────────────────
   Date eligibility — the one place that decides whether
   something is still ahead of us.

   Data stores dates as ISO strings with an explicit precision:
     'YYYY-MM-DD'  a confirmed day
     'YYYY-MM'     only the month is known (never invent a day)
   Both compare against the reference date's UTC calendar day/month,
   so an event on today's date — or in the current month for a
   month-only date — is still upcoming.
   ───────────────────────────────────────────────────── */

export function toISODay(referenceDate: Date): string {
  return referenceDate.toISOString().slice(0, 10);
}

export function isUpcomingDate(date: string, referenceDate: Date = new Date()): boolean {
  const day = toISODay(referenceDate);
  return date.length === 7 ? date >= day.slice(0, 7) : date >= day;
}
