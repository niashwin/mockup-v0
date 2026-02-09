import type { Action } from "@types/action";
import type { DigestSection } from "@types/sources";

export type ReportCategory =
  | "leadership"
  | "gtm"
  | "product"
  | "engineering"
  | "finance";

export interface DataSource {
  id: string;
  type: "slack" | "linear" | "calendar" | "email" | "document";
  label: string;
}

export interface Comment {
  id: string;
  highlightId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: Date;
}

export interface Highlight {
  id: string;
  reportId: string;
  selectedText: string;
  comments: Comment[];
}

export interface WeeklyReport {
  id: string;
  title: string;
  weekNumber: number;
  dateRange: { start: Date; end: Date };
  generatedAt: Date;
  content: string;
  dataSources: DataSource[];
  highlights: Highlight[];
  actions?: Action[];
  reportType?: "standard" | "leadership-digest";
  sections?: DigestSection[];
  category: ReportCategory;
}

export const mockReports: WeeklyReport[] = [
  {
    id: "report-leadership-digest",
    title: "Leadership Digest",
    reportType: "leadership-digest",
    category: "leadership",
    weekNumber: 6,
    dateRange: {
      start: new Date(2026, 1, 2),
      end: new Date(2026, 1, 8),
    },
    generatedAt: new Date(2026, 1, 8, 9, 0),
    dataSources: [
      { id: "ds-1", type: "slack", label: "Slack" },
      { id: "ds-2", type: "linear", label: "Linear" },
      { id: "ds-3", type: "calendar", label: "Google Calendar" },
    ],
    content: "",
    highlights: [],
    sections: [
      {
        id: "what-changed",
        title: "What Changed",
        content: `The engineering team completed the migration to the new microservices architecture, reducing API response times by 40%. The sales team closed three enterprise deals worth $450K in combined ARR, exceeding monthly targets by 15%.

Marketing launched the new brand refresh across all channels, with early engagement metrics showing a 25% increase in website traffic. The product team shipped the collaborative editing feature, which was the most requested item from our Q4 customer feedback.

Key infrastructure improvements include the rollout of the new CI/CD pipeline, reducing deployment times from 45 minutes to under 10 minutes. The support team implemented the new ticketing system, improving first-response times by 60%.`,
        sources: [
          {
            id: "src-wc-1",
            category: "meetings",
            title: "Engineering All-Hands",
            snippet:
              "Discussed microservices migration completion and performance wins",
            timestamp: new Date(2026, 1, 5, 10, 0),
          },
          {
            id: "src-wc-2",
            category: "meetings",
            title: "Sales Pipeline Review",
            snippet: "Reviewed closed deals and Q1 forecast",
            timestamp: new Date(2026, 1, 4, 14, 0),
          },
          {
            id: "src-wc-3",
            category: "slack",
            title: "#engineering - Architecture update",
            snippet: "Team celebrated 40% latency reduction",
            timestamp: new Date(2026, 1, 6, 11, 30),
            href: "https://sentra-app.slack.com/archives/C0ABA6NP64F/p1769975111239039",
          },
          {
            id: "src-wc-4",
            category: "slack",
            title: "#sales - Deal announcements",
            snippet: "Three enterprise wins announced",
            timestamp: new Date(2026, 1, 5, 16, 0),
            href: "https://sentra-app.slack.com/archives/C0ABA6NP64F/p1769975111239039",
          },
          {
            id: "src-wc-5",
            category: "slack",
            title: "#marketing - Brand refresh launch",
            snippet: "All channels updated with new branding",
            timestamp: new Date(2026, 1, 3, 9, 0),
            href: "https://sentra-app.slack.com/archives/C0ABA6NP64F/p1769975111239039",
          },
          {
            id: "src-wc-6",
            category: "linear",
            title: "Collaborative Editing Project",
            snippet: "Feature shipped to production",
            timestamp: new Date(2026, 1, 7, 15, 0),
            href: "https://linear.app/sentra-app/project/email-ingestion-replying-4bd2266d0a28",
          },
        ],
      },
      {
        id: "risks-trending",
        title: "Risks Trending",
        content: `**Infrastructure Scaling Concerns**: With the 3x increase in traffic from the marketing campaign, the current database cluster is approaching capacity limits. The team is evaluating options for horizontal scaling or migration to a managed solution.

**Talent Pipeline**: Two senior engineers have signaled potential departures, which could impact the Q2 roadmap. HR is accelerating backfill recruiting and retention conversations.

**Compliance Deadline**: The SOC 2 Type II audit is scheduled for March 15th, and several documentation gaps remain. The security team is running a sprint to close the remaining items.

**Vendor Dependency**: The primary payment processor announced a 15% price increase effective April 1st. Finance is evaluating alternative providers.`,
        sources: [
          {
            id: "src-rt-1",
            category: "meetings",
            title: "Infrastructure Planning",
            snippet: "Database scaling options discussed",
            timestamp: new Date(2026, 1, 6, 11, 0),
          },
          {
            id: "src-rt-2",
            category: "slack",
            title: "#ops-alerts - Capacity warnings",
            snippet: "Database CPU hitting 80% during peak hours",
            timestamp: new Date(2026, 1, 7, 8, 30),
            href: "https://sentra-app.slack.com/archives/C0ABA6NP64F/p1769975111239039",
          },
          {
            id: "src-rt-3",
            category: "slack",
            title: "#leadership - Retention discussion",
            snippet: "Two senior engineers considering offers",
            timestamp: new Date(2026, 1, 5, 17, 0),
            href: "https://sentra-app.slack.com/archives/C0ABA6NP64F/p1769975111239039",
          },
          {
            id: "src-rt-4",
            category: "linear",
            title: "SOC 2 Compliance Sprint",
            snippet: "12 items remaining, 8 in progress",
            timestamp: new Date(2026, 1, 4, 10, 0),
            href: "https://linear.app/sentra-app/project/email-ingestion-replying-4bd2266d0a28",
          },
        ],
      },
      {
        id: "cross-team-signals",
        title: "Cross-Team Signals",
        content: `**Product ↔ Engineering**: Strong alignment on the Q2 roadmap priorities. The new feature estimation process has improved accuracy by 35%, with fewer surprises in sprint planning.

**Sales ↔ Product**: Customer feedback from recent enterprise deals is driving three new feature requests for the API. Product has prioritized these for the March release.

**Marketing ↔ Sales**: The new lead scoring model is showing promising early results, with a 20% improvement in lead-to-opportunity conversion rates.

**Support ↔ Engineering**: The new error monitoring integration is helping identify issues 50% faster. Three critical bugs were caught in staging this week before reaching production.

**HR ↔ All Teams**: The new employee onboarding program received a 4.8/5 satisfaction score from the January cohort. Remote team coordination improvements are being rolled out company-wide.`,
        sources: [
          {
            id: "src-cts-1",
            category: "meetings",
            title: "Product-Engineering Sync",
            snippet: "Q2 roadmap alignment confirmed",
            timestamp: new Date(2026, 1, 3, 15, 0),
          },
          {
            id: "src-cts-2",
            category: "slack",
            title: "#product-feedback - Enterprise requests",
            snippet: "Three API feature requests from sales",
            timestamp: new Date(2026, 1, 6, 14, 0),
            href: "https://sentra-app.slack.com/archives/C0ABA6NP64F/p1769975111239039",
          },
          {
            id: "src-cts-3",
            category: "slack",
            title: "#marketing - Lead scoring results",
            snippet: "20% improvement in conversions",
            timestamp: new Date(2026, 1, 7, 10, 0),
            href: "https://sentra-app.slack.com/archives/C0ABA6NP64F/p1769975111239039",
          },
          {
            id: "src-cts-4",
            category: "slack",
            title: "#engineering - Bug catches",
            snippet: "Three critical bugs caught before production",
            timestamp: new Date(2026, 1, 5, 12, 0),
            href: "https://sentra-app.slack.com/archives/C0ABA6NP64F/p1769975111239039",
          },
          {
            id: "src-cts-5",
            category: "slack",
            title: "#hr-updates - Onboarding feedback",
            snippet: "4.8/5 satisfaction score from January cohort",
            timestamp: new Date(2026, 1, 4, 9, 0),
            href: "https://sentra-app.slack.com/archives/C0ABA6NP64F/p1769975111239039",
          },
          {
            id: "src-cts-6",
            category: "linear",
            title: "Cross-Team Initiatives",
            snippet: "5 active cross-functional projects",
            timestamp: new Date(2026, 1, 2, 11, 0),
            href: "https://linear.app/sentra-app/project/email-ingestion-replying-4bd2266d0a28",
          },
        ],
      },
    ],
    actions: [
      {
        id: "action-ld-meeting-1",
        type: "meeting",
        reportId: "report-leadership-digest",
        title: "Database Scaling Strategy Discussion",
        status: "pending",
        meetingName: "Infrastructure Scaling Review",
        description:
          "Discuss options for horizontal scaling vs managed database migration. Review capacity projections and timeline for implementation before traffic spike.",
        participants: [
          {
            id: "p-ld-1",
            name: "Mike Chen",
            email: "mike.chen@company.com",
            matchStatus: "matched",
            matchedContactId: "contact-infra-1",
          },
          {
            id: "p-ld-2",
            name: "Lisa Park",
            email: "lisa.park@company.com",
            matchStatus: "matched",
            matchedContactId: "contact-eng-2",
          },
          {
            id: "p-ld-3",
            name: "James Wilson",
            email: "j.wilson@aws.com",
            matchStatus: "suggested",
          },
        ],
        calendarConnected: true,
      },
      {
        id: "action-ld-email-1",
        type: "email",
        reportId: "report-leadership-digest",
        title: "SOC 2 Audit Documentation Follow-up",
        status: "pending",
        subject: "Re: SOC 2 Type II Audit - Documentation Gaps",
        message:
          "Hi Rachel,\n\nFollowing up on our compliance sprint progress. We've closed 8 of the 12 remaining items. Could we schedule a quick sync to review the final 4 items and ensure we're on track for the March 15th audit?\n\nThe outstanding items are:\n- Access control documentation\n- Incident response procedures\n- Change management logs\n- Vendor risk assessments\n\nLet me know your availability this week.\n\nBest regards",
        recipients: [
          {
            id: "r-ld-1",
            name: "Rachel Torres",
            email: "rachel.torres@company.com",
            matchStatus: "matched",
            matchedContactId: "contact-security-1",
            recipientType: "to",
          },
          {
            id: "r-ld-2",
            name: "David Kim",
            email: "david.kim@company.com",
            matchStatus: "matched",
            matchedContactId: "contact-legal-1",
            recipientType: "cc",
          },
        ],
      },
      {
        id: "action-ld-email-2",
        type: "email",
        reportId: "report-leadership-digest",
        title: "Senior Engineer Retention Discussion",
        status: "pending",
        subject: "Confidential: Retention Package Proposal",
        message:
          "Hi Sandra,\n\nI wanted to discuss the retention packages for the two senior engineers who have signaled potential departures. Given their impact on the Q2 roadmap, I'd like to propose:\n\n1. Competitive equity refresh\n2. Promotion path acceleration\n3. Project leadership opportunities\n\nCan we meet tomorrow to finalize the approach before reaching out to them?\n\nThanks",
        recipients: [
          {
            id: "r-ld-3",
            name: "Sandra Lee",
            email: "sandra.lee@company.com",
            matchStatus: "matched",
            matchedContactId: "contact-hr-1",
            recipientType: "to",
          },
        ],
      },
      {
        id: "action-prd",
        type: "prd-generation",
        reportId: "report-leadership-digest",
        title: "Generate PRD from discussions",
        status: "pending",
        prompt: "Generate PRD from discussions",
        sourceContext: {
          meetings: 4,
          slackThreads: 12,
          documents: 2,
        },
      },
    ],
  },
  {
    id: "report-5",
    title: "Product Weekly Report",
    category: "product",
    weekNumber: 5,
    dateRange: {
      start: new Date(2026, 0, 26),
      end: new Date(2026, 1, 1),
    },
    generatedAt: new Date(2026, 1, 1, 16, 4),
    dataSources: [
      { id: "ds-1", type: "slack", label: "Slack" },
      { id: "ds-2", type: "linear", label: "Linear" },
      { id: "ds-3", type: "calendar", label: "Google Calendar" },
    ],
    content: `## Highlights & Key Developments

This week marked a pivotal moment for the company with the successful public announcement of our $5M seed round, which immediately generated significant press coverage and a wave of 17 inbound leads. This external momentum is matched by an internal strategic pivot to aggressively pursue the SMB market, driven by the need to hit Series A growth targets within the next 12 weeks.

### Go-to-Market & Business Momentum

**Successful Public Launch:** The fundraise announcement was executed successfully, with coordinated posts across LinkedIn and X, resulting in coverage on Yahoo Finance, Silicon Angle, and PR Newswire. The immediate impact has been 17 inbound leads and a scheduled exclusive interview with Forbes, significantly increasing brand legitimacy.

**Strategic Pivot to SMB:** To meet the ambitious 12-week growth targets for Series A, the go-to-market strategy has officially shifted to prioritize the SMB segment due to its faster sales cycles. A dedicated SMB pipeline has been created in Attio to manage this new focus.

**Pipeline Advancement:** The enterprise pipeline continues to progress with a promising meeting at Accenture that revealed a potential direct sale opportunity. The team is actively pursuing a second demo to close a deal with Twilio. On the SMB front, a deal with Salesape is moving forward, with an order form requested for an initial 5-10 seats.

**First SMB Client Onboarded:** Following last week's close, the project kickoff with Campfire has been completed, officially moving them from a sales prospect to an active customer.

### Product & Engineering Velocity

**Major Features Shipped:**

- **Outlook Integration:** The full integration for Outlook calendars is complete, tested, and live in production. This includes the ability for users to connect their Outlook accounts during onboarding, unblocking a key requirement for enterprise clients.

- **Web App Performance Overhaul:** Loading times for the critical "Memory" and "Meetings" pages have been dramatically reduced through aggressive optimization, directly addressing user feedback about sluggish performance.

**Desktop Application Progress:** The core desktop recording functionality is stable and working. Focus is now on polishing the user experience, with ongoing work on the upload flow and integration with the web app.

### Risks & Blockers

- **Desktop App Remains Critical Blocker:** The desktop application is the single largest blocker for converting SMB interest into closed deals. Multiple prospects have expressed that they need the desktop experience before committing.

- **Product Cohesion Concerns:** Internal discussions have surfaced concerns about product cohesion and the need for a more disciplined product development process to ensure the user experience lives up to the new market hype.

### Action Items for Next Week

1. Finalize desktop app MVP and begin private beta testing
2. Close Salesape deal with signed order form
3. Schedule Forbes interview for maximum impact
4. Complete second Twilio demo and proposal
5. Review and refine SMB onboarding flow based on Campfire feedback`,
    highlights: [
      {
        id: "hl-1",
        reportId: "report-5",
        selectedText:
          "significant press coverage and a wave of 17 inbound leads",
        comments: [
          {
            id: "c-1",
            highlightId: "hl-1",
            userId: "user-1",
            userName: "Sarah Chen",
            text: "This is excellent traction. We should track conversion rates on these inbound leads.",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          },
        ],
      },
      {
        id: "hl-2",
        reportId: "report-5",
        selectedText: "Desktop Application Progress",
        comments: [
          {
            id: "c-2",
            highlightId: "hl-2",
            userId: "user-2",
            userName: "Marcus Johnson",
            text: "Can we get a more detailed timeline on the desktop app? This is blocking several deals.",
            createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
          },
        ],
      },
    ],
    actions: [
      {
        id: "action-1",
        type: "meeting",
        reportId: "report-5",
        title: "Follow-up: Accenture Direct Sale Opportunity",
        status: "pending",
        meetingName: "Accenture Deal Discussion",
        description:
          "Discuss the direct sale opportunity discovered during last week's meeting. Focus on pricing structure and timeline for pilot program.",
        participants: [
          {
            id: "p-1",
            name: "Sarah Chen",
            email: "sarah.chen@accenture.com",
            matchStatus: "matched",
            matchedContactId: "contact-accenture-1",
          },
          {
            id: "p-2",
            name: "Marcus Johnson",
            email: "marcus.j@example.com",
            matchStatus: "suggested",
          },
          {
            id: "p-3",
            name: "David Park",
            email: "d.park@accenture.com",
            matchStatus: "none",
          },
        ],
        calendarConnected: true,
      },
      {
        id: "action-2",
        type: "email",
        reportId: "report-5",
        title: "Forbes Interview Scheduling",
        status: "pending",
        subject: "Re: Exclusive Interview Request - Seed Round Coverage",
        message:
          "Hi Alex,\n\nThank you for reaching out about the interview opportunity. We'd be happy to schedule time to discuss our recent seed round and product vision.\n\nI'm available this week on Thursday or Friday afternoon. Would either of those work for you?\n\nBest regards",
        recipients: [
          {
            id: "r-1",
            name: "Alex Rivera",
            email: "alex.rivera@forbes.com",
            matchStatus: "matched",
            matchedContactId: "contact-forbes-1",
          },
        ],
      },
      {
        id: "action-3",
        type: "meeting",
        reportId: "report-5",
        title: "Twilio Second Demo",
        status: "pending",
        meetingName: "Twilio Product Demo - Round 2",
        description:
          "Present advanced features and discuss enterprise pricing. Address technical questions from their engineering team.",
        participants: [
          {
            id: "p-4",
            name: "Jennifer Wu",
            email: "jwu@twilio.com",
            matchStatus: "matched",
            matchedContactId: "contact-twilio-1",
          },
          {
            id: "p-5",
            name: "Engineering Lead",
            email: "",
            matchStatus: "none",
          },
        ],
        calendarConnected: true,
      },
    ],
  },
  {
    id: "report-4",
    title: "GTM Strategy Update",
    category: "gtm",
    weekNumber: 4,
    dateRange: {
      start: new Date(2026, 0, 19),
      end: new Date(2026, 0, 25),
    },
    generatedAt: new Date(2026, 0, 25, 17, 30),
    dataSources: [
      { id: "ds-1", type: "slack", label: "Slack" },
      { id: "ds-2", type: "linear", label: "Linear" },
    ],
    content: `## Executive Summary

Week 4 focused on preparation for the fundraise announcement and closing initial customer deals. The team made significant progress on both fronts, with the Campfire deal now signed and onboarding scheduled.

### Key Achievements

- Finalized press release and coordinated with PR agency
- Closed Campfire as first paying SMB customer ($12K ARR)
- Completed Outlook integration development
- Stabilized desktop app core functionality

### Looking Ahead

The public announcement is scheduled for Monday. All systems are ready for the expected increase in inbound interest.`,
    highlights: [],
  },
  {
    id: "report-3",
    title: "Engineering Weekly",
    category: "engineering",
    weekNumber: 3,
    dateRange: {
      start: new Date(2026, 0, 12),
      end: new Date(2026, 0, 18),
    },
    generatedAt: new Date(2026, 0, 18, 16, 0),
    dataSources: [
      { id: "ds-1", type: "slack", label: "Slack" },
      { id: "ds-2", type: "calendar", label: "Google Calendar" },
    ],
    content: `## Executive Summary

A productive week focused on advancing enterprise conversations and accelerating development timelines. The team is energized by the upcoming fundraise announcement.

### Pipeline Updates

- Accenture meeting scheduled for next week
- Twilio showing strong interest, demo completed
- Campfire verbal commitment received

### Product Progress

- Outlook integration in final testing phase
- Desktop app recording stable on macOS
- Performance optimization sprint kicked off`,
    highlights: [],
  },
  {
    id: "report-2",
    title: "FP&A Daily Update",
    category: "finance",
    weekNumber: 2,
    dateRange: {
      start: new Date(2026, 0, 5),
      end: new Date(2026, 0, 11),
    },
    generatedAt: new Date(2026, 0, 11, 15, 45),
    dataSources: [{ id: "ds-1", type: "slack", label: "Slack" }],
    content: `## Executive Summary

First full week of the new year. The team set ambitious Q1 goals and began executing against the Series A timeline.

### Strategic Planning

- Defined 12-week growth targets
- Identified key product milestones
- Mapped enterprise vs SMB strategy options

### Early Wins

- Three new enterprise discovery calls scheduled
- Desktop app prototype demonstrated internally
- Outlook integration scope finalized`,
    highlights: [],
  },
  {
    id: "report-1",
    title: "Product Weekly Report",
    category: "product",
    weekNumber: 1,
    dateRange: {
      start: new Date(2025, 11, 29),
      end: new Date(2026, 0, 4),
    },
    generatedAt: new Date(2026, 0, 4, 14, 0),
    dataSources: [{ id: "ds-1", type: "slack", label: "Slack" }],
    content: `## Executive Summary

Year-end wrap-up and planning for 2026. The team took a well-deserved break while maintaining critical systems.

### Holiday Operations

- Skeleton crew maintained uptime
- No critical incidents reported
- Customer support handled via async channels`,
    highlights: [],
  },
  {
    id: "report-dec-4",
    title: "Engineering Weekly",
    category: "engineering",
    weekNumber: 52,
    dateRange: {
      start: new Date(2025, 11, 22),
      end: new Date(2025, 11, 28),
    },
    generatedAt: new Date(2025, 11, 28, 16, 0),
    dataSources: [
      { id: "ds-1", type: "slack", label: "Slack" },
      { id: "ds-2", type: "linear", label: "Linear" },
    ],
    content: `## Executive Summary

Final engineering sprint of the year focused on stability and bug fixes before the holiday freeze.

### Completed Items

- Fixed 12 critical bugs in production
- Deployed performance monitoring
- Code freeze initiated Dec 24th`,
    highlights: [],
  },
  {
    id: "report-dec-3",
    title: "Sales Pipeline Review",
    category: "gtm",
    weekNumber: 51,
    dateRange: {
      start: new Date(2025, 11, 15),
      end: new Date(2025, 11, 21),
    },
    generatedAt: new Date(2025, 11, 21, 17, 30),
    dataSources: [
      { id: "ds-1", type: "slack", label: "Slack" },
      { id: "ds-3", type: "calendar", label: "Google Calendar" },
    ],
    content: `## Executive Summary

Strong Q4 close with several deals moving to signature stage before year-end.

### Pipeline Highlights

- 3 enterprise deals in final negotiation
- SMB pipeline at $240K
- Q1 forecast looking healthy`,
    highlights: [],
  },
  {
    id: "report-dec-2",
    title: "FP&A Monthly Close",
    category: "finance",
    weekNumber: 50,
    dateRange: {
      start: new Date(2025, 11, 8),
      end: new Date(2025, 11, 14),
    },
    generatedAt: new Date(2025, 11, 14, 15, 0),
    dataSources: [{ id: "ds-1", type: "slack", label: "Slack" }],
    content: `## Executive Summary

November books closed. Preparing year-end financial statements and board materials.

### Financial Highlights

- November revenue on target
- Burn rate stable at $180K/month
- 18 months runway remaining`,
    highlights: [],
  },
  {
    id: "report-dec-1",
    title: "Product Weekly Report",
    category: "product",
    weekNumber: 49,
    dateRange: {
      start: new Date(2025, 11, 1),
      end: new Date(2025, 11, 7),
    },
    generatedAt: new Date(2025, 11, 7, 16, 30),
    dataSources: [
      { id: "ds-1", type: "slack", label: "Slack" },
      { id: "ds-2", type: "linear", label: "Linear" },
    ],
    content: `## Executive Summary

Kicked off December with product roadmap planning for Q1 2026.

### Key Decisions

- Prioritized desktop app for Q1
- Deferred mobile app to Q2
- Committed to Outlook integration by Jan 15`,
    highlights: [],
  },
];
