import { ContactAvatar } from "@components/crm/shared/contact-avatar";
import type { Contact } from "@types/contact";

/**
 * Drawer Profile Header
 *
 * Centered layout showing avatar (2xl), full name, title,
 * and company (as LinkedIn link).
 * Contact info has been moved to DrawerContactInfo at the bottom of the drawer.
 */

export function DrawerProfileHeader({ contact }: { contact: Contact }) {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const companyLinkedInUrl = `https://linkedin.com/company/${encodeURIComponent(contact.company)}`;

  return (
    <header className="text-center">
      <div className="flex justify-center mb-4">
        <ContactAvatar contact={contact} size="2xl" />
      </div>

      <h2 className="font-medium text-title text-foreground tracking-tight mb-1">
        {fullName}
      </h2>
      <p className="text-body text-muted-foreground">{contact.title}</p>
      <a
        href={companyLinkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-caption text-muted-foreground/60 underline underline-offset-2 hover:text-muted-foreground transition-colors"
      >
        {contact.company}
      </a>
    </header>
  );
}
