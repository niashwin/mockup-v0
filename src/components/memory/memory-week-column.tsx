import { motion } from "motion/react";
import { cn } from "@lib/utils";
import { MemoryEventCard } from "./memory-event-card";
import { getWeekDateRange } from "@data/memories";
import type { MemoryEvent } from "@types/memory";

/**
 * Memory Week Column
 *
 * A single column in the horizontal timeline representing one week.
 * Contains a header with week label and date range, plus stacked event cards.
 */

interface MemoryWeekColumnProps {
  weekLabel: string;
  events: MemoryEvent[];
  isCurrentWeek?: boolean;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

export function MemoryWeekColumn({
  weekLabel,
  events,
  isCurrentWeek = false,
}: MemoryWeekColumnProps) {
  const dateRange = getWeekDateRange(weekLabel);

  return (
    <div
      className={cn(
        "w-72 shrink-0 flex flex-col",
        "rounded-xl p-4",
        isCurrentWeek
          ? "bg-accent-muted/30 ring-1 ring-accent/20"
          : "bg-muted/30",
      )}
    >
      {/* Week Header */}
      <header className="mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm text-foreground">{weekLabel}</h3>
          {isCurrentWeek && (
            <span className="px-1.5 py-0.5 rounded text-micro font-medium bg-accent text-accent-foreground">
              Now
            </span>
          )}
        </div>
        {dateRange && (
          <p className="text-caption text-muted-foreground mt-0.5">
            {dateRange}
          </p>
        )}
      </header>

      {/* Event Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3 flex-1"
      >
        {events.map((event) => (
          <motion.div key={event.id} variants={staggerItem}>
            <MemoryEventCard event={event} />
          </motion.div>
        ))}

        {events.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-caption text-muted-foreground/50 py-8">
            No events this week
          </div>
        )}
      </motion.div>
    </div>
  );
}
