import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Message01Icon,
  Cancel01Icon,
  UserIcon,
  FlashIcon,
  FileStarIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { Badge } from "@components/ui/badge";
import { Avatar } from "@components/ui/avatar";
import { springs } from "@lib/motion";
import { eventTypeConfig, type MemoryEventType } from "@types/memory";
import {
  useMemoryStore,
  useIsFocusMode,
  useFocusedEventId,
} from "@stores/memory-store";

/**
 * Memory Event Detail Panel - Slide-Up Design
 *
 * Redesigned as a slide-up panel fixed at the bottom of the timeline area.
 * Shows when an event is focused (in focus mode).
 *
 * Layout:
 * - Header: Type badge + Date + "Details" label + Close button
 * - Title + Description
 * - Detail fields: Owner, Impact, Evidence, Next step
 * - Footer: Participant avatars + Chat channel link
 */

// Type-specific border colors for the top accent bar
const typeAccentColors: Record<MemoryEventType, string> = {
  meeting: "bg-blue-500",
  email: "bg-sky-500",
  commitment: "bg-amber-500",
  milestone: "bg-emerald-500",
  decision: "bg-violet-500",
  alert: "bg-red-500",
};

function formatEventTime(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffDays = Math.floor(
    (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  let dayLabel: string;
  if (diffDays === 0) {
    dayLabel = "Today";
  } else if (diffDays === 1) {
    dayLabel = "Tomorrow";
  } else if (diffDays === -1) {
    dayLabel = "Yesterday";
  } else if (diffDays > 1 && diffDays < 7) {
    dayLabel = date.toLocaleDateString("en-US", { weekday: "long" });
  } else {
    dayLabel = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dayLabel}, ${timeStr}`;
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="flex items-center gap-2 w-24 shrink-0">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-sm text-foreground leading-relaxed flex-1">{value}</p>
    </div>
  );
}

export function MemoryEventDetail() {
  const events = useMemoryStore((state) => state.events);
  const exitFocusMode = useMemoryStore((state) => state.exitFocusMode);
  const isFocusMode = useIsFocusMode();
  const focusedEventId = useFocusedEventId();

  // Get the focused event
  const event = focusedEventId
    ? events.find((e) => e.id === focusedEventId) || null
    : null;

  const handleClose = () => {
    exitFocusMode();
  };

  // Count connected events for display
  const connectedCount = event?.connectedEventIds?.length || 0;

  return (
    <AnimatePresence>
      {isFocusMode && event && (
        <motion.div
          key={event.id}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={springs.default}
          className={cn(
            "absolute left-0 right-0 bottom-0 z-50",
            "bg-surface-elevated/98 backdrop-blur-xl",
            "border-t border-border/50",
            "max-h-[320px] overflow-hidden",
          )}
        >
          {/* Type accent bar */}
          <div className={cn("h-0.5 w-full", typeAccentColors[event.type])} />

          <div className="p-5 overflow-y-auto max-h-[310px]">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                {/* Type Badge + Date */}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold",
                    eventTypeConfig[event.type].bg,
                    eventTypeConfig[event.type].text,
                    eventTypeConfig[event.type].darkBg,
                    eventTypeConfig[event.type].darkText,
                    "border-0",
                  )}
                >
                  {eventTypeConfig[event.type].label}
                </Badge>

                <span className="text-[11px] text-muted-foreground font-medium">
                  {formatEventTime(event.date)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Connected events badge */}
                {connectedCount > 0 && (
                  <span className="text-[10px] font-medium text-accent uppercase tracking-wider">
                    {connectedCount} Connected
                  </span>
                )}

                {/* Details label */}
                <span className="text-xs text-muted-foreground/50">
                  Details
                </span>

                {/* Close button */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-[var(--radius-lg)] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={16}
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            </div>

            {/* Title + Summary */}
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {event.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {event.summary}
            </p>

            {/* Detail Fields */}
            {(event.impact || event.evidence || event.nextStep) && (
              <div className="border-t border-border/30 pt-3 mb-4 space-y-0.5">
                {/* Owner - use first participant */}
                {event.participants[0] && (
                  <div className="flex items-center gap-3 py-2.5">
                    <div className="flex items-center gap-2 w-24 shrink-0">
                      <HugeiconsIcon
                        icon={UserIcon}
                        size={14}
                        className="text-muted-foreground"
                        strokeWidth={1.5}
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        Owner
                      </span>
                    </div>
                    <span className="text-sm text-foreground">
                      {event.participants[0].name}
                    </span>
                  </div>
                )}

                {/* Impact */}
                {event.impact && (
                  <DetailRow
                    icon={
                      <HugeiconsIcon
                        icon={FlashIcon}
                        size={14}
                        strokeWidth={1.5}
                      />
                    }
                    label="Impact"
                    value={event.impact}
                  />
                )}

                {/* Evidence */}
                {event.evidence && (
                  <DetailRow
                    icon={
                      <HugeiconsIcon
                        icon={FileStarIcon}
                        size={14}
                        strokeWidth={1.5}
                      />
                    }
                    label="Evidence"
                    value={event.evidence}
                  />
                )}

                {/* Next Step */}
                {event.nextStep && (
                  <DetailRow
                    icon={
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={14}
                        strokeWidth={1.5}
                      />
                    }
                    label="Next step"
                    value={event.nextStep}
                  />
                )}
              </div>
            )}

            {/* Footer: Participants + Channel */}
            <div className="flex items-center justify-between pt-3 border-t border-border/30">
              {/* Participant Avatars */}
              {event.participants.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {event.participants.slice(0, 4).map((participant) => (
                      <Avatar
                        key={participant.id}
                        name={participant.name}
                        src={participant.avatarUrl}
                        size="sm"
                        className="ring-2 ring-surface-elevated"
                      />
                    ))}
                    {event.participants.length > 4 && (
                      <div className="size-6 rounded-full bg-muted border-2 border-surface-elevated flex items-center justify-center">
                        <span className="text-[9px] font-medium text-muted-foreground">
                          +{event.participants.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Channel Link */}
              {event.channel && (
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <HugeiconsIcon
                    icon={Message01Icon}
                    size={14}
                    strokeWidth={1.5}
                  />
                  <span className="text-xs font-medium">
                    Chat in {event.channel}
                  </span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
