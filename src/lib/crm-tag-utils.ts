import type { Contact, CrmTagMeta } from "@types/contact";

/**
 * CRM Tag Utilities
 *
 * Simplified tag system with two categories:
 * - Role tags: investor, client, team, contractor, friend
 * - Company tags: Sentra, A16Z, Sequoia, Glean
 *
 * Filtering uses AND logic — selecting multiple tags narrows results.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Tag Constants
// ─────────────────────────────────────────────────────────────────────────────

export const ROLE_TAGS = [
  "Investor",
  "Client",
  "Team",
  "Contractor",
  "Friend",
] as const;

export const COMPANY_TAGS = ["Sentra", "A16Z", "Sequoia", "Glean"] as const;

export const ALL_KNOWN_TAGS: readonly string[] = [
  ...ROLE_TAGS,
  ...COMPANY_TAGS,
];

// ─────────────────────────────────────────────────────────────────────────────
// Tag Classification
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Determine whether a tag is a "role" or "company" tag.
 */
export function getTagType(tag: string): "role" | "company" {
  return (ROLE_TAGS as readonly string[]).includes(tag) ? "role" : "company";
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact Tags
// ─────────────────────────────────────────────────────────────────────────────

export function getAllContactTags(contact: Contact): string[] {
  return contact.tags;
}

// ─────────────────────────────────────────────────────────────────────────────
// Unified Tag List
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the unified tag list across all contacts with metadata.
 * Classifies each tag as role, company, or custom. Sorted by count within each group.
 * Accepts optional customGlobalTags to include user-created tags (even with 0 contacts).
 */
export function getUnifiedTagList(
  contacts: Contact[],
  customGlobalTags: string[] = [],
): CrmTagMeta[] {
  const countMap = new Map<string, number>();

  for (const contact of contacts) {
    for (const tag of contact.tags) {
      countMap.set(tag, (countMap.get(tag) ?? 0) + 1);
    }
  }

  // Ensure custom global tags appear even with 0 contacts
  for (const tag of customGlobalTags) {
    if (!countMap.has(tag)) {
      countMap.set(tag, 0);
    }
  }

  const roleTags: CrmTagMeta[] = [];
  const companyTags: CrmTagMeta[] = [];
  const customTags: CrmTagMeta[] = [];

  for (const [label, count] of countMap) {
    if (customGlobalTags.includes(label)) {
      customTags.push({ label, type: "custom", count });
    } else {
      const type = getTagType(label);
      const entry: CrmTagMeta = { label, type, count };
      if (type === "role") {
        roleTags.push(entry);
      } else {
        companyTags.push(entry);
      }
    }
  }

  const sortByCountThenAlpha = (a: CrmTagMeta, b: CrmTagMeta) =>
    b.count - a.count || a.label.localeCompare(b.label);

  return [
    ...roleTags.sort(sortByCountThenAlpha),
    ...companyTags.sort(sortByCountThenAlpha),
    ...customTags.sort(sortByCountThenAlpha),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Tag Matching (AND logic)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if a contact matches ALL of the selected tags (AND logic).
 * Returns true when no tags are selected.
 */
export function contactMatchesTags(
  contact: Contact,
  selectedTags: string[],
): boolean {
  if (selectedTags.length === 0) return true;
  const contactTags = getAllContactTags(contact);
  return selectedTags.every((tag) => contactTags.includes(tag));
}

// ─────────────────────────────────────────────────────────────────────────────
// Recency Filtering
// ─────────────────────────────────────────────────────────────────────────────

const RECENCY_BUCKETS = [
  "This week",
  "This month",
  "1-3 months ago",
  "3-6 months ago",
  "6+ months ago",
] as const;

export type RecencyBucket = (typeof RECENCY_BUCKETS)[number];

export const RECENCY_OPTIONS: readonly string[] = RECENCY_BUCKETS;

/**
 * Get the recency bucket for a given date.
 */
export function getRecencyBucket(date: Date): RecencyBucket {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays <= 7) return "This week";
  if (diffDays <= 30) return "This month";
  if (diffDays <= 90) return "1-3 months ago";
  if (diffDays <= 180) return "3-6 months ago";
  return "6+ months ago";
}

/**
 * Check if a contact's last interaction falls in the selected recency bucket.
 */
export function contactMatchesRecency(
  contact: Contact,
  recencyFilter: string | null,
): boolean {
  if (!recencyFilter) return true;
  return getRecencyBucket(contact.lastContacted) === recencyFilter;
}
