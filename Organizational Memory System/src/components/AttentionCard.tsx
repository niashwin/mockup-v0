import React, { useState, forwardRef } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MoreHorizontal,
  Clock,
  Zap,
  Target,
  UserCircle,
  Send,
  ArrowRight,
  MessageSquare,
  Eye,
  UserPlus,
  CheckCheck,
  Mail,
  Video,
  AlertCircle
} from 'lucide-react';
import { AttentionItem, AttentionType } from '../types';
import { getRelativeTime } from '../utils/AttentionScore';

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

// Get suggested action text based on item type
function getSuggestedAction(item: AttentionItem): { text: string; icon: React.ElementType } {
  const type = item.attentionType || item.itemType;

  switch (type) {
    case 'risk':
    case 'alert':
      return { text: 'Review and acknowledge', icon: Eye };
    case 'misalignment':
      return { text: 'Align with stakeholders', icon: MessageSquare };
    case 'blocker':
      return { text: 'Unblock or escalate', icon: Zap };
    case 'commitment':
      if (item.itemType === 'commitment' && item.status === 'overdue') {
        return { text: 'Complete or reschedule', icon: AlertCircle };
      }
      return { text: 'Complete this commitment', icon: CheckCheck };
    case 'meeting':
      return { text: 'Prepare and join', icon: Video };
    case 'relationship':
      return { text: 'Reconnect with them', icon: Mail };
    case 'followup':
      return { text: 'Follow up now', icon: Send };
    default:
      return { text: 'Take action', icon: ArrowRight };
  }
}

// Get urgency display
function getUrgencyDisplay(item: AttentionItem): { text: string; isUrgent: boolean; color: string } {
  let deadline = '';
  let isUrgent = false;

  switch (item.itemType) {
    case 'commitment':
      deadline = item.dueDate || '';
      isUrgent = item.status === 'overdue' || deadline.toLowerCase().includes('today') || deadline.toLowerCase().includes('overdue');
      break;
    case 'meeting':
      deadline = item.time || '';
      isUrgent = deadline.toLowerCase().includes('in ') || deadline.toLowerCase().includes('now');
      break;
    case 'alert':
      const time = getRelativeTime(item.timestamp);
      deadline = time;
      isUrgent = item.severity === 'critical';
      break;
    case 'relationship':
      deadline = `${item.daysSinceContact} days since contact`;
      isUrgent = item.daysSinceContact > 30;
      break;
  }

  const color = isUrgent ? 'text-red-600 dark:text-red-400' : 'text-zinc-500 dark:text-zinc-400';

  return { text: deadline, isUrgent, color };
}

// Get contextual choices based on item type
function getContextualChoices(item: AttentionItem): Array<{ id: string; label: string; icon: React.ElementType; primary?: boolean }> {
  const type = item.attentionType || item.itemType;

  switch (type) {
    case 'risk':
    case 'alert':
      return [
        { id: 'acknowledge', label: 'Acknowledge', icon: CheckCheck, primary: true },
        { id: 'view-source', label: 'See Details', icon: Eye },
        { id: 'escalate', label: 'Escalate', icon: UserPlus }
      ];
    case 'misalignment':
      return [
        { id: 'schedule-sync', label: 'Schedule Sync', icon: Calendar, primary: true },
        { id: 'view-context', label: 'See Context', icon: Eye },
        { id: 'comment', label: 'Add Note', icon: MessageSquare }
      ];
    case 'blocker':
      return [
        { id: 'resolve', label: 'Mark Resolved', icon: CheckCheck, primary: true },
        { id: 'escalate', label: 'Escalate', icon: UserPlus },
        { id: 'snooze', label: 'Snooze', icon: Clock }
      ];
    case 'commitment':
      if (item.itemType === 'commitment' && item.status === 'overdue') {
        return [
          { id: 'mark-done', label: 'Mark Done', icon: CheckCheck, primary: true },
          { id: 'reschedule', label: 'Reschedule', icon: Calendar },
          { id: 'delegate', label: 'Delegate', icon: UserPlus }
        ];
      }
      return [
        { id: 'mark-done', label: 'Mark Done', icon: CheckCheck, primary: true },
        { id: 'view-source', label: 'See Context', icon: Eye },
        { id: 'snooze', label: 'Snooze', icon: Clock }
      ];
    case 'meeting':
      return [
        { id: 'join-meeting', label: 'Join Now', icon: Video, primary: true },
        { id: 'view-brief', label: 'View Brief', icon: Eye },
        { id: 'reschedule', label: 'Reschedule', icon: Calendar }
      ];
    case 'relationship':
      return [
        { id: 'send-email', label: 'Send Email', icon: Mail, primary: true },
        { id: 'schedule-call', label: 'Schedule Call', icon: Calendar },
        { id: 'view-history', label: 'View History', icon: Eye }
      ];
    case 'followup':
      return [
        { id: 'send-followup', label: 'Send Follow-up', icon: Send, primary: true },
        { id: 'view-thread', label: 'See Thread', icon: Eye },
        { id: 'snooze', label: 'Snooze', icon: Clock }
      ];
    default:
      return [
        { id: 'view-details', label: 'View Details', icon: Eye, primary: true },
        { id: 'snooze', label: 'Snooze', icon: Clock }
      ];
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

  const suggestedAction = getSuggestedAction(item);
  const SuggestedIcon = suggestedAction.icon;
  const urgency = getUrgencyDisplay(item);
  const choices = getContextualChoices(item);

  // Get title
  const getTitle = (): string => item.title;

  // Get the WHY - memory rationale or context
  const getWhy = (): string => {
    if (item.memoryRationale) return item.memoryRationale;

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
            <p className={`text-xs ${urgency.color} mt-0.5`}>{urgency.text}</p>
          </div>
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
        {/* Header: Category badge + Urgency */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor} ${config.textColor}`}>
            <CategoryIcon size={12} strokeWidth={2.5} />
            <span className="text-[10px] font-bold tracking-wider">{config.label}</span>
          </div>

          {/* WHEN: Urgency/Deadline */}
          <div className={`flex items-center gap-1.5 ${urgency.color}`}>
            <Clock size={12} />
            <span className={`text-xs font-medium ${urgency.isUrgent ? 'font-semibold' : ''}`}>
              {urgency.text}
            </span>
          </div>
        </div>

        {/* WHAT: Suggested Action - narrative style */}
        <div
          onClick={() => onExpand(item)}
          className="mb-4 cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2">
            <SuggestedIcon size={14} className={config.textColor} />
            <span className={`text-xs font-medium ${config.textColor}`}>{suggestedAction.text}</span>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {getTitle()}
          </h3>
        </div>

        {/* WHY: Memory rationale */}
        <div className="mb-5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="text-zinc-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                {getWhy()}
              </p>
              {item.evidence && item.evidence.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowEvidence?.(item);
                  }}
                  className="mt-2 text-[10px] font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center gap-1"
                >
                  <Eye size={10} />
                  View {item.evidence.length} source{item.evidence.length > 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contextual Choices */}
        <div className="flex items-center gap-2 flex-wrap">
          {choices.map((choice, idx) => (
            <button
              key={choice.id}
              onClick={(e) => {
                e.stopPropagation();
                onAction(choice.id, item);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                choice.primary
                  ? `${config.bgColor} ${config.textColor} border ${config.borderColor} hover:shadow-md`
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <choice.icon size={12} />
              {choice.label}
            </button>
          ))}

          {/* More options */}
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

AttentionCard.displayName = 'AttentionCard';

export default AttentionCard;
