import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Mail01Icon,
  File01Icon,
  Calendar01Icon,
  Message01Icon,
  Video01Icon,
  Link03Icon,
  Tick01Icon,
  CircleIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { Avatar } from "@components/ui/avatar";
import { springs } from "@lib/motion";
import { eventTypeConfig, type MemorySource } from "@types/memory";
import { useMemoryStore } from "@stores/memory-store";

/**
 * Memory Event Popup
 *
 * Centered modal showing full event details:
 * - Header with type badge, title, date, and source
 * - Summary section
 * - Participants as avatar chips
 * - Action items with checkboxes (editable)
 * - Sources with icons
 */

function formatFullDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const sourceIcons: Record<MemorySource["type"], typeof Mail01Icon> = {
  email: Mail01Icon,
  document: File01Icon,
  meeting: Video01Icon,
  slack: Message01Icon,
  calendar: Calendar01Icon,
};

const sourceLabels: Record<MemorySource["type"], string> = {
  email: "Email",
  document: "Document",
  meeting: "Meeting",
  slack: "Slack",
  calendar: "Calendar",
};

export function MemoryEventPopup() {
  const isPopupOpen = useMemoryStore((state) => state.isPopupOpen);
  const closePopup = useMemoryStore((state) => state.closePopup);
  const getSelectedEvent = useMemoryStore((state) => state.getSelectedEvent);
  const toggleActionItem = useMemoryStore((state) => state.toggleActionItem);

  const event = getSelectedEvent();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
      }
    },
    [closePopup],
  );

  useEffect(() => {
    if (isPopupOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isPopupOpen, handleKeyDown]);

  if (!event) return null;

  const typeConfig = eventTypeConfig[event.type];

  return createPortal(
    <AnimatePresence>
      {isPopupOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={closePopup}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={springs.default}
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-full max-w-lg max-h-[85vh]",
              "bg-background rounded-xl shadow-float border border-border",
              "flex flex-col z-50",
            )}
          >
            {/* Header */}
            <header className="shrink-0 px-6 py-4 border-b border-border/40">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Type + Title */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "size-2.5 rounded-full shrink-0",
                        typeConfig.dot,
                      )}
                    />
                    <h2 className="font-medium text-lg text-foreground truncate">
                      {event.title}
                    </h2>
                  </div>

                  {/* Metadata line */}
                  <div className="flex items-center gap-2 text-caption text-muted-foreground">
                    <span
                      className={cn(
                        "font-medium uppercase tracking-wider",
                        typeConfig.text,
                        typeConfig.darkText,
                      )}
                    >
                      {typeConfig.label}
                    </span>
                    <span>·</span>
                    <span>{formatFullDate(event.date)}</span>
                    {event.sources.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon
                            icon={sourceIcons[event.sources[0].type]}
                            size={14}
                            strokeWidth={1.5}
                          />
                          {sourceLabels[event.sources[0].type]}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={closePopup}
                  className="p-2 -m-2 text-muted-foreground/50 hover:text-foreground rounded-[var(--radius-lg)] hover:bg-muted/50 transition-colors"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={20}
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            </header>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Summary */}
              <section>
                <h3 className="text-micro font-medium text-muted-foreground/60 uppercase tracking-wider mb-2">
                  Summary
                </h3>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {event.summary}
                </p>
              </section>

              {/* Participants */}
              {event.participants.length > 0 && (
                <section>
                  <h3 className="text-micro font-medium text-muted-foreground/60 uppercase tracking-wider mb-3">
                    Participants
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className={cn(
                          "flex items-center gap-2 px-2.5 py-1.5 rounded-full",
                          "bg-muted/50 border border-border/40",
                        )}
                      >
                        <Avatar
                          name={participant.name}
                          src={participant.avatarUrl}
                          size="sm"
                        />
                        <span className="text-caption text-foreground">
                          {participant.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Action Items */}
              {event.actionItems.length > 0 && (
                <section>
                  <h3 className="text-micro font-medium text-muted-foreground/60 uppercase tracking-wider mb-3">
                    Action Items
                  </h3>
                  <ul className="space-y-2">
                    {event.actionItems.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => toggleActionItem(event.id, item.id)}
                          className={cn(
                            "w-full flex items-start gap-3 p-2 rounded-[var(--radius-lg)]",
                            "text-left transition-colors hover:bg-muted/50",
                          )}
                        >
                          {/* Checkbox */}
                          <span
                            className={cn(
                              "size-5 rounded border flex items-center justify-center shrink-0 mt-0.5",
                              "transition-colors",
                              item.isCompleted
                                ? "bg-accent border-accent text-accent-foreground"
                                : "border-border hover:border-accent",
                            )}
                          >
                            {item.isCompleted ? (
                              <HugeiconsIcon
                                icon={Tick01Icon}
                                size={12}
                                strokeWidth={2}
                              />
                            ) : (
                              <HugeiconsIcon
                                icon={CircleIcon}
                                size={8}
                                strokeWidth={1.5}
                                className="opacity-0"
                              />
                            )}
                          </span>

                          {/* Title */}
                          <span
                            className={cn(
                              "text-sm flex-1",
                              item.isCompleted
                                ? "text-muted-foreground line-through"
                                : "text-foreground",
                            )}
                          >
                            {item.title}
                          </span>

                          {/* Due date */}
                          {item.dueDate && (
                            <span className="text-micro text-muted-foreground/60 tabular-nums">
                              {item.dueDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Sources */}
              {event.sources.length > 0 && (
                <section>
                  <h3 className="text-micro font-medium text-muted-foreground/60 uppercase tracking-wider mb-3">
                    Sources
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.sources.map((source) => {
                      const sourceIcon = sourceIcons[source.type];
                      return (
                        <a
                          key={source.id}
                          href={source.url || "#"}
                          target={source.url ? "_blank" : undefined}
                          rel={source.url ? "noopener noreferrer" : undefined}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-[var(--radius-lg)]",
                            "bg-muted/30 border border-border/40",
                            "text-caption text-muted-foreground",
                            "hover:bg-muted/50 hover:text-foreground transition-colors",
                          )}
                        >
                          <HugeiconsIcon
                            icon={sourceIcon}
                            size={16}
                            strokeWidth={1.5}
                          />
                          <span>{source.title}</span>
                          {source.url && (
                            <HugeiconsIcon
                              icon={Link03Icon}
                              size={12}
                              strokeWidth={1.5}
                              className="opacity-50"
                            />
                          )}
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Category & Tags */}
              {(event.category || event.tags.length > 0) && (
                <section className="pt-4 border-t border-border/40">
                  <div className="flex flex-wrap gap-2">
                    {event.category && (
                      <span className="px-2.5 py-1 rounded-[var(--radius-md)] bg-accent-muted text-caption text-accent font-medium">
                        {event.category}
                      </span>
                    )}
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-[var(--radius-md)] bg-muted text-caption text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
