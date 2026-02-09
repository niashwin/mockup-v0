import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { SectionHeader } from "@components/crm/shared/section-header";
import type { Contact } from "@types/contact";

/**
 * Drawer Relationship Status
 *
 * Displays the AI-generated relationship summary for the contact.
 */

export function DrawerRelationshipStatus({ contact }: { contact: Contact }) {
  return (
    <section>
      <SectionHeader
        icon={FavouriteIcon}
        title="Relationship Status"
        variant="label"
      />
      <p className="text-sm text-foreground leading-relaxed">
        {contact.insights.aiSummary}
      </p>
    </section>
  );
}
