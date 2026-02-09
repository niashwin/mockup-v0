import React, { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  Calendar,
  CalendarDays,
  Clock,
  Zap,
  Target,
  UserCircle,
  Send,
  ArrowRight,
  Eye,
  RotateCcw,
  ChevronRight,
  Mail,
  MessageSquare,
  FileText,
} from "lucide-react";
import { AttentionItem, AttentionType } from "../types";

// Quick Action types - only low-risk, obvious, supportive actions
interface QuickAction {
  id: string;
  label: string; // Short label for hover
  previewText: string; // What it will do
  icon: React.ElementType;
  actionType: "email" | "message" | "request";
}

// Determine the single quick action for an item
// Criteria: Low risk, Obvious, Supportive - never finalizes decisions or marks resolved
function getQuickAction(item: AttentionItem): QuickAction | null {
  const type = item.attentionType || item.itemType;

  switch (type) {
    case "relationship":
      // Follow-ups and check-ins
      if (item.itemType === "relationship") {
        if (
          item.title.includes("follow-up") ||
          item.title.includes("asked for")
        ) {
          return {
            id: "draft-followup",
            label: "Quick action",
            previewText: "Draft follow-up",
            icon: Mail,
            actionType: "email",
          };
        }
        return {
          id: "draft-checkin",
          label: "Quick action",
          previewText: "Draft check-in",
          icon: Mail,
          actionType: "email",
        };
      }
      return {
        id: "draft-message",
        label: "Quick action",
        previewText: "Draft message",
        icon: Mail,
        actionType: "email",
      };

    case "followup":
      return {
        id: "draft-followup",
        label: "Quick action",
        previewText: "Prepare follow-up",
        icon: Mail,
        actionType: "email",
      };

    case "commitment":
      // Draft update or nudge
      if (item.itemType === "commitment") {
        if (
          item.status === "overdue" ||
          item.title.toLowerCase().includes("waiting")
        ) {
          return {
            id: "draft-update",
            label: "Quick action",
            previewText: "Draft update",
            icon: Mail,
            actionType: "email",
          };
        }
        // For pending commitments - send a status update
        return {
          id: "draft-update",
          label: "Quick action",
          previewText: "Send update",
          icon: Mail,
          actionType: "email",
        };
      }
      return {
        id: "draft-update",
        label: "Quick action",
        previewText: "Draft update",
        icon: Mail,
        actionType: "email",
      };

    case "blocker":
      // Nudges and clarifications
      return {
        id: "draft-nudge",
        label: "Quick action",
        previewText: "Draft nudge",
        icon: MessageSquare,
        actionType: "message",
      };

    case "misalignment":
      // Request for clarification or sync
      return {
        id: "request-sync",
        label: "Quick action",
        previewText: "Request sync",
        icon: MessageSquare,
        actionType: "message",
      };

    case "risk":
      // Flag or escalate
      return {
        id: "draft-escalation",
        label: "Quick action",
        previewText: "Draft escalation",
        icon: Mail,
        actionType: "email",
      };

    case "meeting":
      // Send prep note or agenda request
      return {
        id: "send-prep",
        label: "Quick action",
        previewText: "Send prep note",
        icon: Mail,
        actionType: "email",
      };

    default:
      // Default: draft a message
      return {
        id: "draft-message",
        label: "Quick action",
        previewText: "Draft message",
        icon: Mail,
        actionType: "email",
      };
  }
}

// Category styling and icons
const CATEGORY_CONFIG: Record<
  AttentionType,
  {
    icon: React.ElementType;
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    accentColor: string;
  }
