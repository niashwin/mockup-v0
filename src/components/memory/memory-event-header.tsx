import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  File01Icon,
  PlusSignIcon,
  MoreHorizontalIcon,
  Alert01Icon,
} from "@hugeicons/core-free-icons";
import { cn, formatDate } from "@lib/utils";
import { Avatar } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import { springs } from "@lib/motion";
import {
  eventTypeConfig,
  type MemoryEvent,
  type MemoryActionItem,
} from "@types/memory";

/**
 * Memory Event Header
 *
 * Displays selected event details in a header section above the timeline:
 * - Icon + title + actions (+ and ...)
 * - Description text
 * - Tags and participant avatars
 * - Overdue alert banner (if applicable)
 * - Open Commitments section with "You Owe" and "They Owe" subsections
 *
 * Inspired by the Acme Corp Renewal design reference.
 */

interface MemoryEventHeaderProps {
  event: MemoryEvent | null;
}

function getOverdueItems(actionItems: MemoryActionItem[]): MemoryActionItem[] {
  const now = new Date();
  return actionItems.filter((item) => {
    if (item.isCompleted || !item.dueDate) return false;
    return item.dueDate < now;
  });
}

// Determine which items are commitments the user owes vs others owe
// For demo purposes, items with certain keywords go to different buckets
function categorizeCommitments(actionItems: MemoryActionItem[]): {
  youOwe: MemoryActionItem[];
  theyOwe: MemoryActionItem[];
} {
  const incomplete = actionItems.filter((item) => !item.isCompleted);

  // Simple heuristic: items with "Send", "Complete", "Update", "Draft", "Review" = you owe
  // Others = they owe
  const youOweKeywords = [
    "send",
    "complete",
    "update",
    "draft",
    "review",
    "follow",
    "schedule",
    "get",
    "notify",
  ];

  const youOwe: MemoryActionItem[] = [];
  const theyOwe: MemoryActionItem[] = [];

  for (const item of incomplete) {
    const titleLower = item.title.toLowerCase();
    const isYouOwe = youOweKeywords.some((kw) => titleLower.includes(kw));
    if (isYouOwe) {
      youOwe.push(item);
    } else {
      theyOwe.push(item);
    }
  }

  return { youOwe, theyOwe };
}

function EmptyState() {
  return (
    <div className="border-b border-border bg-surface-elevated/50 px-6 py-8">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="size-10 rounded-[var(--radius-lg)] bg-muted/50 flex items-center justify-center">
          <HugeiconsIcon
            icon={File01Icon}
            size={20}
            strokeWidth={1.5}
            className="opacity-50"
          />
        </div>
        <div>
          <p className="font-medium text-foreground/70">No event selected</p>
          <p className="text-sm text-muted-foreground/60">
            Select an event from the timeline to view details
          </p>
        </div>
      </div>
    </div>
  );
}

