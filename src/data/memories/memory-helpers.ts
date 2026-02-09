import type { MemoryEvent } from "@types/memory";

// Use current date for dynamic week calculations
const NOW = new Date();

export function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
  );
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

export function getWeekLabel(date: Date): string {
  const nowWeekStart = new Date(NOW);
  nowWeekStart.setDate(NOW.getDate() - NOW.getDay());
  nowWeekStart.setHours(0, 0, 0, 0);

  const dateWeekStart = new Date(date);
  dateWeekStart.setDate(date.getDate() - date.getDay());
  dateWeekStart.setHours(0, 0, 0, 0);

  const diffMs = dateWeekStart.getTime() - nowWeekStart.getTime();
  const weekDiff = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));

  if (weekDiff === 0) return "This Week";
  if (weekDiff === -1) return "Last Week";
  if (weekDiff === 1) return "Next Week";
  if (weekDiff < 0) return `${Math.abs(weekDiff)} Weeks Ago`;
  return `In ${weekDiff} Weeks`;
}

/**
 * Get events grouped by week label
 */
export function getEventsByWeek(
  events: MemoryEvent[],
): Map<string, MemoryEvent[]> {
  const grouped = new Map<string, MemoryEvent[]>();

  // Sort events by date (newest first)
  const sorted = [...events].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  for (const event of sorted) {
    const existing = grouped.get(event.weekLabel) || [];
    grouped.set(event.weekLabel, [...existing, event]);
  }

  return grouped;
}

/**
 * Get unique categories from events
 */
export function getUniqueCategories(events: MemoryEvent[]): string[] {
  const categories = new Set<string>();
  for (const event of events) {
    if (event.category) {
      categories.add(event.category);
    }
  }
  return Array.from(categories).sort();
}

/**
 * Get week date range string (dynamic)
 */
export function getWeekDateRange(weekLabel: string): string {
  // Parse the week label to get offset
  let offset = 0;
  if (weekLabel === "This Week") {
    offset = 0;
  } else if (weekLabel === "Last Week") {
    offset = -1;
  } else if (weekLabel === "Next Week") {
    offset = 1;
  } else if (weekLabel.includes("Weeks Ago")) {
    offset = -parseInt(weekLabel.split(" ")[0], 10);
  } else if (weekLabel.includes("In")) {
    offset = parseInt(weekLabel.split(" ")[1], 10);
  }

  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

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

  return `${startStr} - ${endStr}`;
}

/**
 * Get ordered week labels (most recent first)
 */
export function getOrderedWeekLabels(events: MemoryEvent[]): string[] {
  const weekOrder = ["This Week", "Last Week", "2 Weeks Ago", "3 Weeks Ago"];
  const presentWeeks = new Set(events.map((e) => e.weekLabel));
  return weekOrder.filter((w) => presentWeeks.has(w));
}
