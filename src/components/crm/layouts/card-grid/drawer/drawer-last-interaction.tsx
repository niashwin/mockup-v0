import { HugeiconsIcon } from "@hugeicons/react";
import {
  CallIcon,
  MapPinIcon,
  Clock01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { GmailIcon, GoogleCalendarIcon } from "@components/icons/source-icons";
import { cn } from "@lib/utils";
import { formatRelativeTime } from "@lib/date-utils";
import { SectionHeader } from "@components/crm/shared/section-header";
import type { Contact, Interaction } from "@types/contact";

/**
 * Drawer Last Interaction
 *
 * Shows the single highest-priority interaction with the contact.
 * Priority: email first → meetings with technical keyTopics → rest by recency.
 *
 * Icons are always one of 5 branded options:
 * Gmail, Google Calendar, Zoom, Phone, In-Person.
 */

// ─── Branded icon components for the 5 allowed types ────────────────────────

function ZoomIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="5" width="14" height="14" rx="3" fill="#2D8CFF" />
      <path d="M16 10.5L21 7.5V16.5L16 13.5V10.5Z" fill="#2D8CFF" />
      <rect x="5" y="9" width="8" height="2" rx="1" fill="white" />
    </svg>
  );
}

function InPersonIcon({ className }: { className?: string }) {
  return (
    <span className={cn("text-orange-500", className)}>
      <HugeiconsIcon icon={MapPinIcon} size={16} strokeWidth={2.2} />
    </span>
  );
}

function PhoneCallIcon({ className }: { className?: string }) {
  return (
    <span className={cn("text-slate-500", className)}>
      <HugeiconsIcon icon={CallIcon} size={16} strokeWidth={2.2} />
    </span>
  );
}

/** All 5 allowed icons for the last interaction display */
type InteractionIconId = "gmail" | "calendar" | "zoom" | "phone" | "in-person";

const ICON_COMPONENTS: Record<
  InteractionIconId,
  React.ComponentType<{ className?: string }>
> = {
  gmail: GmailIcon,
  calendar: GoogleCalendarIcon,
  zoom: ZoomIcon,
  phone: PhoneCallIcon,
  "in-person": InPersonIcon,
};

/** Meeting sub-variants — deterministically picked per interaction id */
const MEETING_VARIANTS: InteractionIconId[] = ["calendar", "zoom", "in-person"];

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getInteractionIcon(interaction: Interaction): InteractionIconId {
  switch (interaction.type) {
    case "email":
    case "slack":
    case "linkedin":
      return "gmail";
    case "call":
      return "phone";
    case "meeting":
      return MEETING_VARIANTS[
        hashString(interaction.id) % MEETING_VARIANTS.length
      ];
    case "note":
      return "calendar";
    default:
      return "gmail";
  }
}

function getInteractionPriority(interaction: Interaction): number {
  if (interaction.type === "email") return 2;
  if (
    interaction.type === "meeting" &&
    interaction.keyTopics?.some((t) => t.toLowerCase().includes("technical"))
  ) {
    return 1;
  }
  return 0;
}

function getHighestPriorityInteraction(
  interactions: Interaction[],
): Interaction | undefined {
  if (interactions.length === 0) return undefined;

  return [...interactions].sort((a, b) => {
    const priorityDiff = getInteractionPriority(b) - getInteractionPriority(a);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  })[0];
}

interface DrawerLastInteractionProps {
  contact: Contact;
  onViewAllMeetings?: () => void;
}

export function DrawerLastInteraction({
  contact,
  onViewAllMeetings,
}: DrawerLastInteractionProps) {
  const latest = getHighestPriorityInteraction(contact.interactions);

  if (!latest) return null;

  const iconId = getInteractionIcon(latest);
  const IconComp = ICON_COMPONENTS[iconId];

  return (
    <section>
      <SectionHeader
        icon={Clock01Icon}
        title="Last Interaction"
        variant="label"
      />
      <div
        className={cn(
          "flex items-start gap-3 p-3 rounded-[var(--radius-lg)]",
          "border border-border/60 bg-muted/5",
        )}
      >
        <div
          className={cn(
            "size-8 rounded-[var(--radius-md)] flex items-center justify-center shrink-0",
            "bg-muted/50",
          )}
        >
          <IconComp className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-ui text-foreground font-medium truncate">
            {latest.subject}
          </p>
          {latest.summary && (
            <p className="text-caption text-muted-foreground mt-0.5 line-clamp-2">
              {latest.summary}
            </p>
          )}
          <span className="text-caption text-muted-foreground/60 mt-1 block">
            {formatRelativeTime(latest.date)}
          </span>
        </div>
      </div>
      <button
        onClick={onViewAllMeetings}
        className="inline-flex items-center gap-1 text-caption text-accent hover:text-accent/80 transition-colors mt-2"
      >
        View more
        <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} strokeWidth={2} />
      </button>
    </section>
  );
}
