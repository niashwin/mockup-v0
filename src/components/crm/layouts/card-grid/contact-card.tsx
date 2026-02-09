import { HugeiconsIcon } from "@hugeicons/react";
import { PinIcon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { formatRelativeTime } from "@lib/date-utils";
import { useCrmStore } from "@stores/crm-store";
import type { Contact } from "@types/contact";

/**
 * Contact Card
 *
 * Rectangular dossier card with prominent photo on the left.
 * Supports three sizes controlled by cardSize in CRM store.
 * Profile pictures displayed prominently with large photo sections.
 */

const SIZE_CONFIG = {
  sm: {
    photoWidth: "w-32",
    minHeight: "min-h-[160px]",
    padding: "p-5",
    nameText: "text-body",
    titleText: "text-ui",
    companyText: "text-caption",
    tagText: "text-caption",
    maxTags: 3,
    initialsText: "text-heading",
    dateText: "text-caption",
  },
  md: {
    photoWidth: "w-48",
    minHeight: "min-h-[280px]",
    padding: "p-6",
    nameText: "text-heading",
    titleText: "text-body",
    companyText: "text-ui",
    tagText: "text-caption",
    maxTags: 4,
    initialsText: "text-display",
    dateText: "text-ui",
  },
  lg: {
    photoWidth: "w-64",
    minHeight: "min-h-[380px]",
    padding: "p-8",
    nameText: "text-display",
    titleText: "text-heading",
    companyText: "text-body",
    tagText: "text-ui",
    maxTags: 5,
    initialsText: "text-2xl",
    dateText: "text-body",
  },
} as const;

interface ContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
}

export function ContactCard({
  contact,
  isSelected,
  onClick,
}: ContactCardProps) {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`;

  const { pinnedContactIds, togglePin, cardSize } = useCrmStore();
  const isPinned = pinnedContactIds?.includes(contact.id) ?? false;

  const config = SIZE_CONFIG[cardSize];
  const displayTags = contact.tags;

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin?.(contact.id);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative text-left w-full rounded-[var(--radius-lg)] overflow-hidden",
        "bg-surface-elevated",
        "border transition-all duration-200",
        "focus:outline-none",
        "border-border hover:border-border-subtle hover:shadow-sm",
        isPinned && "border-amber-400/40",
      )}
    >
      {/* Pin indicator */}
      <button
        onClick={handlePinClick}
        className={cn(
          "absolute top-2 right-2 z-10",
          "transition-all duration-200",
          isPinned
            ? "text-amber-500 dark:text-amber-400"
            : "opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-amber-500",
        )}
      >
        <HugeiconsIcon icon={PinIcon} size={14} strokeWidth={1.5} />
      </button>

      <div className="flex">
        {/* Tall profile photo - left side */}
        <div
          className={cn(
            config.photoWidth,
            "shrink-0 bg-gradient-to-br from-muted to-muted/50 relative",
          )}
        >
          {contact.avatarUrl ? (
            <img
              src={contact.avatarUrl}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span
                className={cn(
                  config.initialsText,
                  "font-medium text-muted-foreground/60 uppercase",
                )}
              >
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Info section - right side */}
        <div
          className={cn(
            "flex-1 flex flex-col justify-between",
            config.padding,
            config.minHeight,
          )}
        >
          {/* Top: Name, role, company */}
          <div>
            <h3
              className={cn(
                "font-medium text-foreground truncate leading-tight",
                config.nameText,
              )}
            >
              {fullName}
            </h3>
            <p
              className={cn(
                "text-muted-foreground truncate mt-0.5",
                config.titleText,
              )}
            >
              {contact.title}
            </p>
            <p
              className={cn(
                "text-muted-foreground/60 truncate",
                config.companyText,
              )}
            >
              {contact.company}
            </p>

            {/* Tags - right below company */}
            {displayTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {displayTags.slice(0, config.maxTags).map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "px-2 py-0.5 rounded bg-muted/50 text-muted-foreground truncate max-w-[120px] capitalize",
                      config.tagText,
                    )}
                  >
                    {tag}
                  </span>
                ))}
                {displayTags.length > config.maxTags && (
                  <span
                    className={cn("text-muted-foreground/50", config.tagText)}
                  >
                    +{displayTags.length - config.maxTags}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom-right: Date, scaled by card size */}
          <div className="flex items-center justify-end mt-3 pt-2 border-t border-border/30">
            <span
              className={cn(
                "text-muted-foreground/60 tabular-nums",
                config.dateText,
              )}
            >
              {formatRelativeTime(contact.lastContacted)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
