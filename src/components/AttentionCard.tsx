import React, { useState, forwardRef } from 'react';
import { motion } from 'motion/react';
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
  RotateCcw
} from 'lucide-react';
import { AttentionItem, AttentionType } from '../types';

// Category styling and icons
const CATEGORY_CONFIG: Record<AttentionType, {
  icon: React.ElementType;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
}> = {
  risk: {
    icon: AlertTriangle,
    label: 'RISK',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800',
    accentColor: 'bg-red-500'
  },
  misalignment: {
    icon: Target,
    label: 'MISALIGNMENT',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800',
    accentColor: 'bg-amber-500'
  },
  blocker: {
    icon: Zap,
    label: 'BLOCKER',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    textColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-200 dark:border-orange-800',
    accentColor: 'bg-orange-500'
  },
  commitment: {
    icon: CheckCircle2,
    label: 'COMMITMENT',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
    accentColor: 'bg-blue-500'
  },
  meeting: {
    icon: Calendar,
    label: 'MEETING',
    bgColor: 'bg-violet-50 dark:bg-violet-900/20',
    textColor: 'text-violet-600 dark:text-violet-400',
    borderColor: 'border-violet-200 dark:border-violet-800',
    accentColor: 'bg-violet-500'
  },
  relationship: {
    icon: UserCircle,
    label: 'RELATIONSHIP',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    textColor: 'text-pink-600 dark:text-pink-400',
    borderColor: 'border-pink-200 dark:border-pink-800',
    accentColor: 'bg-pink-500'
  },
  followup: {
    icon: Send,
    label: 'FOLLOW-UP',
    bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    accentColor: 'bg-cyan-500'
  }
};

// Get time indicator - always visible, same location (Item 1: time as first-class concept)
function getTimeIndicator(item: AttentionItem): string {
  // Use memory metadata if available
  if (item.memory?.activeDays !== undefined) {
    const days = item.memory.activeDays;
    if (days === 0) return 'Active today';
    if (days === 1) return 'Active for 1 day';
    return `Active for ${days} days`;
  }

  // Fallback: derive from item data
  if (item.isEscalated) return 'Escalated today';
  if (item.memory?.resurfacedAt) {
    const daysAgo = Math.floor((Date.now() - new Date(item.memory.resurfacedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo === 0) return 'Resurfaced today';
    return `Resurfaced ${daysAgo}d ago`;
  }
  if (item.isNew) return 'Active today';

  // Derive from item timestamps when no memory metadata
  switch (item.itemType) {
    case 'alert':
      // Calculate days since alert timestamp
      const alertDate = new Date(item.timestamp);
      const alertDaysAgo = Math.floor((Date.now() - alertDate.getTime()) / (1000 * 60 * 60 * 24));
      if (alertDaysAgo === 0) return 'Active today';
      if (alertDaysAgo === 1) return 'Active for 1 day';
      return `Active for ${alertDaysAgo} days`;

    case 'commitment':
      // Show relative to due date
      if (item.status === 'overdue') return 'Overdue';
      return 'Active';

    case 'meeting':
      return 'Scheduled';

    case 'relationship':
      if (item.daysSinceContact > 30) return `${item.daysSinceContact}d since contact`;
      return 'Active';

    default:
      return 'Active';
  }
}

// Get reappearance indicator (Item 3: encode reappearance as distinct state)
function getReappearanceInfo(item: AttentionItem): { isResurfaced: boolean; label: string } | null {
  if (item.memory?.hasAppearedBefore && item.memory?.lifecycleState === 'resurfaced') {
    const reason = item.memory.resurfaceReason || 'conditions changed';
    return {
      isResurfaced: true,
      label: `Back in focus · ${reason}`
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
    case 'risk':
    case 'alert':
      return item.itemType === 'alert' ? item.description : 'Signal detected that may affect downstream work.';
    case 'misalignment':
      return 'Multiple sources indicate conflicting direction.';
    case 'blocker':
      return 'Other work is waiting on this to be resolved.';
    case 'commitment':
      if (item.itemType === 'commitment' && item.status === 'overdue') {
        return 'Deadline has passed without recorded resolution.';
      }
      return item.itemType === 'commitment' && item.context
        ? item.context
        : 'Approaching deadline with no recorded progress.';
    case 'meeting':
      return item.itemType === 'meeting' ? item.summary : 'Scheduled coordination requires preparation.';
    case 'relationship':
      return 'Contact frequency has dropped below typical pattern.';
    case 'followup':
      return 'Response window affects relationship trajectory.';
    default:
      return '';
  }
}

// Get deadline/time context for secondary display
function getDeadlineContext(item: AttentionItem): string | null {
  switch (item.itemType) {
    case 'commitment':
      return item.dueDate ? `Due ${item.dueDate}` : null;
    case 'meeting':
      return item.time || null;
    case 'relationship':
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
  isCompact?: boolean;
}

export const AttentionCard = forwardRef<HTMLDivElement, AttentionCardProps>(({
  item,
  onAction,
  onExpand,
  onShowEvidence,
  isCompact = false
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get attention type
  const attentionType: AttentionType = item.attentionType ||
    (item.itemType === 'alert' ? 'risk' :
     item.itemType === 'meeting' ? 'meeting' :
     item.itemType === 'relationship' ? 'relationship' : 'commitment');

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
        className="p-3 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-1 h-8 rounded-full ${config.accentColor}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{getTitle()}</p>
            {/* Item 1: Time indicator always visible */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{timeIndicator}</p>
          </div>
          {/* Item 3: Reappearance indicator */}
          {reappearance && (
            <RotateCcw size={12} className="text-zinc-400" />
          )}
          <ArrowRight size={14} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
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
        {/* Header: Category + Time indicator (Item 1: always visible, same location) */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor} ${config.textColor}`}>
              <CategoryIcon size={12} strokeWidth={2.5} />
              <span className="text-[10px] font-bold tracking-wider">{config.label}</span>
            </div>

            {/* Item 1: Time indicator - always visible */}
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              <Clock size={10} />
              <span>{timeIndicator}</span>
            </div>
          </div>

          {/* Deadline context (if applicable) */}
          {deadlineContext && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {deadlineContext}
            </div>
          )}
        </div>

        {/* Item 3: Reappearance indicator (quiet styling) */}
        {reappearance && (
          <div className="flex items-center gap-1.5 mb-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            <RotateCcw size={10} />
            <span>{reappearance.label}</span>
          </div>
        )}

        {/* Item 4: Title as system state (decision/dependency/risk/opportunity) */}
        <div
          onClick={() => onExpand(item)}
          className="mb-3 cursor-pointer"
        >
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {getTitle()}
          </h3>
        </div>

        {/* Item 8: Ranking rationale - why this is here instead of something else */}
        <div className="mb-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {rankingRationale}
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
              {item.evidence.length} source{item.evidence.length > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Item 9: Homepage only allows awareness, not dismissal - single action only */}
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
});

AttentionCard.displayName = 'AttentionCard';

export default AttentionCard;
