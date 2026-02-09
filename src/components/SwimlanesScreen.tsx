import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  AlertCircle,
  Calendar,
  Circle,
  ZoomIn,
  ZoomOut,
  GitBranch,
  Users,
  GitCommit,
  CheckCircle2,
  FileText,
  Activity,
  Flag,
  X,
} from "lucide-react";
import {
  SwimlaneMeta,
  TimelineItem,
  swimlanesList,
  timelineData,
} from "../data";
import { ChatInterface } from "./ChatInterface";

/**
 * Swimlanes Screen
 *
 * Week-column based timeline view with:
 * - Left sidebar with ACTIVE/BLOCKED initiatives
 * - Initiative header with status bar
 * - Horizontal week columns with event cards
 * - Focus mode: click event to highlight connected events
 * - Persistent search bar at bottom
 */

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

interface WeekData {
  label: string;
  dateRange: string;
  weekOffset: number;
  isCurrentWeek: boolean;
  isFuture: boolean;
  startDate: Date;
  endDate: Date;
}

// ═══════════════════════════════════════════════════════════════════════════
// Event Type Styling
// ═══════════════════════════════════════════════════════════════════════════

const eventTypeConfig: Record<
  string,
  {
    icon: typeof Users;
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  decision: {
    icon: GitCommit,
    label: "DECISION",
    bgColor: "bg-violet-500/10 dark:bg-violet-500/20",
    textColor: "text-violet-600 dark:text-violet-400",
    borderColor: "border-violet-500/30",
  },
  meeting: {
    icon: Users,
    label: "MEETING",
    bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    textColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-500/30",
  },
  commitment: {
    icon: CheckCircle2,
    label: "COMMITMENT",
    bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
    textColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-500/30",
  },
  milestone: {
    icon: Flag,
    label: "MILESTONE",
    bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
    textColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-500/30",
  },
  document: {
    icon: FileText,
    label: "DOCUMENT",
    bgColor: "bg-sky-500/10 dark:bg-sky-500/20",
    textColor: "text-sky-600 dark:text-sky-400",
    borderColor: "border-sky-500/30",
  },
  alert: {
    icon: AlertCircle,
    label: "ALERT",
    bgColor: "bg-red-500/10 dark:bg-red-500/20",
    textColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-500/30",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// Status Styling
// ═══════════════════════════════════════════════════════════════════════════

const getStatusStyles = (status: string) => {
  switch (status) {
    case "blocked":
      return {
        dot: "bg-red-500",
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-900/50",
        label: "Blocked",
      };
    case "on-track":
      return {
        dot: "bg-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-900/50",
        label: "On Track",
      };
    case "delayed":
      return {
        dot: "bg-orange-500",
        bg: "bg-orange-50 dark:bg-orange-900/20",
        text: "text-orange-700 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-900/50",
        label: "Delayed",
      };
    default:
      return {
        dot: "bg-neutral-400",
        bg: "bg-secondary",
        text: "text-muted-foreground",
        border: "border-border",
        label: status,
      };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Date Utilities
// ═══════════════════════════════════════════════════════════════════════════

const parseTimestamp = (timestamp: string): Date => {
  const now = new Date();
  if (timestamp.includes("Today")) return now;
  if (timestamp.includes("Yesterday")) {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    return d;
  }
  if (timestamp.includes("days ago")) {
    const days = parseInt(timestamp.split(" ")[0]);
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d;
  }
  const parsed = Date.parse(timestamp);
  if (!isNaN(parsed)) return new Date(parsed);
  const parts = timestamp.split(" ");
  if (parts.length >= 2) {
    const constructed = `${parts[0]} ${parts[1].replace(",", "")}, 2026`;
    const p = Date.parse(constructed);
    if (!isNaN(p)) return new Date(p);
  }
  return now;
};

const generateWeekRange = (): WeekData[] => {
  const weeks: WeekData[] = [];
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  for (let offset = -4; offset <= 3; offset++) {
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
    if (offset === 0) label = "THIS WEEK";
    else if (offset === -1) label = "LAST WEEK";
    else if (offset === 1) label = "NEXT WEEK";
    else if (offset < 0) label = `${Math.abs(offset)} WEEKS AGO`;
    else label = `IN ${offset} WEEKS`;

    weeks.push({
      label,
      dateRange: `${startStr} - ${endStr}`,
      weekOffset: offset,
      isCurrentWeek: offset === 0,
      isFuture: offset > 0,
      startDate: weekStart,
      endDate: weekEnd,
    });
  }
  return weeks;
};

const getWeekOffset = (eventDate: Date): number => {
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);
  const eventWeekStart = new Date(eventDate);
  eventWeekStart.setDate(eventDate.getDate() - eventDate.getDay());
  eventWeekStart.setHours(0, 0, 0, 0);
  const diffMs = eventWeekStart.getTime() - currentWeekStart.getTime();
  return Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
};

// ═══════════════════════════════════════════════════════════════════════════
// Timeline Card Component
// ═══════════════════════════════════════════════════════════════════════════

interface TimelineCardProps {
  item: TimelineItem;
  isSelected: boolean;
  isFocused: boolean;
  isConnected: boolean;
  isDimmed: boolean;
  onClick: () => void;
}

function TimelineCard({
  item,
  isSelected,
  isFocused,
  isConnected,
  isDimmed,
  onClick,
}: TimelineCardProps) {
  const config = eventTypeConfig[item.type] || eventTypeConfig.decision;
  const Icon = config.icon;

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      data-event-id={item.id}
      animate={{
        opacity: isDimmed ? 0.25 : 1,
        scale: isFocused ? 1.02 : 1,
        filter: isDimmed ? "grayscale(100%)" : "grayscale(0%)",
      }}
      transition={{ duration: 0.3 }}
      className={`
        w-full text-left p-4 rounded-[7px] border transition-colors duration-200
        ${isFocused || isConnected ? "relative z-30" : "relative z-20"}
        ${
          isFocused
            ? "bg-card dark:bg-neutral-900 ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/20"
            : isConnected
              ? "bg-card dark:bg-neutral-900 ring-2 ring-cyan-400/60 shadow-md"
              : `bg-card dark:bg-neutral-900 ${config.bgColor}`
        }
        ${config.borderColor}
        ${!isDimmed && !isFocused && !isConnected ? "hover:shadow-lg" : ""}
      `}
      whileHover={!isDimmed ? { y: -2 } : undefined}
      whileTap={!isDimmed ? { scale: 0.98 } : undefined}
    >
      {/* Header: Type + Date */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-3 h-3 ${config.textColor}`} strokeWidth={2} />
          <span
            className={`text-[10px] font-bold tracking-wider ${config.textColor}`}
          >
            {config.label}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {item.timestamp}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-2">
        {item.title}
      </h4>

      {/* Summary */}
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {item.summary}
      </p>

      {/* Connected indicator */}
      {(isFocused || isConnected) && (
        <div className="mt-3 pt-2 border-t border-border/50">
          <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            {isFocused
              ? `${item.linkedEventId ? "1 Connected" : "0 Connected"}`
              : "Related"}
          </span>
        </div>
      )}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Week Column Component
// ═══════════════════════════════════════════════════════════════════════════

interface WeekColumnProps {
  weekData: WeekData;
  events: TimelineItem[];
  focusedEventId: string | null;
  connectedEventIds: Set<string>;
  onSelectEvent: (id: string) => void;
}

function WeekColumn({
  weekData,
  events,
  focusedEventId,
  connectedEventIds,
  onSelectEvent,
  onExitFocus,
}: WeekColumnProps & { onExitFocus: () => void }) {
  const isFocusMode = focusedEventId !== null;

  return (
    <div
      className="shrink-0 w-[260px] flex flex-col h-full border-r border-border/40 last:border-r-0"
      onClick={(e) => {
        // Exit focus mode when clicking on column background
        if (isFocusMode && e.target === e.currentTarget) {
          onExitFocus();
        }
      }}
    >
      {/* Week Header */}
      <div
        className={`
        px-3 py-3 text-center border-b shrink-0
        ${
          weekData.isCurrentWeek
            ? "bg-cyan-50/50 dark:bg-cyan-900/10 border-cyan-200/50 dark:border-cyan-800/30"
            : weekData.isFuture
              ? "bg-background/30 dark:bg-neutral-900/20 border-border/30"
              : "bg-background/50 dark:bg-neutral-900/30 border-border/50"
        }
      `}
      >
        <div className="flex items-center justify-center gap-1.5">
          {weekData.isCurrentWeek && (
            <Circle className="w-1.5 h-1.5 fill-cyan-500 text-cyan-500" />
          )}
          <p
            className={`
            text-[10px] font-bold tracking-wider
            ${
              weekData.isCurrentWeek
                ? "text-cyan-600 dark:text-cyan-400"
                : weekData.isFuture
                  ? "text-muted-foreground"
                  : "text-muted-foreground"
            }
          `}
          >
            {weekData.label}
          </p>
        </div>
        <p
          className={`
          text-[9px] mt-0.5
          ${
            weekData.isCurrentWeek
              ? "text-cyan-500/70 dark:text-cyan-500/50"
              : "text-muted-foreground/60"
          }
        `}
        >
          {weekData.dateRange}
        </p>
      </div>

      {/* Events */}
      <div
        className={`
          flex-1 flex flex-col gap-3 p-3 overflow-y-auto
          ${weekData.isFuture ? "opacity-60" : ""}
        `}
        onClick={(e) => {
          // Exit focus mode when clicking on empty space in events area
          if (isFocusMode && e.target === e.currentTarget) {
            onExitFocus();
          }
        }}
      >
        {events.length > 0 ? (
          events.map((event, index) => {
            const isFocused = focusedEventId === event.id;
            const isConnected = connectedEventIds.has(event.id);
            const isDimmed = isFocusMode && !isFocused && !isConnected;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <TimelineCard
                  item={event}
                  isSelected={false}
                  isFocused={isFocused}
                  isConnected={isConnected}
                  isDimmed={isDimmed}
                  onClick={() => onSelectEvent(event.id)}
                />
              </motion.div>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground/40 italic text-center py-8">
            No events
          </p>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Focus Mode Overlay
// ═══════════════════════════════════════════════════════════════════════════

function FocusModeOverlay({ isActive }: { isActive: boolean }) {
  // Overlay is purely cosmetic - dimming is handled by individual cards
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// Connection Lines Component
// ═══════════════════════════════════════════════════════════════════════════

interface ConnectionLinesProps {
  focusedEventId: string | null;
  connectedEventIds: Set<string>;
  showLines: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  events: TimelineItem[];
}

function ConnectionLines({
  focusedEventId,
  connectedEventIds,
  showLines,
  containerRef,
  events,
}: ConnectionLinesProps) {
  const [lines, setLines] = useState<
    Array<{
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }>
  >([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

  const shouldShowLines = showLines || focusedEventId !== null;

  // Calculate line positions when focus changes
  useEffect(() => {
    if (!shouldShowLines || !containerRef.current) {
      setLines([]);
      return;
    }

    const calculateLines = () => {
      const container = containerRef.current;
      if (!container) return;

      // Get the inner flex container that holds all weeks
      const innerContainer = container.querySelector(".flex.h-full");
      if (!innerContainer) return;

      const scrollLeft = container.scrollLeft;
      const newLines: typeof lines = [];

      // Set SVG size to match scroll content
      setSvgSize({
        width: innerContainer.scrollWidth,
        height: innerContainer.scrollHeight,
      });

      // Get all event cards with their positions relative to the scroll content
      const cardPositions = new Map<
        string,
        { x: number; y: number; width: number; height: number }
      >();

      events.forEach((event) => {
        const card = container.querySelector(`[data-event-id="${event.id}"]`);
        if (card) {
          const cardRect = card.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          // Position relative to scroll content (not viewport)
          cardPositions.set(event.id, {
            x:
              cardRect.left -
              containerRect.left +
              scrollLeft +
              cardRect.width / 2,
            y:
              cardRect.top -
              containerRect.top +
              container.scrollTop +
              cardRect.height / 2,
            width: cardRect.width,
            height: cardRect.height,
          });
        }
      });

      // Draw lines between connected events
      events.forEach((event) => {
        if (event.linkedEventId) {
          const fromPos = cardPositions.get(event.id);
          const toPos = cardPositions.get(event.linkedEventId);

          if (fromPos && toPos) {
            // Only show if in focus mode for this connection, or if showLines is on
            const isRelevantConnection =
              showLines ||
              (focusedEventId &&
                (event.id === focusedEventId ||
                  event.linkedEventId === focusedEventId ||
                  connectedEventIds.has(event.id)));

            if (isRelevantConnection) {
              newLines.push({
                id: `${event.id}-${event.linkedEventId}`,
                x1: fromPos.x,
                y1: fromPos.y,
                x2: toPos.x,
                y2: toPos.y,
              });
            }
          }
        }
      });

      setLines(newLines);
    };

    // Calculate immediately and after a short delay for DOM to settle
    calculateLines();
    const timeoutId = setTimeout(calculateLines, 100);

    // Recalculate on scroll
    const container = containerRef.current;
    const handleScroll = () => requestAnimationFrame(calculateLines);
    container?.addEventListener("scroll", handleScroll);

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(() =>
      requestAnimationFrame(calculateLines),
    );
    if (container) resizeObserver.observe(container);

    return () => {
      clearTimeout(timeoutId);
      container?.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [
    shouldShowLines,
    focusedEventId,
    connectedEventIds,
    events,
    containerRef,
    showLines,
  ]);

  if (!shouldShowLines || lines.length === 0) return null;

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        width: svgSize.width || "100%",
        height: svgSize.height || "100%",
        zIndex: 40,
        overflow: "visible",
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="rgb(6 182 212)" />
        </marker>
      </defs>

      {lines.map((line) => {
        const midX = (line.x1 + line.x2) / 2;
        const midY = (line.y1 + line.y2) / 2;
        const dx = Math.abs(line.x2 - line.x1);

        // Create a curved line that bows upward
        const curveOffset = Math.min(dx * 0.25, 60);
        const controlY = midY - curveOffset;

        return (
          <motion.g key={line.id}>
            {/* Glow effect */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              d={`M ${line.x1} ${line.y1} Q ${midX} ${controlY} ${line.x2} ${line.y2}`}
              fill="none"
              stroke="rgb(6 182 212)"
              strokeWidth="8"
              strokeLinecap="round"
              style={{ filter: "blur(6px)" }}
            />
            {/* Main line */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              d={`M ${line.x1} ${line.y1} Q ${midX} ${controlY} ${line.x2} ${line.y2}`}
              fill="none"
              stroke="rgb(6 182 212)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="6 4"
              markerEnd="url(#arrowhead)"
            />
          </motion.g>
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Initiative Sidebar
// ═══════════════════════════════════════════════════════════════════════════

interface InitiativeSidebarProps {
  lanes: SwimlaneMeta[];
  selectedLaneId: string | null;
  onSelectLane: (id: string) => void;
}

function InitiativeSidebar({
  lanes,
  selectedLaneId,
  onSelectLane,
}: InitiativeSidebarProps) {
  const [activeExpanded, setActiveExpanded] = useState(true);
  const [blockedExpanded, setBlockedExpanded] = useState(true);

  const activeLanes = lanes.filter((l) => l.status !== "blocked");
  const blockedLanes = lanes.filter((l) => l.status === "blocked");

  return (
    <aside className="w-[200px] shrink-0 bg-primary border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Swimlanes
        </h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {lanes.length} initiatives
        </p>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Active Section */}
        <div>
          <button
            onClick={() => setActiveExpanded(!activeExpanded)}
            className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3" strokeWidth={1.5} />
              <span className="uppercase tracking-wider">Active</span>
            </div>
            <motion.div animate={{ rotate: activeExpanded ? 180 : 0 }}>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </motion.div>
          </button>

          <AnimatePresence>
            {activeExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {activeLanes.map((lane) => {
                  const styles = getStatusStyles(lane.status);
                  return (
                    <button
                      key={lane.id}
                      onClick={() => onSelectLane(lane.id)}
                      className={`
                        w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors
                        ${
                          selectedLaneId === lane.id
                            ? "bg-neutral-800 text-primary-foreground"
                            : "text-muted-foreground hover:bg-neutral-900 hover:text-foreground"
                        }
                      `}
                    >
                      <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                      <span className="text-xs font-medium truncate">
                        {lane.name}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="my-2 mx-4 border-t border-border/50" />

        {/* Blocked Section */}
        <div>
          <button
            onClick={() => setBlockedExpanded(!blockedExpanded)}
            className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
              <span className="uppercase tracking-wider">Blocked</span>
            </div>
            <motion.div animate={{ rotate: blockedExpanded ? 180 : 0 }}>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </motion.div>
          </button>

          <AnimatePresence>
            {blockedExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {blockedLanes.length > 0 ? (
                  blockedLanes.map((lane) => (
                    <button
                      key={lane.id}
                      onClick={() => onSelectLane(lane.id)}
                      className={`
                        w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors
                        ${
                          selectedLaneId === lane.id
                            ? "bg-neutral-800 text-primary-foreground"
                            : "text-muted-foreground hover:bg-neutral-900 hover:text-foreground"
                        }
                      `}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-xs font-medium truncate">
                        {lane.name}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-2 text-[10px] text-foreground italic">
                    No blocked initiatives
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-border text-[10px] text-foreground">
        Click to view timeline
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Initiative Header with Status Bar
// ═══════════════════════════════════════════════════════════════════════════

interface InitiativeHeaderProps {
  lane: SwimlaneMeta | null;
}

function InitiativeHeader({ lane }: InitiativeHeaderProps) {
  if (!lane) {
    return (
      <div className="border-b border-border bg-card/50 dark:bg-neutral-900/50 px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Select an initiative from the sidebar
        </p>
      </div>
    );
  }

  const styles = getStatusStyles(lane.status);

  return (
    <div>
      {/* Title Row */}
      <motion.div
        key={lane.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 dark:bg-neutral-900/50"
      >
        <div className="px-6 py-3">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
            <h2 className="text-sm font-semibold text-foreground">
              {lane.name}
            </h2>
            <span className="text-muted-foreground/40">•</span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" strokeWidth={1.5} />
                <span>Jan 5 - Apr 5</span>
              </div>
              <span className="text-muted-foreground/40">•</span>
              <span className="font-medium">Product Strategy</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-5 max-w-3xl">
            {lane.description}
          </p>
        </div>
      </motion.div>

      {/* Status Bar */}
      <div className={`${styles.bg} ${styles.text} border-b ${styles.border}`}>
        <div className="px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.dot}`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${styles.dot}`}
                />
              </span>
              <span className="text-sm font-bold">{styles.label}</span>
            </div>
            <div className="h-3 w-px bg-current opacity-20" />
            <p className="text-xs opacity-70 font-medium max-w-md line-clamp-1">
              {lane.summary || "No summary available"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
              Owner
            </span>
            <div className="w-6 h-6 rounded-full bg-card dark:bg-neutral-800 border-2 border-current flex items-center justify-center text-[9px] font-bold shadow-sm">
              {lane.owner.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Controls Bar
// ═══════════════════════════════════════════════════════════════════════════

interface ControlsBarProps {
  isFocusMode: boolean;
  showLines: boolean;
  onToggleLines: () => void;
  onScrollToToday: () => void;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  onExitFocusMode: () => void;
}

function ControlsBar({
  isFocusMode,
  showLines,
  onToggleLines,
  onScrollToToday,
  onScrollLeft,
  onScrollRight,
  onExitFocusMode,
}: ControlsBarProps) {
  return (
    <div className="px-4 py-2 flex items-center justify-between border-b border-border/60 bg-card/80 dark:bg-neutral-900/80 backdrop-blur-sm z-30 relative">
      {/* Left: Lines toggle + Today */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleLines}
          className={`
            flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors
            ${
              showLines
                ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
                : "text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-neutral-800"
            }
          `}
        >
          <GitBranch className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{showLines ? "Lines On" : "Lines Off"}</span>
        </button>

        <button
          onClick={onScrollToToday}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-secondary text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <Circle className="w-1.5 h-1.5 fill-cyan-500 text-cyan-500" />
          Today
        </button>

        {isFocusMode && (
          <button
            onClick={onExitFocusMode}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors"
          >
            <X className="w-3 h-3" />
            Exit Focus
          </button>
        )}
      </div>

      {/* Right: Navigation + Zoom */}
      <div className="flex items-center gap-2">
        <button
          onClick={onScrollLeft}
          className="p-1.5 rounded-[7px] text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-neutral-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button
          onClick={onScrollRight}
          className="p-1.5 rounded-[7px] text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-neutral-800 transition-colors"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800" />

        <div className="flex items-center gap-1 bg-secondary rounded-[7px] p-0.5">
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-card dark:hover:bg-neutral-700 transition-colors">
            <ZoomOut className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
          <span className="text-[10px] text-muted-foreground w-8 text-center tabular-nums font-mono">
            100%
          </span>
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-card dark:hover:bg-neutral-700 transition-colors">
            <ZoomIn className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════

export function SwimlanesScreen() {
  const [selectedLaneId, setSelectedLaneId] = useState<string | null>(
    swimlanesList[0]?.id || null,
  );
  const [focusedEventId, setFocusedEventId] = useState<string | null>(null);
  const [showLines, setShowLines] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedLane =
    swimlanesList.find((l) => l.id === selectedLaneId) || null;

  // Get events for selected lane
  const laneEvents = useMemo(() => {
    if (!selectedLaneId) return [];
    return timelineData.filter((t) => t.swimlaneId === selectedLaneId);
  }, [selectedLaneId]);

  // Get connected event IDs for focused event
  const connectedEventIds = useMemo(() => {
    if (!focusedEventId) return new Set<string>();

    const focusedEvent = laneEvents.find((e) => e.id === focusedEventId);
    if (!focusedEvent) return new Set<string>();

    const connected = new Set<string>();

    // Direct connections from focused event
    if (focusedEvent.linkedEventId) {
      connected.add(focusedEvent.linkedEventId);
    }

    // Reverse connections (events that link TO the focused event)
    laneEvents.forEach((event) => {
      if (event.linkedEventId === focusedEventId) {
        connected.add(event.id);
      }
    });

    return connected;
  }, [focusedEventId, laneEvents]);

  // Generate weeks
  const weeks = useMemo(() => generateWeekRange(), []);

  // Group events by week
  const eventsByWeek = useMemo(() => {
    const grouped = new Map<number, TimelineItem[]>();
    weeks.forEach((w) => grouped.set(w.weekOffset, []));

    laneEvents.forEach((event) => {
      const eventDate = parseTimestamp(event.timestamp);
      const offset = getWeekOffset(eventDate);
      if (offset >= -4 && offset <= 3) {
        const existing = grouped.get(offset) || [];
        grouped.set(offset, [...existing, event]);
      }
    });

    return grouped;
  }, [laneEvents, weeks]);

  // Find current week index
  const currentWeekIndex = useMemo(
    () => weeks.findIndex((w) => w.isCurrentWeek),
    [weeks],
  );

  // Handle event selection/focus
  const handleSelectEvent = useCallback(
    (eventId: string) => {
      if (focusedEventId === eventId) {
        // Click on already focused event - exit focus mode
        setFocusedEventId(null);
      } else {
        // Enter focus mode for this event
        setFocusedEventId(eventId);
      }
    },
    [focusedEventId],
  );

  // Keyboard: Escape to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusedEventId) {
        setFocusedEventId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedEventId]);

  // Scroll to today on mount/lane change
  useEffect(() => {
    if (scrollRef.current && currentWeekIndex >= 0) {
      const containerWidth = scrollRef.current.clientWidth;
      const columnWidth = 260;
      const targetScroll =
        currentWeekIndex * columnWidth - containerWidth / 2 + columnWidth / 2;
      scrollRef.current.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "auto",
      });
    }
  }, [currentWeekIndex, selectedLaneId]);

  // Reset focus when changing lanes
  useEffect(() => {
    setFocusedEventId(null);
  }, [selectedLaneId]);

  const scrollToToday = useCallback(() => {
    const container = scrollRef.current;
    if (container && currentWeekIndex >= 0) {
      const containerWidth = container.clientWidth;
      const columnWidth = 260;
      const targetScroll =
        currentWeekIndex * columnWidth - containerWidth / 2 + columnWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth",
      });
    }
  }, [currentWeekIndex]);

  const scrollLeft = useCallback(() => {
    const container = scrollRef.current;
    if (container) {
      const currentScroll = container.scrollLeft;
      container.scrollTo({
        left: Math.max(0, currentScroll - 280),
        behavior: "smooth",
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    const container = scrollRef.current;
    if (container) {
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollTo({
        left: Math.min(maxScroll, currentScroll + 280),
        behavior: "smooth",
      });
    }
  }, []);

  const isFocusMode = focusedEventId !== null;

  return (
    <div className="flex h-full overflow-hidden bg-background dark:bg-neutral-950">
      {/* Sidebar */}
      <InitiativeSidebar
        lanes={swimlanesList}
        selectedLaneId={selectedLaneId}
        onSelectLane={setSelectedLaneId}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Initiative Header + Status Bar */}
        <InitiativeHeader lane={selectedLane} />

        {/* Controls */}
        <ControlsBar
          isFocusMode={isFocusMode}
          showLines={showLines}
          onToggleLines={() => setShowLines(!showLines)}
          onScrollToToday={scrollToToday}
          onScrollLeft={scrollLeft}
          onScrollRight={scrollRight}
          onExitFocusMode={() => setFocusedEventId(null)}
        />

        {/* Timeline */}
        <div className="flex-1 relative min-h-0">
          {/* Focus Mode Overlay */}
          <FocusModeOverlay isActive={isFocusMode} />

          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-x-auto overflow-y-auto"
            style={{ scrollbarWidth: "thin" }}
            onClick={(e) => {
              // Exit focus mode when clicking on background (not on a card)
              if (focusedEventId && e.target === e.currentTarget) {
                setFocusedEventId(null);
              }
            }}
          >
            <div
              className="flex h-full"
              style={{ width: `${weeks.length * 260}px`, minHeight: "100%" }}
              onClick={(e) => {
                // Exit focus mode when clicking on background between cards
                if (focusedEventId && e.target === e.currentTarget) {
                  setFocusedEventId(null);
                }
              }}
            >
              {weeks.map((weekData) => (
                <WeekColumn
                  key={weekData.weekOffset}
                  weekData={weekData}
                  events={eventsByWeek.get(weekData.weekOffset) || []}
                  focusedEventId={focusedEventId}
                  connectedEventIds={connectedEventIds}
                  onSelectEvent={handleSelectEvent}
                  onExitFocus={() => setFocusedEventId(null)}
                />
              ))}
            </div>

            {/* Connection Lines */}
            <ConnectionLines
              focusedEventId={focusedEventId}
              connectedEventIds={connectedEventIds}
              showLines={showLines}
              containerRef={scrollRef}
              events={laneEvents}
            />
          </div>

          {/* Gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background dark:from-neutral-950 to-transparent pointer-events-none z-30" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background dark:from-neutral-950 to-transparent pointer-events-none z-30" />
        </div>
      </main>

      {/* Chat Interface Modal */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

export default SwimlanesScreen;
