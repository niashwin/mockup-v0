import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { formatRelativeTime } from "@lib/date-utils";
import { Input } from "@components/ui/input";
import { eventTypeConfig, type MemoryEvent } from "@types/memory";
import {
  useMemoryStore,
  useIsWeekExpanded,
  useIsEventSelected,
} from "@stores/memory-store";

/**
 * Memory Sidebar
 *
 * Left sidebar (220px) with:
 * - Search input at top
 * - Collapsible week sections
 * - Event items with type dot, title, and time
 *
 * Clicking an item scrolls the timeline and highlights the card.
 */

interface SidebarEventItemProps {
  event: MemoryEvent;
}

function SidebarEventItem({ event }: SidebarEventItemProps) {
  const isSelected = useIsEventSelected(event.id);
  const selectEvent = useMemoryStore((state) => state.selectEvent);
  const typeConfig = eventTypeConfig[event.type];

  const handleClick = () => {
    selectEvent(event.id);
    // Scroll to the event card in the timeline
    // The timeline will handle the scroll based on selection
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-[var(--radius-md)]",
        "transition-colors duration-150",
        isSelected
          ? "bg-accent-muted text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-2">
        {/* Type indicator dot */}
        <span
          className={cn("size-2 rounded-full shrink-0 mt-1.5", typeConfig.dot)}
        />

        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="text-caption font-medium truncate">{event.title}</p>

          {/* Time */}
          <p className="text-micro text-muted-foreground/60 tabular-nums">
            {formatRelativeTime(event.date)}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

interface WeekSectionProps {
  weekLabel: string;
  events: MemoryEvent[];
}

function WeekSection({ weekLabel, events }: WeekSectionProps) {
  const isExpanded = useIsWeekExpanded(weekLabel);
  const toggleWeekExpanded = useMemoryStore(
    (state) => state.toggleWeekExpanded,
  );

  return (
    <div>
      {/* Section Header */}
      <button
        type="button"
        onClick={() => toggleWeekExpanded(weekLabel)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2",
          "text-caption font-medium text-muted-foreground",
          "hover:text-foreground transition-colors",
        )}
      >
        <span className="uppercase tracking-wider">{weekLabel}</span>
        <div className="flex items-center gap-2">
          <span className="text-micro opacity-60">{events.length}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={14}
              strokeWidth={1.5}
              className="opacity-50"
            />
          </motion.div>
        </div>
      </button>

      {/* Events List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-0.5 pb-2">
              {events.map((event) => (
                <SidebarEventItem key={event.id} event={event} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MemorySidebar() {
  const searchQuery = useMemoryStore((state) => state.searchQuery);
  const setSearchQuery = useMemoryStore((state) => state.setSearchQuery);
  const getEventsByWeekGrouped = useMemoryStore(
    (state) => state.getEventsByWeekGrouped,
  );
  const getOrderedWeeks = useMemoryStore((state) => state.getOrderedWeeks);

  const eventsByWeek = getEventsByWeekGrouped();
  const orderedWeeks = getOrderedWeeks();

  return (
    <aside className="w-[220px] shrink-0 bg-sidebar border-r border-border flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
          />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-caption"
          />
        </div>
      </div>

      {/* Week Sections */}
      <div className="flex-1 overflow-y-auto py-2">
        {orderedWeeks.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-caption text-muted-foreground/50">
              No events found
            </p>
          </div>
        ) : (
          orderedWeeks.map((weekLabel) => {
            const events = eventsByWeek.get(weekLabel) || [];
            return (
              <WeekSection
                key={weekLabel}
                weekLabel={weekLabel}
                events={events}
              />
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border">
        <p className="text-micro text-muted-foreground/50">
          {orderedWeeks.reduce(
            (sum, week) => sum + (eventsByWeek.get(week)?.length || 0),
            0,
          )}{" "}
          events
        </p>
      </div>
    </aside>
  );
}
