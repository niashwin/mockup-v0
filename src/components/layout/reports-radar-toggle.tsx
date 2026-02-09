import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { File02Icon, AlertDiamondIcon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { cn } from "@lib/utils";
import { springs } from "@lib/motion";

export type ViewMode = "reports" | "radar";

const modes: { id: ViewMode; icon: IconSvgElement; label: string }[] = [
  { id: "reports", icon: File02Icon, label: "Reports" },
  { id: "radar", icon: AlertDiamondIcon, label: "Radar" },
];

interface ReportsRadarToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

/**
 * Compact toggle between Reports and Radar views
 * Uses motion layoutId for smooth background animation
 */
export function ReportsRadarToggle({
  value,
  onChange,
  className,
}: ReportsRadarToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 p-0.5 rounded-[var(--radius-md)] bg-muted/40",
        className,
      )}
    >
      {modes.map(({ id, icon, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "relative flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)]",
            "text-[11px] font-medium transition-colors",
            value === id
              ? "text-foreground"
              : "text-foreground/60 hover:text-foreground/80",
          )}
        >
          {value === id && (
            <motion.div
              layoutId="reports-radar-indicator"
              className="absolute inset-0 bg-surface-elevated rounded-[var(--radius-sm)] shadow-sm"
              transition={springs.quick}
            />
          )}
          <HugeiconsIcon
            icon={icon}
            size={12}
            strokeWidth={1.5}
            className="relative z-10"
          />
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  );
}
