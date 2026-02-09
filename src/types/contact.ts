/**
 * CRM Contact Types
 *
 * Data model designed to support the "pokedex" style contact system with
 * three view layouts: accordion (inline expand), master-detail (split view),
 * and card grid (visual cards with drawer).
 *
 * Each contact has layered information:
 * 1. Surface: Avatar, name, company, title (visible in all views)
 * 2. Personality: AI summary, custom notes, role badges (the "pokedex" essence)
 * 3. History: Interactions, topics, activity timeline (relationship depth)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Core Enums & Types
// ─────────────────────────────────────────────────────────────────────────────

/** Relationship classification for visual badges */
export type RelationshipType =
  | "key_stakeholder" // Critical decision-maker, high-touch
  | "champion" // Internal advocate, strong ally
  | "decision_maker" // Budget/approval authority
  | "influencer" // Shapes opinions, technical evaluator
  | "blocker" // Potential obstacle to deals
  | "contact"; // General contact, nurture relationship

/** Interaction channel types */
export type InteractionType =
  | "email"
  | "meeting"
  | "call"
  | "slack"
  | "linkedin"
  | "note";

/** Sentiment derived from interaction analysis */
export type Sentiment = "positive" | "neutral" | "negative" | "mixed";

/** Communication preference */
export type CommunicationStyle =
  | "async" // Prefers email, Slack
  | "sync" // Prefers calls, meetings
  | "formal" // Professional, structured
  | "casual"; // Relaxed, conversational

/** Contact category for grouping */
export type ContactCategory = "investor" | "client" | "other";

// ─────────────────────────────────────────────────────────────────────────────
// Interaction & Activity Types
// ─────────────────────────────────────────────────────────────────────────────

/** Individual interaction record */
export interface Interaction {
  id: string;
  type: InteractionType;
  date: Date;
  subject: string;
  summary: string;
  sentiment?: Sentiment;
  keyTopics?: string[];
  // For email/slack: thread participants
  participants?: string[];
  // Link to source (slack thread, calendar event, etc.)
  sourceUrl?: string;
}

/** Activity event (broader than interactions) */
export interface ActivityEvent {
  id: string;
  type:
    | "interaction"
    | "deal_update"
    | "mention"
    | "milestone"
    | "task"
    | "note_added";
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Company News
// ─────────────────────────────────────────────────────────────────────────────

/** Company news item for activity feed */
export interface CompanyNewsItem {
  id: string;
  headline: string;
  date: Date;
  sourceUrl?: string;
  category?: "press" | "product" | "funding" | "leadership" | "general";
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact Insights (The "Pokedex" Data)
// ─────────────────────────────────────────────────────────────────────────────

/** AI-generated insights about the contact */
export interface ContactInsights {
  /** One-liner personality/relationship summary (the "pokedex" tagline) */
  aiSummary: string;

  /** Key strengths in the relationship */
  strengths?: string[];

  /** Potential risks or concerns */
  risks?: string[];

  /** Recommended talking points for next interaction */
  talkingPoints?: string[];

  /** Conversation topics they're passionate about */
  interests?: string[];

  /** Best time/method to reach them */
  bestReachTime?: string;

  /** Last updated timestamp for AI insights */
  insightsUpdatedAt?: Date;

  /** Recent news/updates about the contact's company */
  companyNews?: CompanyNewsItem[];
}

/** Auto-extracted personal tidbits from meetings/emails */
export interface InterestingFact {
  id: string;
  content: string;
  /** Attribution: e.g., "Meeting - Dec 2025", "Slack - Jan 2026" */
  source: string;
  extractedAt: Date;
  category: "hobby" | "family" | "travel" | "preference" | "career" | "general";
}

/** User-written notes and observations */
export interface ContactNotes {
  /** Main custom note (user-written description) */
  customSummary: string;

  /** Quick facts or reminders */
  quickFacts?: string[];

  /** Personal details (birthday, hobbies, family) */
  personalDetails?: string;

  /** Last updated */
  notesUpdatedAt?: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Contact Type
// ─────────────────────────────────────────────────────────────────────────────

export interface Contact {
  id: string;

  // ─── Identity ────────────────────────────────────────────────────────────
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  pronouns?: string;

  // ─── Professional Info ───────────────────────────────────────────────────
  company: string;
  title: string;
  department?: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  twitter?: string;
  timezone?: string;
  location?: string;

  // ─── Relationship Classification ─────────────────────────────────────────
  relationship: RelationshipType;
  relationshipScore: number; // 0-100, used for visual indicators
  communicationStyle?: CommunicationStyle;

  /** Category for accordion grouping: investor, client, or other */
  category: ContactCategory;

  // ─── Role Badges (structured tags) ───────────────────────────────────────
  /** Primary role badges: "Decision Maker", "Technical Champion", etc. */
  roleBadges: string[];

  /** Custom tags for filtering: "Enterprise", "Q1 Target", etc. */
  tags: string[];

  // ─── The "Pokedex" Layer ─────────────────────────────────────────────────
  /** AI-generated insights */
  insights: ContactInsights;

  /** User-written notes */
  notes: ContactNotes;

  /** Auto-extracted personal tidbits for relationship building */
  interestingFacts: InterestingFact[];

  // ─── Conversation Context ────────────────────────────────────────────────
  /** Recent discussion topics (for quick reference) */
  recentTopics: string[];

  /** All interactions (for timeline view) */
  interactions: Interaction[];

  /** Activity stream (broader events) */
  activities?: ActivityEvent[];

  // ─── Temporal Metadata ───────────────────────────────────────────────────
  lastContacted: Date;
  nextFollowUp?: Date;
  firstContact?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// View State Types
// ─────────────────────────────────────────────────────────────────────────────

/** Sort options for contact lists */
export type ContactSortField =
  | "name"
  | "company"
  | "lastContacted"
  | "relationshipScore";

export type SortDirection = "asc" | "desc";

/** Metadata for a unified CRM tag (role-based, company-based, or custom) */
export interface CrmTagMeta {
  label: string;
  type: "role" | "company" | "custom";
  count: number;
}

/** Card display style for CRM */
export type CrmCardStyle = "polaroid" | "magazine" | "bubble";
