import { useMemo } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon, PinIcon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { ContactCard } from "./contact-card";
import { ContactDrawer } from "./contact-drawer";
import { useCrmStore, useHasActiveFilters } from "@stores/crm-store";
import { getAllContactTags } from "@lib/crm-tag-utils";
import { cardGridContainer, cardGridItem } from "@lib/motion";
import type { Contact } from "@types/contact";

/**
 * Card Grid Layout
 *
 * Three-tier sort priority:
 * 1. Contacts matching pinned tag groups (with section header)
 * 2. Individually pinned contacts
 * 3. All others sorted by last contacted
 */

interface CardGridLayoutProps {
  contacts: Contact[];
  onViewAllMeetings?: (contact: Contact) => void;
}

export function CardGridLayout({
  contacts,
  onViewAllMeetings,
}: CardGridLayoutProps) {
  const {
    contacts: allContacts,
    selectedContactId,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    pinnedContactIds,
    pinnedTagGroups,
    cardSize,
  } = useCrmStore();

  const hasActiveFilters = useHasActiveFilters();

  const selectedContact =
    allContacts.find((c) => c.id === selectedContactId) ?? null;

  // Three-tier sort: pinned groups > pinned contacts > by recency
  // Pinning only applies on the default (unfiltered) view
  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      if (!hasActiveFilters) {
        const isTagGroupPinned = (contact: Contact) =>
          pinnedTagGroups.some((tag) =>
            getAllContactTags(contact).includes(tag),
          );
        const aGroupPinned = isTagGroupPinned(a);
        const bGroupPinned = isTagGroupPinned(b);
        const aIndPinned = pinnedContactIds.includes(a.id);
        const bIndPinned = pinnedContactIds.includes(b.id);

        // Tier 1: pinned tag groups first
        if (aGroupPinned && !bGroupPinned) return -1;
        if (!aGroupPinned && bGroupPinned) return 1;

        // Tier 2: individually pinned
        if (aIndPinned && !bIndPinned) return -1;
        if (!aIndPinned && bIndPinned) return 1;
      }

      // Default: by last contacted
      return (
        new Date(b.lastContacted).getTime() -
        new Date(a.lastContacted).getTime()
      );
    });
  }, [contacts, pinnedContactIds, pinnedTagGroups, hasActiveFilters]);

  if (contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-sm px-6">
          <div className="size-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-5">
            <HugeiconsIcon
              icon={UserGroupIcon}
              size={28}
              strokeWidth={1.5}
              className="text-muted-foreground/40"
            />
          </div>
          <h3 className="font-semibold text-heading text-foreground mb-2">
            No contacts found
          </h3>
          <p className="text-caption text-muted-foreground/70">
            Try adjusting your search or filters to find contacts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full overflow-y-auto p-6 lg:p-8">
        {/* Pinned groups indicator */}
        {pinnedTagGroups.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <HugeiconsIcon
              icon={PinIcon}
              size={14}
              strokeWidth={1.5}
              className="text-amber-500"
            />
            <span className="text-caption text-muted-foreground/70 capitalize">
              Pinned: {pinnedTagGroups.join(", ")}
            </span>
          </div>
        )}

        <motion.div
          className={cn(
            "grid gap-5",
            cardSize === "sm"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          )}
          variants={cardGridContainer}
          initial="hidden"
          animate="visible"
        >
          {sortedContacts.map((contact) => (
            <motion.div key={contact.id} variants={cardGridItem}>
              <ContactCard
                contact={contact}
                isSelected={contact.id === selectedContactId && isDrawerOpen}
                onClick={() => openDrawer(contact.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ContactDrawer
        contact={selectedContact}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onViewAllMeetings={onViewAllMeetings}
      />
    </>
  );
}