> = {
  risk: {
    icon: AlertTriangle,
    label: "RISK",
    bgColor: "bg-neutral-100 dark:bg-neutral-800/60",
    textColor: "text-red-600 dark:text-red-400",
    borderColor: "border-neutral-200 dark:border-neutral-700",
    accentColor: "bg-red-500",
  },
  misalignment: {
    icon: Target,
    label: "MISALIGNMENT",
    bgColor: "bg-neutral-100 dark:bg-neutral-800/60",
    textColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-neutral-200 dark:border-neutral-700",
    accentColor: "bg-amber-500",
  },
  blocker: {
    icon: Zap,
    label: "BLOCKER",
    bgColor: "bg-neutral-100 dark:bg-neutral-800/60",
    textColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-neutral-200 dark:border-neutral-700",
    accentColor: "bg-orange-500",
  },
  commitment: {
    icon: CheckCircle2,
    label: "COMMITMENT",
    bgColor: "bg-neutral-100 dark:bg-neutral-800/60",
    textColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-neutral-200 dark:border-neutral-700",
    accentColor: "bg-blue-500",
  },
  meeting: {
    icon: Calendar,
    label: "MEETING",
    bgColor: "bg-neutral-100 dark:bg-neutral-800/60",
    textColor: "text-violet-600 dark:text-violet-400",
    borderColor: "border-neutral-200 dark:border-neutral-700",
    accentColor: "bg-violet-500",
  },
  relationship: {
    icon: UserCircle,
    label: "RELATIONSHIP",
    bgColor: "bg-neutral-100 dark:bg-neutral-800/60",
    textColor: "text-slate-600 dark:text-slate-400",
    borderColor: "border-neutral-200 dark:border-neutral-700",
    accentColor: "bg-slate-500",
  },
  followup: {
    icon: Send,
    label: "FOLLOW-UP",
    bgColor: "bg-neutral-100 dark:bg-neutral-800/60",
    textColor: "text-teal-600 dark:text-teal-400",
    borderColor: "border-neutral-200 dark:border-neutral-700",
    accentColor: "bg-teal-500",
  },
};

