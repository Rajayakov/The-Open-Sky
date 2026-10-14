export function toISODay(referenceDate: Date): string {
  return referenceDate.toISOString().slice(0, 10);
}

export function isUpcomingDate(date: string, referenceDate: Date = new Date()): boolean {
  const day = toISODay(referenceDate);
  return date.length === 7 ? date >= day.slice(0, 7) : date >= day;
}
