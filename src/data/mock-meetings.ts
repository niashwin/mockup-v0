import type { Meeting } from "@types/meeting";
import { getToday, getTomorrow, getDaysFromNow } from "@lib/mock-date-helpers";

// ─────────────────────────────────────────────────────────────────────────────
// Mock Meetings Data
// ─────────────────────────────────────────────────────────────────────────────

export const mockMeetings: Meeting[] = [
  // ─── Older Historical Meetings (Last Week+) ───────────────────────────────
  {
    id: "meeting-old-1",
    title: "Product Roadmap Review",
    summary: "Reviewed H1 roadmap priorities with stakeholders.",
    description: "Quarterly roadmap alignment meeting.",
    date: getDaysFromNow(-7),
    startTime: "10:00 AM",
    duration: 90,
    platform: "zoom",
    hasRecording: true,
    recordingUrl: "https://zoom.us/rec/roadmap-review",
    visibility: "shared",
    attendees: [
      {
        id: "att-old-1",
        name: "Product Team",
        email: "product@company.com",
        initials: "PT",
        attended: true,
      },
    ],
    overview:
      "Reviewed and prioritized H1 roadmap items. Customer feedback driving mobile-first approach.",
    keyTakeaways: [
      { id: "kt-old-1", text: "Mobile app priority increased to P0" },
      { id: "kt-old-2", text: "API v2 timeline shifted to Q2" },
    ],
  },
  {
    id: "meeting-old-2",
    title: "Security Audit Kickoff",
    summary: "Started annual security audit with external team.",
    description: "Kickoff meeting for SOC2 compliance audit.",
    date: getDaysFromNow(-8),
    startTime: "2:00 PM",
    duration: 60,
    platform: "meet",
    hasRecording: false,
    visibility: "private",
    attendees: [
      {
        id: "att-old-2",
        name: "Security Team",
        email: "security@company.com",
        initials: "ST",
        attended: true,
      },
      {
        id: "att-old-3",
        name: "External Auditors",
        email: "audit@external.com",
        initials: "EA",
        attended: true,
      },
    ],
    overview:
      "Kicked off SOC2 Type II audit. Timeline: 6 weeks. Access granted to auditors for documentation review.",
    keyTakeaways: [
      { id: "kt-old-3", text: "Audit completion target: March 15" },
      { id: "kt-old-4", text: "Weekly status syncs scheduled" },
    ],
  },
  {
    id: "meeting-old-3",
    title: "Hiring Committee",
    summary: "Reviewed 5 engineering candidates.",
    description: "Weekly hiring committee for engineering roles.",
    date: getDaysFromNow(-9),
    startTime: "11:00 AM",
    duration: 45,
    platform: "zoom",
    hasRecording: false,
    visibility: "private",
    attendees: [
      {
        id: "att-old-4",
        name: "Hiring Manager",
        email: "hm@company.com",
        initials: "HM",
        attended: true,
      },
    ],
    overview:
      "Reviewed 5 candidates for Senior Engineer role. 2 moving to final round, 3 rejected.",
    keyTakeaways: [
      { id: "kt-old-5", text: "2 candidates advancing to final round" },
      { id: "kt-old-6", text: "Need to expand sourcing pipeline" },
    ],
  },
  {
    id: "meeting-old-4",
    title: "Budget Planning FY24",
    summary: "Finalized department budgets for fiscal year.",
    description: "Annual budget planning session with finance.",
    date: getDaysFromNow(-10),
    startTime: "9:00 AM",
    duration: 120,
    platform: "in-person",
    location: "HQ — Boardroom 3A",
    hasRecording: false,
    visibility: "private",
    attendees: [
      {
        id: "att-old-5",
        name: "Finance Team",
        email: "finance@company.com",
        initials: "FT",
        attended: true,
      },
      {
        id: "att-old-6",
        name: "Department Heads",
        email: "heads@company.com",
        initials: "DH",
        attended: true,
      },
    ],
    overview:
      "Approved FY24 budgets. Engineering +15%, Sales +20%, Marketing +10%.",
    keyTakeaways: [
      { id: "kt-old-7", text: "Total budget increase: 15% YoY" },
      { id: "kt-old-8", text: "New headcount approved: 12 roles" },
    ],
  },
  {
    id: "meeting-old-5",
    title: "Customer Advisory Board",
    summary: "Gathered feedback from top 10 customers.",
    description: "Quarterly CAB meeting with enterprise customers.",
    date: getDaysFromNow(-12),
    startTime: "1:00 PM",
    duration: 90,
    platform: "zoom",
    hasRecording: true,
    recordingUrl: "https://zoom.us/rec/cab-q4",
    visibility: "shared",
    attendees: [
      {
        id: "att-old-7",
        name: "Enterprise Customers",
        email: "cab@company.com",
        initials: "EC",
        attended: true,
      },
    ],
    overview:
      "Top requests: better reporting, API rate limits increase, mobile app. NPS score: 72.",
    keyTakeaways: [
      { id: "kt-old-9", text: "Reporting dashboard top priority" },
      { id: "kt-old-10", text: "NPS improved from 68 to 72" },
    ],
  },

  // ─── Past Meetings (Today) ────────────────────────────────────────────────
  {
    id: "meeting-past-1",
    title: "Daily Standup",
    summary: "Team sync on sprint progress and blockers.",
    description: "Morning standup to align on priorities and unblock issues.",
    date: getToday(),
    startTime: "9:00 AM",
    duration: 15,
    platform: "zoom",
    hasRecording: false,
    visibility: "shared",
    attendees: [
      {
        id: "att-1",
        name: "Alex Park",
        email: "alex.park@company.com",
        initials: "AP",
        attended: true,
      },
      {
        id: "att-2",
        name: "Priya Sharma",
        email: "priya.s@company.com",
        initials: "PS",
        attended: true,
      },
      {
        id: "att-3",
        name: "Marcus Johnson",
        email: "marcus.j@company.com",
        initials: "MJ",
        attended: true,
      },
    ],
    overview:
      "Quick standup covering sprint progress. API integration is on track. Marcus needs design review for the new dashboard component.",
    keyTakeaways: [
      { id: "kt-1", text: "API integration 80% complete" },
      { id: "kt-2", text: "Design review needed for dashboard" },
      { id: "kt-3", text: "All blockers cleared" },
    ],
  },
  {
    id: "meeting-past-2",
    title: "Q1 All Hands",
    summary: "Company-wide update on Q1 goals and achievements.",
    description:
      "Quarterly all-hands meeting covering company progress and upcoming initiatives.",
    date: getToday(),
    startTime: "10:00 AM",
    duration: 60,
    platform: "zoom",
    hasRecording: true,
    recordingUrl: "https://zoom.us/rec/q1-allhands",
    visibility: "shared",
    attendees: [
      {
        id: "att-4",
        name: "Sarah Chen",
        email: "sarah@company.com",
        initials: "SC",
        attended: true,
      },
      {
        id: "att-5",
        name: "Engineering Team",
        email: "eng@company.com",
        initials: "ET",
        attended: true,
      },
    ],
    overview:
      "Company all-hands covering Q1 achievements. Revenue up 35% QoQ. New product features launching next month. Hiring 5 new roles across engineering and sales.",
    keyTakeaways: [
      { id: "kt-4", text: "Revenue up 35% quarter-over-quarter" },
      { id: "kt-5", text: "5 new roles opening across teams" },
      { id: "kt-6", text: "Product launch scheduled for next month" },
    ],
    transcript:
      "Sarah: Welcome everyone to our Q1 All Hands! I'm excited to share some incredible progress...\n\nWe've achieved 35% revenue growth this quarter, exceeding our targets...\n\nOn the product side, we're launching three major features next month...",
  },
  {
    id: "meeting-past-3",
    title: "1:1 with Manager",
    summary: "Career growth discussion and project feedback.",
    description:
      "Weekly 1:1 to discuss career development and current projects.",
    date: getToday(),
    startTime: "11:30 AM",
    duration: 30,
    platform: "meet",
    hasRecording: false,
    visibility: "private",
    attendees: [
      {
        id: "att-6",
        name: "Jennifer Wu",
        email: "jennifer.wu@company.com",
        initials: "JW",
        attended: true,
      },
    ],
    overview:
      "Discussed promotion timeline and upcoming opportunities. Feedback on recent project delivery was positive. Action item to prepare presentation for leadership review.",
    keyTakeaways: [
      { id: "kt-7", text: "Promotion review scheduled for Q2" },
      { id: "kt-8", text: "Prepare leadership presentation" },
      { id: "kt-9", text: "Continue mentoring junior developers" },
    ],
  },

  // ─── Up Next (Within next hour or so) ─────────────────────────────────────
  {
    id: "meeting-next",
    title: "Urgent: Server Incident Response",
    summary: "Post-mortem on the downtime experienced this morning.",
    description:
      "Post-mortem on the downtime experienced this morning. Need to define preventative measures.",
    date: getToday(),
    startTime: "2:00 PM",
    duration: 45,
    platform: "zoom",
    hasRecording: false,
    meetingUrl: "https://zoom.us/j/123456789",
    visibility: "shared",
    agenda: `## Incident Post-Mortem

### Timeline Review
- 6:15 AM: First alerts triggered
- 6:22 AM: On-call engineer paged
- 6:45 AM: Root cause identified
- 7:30 AM: Service restored

### Discussion Points
1. What went wrong?
2. How did we respond?
3. What can we improve?

### Proposed Actions
- Implement additional monitoring
- Update runbooks
- Schedule follow-up review`,
    attendees: [
      {
        id: "att-7",
        name: "DevOps",
        email: "devops@company.com",
        initials: "DO",
        attended: false,
      },
      {
        id: "att-8",
        name: "Alex",
        email: "alex@company.com",
        initials: "A",
        attended: false,
      },
      {
        id: "att-9",
        name: "CTO",
        email: "cto@company.com",
        initials: "C",
        attended: false,
      },
    ],
    overview: "",
    keyTakeaways: [],
  },

  // ─── Later Today ──────────────────────────────────────────────────────────
  {
    id: "meeting-later-1",
    title: "Design Review: Settings",
    summary: "Review new settings page designs with the product team.",
    description: "Design review session for the redesigned settings page.",
    date: getToday(),
    startTime: "4:00 PM",
    duration: 45,
    platform: "in-person",
    location: "Design Lab — 4th Floor",
    hasRecording: false,
    visibility: "shared",
    agenda: `## Design Review Agenda

### Screens to Review
1. Account Settings
2. Notification Preferences
3. Security Settings
4. Integrations Hub

### Key Questions
- Is the navigation intuitive?
- Are the forms accessible?
- Mobile responsiveness check`,
    attendees: [
      {
        id: "att-10",
        name: "Emily Zhang",
        email: "emily.zhang@company.com",
        initials: "EZ",
        attended: false,
      },
      {
        id: "att-11",
        name: "Design Team",
        email: "design@company.com",
        initials: "DT",
        attended: false,
      },
    ],
    overview: "",
    keyTakeaways: [],
  },

  // ─── Tomorrow ─────────────────────────────────────────────────────────────
  {
    id: "meeting-tomorrow-1",
    title: "Client Sync: Beta Feedback",
    summary: "Collect feedback from beta program participants.",
    description: "Monthly sync with beta customers to gather product feedback.",
    date: getTomorrow(),
    startTime: "10:00 AM",
    duration: 60,
    platform: "meet",
    hasRecording: false,
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    visibility: "shared",
    agenda: `## Beta Feedback Session

### Participants
- Acme Corp (Enterprise tier)
- StartupXYZ (Growth tier)
- TechCo (Enterprise tier)

### Discussion Topics
1. Feature satisfaction survey results
2. Pain points and blockers
3. Feature requests prioritization
4. Roadmap preview and feedback`,
    attendees: [
      {
        id: "att-12",
        name: "Lisa Wong",
        email: "lwong@acme.com",
        initials: "LW",
        attended: false,
      },
      {
        id: "att-13",
        name: "Customer Success",
        email: "cs@company.com",
        initials: "CS",
        attended: false,
      },
    ],
    overview: "",
    keyTakeaways: [],
  },
  {
    id: "meeting-tomorrow-2",
    title: "Team Lunch",
    summary: "Monthly team lunch and social time.",
    description: "Casual team lunch to celebrate recent wins.",
    date: getTomorrow(),
    startTime: "12:30 PM",
    duration: 90,
    platform: "in-person",
    location: "Nobu — Downtown",
    hasRecording: false,
    visibility: "shared",
    attendees: [
      {
        id: "att-14",
        name: "Engineering Team",
        email: "eng@company.com",
        initials: "ET",
        attended: false,
      },
    ],
    overview: "",
    keyTakeaways: [],
  },

  // ─── Later This Week ──────────────────────────────────────────────────────
  {
    id: "meeting-week-1",
    title: "Q2 Goals Workshop",
    summary: "Collaborative session to define Q2 OKRs.",
    description: "Full-day workshop to align on Q2 objectives and key results.",
    date: getDaysFromNow(2),
    startTime: "9:00 AM",
    duration: 180,
    platform: "in-person",
    location: "HQ — All Hands Room",
    hasRecording: false,
    visibility: "shared",
    agenda: `## Q2 Planning Workshop

### Morning Session (9am - 12pm)
- Review Q1 results
- Market landscape update
- Competitive analysis

### Lunch Break (12pm - 1pm)

### Afternoon Session (1pm - 3pm)
- OKR brainstorming
- Prioritization exercise
- Resource allocation`,
    attendees: [
      {
        id: "att-15",
        name: "Leadership Team",
        email: "leadership@company.com",
        initials: "LT",
        attended: false,
      },
    ],
    overview: "",
    keyTakeaways: [],
  },
  {
    id: "meeting-week-2",
    title: "Investor Update Call",
    summary: "Monthly update for board members and investors.",
    description: "Regular investor update on company progress and metrics.",
    date: getDaysFromNow(3),
    startTime: "3:00 PM",
    duration: 60,
    platform: "zoom",
    hasRecording: true,
    meetingUrl: "https://zoom.us/j/investor-update",
    visibility: "private",
    agenda: `## Investor Update

### Metrics Review
- MRR Growth
- Customer Acquisition
- Churn Analysis
- Runway Update

### Product Update
- Feature launches
- Roadmap preview

### Q&A Session`,
    attendees: [
      {
        id: "att-16",
        name: "Board Members",
        email: "board@company.com",
        initials: "BM",
        attended: false,
      },
      {
        id: "att-17",
        name: "CEO",
        email: "ceo@company.com",
        initials: "CE",
        attended: false,
      },
    ],
    overview: "",
    keyTakeaways: [],
  },

  // ─── Next Week ─────────────────────────────────────────────────────────────
  {
    id: "meeting-nextweek-1",
    title: "Sprint Planning",
    summary: "Plan sprint 24 goals and capacity.",
    description:
      "Bi-weekly sprint planning session with engineering and product.",
    date: getDaysFromNow(5),
    startTime: "10:00 AM",
    duration: 90,
    platform: "zoom",
    hasRecording: false,
    visibility: "shared",
    agenda: `## Sprint 24 Planning

### Velocity Review
- Sprint 23 completed: 42 points
- Carryover items: 3

### Backlog Grooming
- Priority P0 items
- Feature requests
- Tech debt

### Capacity Planning
- PTO scheduled
- Oncall rotations`,
    attendees: [
      {
        id: "att-sp-1",
        name: "Engineering Team",
        email: "eng@company.com",
        initials: "ET",
        attended: false,
      },
      {
        id: "att-sp-2",
        name: "Product Manager",
        email: "pm@company.com",
        initials: "PM",
        attended: false,
      },
    ],
    overview: "",
    keyTakeaways: [],
  },
  {
    id: "meeting-nextweek-2",
    title: "Architecture Review Board",
    summary: "Review new microservices proposal.",
    description: "Monthly ARB meeting to evaluate technical proposals.",
    date: getDaysFromNow(6),
    startTime: "2:00 PM",
    duration: 60,
    platform: "meet",
    hasRecording: false,
    visibility: "shared",
    attendees: [
      {
        id: "att-arb-1",
        name: "Tech Leads",
        email: "techleads@company.com",
        initials: "TL",
        attended: false,
      },
    ],
    overview: "",
    keyTakeaways: [],
  },
  {
    id: "meeting-nextweek-3",
    title: "Vendor Demo: DataDog",
    summary: "Evaluate DataDog for monitoring infrastructure.",
    description: "Demo session with DataDog sales team.",
    date: getDaysFromNow(7),
    startTime: "11:00 AM",
    duration: 45,
    platform: "zoom",
    hasRecording: false,
    meetingUrl: "https://zoom.us/j/datadog-demo",
    visibility: "shared",
    attendees: [
      {
        id: "att-dd-1",
        name: "DataDog Rep",
        email: "sales@datadog.com",
        initials: "DD",
        attended: false,
      },
      {
        id: "att-dd-2",
        name: "DevOps Team",
        email: "devops@company.com",
        initials: "DO",
        attended: false,
      },
    ],
    overview: "",
    keyTakeaways: [],
  },

  // ─── Future Meetings (2+ weeks out) ───────────────────────────────────────
  {
    id: "meeting-future-1",
    title: "Quarterly Business Review",
    summary: "Q1 results presentation to executive team.",
    description: "Present Q1 metrics and Q2 plans to leadership.",
    date: getDaysFromNow(10),
    startTime: "9:00 AM",
    duration: 120,
    platform: "in-person",
    location: "Executive Suite — 12th Floor",
    hasRecording: false,
    visibility: "private",
    attendees: [
      {
        id: "att-qbr-1",
        name: "Executive Team",
        email: "exec@company.com",
        initials: "EX",
        attended: false,
      },
    ],
    overview: "",
    keyTakeaways: [],
  },
  {
    id: "meeting-future-2",
    title: "Team Offsite Planning",
    summary: "Plan Q2 team offsite event.",
    description: "Coordinate logistics for the upcoming team offsite.",
    date: getDaysFromNow(12),
    startTime: "3:00 PM",
    duration: 30,
    platform: "meet",
    hasRecording: false,
    visibility: "shared",
    attendees: [
      {
        id: "att-off-1",
        name: "People Ops",
        email: "people@company.com",
        initials: "PO",
        attended: false,
      },
    ],
    overview: "",
    keyTakeaways: [],
  },

  // ─── Historical Meetings with CRM-linked Attendees ─────────────────────────
  {
    id: "meeting-crm-1",
    title: "Accenture Technical Deep Dive",
    summary: "Technical architecture review with Sarah Chen and her team.",
    description: "Deep dive into our API architecture and integration points.",
    date: getDaysFromNow(-2),
    startTime: "11:00 AM",
    duration: 60,
    platform: "zoom",
    hasRecording: true,
    recordingUrl: "https://zoom.us/rec/accenture-tech",
    visibility: "shared",
    attendees: [
      {
        id: "att-crm-1",
        name: "Sarah Chen",
        email: "sarah.chen@accenture.com",
        initials: "SC",
        attended: true,
        linkedContactId: "cli-1", // Links to Accenture VP
      },
      {
        id: "att-crm-2",
        name: "Technical Team",
        email: "tech@accenture.com",
        initials: "TT",
        attended: true,
      },
    ],
    overview:
      "Walked through our API architecture with Sarah's team. They're impressed with our scalability. Next step: security review.",
    keyTakeaways: [
      { id: "kt-crm-1", text: "API architecture approved by their team" },
      { id: "kt-crm-2", text: "Security review scheduled for next week" },
      { id: "kt-crm-3", text: "POC timeline: 3 weeks" },
    ],
  },
  {
    id: "meeting-crm-2",
    title: "JPMorgan Security Review",
    summary: "Security architecture walkthrough with James Morrison.",
    description: "Compliance and security discussion with JPM team.",
    date: getDaysFromNow(-3),
    startTime: "9:00 AM",
    duration: 90,
    platform: "teams",
    hasRecording: false,
    visibility: "private",
    attendees: [
      {
        id: "att-crm-3",
        name: "James Morrison",
        email: "james.morrison@jpmorgan.com",
        initials: "JM",
        attended: true,
        linkedContactId: "cli-2", // Links to JPMorgan MD
      },
      {
        id: "att-crm-4",
        name: "CISO Team",
        email: "security@jpmorgan.com",
        initials: "CT",
        attended: true,
      },
    ],
    overview:
      "Detailed security review with James and their CISO. They need penetration test results before proceeding.",
    keyTakeaways: [
      { id: "kt-crm-4", text: "Share pen test results within 48 hours" },
      { id: "kt-crm-5", text: "SOC2 Type II certification confirmed" },
      { id: "kt-crm-6", text: "Follow-up with legal team on DPA" },
    ],
  },
  {
    id: "meeting-crm-3",
    title: "Stripe Integration Planning",
    summary: "CLI improvements discussion with Priya Sharma.",
    description: "Planning session for developer experience improvements.",
    date: getDaysFromNow(-4),
    startTime: "3:00 PM",
    duration: 45,
    platform: "meet",
    hasRecording: false,
    visibility: "shared",
    attendees: [
      {
        id: "att-crm-5",
        name: "Priya Sharma",
        email: "priya@stripe.com",
        initials: "PS",
        attended: true,
        linkedContactId: "cli-3", // Links to Stripe Staff Engineer
      },
    ],
    overview:
      "Priya gave detailed feedback on our CLI. She loves the autocomplete but wants better error messages.",
    keyTakeaways: [
      { id: "kt-crm-7", text: "Improve CLI error message clarity" },
      { id: "kt-crm-8", text: "Add --verbose flag for debugging" },
      { id: "kt-crm-9", text: "Consider conference talk collaboration" },
    ],
  },

  // ─── Historical Meetings (for archive/history) ────────────────────────────
  {
    id: "meeting-hist-1",
    title: "A16Z Partner Sync",
    summary:
      "Follow-up on term sheet. Jon mentioned competing offers. Need counter-proposal by Dec 28.",
    description: "Investment discussion with A16Z partner.",
    date: getDaysFromNow(-3),
    startTime: "2:00 PM",
    duration: 30,
    platform: "zoom",
    hasRecording: true,
    recordingUrl: "https://zoom.us/rec/123",
    visibility: "shared",
    attendees: [
      {
        id: "att-18",
        name: "Jon Michaels",
        email: "jon@a16z.com",
        initials: "JM",
        attended: true,
      },
      {
        id: "att-19",
        name: "Emily Zhang",
        email: "emily.zhang@company.com",
        initials: "EZ",
        attended: true,
      },
    ],
    overview:
      "Jon expressed strong interest in leading the round but mentioned they're evaluating 2-3 competing deals this quarter. He emphasized the need for a compelling counter-proposal that addresses their concerns about our GTM timeline.",
    keyTakeaways: [
      { id: "kt-10", text: "Send updated financial projections" },
      { id: "kt-11", text: "Prepare counter-proposal addressing GTM concerns" },
      { id: "kt-12", text: "Schedule follow-up call" },
    ],
    transcript:
      "Jon: Thanks for hopping on. I wanted to give you a quick update on where we stand...\n\nEmily: Of course, we appreciate the transparency...\n\nJon: So we've been evaluating a few deals this quarter, and yours is definitely in our top tier.",
  },
  {
    id: "meeting-hist-2",
    title: "Customer Success Review",
    summary:
      "Reviewed Q4 churn data. 3 accounts at risk need immediate attention.",
    description: "Quarterly review of customer health metrics.",
    date: getDaysFromNow(-5),
    startTime: "2:00 PM",
    duration: 60,
    platform: "meet",
    hasRecording: false,
    visibility: "shared",
    attendees: [
      {
        id: "att-20",
        name: "David Kim",
        email: "david.kim@company.com",
        initials: "DK",
        attended: true,
      },
      {
        id: "att-21",
        name: "Rachel Torres",
        email: "rachel.t@company.com",
        initials: "RT",
        attended: true,
      },
    ],
    overview:
      "Deep dive into Q4 customer health metrics. Identified 3 enterprise accounts showing disengagement patterns. Action plan created for each.",
    keyTakeaways: [
      { id: "kt-13", text: "Schedule executive calls with at-risk accounts" },
      { id: "kt-14", text: "Implement early warning system for churn signals" },
      { id: "kt-15", text: "Review pricing for retention offers" },
    ],
  },
];
