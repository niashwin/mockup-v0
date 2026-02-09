import { HugeiconsIcon } from "@hugeicons/react";
import { RadioIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { cn } from "@lib/utils";
import { springs } from "@lib/motion";
import type { RadarItem, RadarSeverity } from "@types/radar";

interface RadarCardProps {
  radar: RadarItem;
  isSelected: boolean;
  onClick: () => void;
}

function getSeverityConfig(severity: RadarSeverity) {
  const configs: Record<
    RadarSeverity,
    { label: string; dotClass: string; textClass: string }
  > = {
    critical: {
      label: "Critical",
      dotClass: "bg-red-500 animate-pulse",
      textClass: "text-red-600 dark:text-red-400",
    },
    high: {
      label: "High",
      dotClass: "bg-orange-500",
      textClass: "text-orange-600 dark:text-orange-400",
    },
    medium: {
      label: "Medium",
      dotClass: "bg-amber-500",
      textClass: "text-amber-600 dark:text-amber-400",
    },
    low: {
      label: "Low",
      dotClass: "bg-slate-400",
      textClass: "text-slate-500 dark:text-slate-400",
    },
  };
  return configs[severity];
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Radar card for the archive list
 * Displays severity indicator, title, category, and time
 */
export function RadarCard({ radar, isSelected, onClick }: RadarCardProps) {
  const severityConfig = getSeverityConfig(radar.severity);

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
        {/* Severity indicator */}
        <div className="flex items-center gap-2 pt-0.5">
          <span
            className={cn(
              "size-2 rounded-full shrink-0",
              severityConfig.dotClass,
            )}
          />
          <HugeiconsIcon
            icon={RadioIcon}
            size={14}
            className={cn("shrink-0", severityConfig.textClass)}
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
            {radar.title}
          </h3>

          {/* Metadata row */}
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-wide",
                severityConfig.textClass,
              )}
            >
              {severityConfig.label}
            </span>
            <span className="text-[10px] text-muted-foreground/40">·</span>
            <span className="text-[11px] text-muted-foreground/50">
              {radar.category}
            </span>
            <span className="text-[10px] text-muted-foreground/40">·</span>
            <span className="text-[11px] text-muted-foreground/50 tabular-nums">
              {formatRelativeDate(radar.detectedAt)}
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
