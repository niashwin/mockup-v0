/**
 * Home Page Types
 *
 * TypeScript interfaces for the Home dashboard page including:
 * - Personal tasks (high-level work streams with nested todos)
 * - Involvement items (blocked swimlanes, alerts, action items)
 * - Meeting brief content
 */

import type { IconSvgElement } from "@hugeicons/react";

// ═══════════════════════════════════════════════════════════════════════════
// Personal Task Types
// ═══════════════════════════════════════════════════════════════════════════

export type PersonalTaskCategory =
  | "gtm"
  | "product"
  | "engineering"
  | "sales"
  | "operations"
  | "fundraising";

export interface PersonalTodo {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface PersonalTask {
  id: string;
  title: string;
  description: string;
  category: PersonalTaskCategory;
  todos: PersonalTodo[];
  createdAt: Date;
  updatedAt: Date;
}

// Category configuration for icons and colors
export interface CategoryConfig {
  icon: IconSvgElement;
  label: string;
  color: string;
  bgColor: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Involvement Types
// ═══════════════════════════════════════════════════════════════════════════

export type InvolvementItemType =
  | "blocked-swimlane"
  | "at-risk"
  | "action-item"
  | "recent-update";

export type InvolvementSeverity = "critical" | "high" | "medium" | "low";

export interface InvolvementItem {
  id: string;
  type: InvolvementItemType;
  title: string;
  subtitle?: string;
  severity?: InvolvementSeverity;
  linkedInitiativeId?: string; // For blocked swimlanes
  linkedRadarId?: string; // For at-risk alerts
  createdAt: Date;
}

// ═══════════════════════════════════════════════════════════════════════════
// Meeting Brief Types
// ═══════════════════════════════════════════════════════════════════════════

export interface MeetingBriefPoint {
  id: string;
  text: string;
}

export interface MeetingBrief {
  meetingId: string;
  context: string;
  keyPoints: MeetingBriefPoint[];
  discussionTopics: MeetingBriefPoint[];
  prepItems?: MeetingBriefPoint[];
}
