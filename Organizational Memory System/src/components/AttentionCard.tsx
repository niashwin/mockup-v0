import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MoreHorizontal,
  BadgeCheck,
  Clock,
  ChevronRight,
  Zap,
  Users,
  Target,
  UserCircle,
  Send
} from 'lucide-react';
import { AttentionItem, AttentionType } from '../types';
import { getRelativeTime, calculateAttentionScore, getScoreLabel } from '../utils/AttentionScore';
import { getActionsForItem, getActionButtonClass } from '../utils/ActionPrimitives';

// Category styling and icons
const CATEGORY_CONFIG: Record<AttentionType, {
  icon: React.ElementType;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}> = {
  risk: {
    icon: AlertTriangle,
    label: 'RISK',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800'
  },
  misalignment: {
    icon: Target,
    label: 'MISALIGNMENT',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800'
  },
  blocker: {
    icon: Zap,
    label: 'BLOCKER',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    textColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-200 dark:border-orange-800'
  },
  commitment: {
    icon: CheckCircle2,
    label: 'COMMITMENT',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  meeting: {
    icon: Calendar,
    label: 'MEETING',
    bgColor: 'bg-violet-50 dark:bg-violet-900/20',
    textColor: 'text-violet-600 dark:text-violet-400',
    borderColor: 'border-violet-200 dark:border-violet-800'
  },
  relationship: {
    icon: UserCircle,
    label: 'RELATIONSHIP',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    textColor: 'text-pink-600 dark:text-pink-400',
    borderColor: 'border-pink-200 dark:border-pink-800'
  },
  followup: {
    icon: Send,
    label: 'FOLLOW-UP',
    bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-200 dark:border-cyan-800'
  }
};

// Truncation helpers
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

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
  const [showFullRationale, setShowFullRationale] = useState(false);

  // Get attention type, defaulting based on item type
  const attentionType: AttentionType = item.attentionType ||
    (item.itemType === 'alert' ? 'risk' :
     item.itemType === 'meeting' ? 'meeting' :
     item.itemType === 'relationship' ? 'relationship' : 'commitment');

  const config = CATEGORY_CONFIG[attentionType];
  const CategoryIcon = config.icon;

  // Get title and context based on item type
  const getTitle = (): string => {
    return item.title;
  };

  const getContext = (): string => {
    switch (item.itemType) {
      case 'alert':
        return item.description;
      case 'commitment':
        return item.context || '';
      case 'meeting':
        return item.summary;
      case 'relationship':
        return item.description;
      default:
        return '';
    }
  };

  // Get timestamp
  const getTimestamp = (): string => {
    switch (item.itemType) {
      case 'alert':
        return item.timestamp;
      case 'commitment':
        return item.dueDate || '';
      case 'meeting':
        return item.timestamp;
      case 'relationship':
        return item.lastContactDate;
      default:
        return '';
    }
  };

  const title = truncateText(getTitle(), 80);
  const context = truncateText(getContext(), 120);
  const relativeTime = getRelativeTime(getTimestamp());
  const score = calculateAttentionScore(item);
  const hasEvidence = item.evidence && item.evidence.length > 0;

  // Get available actions
  const actions = getActionsForItem(item);

  // For compact mode
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
          <div className={`w-6 h-6 rounded-full ${config.bgColor} flex items-center justify-center ${config.textColor}`}>
            <CategoryIcon size={12} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{title}</p>
          </div>
          <span className="text-[10px] text-zinc-400 tabular-nums shrink-0">{relativeTime}</span>
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
      className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/20 transition-all duration-300 group"
    >
      {/* Fixed 7-line structure */}
      <div className="p-5">
        {/* Line 1: Category + Time + More */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
              <CategoryIcon size={12} strokeWidth={2.5} />
              <span className="text-[10px] font-bold tracking-wider">{config.label}</span>
            </div>
            <span className="text-[10px] text-zinc-400 tabular-nums">{relativeTime}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); /* Show more options */ }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>

        {/* Lines 2-3: Title (2 lines max) */}
        <h3
          onClick={() => onExpand(item)}
          className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug"
        >
          {title}
        </h3>

        {/* Lines 4-5: Context (2 lines max) */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2 leading-relaxed">
          {context}
        </p>

        {/* Line 6: WHY line - explains why this surfaced */}
        {item.memoryRationale && (
          <div
            className={`flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 mb-4 transition-all ${showFullRationale ? '' : 'cursor-pointer'}`}
            onClick={() => !showFullRationale && setShowFullRationale(true)}
            onMouseLeave={() => setShowFullRationale(false)}
          >
            <span className="text-zinc-400 shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </span>
            <p className={`text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 ${showFullRationale ? '' : 'line-clamp-2'}`}>
              {item.memoryRationale}
            </p>
            {hasEvidence && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowEvidence?.(item);
                }}
                className="shrink-0 flex items-center gap-1 text-[10px] font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                <BadgeCheck size={12} />
                <span>Sources</span>
              </button>
            )}
          </div>
        )}

        {/* Line 7: Actions (colored by type) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Context actions (gray) */}
          {actions.context.slice(0, 1).map(action => (
            <button
              key={action.id}
              onClick={(e) => { e.stopPropagation(); onAction(action.id, item); }}
              className={getActionButtonClass(action.category)}
            >
              {action.label}
            </button>
          ))}

          {/* Execute actions (blue) */}
          {actions.execute.slice(0, 1).map(action => (
            <button
              key={action.id}
              onClick={(e) => { e.stopPropagation(); onAction(action.id, item); }}
              className={getActionButtonClass(action.category)}
            >
              {action.label}
            </button>
          ))}

          {/* Collaborate actions (green) */}
          {actions.collaborate.slice(0, 1).map(action => (
            <button
              key={action.id}
              onClick={(e) => { e.stopPropagation(); onAction(action.id, item); }}
              className={getActionButtonClass(action.category)}
            >
              {action.label}
            </button>
          ))}

          {/* Collaborators indicator */}
          {item.collaborators && item.collaborators.length > 0 && (
            <div className="ml-auto flex items-center gap-1 text-[10px] text-zinc-400">
              <Users size={12} />
              <span>{item.collaborators.length}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

AttentionCard.displayName = 'AttentionCard';

export default AttentionCard;
