import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Mail01Icon,
  CallIcon,
  MapPinIcon,
  Linkedin01Icon,
  Link03Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { SectionHeader } from "@components/crm/shared/section-header";
import type { Contact } from "@types/contact";

/**
 * Drawer Contact Info
 *
 * Compact row of contact details (email, phone, location, LinkedIn)
 * shown at the bottom of the drawer with a top border separator.
 */

function CompactContactInfo({ contact }: { contact: Contact }) {
  const items = [
    { icon: Mail01Icon, value: contact.email, href: `mailto:${contact.email}` },
    contact.phone && {
      icon: CallIcon,
      value: contact.phone,
      href: `tel:${contact.phone}`,
    },
    contact.location && { icon: MapPinIcon, value: contact.location },
    contact.linkedIn && {
      icon: Linkedin01Icon,
      value: "LinkedIn",
      href: `https://${contact.linkedIn}`,
      external: true,
    },
  ].filter(Boolean) as Array<{
    icon: IconSvgElement;
    value: string;
    href?: string;
    external?: boolean;
  }>;

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item, i) => {
        const content = (
          <span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground hover:text-foreground transition-colors">
            <HugeiconsIcon
              icon={item.icon}
              size={14}
              strokeWidth={1.5}
              className="opacity-60"
            />
            <span className="truncate max-w-[140px]">{item.value}</span>
            {item.external && (
              <HugeiconsIcon
                icon={Link03Icon}
                size={10}
                className="opacity-40"
              />
            )}
          </span>
        );

        return item.href ? (
          <a
            key={i}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="hover:underline underline-offset-2"
          >
            {content}
          </a>
        ) : (
          <span key={i}>{content}</span>
        );
      })}
    </div>
  );
}

export function DrawerContactInfo({ contact }: { contact: Contact }) {
  return (
    <section className="pt-5 border-t border-border/30">
      <SectionHeader icon={UserIcon} title="Contact" variant="label" />
      <CompactContactInfo contact={contact} />
    </section>
  );
}
