import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Mail01Icon,
  Calendar01Icon,
  CallIcon,
  Message01Icon,
  Linkedin01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { formatRelativeTime } from "@lib/date-utils";
import type { Interaction, InteractionType } from "@types/contact";

/**
 * Activity Timeline
 *
 * Displays recent interactions with icons and relative timestamps.
 */

const interactionConfig: Record<
  InteractionType,
  { icon: IconSvgElement; color: string }
> = {
  email: { icon: Mail01Icon, color: "text-blue-500" },
  meeting: { icon: Calendar01Icon, color: "text-violet-500" },
  call: { icon: CallIcon, color: "text-emerald-500" },
  slack: { icon: Message01Icon, color: "text-pink-500" },
  linkedin: { icon: Linkedin01Icon, color: "text-sky-600" },
  note: { icon: File01Icon, color: "text-amber-500" },
};

interface ActivityTimelineProps {
  interactions: Interaction[];
  limit?: number;
}

export function ActivityTimeline({
  interactions,
  limit = 5,
}: ActivityTimelineProps) {
  const items = interactions.slice(0, limit);

  return (
    <div className="space-y-0.5">
      {items.map((interaction) => {
        const config = interactionConfig[interaction.type];

        return (
          <div
            key={interaction.id}
            className={cn(
              "group flex items-center gap-3 py-2 px-2.5 -mx-2.5 rounded-[var(--radius-lg)]",
              "hover:bg-muted/60 hover:text-foreground transition-colors cursor-default",
            )}
          >
            <div
              className={cn(
                "size-7 rounded-[var(--radius-md)] flex items-center justify-center shrink-0",
                "bg-muted/50 group-hover:bg-muted transition-colors",
              )}
            >
              <HugeiconsIcon
                icon={config.icon}
                size={14}
                strokeWidth={1.5}
                className={config.color}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate leading-tight">
                {interaction.subject}
              </p>
              {interaction.summary && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {interaction.summary}
                </p>
              )}
            </div>
            <span className="text-xs text-muted-foreground/60 tabular-nums shrink-0">
              {formatRelativeTime(interaction.date)}
            </span>
          </div>
        );
      })}
      {interactions.length > limit && (
        <div className="pt-1">
          <button className="text-xs text-accent hover:text-accent/80 transition-colors">
            View {interactions.length - limit} more interactions
          </button>
        </div>
      )}
    </div>
  );
}
