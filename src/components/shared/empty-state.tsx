import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { cn } from "@lib/utils";
import { springs, fadeVariants } from "@lib/motion";

interface EmptyStateProps {
  icon?: IconSvgElement;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Empty state component for placeholder pages
 * Shows a clean "Coming Soon" message
 */
export function EmptyState({
  icon = SparklesIcon,
  title = "Coming Soon",
  description = "This feature is in development",
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      transition={springs.gentle}
      className={cn(
        "flex flex-col items-center justify-center h-full",
        "text-center p-8",
        className,
      )}
    >
      <div className="mb-4 p-4 rounded-2xl bg-muted/50">
        <HugeiconsIcon
          icon={icon}
          size={32}
          className="text-muted-foreground"
          strokeWidth={1.2}
        />
      </div>
      <h2 className="text-heading font-semibold text-foreground mb-2">
        {title}
      </h2>
      <p className="text-ui text-muted-foreground max-w-sm">{description}</p>
    </motion.div>
  );
}