export function MemoryEventHeader({ event }: MemoryEventHeaderProps) {
  if (!event) {
    return <EmptyState />;
  }

  const typeConfig = eventTypeConfig[event.type];
  const overdueItems = getOverdueItems(event.actionItems);
  const { youOwe, theyOwe } = categorizeCommitments(event.actionItems);
  const hasCommitments = youOwe.length > 0 || theyOwe.length > 0;

  // Get a relevant participant for overdue attribution
  const overdueParticipant =
    event.participants.length > 0 ? event.participants[0] : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={springs.snappy}
        className="border-b border-border bg-surface-elevated/50"
      >
        {/* Main Header Content */}
        <div className="px-6 pt-5 pb-4">
          {/* Row 1: Icon + Title + Actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Icon */}
              <div
                className={cn(
                  "size-10 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0",
                  typeConfig.bg,
                  typeConfig.darkBg,
                )}
              >
                <HugeiconsIcon
                  icon={File01Icon}
                  size={20}
                  className={cn(typeConfig.text, typeConfig.darkText)}
                  strokeWidth={1.5}
                />
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-foreground pt-1.5 truncate">
                {event.title}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                className="p-2 rounded-[var(--radius-lg)] text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  size={20}
                  strokeWidth={1.5}
                />
              </button>
              <button
                type="button"
                className="p-2 rounded-[var(--radius-lg)] text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <HugeiconsIcon
                  icon={MoreHorizontalIcon}
                  size={20}
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>

          {/* Row 2: Description */}
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
            {event.summary}
          </p>

          {/* Row 3: Tags + Participants */}
          <div className="flex items-center gap-3 mt-3">
            {/* Category Tag */}
            {event.category && (
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-900 dark:bg-blue-950"
              >
                {event.category}
              </Badge>
            )}

            {/* Status indicator based on overdue items */}
            {overdueItems.length > 0 && (
              <Badge
                variant="outline"
                className="text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-900 dark:bg-red-950"
              >
                Needs Attention
              </Badge>
            )}

            {/* Participant Avatars */}
            {event.participants.length > 0 && (
              <div className="flex items-center gap-1.5 ml-1">
                {event.participants.slice(0, 3).map((p) => (
                  <Avatar
                    key={p.id}
                    name={p.name}
                    src={p.avatarUrl}
                    size="sm"
                    className="ring-2 ring-background"
                  />
                ))}
                {event.participants.length > 3 && (
                  <span className="text-micro text-muted-foreground ml-0.5">
                    +{event.participants.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Overdue Alert Banner */}
          {overdueItems.length > 0 && overdueParticipant && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4"
            >
              <div className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-lg)] bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <HugeiconsIcon
                    icon={Alert01Icon}
                    size={16}
                    strokeWidth={1.5}
                  />
                  <span className="text-sm font-medium">
                    {overdueItems[0].title} overdue —{" "}
                    {overdueParticipant.name.split(" ")[0]} waiting since{" "}
                    {overdueItems[0].dueDate
                      ? formatDate(overdueItems[0].dueDate)
                      : "earlier"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <button className="text-red-600 dark:text-red-400 font-medium hover:underline">
                    Resolve
                  </button>
                  <span className="text-red-300 dark:text-red-800">·</span>
                  <button className="text-red-600 dark:text-red-400 font-medium hover:underline">
                    Snooze
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Open Commitments Section */}
        {hasCommitments && (
          <div className="border-t border-border/60 mx-6 mb-4 pt-4">
            <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-4">
              Open Commitments
            </h3>

            <div className="space-y-4">
              {/* You Owe Section */}
              {youOwe.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                    You Owe ({youOwe.length})
                  </p>
                  <div className="space-y-2">
                    {youOwe.map((item) => (
                      <CommitmentRow
                        key={item.id}
                        item={item}
                        participantName="Me"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* They Owe Section */}
              {theyOwe.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                    They Owe ({theyOwe.length})
                  </p>
                  <div className="space-y-2">
                    {theyOwe.map((item, index) => {
                      // Assign a participant to each item
                      const participant =
                        event.participants[index % event.participants.length];
                      return (
                        <CommitmentRow
                          key={item.id}
                          item={item}
                          participantName={
                            participant?.name.split(" ")[0] || "Someone"
                          }
                          showAvatar
                          avatarName={participant?.name}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

interface CommitmentRowProps {
  item: MemoryActionItem;
  participantName: string;
  showAvatar?: boolean;
  avatarName?: string;
}

function CommitmentRow({
  item,
  participantName,
  showAvatar = false,
  avatarName,
}: CommitmentRowProps) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-[var(--radius-lg)] hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        {showAvatar ? (
          <Avatar name={avatarName || participantName} size="sm" />
        ) : (
          <div className="size-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              M
            </span>
          </div>
        )}
        <span className="text-sm text-foreground">
          {showAvatar && (
            <span className="font-medium">{participantName}: </span>
          )}
          {item.title}
        </span>
      </div>

      {item.dueDate && (
        <Badge
          variant="outline"
          className="text-muted-foreground border-border bg-surface text-xs tabular-nums"
        >
          {formatDate(item.dueDate)}
        </Badge>
      )}
    </div>
  );
}
