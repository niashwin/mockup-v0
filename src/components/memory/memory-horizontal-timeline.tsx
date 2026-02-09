import { useRef, useCallback } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@components/ui/button";
import { MemoryTimelineCard } from "./memory-timeline-card";
import { useMemoryStore } from "@stores/memory-store";

/**
 * Memory Horizontal Timeline
 *
 * A swimlane-style horizontal scrolling timeline showing events chronologically.
 * Features:
 * - Left-to-right flow (oldest to newest)
 * - Colored left border per event type
 * - Smooth horizontal scrolling with navigation buttons
 * - Current week highlighted
 *
 * Inspired by the Swimlanes/Program timelines reference image.
 */

export function MemoryHorizontalTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const getFilteredEvents = useMemoryStore((state) => state.getFilteredEvents);
  const events = getFilteredEvents();

  // Sort events by date (oldest first for left-to-right timeline)
  const sortedEvents = [...events].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  }, []);

  const scrollToEnd = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, []);

  if (sortedEvents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface/30">
        <div className="text-center">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={48}
            className="mx-auto mb-4 text-muted-foreground/20"
            strokeWidth={1}
          />
          <p className="text-muted-foreground font-medium">No events found</p>
          <p className="text-sm text-muted-foreground/50 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface/20">
      {/* Timeline Label */}
      <div className="px-6 pt-4 pb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
          Timeline
        </h3>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollLeft}
            className="p-1.5 rounded-[var(--radius-md)] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="p-1.5 rounded-[var(--radius-md)] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>

      {/* Scrollable Timeline */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden px-6 pb-6"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--color-border) transparent",
        }}
      >
        <div className="flex gap-4 h-full min-w-max py-2">
          {sortedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.03,
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <MemoryTimelineCard event={event} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Today Button - Floating */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 right-6"
      >
        <Button
          variant="default"
          size="sm"
          onClick={scrollToEnd}
          className="shadow-lg"
        >
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={16}
            strokeWidth={1.5}
            className="mr-2"
          />
          Today
        </Button>
      </motion.div>
    </div>
  );
}
