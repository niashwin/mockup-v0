import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  File01Icon,
  Mail01Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { springs } from "@lib/motion";
import { cn } from "@lib/utils";

const actions: { id: string; label: string; icon: IconSvgElement }[] = [
  { id: "gdoc", label: "Add to Google Doc", icon: File01Icon },
  { id: "email", label: "Email to Engineering", icon: Mail01Icon },
  { id: "github", label: "Upload to GitHub", icon: Upload01Icon },
];

export function PRDActions() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {actions.map((action) => (
        <motion.button
          key={action.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={springs.quick}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-lg)]",
            "border border-border bg-surface",
            "hover:border-accent hover:bg-accent-muted",
            "transition-colors duration-150",
          )}
        >
          <HugeiconsIcon
            icon={action.icon}
            size={14}
            strokeWidth={1.5}
            className="text-muted-foreground"
          />
          <span className="text-caption text-foreground font-medium">
            {action.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
