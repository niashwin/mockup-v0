/**
 * Memory Page Types
 *
 * Type definitions for the Memory timeline feature.
 * Events are organized by initiative (swimlane) and displayed on a
 * horizontal timeline with week markers.
 */

export type MemoryEventType =
  | "decision" // Key decisions (violet)
  | "meeting" // Meetings/syncs (blue)
  | "commitment" // Commitments made (amber)
  | "milestone" // Milestones reached (emerald)
  | "email" // Email threads (sky)
  | "alert"; // Alerts/blockers (red)

export type MemoryStatus = "active" | "resolved" | "archived";

// ═══════════════════════════════════════════════════════════════════════════
// Initiative Types (Swimlanes)
// ═══════════════════════════════════════════════════════════════════════════

export type InitiativeStatus = "active" | "blocked" | "completed";

export interface Initiative {
  id: string;
  name: string; // Display name (e.g., "Series A Fundraise")
  description: string; // Brief description for header
  category: string; // "Fundraising", "Product Strategy", etc.
  status: InitiativeStatus;
  stakeholders: MemoryParticipant[];
  owner?: MemoryParticipant;
  startDate: Date;
  targetDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Initiative category colors for sidebar dots
 */
export const initiativeCategoryColors: Record<string, string> = {
  "Product Strategy": "bg-violet-500",
  Fundraising: "bg-emerald-500",
  GTM: "bg-blue-500",
  Hiring: "bg-amber-500",
};

export interface MemoryParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface MemoryActionItem {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate?: Date;
}

export interface MemorySource {
  id: string;
  title: string;
  type: "email" | "document" | "meeting" | "slack" | "calendar";
  url?: string;
}

export interface MemoryEvent {
  id: string;
  title: string;
  summary: string;
  type: MemoryEventType;
  status: MemoryStatus;
  date: Date;
  weekLabel: string; // "Week 6" or "This Week"
  weekNumber: number; // For sorting and grouping
  initiativeId: string; // Reference to parent initiative (swimlane)
  participants: MemoryParticipant[];
  actionItems: MemoryActionItem[];
  sources: MemorySource[];
  category?: string; // "Product Strategy", "Fundraising", etc.
  tags: string[];
  createdAt: Date;
  updatedAt: Date;

  // ─── Connection & Detail Fields ───────────────────────────────────────────
  /** IDs of related events (bidirectional connections across weeks) */
  connectedEventIds?: string[];

  /** Structured detail fields for enhanced slide-up panel */
  impact?: string;
  evidence?: string;
  nextStep?: string;
  channel?: string; // e.g., "#engineering"
}

/**
 * Event type configuration for styling
 */
export interface EventTypeConfig {
  bg: string;
  text: string;
  dot: string;
  darkBg: string;
  darkText: string;
  label: string;
}

export const eventTypeConfig: Record<MemoryEventType, EventTypeConfig> = {
  decision: {
    bg: "bg-violet-500/10",
    text: "text-violet-600",
    dot: "bg-violet-500",
    darkBg: "dark:bg-violet-500/20",
    darkText: "dark:text-violet-400",
    label: "Decision",
  },
  meeting: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    dot: "bg-blue-500",
    darkBg: "dark:bg-blue-500/20",
    darkText: "dark:text-blue-400",
    label: "Meeting",
  },
  commitment: {
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    dot: "bg-amber-500",
    darkBg: "dark:bg-amber-500/20",
    darkText: "dark:text-amber-400",
    label: "Commitment",
  },
  milestone: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
    darkBg: "dark:bg-emerald-500/20",
    darkText: "dark:text-emerald-400",
    label: "Milestone",
  },
  email: {
    bg: "bg-sky-500/10",
    text: "text-sky-600",
    dot: "bg-sky-500",
    darkBg: "dark:bg-sky-500/20",
    darkText: "dark:text-sky-400",
    label: "Email",
  },
  alert: {
    bg: "bg-red-500/10",
    text: "text-red-600",
    dot: "bg-red-500",
    darkBg: "dark:bg-red-500/20",
    darkText: "dark:text-red-400",
    label: "Alert",
  },
};
