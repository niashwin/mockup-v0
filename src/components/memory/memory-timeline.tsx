import { useRef, useCallback, useMemo, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CircleIcon,
  GitBranchIcon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import {
  ZOOM_LEVELS,
  DEFAULT_ZOOM_INDEX,
  BASE_COLUMN_WIDTH,
} from "@lib/memory-constants";
import { generateWeekRange, getWeekOffset } from "@lib/memory-week-utils";
import { TimelineWeekColumn } from "./memory-timeline-week-column";
import { FocusModeOverlay, CurrentWeekIndicator } from "./memory-focus-overlay";
import { ConnectionLines } from "./connection-lines";
import {
  useMemoryStore,
  useIsFocusMode,
  useConnectionVisualizationMode,
} from "@stores/memory-store";
import type { MemoryEvent } from "@types/memory";

/**
 * Memory Timeline - Extended Horizontal Swimlane
 *
 * Redesigned 16-week horizontal timeline (8 weeks past + 8 weeks future):
 * - Scalable columns with zoom control
 * - Focus mode with dark overlay and connection highlighting
 * - Toggle between "dim-only" and "dim-with-lines" visualization modes
 * - Keyboard support (Escape to exit focus mode)
 * - Solid vertical lines between weeks
 */

export function MemoryTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToToday, setHasScrolledToToday] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);

  const selectedInitiativeId = useMemoryStore(
    (state) => state.selectedInitiativeId,
  );
  const getEventsForInitiative = useMemoryStore(
    (state) => state.getEventsForInitiative,
  );
  const exitFocusMode = useMemoryStore((state) => state.exitFocusMode);
  const toggleVisualizationMode = useMemoryStore(
    (state) => state.toggleVisualizationMode,
  );
  const isFocusMode = useIsFocusMode();
  const visualizationMode = useConnectionVisualizationMode();

  // Current zoom level
  const zoomLevel = ZOOM_LEVELS[zoomIndex];
  const columnWidth = BASE_COLUMN_WIDTH * zoomLevel;

  // Get events for selected initiative
  const events = selectedInitiativeId
    ? getEventsForInitiative(selectedInitiativeId)
    : [];

  // Generate all weeks in range
  const weeks = useMemo(() => generateWeekRange(), []);

  // Group events by week offset
  const eventsByWeekOffset = useMemo(() => {
    const grouped = new Map<number, MemoryEvent[]>();

    // Initialize all weeks
    for (const week of weeks) {
      grouped.set(week.weekOffset, []);
    }

    // Group events
    for (const event of events) {
      const offset = getWeekOffset(event.date);
      if (offset >= -8 && offset <= 8) {
        const existing = grouped.get(offset) || [];
        grouped.set(offset, [...existing, event]);
      }
    }

    return grouped;
  }, [events, weeks]);

  // Find the index of "This Week" for initial scroll
  const currentWeekIndex = useMemo(
    () => weeks.findIndex((w) => w.isCurrentWeek),
    [weeks],
  );

  // Auto-scroll to "This Week" on mount
  useEffect(() => {
    if (scrollRef.current && !hasScrolledToToday && currentWeekIndex >= 0) {
      // Calculate scroll position to center "This Week"
      const containerWidth = scrollRef.current.clientWidth;
      const targetScroll =
        currentWeekIndex * columnWidth - containerWidth / 2 + columnWidth / 2;

      scrollRef.current.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "auto", // Instant on initial load
      });
      setHasScrolledToToday(true);
    }
  }, [currentWeekIndex, hasScrolledToToday, columnWidth]);

  // Keyboard handler for Escape to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocusMode) {
        exitFocusMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusMode, exitFocusMode]);

  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -columnWidth,
        behavior: "smooth",
      });
    }
  }, [columnWidth]);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: columnWidth,
        behavior: "smooth",
      });
    }
  }, [columnWidth]);

  const scrollToToday = useCallback(() => {
    if (scrollRef.current && currentWeekIndex >= 0) {
      const containerWidth = scrollRef.current.clientWidth;
      const targetScroll =
        currentWeekIndex * columnWidth - containerWidth / 2 + columnWidth / 2;

      scrollRef.current.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth",
      });
    }
  }, [currentWeekIndex, columnWidth]);

  const zoomIn = useCallback(() => {
    setZoomIndex((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  if (!selectedInitiativeId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface/20">
        <div className="text-center">
          <p className="text-muted-foreground font-medium">
            Select an initiative
          </p>
          <p className="text-sm text-muted-foreground/50 mt-1">
            Choose from the sidebar to view timeline
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface/20 relative">
      {/* Controls Bar - Above the swimlanes */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-border/30 shrink-0 bg-background/80 backdrop-blur-sm z-40">
        {/* Left: Visualization toggle + Today button */}
        <div className="flex items-center gap-2">
          {/* Visualization Mode Toggle */}
          <button
            type="button"
            onClick={toggleVisualizationMode}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-md)] text-xs transition-colors",
              visualizationMode === "dim-with-lines"
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
            title="Toggle connection lines"
          >
            <HugeiconsIcon icon={GitBranchIcon} size={14} strokeWidth={1.5} />
            <span>
              {visualizationMode === "dim-with-lines"
                ? "Lines On"
                : "Lines Off"}
            </span>
          </button>

          <div className="w-px h-4 bg-border/50" />

          <Button
            variant="outline"
            size="sm"
            onClick={scrollToToday}
            className="h-6 px-2 text-[11px] gap-1"
          >
            <HugeiconsIcon
              icon={CircleIcon}
              size={6}
              strokeWidth={1.5}
              className="fill-accent text-accent"
            />
            Today
          </Button>
        </div>

        {/* Right: Navigation + Zoom controls */}
        <div className="flex items-center gap-2">
          {/* Navigation */}
          <button
            type="button"
            onClick={scrollLeft}
            className="p-1 rounded-[var(--radius-md)] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Scroll left (past)"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            className="p-1 rounded-[var(--radius-md)] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Scroll right (future)"
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              strokeWidth={1.5}
            />
          </button>

          <div className="w-px h-4 bg-border/50" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoomIndex === 0}
              className={cn(
                "p-1 rounded-[var(--radius-md)] transition-colors",
                zoomIndex === 0
                  ? "text-muted-foreground/30 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
              title="Zoom out"
            >
              <HugeiconsIcon
                icon={ZoomOutAreaIcon}
                size={14}
                strokeWidth={1.5}
              />
            </button>

            <span className="text-[10px] text-muted-foreground w-8 text-center tabular-nums">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              type="button"
              onClick={zoomIn}
              disabled={zoomIndex === ZOOM_LEVELS.length - 1}
              className={cn(
                "p-1 rounded-[var(--radius-md)] transition-colors",
                zoomIndex === ZOOM_LEVELS.length - 1
                  ? "text-muted-foreground/30 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
              title="Zoom in"
            >
              <HugeiconsIcon
                icon={ZoomInAreaIcon}
                size={14}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Focus Mode Overlay */}
        <FocusModeOverlay />

        {/* Scrollable Timeline */}
        <div
          ref={scrollRef}
          className="h-full overflow-x-auto overflow-y-hidden"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--color-border) transparent",
          }}
        >
          <div className="relative h-full">
            {/* Connection Lines (SVG overlay for dim-with-lines mode) */}
            <ConnectionLines containerRef={scrollRef} />

            {/* Current Week Indicator (focus mode only) */}
            <AnimatePresence>
              {isFocusMode && (
                <CurrentWeekIndicator
                  currentWeekIndex={currentWeekIndex}
                  columnWidth={columnWidth}
                />
              )}
            </AnimatePresence>

            {/* Week Columns */}
            <div className="flex h-full" style={{ minWidth: "max-content" }}>
              {weeks.map((weekData, index) => (
                <TimelineWeekColumn
                  key={weekData.weekOffset}
                  weekData={weekData}
                  events={eventsByWeekOffset.get(weekData.weekOffset) || []}
                  isLast={index === weeks.length - 1}
                  columnWidth={columnWidth}
                  zoomLevel={zoomLevel}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Gradient fade indicators for scroll direction */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-surface/90 to-transparent pointer-events-none z-15" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface/90 to-transparent pointer-events-none z-15" />
      </div>
    </div>
  );
}
