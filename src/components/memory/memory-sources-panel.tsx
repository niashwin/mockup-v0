import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Video01Icon,
  Mail01Icon,
  Message01Icon,
  File01Icon,
  Calendar01Icon,
  Link03Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { springs } from "@lib/motion";
import { useMemoryStore } from "@stores/memory-store";
import type { MemorySource } from "@types/memory";

/**
 * Memory Sources Panel
 *
 * Slide-in panel from right showing sources for the selected event.
 * Same animation pattern as reports page sources-sidebar:
 * - Backdrop with blur
 * - Panel slides from right with spring animation
 * - Escape key or outside click closes
 */

// Map source types to icons
const sourceTypeIcons: Record<string, typeof Video01Icon> = {
  meeting: Video01Icon,
  email: Mail01Icon,
  slack: Message01Icon,
  document: File01Icon,
  calendar: Calendar01Icon,
};

// Map source types to display labels
const sourceTypeLabels: Record<string, string> = {
  meeting: "Meeting Recording",
  email: "Email Thread",
  slack: "Slack Message",
  document: "Document",
  calendar: "Calendar Event",
};

// Map source types to colors
const sourceTypeColors: Record<string, { bg: string; text: string }> = {
  meeting: { bg: "bg-blue-500/10", text: "text-blue-500" },
  email: { bg: "bg-red-500/10", text: "text-red-500" },
  slack: { bg: "bg-purple-500/10", text: "text-purple-500" },
  document: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  calendar: { bg: "bg-amber-500/10", text: "text-amber-500" },
};

interface SourceCardProps {
  source: MemorySource;
  index: number;
}

function SourceCard({ source, index }: SourceCardProps) {
  const sourceIcon = sourceTypeIcons[source.type] || File01Icon;
  const colors = sourceTypeColors[source.type] || {
    bg: "bg-slate-500/10",
    text: "text-slate-500",
  };
  const typeLabel = sourceTypeLabels[source.type] || source.type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="group"
    >
      <a
        href={source.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "block p-4 rounded-[var(--radius-lg)] border border-border/60",
          "bg-surface hover:bg-surface-elevated",
          "transition-all duration-200 hover:shadow-sm hover:border-border",
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              "size-10 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0",
              colors.bg,
            )}
          >
            <HugeiconsIcon
              icon={sourceIcon}
              size={20}
              className={colors.text}
              strokeWidth={1.5}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-foreground truncate group-hover:text-accent transition-colors">
              {source.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">{typeLabel}</p>
          </div>

          {/* External link indicator */}
          {source.url && (
            <HugeiconsIcon
              icon={Link03Icon}
              size={16}
              className="text-muted-foreground/50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              strokeWidth={1.5}
            />
          )}
        </div>
      </a>
    </motion.div>
  );
}

export function MemorySourcesPanel() {
  const isOpen = useMemoryStore((state) => state.isSourcesPanelOpen);
  const sources = useMemoryStore((state) => state.sourcePanelSources);
  const close = useMemoryStore((state) => state.closeSourcesPanel);
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        close();
      }
    };

    // Delay to prevent immediate close from triggering event
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, close]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={springs.default}
            className={cn(
              "fixed top-0 right-0 bottom-0 w-[360px] z-50",
              "bg-surface-elevated border-l border-border shadow-float",
              "flex flex-col overflow-hidden",
            )}
          >
            {/* Header */}
            <div className="shrink-0 px-6 py-5 border-b border-border-subtle flex items-center justify-between bg-surface-elevated">
              <div>
                <h3 className="text-heading font-semibold text-foreground">
                  Sources
                </h3>
                <p className="text-caption text-muted-foreground mt-0.5">
                  Evidence for this event
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className={cn(
                  "size-8 rounded-[var(--radius-lg)] flex items-center justify-center",
                  "text-muted-foreground hover:text-foreground",
                  "hover:bg-muted transition-colors duration-150",
                )}
                aria-label="Close sources panel"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={16}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sources.map((source, index) => (
                <SourceCard key={source.id} source={source} index={index} />
              ))}

              {sources.length === 0 && (
                <div className="text-center py-12">
                  <HugeiconsIcon
                    icon={File01Icon}
                    size={40}
                    className="mx-auto text-muted-foreground/20 mb-3"
                    strokeWidth={1}
                  />
                  <p className="text-sm text-muted-foreground/50">
                    No sources available
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-4 border-t border-border-subtle bg-surface-elevated">
              <p className="text-caption text-muted-foreground/70 text-center">
                {sources.length} source{sources.length !== 1 ? "s" : ""} for
                this event
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
