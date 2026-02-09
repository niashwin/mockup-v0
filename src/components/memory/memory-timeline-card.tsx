import { forwardRef } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  UserGroupIcon,
  Mail01Icon,
  Target01Icon,
  Flag01Icon,
  JusticeScale01Icon,
  Alert01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import {
  eventTypeConfig,
  type MemoryEvent,
  type MemoryEventType,
} from "@types/memory";
import {
  useIsEventSelected,
  useIsEventFocused,
  useIsEventConnectedToFocus,
  useIsEventDimmed,
  useIsFocusMode,
  useMemoryStore,
} from "@stores/memory-store";

/**
 * Memory Timeline Card - Large Square Design
 *
 * Redesigned card for the swim lanes timeline showing high-level accomplishments.
 * Cards are larger (~280x~220px), closer to square with:
 * - Type icon + type label in top-left
 * - Date in top-right
 * - Bold title
 * - Brief description (3 lines max)
 *
 * Focus mode states:
 * - Default: Normal appearance
 * - Focused (source): Pulsing cyan ring
 * - Connected: Cyan ring, stays bright
 * - Dimmed: Faded, non-interactive
 */

interface MemoryTimelineCardProps {
  event: MemoryEvent;
  zoomLevel?: number;
}

// Format date for display
function formatCardDate(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  }
  if (diffDays === 1) {
    return `Tomorrow, ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  }
  if (diffDays === -1) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Type-specific icons
const typeIcons: Record<MemoryEventType, IconSvgElement> = {
  meeting: UserGroupIcon,
  email: Mail01Icon,
  commitment: Target01Icon,
  milestone: Flag01Icon,
  decision: JusticeScale01Icon,
  alert: Alert01Icon,
};

export const MemoryTimelineCard = forwardRef<
  HTMLButtonElement,
  MemoryTimelineCardProps
>(function MemoryTimelineCard({ event, zoomLevel = 1 }, ref) {
  const isSelected = useIsEventSelected(event.id);
  const isFocused = useIsEventFocused(event.id);
  const isConnected = useIsEventConnectedToFocus(event.id);
  const isDimmed = useIsEventDimmed(event.id);
  const isFocusMode = useIsFocusMode();
  const toggleFocusMode = useMemoryStore((state) => state.toggleFocusMode);
  const selectEvent = useMemoryStore((state) => state.selectEvent);

  const typeConfig = eventTypeConfig[event.type];
  const typeIcon = typeIcons[event.type];

  const handleClick = () => {
    if (isDimmed) return; // Don't interact with dimmed cards
    toggleFocusMode(event.id);
    selectEvent(event.id);
  };

  // Scale dimensions based on zoom level
  const cardWidth = Math.round(240 * zoomLevel);
  const cardMinHeight = Math.round(160 * zoomLevel);
  const padding = Math.round(16 * zoomLevel);
  const iconSize = Math.round(14 * zoomLevel);
  const labelFontSize = Math.round(10 * zoomLevel);
  const titleFontSize = Math.round(13 * zoomLevel);
  const descFontSize = Math.round(11 * zoomLevel);
  const borderRadius = Math.round(12 * zoomLevel);
  const gap = Math.round(6 * zoomLevel);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={handleClick}
      data-event-id={event.id}
      style={{
        width: cardWidth,
        minHeight: cardMinHeight,
        padding,
        borderRadius,
        gap,
      }}
      className={cn(
        // Base styles - Large square card
        "text-left overflow-hidden",
        "bg-surface-elevated border",
        "flex flex-col",

        // Default state
        !isFocusMode && [
          "transition-all duration-200",
          isSelected
            ? "border-border shadow-md ring-2 ring-accent/30"
            : "border-border/50 hover:shadow-lg hover:border-border",
        ],

        // Focus mode states
        isFocusMode && [
          "transition-all duration-300",
          // Focused (source) card - pulsing glow
          isFocused && [
            "relative z-30",
            "ring-2 ring-accent shadow-xl",
            "animate-focus-ring",
          ],
          // Connected card - bright with ring
          isConnected &&
            !isFocused && [
              "relative z-30",
              "ring-2 ring-accent/60",
              "shadow-lg",
            ],
          // Dimmed card - faded and non-interactive
          isDimmed && ["opacity-40", "pointer-events-none", "grayscale-[20%]"],
        ],
      )}
      // Only animate hover/tap when not dimmed
      whileHover={!isDimmed ? { y: -3 } : undefined}
      whileTap={!isDimmed ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", duration: 0.25, bounce: 0 }}
    >
      {/* Row 1: Type icon + label + Date */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: gap * 1.5 }}
      >
        {/* Type badge with icon */}
        <div className="flex items-center" style={{ gap: gap * 0.75 }}>
          <HugeiconsIcon
            icon={typeIcon}
            size={iconSize}
            className="text-muted-foreground"
            strokeWidth={1.5}
          />
          <span
            className="font-semibold uppercase tracking-wider text-muted-foreground"
            style={{ fontSize: labelFontSize }}
          >
            {typeConfig.label}
          </span>
        </div>

        {/* Date */}
        <span
          className="text-muted-foreground tabular-nums"
          style={{ fontSize: labelFontSize }}
        >
          {formatCardDate(event.date)}
        </span>
      </div>

      {/* Title */}
      <h4
        className="font-semibold text-foreground leading-snug line-clamp-2"
        style={{ fontSize: titleFontSize, marginBottom: gap }}
      >
        {event.title}
      </h4>

      {/* Description - fills remaining space */}
      <p
        className="text-muted-foreground leading-relaxed line-clamp-3 flex-1"
        style={{ fontSize: descFontSize }}
      >
        {event.summary}
      </p>

      {/* Connection indicator when focused */}
      {isFocusMode && (isFocused || isConnected) && (
        <div
          className="border-t border-border/30"
          style={{ marginTop: gap * 1.5, paddingTop: gap }}
        >
          <span
            className="font-medium text-accent uppercase tracking-wider"
            style={{ fontSize: Math.round(9 * zoomLevel) }}
          >
            {isFocused
              ? `${event.connectedEventIds?.length || 0} Connected`
              : "Related"}
          </span>
        </div>
      )}
    </motion.button>
  );
});