// Get time indicator - always visible, same location (Item 1: time as first-class concept)
function getTimeIndicator(item: AttentionItem): string {
  // Use memory metadata if available
  if (item.memory?.activeDays !== undefined) {
    const days = item.memory.activeDays;
    if (days === 0) return "Active today";
    if (days === 1) return "Active for 1 day";
    return `Active for ${days} days`;
  }

  // Fallback: derive from item data
  if (item.isEscalated) return "Escalated today";
  if (item.memory?.resurfacedAt) {
    const daysAgo = Math.floor(
      (Date.now() - new Date(item.memory.resurfacedAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (daysAgo === 0) return "Resurfaced today";
    return `Resurfaced ${daysAgo}d ago`;
  }
  if (item.isNew) return "Active today";

  // Derive from item timestamps when no memory metadata
  switch (item.itemType) {
    case "alert":
      // Calculate days since alert timestamp
      const alertDate = new Date(item.timestamp);
      const alertDaysAgo = Math.floor(
        (Date.now() - alertDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (alertDaysAgo === 0) return "Active today";
      if (alertDaysAgo === 1) return "Active for 1 day";
      return `Active for ${alertDaysAgo} days`;

    case "commitment":
      // Show relative to due date
      if (item.status === "overdue") return "Overdue";
      return "Active";

    case "meeting":
      return "Scheduled";

    case "relationship":
      if (item.daysSinceContact > 30)
        return `${item.daysSinceContact}d since contact`;
      return "Active";

    default:
      return "Active";
  }
}

// Get reappearance indicator (Item 3: encode reappearance as distinct state)
function getReappearanceInfo(
  item: AttentionItem,
): { isResurfaced: boolean; label: string } | null {
  if (
    item.memory?.hasAppearedBefore &&
    item.memory?.lifecycleState === "resurfaced"
  ) {
    const reason = item.memory.resurfaceReason || "conditions changed";
    return {
      isResurfaced: true,
      label: `Back in focus · ${reason}`,
    };
  }
  return null;
}

// Get ranking rationale (Item 8: make ranking legible in plain language)
function getRankingRationale(item: AttentionItem): string {
  // Use memory metadata if available
  if (item.memory?.rankingRationale) return item.memory.rankingRationale;
  if (item.memoryRationale) return item.memoryRationale;

  const type = item.attentionType || item.itemType;

  // Default rationales explaining why this is here instead of something else
  switch (type) {
    case "risk":
    case "alert":
      return item.itemType === "alert"
        ? item.description
        : "Signal detected that may affect downstream work.";
    case "misalignment":
      return "Multiple sources indicate conflicting direction.";
    case "blocker":
      return "Other work is waiting on this to be resolved.";
    case "commitment":
      if (item.itemType === "commitment" && item.status === "overdue") {
        return "Deadline has passed without recorded resolution.";
      }
      return item.itemType === "commitment" && item.context
        ? item.context
        : "Approaching deadline with no recorded progress.";
    case "meeting":
      return item.itemType === "meeting"
        ? item.summary
        : "Scheduled coordination requires preparation.";
    case "relationship":
      return "Contact frequency has dropped below typical pattern.";
    case "followup":
      return "Response window affects relationship trajectory.";
    default:
      return "";
  }
}

// Get deadline/time context for secondary display
function getDeadlineContext(item: AttentionItem): string | null {
  switch (item.itemType) {
    case "commitment":
      return item.dueDate ? `Due ${item.dueDate}` : null;
    case "meeting":
      return item.time || null;
    case "relationship":
      return `${item.daysSinceContact} days since contact`;
    default:
      return null;
  }
}

interface AttentionCardProps {
  item: AttentionItem;
  onAction: (actionId: string, item: AttentionItem) => void;
  onExpand: (item: AttentionItem) => void;
  onShowEvidence?: (item: AttentionItem) => void;
  onQuickAction?: (actionId: string, item: AttentionItem) => void;
  onSchedule?: (item: AttentionItem) => void;
  isCompact?: boolean;
}

// Helper to determine if an item should show the Schedule action
function shouldShowScheduleAction(item: AttentionItem): boolean {
  const type = item.attentionType || item.itemType;
  // Show schedule for relationship, meeting, and commitment types
  return ["relationship", "meeting", "commitment"].includes(type);
}

export const AttentionCard = forwardRef<HTMLDivElement, AttentionCardProps>(
  (
    {
      item,
      onAction,
      onExpand,
      onShowEvidence,
      onQuickAction,
      onSchedule,
      isCompact = false,
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isQuickActionHovered, setIsQuickActionHovered] = useState(false);
    const [isScheduleHovered, setIsScheduleHovered] = useState(false);

    // Get quick action for this item (if eligible)
    const quickAction = getQuickAction(item);

    // Get attention type
    const attentionType: AttentionType =
      item.attentionType ||
      (item.itemType === "alert"
        ? "risk"
        : item.itemType === "meeting"
          ? "meeting"
          : item.itemType === "relationship"
            ? "relationship"
            : "commitment");

    const config = CATEGORY_CONFIG[attentionType];
    const CategoryIcon = config.icon;

    // Item 1: Time as first-class concept
    const timeIndicator = getTimeIndicator(item);

    // Item 3: Reappearance as distinct state
    const reappearance = getReappearanceInfo(item);

    // Item 8: Ranking rationale in plain language
    const rankingRationale = getRankingRationale(item);

    // Deadline/time context (secondary)
    const deadlineContext = getDeadlineContext(item);

    // Item 4: Title as system state, not personal obligation
    const getTitle = (): string => item.title;

    // Compact mode
    if (isCompact) {
      return (
        <motion.div
          ref={ref}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onClick={() => onExpand(item)}
          className="p-3 bg-card/80 dark:bg-neutral-900/80 border border-border/60 rounded-[7px] cursor-pointer hover:bg-card dark:hover:bg-neutral-900 hover:border-border transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className={`w-1 h-8 rounded-full ${config.accentColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {getTitle()}
              </p>
              {/* Item 1: Time indicator always visible */}
              <p className="text-xs text-muted-foreground mt-0.5">
                {timeIndicator}
              </p>
            </div>
            {/* Item 3: Reappearance indicator */}
            {reappearance && (
              <RotateCcw size={12} className="text-muted-foreground" />
            )}
            <ArrowRight
              size={14}
              className="text-muted-foreground group-hover:text-muted-foreground transition-colors"
            />
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-card dark:bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 group"
      >
        {/* Accent bar */}
        <div className={`h-1 ${config.accentColor}`} />

        <div className="p-5">
          {/* Header: Category + Time indicator (Item 1: always visible, same location) */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor} ${config.textColor}`}
              >
                <CategoryIcon size={12} strokeWidth={2.5} />
                <span className="text-[10px] font-bold tracking-wider">
                  {config.label}
                </span>
              </div>

              {/* Item 1: Time indicator - always visible */}
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock size={10} />
                <span>{timeIndicator}</span>
              </div>
            </div>

            {/* Deadline context (if applicable) */}
            {deadlineContext && (
              <div className="text-xs text-muted-foreground">
                {deadlineContext}
              </div>
            )}
          </div>

          {/* Item 3: Reappearance indicator (quiet styling) */}
          {reappearance && (
            <div className="flex items-center gap-1.5 mb-2 text-[11px] text-muted-foreground">
              <RotateCcw size={10} />
              <span>{reappearance.label}</span>
            </div>
          )}

          {/* Item 4: Title as system state (decision/dependency/risk/opportunity) */}
          <div className="mb-3">
            <h3 className="text-base font-semibold text-foreground leading-snug">
              {getTitle()}
            </h3>
          </div>

          {/* Item 8: Ranking rationale - why this is here instead of something else */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {rankingRationale}
            </p>
            {item.evidence && item.evidence.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowEvidence?.(item);
                }}
                className="mt-2 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Eye size={10} />
                {item.evidence.length} source
                {item.evidence.length > 1 ? "s" : ""}
              </button>
            )}
          </div>

          {/* Item 9: Homepage only allows awareness, not dismissal - single action only */}
          {/* Quick action affordance - subtle, adjacent to See details */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onExpand(item)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[7px] text-sm font-medium transition-all ${config.bgColor} text-black dark:text-black border ${config.borderColor} cursor-pointer`}
            >
              See details
            </button>

            {/* Schedule action - shown for relationship, meeting, commitment types */}
            {shouldShowScheduleAction(item) && onSchedule && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSchedule(item);
                  }}
                  onMouseEnter={() => setIsScheduleHovered(true)}
                  onMouseLeave={() => setIsScheduleHovered(false)}
                  className="p-2.5 rounded-[7px] border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 transition-colors duration-200"
                  aria-label="Schedule meeting"
                >
                  <CalendarDays size={16} />
                </button>

                {/* Hover tooltip for schedule */}
                <AnimatePresence>
                  {isScheduleHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-primary dark:bg-card rounded-[7px] shadow-lg border border-border whitespace-nowrap z-10"
                    >
                      <div className="flex items-center gap-2">
                        <CalendarDays size={12} className="text-accent" />
                        <span className="text-xs font-medium text-white">
                          Schedule meeting
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Find a time
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute -bottom-1 right-3 w-2 h-2 bg-primary dark:bg-card border-r border-b border-border rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Quick action - only shown if eligible action exists */}
            {quickAction && onQuickAction && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAction(quickAction.id, item);
                  }}
                  onMouseEnter={() => setIsQuickActionHovered(true)}
                  onMouseLeave={() => setIsQuickActionHovered(false)}
                  className="p-2.5 rounded-[7px] border border-border bg-background dark:bg-card/50 text-muted-foreground hover:bg-muted dark:hover:bg-neutral-800 hover:text-foreground transition-all"
                  aria-label={quickAction.previewText}
                >
                  <ChevronRight size={16} />
                </button>

                {/* Hover tooltip showing the action preview */}
                <AnimatePresence>
                  {isQuickActionHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-primary dark:bg-card rounded-[7px] shadow-lg border border-border whitespace-nowrap z-10"
                    >
                      <div className="flex items-center gap-2">
                        <quickAction.icon
                          size={12}
                          className="text-muted-foreground"
                        />
                        <span className="text-xs font-medium text-white">
                          {quickAction.previewText}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {quickAction.label}
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute -bottom-1 right-3 w-2 h-2 bg-primary dark:bg-card border-r border-b border-border rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  },
);

AttentionCard.displayName = "AttentionCard";

export default AttentionCard;
