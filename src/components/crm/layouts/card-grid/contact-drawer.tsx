import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Mail01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { springs } from "@lib/motion";
import { Button } from "@components/ui/button";
import type { Contact } from "@types/contact";
import {
  DrawerProfileHeader,
  DrawerTags,
  DrawerContactInfo,
  DrawerRelationshipStatus,
  DrawerLastInteraction,
  DrawerPersonalNotes,
  DrawerInterestingFacts,
  DrawerTalkingPoints,
} from "./drawer";

/**
 * Contact Drawer
 *
 * Slim shell that composes all drawer section components.
 * Handles portal rendering, backdrop, keyboard dismiss, and scroll.
 *
 * Section order (continuous flow, no dividers):
 * 1. Profile Header (avatar, name, title, company-as-LinkedIn-link)
 * 2. Quick Actions (pill-shaped centered buttons: Email, Schedule)
 * 3. Tags (pill-shaped input + pills, inset)
 * 4. Relationship Status
 * 5. Last Interaction (branded icons: Gmail, Calendar, Zoom, Phone, In-Person)
 * 6. Personal Notes (inline editable, pencil inside box)
 * 7. Interesting Facts
 * 8. Recent Activity (accordion)
 * 9. Recent Company News (accordion)
 * 10. Contact Info (bottom)
 */

interface DrawerContentProps {
  contact: Contact;
  onViewAllMeetings?: () => void;
}

function DrawerContent({ contact, onViewAllMeetings }: DrawerContentProps) {
  return (
    <div className="space-y-6">
      <DrawerProfileHeader contact={contact} />

      {/* Quick action buttons — pill-shaped, centered */}
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full px-5 gap-2"
          onClick={() => window.open(`mailto:${contact.email}`, "_blank")}
        >
          <HugeiconsIcon icon={Mail01Icon} size={14} strokeWidth={2} />
          Email
        </Button>
        <Button variant="outline" size="sm" className="rounded-full px-5 gap-2">
          <HugeiconsIcon icon={Calendar01Icon} size={14} strokeWidth={2} />
          Schedule
        </Button>
      </div>

      <DrawerTags contact={contact} />

      {/* AI-powered sections — continuous flow, no divider */}
      <div className="space-y-6">
        <DrawerRelationshipStatus contact={contact} />
        <DrawerLastInteraction
          contact={contact}
          onViewAllMeetings={onViewAllMeetings}
        />
        <DrawerPersonalNotes contact={contact} />
        <DrawerInterestingFacts contact={contact} />
        <DrawerTalkingPoints contact={contact} />
      </div>

      {/* Contact info — bottom of drawer */}
      <DrawerContactInfo contact={contact} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Drawer Component
// ─────────────────────────────────────────────────────────────────────────────

interface ContactDrawerProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onViewAllMeetings?: (contact: Contact) => void;
}

export function ContactDrawer({
  contact,
  isOpen,
  onClose,
  onViewAllMeetings,
}: ContactDrawerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return createPortal(
    <AnimatePresence>
      {isOpen && contact && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={springs.default}
            className={cn(
              "fixed right-0 top-0 bottom-0 w-[480px] max-w-[calc(100vw-2rem)]",
              "bg-background",
              "border-l border-border/40 shadow-2xl z-50",
              "flex flex-col",
            )}
          >
            {/* Header */}
            <header className="shrink-0 px-5 py-4 border-b border-border/40 flex items-center justify-between">
              <h3 className="font-medium text-ui text-muted-foreground">
                Contact Details
              </h3>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-muted-foreground/50 hover:text-foreground rounded-[var(--radius-lg)] hover:bg-muted/50 transition-colors"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
              </button>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={springs.quick}
                >
                  <DrawerContent
                    contact={contact}
                    onViewAllMeetings={
                      onViewAllMeetings
                        ? () => onViewAllMeetings(contact)
                        : undefined
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
