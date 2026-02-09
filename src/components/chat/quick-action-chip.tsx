import { motion } from "motion/react";
import { chatboxChipVariants, springs } from "@lib/motion";
import { cn } from "@lib/utils";

export type ChipColor = "green" | "amber" | "blue" | "neutral";

interface QuickActionChipProps {
  label: string;
  color?: ChipColor;
  onClick?: () => void;
  className?: string;
}

const colorStyles: Record<ChipColor, { bg: string; inner: string }> = {
  green: {
    bg: "bg-emerald-500/25",
    inner: "bg-emerald-400",
  },
  amber: {
    bg: "bg-amber-500/25",
    inner: "bg-amber-400",
  },
  blue: {
    bg: "bg-accent/25",
    inner: "bg-accent",
  },
  neutral: {
    bg: "bg-muted-foreground/20",
    inner: "bg-muted-foreground",
  },
};

export function QuickActionChip({
  label,
  color = "neutral",
  onClick,
  className,
}: QuickActionChipProps) {
  const styles = colorStyles[color];

  return (
    <motion.button
      variants={chatboxChipVariants}
      whileHover={{ opacity: 0.8 }}
      whileTap={{ scale: 0.98 }}
      transition={springs.quick}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5",
        "text-caption text-foreground font-medium",
        "hover:text-accent transition-colors cursor-pointer",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center w-4 h-4 rounded",
          styles.bg,
        )}
      >
        <span className={cn("w-1.5 h-3 rounded-sm", styles.inner)} />
      </span>
      {label}
    </motion.button>
  );
}

interface AllActionsButtonProps {
  onClick?: () => void;
  className?: string;
}

export function AllActionsButton({
  onClick,
  className,
}: AllActionsButtonProps) {
  return (
    <motion.button
      variants={chatboxChipVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={springs.quick}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
        "bg-surface border border-border-subtle",
        "text-caption text-foreground font-medium",
        "hover:bg-muted hover:border-border hover:text-foreground transition-colors cursor-pointer",
        className,
      )}
    >
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-3.5 h-3.5 text-muted-foreground"
      >
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
      All recipes
    </motion.button>
  );
}
