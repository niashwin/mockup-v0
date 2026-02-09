import React, { useState, forwardRef } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Zap,
  Target,
  UserCircle,
  Send,
  ArrowRight,
  Eye,
  AlertCircle,
  TrendingUp,
  Bell,
} from "lucide-react";
import { AttentionItem, AttentionType } from "../types";

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
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-200 dark:border-red-800",
    accentColor: "bg-red-500",
  },
  misalignment: {
    icon: Target,
    label: "MISALIGNMENT",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    textColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800",
    accentColor: "bg-amber-500",
  },
  blocker: {
    icon: Zap,
    label: "BLOCKER",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    textColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-800",
    accentColor: "bg-orange-500",
  },
  commitment: {
    icon: CheckCircle2,
    label: "COMMITMENT",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
    accentColor: "bg-blue-500",
  },
  meeting: {
    icon: Calendar,
    label: "MEETING",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    textColor: "text-violet-600 dark:text-violet-400",
    borderColor: "border-violet-200 dark:border-violet-800",
    accentColor: "bg-violet-500",
  },
  relationship: {
    icon: UserCircle,
    label: "RELATIONSHIP",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    textColor: "text-pink-600 dark:text-pink-400",
    borderColor: "border-pink-200 dark:border-pink-800",
    accentColor: "bg-pink-500",
  },
  followup: {
    icon: Send,
    label: "FOLLOW-UP",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    textColor: "text-cyan-600 dark:text-cyan-400",
    borderColor: "border-cyan-200 dark:border-cyan-800",
    accentColor: "bg-cyan-500",
  },
};

// Get surfacing reason - WHY this appeared NOW (Principle 2: explicit ranking rationale)
function getSurfacingReason(item: AttentionItem): {
  text: string;
  isNew: boolean;
  isEscalated: boolean;
} {
  const type = item.attentionType || item.itemType;

  // Check for recent changes (Principle 4 & 8: emphasize change, "what changed" cue)
  const isNew = item.isNew || false;
  const isEscalated = item.isEscalated || false;

  if (isEscalated) {
    return { text: "Escalated today", isNew: false, isEscalated: true };
  }
  if (isNew) {
    return { text: "New", isNew: true, isEscalated: false };
  }

  switch (type) {
    case "risk":
    case "alert":
      return { text: "New signal detected", isNew: false, isEscalated: false };
    case "misalignment":
      return {
        text: "Pattern detected across sources",
        isNew: false,
        isEscalated: false,
      };
    case "blocker":
      return {
        text: "Downstream dependency waiting",
        isNew: false,
        isEscalated: false,
      };
    case "commitment":
      if (item.itemType === "commitment" && item.status === "overdue") {
        return { text: "Deadline crossed", isNew: false, isEscalated: true };
      }
      return { text: "Deadline approaching", isNew: false, isEscalated: false };
    case "meeting":
      return { text: "Starting soon", isNew: false, isEscalated: false };
    case "relationship":
      return { text: "Contact gap growing", isNew: false, isEscalated: false };
    case "followup":
      return {
        text: "Response window closing",
        isNew: false,
        isEscalated: false,
      };
    default:
      return { text: "Surfaced now", isNew: false, isEscalated: false };
  }
}

// Get impact narrative - WHY this matters (Principle 5 & 6: narrative over math, why before what)
function getImpactNarrative(item: AttentionItem): string {
  // If item has a custom impact narrative, use it
  if (item.impactNarrative) return item.impactNarrative;
  if (item.memoryRationale) return item.memoryRationale;

  const type = item.attentionType || item.itemType;

  switch (type) {
    case "risk":
    case "alert":
      return item.itemType === "alert"
        ? item.description
        : "May require immediate attention to prevent escalation.";
    case "misalignment":
      return "Creates conflicting decisions if not addressed.";
    case "blocker":
      return "Blocks downstream work until resolved.";
    case "commitment":
      return item.itemType === "commitment" && item.context
        ? item.context
        : "Affects trust and planning accuracy.";
    case "meeting":
      return item.itemType === "meeting"
        ? item.summary
        : "Coordination opportunity.";
    case "relationship":
      return "Relationship momentum may be declining.";
    case "followup":
      return "Response window affects relationship trajectory.";
    default:
      return "";
  }
}

