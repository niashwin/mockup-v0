import type { Contact } from "@types/contact";
import type { MeetingAttendee } from "@types/meeting";

/**
 * Contact-Meeting Linking Utilities
 *
 * Functions to bridge between CRM contacts and meeting attendees,
 * enabling features like:
 * - Clicking an attendee to view their CRM profile
 * - Finding the most recent meeting with a contact
 */

/**
 * Find a CRM contact that matches a meeting attendee.
 * Matching strategy (in priority order):
 * 1. Explicit linkedContactId
 * 2. Email match (case-insensitive)
 * 3. Full name match (case-insensitive)
 */
export function findContactForAttendee(
  attendee: MeetingAttendee,
  contacts: Contact[],
): Contact | null {
  // 1. Explicit link - most reliable
  if (attendee.linkedContactId) {
    const linked = contacts.find((c) => c.id === attendee.linkedContactId);
    if (linked) return linked;
  }

  // 2. Email match - high confidence
  const emailMatch = contacts.find(
    (c) => c.email.toLowerCase() === attendee.email.toLowerCase(),
  );
  if (emailMatch) return emailMatch;

  // 3. Full name match - fallback
  const attendeeNameLower = attendee.name.toLowerCase().trim();
  const nameMatch = contacts.find((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return fullName === attendeeNameLower;
  });

  return nameMatch ?? null;
}

/**
 * Create a minimal Contact object from a MeetingAttendee.
 * Used when displaying the drawer for attendees not in the CRM.
 */
export function createContactFromAttendee(attendee: MeetingAttendee): Contact {
  const nameParts = attendee.name.split(" ");
  const firstName = nameParts[0] || "Unknown";
  const lastName = nameParts.slice(1).join(" ") || "";

  const now = new Date();

  return {
    id: `temp-attendee-${attendee.id}`,
    firstName,
    lastName,
    avatarUrl: attendee.avatarUrl,
    company: "Unknown",
    title: "Meeting Attendee",
    email: attendee.email,
    category: "other",
    relationship: "contact",
    relationshipScore: 0,
    roleBadges: [],
    tags: [],
    insights: {
      aiSummary: "This person is not yet in your CRM.",
    },
    notes: {
      customSummary: "",
    },
    interestingFacts: [],
    recentTopics: [],
    interactions: [],
    lastContacted: now,
    createdAt: now,
    updatedAt: now,
  };
}
