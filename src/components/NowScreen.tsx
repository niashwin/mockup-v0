import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Video, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Commitment, MeetingBrief, Alert, AttentionItem, RelationshipAlert } from '../types';
import { ChatInterface } from './ChatInterface';
import { FocusView } from './FocusView';
import { SourceDrawer } from './SourceDrawer';
import { AttentionCard } from './AttentionCard';
import { EmailCompose } from './EmailCompose';
import { SchedulingActionSheet } from './SchedulingActionSheet';
import { toast } from 'sonner';
import { getOperatorQuote, getCelebratoryQuote, shouldCelebrate, getContextualQuote, getTimeOfDay } from '../utils/OperatorQuotes';
import { sortByAttentionScore, filterForAttentionPane } from '../utils/AttentionScore';

/**
 * Next Meeting Banner
 * Shows upcoming meeting if within 1 hour, dismissible
 */
interface NextMeetingBannerProps {
  meeting: MeetingBrief | null;
  onDismiss: () => void;
  onJoin: () => void;
  onViewBrief: () => void;
}

function NextMeetingBanner({ meeting, onDismiss, onJoin, onViewBrief }: NextMeetingBannerProps) {
  if (!meeting) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      className="mb-6"
    >
      <div className="relative bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 border border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-4 overflow-hidden">
        {/* Subtle pulse effect */}
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse" style={{ animationDuration: '3s' }} />

        <div className="relative flex items-center gap-4">
          {/* Meeting Icon */}
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Up Next
              </span>
              <div className="flex items-center gap-1 text-[10px] text-blue-500/70">
                <Clock className="w-3 h-3" />
                <span>{meeting.time}</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {meeting.title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {meeting.participants?.length || 0} participants • {meeting.duration || '30 min'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onViewBrief}
              className="px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              View Brief
            </button>
            <button
              onClick={onJoin}
              className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Join Now
            </button>
            <button
              onClick={onDismiss}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * More Items Indicator
 * Shows at bottom when there are more items, expands on click
 */
interface MoreIndicatorProps {
  remainingCount: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function MoreIndicator({ remainingCount, isExpanded, onToggle }: MoreIndicatorProps) {
  if (remainingCount <= 0) return null;

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onToggle}
      className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-xs font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors group"
    >
      <span>{isExpanded ? 'Show less' : `${remainingCount} more item${remainingCount > 1 ? 's' : ''}`}</span>
      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
        <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
      </motion.div>
    </motion.button>
  );
}

export const NowScreen = ({
  commitments,
  onToggle,
  alerts,
  meetingBriefs,
  relationshipAlerts = [],
  onNavigate
}: {
  commitments: Commitment[],
  onToggle: (id: string) => void,
  alerts: Alert[],
  meetingBriefs: MeetingBrief[],
  relationshipAlerts?: RelationshipAlert[],
  onNavigate: (tab: 'Now' | 'Reports' | 'Swimlanes' | 'Meetings' | 'ToDo' | 'Settings') => void
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [focusedItem, setFocusedItem] = useState<AttentionItem | null>(null);
  const [evidenceItem, setEvidenceItem] = useState<AttentionItem | null>(null);
  const [completionStreak, setCompletionStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [meetingDismissed, setMeetingDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Email compose modal state (for quick actions)
  const [emailComposeItem, setEmailComposeItem] = useState<AttentionItem | null>(null);
  const [isEmailComposeOpen, setIsEmailComposeOpen] = useState(false);

  // Scheduling sheet state
  const [schedulingItem, setSchedulingItem] = useState<AttentionItem | null>(null);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);

  // Snoozed items: Map of item ID -> timestamp when it should reappear
  const [snoozedItems, setSnoozedItems] = useState<Map<string, number>>(new Map());

  // Actioned items: Set of item IDs where action has been taken (removed from list)
  const [actionedItems, setActionedItems] = useState<Set<string>>(new Set());

  // Scroll-to-expand/collapse tracking (refs defined here, handler defined after remainingItems)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAttemptRef = useRef({ count: 0, direction: 'none' as 'up' | 'down' | 'none' });
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Periodically check if snoozed items should reappear (every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setSnoozedItems(prev => {
        const updated = new Map(prev);
        let hasChanges = false;
        for (const [id, reappearTime] of updated) {
          if (now >= reappearTime) {
            updated.delete(id);
            hasChanges = true;
          }
        }
        // Only return new map if there were changes
        return hasChanges ? updated : prev;
      });
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Find next meeting within 1 hour
  const nextMeeting = useMemo(() => {
    if (meetingDismissed) return null;

    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    // For demo purposes, just show the first scheduled meeting
    const scheduled = meetingBriefs.find(m => m.status === 'scheduled');
    return scheduled || null;
  }, [meetingBriefs, meetingDismissed]);

  // Convert alerts, commitments, meetings, and relationships to AttentionItems
  // Note: Order matters for tie-breaking in stable sort
  const attentionItems: AttentionItem[] = useMemo(() => {
    const items: AttentionItem[] = [];

    // Add relationship alerts FIRST - these are often most urgent for low-meeting users
    relationshipAlerts.forEach(relationship => {
      items.push({
        ...relationship,
        itemType: 'relationship' as const
      });
    });

    // Add pending commitments (so they appear before alerts in ties)
    commitments.filter(c => c.status !== 'completed').forEach(commitment => {
      items.push({
        ...commitment,
        itemType: 'commitment' as const
      });
    });

    // Add alerts
    alerts.forEach(alert => {
      items.push({
        ...alert,
        itemType: 'alert' as const
      });
    });

    // Add scheduled meetings (but not the next one if showing banner)
    meetingBriefs
      .filter(m => m.status === 'scheduled')
      .filter(m => !nextMeeting || m.id !== nextMeeting.id)
      .forEach(meeting => {
        items.push({
          ...meeting,
          itemType: 'meeting' as const
        });
      });

    return items;
  }, [alerts, commitments, meetingBriefs, relationshipAlerts, nextMeeting]);

  // Filter and sort items, excluding snoozed and actioned items
  const sortedItems = useMemo(() => {
    const now = Date.now();
    const filtered = filterForAttentionPane(attentionItems).filter(item => {
      // Exclude items where action has been taken
      if (actionedItems.has(item.id)) return false;

      // Exclude snoozed items that haven't reappeared yet
      const reappearTime = snoozedItems.get(item.id);
      if (reappearTime && now < reappearTime) return false;

      return true;
    });
    return sortByAttentionScore(filtered);
  }, [attentionItems, snoozedItems, actionedItems]);

  // Split into visible (3) and remaining items
  const visibleItems = sortedItems.slice(0, 3);
  const remainingItems = sortedItems.slice(3);
  const displayedItems = isExpanded ? sortedItems : visibleItems;

  // Handle scroll gesture to expand/collapse the list
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
    const isAtTop = scrollTop <= 20;

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Scrolling down at the bottom → expand
    if (e.deltaY > 0 && isAtBottom && !isExpanded && remainingItems.length > 0) {
      if (scrollAttemptRef.current.direction === 'down') {
        scrollAttemptRef.current.count += 1;
      } else {
        scrollAttemptRef.current = { count: 1, direction: 'down' };
      }

      if (scrollAttemptRef.current.count >= 3) {
        setIsExpanded(true);
        scrollAttemptRef.current = { count: 0, direction: 'none' };
        return;
      }
    }

    // Scrolling up at the top → collapse
    if (e.deltaY < 0 && isAtTop && isExpanded) {
      if (scrollAttemptRef.current.direction === 'up') {
        scrollAttemptRef.current.count += 1;
      } else {
        scrollAttemptRef.current = { count: 1, direction: 'up' };
      }

      if (scrollAttemptRef.current.count >= 3) {
        setIsExpanded(false);
        scrollAttemptRef.current = { count: 0, direction: 'none' };
        // Scroll to top when collapsing
        container.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Reset after 600ms of no scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      scrollAttemptRef.current = { count: 0, direction: 'none' };
    }, 600);
  }, [isExpanded, remainingItems.length]);

  // Handle actions
  const handleAction = (actionId: string, item: AttentionItem) => {
    switch (actionId) {
      case 'mark-done':
      case 'handled':
        if (item.itemType === 'commitment') {
          onToggle(item.id);

          // Update streak and completion count
          const newCompletedToday = completedToday + 1;
          const newStreak = completionStreak + 1;
          setCompletedToday(newCompletedToday);
          setCompletionStreak(newStreak);

          // Determine if we should celebrate
          const isHighImpact = item.impact === 'high';
          const shouldShowCelebration = shouldCelebrate({
            completedToday: newCompletedToday,
            streak: newStreak,
            isHighImpact
          });

          // Trigger haptic feedback if available
          if (typeof window !== 'undefined' && (window as any).electronAPI?.triggerHaptic) {
            (window as any).electronAPI.triggerHaptic(shouldShowCelebration ? 'success' : 'light');
          }

          // Show appropriate toast
          if (shouldShowCelebration) {
            toast.success(getCelebratoryQuote(), {
              description: isHighImpact ? 'High-impact item completed!' : `${newStreak} in a row!`,
              duration: 4000
            });
            // Play celebration sound if available
            if (typeof window !== 'undefined' && (window as any).electronAPI?.playSound) {
              (window as any).electronAPI.playSound('celebrate');
            }
          } else {
            toast.success(getContextualQuote({
              timeOfDay: getTimeOfDay(),
              completionStreak: newStreak,
              itemType: item.itemType,
              completedToday: newCompletedToday
            }), {
              description: 'Commitment marked as done.',
              duration: 3000
            });
            // Play subtle complete sound for regular completions
            if (typeof window !== 'undefined' && (window as any).electronAPI?.playSound) {
              (window as any).electronAPI.playSound('complete');
            }
          }

          // Auto-close the FocusView after completing
          setFocusedItem(null);
        }
        break;
      case 'snooze':
        // Add item to snoozed map - reappear in ~1.5 hours (90 minutes)
        const SNOOZE_DURATION_MS = 90 * 60 * 1000; // 90 minutes
        setSnoozedItems(prev => {
          const updated = new Map(prev);
          updated.set(item.id, Date.now() + SNOOZE_DURATION_MS);
          return updated;
        });

        // Close focus view if this item was open
        if (focusedItem?.id === item.id) {
          setFocusedItem(null);
        }

        // Haptic + sound for snooze action
        if (typeof window !== 'undefined' && (window as any).electronAPI?.triggerHaptic) {
          (window as any).electronAPI.triggerHaptic('light');
        }
        if (typeof window !== 'undefined' && (window as any).electronAPI?.playSound) {
          (window as any).electronAPI.playSound('snooze');
        }
        toast.info(getOperatorQuote('snooze'), {
          description: "We'll bring this back in about an hour.",
          duration: 3000
        });
        break;
      case 'delegate':
        // Haptic + sound for delegate action
        if (typeof window !== 'undefined' && (window as any).electronAPI?.triggerHaptic) {
          (window as any).electronAPI.triggerHaptic('medium');
        }
        if (typeof window !== 'undefined' && (window as any).electronAPI?.playSound) {
          (window as any).electronAPI.playSound('delegate');
        }
        toast(getOperatorQuote('delegate'), {
          description: 'Select a team member to hand this off to.',
          duration: 3000
        });
        break;
      case 'acknowledge':
        // Remove item from list after acknowledging
        setActionedItems(prev => new Set(prev).add(item.id));

        // Haptic + sound for acknowledge
        if (typeof window !== 'undefined' && (window as any).electronAPI?.triggerHaptic) {
          (window as any).electronAPI.triggerHaptic('success');
        }
        if (typeof window !== 'undefined' && (window as any).electronAPI?.playSound) {
          (window as any).electronAPI.playSound('success');
        }
        toast.success('Acknowledged', {
          description: "Recorded. Will resurface if situation changes.",
          duration: 2000
        });
        // Auto-close the FocusView after acknowledging
        setFocusedItem(null);
        break;

      case 'intervened':
        // Item 5: Intervention semantics - log action, remove from list
        // In a real system, this would update the backend and the item would
        // only truly resolve when external signals confirm the change
        setActionedItems(prev => new Set(prev).add(item.id));

        if (typeof window !== 'undefined' && (window as any).electronAPI?.triggerHaptic) {
          (window as any).electronAPI.triggerHaptic('success');
        }
        if (typeof window !== 'undefined' && (window as any).electronAPI?.playSound) {
          (window as any).electronAPI.playSound('success');
        }
        toast.success('Action logged', {
          description: 'Intervention recorded. Will resurface if external signals indicate unresolved.',
          duration: 3000
        });
        setFocusedItem(null);
        break;

      case 'defer':
        // Item 9: Defer moved from homepage to detail view
        const DEFER_DURATION_MS = 90 * 60 * 1000; // 90 minutes
        setSnoozedItems(prev => {
          const updated = new Map(prev);
          updated.set(item.id, Date.now() + DEFER_DURATION_MS);
          return updated;
        });

        if (focusedItem?.id === item.id) {
          setFocusedItem(null);
        }

        if (typeof window !== 'undefined' && (window as any).electronAPI?.triggerHaptic) {
          (window as any).electronAPI.triggerHaptic('light');
        }
        toast.info('Deferred', {
          description: "This will resurface when conditions warrant attention.",
          duration: 3000
        });
        break;
      case 'join-meeting':
        if (item.itemType === 'meeting' && item.meetingLink) {
          window.open(item.meetingLink, '_blank');
        }
        break;
      case 'view-source':
      case 'see-thread':
      case 'show-history':
      case 'view-details':
      case 'view-history':
        setFocusedItem(item);
        break;
      case 'send-message':
        // For relationship items - open email or show compose
        if (typeof window !== 'undefined' && (window as any).electronAPI?.triggerHaptic) {
          (window as any).electronAPI.triggerHaptic('light');
        }
        if (typeof window !== 'undefined' && (window as any).electronAPI?.playSound) {
          (window as any).electronAPI.playSound('pop');
        }
        if (item.itemType === 'relationship') {
          toast.success(`Opening message to ${item.contactName}`, {
            description: item.suggestedAction || 'Draft a personalized message',
            duration: 3000
          });
        }
        break;
      case 'share-card':
        toast.success('Card shared', {
          description: 'A link has been copied to your clipboard.',
          duration: 2000
        });
        break;
      default:
        console.log('Action:', actionId, 'on item:', item.id);
    }
  };

  const handleExpand = (item: AttentionItem) => {
    setFocusedItem(item);
  };

  const handleShowEvidence = (item: AttentionItem) => {
    setEvidenceItem(item);
  };

  // Quick action handler - opens prepared intervention flow (email compose, etc.)
  // Quick actions are low-risk, obvious, supportive - never finalize decisions
  const handleQuickAction = (actionId: string, item: AttentionItem) => {
    // All quick actions currently open the email compose with context
    // This provides a prepared, editable intervention - user must still click Send
    setEmailComposeItem(item);
    setIsEmailComposeOpen(true);
  };

  // Schedule action handler - opens the scheduling flow sheet
  const handleSchedule = (item: AttentionItem) => {
    setSchedulingItem(item);
    setIsSchedulingOpen(true);
  };

  const handleJoinMeeting = () => {
    if (nextMeeting?.meetingLink) {
      window.open(nextMeeting.meetingLink, '_blank');
    }
  };

  const handleViewBrief = () => {
    if (nextMeeting) {
      // Open the meeting as a focused item to show its brief/details
      const meetingItem: AttentionItem = {
        ...nextMeeting,
        itemType: 'meeting' as const
      };
      setFocusedItem(meetingItem);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full p-6 lg:p-10 overflow-hidden bg-transparent">
      {/* Main Content Area */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="flex-1 min-h-0 relative z-0 overflow-y-auto custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto w-full pb-24">
          {/* Next Meeting Banner */}
          <AnimatePresence>
            {nextMeeting && !meetingDismissed && (
              <NextMeetingBanner
                meeting={nextMeeting}
                onDismiss={() => setMeetingDismissed(true)}
                onJoin={handleJoinMeeting}
                onViewBrief={handleViewBrief}
              />
            )}
          </AnimatePresence>

          {/* Briefs Heading - singular/plural based on count */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {displayedItems.length === 1 ? 'Brief' : 'Briefs'}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {displayedItems.length === 1
                ? 'You should focus on this'
                : `You should focus on these`}
            </p>
          </motion.div>

          {/* Attention Cards */}
          {displayedItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Clear skies
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
                Nothing pressing right now. We'll surface things as they emerge.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {displayedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AttentionCard
                      item={item}
                      onAction={handleAction}
                      onExpand={handleExpand}
                      onShowEvidence={handleShowEvidence}
                      onQuickAction={handleQuickAction}
                      onSchedule={handleSchedule}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* More Indicator */}
              <MoreIndicator
                remainingCount={remainingItems.length}
                isExpanded={isExpanded}
                onToggle={() => setIsExpanded(!isExpanded)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Focus View Modal */}
      <FocusView
        item={focusedItem}
        onClose={() => setFocusedItem(null)}
        onAction={handleAction}
        onNavigateToSource={(sourceType, sourceId) => {
          // Close the focus view
          setFocusedItem(null);
          // Navigate to the appropriate view based on source type
          switch (sourceType) {
            case 'meetings':
              onNavigate('Meetings');
              break;
            case 'reports':
              onNavigate('Reports');
              break;
            case 'swimlanes':
              onNavigate('Swimlanes');
              break;
            case 'contacts':
              // Would navigate to CRM/Contacts view
              toast.info('Opening CRM', { description: 'Navigating to contact details...', duration: 2000 });
              break;
            case 'email':
              // Would open email client or email view
              toast.info('Opening Email', { description: 'Navigating to email thread...', duration: 2000 });
              break;
            case 'slack':
              // Would open Slack or show thread
              toast.info('Opening Slack', { description: 'Navigating to Slack thread...', duration: 2000 });
              break;
            case 'linear':
              // Would open Linear
              toast.info('Opening Linear', { description: 'Navigating to Linear issue...', duration: 2000 });
              break;
            case 'notion':
              // Would open Notion
              toast.info('Opening Notion', { description: 'Navigating to Notion page...', duration: 2000 });
              break;
            default:
              console.log('Navigate to source:', sourceType, sourceId);
          }
        }}
      />

      {/* Source Drawer */}
      <SourceDrawer
        item={evidenceItem}
        onClose={() => setEvidenceItem(null)}
      />

      {/* Chat Interface - only for keyboard shortcut, persistent bar is in App.tsx */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Email Compose Modal - for quick actions */}
      <EmailCompose
        isOpen={isEmailComposeOpen}
        onClose={() => {
          setIsEmailComposeOpen(false);
          setEmailComposeItem(null);
        }}
        item={emailComposeItem}
      />

      {/* Scheduling Action Sheet */}
      <SchedulingActionSheet
        open={isSchedulingOpen}
        onClose={() => {
          setIsSchedulingOpen(false);
          setSchedulingItem(null);
        }}
        item={schedulingItem}
      />
    </div>
  );
};
