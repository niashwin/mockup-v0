import { cn } from "@lib/utils";
import type { Contact } from "@types/contact";

/**
 * Contact Avatar
 *
 * Clean, minimal avatar display. The photo/initials are the focus -
 * no decorative rings or color indicators.
 *
 * Editorial design: Let faces be the visual anchor.
 */

interface ContactAvatarProps {
  contact: Contact;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const sizeConfig = {
  sm: { container: "size-6", text: "text-[10px]" },
  md: { container: "size-8", text: "text-xs" },
  lg: { container: "size-10", text: "text-sm" },
  xl: { container: "size-14", text: "text-base" }, // 56px - for cards
  "2xl": { container: "size-20", text: "text-xl" }, // 80px - for drawer
};

export function ContactAvatar({
  contact,
  size = "md",
  className,
}: ContactAvatarProps) {
  const config = sizeConfig[size];
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`;

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center shrink-0 overflow-hidden",
        "bg-gradient-to-br from-muted to-muted/50",
        "text-muted-foreground font-medium",
        config.container,
        config.text,
        className,
      )}
    >
      {contact.avatarUrl ? (
        <img
          src={contact.avatarUrl}
          alt={`${contact.firstName} ${contact.lastName}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="select-none uppercase tracking-wide">{initials}</span>
      )}
    </div>
  );
}
