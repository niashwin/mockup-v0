import { HugeiconsIcon } from "@hugeicons/react";
import { File01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { cn, formatDate } from "@lib/utils";
import { springs } from "@lib/motion";
import type { ArchivedReportType } from "./report-card";

interface ArchivedReportItem {
  id: string;
  title: string;
  type: ArchivedReportType;
  date: Date;
  isUnread?: boolean;
}

interface ArchiveReportItemProps {
  report: ArchivedReportItem;
  isSelected: boolean;
  onClick: () => void;
}

function getTypeConfig(type: ArchivedReportType) {
  const configs: Record<
    ArchivedReportType,
    { label: string; textClass: string }
  > = {
    weekly: {
      label: "Weekly",
      textClass: "text-blue-600 dark:text-blue-400",
    },
    risk: {
      label: "Risk",
      textClass: "text-amber-600 dark:text-amber-400",
    },
    daily: {
      label: "Daily",
      textClass: "text-emerald-600 dark:text-emerald-400",
    },
    report: {
      label: "Report",
      textClass: "text-violet-600 dark:text-violet-400",
    },
    standard: {
      label: "Report",
      textClass: "text-slate-600 dark:text-slate-400",
    },
  };
  return configs[type];
}

/**
 * Compact report item for archive list (matches archive-sidebar style)
 */
export function ArchiveReportItem({
  report,
  isSelected,
  onClick,
}: ArchiveReportItemProps) {
  const typeConfig = getTypeConfig(report.type);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full text-left px-3 py-3 rounded-[var(--radius-md)]",
        "transition-colors duration-150 cursor-pointer",
        isSelected ? "bg-accent-muted" : "hover:bg-muted/70",
      )}
      whileHover={{ x: 1 }}
      transition={springs.quick}
    >
      <div className="flex items-start gap-3">
        {/* Icon indicator */}
        <div className="flex items-center gap-2 pt-0.5">
          <span
            className={cn(
              "size-2 rounded-full shrink-0",
              report.isUnread
                ? "bg-blue-500"
                : "bg-slate-300 dark:bg-slate-600",
            )}
          />
          <HugeiconsIcon
            icon={File01Icon}
            size={14}
            className={cn("shrink-0", typeConfig.textClass)}
            strokeWidth={1.5}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3
            className={cn(
              "font-medium text-[13px] leading-tight transition-colors line-clamp-2",
              isSelected
                ? "text-foreground"
                : "text-muted-foreground group-hover:text-foreground",
            )}
          >
            {report.title}
          </h3>

          {/* Metadata row */}
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-wide",
                typeConfig.textClass,
              )}
            >
              {typeConfig.label}
            </span>
            <span className="text-[10px] text-muted-foreground/40">·</span>
            <span className="text-[11px] text-muted-foreground/50 tabular-nums">
              {formatDate(report.date)}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={16}
          className="text-muted-foreground/30 shrink-0 mt-0.5"
          strokeWidth={1.5}
        />
      </div>
    </motion.button>
  );
}

export type { ArchivedReportItem };
