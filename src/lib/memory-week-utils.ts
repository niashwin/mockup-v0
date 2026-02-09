/**
 * Memory Week Utilities
 *
 * Functions for generating and mapping weeks in the memory timeline.
 */

import type { WeekData } from "@lib/memory-constants";

/**
 * Generate week labels for the 17-week range (8 past + current + 8 future).
 */
export function generateWeekRange(): WeekData[] {
  const weeks: WeekData[] = [];

  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
  currentWeekStart.setHours(0, 0, 0, 0);

  // Generate 8 weeks in the past + current week + 8 weeks in the future = 17 weeks
  for (let offset = -8; offset <= 8; offset++) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() + offset * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const startStr = weekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = weekEnd.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    let label: string;
    if (offset === 0) {
      label = "This Week";
    } else if (offset === -1) {
      label = "Last Week";
    } else if (offset === 1) {
      label = "Next Week";
    } else if (offset < 0) {
      label = `${Math.abs(offset)} Weeks Ago`;
    } else {
      label = `In ${offset} Weeks`;
    }

    weeks.push({
      label,
      dateRange: `${startStr} - ${endStr}`,
      weekOffset: offset,
      isCurrentWeek: offset === 0,
      isFuture: offset > 0,
    });
  }

  return weeks;
}

/**
 * Map an event date to its week offset relative to the current week.
 */
export function getWeekOffset(eventDate: Date): number {
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  const eventWeekStart = new Date(eventDate);
  eventWeekStart.setDate(eventDate.getDate() - eventDate.getDay());
  eventWeekStart.setHours(0, 0, 0, 0);

  const diffMs = eventWeekStart.getTime() - currentWeekStart.getTime();
  return Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
}
