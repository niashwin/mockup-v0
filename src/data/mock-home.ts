/**
 * Mock Data for Home Page
 *
 * Includes:
 * - Personal tasks with nested todos
 * - Involvement items for each tab type
 * - Meeting briefs for AI-generated summaries
 */

import {
  Rocket01Icon,
  UserGroupIcon,
  SourceCodeIcon,
  AnalyticsUpIcon,
  Setting07Icon,
  Dollar01Icon,
} from "@hugeicons/core-free-icons";
import type {
  PersonalTask,
  PersonalTaskCategory,
  InvolvementItem,
  MeetingBrief,
  CategoryConfig,
} from "@types/home";
import { daysAgo } from "@lib/mock-date-helpers";

// ═══════════════════════════════════════════════════════════════════════════
// Category Configuration
// ═══════════════════════════════════════════════════════════════════════════

export const categoryConfig: Record<PersonalTaskCategory, CategoryConfig> = {
  gtm: {
    icon: Rocket01Icon,
    label: "GTM",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  product: {
    icon: Setting07Icon,
    label: "Product",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  engineering: {
    icon: SourceCodeIcon,
    label: "Engineering",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  sales: {
    icon: AnalyticsUpIcon,
    label: "Sales",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  operations: {
    icon: UserGroupIcon,
    label: "Operations",
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
  fundraising: {
    icon: Dollar01Icon,
    label: "Fundraising",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// Date Helpers
// ═══════════════════════════════════════════════════════════════════════════

const NOW = new Date();

function hoursAgo(hours: number): Date {
  const date = new Date(NOW);
  date.setHours(date.getHours() - hours);
  return date;
}

// ═══════════════════════════════════════════════════════════════════════════
// Mock Personal Tasks
// ═══════════════════════════════════════════════════════════════════════════

export const mockPersonalTasks: PersonalTask[] = [
  {
    id: "task-1",
    title: "Build out GTM engineering foundation",
    description:
      "Set up the core infrastructure for go-to-market automation including email sequences and outreach tools.",
    category: "gtm",
    todos: [
      { id: "todo-1-1", title: "Set up email inbox warmer", isCompleted: true },
      {
        id: "todo-1-2",
        title: "Build LinkedIn post automation",
        isCompleted: false,
      },
      {
        id: "todo-1-3",
        title: "Create outbound email sequences",
        isCompleted: false,
      },
      { id: "todo-1-4", title: "Integrate with CRM", isCompleted: false },
    ],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(1),
  },
  {
    id: "task-2",
    title: "Solidify FP&A model",
    description:
      "Finalize the financial planning and analysis model for Series A discussions with investors.",
    category: "fundraising",
    todos: [
      {
        id: "todo-2-1",
        title: "Update revenue projections for Q2",
        isCompleted: true,
      },
      { id: "todo-2-2", title: "Build burn rate scenarios", isCompleted: true },
      {
        id: "todo-2-3",
        title: "Create investor-ready deck slides",
        isCompleted: false,
      },
      {
        id: "todo-2-4",
        title: "Review with CFO",
        isCompleted: false,
      },
    ],
    createdAt: daysAgo(21),
    updatedAt: daysAgo(2),
  },
  {
    id: "task-3",
    title: "Conduct user interviews for feedback",
    description:
      "Schedule and run 10 user interviews to gather product feedback for the next sprint prioritization.",
    category: "product",
    todos: [
      {
        id: "todo-3-1",
        title: "Identify 15 target users from pipeline",
        isCompleted: true,
      },
      {
        id: "todo-3-2",
        title: "Send interview invites",
        isCompleted: true,
      },
      {
        id: "todo-3-3",
        title: "Complete 5 interviews",
        isCompleted: true,
      },
      {
        id: "todo-3-4",
        title: "Complete remaining 5 interviews",
        isCompleted: false,
      },
      {
        id: "todo-3-5",
        title: "Synthesize findings into report",
        isCompleted: false,
      },
    ],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(0),
  },
  {
    id: "task-4",
    title: "Ship API v2 documentation",
    description:
      "Complete and publish the API v2 documentation with interactive examples and migration guides.",
    category: "engineering",
    todos: [
      {
        id: "todo-4-1",
        title: "Write endpoint reference docs",
        isCompleted: true,
      },
      {
        id: "todo-4-2",
        title: "Create code examples in 3 languages",
        isCompleted: false,
      },
      {
        id: "todo-4-3",
        title: "Build interactive playground",
        isCompleted: false,
      },
      {
        id: "todo-4-4",
        title: "Write migration guide from v1",
        isCompleted: false,
      },
    ],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(1),
  },
  {
    id: "task-5",
    title: "Close Q1 enterprise deals",
    description:
      "Focus on closing the 3 enterprise deals in late-stage negotiations before quarter end.",
    category: "sales",
    todos: [
      {
        id: "todo-5-1",
        title: "Accenture: Send revised proposal",
        isCompleted: true,
      },
      {
        id: "todo-5-2",
        title: "JPMorgan: Complete security review",
        isCompleted: false,
      },
      {
        id: "todo-5-3",
        title: "Stripe: Schedule exec alignment call",
        isCompleted: false,
      },
    ],
    createdAt: daysAgo(30),
    updatedAt: daysAgo(0),
  },
  {
    id: "task-6",
    title: "Hire 2 senior engineers",
    description:
      "Complete hiring pipeline for 2 senior engineering roles to support product expansion.",
    category: "operations",
    todos: [
      {
        id: "todo-6-1",
        title: "Review 20 candidate profiles",
        isCompleted: true,
      },
      {
        id: "todo-6-2",
        title: "Conduct 6 phone screens",
        isCompleted: true,
      },
      {
        id: "todo-6-3",
        title: "Schedule 4 onsite interviews",
        isCompleted: false,
      },
      { id: "todo-6-4", title: "Make 2 offers", isCompleted: false },
    ],
    createdAt: daysAgo(28),
    updatedAt: daysAgo(3),
  },
  {
    id: "task-7",
    title: "Launch partner referral program",
    description:
      "Design and launch a partner referral program to drive inbound leads through existing customer networks.",
    category: "sales",
    todos: [
      {
        id: "todo-7-1",
        title: "Define referral incentive structure",
        isCompleted: true,
      },
      {
        id: "todo-7-2",
        title: "Build referral tracking dashboard",
        isCompleted: false,
      },
      {
        id: "todo-7-3",
        title: "Draft partner outreach emails",
        isCompleted: false,
      },
    ],
    createdAt: daysAgo(12),
    updatedAt: daysAgo(1),
  },
  {
    id: "task-8",
    title: "Design onboarding flow v2",
    description:
      "Redesign the user onboarding experience based on drop-off data and user interview feedback.",
    category: "product",
    todos: [
      {
        id: "todo-8-1",
        title: "Analyze current funnel drop-off points",
        isCompleted: true,
      },
      {
        id: "todo-8-2",
        title: "Create wireframes for new flow",
        isCompleted: true,
      },
      {
        id: "todo-8-3",
        title: "Build interactive prototype",
        isCompleted: false,
      },
      {
        id: "todo-8-4",
        title: "Run usability tests with 5 users",
        isCompleted: false,
      },
    ],
    createdAt: daysAgo(8),
    updatedAt: daysAgo(0),
  },
  {
    id: "task-9",
    title: "Set up CI/CD pipeline improvements",
    description:
      "Optimize the CI/CD pipeline to reduce build times and improve deployment reliability.",
    category: "engineering",
    todos: [
      {
        id: "todo-9-1",
        title: "Audit current pipeline bottlenecks",
        isCompleted: true,
      },
      {
        id: "todo-9-2",
        title: "Implement parallel test execution",
        isCompleted: false,
      },
      {
        id: "todo-9-3",
        title: "Add canary deployment stage",
        isCompleted: false,
      },
    ],
    createdAt: daysAgo(6),
    updatedAt: daysAgo(1),
  },
  {
    id: "task-10",
    title: "Prepare board deck for Q2",
    description:
      "Compile metrics, milestones, and strategic updates into the quarterly board presentation.",
    category: "fundraising",
    todos: [
      {
        id: "todo-10-1",
        title: "Gather KPI data from all departments",
        isCompleted: true,
      },
      {
        id: "todo-10-2",
        title: "Draft narrative for product roadmap section",
        isCompleted: false,
      },
      {
        id: "todo-10-3",
        title: "Create financial summary slides",
        isCompleted: false,
      },
      {
        id: "todo-10-4",
        title: "Get CEO review and sign-off",
        isCompleted: false,
      },
    ],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(0),
  },
  {
    id: "task-11",
    title: "Build competitive analysis dashboard",
    description:
      "Create a live dashboard tracking competitor feature releases, pricing changes, and market positioning.",
    category: "gtm",
    todos: [
      {
        id: "todo-11-1",
        title: "Identify top 5 competitors to track",
        isCompleted: true,
      },
      {
        id: "todo-11-2",
        title: "Set up data scraping pipeline",
        isCompleted: true,
      },
      {
        id: "todo-11-3",
        title: "Design dashboard layout",
        isCompleted: false,
      },
      {
        id: "todo-11-4",
        title: "Integrate with weekly report feed",
        isCompleted: false,
      },
    ],
    createdAt: daysAgo(15),
    updatedAt: daysAgo(2),
  },
  {
    id: "task-12",
    title: "Migrate to new auth provider",
    description:
      "Migrate user authentication from legacy system to new OAuth2 provider with SSO support.",
    category: "engineering",
    todos: [
      {
        id: "todo-12-1",
        title: "Evaluate Auth0 vs Clerk vs WorkOS",
        isCompleted: true,
      },
      {
        id: "todo-12-2",
        title: "Implement new auth SDK integration",
        isCompleted: false,
      },
      {
        id: "todo-12-3",
        title: "Write migration script for existing users",
        isCompleted: false,
      },
      {
        id: "todo-12-4",
        title: "Test SSO flow with enterprise accounts",
        isCompleted: false,
      },
    ],
    createdAt: daysAgo(18),
    updatedAt: daysAgo(1),
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Mock Involvement Items
// ═══════════════════════════════════════════════════════════════════════════

export const mockInvolvementItems: InvolvementItem[] = [
  // Blocked Swimlanes
  {
    id: "inv-1",
    type: "blocked-swimlane",
    title: "Engineering Hiring",
    subtitle: "Budget approval pending from finance",
    severity: "high",
    linkedInitiativeId: "init-4",
    createdAt: daysAgo(9),
  },
  {
    id: "inv-2",
    type: "blocked-swimlane",
    title: "Mobile App Launch",
    subtitle: "Waiting on App Store review",
    severity: "medium",
    linkedInitiativeId: "init-1",
    createdAt: daysAgo(3),
  },
  {
    id: "inv-3",
    type: "blocked-swimlane",
    title: "Security Compliance",
    subtitle: "External audit scheduling conflict",
    severity: "high",
    linkedInitiativeId: "init-2",
    createdAt: daysAgo(5),
  },

  // At-Risk Alerts
  {
    id: "inv-4",
    type: "at-risk",
    title: "Mobile app launch at risk",
    subtitle: "Timeline slipping due to iOS bugs",
    severity: "critical",
    linkedRadarId: "radar-1",
    createdAt: hoursAgo(6),
  },
  {
    id: "inv-5",
    type: "at-risk",
    title: "Q1 revenue target at risk",
    subtitle: "2 enterprise deals delayed",
    severity: "high",
    linkedRadarId: "radar-2",
    createdAt: daysAgo(2),
  },

  // Action Items
  {
    id: "inv-6",
    type: "action-item",
    title: "Review Series A term sheet",
    subtitle: "Due by end of week",
    severity: "high",
    createdAt: daysAgo(1),
  },
  {
    id: "inv-7",
    type: "action-item",
    title: "Approve marketing budget",
    subtitle: "Q2 campaign planning blocked",
    severity: "medium",
    createdAt: daysAgo(2),
  },
  {
    id: "inv-8",
    type: "action-item",
    title: "Sign vendor contract",
    subtitle: "DataDog agreement ready",
    severity: "low",
    createdAt: daysAgo(4),
  },

  // Recent Updates
  {
    id: "inv-9",
    type: "recent-update",
    title: "A16Z has requested a demo",
    subtitle: "Scheduled for Thursday",
    severity: "high",
    createdAt: hoursAgo(2),
  },
  {
    id: "inv-10",
    type: "recent-update",
    title: "New radar alert: API latency spike",
    subtitle: "P95 latency increased 40%",
    severity: "medium",
    linkedRadarId: "radar-3",
    createdAt: hoursAgo(4),
  },
  {
    id: "inv-11",
    type: "recent-update",
    title: "Enterprise GTM swimlane updated",
    subtitle: "3 new milestones added",
    linkedInitiativeId: "init-3",
    createdAt: hoursAgo(8),
  },
  {
    id: "inv-12",
    type: "recent-update",
    title: "Benchmark sent revised term sheet",
    subtitle: "$14M at $55M pre-money",
    severity: "high",
    createdAt: daysAgo(1),
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Mock Meeting Briefs
// ═══════════════════════════════════════════════════════════════════════════

export const mockMeetingBriefs: Record<string, MeetingBrief> = {
  "meeting-next": {
    meetingId: "meeting-next",
    context:
      "This is a post-mortem for the server downtime that occurred this morning. The incident impacted 12% of users for approximately 75 minutes. Key stakeholders from DevOps, Engineering, and the CTO are attending to review what went wrong and establish preventative measures.",
    keyPoints: [
      { id: "kp-1", text: "Downtime lasted 75 minutes affecting 12% of users" },
      {
        id: "kp-2",
        text: "Root cause was database connection pool exhaustion",
      },
      {
        id: "kp-3",
        text: "Alert system detected issue but escalation was delayed",
      },
    ],
    discussionTopics: [
      { id: "dt-1", text: "Review the incident timeline and response actions" },
      { id: "dt-2", text: "Identify gaps in monitoring and alerting" },
      { id: "dt-3", text: "Discuss proposed infrastructure changes" },
      { id: "dt-4", text: "Assign owners for follow-up action items" },
    ],
    prepItems: [
      { id: "pp-1", text: "Review the incident report shared in Slack" },
      {
        id: "pp-2",
        text: "Come prepared with any observations from your team",
      },
    ],
  },
  "meeting-later-1": {
    meetingId: "meeting-later-1",
    context:
      "Design review for the redesigned settings page. The design team has prepared 4 new screens covering account settings, notifications, security, and integrations. Product and engineering leads will provide feedback on usability and implementation feasibility.",
    keyPoints: [
      {
        id: "kp-1",
        text: "4 screens to review: Account, Notifications, Security, Integrations",
      },
      { id: "kp-2", text: "Focus on accessibility and mobile responsiveness" },
      { id: "kp-3", text: "Implementation timeline: 2 sprints estimated" },
    ],
    discussionTopics: [
      { id: "dt-1", text: "Is the navigation intuitive?" },
      { id: "dt-2", text: "Are the forms accessible?" },
      { id: "dt-3", text: "Mobile responsiveness concerns" },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get involvement items filtered by type
 */
export function getInvolvementItemsByType(
  items: InvolvementItem[],
  type: InvolvementItem["type"],
): InvolvementItem[] {
  return items.filter((item) => item.type === type);
}

/**
 * Get count of items by type
 */
export function getInvolvementCounts(
  items: InvolvementItem[],
): Record<string, number> {
  return {
    blocked: items.filter((i) => i.type === "blocked-swimlane").length,
    "at-risk": items.filter((i) => i.type === "at-risk").length,
    actions: items.filter((i) => i.type === "action-item").length,
    updates: items.filter((i) => i.type === "recent-update").length,
  };
}
