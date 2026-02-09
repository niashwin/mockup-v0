import { daysAgo } from "@lib/mock-date-helpers";

const NOW = new Date(2026, 1, 2); // Feb 2, 2026

export function weeksAgo(weeks: number): Date {
  return daysAgo(weeks * 7);
}

export function monthsAgo(months: number): Date {
  const date = new Date(NOW);
  date.setMonth(date.getMonth() - months);
  return date;
}

export { daysAgo };
