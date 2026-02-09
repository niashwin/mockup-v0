/**
 * Mock Memory Events
 *
 * Business/strategy focused events spanning 16 weeks (8 past + 8 future).
 * Categories: Product Strategy, Fundraising, GTM, Hiring
 *
 * Events have bidirectional connections defined via connectedEventIds.
 */

import type { MemoryEvent } from "@types/memory";
import { daysAgo, daysFromNow } from "@lib/mock-date-helpers";
import { getWeekLabel, getWeekNumber } from "./memory-helpers";

export const mockMemoryEvents: MemoryEvent[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // THIS WEEK - 4 events
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-1",
    title: "Scope Freeze Approved",
    summary:
      "Final scope approved for Q1 launch. All feature requests after this date will be deferred to Q2 planning cycle. Change control process now in effect.",
    type: "decision",
    status: "active",
    date: daysAgo(0),
    weekLabel: getWeekLabel(daysAgo(0)),
    weekNumber: getWeekNumber(daysAgo(0)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-2", name: "Marcus Williams" },
      { id: "p-3", name: "Emily Park" },
    ],
    actionItems: [
      { id: "ai-1", title: "Update roadmap document", isCompleted: true },
      { id: "ai-2", title: "Notify engineering team", isCompleted: false },
      {
        id: "ai-3",
        title: "Schedule Q2 planning kickoff",
        isCompleted: false,
        dueDate: daysFromNow(7),
      },
    ],
    sources: [
      { id: "s-1", title: "Scope Review Meeting", type: "meeting" },
      { id: "s-2", title: "Feature Priority Doc", type: "document" },
    ],
    category: "Product Strategy",
    tags: ["scope", "planning", "q1"],
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
    // Connection & Detail Fields
    connectedEventIds: ["mem-5", "mem-14", "mem-20"], // Connected to Roadmap Finalized, Vision Workshop, Q1 Launch
    impact: "Critical milestone enabling team to focus on execution",
    evidence: "Roadmap document frozen, change control process activated",
    nextStep: "Communicate scope freeze to all stakeholders via Slack",
    channel: "#product-strategy",
  },
  {
    id: "mem-2",
    title: "Weekly Sync: Blockers",
    summary:
      "Reviewed current blockers and mitigation plans. Marketing dependency resolved. Two risks mitigated with contingency plans in place.",
    type: "meeting",
    status: "active",
    date: daysAgo(1),
    weekLabel: getWeekLabel(daysAgo(1)),
    weekNumber: getWeekNumber(daysAgo(1)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-4", name: "James Liu" },
      { id: "p-5", name: "Rachel Kim" },
      { id: "p-6", name: "David Thompson" },
    ],
    actionItems: [
      { id: "ai-4", title: "Follow up with design team", isCompleted: true },
      { id: "ai-5", title: "Update risk register", isCompleted: false },
    ],
    sources: [
      { id: "s-3", title: "Meeting Notes", type: "document" },
      { id: "s-4", title: "Calendar Event", type: "calendar" },
    ],
    category: "Product Strategy",
    tags: ["blockers", "weekly-sync"],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    connectedEventIds: ["mem-10", "mem-19"], // Connected to Hiring Blocked, Launch Prep
  },
  {
    id: "mem-3",
    title: "Finalize Go-To-Market Brief",
    summary:
      "Marketing team needs final GTM brief by Friday. Includes positioning, messaging framework, and launch timeline for Q1 product release.",
    type: "commitment",
    status: "active",
    date: daysAgo(2),
    weekLabel: getWeekLabel(daysAgo(2)),
    weekNumber: getWeekNumber(daysAgo(2)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-7", name: "Alex Rivera" },
      { id: "p-8", name: "Nina Patel" },
    ],
    actionItems: [
      {
        id: "ai-6",
        title: "Complete competitive analysis section",
        isCompleted: false,
      },
      { id: "ai-7", title: "Review with CEO", isCompleted: false },
    ],
    sources: [
      { id: "s-5", title: "GTM Template", type: "document" },
      { id: "s-6", title: "Strategy Thread", type: "email" },
    ],
    category: "GTM",
    tags: ["marketing", "launch", "gtm"],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    // Connection & Detail Fields
    connectedEventIds: ["mem-9", "mem-15", "mem-19", "mem-21"], // Pipeline Review, Security Audit, Launch Prep, Enterprise Kickoff
    impact:
      "Cross-team alignment updated and communicated in weekly staff sync",
    evidence:
      "Notes captured from the last two reviews and shared in the program channel",
    nextStep: "Confirm follow-up owners and update the timeline summary",
    channel: "#marketing",
  },
  {
    id: "mem-4",
    title: "Partner Meeting with A16Z",
    summary:
      "Initial partnership discussion with A16Z portfolio team. Exploring integration opportunities and potential co-marketing initiatives.",
    type: "meeting",
    status: "active",
    date: daysAgo(1),
    weekLabel: getWeekLabel(daysAgo(1)),
    weekNumber: getWeekNumber(daysAgo(1)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-10", name: "Lisa Wang" },
    ],
    actionItems: [
      { id: "ai-8", title: "Send follow-up deck", isCompleted: false },
      { id: "ai-9", title: "Schedule technical deep-dive", isCompleted: false },
    ],
    sources: [
      { id: "s-7", title: "Meeting Recording", type: "meeting" },
      { id: "s-8", title: "Partnership Deck", type: "document" },
    ],
    category: "Fundraising",
    tags: ["partnerships", "a16z", "investors"],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(0),
    connectedEventIds: ["mem-6", "mem-11", "mem-18"], // Term Sheet, Series A Kickoff, Board Meeting
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LAST WEEK - 3 events
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-5",
    title: "Q1 Roadmap Finalized",
    summary:
      "Engineering and product aligned on Q1 deliverables. Three major features confirmed: search overhaul, API v2, and analytics dashboard.",
    type: "milestone",
    status: "resolved",
    date: daysAgo(5),
    weekLabel: getWeekLabel(daysAgo(5)),
    weekNumber: getWeekNumber(daysAgo(5)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-2", name: "Marcus Williams" },
      { id: "p-4", name: "James Liu" },
    ],
    actionItems: [
      { id: "ai-10", title: "Publish roadmap to wiki", isCompleted: true },
      { id: "ai-11", title: "Brief customer success team", isCompleted: true },
    ],
    sources: [
      { id: "s-9", title: "Roadmap Document", type: "document" },
      { id: "s-10", title: "Planning Session", type: "meeting" },
    ],
    category: "Product Strategy",
    tags: ["roadmap", "q1", "planning"],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(4),
    // Connection & Detail Fields
    connectedEventIds: ["mem-1", "mem-14", "mem-17", "mem-20"], // Scope Freeze, Vision Workshop, Q4 Planning, Q1 Launch
    impact: "Alignment achieved across engineering and product teams",
    evidence: "Roadmap document published to wiki with 3 confirmed features",
    nextStep: "Begin sprint planning for first Q1 deliverable",
    channel: "#product-strategy",
  },
  {
    id: "mem-6",
    title: "Term Sheet Review",
    summary:
      "Reviewed term sheet from Benchmark. Key terms include $15M at $60M pre-money, 1x non-participating preferred, one board seat.",
    type: "meeting",
    status: "active",
    date: daysAgo(7),
    weekLabel: getWeekLabel(daysAgo(7)),
    weekNumber: getWeekNumber(daysAgo(7)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-11", name: "Maria Garcia" },
      { id: "p-12", name: "Tom Baker" },
    ],
    actionItems: [
      {
        id: "ai-12",
        title: "Review liquidation preferences with legal",
        isCompleted: false,
      },
      {
        id: "ai-13",
        title: "Discuss board seat structure with co-founders",
        isCompleted: true,
      },
    ],
    sources: [
      { id: "s-11", title: "Term Sheet PDF", type: "document" },
      { id: "s-12", title: "Email from Jon", type: "email" },
    ],
    category: "Fundraising",
    tags: ["term-sheet", "benchmark", "series-a"],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(5),
    connectedEventIds: ["mem-4", "mem-11", "mem-13", "mem-18", "mem-22"], // A16Z Meeting, Series A Kickoff, Counter-proposal, Board Meeting, Series A Close
  },
  {
    id: "mem-7",
    title: "Investor Update Sent",
    summary:
      "Monthly investor update shared. Highlights: 40% MoM growth, 3 new enterprise customers, expanded team by 4 engineers.",
    type: "email",
    status: "resolved",
    date: daysAgo(6),
    weekLabel: getWeekLabel(daysAgo(6)),
    weekNumber: getWeekNumber(daysAgo(6)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-13", name: "Investors" },
    ],
    actionItems: [],
    sources: [
      { id: "s-13", title: "Update Email", type: "email" },
      { id: "s-14", title: "Metrics Dashboard", type: "document" },
    ],
    category: "Fundraising",
    tags: ["investors", "update", "monthly"],
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
    connectedEventIds: ["mem-8", "mem-16"], // Board Deck, Investor Outreach
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2 WEEKS AGO - 3 events
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-8",
    title: "Board Deck Draft Complete",
    summary:
      "First draft of Q4 board deck ready for review. Covers financial performance, product milestones, hiring progress, and 2026 strategy.",
    type: "milestone",
    status: "resolved",
    date: daysAgo(10),
    weekLabel: getWeekLabel(daysAgo(10)),
    weekNumber: getWeekNumber(daysAgo(10)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-14", name: "CFO" },
    ],
    actionItems: [
      { id: "ai-14", title: "Incorporate CEO feedback", isCompleted: true },
      { id: "ai-15", title: "Finalize financials", isCompleted: true },
    ],
    sources: [
      { id: "s-15", title: "Board Deck", type: "document" },
      { id: "s-16", title: "Review Thread", type: "slack" },
    ],
    category: "Fundraising",
    tags: ["board", "deck", "q4"],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(8),
    connectedEventIds: ["mem-7", "mem-11", "mem-18"], // Investor Update, Series A Kickoff, Board Meeting
  },
  {
    id: "mem-9",
    title: "Pipeline Review",
    summary:
      "Sales pipeline review with leadership. $2.4M in qualified opportunities, 60% conversion expected. Focus on enterprise expansion.",
    type: "meeting",
    status: "resolved",
    date: daysAgo(12),
    weekLabel: getWeekLabel(daysAgo(12)),
    weekNumber: getWeekNumber(daysAgo(12)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-15", name: "Sales Team" },
      { id: "p-9", name: "Jon Martinez" },
    ],
    actionItems: [
      { id: "ai-16", title: "Update CRM with new leads", isCompleted: true },
      {
        id: "ai-17",
        title: "Schedule enterprise demos",
        isCompleted: true,
      },
    ],
    sources: [
      { id: "s-17", title: "Pipeline Report", type: "document" },
      { id: "s-18", title: "Sales Meeting", type: "meeting" },
    ],
    category: "GTM",
    tags: ["sales", "pipeline", "enterprise"],
    createdAt: daysAgo(12),
    updatedAt: daysAgo(10),
    connectedEventIds: ["mem-3", "mem-15", "mem-21"], // GTM Brief, Security Audit, Enterprise Kickoff
  },
  {
    id: "mem-10",
    title: "Hiring Plan Blocked",
    summary:
      "Engineering hiring on hold pending budget approval. 4 open positions affected. Escalated to leadership for resolution.",
    type: "alert",
    status: "active",
    date: daysAgo(11),
    weekLabel: getWeekLabel(daysAgo(11)),
    weekNumber: getWeekNumber(daysAgo(11)),
    initiativeId: "init-4", // Engineering Hiring
    participants: [
      { id: "p-16", name: "HR Lead" },
      { id: "p-4", name: "James Liu" },
    ],
    actionItems: [
      {
        id: "ai-18",
        title: "Get budget approval from finance",
        isCompleted: false,
      },
      {
        id: "ai-19",
        title: "Prioritize roles for immediate hire",
        isCompleted: true,
      },
    ],
    sources: [
      { id: "s-19", title: "Budget Email", type: "email" },
      { id: "s-20", title: "Hiring Plan", type: "document" },
    ],
    category: "Hiring",
    tags: ["hiring", "blocked", "engineering"],
    createdAt: daysAgo(11),
    updatedAt: daysAgo(9),
    connectedEventIds: ["mem-2", "mem-23"], // Weekly Sync, Team Expansion
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3 WEEKS AGO - 3 events
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-11",
    title: "Series A Kickoff",
    summary:
      "Officially launched Series A fundraising process. Targeting $12-15M at $50-60M pre. Initial outreach to 20 funds complete.",
    type: "milestone",
    status: "active",
    date: daysAgo(17),
    weekLabel: getWeekLabel(daysAgo(17)),
    weekNumber: getWeekNumber(daysAgo(17)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-11", name: "Maria Garcia" },
    ],
    actionItems: [
      { id: "ai-20", title: "Complete investor data room", isCompleted: true },
      { id: "ai-21", title: "Schedule partner meetings", isCompleted: true },
    ],
    sources: [
      { id: "s-21", title: "Fundraising Plan", type: "document" },
      { id: "s-22", title: "Investor List", type: "document" },
    ],
    category: "Fundraising",
    tags: ["series-a", "fundraising", "kickoff"],
    createdAt: daysAgo(17),
    updatedAt: daysAgo(15),
    // Connection & Detail Fields
    connectedEventIds: [
      "mem-4",
      "mem-6",
      "mem-8",
      "mem-16",
      "mem-18",
      "mem-22",
    ], // A16Z, Term Sheet, Board Deck, Investor Outreach, Board Meeting, Series A Close
    impact: "Fundraising process officially launched with 20 funds contacted",
    evidence: "Data room complete, partner meetings scheduled with 8 firms",
    nextStep: "Track responses and schedule follow-up calls",
    channel: "#fundraising",
  },
  {
    id: "mem-12",
    title: "Legal Review Meeting",
    summary:
      "Reviewed IP assignments and employee agreements with counsel. Minor updates needed to contractor agreements.",
    type: "meeting",
    status: "resolved",
    date: daysAgo(18),
    weekLabel: getWeekLabel(daysAgo(18)),
    weekNumber: getWeekNumber(daysAgo(18)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-17", name: "Legal Counsel" },
      { id: "p-9", name: "Jon Martinez" },
    ],
    actionItems: [
      { id: "ai-22", title: "Update contractor templates", isCompleted: true },
      { id: "ai-23", title: "Complete IP assignment audit", isCompleted: true },
    ],
    sources: [
      { id: "s-23", title: "Legal Checklist", type: "document" },
      { id: "s-24", title: "Meeting Notes", type: "meeting" },
    ],
    category: "Fundraising",
    tags: ["legal", "ip", "compliance"],
    createdAt: daysAgo(18),
    updatedAt: daysAgo(16),
    connectedEventIds: ["mem-22"], // Series A Close
  },
  {
    id: "mem-13",
    title: "Counter-proposal Deadline",
    summary:
      "Benchmark counter-proposal needs to be sent by Dec 28. Jon mentioned competing offers from other funds.",
    type: "commitment",
    status: "active",
    date: daysAgo(19),
    weekLabel: getWeekLabel(daysAgo(19)),
    weekNumber: getWeekNumber(daysAgo(19)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-11", name: "Maria Garcia" },
    ],
    actionItems: [
      {
        id: "ai-24",
        title: "Draft counter-proposal terms",
        isCompleted: false,
      },
      { id: "ai-25", title: "Review with board advisor", isCompleted: false },
    ],
    sources: [
      { id: "s-25", title: "Original Term Sheet", type: "document" },
      { id: "s-26", title: "Email Thread", type: "email" },
    ],
    category: "Fundraising",
    tags: ["term-sheet", "deadline", "benchmark"],
    createdAt: daysAgo(19),
    updatedAt: daysAgo(17),
    connectedEventIds: ["mem-6", "mem-18"], // Term Sheet Review, Board Meeting
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4 WEEKS AGO - 3 events
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-14",
    title: "Product Vision Workshop",
    summary:
      "Full-day offsite to align on 2026 product vision. Defined three strategic pillars: AI-first, enterprise-ready, developer-friendly.",
    type: "meeting",
    status: "resolved",
    date: daysAgo(28),
    weekLabel: getWeekLabel(daysAgo(28)),
    weekNumber: getWeekNumber(daysAgo(28)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-2", name: "Marcus Williams" },
      { id: "p-9", name: "Jon Martinez" },
    ],
    actionItems: [
      { id: "ai-26", title: "Document vision pillars", isCompleted: true },
      { id: "ai-27", title: "Share with all-hands", isCompleted: true },
    ],
    sources: [
      { id: "s-27", title: "Vision Workshop Notes", type: "document" },
      { id: "s-28", title: "Miro Board", type: "document" },
    ],
    category: "Product Strategy",
    tags: ["vision", "strategy", "offsite"],
    createdAt: daysAgo(28),
    updatedAt: daysAgo(25),
    connectedEventIds: ["mem-1", "mem-5", "mem-17", "mem-20", "mem-24"], // Scope Freeze, Roadmap Finalized, Q4 Planning, Q1 Launch, API Redesign
    impact: "Strategic alignment achieved on three product pillars for 2026",
    evidence: "Workshop notes and Miro board shared with all-hands",
    nextStep: "Cascade vision pillars into Q1 OKRs",
    channel: "#product-strategy",
  },
  {
    id: "mem-24",
    title: "API v2 Redesign Kick-off",
    summary:
      "Started technical planning for API v2. New GraphQL layer, improved rate limiting, and developer SDK improvements.",
    type: "meeting",
    status: "resolved",
    date: daysAgo(26),
    weekLabel: getWeekLabel(daysAgo(26)),
    weekNumber: getWeekNumber(daysAgo(26)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-4", name: "James Liu" },
      { id: "p-2", name: "Marcus Williams" },
    ],
    actionItems: [
      { id: "ai-46", title: "Draft API spec document", isCompleted: true },
      { id: "ai-47", title: "Review with frontend team", isCompleted: true },
    ],
    sources: [
      { id: "s-47", title: "API Spec Doc", type: "document" },
      { id: "s-48", title: "Technical Design", type: "document" },
    ],
    category: "Product Strategy",
    tags: ["api", "technical", "v2"],
    createdAt: daysAgo(26),
    updatedAt: daysAgo(24),
    connectedEventIds: ["mem-14", "mem-5", "mem-20"], // Vision Workshop, Roadmap, Q1 Launch
  },
  {
    id: "mem-25",
    title: "Competitive Analysis Complete",
    summary:
      "Finished deep-dive on top 5 competitors. Key insights: pricing gap opportunity, feature parity in core areas, UX differentiation possible.",
    type: "milestone",
    status: "resolved",
    date: daysAgo(27),
    weekLabel: getWeekLabel(daysAgo(27)),
    weekNumber: getWeekNumber(daysAgo(27)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-7", name: "Alex Rivera" },
      { id: "p-8", name: "Nina Patel" },
    ],
    actionItems: [
      { id: "ai-48", title: "Share findings with product", isCompleted: true },
    ],
    sources: [{ id: "s-49", title: "Competitive Matrix", type: "document" }],
    category: "GTM",
    tags: ["competitive", "analysis", "market"],
    createdAt: daysAgo(27),
    updatedAt: daysAgo(25),
    connectedEventIds: ["mem-3", "mem-9"], // GTM Brief, Pipeline Review
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5 WEEKS AGO - 4 events
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-15",
    title: "Enterprise Security Audit",
    summary:
      "Passed SOC2 Type I audit with zero critical findings. Two minor recommendations to address in Q1.",
    type: "milestone",
    status: "resolved",
    date: daysAgo(32),
    weekLabel: getWeekLabel(daysAgo(32)),
    weekNumber: getWeekNumber(daysAgo(32)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-18", name: "Security Team" },
      { id: "p-4", name: "James Liu" },
    ],
    actionItems: [
      { id: "ai-28", title: "Address minor findings", isCompleted: false },
      { id: "ai-29", title: "Update compliance docs", isCompleted: true },
    ],
    sources: [
      { id: "s-29", title: "Audit Report", type: "document" },
      { id: "s-30", title: "Compliance Dashboard", type: "document" },
    ],
    category: "GTM",
    tags: ["security", "soc2", "compliance"],
    createdAt: daysAgo(32),
    updatedAt: daysAgo(30),
    connectedEventIds: ["mem-3", "mem-9", "mem-21", "mem-26"], // GTM Brief, Pipeline Review, Enterprise Kickoff, Infrastructure Review
  },
  {
    id: "mem-26",
    title: "Infrastructure Review",
    summary:
      "Reviewed cloud infrastructure for scale. Identified need for multi-region deployment before enterprise launch.",
    type: "meeting",
    status: "resolved",
    date: daysAgo(34),
    weekLabel: getWeekLabel(daysAgo(34)),
    weekNumber: getWeekNumber(daysAgo(34)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-4", name: "James Liu" },
      { id: "p-18", name: "DevOps Lead" },
    ],
    actionItems: [
      { id: "ai-49", title: "Plan multi-region deployment", isCompleted: true },
    ],
    sources: [{ id: "s-50", title: "Infrastructure Audit", type: "document" }],
    category: "Product Strategy",
    tags: ["infrastructure", "scale", "devops"],
    createdAt: daysAgo(34),
    updatedAt: daysAgo(32),
    connectedEventIds: ["mem-15", "mem-17"], // Security Audit, Q4 Planning
  },
  {
    id: "mem-32",
    title: "Data Room Preparation",
    summary:
      "Compiled financials, cap table, customer contracts, and key metrics for investor due diligence. Organized by category for easy navigation.",
    type: "commitment",
    status: "resolved",
    date: daysAgo(33),
    weekLabel: getWeekLabel(daysAgo(33)),
    weekNumber: getWeekNumber(daysAgo(33)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-11", name: "Maria Garcia" },
      { id: "p-9", name: "Jon Martinez" },
    ],
    actionItems: [
      { id: "ai-55", title: "Upload Q3 financials", isCompleted: true },
      { id: "ai-56", title: "Verify cap table accuracy", isCompleted: true },
    ],
    sources: [{ id: "s-56", title: "Data Room Index", type: "document" }],
    category: "Fundraising",
    tags: ["data-room", "due-diligence", "preparation"],
    createdAt: daysAgo(33),
    updatedAt: daysAgo(31),
    connectedEventIds: ["mem-11", "mem-16", "mem-22"],
  },
  {
    id: "mem-33",
    title: "Candidate Pipeline Review",
    summary:
      "Reviewed 23 engineering candidates. Shortlisted 8 for final rounds. Strong interest from ex-FAANG engineers.",
    type: "meeting",
    status: "resolved",
    date: daysAgo(35),
    weekLabel: getWeekLabel(daysAgo(35)),
    weekNumber: getWeekNumber(daysAgo(35)),
    initiativeId: "init-4", // Engineering Hiring
    participants: [
      { id: "p-4", name: "James Liu" },
      { id: "p-16", name: "HR Lead" },
    ],
    actionItems: [
      { id: "ai-57", title: "Schedule final interviews", isCompleted: true },
    ],
    sources: [{ id: "s-57", title: "Candidate Tracker", type: "document" }],
    category: "Hiring",
    tags: ["hiring", "engineering", "candidates"],
    createdAt: daysAgo(35),
    updatedAt: daysAgo(33),
    connectedEventIds: ["mem-10", "mem-23"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6 WEEKS AGO - 3 events
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-16",
    title: "Initial Investor Outreach",
    summary:
      "Started reaching out to seed investors about Series A timing. Positive signals from 3 tier-1 firms.",
    type: "email",
    status: "resolved",
    date: daysAgo(42),
    weekLabel: getWeekLabel(daysAgo(42)),
    weekNumber: getWeekNumber(daysAgo(42)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-19", name: "Board Advisor" },
    ],
    actionItems: [
      { id: "ai-30", title: "Schedule intro calls", isCompleted: true },
      { id: "ai-31", title: "Prepare pitch deck v1", isCompleted: true },
    ],
    sources: [
      { id: "s-31", title: "Outreach Emails", type: "email" },
      { id: "s-32", title: "Investor Tracker", type: "document" },
    ],
    category: "Fundraising",
    tags: ["outreach", "investors", "series-a"],
    createdAt: daysAgo(42),
    updatedAt: daysAgo(40),
    connectedEventIds: ["mem-7", "mem-11", "mem-22"], // Investor Update, Series A Kickoff, Series A Close
  },
  {
    id: "mem-34",
    title: "Market Research Findings",
    summary:
      "Completed TAM/SAM/SOM analysis for enterprise market. Identified $4.2B addressable market with 18% CAGR.",
    type: "milestone",
    status: "resolved",
    date: daysAgo(40),
    weekLabel: getWeekLabel(daysAgo(40)),
    weekNumber: getWeekNumber(daysAgo(40)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-7", name: "Alex Rivera" },
      { id: "p-8", name: "Nina Patel" },
    ],
    actionItems: [
      { id: "ai-58", title: "Present to leadership", isCompleted: true },
    ],
    sources: [
      { id: "s-58", title: "Market Analysis Report", type: "document" },
    ],
    category: "GTM",
    tags: ["market-research", "tam", "analysis"],
    createdAt: daysAgo(40),
    updatedAt: daysAgo(38),
    connectedEventIds: ["mem-25", "mem-9"],
  },
  {
    id: "mem-35",
    title: "Brand Guidelines Finalized",
    summary:
      "Locked brand identity for Q1 launch. New color palette, typography system, and voice guidelines approved.",
    type: "decision",
    status: "resolved",
    date: daysAgo(41),
    weekLabel: getWeekLabel(daysAgo(41)),
    weekNumber: getWeekNumber(daysAgo(41)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-22", name: "Design Lead" },
    ],
    actionItems: [
      { id: "ai-59", title: "Distribute to all teams", isCompleted: true },
    ],
    sources: [{ id: "s-59", title: "Brand Guidelines PDF", type: "document" }],
    category: "Product Strategy",
    tags: ["brand", "design", "guidelines"],
    createdAt: daysAgo(41),
    updatedAt: daysAgo(39),
    connectedEventIds: ["mem-14", "mem-20"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7 WEEKS AGO - 2 events
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-17",
    title: "Q4 Planning Kickoff",
    summary:
      "Kicked off Q4 planning process. Defined OKRs for product, engineering, and GTM teams.",
    type: "meeting",
    status: "resolved",
    date: daysAgo(50),
    weekLabel: getWeekLabel(daysAgo(50)),
    weekNumber: getWeekNumber(daysAgo(50)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-2", name: "Marcus Williams" },
      { id: "p-7", name: "Alex Rivera" },
    ],
    actionItems: [
      { id: "ai-32", title: "Finalize Q4 OKRs", isCompleted: true },
      { id: "ai-33", title: "Resource allocation review", isCompleted: true },
    ],
    sources: [
      { id: "s-33", title: "Planning Doc", type: "document" },
      { id: "s-34", title: "OKR Template", type: "document" },
    ],
    category: "Product Strategy",
    tags: ["planning", "okrs", "q4"],
    createdAt: daysAgo(50),
    updatedAt: daysAgo(48),
    connectedEventIds: ["mem-5", "mem-14"], // Roadmap Finalized, Vision Workshop
  },
  {
    id: "mem-36",
    title: "Pitch Deck Review with Advisors",
    summary:
      "External advisors reviewed pitch deck. Feedback: strengthen unit economics slide, add customer testimonials.",
    type: "meeting",
    status: "resolved",
    date: daysAgo(48),
    weekLabel: getWeekLabel(daysAgo(48)),
    weekNumber: getWeekNumber(daysAgo(48)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-19", name: "Board Advisor" },
    ],
    actionItems: [
      { id: "ai-60", title: "Revise unit economics slide", isCompleted: true },
      { id: "ai-61", title: "Collect customer quotes", isCompleted: true },
    ],
    sources: [
      { id: "s-60", title: "Advisor Feedback Notes", type: "document" },
    ],
    category: "Fundraising",
    tags: ["pitch-deck", "advisors", "feedback"],
    createdAt: daysAgo(48),
    updatedAt: daysAgo(46),
    connectedEventIds: ["mem-16", "mem-11"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8 WEEKS AGO - 3 events
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-37",
    title: "Annual Strategy Retreat",
    summary:
      "Leadership offsite to set 2026 company direction. Key themes: enterprise expansion, AI integration, international growth.",
    type: "meeting",
    status: "resolved",
    date: daysAgo(56),
    weekLabel: getWeekLabel(daysAgo(56)),
    weekNumber: getWeekNumber(daysAgo(56)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-2", name: "Marcus Williams" },
      { id: "p-7", name: "Alex Rivera" },
    ],
    actionItems: [
      { id: "ai-62", title: "Document strategy decisions", isCompleted: true },
      { id: "ai-63", title: "Create initiative roadmaps", isCompleted: true },
    ],
    sources: [{ id: "s-61", title: "Retreat Summary", type: "document" }],
    category: "Product Strategy",
    tags: ["strategy", "retreat", "2026"],
    createdAt: daysAgo(56),
    updatedAt: daysAgo(54),
    connectedEventIds: ["mem-17", "mem-14"],
  },
  {
    id: "mem-38",
    title: "Seed Extension Closed",
    summary:
      "Closed $2M seed extension at existing valuation. Bridge funding secured for Series A timeline.",
    type: "milestone",
    status: "resolved",
    date: daysAgo(54),
    weekLabel: getWeekLabel(daysAgo(54)),
    weekNumber: getWeekNumber(daysAgo(54)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-11", name: "Maria Garcia" },
    ],
    actionItems: [
      { id: "ai-64", title: "Wire transfer confirmation", isCompleted: true },
    ],
    sources: [{ id: "s-62", title: "Closing Documents", type: "document" }],
    category: "Fundraising",
    tags: ["seed-extension", "funding", "closed"],
    createdAt: daysAgo(54),
    updatedAt: daysAgo(52),
    connectedEventIds: ["mem-16", "mem-11"],
  },
  {
    id: "mem-39",
    title: "Enterprise Pilot Program Launch",
    summary:
      "Launched pilot program with 5 enterprise prospects. 90-day trials with dedicated support and success metrics.",
    type: "milestone",
    status: "resolved",
    date: daysAgo(55),
    weekLabel: getWeekLabel(daysAgo(55)),
    weekNumber: getWeekNumber(daysAgo(55)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-7", name: "Alex Rivera" },
      { id: "p-15", name: "Sales Team" },
    ],
    actionItems: [
      { id: "ai-65", title: "Onboard pilot customers", isCompleted: true },
    ],
    sources: [{ id: "s-63", title: "Pilot Program Brief", type: "document" }],
    category: "GTM",
    tags: ["enterprise", "pilot", "launch"],
    createdAt: daysAgo(55),
    updatedAt: daysAgo(53),
    connectedEventIds: ["mem-9", "mem-21"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEXT WEEK - 4 events (FUTURE)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-18",
    title: "Board Meeting",
    summary:
      "Q4 board meeting scheduled. Will present financials, product update, and Series A progress.",
    type: "meeting",
    status: "active",
    date: daysFromNow(5),
    weekLabel: getWeekLabel(daysFromNow(5)),
    weekNumber: getWeekNumber(daysFromNow(5)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-20", name: "Board Members" },
    ],
    actionItems: [
      { id: "ai-34", title: "Finalize board deck", isCompleted: false },
      { id: "ai-35", title: "Prep Q&A responses", isCompleted: false },
    ],
    sources: [
      { id: "s-35", title: "Board Deck Draft", type: "document" },
      { id: "s-36", title: "Calendar Invite", type: "calendar" },
    ],
    category: "Fundraising",
    tags: ["board", "meeting", "q4"],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    connectedEventIds: [
      "mem-4",
      "mem-6",
      "mem-8",
      "mem-11",
      "mem-13",
      "mem-22",
    ],
    impact: "Board alignment on Series A strategy and Q4 performance",
    evidence: "Board deck draft complete, Q&A prep in progress",
    nextStep: "Finalize deck and practice presentation run-through",
    channel: "#exec-team",
  },
  {
    id: "mem-19",
    title: "Launch Prep Review",
    summary:
      "Final review of Q1 launch preparations. Marketing, engineering, and support teams to confirm readiness.",
    type: "commitment",
    status: "active",
    date: daysFromNow(6),
    weekLabel: getWeekLabel(daysFromNow(6)),
    weekNumber: getWeekNumber(daysFromNow(6)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-7", name: "Alex Rivera" },
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-21", name: "Support Lead" },
    ],
    actionItems: [
      { id: "ai-36", title: "Complete launch checklist", isCompleted: false },
      { id: "ai-37", title: "Test support workflows", isCompleted: false },
    ],
    sources: [
      { id: "s-37", title: "Launch Checklist", type: "document" },
      { id: "s-38", title: "Readiness Review", type: "meeting" },
    ],
    category: "GTM",
    tags: ["launch", "preparation", "review"],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    connectedEventIds: ["mem-2", "mem-3", "mem-20", "mem-27"], // Weekly Sync, GTM Brief, Q1 Launch, Press Briefing
  },
  {
    id: "mem-27",
    title: "Press Briefing Scheduled",
    summary:
      "Coordinating with TechCrunch and The Verge for Q1 launch coverage. Embargo lifts launch day.",
    type: "commitment",
    status: "active",
    date: daysFromNow(4),
    weekLabel: getWeekLabel(daysFromNow(4)),
    weekNumber: getWeekNumber(daysFromNow(4)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-22", name: "PR Team" },
      { id: "p-7", name: "Alex Rivera" },
    ],
    actionItems: [
      { id: "ai-50", title: "Finalize press kit", isCompleted: false },
    ],
    sources: [{ id: "s-51", title: "Press Kit Draft", type: "document" }],
    category: "GTM",
    tags: ["press", "pr", "launch"],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(0),
    connectedEventIds: ["mem-19", "mem-20"], // Launch Prep, Q1 Launch
  },
  {
    id: "mem-28",
    title: "Engineering Sprint Planning",
    summary:
      "Sprint planning for final Q1 delivery sprint. Focus on bug fixes and performance optimization.",
    type: "meeting",
    status: "active",
    date: daysFromNow(7),
    weekLabel: getWeekLabel(daysFromNow(7)),
    weekNumber: getWeekNumber(daysFromNow(7)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-4", name: "James Liu" },
      { id: "p-2", name: "Marcus Williams" },
    ],
    actionItems: [
      { id: "ai-51", title: "Prioritize bug backlog", isCompleted: false },
    ],
    sources: [{ id: "s-52", title: "Sprint Board", type: "document" }],
    category: "Product Strategy",
    tags: ["sprint", "engineering", "planning"],
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
    connectedEventIds: ["mem-1", "mem-5", "mem-20"], // Scope Freeze, Roadmap, Q1 Launch
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IN 2 WEEKS - 3 events (FUTURE)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-20",
    title: "Q1 Product Launch",
    summary:
      "Major Q1 product release including new search, API v2, and analytics dashboard. Press embargo lifts at 9am PT.",
    type: "milestone",
    status: "active",
    date: daysFromNow(14),
    weekLabel: getWeekLabel(daysFromNow(14)),
    weekNumber: getWeekNumber(daysFromNow(14)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-7", name: "Alex Rivera" },
      { id: "p-22", name: "PR Team" },
    ],
    actionItems: [
      { id: "ai-38", title: "Final QA sign-off", isCompleted: false },
      { id: "ai-39", title: "Coordinate press release", isCompleted: false },
    ],
    sources: [
      { id: "s-39", title: "Launch Plan", type: "document" },
      { id: "s-40", title: "Press Release Draft", type: "document" },
    ],
    category: "Product Strategy",
    tags: ["launch", "q1", "product"],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
    connectedEventIds: [
      "mem-1",
      "mem-5",
      "mem-14",
      "mem-19",
      "mem-24",
      "mem-27",
      "mem-28",
      "mem-29",
    ], // Many connections to this major milestone
    impact: "Major product release with 3 flagship features going live",
    evidence: "QA sign-off pending, press release coordinated with PR team",
    nextStep: "Final QA pass and press embargo coordination",
    channel: "#product-strategy",
  },
  {
    id: "mem-29",
    title: "Launch Day War Room",
    summary:
      "All-hands on deck for launch. Engineering, support, and marketing coordinating in real-time.",
    type: "meeting",
    status: "active",
    date: daysFromNow(14),
    weekLabel: getWeekLabel(daysFromNow(14)),
    weekNumber: getWeekNumber(daysFromNow(14)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-4", name: "James Liu" },
      { id: "p-7", name: "Alex Rivera" },
    ],
    actionItems: [
      { id: "ai-52", title: "Monitor system metrics", isCompleted: false },
    ],
    sources: [{ id: "s-53", title: "War Room Runbook", type: "document" }],
    category: "Product Strategy",
    tags: ["launch", "war-room", "coordination"],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    connectedEventIds: ["mem-20", "mem-28"], // Q1 Launch, Sprint Planning
  },
  {
    id: "mem-30",
    title: "Marketing Campaign Go-Live",
    summary:
      "Paid ads, email campaigns, and social media blitz coordinated with product launch.",
    type: "milestone",
    status: "active",
    date: daysFromNow(13),
    weekLabel: getWeekLabel(daysFromNow(13)),
    weekNumber: getWeekNumber(daysFromNow(13)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-7", name: "Alex Rivera" },
      { id: "p-8", name: "Nina Patel" },
    ],
    actionItems: [
      { id: "ai-53", title: "Final ad creative approval", isCompleted: false },
    ],
    sources: [{ id: "s-54", title: "Campaign Brief", type: "document" }],
    category: "GTM",
    tags: ["marketing", "campaign", "launch"],
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
    connectedEventIds: ["mem-3", "mem-20", "mem-27"], // GTM Brief, Q1 Launch, Press Briefing
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IN 3 WEEKS - 2 events (FUTURE)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-21",
    title: "Enterprise Customer Kickoff",
    summary:
      "Kickoff meeting with Fortune 500 enterprise customer. 3-year contract worth $1.2M ARR.",
    type: "meeting",
    status: "active",
    date: daysFromNow(18),
    weekLabel: getWeekLabel(daysFromNow(18)),
    weekNumber: getWeekNumber(daysFromNow(18)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-15", name: "Sales Team" },
      { id: "p-23", name: "Enterprise Client" },
    ],
    actionItems: [
      {
        id: "ai-40",
        title: "Prepare onboarding materials",
        isCompleted: false,
      },
      { id: "ai-41", title: "Schedule training sessions", isCompleted: false },
    ],
    sources: [
      { id: "s-41", title: "Contract Signed", type: "document" },
      { id: "s-42", title: "Kickoff Agenda", type: "document" },
    ],
    category: "GTM",
    tags: ["enterprise", "customer", "kickoff"],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
    connectedEventIds: ["mem-3", "mem-9", "mem-15", "mem-31"], // GTM Brief, Pipeline Review, Security Audit, Post-launch Review
  },
  {
    id: "mem-31",
    title: "Post-Launch Review",
    summary:
      "Team retrospective on Q1 launch. Review metrics, identify wins, and document learnings.",
    type: "meeting",
    status: "active",
    date: daysFromNow(20),
    weekLabel: getWeekLabel(daysFromNow(20)),
    weekNumber: getWeekNumber(daysFromNow(20)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-2", name: "Marcus Williams" },
      { id: "p-7", name: "Alex Rivera" },
    ],
    actionItems: [
      { id: "ai-54", title: "Compile launch metrics", isCompleted: false },
    ],
    sources: [{ id: "s-55", title: "Retro Template", type: "document" }],
    category: "Product Strategy",
    tags: ["retro", "review", "launch"],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    connectedEventIds: ["mem-20", "mem-21", "mem-29"], // Q1 Launch, Enterprise Kickoff, War Room
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IN 4 WEEKS - 2 events (FUTURE)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-40",
    title: "Partner Ecosystem Summit",
    summary:
      "Hosting integration partners for product roadmap preview. 12 partners confirmed, 3 potential new partnerships.",
    type: "meeting",
    status: "active",
    date: daysFromNow(26),
    weekLabel: getWeekLabel(daysFromNow(26)),
    weekNumber: getWeekNumber(daysFromNow(26)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-7", name: "Alex Rivera" },
      { id: "p-8", name: "Nina Patel" },
    ],
    actionItems: [
      { id: "ai-66", title: "Finalize agenda", isCompleted: false },
      { id: "ai-67", title: "Prepare partner materials", isCompleted: false },
    ],
    sources: [{ id: "s-64", title: "Summit Agenda Draft", type: "document" }],
    category: "GTM",
    tags: ["partners", "summit", "ecosystem"],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(3),
    connectedEventIds: ["mem-21", "mem-30"],
  },
  {
    id: "mem-41",
    title: "Q1 All-Hands Meeting",
    summary:
      "Company-wide alignment meeting to celebrate Q1 launch and share H1 priorities.",
    type: "meeting",
    status: "active",
    date: daysFromNow(28),
    weekLabel: getWeekLabel(daysFromNow(28)),
    weekNumber: getWeekNumber(daysFromNow(28)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-9", name: "Jon Martinez" },
    ],
    actionItems: [
      { id: "ai-68", title: "Prepare presentation deck", isCompleted: false },
    ],
    sources: [{ id: "s-65", title: "All-Hands Template", type: "document" }],
    category: "Product Strategy",
    tags: ["all-hands", "q1", "alignment"],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    connectedEventIds: ["mem-20", "mem-31"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IN 5 WEEKS - 2 events (FUTURE)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-22",
    title: "Series A Close Target",
    summary:
      "Target date for Series A close. Goal: $15M at $60M+ valuation with strong lead investor.",
    type: "milestone",
    status: "active",
    date: daysFromNow(35),
    weekLabel: getWeekLabel(daysFromNow(35)),
    weekNumber: getWeekNumber(daysFromNow(35)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-11", name: "Maria Garcia" },
    ],
    actionItems: [
      { id: "ai-42", title: "Complete due diligence", isCompleted: false },
      { id: "ai-43", title: "Finalize legal docs", isCompleted: false },
    ],
    sources: [
      { id: "s-43", title: "Term Sheet Final", type: "document" },
      { id: "s-44", title: "Legal Review", type: "document" },
    ],
    category: "Fundraising",
    tags: ["series-a", "close", "milestone"],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(5),
    // Connection & Detail Fields
    connectedEventIds: ["mem-6", "mem-11", "mem-12", "mem-16", "mem-18"], // Term Sheet, Series A Kickoff, Legal Review, Investor Outreach, Board Meeting
    impact: "Company capitalization complete with $15M at $60M+ valuation",
    evidence: "Term sheet signed, legal review complete",
    nextStep: "Complete due diligence and finalize closing documents",
    channel: "#fundraising",
  },
  {
    id: "mem-42",
    title: "International Expansion Planning",
    summary:
      "Initial scoping for EMEA market entry. Legal structure, localization requirements, and partnership models.",
    type: "meeting",
    status: "active",
    date: daysFromNow(33),
    weekLabel: getWeekLabel(daysFromNow(33)),
    weekNumber: getWeekNumber(daysFromNow(33)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-7", name: "Alex Rivera" },
      { id: "p-9", name: "Jon Martinez" },
    ],
    actionItems: [
      { id: "ai-69", title: "Research legal requirements", isCompleted: false },
    ],
    sources: [{ id: "s-66", title: "EMEA Expansion Brief", type: "document" }],
    category: "GTM",
    tags: ["international", "emea", "expansion"],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    connectedEventIds: ["mem-22", "mem-40"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IN 6 WEEKS - 3 events (FUTURE)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-23",
    title: "Engineering Team Expansion",
    summary:
      "Target: 4 new engineers onboarded. Roles: 2 backend, 1 frontend, 1 DevOps.",
    type: "commitment",
    status: "active",
    date: daysFromNow(40),
    weekLabel: getWeekLabel(daysFromNow(40)),
    weekNumber: getWeekNumber(daysFromNow(40)),
    initiativeId: "init-4", // Engineering Hiring
    participants: [
      { id: "p-4", name: "James Liu" },
      { id: "p-16", name: "HR Lead" },
    ],
    actionItems: [
      { id: "ai-44", title: "Complete final interviews", isCompleted: false },
      { id: "ai-45", title: "Extend offers", isCompleted: false },
    ],
    sources: [
      { id: "s-45", title: "Hiring Pipeline", type: "document" },
      { id: "s-46", title: "Interview Schedule", type: "calendar" },
    ],
    category: "Hiring",
    tags: ["hiring", "engineering", "expansion"],
    createdAt: daysAgo(8),
    updatedAt: daysAgo(4),
    connectedEventIds: ["mem-10"], // Hiring Blocked
  },
  {
    id: "mem-43",
    title: "Series A Announcement",
    summary:
      "Public announcement of Series A funding. Coordinated press release with TechCrunch exclusive.",
    type: "milestone",
    status: "active",
    date: daysFromNow(42),
    weekLabel: getWeekLabel(daysFromNow(42)),
    weekNumber: getWeekNumber(daysFromNow(42)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-22", name: "PR Team" },
    ],
    actionItems: [
      { id: "ai-70", title: "Draft press release", isCompleted: false },
    ],
    sources: [{ id: "s-67", title: "PR Timeline", type: "document" }],
    category: "Fundraising",
    tags: ["announcement", "press", "series-a"],
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
    connectedEventIds: ["mem-22", "mem-27"],
  },
  {
    id: "mem-44",
    title: "Q2 Product Planning",
    summary:
      "Kickoff planning for Q2 feature roadmap. Focus areas: AI capabilities, mobile app, analytics v2.",
    type: "meeting",
    status: "active",
    date: daysFromNow(41),
    weekLabel: getWeekLabel(daysFromNow(41)),
    weekNumber: getWeekNumber(daysFromNow(41)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-2", name: "Marcus Williams" },
    ],
    actionItems: [
      {
        id: "ai-71",
        title: "Gather team input on priorities",
        isCompleted: false,
      },
    ],
    sources: [{ id: "s-68", title: "Q2 Planning Template", type: "document" }],
    category: "Product Strategy",
    tags: ["q2", "planning", "roadmap"],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(0),
    connectedEventIds: ["mem-20", "mem-31", "mem-41"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IN 7 WEEKS - 2 events (FUTURE)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-45",
    title: "New Office Move-In",
    summary:
      "Relocating to larger headquarters. 15,000 sq ft space to accommodate team growth.",
    type: "milestone",
    status: "active",
    date: daysFromNow(49),
    weekLabel: getWeekLabel(daysFromNow(49)),
    weekNumber: getWeekNumber(daysFromNow(49)),
    initiativeId: "init-4", // Engineering Hiring
    participants: [
      { id: "p-16", name: "HR Lead" },
      { id: "p-9", name: "Jon Martinez" },
    ],
    actionItems: [
      { id: "ai-72", title: "Coordinate IT setup", isCompleted: false },
      { id: "ai-73", title: "Plan office layout", isCompleted: false },
    ],
    sources: [{ id: "s-69", title: "Move Logistics Doc", type: "document" }],
    category: "Hiring",
    tags: ["office", "expansion", "facilities"],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(5),
    connectedEventIds: ["mem-23", "mem-43"],
  },
  {
    id: "mem-46",
    title: "Customer Advisory Board Meeting",
    summary:
      "Quarterly CAB meeting with top 10 customers. Roadmap preview and feedback session.",
    type: "meeting",
    status: "active",
    date: daysFromNow(47),
    weekLabel: getWeekLabel(daysFromNow(47)),
    weekNumber: getWeekNumber(daysFromNow(47)),
    initiativeId: "init-3", // Enterprise GTM Launch
    participants: [
      { id: "p-1", name: "Sarah Chen" },
      { id: "p-7", name: "Alex Rivera" },
    ],
    actionItems: [
      { id: "ai-74", title: "Send invitations", isCompleted: false },
    ],
    sources: [{ id: "s-70", title: "CAB Agenda Template", type: "document" }],
    category: "GTM",
    tags: ["customers", "advisory", "feedback"],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    connectedEventIds: ["mem-21", "mem-31", "mem-40"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IN 8 WEEKS - 3 events (FUTURE)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mem-47",
    title: "H1 Board Meeting",
    summary:
      "First board meeting post-Series A. Review H1 progress, set H2 objectives, discuss expansion plans.",
    type: "meeting",
    status: "active",
    date: daysFromNow(54),
    weekLabel: getWeekLabel(daysFromNow(54)),
    weekNumber: getWeekNumber(daysFromNow(54)),
    initiativeId: "init-2", // Series A Fundraise
    participants: [
      { id: "p-9", name: "Jon Martinez" },
      { id: "p-20", name: "Board Members" },
    ],
    actionItems: [
      { id: "ai-75", title: "Prepare H1 metrics deck", isCompleted: false },
    ],
    sources: [{ id: "s-71", title: "Board Deck Template", type: "document" }],
    category: "Fundraising",
    tags: ["board", "h1", "review"],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
    connectedEventIds: ["mem-18", "mem-22", "mem-43"],
  },
  {
    id: "mem-48",
    title: "Summer Intern Program Start",
    summary:
      "8 engineering interns joining for 12-week program. Focus on AI/ML and mobile development.",
    type: "commitment",
    status: "active",
    date: daysFromNow(56),
    weekLabel: getWeekLabel(daysFromNow(56)),
    weekNumber: getWeekNumber(daysFromNow(56)),
    initiativeId: "init-4", // Engineering Hiring
    participants: [
      { id: "p-4", name: "James Liu" },
      { id: "p-16", name: "HR Lead" },
    ],
    actionItems: [
      { id: "ai-76", title: "Finalize intern projects", isCompleted: false },
    ],
    sources: [{ id: "s-72", title: "Intern Program Guide", type: "document" }],
    category: "Hiring",
    tags: ["interns", "summer", "program"],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
    connectedEventIds: ["mem-23", "mem-45"],
  },
  {
    id: "mem-49",
    title: "Mobile App Beta Launch",
    summary:
      "Private beta release of iOS and Android apps to 500 selected users. 4-week testing period.",
    type: "milestone",
    status: "active",
    date: daysFromNow(55),
    weekLabel: getWeekLabel(daysFromNow(55)),
    weekNumber: getWeekNumber(daysFromNow(55)),
    initiativeId: "init-1", // Q1 Product Strategy
    participants: [
      { id: "p-2", name: "Marcus Williams" },
      { id: "p-4", name: "James Liu" },
    ],
    actionItems: [
      { id: "ai-77", title: "Recruit beta testers", isCompleted: false },
      { id: "ai-78", title: "Prepare feedback survey", isCompleted: false },
    ],
    sources: [{ id: "s-73", title: "Beta Launch Plan", type: "document" }],
    category: "Product Strategy",
    tags: ["mobile", "beta", "launch"],
    createdAt: daysAgo(4),
    updatedAt: daysAgo(1),
    connectedEventIds: ["mem-20", "mem-44"],
  },
];
