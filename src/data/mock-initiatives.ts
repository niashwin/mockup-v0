/**
 * Mock Initiatives (Swimlanes)
 *
 * Initiatives are the top-level organizational units that group related events.
 * Each initiative represents a major business objective or project.
 */

import type { Initiative, MemoryParticipant } from "@types/memory";
import { daysAgo, daysFromNow } from "@lib/mock-date-helpers";

// ═══════════════════════════════════════════════════════════════════════════
// Shared Participants
// ═══════════════════════════════════════════════════════════════════════════

const participants: Record<string, MemoryParticipant> = {
  sarah: { id: "p-1", name: "Sarah Chen" },
  marcus: { id: "p-2", name: "Marcus Williams" },
  emily: { id: "p-3", name: "Emily Park" },
  james: { id: "p-4", name: "James Liu" },
  rachel: { id: "p-5", name: "Rachel Kim" },
  david: { id: "p-6", name: "David Thompson" },
  alex: { id: "p-7", name: "Alex Rivera" },
  nina: { id: "p-8", name: "Nina Patel" },
  jon: { id: "p-9", name: "Jon Martinez" },
  lisa: { id: "p-10", name: "Lisa Wang" },
  maria: { id: "p-11", name: "Maria Garcia" },
  tom: { id: "p-12", name: "Tom Baker" },
};

// ═══════════════════════════════════════════════════════════════════════════
// Mock Initiatives
// ═══════════════════════════════════════════════════════════════════════════

export const mockInitiatives: Initiative[] = [
  // ─── Active Initiatives ──────────────────────────────────────────────────

  {
    id: "init-1",
    name: "Q1 Product Strategy",
    description:
      "Tracking key decisions and alerts for the Q1 roadmap. Scope frozen, marketing plan updated.",
    category: "Product Strategy",
    status: "active",
    stakeholders: [
      participants.sarah,
      participants.marcus,
      participants.emily,
      participants.james,
    ],
    owner: participants.sarah,
    startDate: daysAgo(30),
    targetDate: daysFromNow(60),
    tags: ["q1", "roadmap", "scope"],
    createdAt: daysAgo(30),
    updatedAt: daysAgo(0),
  },

  {
    id: "init-2",
    name: "Series A Fundraise",
    description:
      "Targeting $12-15M at $50-60M pre-money. Term sheet from Benchmark under review.",
    category: "Fundraising",
    status: "active",
    stakeholders: [
      participants.jon,
      participants.maria,
      participants.tom,
      participants.lisa,
    ],
    owner: participants.jon,
    startDate: daysAgo(21),
    targetDate: daysFromNow(45),
    tags: ["series-a", "benchmark", "investors"],
    createdAt: daysAgo(21),
    updatedAt: daysAgo(5),
  },

  {
    id: "init-3",
    name: "Enterprise GTM Launch",
    description:
      "Go-to-market strategy for enterprise segment. $2.4M qualified pipeline, 60% conversion expected.",
    category: "GTM",
    status: "active",
    stakeholders: [participants.alex, participants.nina, participants.rachel],
    owner: participants.alex,
    startDate: daysAgo(14),
    targetDate: daysFromNow(30),
    tags: ["enterprise", "sales", "marketing"],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(2),
  },

  // ─── Blocked Initiatives ─────────────────────────────────────────────────

  {
    id: "init-4",
    name: "Engineering Hiring",
    description:
      "4 open engineering positions on hold pending budget approval from finance.",
    category: "Hiring",
    status: "blocked",
    stakeholders: [participants.james, participants.david],
    owner: participants.james,
    startDate: daysAgo(11),
    targetDate: daysFromNow(45),
    tags: ["hiring", "engineering", "budget"],
    createdAt: daysAgo(11),
    updatedAt: daysAgo(9),
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get initiatives grouped by status
 */
export function getInitiativesByStatus(initiatives: Initiative[]): {
  active: Initiative[];
  blocked: Initiative[];
  completed: Initiative[];
} {
  const active: Initiative[] = [];
  const blocked: Initiative[] = [];
  const completed: Initiative[] = [];

  for (const initiative of initiatives) {
    if (initiative.status === "active") {
      active.push(initiative);
    } else if (initiative.status === "blocked") {
      blocked.push(initiative);
    } else {
      completed.push(initiative);
    }
  }

  return { active, blocked, completed };
}

/**
 * Get event count for an initiative
 */
export function getEventCountForInitiative(
  initiativeId: string,
  events: { initiativeId: string }[],
): number {
  return events.filter((e) => e.initiativeId === initiativeId).length;
}