// Get time context (WHEN)
function getTimeContext(item: AttentionItem): string {
  switch (item.itemType) {
    case "commitment":
      return item.dueDate || "";
    case "meeting":
      return item.time || "";
    case "alert":
      return "";
    case "relationship":
      return `${item.daysSinceContact} days`;
    default:
      return "";
  }
}

interface AttentionCardProps {
  item: AttentionItem;
  onAction: (actionId: string, item: AttentionItem) => void;
  onExpand: (item: AttentionItem) => void;
  onShowEvidence?: (item: AttentionItem) => void;
  isCompact?: boolean;
}

export const AttentionCard = forwardRef<HTMLDivElement, AttentionCardProps>(
  ({ item, onAction, onExpand, onShowEvidence, isCompact = false }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

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
    const surfacingReason = getSurfacingReason(item);
    const impactNarrative = getImpactNarrative(item);
    const timeContext = getTimeContext(item);

    // Get title - reframed as observation about the world (Principle 1 & 9)
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
          className="p-3 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className={`w-1 h-8 rounded-full ${config.accentColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {getTitle()}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {surfacingReason.text}
              </p>
            </div>
            {(surfacingReason.isNew || surfacingReason.isEscalated) && (
              <div
                className={`w-2 h-2 rounded-full ${surfacingReason.isEscalated ? "bg-red-500" : "bg-blue-500"}`}
              />
            )}
            <ArrowRight
              size={14}
              className="text-zinc-400 group-hover:text-zinc-600 transition-colors"
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
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/20 transition-all duration-300 group"
      >
        {/* Accent bar */}
        <div className={`h-1 ${config.accentColor}`} />

        <div className="p-5">
          {/* Header: Category + Surfacing reason + "What changed" indicator */}
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

              {/* Surfacing reason - WHY NOW (Principle 2) */}
              <div
                className={`flex items-center gap-1 text-[11px] ${
                  surfacingReason.isEscalated
                    ? "text-red-600 dark:text-red-400 font-medium"
                    : surfacingReason.isNew
                      ? "text-blue-600 dark:text-blue-400 font-medium"
                      : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {surfacingReason.isEscalated && <TrendingUp size={10} />}
                {surfacingReason.isNew && <Bell size={10} />}
                <span>{surfacingReason.text}</span>
              </div>
            </div>

            {/* Time context - WHEN */}
            {timeContext && (
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <Clock size={12} />
                <span className="text-xs">{timeContext}</span>
              </div>
            )}
          </div>

          {/* WHAT: Observation about the world (Principle 1) */}
          <div onClick={() => onExpand(item)} className="mb-3 cursor-pointer">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {getTitle()}
            </h3>
          </div>

          {/* WHY THIS MATTERS: Impact narrative (Principle 5 & 6) */}
          <div className="mb-4">
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {impactNarrative}
            </p>
            {item.evidence && item.evidence.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowEvidence?.(item);
                }}
                className="mt-2 text-[11px] font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors flex items-center gap-1"
              >
                <Eye size={10} />
                {item.evidence.length} source
                {item.evidence.length > 1 ? "s" : ""}
              </button>
            )}
          </div>

          {/* Single primary action - orientation, not execution (Principle 7 & 10) */}
          <button
            onClick={() => onExpand(item)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${config.bgColor} ${config.textColor} border ${config.borderColor} hover:shadow-md`}
          >
            <Eye size={14} />
            See details
          </button>
        </div>
      </motion.div>
    );
  },
);

AttentionCard.displayName = "AttentionCard";

export default AttentionCard;
