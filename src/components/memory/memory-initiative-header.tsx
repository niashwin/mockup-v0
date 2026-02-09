import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Target01Icon, Calendar01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { springs } from "@lib/motion";
import { initiativeCategoryColors, type Initiative } from "@types/memory";

/**
 * Initiative Header
 *
 * Displays the selected initiative's information:
 * - Initiative name (large title)
 * - Brief description
 * - Date range and category
 */

interface MemoryInitiativeHeaderProps {
  initiative: Initiative | null;
}

function formatDateRange(start: Date, end?: Date): string {
  const startStr = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (end) {
    const endStr = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${startStr} - ${endStr}`;
  }

  return `Started ${startStr}`;
}

function EmptyState() {
  return (
    <div className="border-b border-border bg-surface-elevated/50 px-6 py-4">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="size-8 rounded-[var(--radius-lg)] bg-muted/50 flex items-center justify-center">
          <HugeiconsIcon
            icon={Target01Icon}
            size={16}
            strokeWidth={1.5}
            className="opacity-50"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground/70">
            No initiative selected
          </p>
          <p className="text-caption text-muted-foreground/60">
            Select an initiative from the sidebar
          </p>
        </div>
      </div>
    </div>
  );
}

export function MemoryInitiativeHeader({
  initiative,
}: MemoryInitiativeHeaderProps) {
  if (!initiative) {
    return <EmptyState />;
  }

  const dotColor =
    initiativeCategoryColors[initiative.category] || "bg-slate-400";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={initiative.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={springs.snappy}
        className="border-b border-border bg-surface-elevated/50"
      >
        <div className="px-6 py-3">
          {/* Row 1: Title + Metadata inline */}
          <div className="flex items-center gap-3">
            {/* Category dot */}
            <div className={cn("size-2 rounded-full shrink-0", dotColor)} />

            {/* Initiative name - consistent with page header titles */}
            <h2 className="text-sm font-semibold text-foreground">
              {initiative.name}
            </h2>

            {/* Separator */}
            <span className="text-border">•</span>

            {/* Date range + Category */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  size={12}
                  strokeWidth={1.5}
                />
                <span>
                  {formatDateRange(initiative.startDate, initiative.targetDate)}
                </span>
              </div>
              <span className="text-border">•</span>
              <span className="font-medium">{initiative.category}</span>
            </div>
          </div>

          {/* Row 2: Description */}
          <p className="text-caption text-muted-foreground mt-1 leading-relaxed max-w-3xl ml-5">
            {initiative.description}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
