import { memo } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CircleIcon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { MemoryTimelineCard } from "./memory-timeline-card";
import type { WeekData } from "@lib/memory-constants";
import type { MemoryEvent } from "@types/memory";

/**
 * Timeline Week Column
 *
 * A single column in the swimlane-style memory timeline.
 * Renders a week header with label/date range, plus stacked event cards.
 * Supports zoom scaling for font sizes and spacing.
 */

interface TimelineWeekColumnProps {
  weekData: WeekData;
  events: MemoryEvent[];
  isLast: boolean;
  columnWidth: number;
  zoomLevel: number;
}

export const TimelineWeekColumn = memo(function TimelineWeekColumn({
  weekData,
  events,
  isLast,
  columnWidth,
  zoomLevel,
}: TimelineWeekColumnProps) {
  return (
    <div
      className={cn(
        "shrink-0 flex flex-col h-full",
        // Add solid border between weeks
        !isLast && "border-r border-border/40",
      )}
      style={{ width: columnWidth }}
    >
      {/* Week Header */}
      <div
        className={cn(
          "px-3 py-3 text-center border-b shrink-0",
          weekData.isCurrentWeek
            ? "bg-accent/5 border-accent/20"
            : weekData.isFuture
              ? "bg-muted/20 border-border/20"
              : "border-border/30",
        )}
      >
        <div className="flex items-center justify-center gap-1.5">
          {weekData.isCurrentWeek && (
            <HugeiconsIcon
              icon={CircleIcon}
              size={8}
              strokeWidth={1.5}
              className="fill-accent text-accent animate-pulse"
            />
          )}
          <p
            className={cn(
              "font-semibold uppercase tracking-wider",
              weekData.isCurrentWeek
                ? "text-accent"
                : weekData.isFuture
                  ? "text-muted-foreground/50"
                  : "text-muted-foreground/70",
            )}
            style={{ fontSize: `${10 * zoomLevel}px` }}
          >
            {weekData.label}
          </p>
        </div>
        <p
          className={cn(
            "mt-0.5",
            weekData.isCurrentWeek
              ? "text-accent/70"
              : "text-muted-foreground/40",
          )}
          style={{ fontSize: `${9 * zoomLevel}px` }}
        >
          {weekData.dateRange}
        </p>
      </div>

      {/* Events Column */}
      <div
        className={cn(
          "flex-1 flex flex-col items-center py-4 px-2 overflow-y-auto",
          weekData.isFuture && "opacity-70",
        )}
        style={{ gap: Math.round(12 * zoomLevel) }}
      >
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.04,
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <MemoryTimelineCard event={event} zoomLevel={zoomLevel} />
          </motion.div>
        ))}
        {events.length === 0 && (
          <p
            className="text-muted-foreground/30 italic py-8"
            style={{ fontSize: `${11 * zoomLevel}px` }}
          >
            No events
          </p>
        )}
      </div>
    </div>
  );
});
