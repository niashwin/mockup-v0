import { HugeiconsIcon } from "@hugeicons/react";
import { Link03Icon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { springs } from "@lib/motion";
import { cn, isValidExternalUrl } from "@lib/utils";
import type { SourceItem } from "@types/sources";

interface SourceCardProps {
  source: SourceItem;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SourceCard({ source }: SourceCardProps) {
  const hasValidLink = isValidExternalUrl(source.href);

  const handleClick = () => {
    if (hasValidLink && source.href) {
      window.open(source.href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={springs.quick}
      className={cn(
        "w-full p-3 bg-surface border border-border rounded-[var(--radius-lg)] text-left",
        "transition-colors duration-150",
        "hover:bg-muted hover:text-foreground hover:border-[var(--color-sources)] cursor-pointer",
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <h4 className="text-ui font-medium text-foreground truncate flex-1">
          {source.title}
        </h4>
        {hasValidLink && (
          <HugeiconsIcon
            icon={Link03Icon}
            size={12}
            strokeWidth={1.5}
            className="text-muted-foreground shrink-0"
          />
        )}
      </div>

      {source.snippet && (
        <p className="text-caption text-muted-foreground line-clamp-2 mb-1">
          {source.snippet}
        </p>
      )}

      <time className="text-caption text-muted-foreground/70 tabular-nums">
        {formatTimestamp(source.timestamp)}
      </time>
    </motion.button>
  );
}
