import { motion } from "motion/react";
import { cn } from "@lib/utils";
import { springs } from "@lib/motion";
import type { RadarItem, RadarSeverity } from "@types/radar";

interface RadarItemCardProps {
  item: RadarItem;
  isSelected: boolean;
  onClick: () => void;
}

const severityColors: Record<RadarSeverity, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-slate-400",
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function RadarItemCard({
  item,
  isSelected,
  onClick,
}: RadarItemCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full text-left rounded-[var(--radius-md)] px-3 py-2.5 transition-colors",
        isSelected ? "bg-accent-muted" : "hover:bg-muted/70",
      )}
      whileHover={{ x: 1 }}
      transition={springs.quick}
    >
      <div className="flex items-start gap-2">
        {/* Severity Indicator */}
        <div
          className={cn(
            "size-1.5 rounded-full mt-1.5 shrink-0",
            severityColors[item.severity],
            item.severity === "critical" && "animate-pulse",
          )}
        />

        <div className="flex-1 min-w-0">
          {/* Meta Row - date first */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[11px] text-muted-foreground/50 tabular-nums">
              {formatTimeAgo(item.detectedAt)}
            </span>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "font-medium text-[13px] leading-tight line-clamp-2 transition-colors",
              isSelected
                ? "text-foreground"
                : "text-muted-foreground group-hover:text-foreground",
            )}
          >
            {item.title}
          </h3>
        </div>
      </div>
    </motion.button>
  );
}
