import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Video, Clock, ChevronDown, CheckCircle2 } from "lucide-react";
import {
  Commitment,
  MeetingBrief,
  Alert,
  AttentionItem,
  RelationshipAlert,
} from "../types";
import { ChatInterface } from "./ChatInterface";
import { FocusView } from "./FocusView";
import { SourceDrawer } from "./SourceDrawer";
import { AttentionCard } from "./AttentionCard";
import { toast } from "sonner";
import {
  getOperatorQuote,
  getCelebratoryQuote,
  shouldCelebrate,
  getContextualQuote,
  getTimeOfDay,
} from "../utils/OperatorQuotes";
import {
  sortByAttentionScore,
  filterForAttentionPane,
} from "../utils/AttentionScore";

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

function NextMeetingBanner({
  meeting,
  onDismiss,
  onJoin,
  onViewBrief,
}: NextMeetingBannerProps) {
  if (!meeting) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      className="mb-6"
    >
      <div className="relative bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 border border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-4 overflow-hidden">
        {/* Subtle pulse effect */}
        <div
          className="absolute inset-0 bg-blue-500/5 animate-pulse"
          style={{ animationDuration: "3s" }}
        />

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
              {meeting.participants?.length || 0} participants •{" "}
              {meeting.duration || "30 min"}
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

function MoreIndicator({
  remainingCount,
  isExpanded,
  onToggle,
}: MoreIndicatorProps) {
  if (remainingCount <= 0) return null;

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onToggle}
      className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-xs font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors group"
    >
      <span>
        {isExpanded
          ? "Show less"
          : `${remainingCount} more item${remainingCount > 1 ? "s" : ""}`}
      </span>
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
  onNavigate,
}: {
  commitments: Commitment[];
  onToggle: (id: string) => void;
  alerts: Alert[];
  meetingBriefs: MeetingBrief[];
  relationshipAlerts?: RelationshipAlert[];
  onNavigate: (
    tab: "Now" | "Reports" | "Swimlanes" | "Meetings" | "ToDo" | "Settings",
  ) => void;
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [focusedItem, setFocusedItem] = useState<AttentionItem | null>(null);
  const [evidenceItem, setEvidenceItem] = useState<AttentionItem | null>(null);
  const [completionStreak, setCompletionStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [meetingDismissed, setMeetingDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Find next meeting within 1 hour
  const nextMeeting = useMemo(() => {
    if (meetingDismissed) return null;

    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    // For demo purposes, just show the first scheduled meeting
    const scheduled = meetingBriefs.find((m) => m.status === "scheduled");
    return scheduled || null;
  }, [meetingBriefs, meetingDismissed]);

  // Convert alerts, commitments, meetings, and relationships to AttentionItems
  // Note: Order matters for tie-breaking in stable sort
  const attentionItems: AttentionItem[] = useMemo(() => {
    const items: AttentionItem[] = [];

    // Add relationship alerts FIRST - these are often most urgent for low-meeting users
    relationshipAlerts.forEach((relationship) => {
      items.push({
        ...relationship,
        itemType: "relationship" as const,
      });
    });

    // Add pending commitments (so they appear before alerts in ties)
    commitments
      .filter((c) => c.status !== "completed")
      .forEach((commitment) => {
        items.push({
          ...commitment,
          itemType: "commitment" as const,
        });
      });

    // Add alerts
    alerts.forEach((alert) => {
      items.push({
        ...alert,
        itemType: "alert" as const,
      });
    });

    // Add scheduled meetings (but not the next one if showing banner)
    meetingBriefs
      .filter((m) => m.status === "scheduled")
      .filter((m) => !nextMeeting || m.id !== nextMeeting.id)
      .forEach((meeting) => {
        items.push({
          ...meeting,
          itemType: "meeting" as const,
        });
      });

    return items;
  }, [alerts, commitments, meetingBriefs, relationshipAlerts, nextMeeting]);

  // Filter and sort items
  const sortedItems = useMemo(() => {
    const filtered = filterForAttentionPane(attentionItems);
    return sortByAttentionScore(filtered);
  }, [attentionItems]);

  // Split into visible (3) and remaining items
  const visibleItems = sortedItems.slice(0, 3);
  const remainingItems = sortedItems.slice(3);
  const displayedItems = isExpanded ? sortedItems : visibleItems;

  // Handle actions
  const handleAction = (actionId: string, item: AttentionItem) => {
    switch (actionId) {
      case "mark-done":
        if (item.itemType === "commitment") {
          onToggle(item.id);

          // Update streak and completion count
          const newCompletedToday = completedToday + 1;
          const newStreak = completionStreak + 1;
          setCompletedToday(newCompletedToday);
          setCompletionStreak(newStreak);

          // Determine if we should celebrate
          const isHighImpact = item.impact === "high";
          const shouldShowCelebration = shouldCelebrate({
            completedToday: newCompletedToday,
            streak: newStreak,
            isHighImpact,
          });

          // Trigger haptic feedback if available
          if (
            typeof window !== "undefined" &&
            (window as any).electronAPI?.triggerHaptic
          ) {
            (window as any).electronAPI.triggerHaptic(
              shouldShowCelebration ? "success" : "light",
            );
          }

          // Show appropriate toast
          if (shouldShowCelebration) {
            toast.success(getCelebratoryQuote(), {
              description: isHighImpact
                ? "High-impact item completed!"
                : `${newStreak} in a row!`,
              duration: 4000,
            });
            // Play celebration sound if available
            if (
              typeof window !== "undefined" &&
              (window as any).electronAPI?.playSound
            ) {
              (window as any).electronAPI.playSound("celebrate");
            }
          } else {
            toast.success(
              getContextualQuote({
                timeOfDay: getTimeOfDay(),
                completionStreak: newStreak,
                itemType: item.itemType,
                completedToday: newCompletedToday,
              }),
              {
                description: "Commitment marked as done.",
                duration: 3000,
              },
            );
            // Play subtle complete sound for regular completions
            if (
              typeof window !== "undefined" &&
              (window as any).electronAPI?.playSound
            ) {
              (window as any).electronAPI.playSound("complete");
            }
          }
        }
        break;
      case "snooze":
        // Haptic + sound for snooze action
        if (
          typeof window !== "undefined" &&
          (window as any).electronAPI?.triggerHaptic
        ) {
          (window as any).electronAPI.triggerHaptic("light");
        }
        if (
          typeof window !== "undefined" &&
          (window as any).electronAPI?.playSound
        ) {
          (window as any).electronAPI.playSound("snooze");
        }
        toast.info(getOperatorQuote("snooze"), {
          description: "We'll remind you tomorrow.",
          duration: 3000,
        });
        break;
      case "delegate":
        // Haptic + sound for delegate action
        if (
          typeof window !== "undefined" &&
          (window as any).electronAPI?.triggerHaptic
        ) {
          (window as any).electronAPI.triggerHaptic("medium");
        }
        if (
          typeof window !== "undefined" &&
          (window as any).electronAPI?.playSound
        ) {
          (window as any).electronAPI.playSound("delegate");
        }
        toast(getOperatorQuote("delegate"), {
          description: "Select a team member to hand this off to.",
          duration: 3000,
        });
        break;
      case "acknowledge":
        // Haptic + sound for acknowledge
        if (
          typeof window !== "undefined" &&
          (window as any).electronAPI?.triggerHaptic
        ) {
          (window as any).electronAPI.triggerHaptic("success");
        }
        if (
          typeof window !== "undefined" &&
          (window as any).electronAPI?.playSound
        ) {
          (window as any).electronAPI.playSound("success");
        }
        toast.success("Alert acknowledged", {
          description: "We've noted your acknowledgment.",
          duration: 2000,
        });
        break;
      case "join-meeting":
        if (item.itemType === "meeting" && item.meetingLink) {
          window.open(item.meetingLink, "_blank");
        }
        break;
      case "view-source":
      case "see-thread":
      case "show-history":
      case "view-details":
      case "view-history":
        setFocusedItem(item);
        break;
      case "send-message":
        // For relationship items - open email or show compose
        if (
          typeof window !== "undefined" &&
          (window as any).electronAPI?.triggerHaptic
        ) {
          (window as any).electronAPI.triggerHaptic("light");
        }
        if (
          typeof window !== "undefined" &&
          (window as any).electronAPI?.playSound
        ) {
          (window as any).electronAPI.playSound("pop");
        }
        if (item.itemType === "relationship") {
          toast.success(`Opening message to ${item.contactName}`, {
            description: item.suggestedAction || "Draft a personalized message",
            duration: 3000,
          });
        }
        break;
      case "share-card":
        toast.success("Card shared", {
          description: "A link has been copied to your clipboard.",
          duration: 2000,
        });
        break;
      default:
        console.log("Action:", actionId, "on item:", item.id);
    }
  };

  const handleExpand = (item: AttentionItem) => {
    setFocusedItem(item);
  };

  const handleShowEvidence = (item: AttentionItem) => {
    setEvidenceItem(item);
  };

  const handleJoinMeeting = () => {
    if (nextMeeting?.meetingLink) {
      window.open(nextMeeting.meetingLink, "_blank");
    }
  };

  const handleViewBrief = () => {
    if (nextMeeting) {
      // Open the meeting as a focused item to show its brief/details
      const meetingItem: AttentionItem = {
        ...nextMeeting,
        itemType: "meeting" as const,
      };
      setFocusedItem(meetingItem);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full p-6 lg:p-10 overflow-hidden bg-transparent">
      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative z-0 overflow-y-auto custom-scrollbar">
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

          {/* Focus Heading */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Focus
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              You should look at this
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
      />

      {/* Source Drawer */}
      <SourceDrawer item={evidenceItem} onClose={() => setEvidenceItem(null)} />

      {/* Chat Interface - only for keyboard shortcut, persistent bar is in App.tsx */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};
