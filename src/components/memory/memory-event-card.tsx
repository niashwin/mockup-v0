import { motion } from "motion/react";
import { cn } from "@lib/utils";
import { Avatar } from "@components/ui/avatar";
import { eventTypeConfig, type MemoryEvent } from "@types/memory";
import { useIsEventSelected, useMemoryStore } from "@stores/memory-store";

/**
 * Memory Event Card
 *
 * Individual card displayed on the timeline showing:
 * - Event type badge with colored dot
 * - Timestamp
 * - Title
 * - Summary (truncated to 2 lines)
 * - Participant avatars
 */

interface MemoryEventCardProps {
  event: MemoryEvent;
}

function formatEventTime(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.floor(
    (today.getTime() - eventDay.getTime()) / (1000 * 60 * 60 * 24),
  );

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (diffDays === 0) {
    return `Today ${timeStr}`;
  }
  if (diffDays === 1) {
    return `Yesterday ${timeStr}`;
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function MemoryEventCard({ event }: MemoryEventCardProps) {
  const isSelected = useIsEventSelected(event.id);
  const openPopup = useMemoryStore((state) => state.openPopup);
  const selectEvent = useMemoryStore((state) => state.selectEvent);

  const typeConfig = eventTypeConfig[event.type];
  const visibleParticipants = event.participants.slice(0, 3);
  const remainingCount = event.participants.length - 3;

  const handleClick = () => {
    selectEvent(event.id);
    openPopup(event.id);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full text-left rounded-[var(--radius-lg)] p-4",
        "bg-surface-elevated border transition-all duration-200",
        isSelected
          ? "border-accent/30 shadow-md"
          : "border-border/40 hover:border-border hover:shadow-sm",
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", duration: 0.2, bounce: 0 }}
    >
      {/* Header: Type badge + timestamp */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={cn("size-2 rounded-full shrink-0", typeConfig.dot)}
          />
          <span
            className={cn(
              "text-micro font-medium uppercase tracking-wider",
              typeConfig.text,
              typeConfig.darkText,
            )}
          >
            {typeConfig.label}
          </span>
        </div>
        <span className="text-micro text-muted-foreground tabular-nums">
          {formatEventTime(event.date)}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-medium text-sm text-foreground mb-1.5 line-clamp-2">
        {event.title}
      </h4>

      {/* Summary */}
      <p className="text-caption text-muted-foreground line-clamp-2 mb-3">
        {event.summary}
      </p>

      {/* Participants */}
      {event.participants.length > 0 && (
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1.5">
            {visibleParticipants.map((participant) => (
              <Avatar
                key={participant.id}
                name={participant.name}
                src={participant.avatarUrl}
                size="sm"
                className="ring-2 ring-surface-elevated"
              />
            ))}
          </div>
          {remainingCount > 0 && (
            <span className="text-micro text-muted-foreground ml-1">
              +{remainingCount}
            </span>
          )}
        </div>
      )}
    </motion.button>
  );
}
