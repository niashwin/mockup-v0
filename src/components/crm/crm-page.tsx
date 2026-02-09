import { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { CrmHeader } from "./crm-header";
import { CardGridLayout } from "./layouts";
import { useCrmStore } from "@stores/crm-store";
import { contactMatchesTags, contactMatchesRecency } from "@lib/crm-tag-utils";

/**
 * CRM Page
 *
 * Clean, full-width contact management page with card grid layout.
 * Unified filtering via tags (auto + custom) and recency buckets.
 */

interface CrmPageProps {
  onViewAllMeetings?: (contact: import("@types/contact").Contact) => void;
}

export function CrmPage({ onViewAllMeetings }: CrmPageProps) {
  const { contacts, searchQuery, selectedTags, selectedRecencyFilter } =
    useCrmStore();

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = [
          contact.firstName,
          contact.lastName,
          contact.company,
          contact.title,
          contact.email,
          contact.insights.aiSummary,
        ]
          .join(" ")
          .toLowerCase();
        if (!searchableText.includes(query)) return false;
      }

      // Unified tag filter (auto + custom)
      if (
        selectedTags.length > 0 &&
        !contactMatchesTags(contact, selectedTags)
      ) {
        return false;
      }

      // Recency filter
      if (!contactMatchesRecency(contact, selectedRecencyFilter)) {
        return false;
      }

      return true;
    });
  }, [contacts, searchQuery, selectedTags, selectedRecencyFilter]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <CrmHeader />

      <div className="flex-1 overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={48}
                strokeWidth={1}
                className="mx-auto mb-4 text-muted-foreground/20"
              />
              <p className="text-muted-foreground font-medium">
                No contacts found
              </p>
              <p className="text-caption text-muted-foreground/50 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <CardGridLayout
            contacts={filteredContacts}
            onViewAllMeetings={onViewAllMeetings}
          />
        )}
      </div>
    </div>
  );
}
