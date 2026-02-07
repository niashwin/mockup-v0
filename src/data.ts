import { Alert, Commitment, MeetingBrief, Report, CollaborationThread, RelationshipAlert, Contact, Company } from './types';

// ... existing interfaces ...

export type SwimlaneStatus = 'blocked' | 'on-track' | 'delayed' | 'finished';

export interface SwimlaneMeta {
  id: string;
  name: string;
  owner: string;
  lastUpdated: string;
  description: string;
  status: SwimlaneStatus;
  summary: string; // Brief summary of movements
}

export interface TimelineItem {
  id: string;
  type: 'meeting' | 'decision' | 'commitment' | 'document' | 'alert';
  title: string;
  timestamp: string;
  actor: string;
  summary: string;
  evidence?: { type: string; url: string; preview: string }[];
  criticality?: 'normal' | 'urgent' | 'critical';
  linkedEventId?: string; // ID of a related event (e.g. start -> finish)
  swimlaneId?: string; // ID of the swimlane it belongs to
}

// ... existing data ...

export const swimlanesList: SwimlaneMeta[] = [
  { 
    id: 'sl1', 
    name: 'Q3 Product Strategy', 
    owner: 'Alex Lewis', 
    lastUpdated: '10m ago', 
    description: 'Tracking key decisions and alerts for the Q3 roadmap.', 
    status: 'on-track',
    summary: 'Scope frozen. Marketing plan updated. 2 new risks identified but mitigated.'
  },
  { 
    id: 'sl2', 
    name: 'Enterprise Migration', 
    owner: 'Sarah Chen', 
    lastUpdated: '2h ago', 
    description: 'Timeline of the on-prem to cloud migration project.', 
    status: 'delayed',
    summary: 'Delayed by 2 weeks due to legacy DB constraints. New target: mid-March.'
  },
  { 
    id: 'sl3', 
    name: 'Incident Response: Feb 01', 
    owner: 'DevOps Team', 
    lastUpdated: 'Yesterday', 
    description: 'Post-mortem timeline for the latency spike.', 
    status: 'finished',
    summary: 'Root cause identified (split-brain). Patch deployed. Incident closed.'
  },
  { 
    id: 'sl4', 
    name: 'Partner Integration: Alpha', 
    owner: 'Business Dev', 
    lastUpdated: '3 days ago', 
    description: 'Joint venture milestones and legal reviews.', 
    status: 'blocked',
    summary: 'Blocked on legal review from partner side. Escalation email sent.'
  },
  { 
    id: 'sl5', 
    name: 'Hiring & Talent', 
    owner: 'Justin Cheng & Andrey Starenky', 
    lastUpdated: 'Today', 
    description: 'Chronological look at Sentra\'s hiring activities, strategic decisions, and team growth.', 
    status: 'on-track',
    summary: 'Rhys accepted offer. Kristina Beaman hired. Engineering bandwidth increased by 3x.'
  },
  {
    id: 'sl6',
    name: 'Customer Expansion',
    owner: 'Customer Success',
    lastUpdated: '2h ago',
    description: 'Tracking expansion opportunities, renewals, and account health.',
    status: 'on-track',
    summary: 'Northstar upsell in negotiation. Two renewals at risk flagged.'
  },
  {
    id: 'sl7',
    name: 'Security & Compliance',
    owner: 'Security',
    lastUpdated: 'Today',
    description: 'Audit readiness, compliance milestones, and security initiatives.',
    status: 'delayed',
    summary: 'SOC 2 evidence collection behind by 1 week. Remediation ongoing.'
  },
  {
    id: 'sl8',
    name: 'Platform Reliability',
    owner: 'Platform Team',
    lastUpdated: '30m ago',
    description: 'Reliability, incident response, and infrastructure improvements.',
    status: 'on-track',
    summary: 'p95 latency improved 18%. Error budget healthy.'
  }
];

// Helper to generate dates relative to now
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Expanded Timeline Data (50+ items)
export const timelineData: TimelineItem[] = [
  // --- HIRING SWIMLANE EVENTS (sl5) ---
  {
    id: 'tl-h1',
    type: 'decision',
    title: 'ML Engineering Progress',
    timestamp: 'Jan 8',
    actor: 'Andrey Starenky',
    summary: 'Confirmed progress on ML roles; one candidate moving to offer, another starting work trials. Note: Designer recruitment lagging behind engineering.',
    swimlaneId: 'sl5',
    evidence: [{ type: 'Slack', url: '#hiring', preview: 'ML Pipeline update' }]
  },
  {
    id: 'tl-h2',
    type: 'decision',
    title: 'Onboarded: Bill & Anhi',
    timestamp: 'Jan 9',
    actor: 'Jae Park',
    summary: 'Significant 3x increase in engineering bandwidth following onboarding of Bill and Anhi. High interview volume reported.',
    swimlaneId: 'sl5',
    evidence: [{ type: 'Notion', url: 'Team Roster', preview: 'Added 2 New Engineers' }]
  },
  {
    id: 'tl-h3',
    type: 'decision',
    title: 'Offer Stage Strategy',
    timestamp: 'Jan 12',
    actor: 'Hiring Team',
    summary: 'Personalized delivery strategy for candidates outlined. Hiring pace intentionally slowed to focus on quality.',
    swimlaneId: 'sl5'
  },
  {
    id: 'tl-h4',
    type: 'commitment',
    title: 'Culture-First Priority',
    timestamp: 'Jan 16',
    actor: 'Ashwin Gopinath',
    summary: 'Hiring process now prioritizes excitement for the problem over coding assignments. Justin Cheng to communicate results next week.',
    swimlaneId: 'sl5'
  },
  {
    id: 'tl-h5',
    type: 'decision',
    title: 'Rhys Offer Intent',
    timestamp: 'Jan 20',
    actor: 'Andrey Starenky',
    summary: 'Formally informed Rhys of intent to make an offer. Decision followed pros/cons weighing with Jonathan Qu.',
    swimlaneId: 'sl5'
  },
  {
    id: 'tl-h6',
    type: 'decision',
    title: 'Offer Accepted: Rhys',
    timestamp: 'Jan 21',
    actor: 'Justin Cheng',
    summary: 'Rhys accepted offer: 230k + 0.2%. Pending background checks (strong likelihood confirmed Jan 17).',
    swimlaneId: 'sl5',
    criticality: 'urgent'
  },
  {
    id: 'tl-h7',
    type: 'meeting',
    title: 'Ashby & Recruiting Review',
    timestamp: 'Jan 27',
    actor: 'Justin Cheng',
    summary: 'Managing candidates in Ashby. Front-end and infra roles supplied well by external recruiters. Motivation-focused questions shared.',
    swimlaneId: 'sl5'
  },
  {
    id: 'tl-h8',
    type: 'decision',
    title: 'Phanender Advances',
    timestamp: 'Jan 28',
    actor: 'Andrey Starenky',
    summary: 'Phanender Yedla advancing to next round. New front-end focused interview ideas discussed. Future plans tied to financing.',
    swimlaneId: 'sl5'
  },
  {
    id: 'tl-h11',
    type: 'alert',
    title: 'Recruiter Outreach Surge',
    timestamp: 'Jan 30',
    actor: 'Sentra Intelligence',
    summary: 'Significant surge in LinkedIn/Email outreach observed following funding announcement. Team growth interest peaking.',
    swimlaneId: 'sl5',
    criticality: 'info'
  },
  {
    id: 'tl-h13',
    type: 'decision',
    title: 'Phanender: Green Light',
    timestamp: 'Jan 31',
    actor: 'Andrey Starenky',
    summary: 'Positive feedback for candidate Phanender Yedla. Discussing next steps for frontend process. Internal reminder: Avoid in-depth competitor discussions.',
    swimlaneId: 'sl5',
    criticality: 'urgent'
  },
  {
    id: 'tl-h9',
    type: 'decision',
    title: 'Hired: Kristina Beaman',
    timestamp: 'Jan 31',
    actor: 'Operations Team',
    summary: 'Kristina Beaman joins as Operations Assistant. Team discussed protecting insights from competitors during hiring.',
    swimlaneId: 'sl5'
  },
  {
    id: 'tl-h10',
    type: 'commitment',
    title: 'JD Sent: Tommy Potter',
    timestamp: 'Feb 1',
    actor: 'Jae Park',
    summary: 'Created task to send the front end engineer job description to Tommy Potter after Jae\'s meeting.',
    swimlaneId: 'sl5'
  },
  {
    id: 'tl-h12',
    type: 'commitment',
    title: 'Tommy Potter JD: Done',
    timestamp: 'Today, 9:00 AM',
    actor: 'Jae Park',
    summary: 'Sent JD completed. Active sourcing for full-stack frontend engineer remains a high priority.',
    swimlaneId: 'sl5',
    criticality: 'normal'
  },
  // --- TODAY / YESTERDAY (Recent Activity) ---
  {
    id: 'tl-1',
    type: 'decision',
    title: 'Scope Freeze Agreed',
    timestamp: 'Today, 10:30 AM',
    actor: 'Product Leadership',
    summary: 'Q3 scope is locked. Any new feature requests must go through change control board.',
    swimlaneId: 'sl1',
    evidence: [
      { type: 'Slack', url: '#product-strategy', preview: 'Slack thread: "Scope is officially locked..."' },
      { type: 'Notion', url: 'Q3 Spec', preview: 'Spec status changed to "Locked"' }
    ],
    criticality: 'urgent',
    linkedEventId: 'tl-38' // Linked to Onboarding Flow Spec (conceptually)
  },
  {
    id: 'tl-2',
    type: 'meeting',
    title: 'Weekly Sync: Blockers',
    timestamp: 'Yesterday, 2:00 PM',
    actor: 'Core Team',
    summary: 'Discussed marketing blockers. Design team committed to delivering assets by Friday.',
    swimlaneId: 'sl1',
    evidence: [
      { type: 'Zoom', url: 'Recording', preview: 'Transcript snippet: "We can hit the Friday deadline..."' }
    ],
    linkedEventId: 'tl-4' // Links to Budget Approval (follow-up action)
  },
  {
    id: 'tl-3',
    type: 'document',
    title: 'Marketing Plan Updated',
    timestamp: 'Yesterday, 11:15 AM',
    actor: 'Jordan (Marketing)',
    summary: 'Updated the GTM strategy to include the new influencer campaign channels.',
    swimlaneId: 'sl1',
    evidence: [
      { type: 'Google Doc', url: 'GTM Q3', preview: 'Version 2.1 published' }
    ],
    linkedEventId: 'tl-23' // Linked to Brand Guidelines
  },
  
  // --- LAST WEEK ---
  {
    id: 'tl-4',
    type: 'commitment',
    title: 'Budget Approval Required',
    timestamp: 'Feb 1, 4:00 PM',
    actor: 'Finance Bot',
    summary: 'New budget request for $50k ad spend flagged for review.',
    swimlaneId: 'sl1',
    evidence: [
      { type: 'Jira', url: 'FIN-293', preview: 'Ticket created: Ad Spend Approval' }
    ],
    criticality: 'critical',
    linkedEventId: 'tl-3' // Links to Marketing Plan that triggered this
  },
  {
    id: 'tl-5',
    type: 'meeting',
    title: 'Vendor Demo: CloudSearch',
    timestamp: 'Jan 30',
    actor: 'Alex Lewis',
    summary: 'Evaluated CloudSearch as a potential replacement for the legacy search backend.',
    swimlaneId: 'sl2',
    evidence: [{ type: 'Zoom', url: 'Recording', preview: 'Vendor demonstrated 100ms latency' }],
    linkedEventId: 'tl-6'
  },
  {
    id: 'tl-6',
    type: 'decision',
    title: 'Search Vendor Selection',
    timestamp: 'Jan 29',
    actor: 'Engineering Lead',
    summary: 'Decided to stick with ElasticSearch for now due to migration costs.',
    swimlaneId: 'sl2',
    evidence: [{ type: 'Confluence', url: 'Decision Log', preview: 'Keep ElasticSearch for Q3' }]
  },
  {
    id: 'tl-7',
    type: 'document',
    title: 'Q2 Retrospective Published',
    timestamp: 'Jan 28',
    actor: 'Agile Coach',
    summary: 'Full report on Q2 velocity and bottlenecks. Key takeaway: too many context switches.',
    swimlaneId: 'sl1',
    evidence: [{ type: 'Notion', url: 'Q2 Retro', preview: '3 Key Action Items identified' }],
    linkedEventId: 'tl-10' // Led to decision to kill Stories feature
  },

  // --- JANUARY (Weeks 1-3) ---
  {
    id: 'tl-8',
    type: 'commitment',
    title: 'Security Audit Sign-off',
    timestamp: 'Jan 24',
    actor: 'CISO',
    summary: 'Final approval for the Q1 security audit. Zero critical vulnerabilities found.',
    swimlaneId: 'sl2',
    evidence: [{ type: 'PDF', url: 'Audit Report', preview: 'Signed by CISO' }],
    criticality: 'urgent'
  },
  {
    id: 'tl-9',
    type: 'meeting',
    title: 'Design Review: Mobile Nav',
    timestamp: 'Jan 22',
    actor: 'Design Team',
    summary: 'Reviewing the new bottom sheet interaction patterns.',
    swimlaneId: 'sl1',
    evidence: [{ type: 'Figma', url: 'Mobile Kit', preview: 'Comments resolved on Frame 3' }],
    linkedEventId: 'tl-20' // Linked to Pivot to Vertical Navigation
  },
  {
    id: 'tl-10',
    type: 'decision',
    title: 'Kill Feature: "Stories"',
    timestamp: 'Jan 20',
    actor: 'Product VP',
    summary: 'The "Stories" feature has low adoption (2%). Deprecating in Q3.',
    swimlaneId: 'sl1',
    evidence: [{ type: 'Email', url: 'Announcement', preview: 'Subject: Sunsetting Stories Feature' }]
  },
  {
    id: 'tl-11',
    type: 'document',
    title: 'API v3 Spec Draft',
    timestamp: 'Jan 18',
    actor: 'Backend Team',
    summary: 'Initial draft of the GraphQL API schema.',
    swimlaneId: 'sl2',
    evidence: [{ type: 'GitHub', url: 'PR #4092', preview: 'schema.graphql added' }]
  },
  {
    id: 'tl-12',
    type: 'meeting',
    title: 'All Hands: Yearly Kickoff',
    timestamp: 'Jan 15',
    actor: 'CEO',
    summary: 'Company goals for 2026: Expansion into Enterprise market.',
    evidence: [{ type: 'SlideDeck', url: 'Kickoff 2026', preview: 'Slide 10: The Enterprise Opportunity' }],
    criticality: 'normal'
  },

  // --- DECEMBER 2025 ---
  {
    id: 'tl-13',
    type: 'decision',
    title: 'Holiday Freeze Dates',
    timestamp: 'Dec 20',
    actor: 'CTO',
    summary: 'No deployments allowed between Dec 22 and Jan 2.',
    swimlaneId: 'sl2',
    evidence: [{ type: 'Slack', url: '#announcements', preview: '@channel Code freeze starts Friday' }]
  },
  {
    id: 'tl-14',
    type: 'commitment',
    title: 'Log4j Patching',
    timestamp: 'Dec 18',
    actor: 'DevOps',
    summary: 'Critical vulnerability patched across all clusters.',
    swimlaneId: 'sl2',
    evidence: [{ type: 'Jira', url: 'SEC-991', preview: 'Status: Done' }],
    criticality: 'critical'
  },
  {
    id: 'tl-15',
    type: 'document',
    title: '2026 Hiring Plan',
    timestamp: 'Dec 15',
    actor: 'VP Engineering',
    summary: 'Budget approved for 12 new engineering roles.',
    swimlaneId: 'sl5',
    evidence: [{ type: 'Google Sheet', url: 'Headcount 2026', preview: 'Approved by Finance' }]
  },
  {
    id: 'tl-16',
    type: 'meeting',
    title: 'Offsite Planning',
    timestamp: 'Dec 10',
    actor: 'Ops Team',
    summary: 'Venue selected for the Q1 leadership offsite.',
    swimlaneId: 'sl1'
  },

  // --- NOVEMBER 2025 ---
  {
    id: 'tl-17',
    type: 'decision',
    title: 'Adoption of React 19',
    timestamp: 'Nov 28',
    actor: 'Frontend Guild',
    summary: 'Technical consensus to upgrade to React 19 in Q1.',
    swimlaneId: 'sl2',
    evidence: [{ type: 'RFC', url: 'RFC-019', preview: 'Status: Accepted' }]
  },
  {
    id: 'tl-18',
    type: 'meeting',
    title: 'Black Friday Prep',
    timestamp: 'Nov 20',
    actor: 'Infra Team',
    summary: 'Load testing results reviewed. Clusters scaled to 50 nodes.',
    swimlaneId: 'sl2'
  },
  {
    id: 'tl-19',
    type: 'document',
    title: 'Incident Report #882',
    timestamp: 'Nov 15',
    actor: 'SRE OnCall',
    summary: 'Post-mortem for the payment gateway timeout.',
    swimlaneId: 'sl3',
    evidence: [{ type: 'Notion', url: 'Incident #882', preview: 'Root cause: 3rd party API rate limit' }],
    criticality: 'urgent'
  },

  // --- OCTOBER 2025 ---
  {
    id: 'tl-20',
    type: 'decision',
    title: 'Pivot to Vertical Navigation',
    timestamp: 'Oct 25',
    actor: 'Design Lead',
    summary: 'Moving from top-nav to side-nav to accommodate more modules.',
    swimlaneId: 'sl1',
    evidence: [{ type: 'Figma', url: 'Nav Study', preview: 'User testing favored Layout B' }]
  },
  {
    id: 'tl-21',
    type: 'commitment',
    title: 'WCAG 2.1 Compliance',
    timestamp: 'Oct 10',
    actor: 'Product Owner',
    summary: 'Commitment to reach AA compliance by end of year.',
    swimlaneId: 'sl1'
  },
  {
    id: 'tl-22',
    type: 'meeting',
    title: 'Q4 Strategy Review',
    timestamp: 'Oct 01',
    actor: 'Leadership',
    summary: 'Doubling down on mobile engagement.',
    swimlaneId: 'sl1'
  },

  // --- OLDER HISTORY (Q2-Q3 2025) ---
  {
    id: 'tl-23',
    type: 'document',
    title: 'Brand Guidelines v2',
    timestamp: 'Sep 15, 2025',
    actor: 'Marketing',
    summary: 'New color palette and typography standards released.',
    swimlaneId: 'sl1'
  },
  {
    id: 'tl-24',
    type: 'decision',
    title: 'Office Move',
    timestamp: 'Aug 30, 2025',
    actor: 'CEO',
    summary: 'Signed lease for new downtown HQ.',
    swimlaneId: 'sl4'
  },
  {
    id: 'tl-25',
    type: 'meeting',
    title: 'Summer Intern Demos',
    timestamp: 'Aug 20, 2025',
    actor: 'Engineering',
    summary: 'Interns presented their final projects.',
    swimlaneId: 'sl5'
  },
  {
    id: 'tl-26',
    type: 'commitment',
    title: 'GDPR Audit',
    timestamp: 'Jul 15, 2025',
    actor: 'Legal',
    summary: 'Started the annual data privacy compliance audit.',
    swimlaneId: 'sl4'
  },
  {
    id: 'tl-27',
    type: 'document',
    title: 'Series B Pitch Deck',
    timestamp: 'Jun 10, 2025',
    actor: 'Founders',
    summary: 'Final version of the deck for investors.',
    swimlaneId: 'sl4'
  },
  {
    id: 'tl-28',
    type: 'decision',
    title: 'Go vs Node.js',
    timestamp: 'May 22, 2025',
    actor: 'Architecture Board',
    summary: 'Selected Go for high-throughput microservices.',
    swimlaneId: 'sl2'
  },
  {
    id: 'tl-29',
    type: 'meeting',
    title: 'User Conference 2025',
    timestamp: 'May 05, 2025',
    actor: 'Events Team',
    summary: 'Post-event debrief. NPS score of 72.',
    swimlaneId: 'sl4'
  },
  
  // --- FILLER ITEMS TO REACH ~50 ---
  { id: 'tl-30', type: 'meeting', title: 'Weekly Sync', timestamp: 'Sep 08, 2025', actor: 'Core Team', summary: 'Routine status check.', swimlaneId: 'sl1' },
  { id: 'tl-31', type: 'meeting', title: 'Weekly Sync', timestamp: 'Sep 01, 2025', actor: 'Core Team', summary: 'Routine status check.', swimlaneId: 'sl1' },
  { id: 'tl-32', type: 'meeting', title: 'Weekly Sync', timestamp: 'Aug 25, 2025', actor: 'Core Team', summary: 'Routine status check.', swimlaneId: 'sl1' },
  { id: 'tl-33', type: 'document', title: 'Competitor Analysis: Acme', timestamp: 'Aug 15, 2025', actor: 'Strategy', summary: 'Deep dive into Acme Corp pricing.', swimlaneId: 'sl4' },
  { id: 'tl-34', type: 'alert', title: 'Downtime: 5 mins', timestamp: 'Aug 12, 2025', actor: 'System', summary: 'Brief outage in US-East.', criticality: 'urgent', swimlaneId: 'sl3' },
  { id: 'tl-35', type: 'decision', title: 'Approve Vendor: Stripe', timestamp: 'Jul 30, 2025', actor: 'Finance', summary: 'Signed contract with Stripe.', swimlaneId: 'sl4' },
  { id: 'tl-36', type: 'commitment', title: 'Release Mobile Beta', timestamp: 'Jul 20, 2025', actor: 'Product', summary: 'Target date set.', swimlaneId: 'sl1' },
  { id: 'tl-37', type: 'meeting', title: 'Design Critique', timestamp: 'Jul 10, 2025', actor: 'Design', summary: 'Feedback on onboarding flow.', linkedEventId: 'tl-38', swimlaneId: 'sl1' },
  { id: 'tl-38', type: 'document', title: 'Onboarding Flow Spec', timestamp: 'Jul 05, 2025', actor: 'Product', summary: 'Detailed wireframes.', swimlaneId: 'sl1' },
  { id: 'tl-39', type: 'decision', title: 'Hire: Senior PM', timestamp: 'Jun 25, 2025', actor: 'HR', summary: 'Offer letter sent.', swimlaneId: 'sl5' },
  { id: 'tl-40', type: 'meeting', title: 'Town Hall', timestamp: 'Jun 15, 2025', actor: 'CEO', summary: 'Q2 Business Update.', swimlaneId: 'sl1' },
  { id: 'tl-41', type: 'document', title: 'Q1 Financials', timestamp: 'May 15, 2025', actor: 'Finance', summary: 'Quarterly close report.', swimlaneId: 'sl4' },
  { id: 'tl-42', type: 'commitment', title: 'Reduce Churn to 2%', timestamp: 'May 01, 2025', actor: 'Customer Success', summary: 'OKR for Q2.', swimlaneId: 'sl1' },
  { id: 'tl-43', type: 'meeting', title: 'Sales Kickoff', timestamp: 'Apr 20, 2025', actor: 'Sales', summary: 'Training on new features.', swimlaneId: 'sl4' },
  { id: 'tl-44', type: 'decision', title: 'Change Health Provider', timestamp: 'Apr 10, 2025', actor: 'HR', summary: 'Switching to BlueCross.', swimlaneId: 'sl4' },
  { id: 'tl-45', type: 'document', title: 'Employee Handbook v3', timestamp: 'Apr 01, 2025', actor: 'People Ops', summary: 'Updated policies.', swimlaneId: 'sl4' },
  { id: 'tl-46', type: 'meeting', title: 'Board Meeting', timestamp: 'Mar 15, 2025', actor: 'Board', summary: 'Quarterly review.', swimlaneId: 'sl1' },
  { id: 'tl-47', type: 'commitment', title: 'Launch in EU', timestamp: 'Mar 01, 2025', actor: 'Legal', summary: 'Targeting Q3 launch.', swimlaneId: 'sl4' },
  { id: 'tl-48', type: 'decision', title: 'Pricing Tier Update', timestamp: 'Feb 15, 2025', actor: 'Product', summary: 'Adding Enterprise Tier.', swimlaneId: 'sl1' },
  { id: 'tl-49', type: 'document', title: 'User Research: Enterprise', timestamp: 'Feb 01, 2025', actor: 'UX Research', summary: 'Interviews with 10 CTOs.', swimlaneId: 'sl1' },
  { id: 'tl-50', type: 'meeting', title: 'Project Kickoff: Zero', timestamp: 'Jan 10, 2025', actor: 'Founders', summary: 'Start of the rewrite.', swimlaneId: 'sl2' },
  // --- CUSTOMER EXPANSION SWIMLANE (sl6) - Full Story Arc ---
  {
    id: 'tl-ce-1',
    type: 'meeting',
    title: 'Northstar: Initial Discovery',
    timestamp: 'Dec 15, 2025',
    actor: 'Sales',
    summary: 'First call with Northstar CTO. Strong interest in enterprise features. Budget cycle starts Q1.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-2'
  },
  {
    id: 'tl-ce-2',
    type: 'document',
    title: 'Northstar: Requirements Doc',
    timestamp: 'Dec 22, 2025',
    actor: 'Solutions Engineer',
    summary: 'Documented Northstar requirements: SSO, audit logs, custom retention policies.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-3',
    evidence: [{ type: 'Notion', url: 'northstar-reqs', preview: '12 requirements mapped' }]
  },
  {
    id: 'tl-ce-3',
    type: 'commitment',
    title: 'Northstar: POC Kickoff',
    timestamp: 'Jan 8, 2026',
    actor: 'CS Lead',
    summary: 'Started 30-day proof of concept. Success criteria: integrate with 3 data sources.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-4',
    criticality: 'urgent'
  },
  {
    id: 'tl-ce-4',
    type: 'alert',
    title: 'Northstar: Integration Blocker',
    timestamp: 'Jan 15, 2026',
    actor: 'Engineering',
    summary: 'Salesforce connector failing for Northstar. Missing OAuth scope.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-5',
    criticality: 'critical'
  },
  {
    id: 'tl-ce-5',
    type: 'decision',
    title: 'Northstar: Hotfix Deployed',
    timestamp: 'Jan 17, 2026',
    actor: 'Platform',
    summary: 'OAuth scope fix deployed. POC back on track.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-6'
  },
  {
    id: 'tl-51',
    type: 'meeting',
    title: 'Renewal Review: Lumen',
    timestamp: 'Jan 20, 2026',
    actor: 'CS',
    summary: 'Renewal health check and expansion plan. CTO wants ROI data.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-lumen-2'
  },
  {
    id: 'tl-ce-lumen-2',
    type: 'document',
    title: 'Lumen: ROI Analysis',
    timestamp: 'Jan 24, 2026',
    actor: 'CS',
    summary: 'Prepared ROI deck showing 4.2x value. Ready for exec presentation.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-lumen-3',
    evidence: [{ type: 'Slides', url: 'lumen-roi', preview: 'ROI: 4.2x in 6 months' }]
  },
  {
    id: 'tl-52',
    type: 'decision',
    title: 'Expansion Playbook v2',
    timestamp: 'Jan 25, 2026',
    actor: 'CS Ops',
    summary: 'Standardized expansion motion by segment. New templates for enterprise upsells.',
    swimlaneId: 'sl6',
    evidence: [{ type: 'Notion', url: 'playbook-v2', preview: 'Expansion playbook updated' }]
  },
  {
    id: 'tl-ce-6',
    type: 'meeting',
    title: 'Northstar: POC Review',
    timestamp: 'Jan 28, 2026',
    actor: 'CS Lead',
    summary: 'POC exceeded expectations. All 3 integrations working. CTO impressed.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-7',
    criticality: 'urgent'
  },
  {
    id: 'tl-ce-lumen-3',
    type: 'meeting',
    title: 'Lumen: Exec Presentation',
    timestamp: 'Jan 29, 2026',
    actor: 'Sales',
    summary: 'Presented ROI to Lumen CFO. Positive reception. Asked for security review.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-lumen-4'
  },
  {
    id: 'tl-ce-beacon-1',
    type: 'meeting',
    title: 'Beacon: Expansion Discovery',
    timestamp: 'Jan 30, 2026',
    actor: 'CS',
    summary: 'Beacon wants to add 50 seats. Security review required before procurement.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-beacon-2'
  },
  {
    id: 'tl-ce-7',
    type: 'commitment',
    title: 'Northstar: Contract Negotiation',
    timestamp: 'Feb 1, 2026',
    actor: 'Sales',
    summary: 'Legal review started. Target close: Feb 15. Deal size: $120K ARR.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-8',
    criticality: 'urgent',
    evidence: [{ type: 'Salesforce', url: 'northstar-opp', preview: '$120K ARR opportunity' }]
  },
  {
    id: 'tl-ce-lumen-4',
    type: 'document',
    title: 'Lumen: Security Questionnaire',
    timestamp: 'Feb 2, 2026',
    actor: 'Security',
    summary: 'Completed 200-question security questionnaire for Lumen.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-lumen-5',
    evidence: [{ type: 'Doc', url: 'lumen-security', preview: '200 questions answered' }]
  },
  {
    id: 'tl-ce-beacon-2',
    type: 'alert',
    title: 'Beacon: Security Review Pending',
    timestamp: 'Feb 3, 2026',
    actor: 'Security',
    summary: 'Beacon security review queued. 5-day SLA. Blocking expansion.',
    swimlaneId: 'sl6',
    linkedEventId: 'tl-ce-beacon-3',
    criticality: 'warning'
  },
  {
    id: 'tl-ce-8',
    type: 'decision',
    title: 'Northstar: Legal Approved',
    timestamp: 'Today, 9:00 AM',
    actor: 'Legal',
    summary: 'Contract terms approved. Ready for signature. $120K ARR confirmed.',
    swimlaneId: 'sl6',
    criticality: 'urgent'
  },
  {
    id: 'tl-ce-lumen-5',
    type: 'commitment',
    title: 'Lumen: Exec Alignment Call',
    timestamp: 'Feb 6, 2026',
    actor: 'Sales',
    summary: 'Scheduled call with Lumen CEO to close expansion. $65K upsell.',
    swimlaneId: 'sl6',
    criticality: 'urgent'
  },
  {
    id: 'tl-ce-beacon-3',
    type: 'meeting',
    title: 'Beacon: Security Review Complete',
    timestamp: 'Feb 8, 2026',
    actor: 'Security',
    summary: 'Security review passed. Procurement can proceed. $45K expansion.',
    swimlaneId: 'sl6'
  },

  // --- SECURITY & COMPLIANCE SWIMLANE (sl7) - Full Audit Arc ---
  {
    id: 'tl-sec-1',
    type: 'commitment',
    title: 'SOC 2 Audit Kickoff',
    timestamp: 'Dec 1, 2025',
    actor: 'Security Lead',
    summary: 'Engaged auditors for SOC 2 Type II. 90-day observation period starts.',
    swimlaneId: 'sl7',
    linkedEventId: 'tl-sec-2',
    evidence: [{ type: 'Contract', url: 'soc2-engagement', preview: 'Audit engagement signed' }]
  },
  {
    id: 'tl-sec-2',
    type: 'document',
    title: 'Control Matrix Published',
    timestamp: 'Dec 10, 2025',
    actor: 'Security',
    summary: 'Mapped 85 controls to evidence sources. Assigned owners.',
    swimlaneId: 'sl7',
    linkedEventId: 'tl-sec-3',
    evidence: [{ type: 'Notion', url: 'control-matrix', preview: '85 controls mapped' }]
  },
  {
    id: 'tl-sec-3',
    type: 'meeting',
    title: 'Access Review Training',
    timestamp: 'Dec 18, 2025',
    actor: 'Security',
    summary: 'Trained all managers on quarterly access review process.',
    swimlaneId: 'sl7',
    linkedEventId: 'tl-sec-4'
  },
  {
    id: 'tl-sec-4',
    type: 'commitment',
    title: 'Q4 Access Reviews',
    timestamp: 'Jan 5, 2026',
    actor: 'All Managers',
    summary: 'Q4 access reviews due Jan 15. 12 teams participating.',
    swimlaneId: 'sl7',
    linkedEventId: 'tl-sec-5',
    criticality: 'urgent'
  },
  {
    id: 'tl-sec-5',
    type: 'alert',
    title: 'Access Review: 4 Teams Behind',
    timestamp: 'Jan 12, 2026',
    actor: 'Security',
    summary: '4 teams have not started access reviews. Deadline in 3 days.',
    swimlaneId: 'sl7',
    linkedEventId: 'tl-sec-6',
    criticality: 'critical'
  },
  {
    id: 'tl-sec-6',
    type: 'decision',
    title: 'Access Review Extension',
    timestamp: 'Jan 14, 2026',
    actor: 'CISO',
    summary: 'Extended deadline to Jan 20. Escalated to department heads.',
    swimlaneId: 'sl7',
    linkedEventId: 'tl-sec-7'
  },
  {
    id: 'tl-sec-7',
    type: 'commitment',
    title: 'Access Reviews Complete',
    timestamp: 'Jan 20, 2026',
    actor: 'Security',
    summary: 'All 12 teams completed reviews. 23 access changes made.',
    swimlaneId: 'sl7',
    linkedEventId: 'tl-53',
    evidence: [{ type: 'Report', url: 'access-review-q4', preview: '23 changes implemented' }]
  },
  {
    id: 'tl-53',
    type: 'alert',
    title: 'Evidence Collection Gap',
    timestamp: 'Jan 28, 2026',
    actor: 'Security',
    summary: 'Evidence collection for change management behind schedule. 15 tickets missing.',
    swimlaneId: 'sl7',
    linkedEventId: 'tl-54',
    criticality: 'warning'
  },
  {
    id: 'tl-54',
    type: 'document',
    title: 'SOC 2 Evidence Pack v1',
    timestamp: 'Jan 30, 2026',
    actor: 'Security',
    summary: 'Updated evidence repository. 70/85 controls documented.',
    swimlaneId: 'sl7',
    linkedEventId: 'tl-sec-8',
    evidence: [{ type: 'Notion', url: 'soc2-evidence', preview: '70/85 controls ready' }]
  },
  {
    id: 'tl-sec-8',
    type: 'meeting',
    title: 'Auditor Checkpoint',
    timestamp: 'Feb 1, 2026',
    actor: 'External Auditor',
    summary: 'Mid-audit checkpoint. Auditors satisfied with progress. 15 controls pending.',
    swimlaneId: 'sl7',
    linkedEventId: 'tl-sec-9'
  },
  {
    id: 'tl-sec-9',
    type: 'commitment',
    title: 'Remaining Evidence Due',
    timestamp: 'Feb 5, 2026',
    actor: 'Security',
    summary: 'Final 15 controls evidence due. Change management tickets being gathered.',
    swimlaneId: 'sl7',
    linkedEventId: 'tl-62',
    criticality: 'urgent'
  },
  {
    id: 'tl-62',
    type: 'commitment',
    title: 'SOC 2 Type II Audit',
    timestamp: 'Feb 25, 2026',
    actor: 'Security',
    summary: 'Final audit report expected. All evidence submitted.',
    swimlaneId: 'sl7',
    criticality: 'critical'
  },

  // --- PLATFORM RELIABILITY SWIMLANE (sl8) - Incident Response Arc ---
  {
    id: 'tl-plat-1',
    type: 'decision',
    title: 'SLO Targets Set',
    timestamp: 'Dec 5, 2025',
    actor: 'Platform Lead',
    summary: 'Set Q1 SLOs: 99.9% uptime, p95 latency < 200ms, error budget 0.1%.',
    swimlaneId: 'sl8',
    linkedEventId: 'tl-plat-2',
    evidence: [{ type: 'Notion', url: 'slo-targets', preview: 'Q1 SLOs documented' }]
  },
  {
    id: 'tl-plat-2',
    type: 'document',
    title: 'Runbook: High Latency',
    timestamp: 'Dec 12, 2025',
    actor: 'SRE',
    summary: 'Published runbook for latency incidents. Covers queue optimization, cache invalidation.',
    swimlaneId: 'sl8',
    linkedEventId: 'tl-plat-3',
    evidence: [{ type: 'Confluence', url: 'runbook-latency', preview: '5-step incident response' }]
  },
  {
    id: 'tl-plat-3',
    type: 'meeting',
    title: 'On-Call Training',
    timestamp: 'Dec 20, 2025',
    actor: 'SRE Lead',
    summary: 'Trained 6 new on-call engineers. Covered escalation paths and runbooks.',
    swimlaneId: 'sl8',
    linkedEventId: 'tl-plat-4'
  },
  {
    id: 'tl-plat-4',
    type: 'commitment',
    title: 'Queue Optimization Project',
    timestamp: 'Jan 8, 2026',
    actor: 'Platform',
    summary: 'Started work on async queue optimization. Target: 50% backlog reduction.',
    swimlaneId: 'sl8',
    linkedEventId: 'tl-plat-5',
    evidence: [{ type: 'Jira', url: 'PLAT-892', preview: 'Queue optimization epic' }]
  },
  {
    id: 'tl-plat-5',
    type: 'alert',
    title: 'Memory Leak Detected',
    timestamp: 'Jan 18, 2026',
    actor: 'Datadog',
    summary: 'Worker pods memory growing 2% per hour. Restart scheduled.',
    swimlaneId: 'sl8',
    linkedEventId: 'tl-plat-6',
    criticality: 'warning'
  },
  {
    id: 'tl-plat-6',
    type: 'decision',
    title: 'Memory Leak Fix',
    timestamp: 'Jan 20, 2026',
    actor: 'Backend',
    summary: 'Found leak in connection pool. Patch deployed. Memory stable.',
    swimlaneId: 'sl8',
    linkedEventId: 'tl-plat-7',
    evidence: [{ type: 'GitHub', url: 'PR-4521', preview: 'Connection pool fix merged' }]
  },
  {
    id: 'tl-plat-7',
    type: 'document',
    title: 'Memory Leak Post-Mortem',
    timestamp: 'Jan 22, 2026',
    actor: 'SRE',
    summary: 'Documented root cause and prevention. Added memory monitoring alert.',
    swimlaneId: 'sl8',
    evidence: [{ type: 'Notion', url: 'postmortem-mem', preview: 'Prevention measures added' }]
  },
  {
    id: 'tl-55',
    type: 'alert',
    title: 'Latency Spike: US-East',
    timestamp: 'Jan 31, 2026',
    actor: 'Datadog',
    summary: 'p95 latency exceeded 250ms for 2 hours. 3 enterprise customers impacted.',
    swimlaneId: 'sl8',
    linkedEventId: 'tl-plat-8',
    criticality: 'critical'
  },
  {
    id: 'tl-plat-8',
    type: 'meeting',
    title: 'Incident War Room',
    timestamp: 'Jan 31, 2026',
    actor: 'SRE + Platform',
    summary: 'Identified root cause: queue backlog from batch job. Runbook followed.',
    swimlaneId: 'sl8',
    linkedEventId: 'tl-56'
  },
  {
    id: 'tl-56',
    type: 'decision',
    title: 'Queue Optimization Rollout',
    timestamp: 'Feb 2, 2026',
    actor: 'Platform',
    summary: 'New queue settings reduced backlog by 40%. p95 latency now 180ms.',
    swimlaneId: 'sl8',
    linkedEventId: 'tl-plat-9',
    evidence: [{ type: 'Datadog', url: 'latency-graph', preview: 'p95: 180ms (was 340ms)' }]
  },
  {
    id: 'tl-plat-9',
    type: 'document',
    title: 'Latency Incident Post-Mortem',
    timestamp: 'Feb 3, 2026',
    actor: 'SRE Lead',
    summary: 'Full post-mortem published. Added batch job rate limiting.',
    swimlaneId: 'sl8',
    linkedEventId: 'tl-plat-10',
    evidence: [{ type: 'Notion', url: 'postmortem-latency', preview: 'Action items assigned' }]
  },
  {
    id: 'tl-plat-10',
    type: 'commitment',
    title: 'Error Budget Review',
    timestamp: 'Today, 2:00 PM',
    actor: 'Platform Lead',
    summary: 'Q1 error budget at 0.08%. On track for 99.9% SLO.',
    swimlaneId: 'sl8',
    evidence: [{ type: 'Dashboard', url: 'slo-dashboard', preview: 'Error budget: 0.08%' }]
  },

  // --- INCIDENT RESPONSE SWIMLANE (sl3) - Additional Connected Events ---
  {
    id: 'tl-inc-1',
    type: 'alert',
    title: 'Database Failover Triggered',
    timestamp: 'Jan 25, 2026',
    actor: 'AWS RDS',
    summary: 'Primary database failed over to replica. 45 second downtime.',
    swimlaneId: 'sl3',
    linkedEventId: 'tl-inc-2',
    criticality: 'critical'
  },
  {
    id: 'tl-inc-2',
    type: 'meeting',
    title: 'DB Failover War Room',
    timestamp: 'Jan 25, 2026',
    actor: 'DBA + SRE',
    summary: 'Investigated failover. Primary had disk I/O saturation.',
    swimlaneId: 'sl3',
    linkedEventId: 'tl-inc-3'
  },
  {
    id: 'tl-inc-3',
    type: 'decision',
    title: 'Storage Upgrade Approved',
    timestamp: 'Jan 26, 2026',
    actor: 'CTO',
    summary: 'Approved upgrade to io2 storage. $8K/month increase.',
    swimlaneId: 'sl3',
    linkedEventId: 'tl-inc-4',
    evidence: [{ type: 'Slack', url: '#infra', preview: 'CTO: Approved. Do it.' }]
  },
  {
    id: 'tl-inc-4',
    type: 'commitment',
    title: 'Storage Migration Scheduled',
    timestamp: 'Jan 28, 2026',
    actor: 'DBA',
    summary: 'io2 migration scheduled for Feb 8 maintenance window.',
    swimlaneId: 'sl3',
    linkedEventId: 'tl-inc-5'
  },
  {
    id: 'tl-inc-5',
    type: 'document',
    title: 'DB Failover Post-Mortem',
    timestamp: 'Jan 30, 2026',
    actor: 'DBA Lead',
    summary: 'Root cause: write-heavy batch job. Added I/O monitoring.',
    swimlaneId: 'sl3',
    evidence: [{ type: 'Notion', url: 'postmortem-db', preview: 'Monitoring gaps addressed' }]
  },
  {
    id: 'tl-inc-6',
    type: 'commitment',
    title: 'Storage Migration Complete',
    timestamp: 'Feb 8, 2026',
    actor: 'DBA',
    summary: 'io2 migration successful. I/O latency improved 60%.',
    swimlaneId: 'sl3'
  },

  // --- PARTNER INTEGRATION SWIMLANE (sl4) - Full Partnership Arc ---
  {
    id: 'tl-part-1',
    type: 'meeting',
    title: 'Alpha Partner: Initial Call',
    timestamp: 'Nov 15, 2025',
    actor: 'BD Lead',
    summary: 'First call with Alpha Corp. Interested in co-selling arrangement.',
    swimlaneId: 'sl4',
    linkedEventId: 'tl-part-2'
  },
  {
    id: 'tl-part-2',
    type: 'document',
    title: 'Alpha: Partnership Proposal',
    timestamp: 'Nov 28, 2025',
    actor: 'BD',
    summary: 'Drafted partnership terms: 20% revenue share, joint marketing.',
    swimlaneId: 'sl4',
    linkedEventId: 'tl-part-3',
    evidence: [{ type: 'Doc', url: 'alpha-proposal', preview: 'Partnership terms v1' }]
  },
  {
    id: 'tl-part-3',
    type: 'meeting',
    title: 'Alpha: Executive Alignment',
    timestamp: 'Dec 10, 2025',
    actor: 'CEO + Alpha CEO',
    summary: 'CEOs aligned on vision. Legal review next step.',
    swimlaneId: 'sl4',
    linkedEventId: 'tl-part-4'
  },
  {
    id: 'tl-part-4',
    type: 'commitment',
    title: 'Alpha: Legal Review Started',
    timestamp: 'Dec 18, 2025',
    actor: 'Legal',
    summary: 'Legal teams exchanged redlines. 3 open issues.',
    swimlaneId: 'sl4',
    linkedEventId: 'tl-part-5'
  },
  {
    id: 'tl-part-5',
    type: 'alert',
    title: 'Alpha: IP Clause Dispute',
    timestamp: 'Jan 8, 2026',
    actor: 'Legal',
    summary: 'Alpha wants joint IP ownership. Our counsel advised against.',
    swimlaneId: 'sl4',
    linkedEventId: 'tl-part-6',
    criticality: 'warning'
  },
  {
    id: 'tl-part-6',
    type: 'meeting',
    title: 'Alpha: Legal Negotiation',
    timestamp: 'Jan 15, 2026',
    actor: 'Legal + Alpha Legal',
    summary: 'Negotiated IP terms. Agreed on licensing instead of ownership.',
    swimlaneId: 'sl4',
    linkedEventId: 'tl-part-7'
  },
  {
    id: 'tl-part-7',
    type: 'alert',
    title: 'Alpha: Waiting on Partner',
    timestamp: 'Jan 25, 2026',
    actor: 'BD',
    summary: 'Alpha legal review taking longer than expected. No response in 10 days.',
    swimlaneId: 'sl4',
    linkedEventId: 'tl-part-8',
    criticality: 'warning'
  },
  {
    id: 'tl-part-8',
    type: 'decision',
    title: 'Alpha: Escalation Email',
    timestamp: 'Jan 28, 2026',
    actor: 'CEO',
    summary: 'CEO sent follow-up to Alpha CEO. Waiting for response.',
    swimlaneId: 'sl4',
    linkedEventId: 'tl-part-9',
    evidence: [{ type: 'Email', url: 'alpha-escalation', preview: 'CEO: Following up on partnership' }]
  },
  {
    id: 'tl-part-9',
    type: 'meeting',
    title: 'Alpha: CEO Response',
    timestamp: 'Feb 3, 2026',
    actor: 'Alpha CEO',
    summary: 'Alpha CEO responded. Internal reorg delayed review. Resuming Feb 10.',
    swimlaneId: 'sl4',
    linkedEventId: 'tl-61'
  },
  {
    id: 'tl-61',
    type: 'meeting',
    title: 'Alpha: Contract Review Resume',
    timestamp: 'Feb 10, 2026',
    actor: 'Legal',
    summary: 'Legal review resumed. Final terms expected by Feb 20.',
    swimlaneId: 'sl4'
  },

  // --- Q3 PRODUCT STRATEGY (sl1) - Additional Connected Events ---
  {
    id: 'tl-prod-1',
    type: 'meeting',
    title: 'Q3 Planning Kickoff',
    timestamp: 'Dec 1, 2025',
    actor: 'Product Leadership',
    summary: 'Started Q3 planning. Focus areas: mobile, enterprise, integrations.',
    swimlaneId: 'sl1',
    linkedEventId: 'tl-prod-2'
  },
  {
    id: 'tl-prod-2',
    type: 'document',
    title: 'Q3 Strategy Draft',
    timestamp: 'Dec 15, 2025',
    actor: 'Product VP',
    summary: 'First draft of Q3 strategy. 5 key initiatives identified.',
    swimlaneId: 'sl1',
    linkedEventId: 'tl-prod-3',
    evidence: [{ type: 'Notion', url: 'q3-strategy', preview: '5 initiatives proposed' }]
  },
  {
    id: 'tl-prod-3',
    type: 'meeting',
    title: 'Strategy Review: Engineering',
    timestamp: 'Jan 5, 2026',
    actor: 'Eng + Product',
    summary: 'Engineering reviewed strategy. Flagged capacity concerns for mobile.',
    swimlaneId: 'sl1',
    linkedEventId: 'tl-prod-4'
  },
  {
    id: 'tl-prod-4',
    type: 'decision',
    title: 'Mobile Scope Reduction',
    timestamp: 'Jan 12, 2026',
    actor: 'Product VP',
    summary: 'Reduced mobile scope to MVP. Full feature set pushed to Q4.',
    swimlaneId: 'sl1',
    linkedEventId: 'tl-7',
    evidence: [{ type: 'Notion', url: 'mobile-mvp', preview: 'MVP scope defined' }]
  },
  {
    id: 'tl-prod-5',
    type: 'alert',
    title: 'Marketing Misalignment',
    timestamp: 'Jan 18, 2026',
    actor: 'Marketing',
    summary: 'Marketing launch plan assumes full mobile features. Needs update.',
    swimlaneId: 'sl1',
    linkedEventId: 'tl-3',
    criticality: 'warning'
  },

  // --- UPCOMING / FUTURE EVENTS (Tentative) ---
  { id: 'tl-57', type: 'meeting', title: 'Q1 Board Meeting', timestamp: 'Feb 10, 2026', actor: 'Board', summary: 'Quarterly business review with board members.', swimlaneId: 'sl1' },
  { id: 'tl-58', type: 'commitment', title: 'Mobile App Launch', timestamp: 'Feb 15, 2026', actor: 'Product', summary: 'Target launch for iOS and Android apps.', swimlaneId: 'sl1', criticality: 'urgent' },
  { id: 'tl-59', type: 'meeting', title: 'Design System Review', timestamp: 'Feb 12, 2026', actor: 'Design Team', summary: 'Review and approve component library updates.', swimlaneId: 'sl1' },
  { id: 'tl-60', type: 'decision', title: 'API v4 Kickoff', timestamp: 'Feb 20, 2026', actor: 'Engineering', summary: 'Begin planning for next major API version.', swimlaneId: 'sl2' },
  { id: 'tl-63', type: 'meeting', title: 'Team Offsite Planning', timestamp: 'Mar 01, 2026', actor: 'People Ops', summary: 'Planning session for Q2 team offsite.', swimlaneId: 'sl4' },
  { id: 'tl-64', type: 'decision', title: 'Infrastructure Migration', timestamp: 'Mar 05, 2026', actor: 'Platform', summary: 'Decision on cloud provider migration path.', swimlaneId: 'sl8' },
  { id: 'tl-65', type: 'commitment', title: 'EU GDPR Compliance', timestamp: 'Mar 15, 2026', actor: 'Legal', summary: 'Complete EU data residency requirements.', swimlaneId: 'sl4' }
];

export const extendedReports: ExtendedReport[] = [
  // ... existing reports ...
  {
    id: 'r1',
    title: 'Weekly Intelligence Summary',
    dateRange: 'Jan 26 - Feb 01',
    summary: 'Team velocity increased by 10%. 3 critical risks identified in supply chain.',
    status: 'ready',
    category: 'Weekly',
    author: 'Sentra Intelligence',
    readTime: '4 min read',
    content: [
      {
        heading: 'Executive Summary',
        body: 'The engineering team has successfully mitigated the primary latency risks identified last week. However, supply chain dependencies for the Q2 hardware refresh remain critical.',
        evidence: [
          { text: 'Latency p99 reduced to 120ms', source: 'Datadog Alert' },
          { text: 'Chipset delivery delayed by 2 weeks', source: 'Vendor Email' }
        ]
      },
      {
        heading: 'Key Decisions',
        body: 'Product leadership has opted to postpone the "Dark Mode" release to prioritize stability fixes. This decision aligns with the new Q1 quality OKRs.',
        evidence: [
          { text: 'Dark Mode launch moved to Q2', source: 'Product Board' }
        ]
      }
    ]
  },
  {
    id: 'r2',
    title: 'Competitor Landscape: "Project Titan"',
    dateRange: 'Q1 2026',
    summary: 'Deep dive into Competitor X’s new AI features and market reception.',
    status: 'ready',
    category: 'Radar',
    author: 'Strategy Team',
    readTime: '8 min read',
    content: [
      {
        heading: 'Feature Analysis',
        body: 'Competitor X launched "Titan" yesterday. Initial reception is mixed, with users praising the speed but criticizing the lack of integrations.',
        evidence: [
          { text: 'Product Hunt launch #2', source: 'Public Web' },
          { text: 'Hacker News thread: "It feels half-baked"', source: 'Social Monitor' }
        ]
      }
    ]
  },
  {
    id: 'r3',
    title: 'Team Health & Velocity',
    dateRange: 'January 2026',
    summary: 'Burnout risk elevated in Backend Infra team due to ongoing migrations.',
    status: 'ready',
    category: 'Team',
    author: 'People Ops',
    readTime: '3 min read',
    content: [
      {
        heading: 'Workload Distribution',
        body: 'Backend Infra team has averaged 55h weeks for the past month. Recommend immediate scope reduction or contractor support.',
        evidence: [
          { text: 'Avg commit time: 8:30 PM', source: 'GitHub Insights' }
        ]
      }
    ]
  },
  {
    id: 'r4',
    title: 'Enterprise Win Analysis: Northstar',
    dateRange: 'Feb 2026',
    summary: 'Breakdown of why Northstar converted and repeatable signals for the next 5 deals.',
    status: 'ready',
    category: 'Ad Hoc',
    author: 'Revenue Ops',
    readTime: '6 min read',
    content: [
      {
        heading: 'Key Drivers',
        body: 'Security posture, API extensibility, and executive alignment were the strongest conversion signals. Time-to-value was under 14 days.',
        evidence: [
          { text: 'Security review completed in 3 days', source: 'Deal Notes' },
          { text: 'Pilot ROI > 4x', source: 'Customer Success' }
        ]
      }
    ]
  },
  {
    id: 'r5',
    title: 'Customer Health Pulse',
    dateRange: 'Feb 1 - Feb 7',
    summary: 'Stable renewal outlook. 2 accounts flagged for expansion risk due to adoption dips.',
    status: 'ready',
    category: 'Weekly',
    author: 'Customer Success',
    readTime: '5 min read',
    content: [
      {
        heading: 'Adoption Signals',
        body: 'Weekly active users are steady overall, with declines concentrated in two mid-market accounts.',
        evidence: [
          { text: 'WAU down 18% in 2 accounts', source: 'Usage Analytics' }
        ]
      }
    ]
  },
  {
    id: 'r6',
    title: 'AI Compliance Watch',
    dateRange: 'Q1 2026',
    summary: 'New regulatory guidance in EU and US states. Product changes required for data retention.',
    status: 'ready',
    category: 'Radar',
    author: 'Legal',
    readTime: '7 min read',
    content: [
      {
        heading: 'Regulatory Updates',
        body: 'Three new policies introduce stricter retention and audit requirements for AI systems handling PII.',
        evidence: [
          { text: 'EU AI Act guidance published', source: 'Policy Monitor' }
        ]
      }
    ]
  },
  {
    id: 'r7',
    title: 'Sales Pipeline Review',
    dateRange: 'January 2026',
    summary: 'Pipeline coverage at 3.2x target. Enterprise segment trending above forecast.',
    status: 'ready',
    category: 'Team',
    author: 'Sales Ops',
    readTime: '4 min read',
    content: [
      {
        heading: 'Coverage & Risk',
        body: 'Enterprise coverage is healthy, SMB coverage below target. Recommend redistributing SDR focus.',
        evidence: [
          { text: 'Enterprise pipeline: $3.8M', source: 'CRM' }
        ]
      }
    ]
  },
  {
    id: 'r8',
    title: 'Security Posture Review',
    dateRange: 'Jan 2026',
    summary: 'Pen test results show two medium-risk findings. Remediation underway.',
    status: 'ready',
    category: 'Ad Hoc',
    author: 'Security',
    readTime: '3 min read',
    content: [
      {
        heading: 'Findings',
        body: 'Two medium-risk issues identified in authentication flow; no critical findings.',
        evidence: [
          { text: 'Pen test report delivered', source: 'Security Vendor' }
        ]
      }
    ]
  }
];

export interface ExtendedReport extends Report {
  category: 'Ad Hoc' | 'Weekly' | 'Radar' | 'Team';
  author: string;
  readTime: string;
  content: {
    heading: string;
    body: string;
    evidence: { text: string; source: string }[];
  }[];
}

export interface MemoryItem {
  id: string;
  text: string;
  source: string;
  timestamp: string;
  context?: string;
}

export const alerts: Alert[] = [
  {
    id: 'a1',
    title: 'Marketing and Product remain misaligned on Q3 launch KPIs',
    description: 'The two teams have discussed this in three meetings without reaching consensus. Jordan proposed escalating to the exec sync.',
    severity: 'warning',
    timestamp: '2026-02-02T09:30:00',
    source: 'Slack #strategy',
    attentionType: 'misalignment',
    probability: 'high',
    impact: 'high',
    focusCategory: 'friction',
    memoryRationale: 'Marketing and Product have been going in circles on this for two weeks. Worth escalating before the launch slips.',
    needsIntervention: true,
    needsDecision: true,
    collaborators: ['Jordan (Marketing)', 'Sarah (Product)'],
    evidence: [
      { type: 'Slack', url: '#strategy', preview: 'Jordan: "We need to finalize KPIs this week"' },
      { type: 'Meeting', url: 'm-past-10', preview: 'Product Roadmap Sync - alignment discussed' }
    ],
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-01-20T10:00:00',
      activeDays: 14,
      hasAppearedBefore: true,
      previousAppearances: 2,
      origin: {
        type: 'meeting',
        description: 'Jordan first raised the KPI concern in the Jan 20 Product Roadmap Sync. Sarah agreed alignment was needed, but three subsequent meetings (Jan 24, Jan 28, Feb 1) haven\'t resolved it. Each meeting ended with "let\'s take it offline" but no one followed through.'
      },
      trigger: {
        type: 'deadline',
        description: 'The Q3 launch is now 12 days away. Jordan posted in #strategy this morning at 9:15 AM suggesting it\'s time to escalate to the exec sync. Without resolution this week, the launch timeline is at risk.'
      },
      storyline: {
        isPartOfThread: true,
        threadDescription: 'Part of Q3 Launch Planning'
      },
      rankingRationale: 'Two weeks without resolution, launch in 12 days'
    },
    thread: {
      comments: [
        {
          id: 'tc1',
          authorId: 'jordan',
          authorName: 'Jordan (Marketing)',
          content: 'Can we escalate this to the exec sync? Been stuck for 2 weeks.',
          timestamp: '2026-02-02T08:15:00',
          mentions: []
        },
        {
          id: 'tc2',
          authorId: 'sarah',
          authorName: 'Sarah (Product)',
          content: '@Jordan I agree. Let me pull together the options doc first.',
          timestamp: '2026-02-02T08:45:00',
          mentions: ['Jordan']
        },
        {
          id: 'tc3',
          authorId: 'alex',
          authorName: 'Alex (You)',
          content: 'Good idea. Let\'s sync tomorrow morning before the exec meeting.',
          timestamp: '2026-02-02T09:20:00',
          mentions: []
        }
      ],
      participants: ['Jordan (Marketing)', 'Sarah (Product)', 'Alex (You)']
    }
  },
  {
    id: 'a2',
    title: 'Cloud infrastructure spend is trending 15% over forecast',
    description: 'AWS costs have climbed to $127K against a $110K budget. Finance flagged this in their weekly update.',
    severity: 'critical',
    timestamp: '2026-02-01T14:15:00',
    source: 'Finance Update PDF',
    attentionType: 'risk',
    probability: 'high',
    impact: 'high',
    focusCategory: 'friction',
    memoryRationale: 'The $17K overage will require CFO approval if we don\'t act this week. Finance is asking for a plan.',
    needsIntervention: true,
    needsDecision: true,
    collaborators: ['Finance', 'Platform Team'],
    evidence: [
      { type: 'PDF', url: 'finance-report', preview: 'AWS spend: $127K (budget: $110K)' },
      { type: 'Datadog', url: 'cost-dashboard', preview: 'Cost trending 15% over' }
    ],
    memory: {
      lifecycleState: 'entered',
      enteredAt: '2026-02-01T14:15:00',
      activeDays: 1,
      hasAppearedBefore: false,
      origin: {
        type: 'document',
        description: 'Finance flagged this in yesterday\'s weekly update (PDF attached). The overage started in mid-January when the new ML pipeline went live. Platform Team confirmed they weren\'t aware of the cost impact during rollout.'
      },
      trigger: {
        type: 'pattern_detected',
        description: 'Spend has increased 15% month-over-month and is still climbing. At current trajectory, February will exceed budget by $20K+. Finance policy requires CFO sign-off for overages above $15K.'
      },
      rankingRationale: 'CFO approval threshold about to be crossed'
    }
  },
  {
    id: 'a3',
    title: 'Competitor X launched "Smart Sync" this morning',
    description: 'Early reception on Product Hunt is mixed. The feature overlaps with your planned Q2 sync improvements.',
    severity: 'info',
    timestamp: '2026-02-02T08:00:00',
    source: 'Market Intelligence',
    attentionType: 'risk',
    probability: 'medium',
    impact: 'medium',
    focusCategory: 'pulse',
    memoryRationale: 'Their feature overlaps with your Q2 sync improvements. Early reception might inform your positioning.',
    needsIntervention: false,
    needsDecision: false,
    evidence: [
      { type: 'Web', url: 'competitor-launch', preview: 'Product Hunt: "Smart Sync launches..."' }
    ],
    memory: {
      lifecycleState: 'entered',
      enteredAt: '2026-02-02T08:00:00',
      activeDays: 0,
      hasAppearedBefore: false,
      origin: {
        type: 'signal',
        description: 'Market Intelligence picked up the launch from Product Hunt at 8:00 AM. Competitor X has been teasing this feature on Twitter for two weeks.'
      },
      trigger: {
        type: 'external_signal',
        description: 'The feature launched this morning and directly overlaps with your "Enhanced Sync" item on the Q2 roadmap (scheduled for April). Product Hunt comments are mixed—users are complaining about complexity. This could be an opportunity to differentiate on simplicity.'
      },
      rankingRationale: 'New competitive signal, overlaps Q2 roadmap'
    }
  },
  {
    id: 'a4',
    title: 'Three SOC 2 access reviews remain incomplete',
    description: 'The renewal deadline is February 15. Security has been working through the checklist but hit capacity constraints.',
    severity: 'warning',
    timestamp: '2026-02-02T11:45:00',
    source: 'Security Checklist',
    attentionType: 'blocker',
    probability: 'high',
    impact: 'medium',
    focusCategory: 'horizon',
    memoryRationale: 'The Feb 15 deadline is 13 days away and three reviews are still pending. Security hit capacity constraints.',
    needsIntervention: true,
    needsDecision: false,
    collaborators: ['Security', 'IT Ops'],
    evidence: [
      { type: 'Notion', url: 'soc2-checklist', preview: '3/6 access reviews pending' }
    ],
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-01-25T10:00:00',
      activeDays: 9,
      hasAppearedBefore: true,
      previousAppearances: 1,
      origin: {
        type: 'document',
        description: 'Security started the SOC 2 renewal checklist on Jan 15. They completed three reviews by Jan 25, but David mentioned in #security that the team got pulled into the Feb 1 incident response.'
      },
      trigger: {
        type: 'deadline',
        description: 'The Feb 15 auditor deadline is now 13 days away. The three remaining reviews (Database Access, Admin Privileges, Third-Party Integrations) each require 2-3 days. Security is asking if they can borrow IT Ops capacity to parallelize.'
      },
      rankingRationale: 'Deadline approaching, team capacity constrained'
    }
  },
  {
    id: 'a5',
    title: 'Lumen is experiencing missing audit exports since Jan 28',
    description: 'Their CTO requested a call today. Engineering identified a migration script gap and is deploying a fix.',
    severity: 'critical',
    timestamp: '2026-02-02T12:10:00',
    source: 'Support Queue',
    attentionType: 'risk',
    probability: 'high',
    impact: 'high',
    focusCategory: 'friction',
    memoryRationale: 'Their CTO escalated this morning. Lumen is a $450K account renewing in 45 days—we need to respond today.',
    needsIntervention: true,
    needsDecision: true,
    collaborators: ['Customer Success', 'Engineering'],
    evidence: [
      { type: 'Zendesk', url: 'ticket-4521', preview: 'Lumen: "Audit exports missing since Jan 28"' },
      { type: 'Slack', url: '#customer-success', preview: 'CS: "Lumen escalation - needs immediate attention"' }
    ],
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-01-28T09:00:00',
      activeDays: 6,
      hasAppearedBefore: true,
      previousAppearances: 3,
      origin: {
        type: 'signal',
        description: 'Lumen opened Zendesk ticket #4521 on Jan 28 reporting missing audit exports. The issue was initially categorized as "low priority" but escalated when their compliance team flagged it. Engineering traced it to a migration script gap from the Jan 15 database update.'
      },
      trigger: {
        type: 'escalation',
        description: 'Lumen\'s CTO (Marcus Chen) emailed your CEO this morning requesting a call "within 24 hours." Their renewal is in 45 days and they mentioned evaluating alternatives. Engineering has a fix ready but needs you to confirm deployment timing with the customer.'
      },
      rankingRationale: 'CTO escalation, $450K renewal at risk'
    },
    thread: {
      comments: [
        {
          id: 'lc1',
          authorId: 'cs-lead',
          authorName: 'Customer Success',
          content: 'Lumen\'s CTO is asking for a call today. Can we get engineering on this ASAP?',
          timestamp: '2026-02-02T10:30:00',
          mentions: []
        },
        {
          id: 'lc2',
          authorId: 'eng-lead',
          authorName: 'Engineering',
          content: 'Found the issue - migration script missed their tenant. Fix deploying in 30 mins.',
          timestamp: '2026-02-02T11:45:00',
          mentions: []
        }
      ],
      participants: ['Customer Success', 'Engineering']
    }
  },
  {
    id: 'a6',
    title: 'Engineering hiring pipeline has slipped 20% below target',
    description: 'Eight candidates are in play against a target of twelve. The Q2 roadmap assumes three new engineers by March 1.',
    severity: 'warning',
    timestamp: '2026-02-01T16:30:00',
    source: 'People Ops',
    attentionType: 'risk',
    probability: 'medium',
    impact: 'high',
    focusCategory: 'friction',
    memoryRationale: 'This surfaced because pipeline coverage dropped below the threshold needed to hit March hiring goals.',
    needsIntervention: true,
    needsDecision: false,
    collaborators: ['People Ops', 'Engineering Leads'],
    evidence: [
      { type: 'Ashby', url: 'pipeline', preview: 'Pipeline: 8 candidates (target: 12)' }
    ]
  },
  {
    id: 'a7',
    title: 'US-East latency has increased 35% over the past 24 hours',
    description: 'Three enterprise customers have reported issues. Platform team is investigating the root cause.',
    severity: 'critical',
    timestamp: '2026-02-02T07:20:00',
    source: 'Datadog',
    attentionType: 'risk',
    probability: 'high',
    impact: 'high',
    focusCategory: 'pulse',
    memoryRationale: 'Three enterprise customers have reported issues. Platform team is investigating but may need you to join the call.',
    needsIntervention: true,
    needsDecision: true,
    collaborators: ['Platform Team', 'DevOps'],
    evidence: [
      { type: 'Datadog', url: 'latency-alert', preview: 'p95: 340ms (baseline: 250ms)' },
      { type: 'Slack', url: '#incidents', preview: '3 customer complaints in last 2 hours' }
    ],
    memory: {
      lifecycleState: 'entered',
      enteredAt: '2026-02-02T07:20:00',
      activeDays: 0,
      hasAppearedBefore: false,
      origin: {
        type: 'signal',
        description: 'Datadog triggered this alert at 7:20 AM when p95 latency crossed 340ms (baseline: 250ms). The spike started around 3 AM, likely correlated with the batch job deployment at 2:45 AM.'
      },
      trigger: {
        type: 'external_signal',
        description: 'Three enterprise customers (Northstar, Lumen, TechFlow) opened support tickets in the last 2 hours. Platform team started investigating at 7:30 AM and suspects the new batch processing job. They may need approval to roll back.'
      },
      rankingRationale: 'Active customer impact, investigation underway'
    }
  }
];

export const commitments: Commitment[] = [
  {
    id: 'c0',
    title: 'Q4 Performance Reviews',
    assignee: 'Me',
    dueDate: 'Yesterday',
    status: 'completed',
    priority: 'High',
    okr: 'Build World Class Team',
    context: 'Completed on time',
    attentionType: 'commitment',
    probability: 'low',
    impact: 'low',
    focusCategory: 'pulse',
    memoryRationale: 'Completed successfully.',
    needsIntervention: false,
    needsDecision: false
  },
  {
    id: 'c0-1',
    title: 'Sign Vendor Contract',
    assignee: 'Me',
    dueDate: '2 days ago',
    status: 'completed',
    priority: 'Medium',
    okr: 'Operational Excellence',
    context: 'Legal approved',
    attentionType: 'commitment',
    probability: 'low',
    impact: 'low',
    focusCategory: 'pulse',
    memoryRationale: 'Completed successfully.',
    needsIntervention: false,
    needsDecision: false
  },
  {
    id: 'c1',
    title: 'The CTO is expecting your hiring plan review by end of day',
    assignee: 'Me',
    dueDate: 'Today, 5:00 PM',
    status: 'pending',
    priority: 'High',
    okr: 'Build World Class Team',
    context: 'You committed to this in last week\'s Engineering Weekly. Q2 headcount decisions depend on it.',
    source: {
      type: 'meeting',
      title: 'Engineering Weekly',
      id: 'm-past-2',
      timestamp: 'Jan 22, 2:45 PM',
      preview: 'CTO: "Can we get a review of the hiring plan by EOD?"',
      author: 'CTO'
    },
    attentionType: 'commitment',
    probability: 'high',
    impact: 'high',
    focusCategory: 'horizon',
    memoryRationale: 'The CTO needs this by end of day to finalize Q2 headcount decisions at tomorrow\'s board meeting.',
    needsIntervention: true,
    needsDecision: true,
    collaborators: ['CTO', 'People Ops'],
    evidence: [
      { type: 'Meeting', url: 'm-past-2', preview: 'CTO: "Can we get a review by EOD?"' }
    ],
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-01-22T14:45:00',
      activeDays: 12,
      hasAppearedBefore: true,
      previousAppearances: 2,
      origin: {
        type: 'meeting',
        description: 'You committed to this during the Jan 22 Engineering Weekly. The CTO asked: "Can we get a review of the hiring plan by end of week?" You said you\'d have it by Monday (Feb 3), but then clarified you could do today (Feb 2) if needed.'
      },
      trigger: {
        type: 'deadline',
        description: 'Today is the deadline. The CTO has a board presentation tomorrow morning where she needs to present finalized Q2 headcount. People Ops sent you the updated candidate pipeline yesterday—all the inputs are ready for your review.'
      },
      rankingRationale: 'Due today, blocks board presentation tomorrow'
    }
  },
  {
    id: 'c2',
    title: 'The Q1 retrospective is due to the team tomorrow',
    assignee: 'Me',
    dueDate: 'Tomorrow',
    status: 'pending',
    priority: 'Medium',
    okr: 'Operational Excellence',
    context: 'The team uses this for sprint planning. Last quarter\'s was well-received.',
    attentionType: 'commitment',
    probability: 'medium',
    impact: 'medium',
    focusCategory: 'horizon',
    memoryRationale: 'The team references this during sprint planning. Last quarter\'s was well-received—worth maintaining the pattern.',
    needsIntervention: true,
    needsDecision: false,
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-01-30T09:00:00',
      activeDays: 4,
      hasAppearedBefore: true,
      previousAppearances: 1,
      origin: {
        type: 'commitment',
        description: 'This is a quarterly recurring commitment. You started it after the Q3 retrospective was skipped and the team mentioned in the Oct all-hands that they missed the reflection time.'
      },
      trigger: {
        type: 'scheduled',
        description: 'Due tomorrow (Feb 3) before the Monday sprint planning meeting at 10 AM. Mike mentioned in Slack yesterday that he\'s looking forward to reviewing it—the team found Q4\'s format particularly useful.'
      },
      rankingRationale: 'Due tomorrow, team expecting it for sprint planning'
    }
  },
  {
    id: 'c3',
    title: 'Sarah has been waiting three days for design system approval',
    assignee: 'Sarah (Design)',
    dueDate: 'Overdue',
    status: 'overdue',
    priority: 'High',
    okr: 'Product Quality',
    context: 'Her new color tokens are ready. The mobile release is blocked until you approve.',
    source: {
      type: 'slack',
      title: '#design-system',
      timestamp: 'Yesterday 4:20 PM',
      preview: 'Sarah: "@Alex just need a quick thumbs up on the new tokens."',
      author: 'Sarah Chen'
    },
    attentionType: 'blocker',
    probability: 'high',
    impact: 'high',
    focusCategory: 'friction',
    memoryRationale: 'Sarah has been waiting 6 days. The frontend team is blocked on the mobile release until you respond.',
    needsIntervention: true,
    needsDecision: true,
    collaborators: ['Sarah Chen', 'Frontend Team'],
    evidence: [
      { type: 'Slack', url: '#design-system', preview: 'Sarah: "@Alex just need a quick thumbs up"' },
      { type: 'Figma', url: 'design-tokens', preview: 'Design tokens v2 - ready for review' }
    ],
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-01-27T14:00:00',
      activeDays: 6,
      hasAppearedBefore: true,
      previousAppearances: 2,
      origin: {
        type: 'conversation',
        description: 'Sarah shared the new color tokens in #design-system on Jan 27 after completing the accessibility audit you requested. She tagged you for approval and followed up on Jan 30 and again yesterday (Feb 1).'
      },
      trigger: {
        type: 'dependency_change',
        description: 'The mobile app v2.4 release is now blocked on this approval. Frontend Team mentioned in standup this morning that they\'ve already integrated the tokens assuming approval—if you have concerns, they\'ll need to revert and delay the release by at least a week.'
      },
      rankingRationale: 'Blocking mobile release, Sarah followed up 3 times'
    },
    thread: {
      comments: [
        {
          id: 'ds1',
          authorId: 'sarah',
          authorName: 'Sarah Chen',
          content: 'The new tokens are ready. Just need a quick review on the color scale changes.',
          timestamp: '2026-01-30T14:00:00',
          mentions: []
        },
        {
          id: 'ds2',
          authorId: 'frontend',
          authorName: 'Frontend Team',
          content: 'We\'re blocked on this for the mobile release. @Alex can you take a look?',
          timestamp: '2026-02-01T09:30:00',
          mentions: ['Alex']
        }
      ],
      participants: ['Sarah Chen', 'Frontend Team', 'Alex']
    }
  },
  {
    id: 'c4',
    title: 'The investor update is due February 10',
    assignee: 'Me',
    dueDate: 'Feb 10',
    status: 'pending',
    priority: 'High',
    okr: 'Financial Health',
    context: 'Monthly board requirement. You\'ll need CFO input on the financials section.',
    source: {
      type: 'email',
      title: 'Investor Update Reminder',
      timestamp: 'Feb 1, 9:00 AM',
      preview: 'Subject: Please submit your monthly update by the 10th.',
      author: 'Board Admin'
    },
    attentionType: 'commitment',
    probability: 'high',
    impact: 'high',
    focusCategory: 'horizon',
    memoryRationale: 'One week until deadline. You\'ll need CFO input on financials—schedule time with James this week.',
    needsIntervention: true,
    needsDecision: false,
    collaborators: ['CFO', 'Board Admin'],
    evidence: [
      { type: 'Email', url: 'investor-reminder', preview: 'Please submit by the 10th' }
    ],
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-02-01T09:00:00',
      activeDays: 1,
      hasAppearedBefore: true,
      previousAppearances: 1,
      origin: {
        type: 'document',
        description: 'Board Admin sent the monthly reminder on Feb 1. This is the same format you\'ve done for the last 6 months. Last month\'s update was well-received—the board particularly appreciated the hiring pipeline section.'
      },
      trigger: {
        type: 'deadline',
        description: 'The Feb 10 deadline gives you 8 days. You typically need 2-3 days to compile, and James (CFO) mentioned in last week\'s sync that February financials will require extra context around the infrastructure spend variance.'
      },
      rankingRationale: 'Board deadline, requires CFO coordination'
    }
  },
  {
    id: 'c5',
    title: 'The Q2 roadmap conversation is converging toward final priorities',
    assignee: 'Me',
    dueDate: 'Feb 14',
    status: 'pending',
    priority: 'High',
    okr: 'Product Quality',
    context: 'PM Lead is coordinating alignment with Sales and Customer Success. Engineering sprint planning depends on this.',
    source: {
      type: 'meeting',
      title: 'Product Roadmap Sync',
      timestamp: 'Feb 1, 11:00 AM',
      preview: 'PM: "We need final priorities by Feb 14."',
      author: 'PM Lead'
    },
    attentionType: 'commitment',
    probability: 'medium',
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-01-15T10:00:00',
      activeDays: 19,
      hasAppearedBefore: true,
      previousAppearances: 3,
      origin: {
        type: 'meeting',
        description: 'The Q2 planning process started in the Jan 15 Product Roadmap Sync. You, the PM Lead, Sales, and Customer Success have been iterating on priorities for three weeks. The current draft has Enterprise SSO, Enhanced Sync, and Mobile 2.0 as the top three.'
      },
      trigger: {
        type: 'deadline',
        description: 'Feb 14 is the lock date—engineering sprint planning for Q2 starts Feb 17. PM Lead mentioned in yesterday\'s sync that Sales has a late request to prioritize the Salesforce integration. You may need to make a final call on whether it bumps something off.'
      },
      rankingRationale: 'Sprint planning starts Feb 17, late request pending'
    },
    impact: 'high',
    focusCategory: 'pulse',
    memoryRationale: 'This surfaced because the roadmap discussion has been active, and a decision point is approaching on Feb 14.',
    needsIntervention: true,
    needsDecision: true,
    collaborators: ['PM Lead', 'Sales', 'Customer Success'],
    evidence: [
      { type: 'Meeting', url: 'm-past-10', preview: 'PM: "We need final priorities by Feb 14"' }
    ]
  },
  {
    id: 'c-goal-1',
    title: 'Accelerate Q2 customer expansion momentum',
    assignee: 'Me',
    dueDate: 'End of week',
    status: 'pending',
    priority: 'High',
    okr: 'Drive Net Revenue Retention',
    context: 'Three expansion conversations are in play: Northstar (+$40K), Lumen (+$25K), and Beacon (+$18K). Each needs a different push—Northstar wants ROI proof, Lumen needs exec alignment, Beacon is waiting on security review.',
    source: {
      type: 'meeting',
      title: 'Revenue Strategy Sync',
      timestamp: 'Feb 3, 10:00 AM',
      preview: 'CS Lead: "We have a window this quarter to land these."',
      author: 'CS Lead'
    },
    attentionType: 'commitment',
    probability: 'high',
    impact: 'high',
    focusCategory: 'horizon',
    memoryRationale: 'Three expansion conversations totaling $83K are at decision stage. Q2 budget locks soon—this is the window to land them.',
    needsIntervention: true,
    needsDecision: true,
    collaborators: ['CS Lead', 'Sales', 'Security'],
    evidence: [
      { type: 'Meeting', url: 'm-strategy-sync', preview: 'CS Lead: "We have a window this quarter"' },
      { type: 'Salesforce', url: 'expansion-opps', preview: '3 opportunities at decision stage' }
    ]
  },
  {
    id: 'c6',
    title: 'Board pack preparation is underway for the Feb 20 meeting',
    assignee: 'Me',
    dueDate: 'Feb 18',
    status: 'pending',
    priority: 'High',
    okr: 'Financial Health',
    context: 'Chief of Staff is coordinating. Department inputs are due by Feb 15.',
    source: {
      type: 'document',
      title: 'Board Prep Checklist',
      timestamp: 'Feb 2, 8:00 AM',
      preview: 'Slides due by Feb 18.',
      author: 'Chief of Staff'
    },
    attentionType: 'commitment',
    probability: 'medium',
    impact: 'high',
    focusCategory: 'horizon',
    memoryRationale: 'This surfaced because the board meeting is Feb 20 and the coordination timeline has started.',
    needsIntervention: false,
    needsDecision: false,
    collaborators: ['Chief of Staff', 'CFO'],
    evidence: [
      { type: 'Document', url: 'board-checklist', preview: 'Slides due by Feb 18' }
    ]
  },
  {
    id: 'c7',
    title: 'Legal is reviewing data retention policies for new EU guidance',
    assignee: 'Legal',
    dueDate: 'Feb 20',
    status: 'pending',
    priority: 'Medium',
    okr: 'Operational Excellence',
    context: 'The EU AI Act guidance requires policy updates. Legal is tracking compliance requirements.',
    attentionType: 'commitment',
    probability: 'medium',
    impact: 'medium',
    focusCategory: 'pulse',
    memoryRationale: 'This surfaced because new regulatory guidance was published that affects your data practices.',
    needsIntervention: false,
    needsDecision: false,
    collaborators: ['Legal']
  },
  {
    id: 'c8',
    title: 'Platform team is migrating remaining API clients before deprecation',
    assignee: 'Platform Team',
    dueDate: 'Feb 25',
    status: 'pending',
    priority: 'Medium',
    okr: 'Platform Reliability',
    context: 'Legacy API deprecation is scheduled for March 1. Target is 80% traffic reduction.',
    attentionType: 'commitment',
    probability: 'medium',
    impact: 'medium',
    focusCategory: 'horizon',
    memoryRationale: 'This surfaced because the March 1 deprecation deadline is approaching.',
    needsIntervention: false,
    needsDecision: false,
    collaborators: ['Platform Team']
  },
  {
    id: 'c9',
    title: 'Customer Advisory Board planning is on track for March 1',
    assignee: 'Customer Success',
    dueDate: 'Mar 1',
    status: 'pending',
    priority: 'Low',
    okr: 'Enterprise Growth',
    context: 'Invitations are going out to top 10 accounts. Planning phase is proceeding normally.',
    attentionType: 'commitment',
    probability: 'low',
    impact: 'medium',
    focusCategory: 'pulse',
    memoryRationale: 'This surfaced as a status update—the planning is on track.',
    needsIntervention: false,
    needsDecision: false,
    collaborators: ['Customer Success']
  },
  {
    id: 'c10',
    title: 'The incident RCA is expected by tomorrow per SLA',
    assignee: 'DevOps',
    dueDate: 'Tomorrow',
    status: 'pending',
    priority: 'High',
    okr: 'Platform Reliability',
    context: 'Enterprise customers are waiting. The 48-hour SLA started when the incident was logged.',
    attentionType: 'commitment',
    probability: 'high',
    impact: 'high',
    focusCategory: 'horizon',
    memoryRationale: 'Enterprise customer affected, SLA clock is running. RCA is due within 24 hours.',
    needsIntervention: true,
    needsDecision: false,
    collaborators: ['DevOps', 'Platform Team'],
    evidence: [
      { type: 'Incident', url: 'incident-4092', preview: 'Incident started Feb 2, 08:30 AM' }
    ]
  },
  {
    id: 'c11',
    title: 'Marketing is updating the competitive battlecard after Competitor X\'s launch',
    assignee: 'Marketing',
    dueDate: 'Feb 12',
    status: 'pending',
    priority: 'Medium',
    okr: 'Enterprise Growth',
    context: 'Sales requested updated positioning materials following this morning\'s competitor news.',
    attentionType: 'commitment',
    probability: 'medium',
    impact: 'medium',
    focusCategory: 'pulse',
    memoryRationale: 'This surfaced because a competitor launched a feature that overlaps with your roadmap.',
    needsIntervention: false,
    needsDecision: false,
    collaborators: ['Marketing', 'Sales']
  },
  {
    id: 'c12',
    title: 'Q1 hiring targets are at risk of slipping',
    assignee: 'People Ops',
    dueDate: 'Feb 28',
    status: 'pending',
    priority: 'High',
    okr: 'Build World Class Team',
    context: 'Pipeline is at 67% of target for backend and GTM roles. The Q2 roadmap assumes these hires.',
    attentionType: 'commitment',
    probability: 'medium',
    impact: 'high',
    focusCategory: 'friction',
    memoryRationale: 'This surfaced because pipeline coverage dropped below the threshold needed to hit the Feb 28 deadline.',
    needsIntervention: true,
    needsDecision: false,
    collaborators: ['People Ops', 'Engineering Leads'],
    evidence: [
      { type: 'Ashby', url: 'hiring-pipeline', preview: 'Pipeline at 67% of target' }
    ]
  }
];

export const meetingBriefs: MeetingBrief[] = [
  // ... existing meeting briefs ...
  {
    id: 'm-past-1',
    title: 'Q1 All Hands',
    time: 'Jan 15, 10:00 AM',
    timestamp: '2026-01-15T10:00:00',
    attendees: ['Entire Company'],
    summary: 'CEO outlined Q1 goals: Revenue +20%, User Growth +15%. Key focus on enterprise adoption.',
    keyTopics: ['OKR Launch', 'New Hires'],
    status: 'completed',
    reportStatus: 'published',
    location: 'Zoom',
    meetingLink: 'https://zoom.us/j/123456789'
  },
  {
    id: 'm-past-2',
    title: 'Engineering Weekly',
    time: 'Jan 22, 2:00 PM',
    timestamp: '2026-01-22T14:00:00',
    attendees: ['Eng Team'],
    summary: 'Discussed migration strategy for the legacy database. Team voted for gradual rollout.',
    keyTopics: ['Migration', 'Tech Debt'],
    status: 'completed',
    reportStatus: 'published',
    location: 'In Person',
    locationDetails: 'Room 304'
  },
  {
    id: 'm-past-3',
    title: 'Daily Standup',
    time: 'Jan 23, 9:00 AM',
    timestamp: '2026-01-23T09:00:00',
    attendees: ['Core Team'],
    summary: 'Quick sync. No blockers reported.',
    keyTopics: [],
    status: 'completed',
    reportStatus: 'pending',
    location: 'Google Meet',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    isPrivate: true
  },
  {
    id: 'm-past-4',
    title: 'Design Review: Mobile',
    time: 'Jan 24, 11:00 AM',
    timestamp: '2026-01-24T11:00:00',
    attendees: ['Sarah', 'Alex', 'Sam'],
    summary: 'Approved the new navigation bar designs. Requested changes to the profile modal.',
    keyTopics: ['Mobile Nav', 'Icons'],
    status: 'completed',
    reportStatus: 'published',
    location: 'In Person',
    locationDetails: 'Creative Lab'
  },
  {
    id: 'm-past-5',
    title: 'Marketing Sync',
    time: 'Jan 25, 1:00 PM',
    timestamp: '2026-01-25T13:00:00',
    attendees: ['Jordan', 'Alex'],
    summary: 'Reviewed campaign metrics for "Project Titan". CPC is lower than expected.',
    keyTopics: ['Ad Spend', 'Conversion'],
    status: 'completed',
    reportStatus: 'none',
    location: 'Google Meet',
    meetingLink: 'https://meet.google.com/xyz-uvw-rst'
  },
  {
    id: 'm-past-6',
    title: '1:1 Manager Sync',
    time: 'Jan 26, 4:00 PM',
    timestamp: '2026-01-26T16:00:00',
    attendees: ['Alex', 'Director'],
    summary: 'Career growth discussion. Identified path to Senior Staff.',
    keyTopics: ['Promotion', 'Goals'],
    status: 'completed',
    reportStatus: 'published',
    location: 'In Person',
    locationDetails: 'Office 102'
  },
  {
    id: 'm-past-7',
    title: 'Client Intro: Acme Corp',
    time: 'Jan 27, 10:30 AM',
    timestamp: '2026-01-27T10:30:00',
    attendees: ['Sales', 'Alex', 'Client'],
    summary: 'Initial requirements gathering. They need SSO and custom retention policies.',
    keyTopics: ['SSO', 'Compliance'],
    status: 'completed',
    reportStatus: 'published',
    location: 'Zoom',
    meetingLink: 'https://zoom.us/j/987654321'
  },
  {
    id: 'm-past-8',
    title: 'Sprint Planning',
    time: 'Jan 29, 10:00 AM',
    timestamp: '2026-01-29T10:00:00',
    attendees: ['Core Team'],
    summary: 'Committed to 45 points. Stretch goal: Fix the search latency.',
    keyTopics: ['Velocity', 'Scope'],
    status: 'completed',
    reportStatus: 'published',
    location: 'In Person',
    locationDetails: 'War Room'
  },
  {
    id: 'm-past-9',
    title: 'Architecture Review',
    time: 'Jan 30, 2:00 PM',
    timestamp: '2026-01-30T14:00:00',
    attendees: ['Senior Eng', 'Alex'],
    summary: 'Approved the event-driven architecture for notifications.',
    keyTopics: ['Kafka', 'Events'],
    status: 'completed',
    reportStatus: 'pending',
    location: 'Zoom',
    meetingLink: 'https://zoom.us/j/111222333'
  },
  {
    id: 'm-past-10',
    title: 'Product Roadmap Sync',
    time: 'Feb 1, 11:00 AM',
    timestamp: '2026-02-01T11:00:00',
    attendees: ['Product', 'Eng Leads'],
    summary: 'Aligned on Q2 priorities. Dropped the legacy export feature.',
    keyTopics: ['Roadmap', 'Deprecation'],
    status: 'completed',
    reportStatus: 'published',
    location: 'In Person',
    locationDetails: 'Main Conference'
  },
  {
    id: 'm1',
    title: 'The incident response team is meeting in 15 minutes',
    time: 'In 15 mins (11:00 AM)',
    timestamp: '2026-02-02T11:00:00',
    attendees: ['DevOps', 'Alex', 'CTO'],
    summary: 'This morning\'s split-brain scenario caused 14 minutes of downtime. The team will establish root cause and draft customer communications.',
    keyTopics: ['RCA', 'Uptime'],
    status: 'scheduled',
    location: 'Zoom',
    meetingLink: 'https://zoom.us/j/incident-room',
    preMeetingBrief: {
      context: 'At 08:30 AM EST, the primary database cluster experienced a split-brain scenario during routine maintenance, causing 14 minutes of downtime.',
      goals: ['Establish the root cause of the failover failure', 'Determine why the standby replica did not promote immediately', 'Draft a communication plan for affected enterprise customers'],
      materials: ['Incident Log #4092', 'CloudProvider Status Report', 'DB Logs']
    },
    attentionType: 'meeting',
    probability: 'high',
    impact: 'high',
    focusCategory: 'pulse',
    memoryRationale: 'Three enterprise customers are affected. The post-mortem is imminent—join the call for visibility.',
    needsIntervention: true,
    needsDecision: true,
    collaborators: ['DevOps', 'CTO'],
    evidence: [
      { type: 'Incident', url: 'incident-4092', preview: '14 minutes downtime, split-brain scenario' },
      { type: 'Slack', url: '#incidents', preview: '3 enterprise customers reported issues' }
    ]
  },
  {
    id: 'm2',
    title: 'Sarah is ready to walk through the Settings redesign',
    time: 'Today, 2:00 PM',
    timestamp: '2026-02-02T14:00:00',
    attendees: ['Sarah', 'Alex'],
    summary: 'The current settings page has legacy UI patterns. Sarah redesigned it to match the new Zinc aesthetic and is ready for your review.',
    keyTopics: ['UI', 'Consistency'],
    status: 'scheduled',
    location: 'In Person',
    locationDetails: 'Design Studio',
    preMeetingBrief: {
      context: 'The current settings page has legacy UI patterns from 2024. Sarah has redesigned it to match the new "Zinc" aesthetic.',
      goals: ['Approve the new sidebar navigation for settings', 'Decide on the "Dark Mode" toggle placement', 'Review the "Account Deletion" flow'],
      materials: ['Figma Prototype Link', 'User Research Summary']
    },
    attentionType: 'meeting',
    probability: 'medium',
    impact: 'medium',
    focusCategory: 'pulse',
    memoryRationale: 'The mobile release is blocked on this review. Sarah has it ready for you—should take 15 minutes.',
    needsIntervention: true,
    needsDecision: true,
    collaborators: ['Sarah'],
    evidence: [
      { type: 'Figma', url: 'settings-redesign', preview: 'New Zinc aesthetic settings page' }
    ]
  },
  {
    id: 'm3',
    title: 'Client Sync: Beta Feedback',
    time: 'Tomorrow, 10:00 AM',
    timestamp: '2026-02-03T10:00:00',
    attendees: ['Sales', 'Alex'],
    summary: 'Gathering feedback on the new reporting engine beta.',
    keyTopics: ['Feedback', 'Bugs'],
    status: 'scheduled',
    location: 'Google Meet',
    meetingLink: 'https://meet.google.com/beta-sync'
  },
  {
    id: 'm4',
    title: 'Team Lunch',
    time: 'Tomorrow, 12:30 PM',
    timestamp: '2026-02-03T12:30:00',
    attendees: ['Entire Team'],
    summary: 'Monthly team bonding lunch.',
    keyTopics: ['Social'],
    status: 'scheduled',
    location: 'In Person',
    locationDetails: 'Joe\'s Pizza'
  },
  {
    id: 'm5',
    title: 'Q2 Goals Workshop',
    time: 'Wed, 9:00 AM',
    timestamp: '2026-02-04T09:00:00',
    attendees: ['Leadership'],
    summary: 'Defining the top 3 company objectives for next quarter.',
    keyTopics: ['Strategy', 'Growth'],
    status: 'scheduled',
    location: 'In Person',
    locationDetails: 'Board Room'
  },
  {
    id: 'm6',
    title: 'Vendor Demo: AI Tools',
    time: 'Wed, 3:00 PM',
    timestamp: '2026-02-04T15:00:00',
    attendees: ['Alex', 'Procurement'],
    summary: 'Demo of the new AI coding assistant tool.',
    keyTopics: ['AI', 'Productivity'],
    status: 'scheduled',
    location: 'Zoom',
    meetingLink: 'https://zoom.us/j/vendor-demo'
  },
  {
    id: 'm7',
    title: 'HR Benefits Review',
    time: 'Thu, 11:00 AM',
    timestamp: '2026-02-05T11:00:00',
    attendees: ['HR', 'All Staff'],
    summary: 'Annual overview of health and wellness benefits.',
    keyTopics: ['Benefits', 'Q&A'],
    status: 'scheduled',
    location: 'Zoom',
    meetingLink: 'https://zoom.us/j/hr-all-hands'
  },
  {
    id: 'm8',
    title: 'Code Review Session',
    time: 'Fri, 10:00 AM',
    timestamp: '2026-02-06T10:00:00',
    attendees: ['Frontend Team'],
    summary: 'Deep dive into the React 19 upgrade path.',
    keyTopics: ['React', 'Tech Debt'],
    status: 'scheduled',
    location: 'Google Meet',
    meetingLink: 'https://discord.gg/team-channel'
  },
  {
    id: 'm9',
    title: 'Customer QBR: Northstar',
    time: 'Fri, 2:00 PM',
    timestamp: '2026-02-06T14:00:00',
    attendees: ['CS', 'Alex', 'Northstar Team'],
    summary: 'Quarterly business review and roadmap alignment.',
    keyTopics: ['Adoption', 'Expansion'],
    status: 'scheduled',
    location: 'Zoom',
    meetingLink: 'https://zoom.us/j/qbr-northstar'
  },
  {
    id: 'm10',
    title: 'Security Architecture Review',
    time: 'Mon, 11:00 AM',
    timestamp: '2026-02-09T11:00:00',
    attendees: ['Security', 'Platform', 'Alex'],
    summary: 'Reviewing audit logging and encryption posture.',
    keyTopics: ['Security', 'Compliance'],
    status: 'scheduled',
    location: 'Google Meet',
    meetingLink: 'https://meet.google.com/sec-review'
  },
  {
    id: 'm11',
    title: 'Sales Forecast Calibration',
    time: 'Mon, 4:00 PM',
    timestamp: '2026-02-09T16:00:00',
    attendees: ['Sales Leads', 'RevOps'],
    summary: 'Aligning Q1 forecast with pipeline updates.',
    keyTopics: ['Forecast', 'Pipeline'],
    status: 'scheduled',
    location: 'In Person',
    locationDetails: 'Room 201'
  },
  {
    id: 'm12',
    title: 'Partner Integration Kickoff',
    time: 'Tue, 9:30 AM',
    timestamp: '2026-02-10T09:30:00',
    attendees: ['BizDev', 'Engineering', 'Partner Team'],
    summary: 'Kickoff for the new integration partnership.',
    keyTopics: ['Integrations', 'Timeline'],
    status: 'scheduled',
    location: 'Zoom',
    meetingLink: 'https://zoom.us/j/partner-kickoff'
  },
  {
    id: 'm13',
    title: 'Leadership Offsite Retro',
    time: 'Jan 31, 3:00 PM',
    timestamp: '2026-01-31T15:00:00',
    attendees: ['Leadership'],
    summary: 'Post-offsite reflections and next steps.',
    keyTopics: ['Strategy', 'Alignment'],
    status: 'completed',
    reportStatus: 'published',
    location: 'In Person',
    locationDetails: 'Offsite'
  },
  {
    id: 'm14',
    title: 'Design System Guild',
    time: 'Jan 28, 1:00 PM',
    timestamp: '2026-01-28T13:00:00',
    attendees: ['Design', 'Frontend'],
    summary: 'Shared updates on new tokens and accessibility pass.',
    keyTopics: ['Accessibility', 'Tokens'],
    status: 'completed',
    reportStatus: 'published',
    location: 'Google Meet',
    meetingLink: 'https://meet.google.com/design-guild'
  },
  {
    id: 'm15',
    title: 'Private 1:1 — Performance',
    time: 'Jan 27, 5:00 PM',
    timestamp: '2026-01-27T17:00:00',
    attendees: ['Alex', 'Direct Report'],
    summary: 'Career growth and performance check-in.',
    keyTopics: ['Career', 'Performance'],
    status: 'completed',
    reportStatus: 'published',
    location: 'In Person',
    locationDetails: 'Office 4B',
    isPrivate: true
  },
  {
    id: 'm16',
    title: 'Partner Enablement Sync',
    time: 'Jan 26, 9:00 AM',
    timestamp: '2026-01-26T09:00:00',
    attendees: ['Partner', 'Enablement'],
    summary: 'Enablement materials and certification checklist.',
    keyTopics: ['Enablement', 'Training'],
    status: 'completed',
    reportStatus: 'pending',
    location: 'Zoom',
    meetingLink: 'https://zoom.us/j/enablement'
  }
];

export const memoryMap = {
  topics: [
    { id: 't1', text: 'Mobile Navigation Redesign', source: 'Product Spec', timestamp: '2h ago', context: 'Active discussion' },
    { id: 't2', text: 'Q3 OkRs', source: 'All Hands Deck', timestamp: 'Yesterday', context: 'Drafting phase' },
    { id: 't3', text: 'Enterprise Security Review', source: 'Email Thread', timestamp: '2 days ago', context: 'Pending audit' },
    { id: 't4', text: 'Northstar Expansion Plan', source: 'CS Notes', timestamp: '3 days ago', context: 'Negotiation' },
    { id: 't5', text: 'Data Retention Policy', source: 'Legal Update', timestamp: '4 days ago', context: 'Policy change' }
  ] as MemoryItem[],
  decisions: [
    { id: 'd1', text: 'Approved: Switch to consumption-based pricing', source: 'Pricing Committee', timestamp: 'Yesterday', context: 'Effective Q2' },
    { id: 'd2', text: 'Rejected: New vendor for analytics', source: 'Procurement', timestamp: '3 days ago', context: 'Budget constraints' },
    { id: 'd3', text: 'Adopted: New incident response playbook', source: 'Ops Review', timestamp: '1 week ago', context: 'Improves MTTR' }
  ] as MemoryItem[],
  changes: [
    { id: 'ch1', text: 'Updated API Rate Limits', source: 'Changelog', timestamp: '4h ago', context: 'v2.1.0' },
    { id: 'ch2', text: 'Revised Remote Work Policy', source: 'HR Wiki', timestamp: '1 day ago', context: 'Effective immediately' },
    { id: 'ch3', text: 'New audit logging retention window', source: 'Security Update', timestamp: '2 days ago', context: '90 days' }
  ] as MemoryItem[]
};

// ============================================================================
// RELATIONSHIP ALERTS - For low-meeting users
// These surface when relationships need nurturing
// ============================================================================

export const relationshipAlerts: RelationshipAlert[] = [
  {
    id: 'rel-1',
    contactId: 'c-sarah',
    contactName: 'Sarah Chen',
    contactRole: 'VP Engineering',
    contactCompany: 'Northstar Inc.',
    contactAvatar: 'SC',
    title: "Haven't connected with Sarah in 3 weeks",
    description: 'Sarah mentioned budget concerns in your last conversation. The quarter is ending soon.',
    lastContactDate: '2026-01-15T10:00:00',
    daysSinceContact: 21,
    relationshipStrength: 'cooling',
    suggestedAction: 'Send a quick check-in email about the budget discussion',
    recentContext: 'Discussed Q1 budget allocation and potential contract expansion',
    attentionType: 'relationship',
    probability: 'high',
    impact: 'high',
    needsIntervention: true,
    needsDecision: false,
    memoryRationale: 'Sarah mentioned budget concerns in your last call. The quarter ends soon—worth checking in before decisions are made.',
    evidence: [
      { type: 'Email', url: '#', preview: 'Re: Q1 Budget Discussion - Jan 15' },
      { type: 'LinkedIn', url: '#', preview: 'Sarah posted about new initiatives' }
    ],
    collaborators: ['Mike Rodriguez'],
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-01-25T10:00:00',
      activeDays: 9,
      hasAppearedBefore: true,
      previousAppearances: 1,
      origin: {
        type: 'conversation',
        description: 'Your last call with Sarah was Jan 15, where she raised concerns about their Q1 budget allocation. She said: "We might need to delay the expansion if the numbers don\'t work out." You agreed to reconnect after she spoke with finance.'
      },
      trigger: {
        type: 'inactivity',
        description: 'It\'s been 21 days since that call. Northstar\'s Q1 ends Feb 28—budget decisions are likely being finalized now. Sarah also posted on LinkedIn yesterday about "exciting initiatives" which could be a good conversation starter.'
      },
      rankingRationale: 'Key relationship cooling, budget decisions imminent'
    }
  },
  {
    id: 'rel-2',
    contactId: 'c-david',
    contactName: 'David Park',
    contactRole: 'CTO',
    contactCompany: 'TechFlow',
    contactAvatar: 'DP',
    title: 'David asked for a follow-up you never sent',
    description: 'In your last email, David asked about the API documentation. You said you\'d send it over.',
    lastContactDate: '2026-01-28T14:30:00',
    daysSinceContact: 8,
    relationshipStrength: 'warm',
    suggestedAction: 'Send the API documentation with an apology for the delay',
    recentContext: 'Technical evaluation of integration possibilities',
    attentionType: 'followup',
    probability: 'high',
    impact: 'medium',
    needsIntervention: true,
    needsDecision: false,
    memoryRationale: 'You promised David the API docs 8 days ago. He\'s in the middle of a technical evaluation—sending it now shows reliability.',
    evidence: [
      { type: 'Email', url: '#', preview: 'Re: API Integration Questions - Jan 28' }
    ],
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-01-30T10:00:00',
      activeDays: 4,
      hasAppearedBefore: true,
      previousAppearances: 1,
      origin: {
        type: 'conversation',
        description: 'David emailed on Jan 28 asking about rate limits and authentication. You replied: "I\'ll send over the full API docs tomorrow—they cover all of this in detail."'
      },
      trigger: {
        type: 'inactivity',
        description: 'It\'s been 8 days since your promise. TechFlow is actively evaluating integration options—their engineering team has a decision meeting next week. The longer you wait, the more it signals unreliability.'
      },
      rankingRationale: 'Unfulfilled promise, active technical evaluation'
    }
  },
  {
    id: 'rel-3',
    contactId: 'c-maria',
    contactName: 'Maria Santos',
    contactRole: 'Director of Ops',
    contactCompany: 'Acme Corp',
    contactAvatar: 'MS',
    title: 'Maria\'s company just announced a new initiative',
    description: 'Acme Corp announced a digital transformation initiative. This aligns with your conversation about modernization.',
    lastContactDate: '2026-01-20T09:00:00',
    daysSinceContact: 16,
    relationshipStrength: 'warm',
    suggestedAction: 'Congratulate Maria and offer relevant insights',
    recentContext: 'Discussed their legacy system challenges',
    attentionType: 'relationship',
    probability: 'medium',
    impact: 'high',
    needsIntervention: true,
    needsDecision: false,
    memoryRationale: 'Acme just announced a $10M digital transformation—this is exactly what you and Maria discussed. A timely note could open doors.',
    evidence: [
      { type: 'News', url: '#', preview: 'Acme Corp Announces $10M Digital Transformation' },
      { type: 'Email', url: '#', preview: 'Re: Legacy System Discussion - Jan 20' }
    ],
    memory: {
      lifecycleState: 'entered',
      enteredAt: '2026-02-02T08:00:00',
      activeDays: 0,
      hasAppearedBefore: false,
      origin: {
        type: 'signal',
        description: 'Market Intelligence flagged Acme Corp\'s press release this morning. You last spoke with Maria on Jan 20 about their legacy system challenges—she mentioned they were "exploring options but nothing formal yet."'
      },
      trigger: {
        type: 'external_signal',
        description: 'The $10M digital transformation initiative was just announced. Maria will likely be involved given her Ops role. A congratulatory note that references your earlier conversation shows you pay attention and positions you well for the RFP process.'
      },
      rankingRationale: 'Natural touchpoint, potential large opportunity'
    }
  },
  {
    id: 'rel-4',
    contactId: 'c-james',
    contactName: 'James Wilson',
    contactRole: 'Investor',
    contactCompany: 'Sequoia Capital',
    contactAvatar: 'JW',
    title: 'Quarterly check-in with James is overdue',
    description: 'You committed to quarterly updates with your investors. Last update was 4 months ago.',
    lastContactDate: '2025-10-05T15:00:00',
    daysSinceContact: 123,
    relationshipStrength: 'cold',
    suggestedAction: 'Schedule a call and prepare a brief update deck',
    recentContext: 'Q3 investor update meeting',
    attentionType: 'relationship',
    probability: 'high',
    impact: 'high',
    needsIntervention: true,
    needsDecision: false,
    memoryRationale: 'You promised quarterly updates but it\'s been 4 months. James is a board member—silence makes investors nervous.',
    evidence: [
      { type: 'Calendar', url: '#', preview: 'Q3 Investor Update - Oct 5' },
      { type: 'Email', url: '#', preview: 'Thanks for the update - James' }
    ],
    collaborators: ['CEO', 'CFO'],
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-01-05T10:00:00',
      activeDays: 29,
      hasAppearedBefore: true,
      previousAppearances: 2,
      origin: {
        type: 'commitment',
        description: 'After the Series A, you committed to quarterly investor updates. James specifically mentioned appreciating transparency in his post-Q3 email: "This is exactly the level of detail we like to see. Looking forward to the Q4 update."'
      },
      trigger: {
        type: 'inactivity',
        description: 'It\'s now February—Q4 update is over a month overdue. James hasn\'t reached out, which could mean he\'s busy or concerned. Either way, proactive communication is better than reactive. The board meeting is Feb 20.'
      },
      rankingRationale: 'Board member, commitment broken, meeting approaching'
    }
  }
];

// ============================================================================
// ASYNC COMMITMENTS - Promises made via email, Slack, etc. (not meetings)
// For users who don't have many meetings but make commitments async
// ============================================================================

export const asyncCommitments: Commitment[] = [
  {
    id: 'async-1',
    title: 'Send revised proposal to TechFlow',
    assignee: 'Me',
    dueDate: '2026-02-06',
    status: 'pending',
    priority: 'High',
    context: 'David Park asked for pricing options with volume discounts. You said you\'d send by end of week.',
    source: {
      type: 'email',
      title: 'Re: Partnership Proposal',
      author: 'David Park',
      timestamp: '2026-02-03T09:15:00',
      preview: '"Looking forward to seeing the revised numbers..."'
    },
    attentionType: 'commitment',
    probability: 'high',
    impact: 'high',
    needsIntervention: false,
    needsDecision: true,
    memoryRationale: 'You promised this by end of week—$200K deal depends on it. David is expecting it tomorrow.',
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-02-03T09:15:00',
      activeDays: 2,
      hasAppearedBefore: false,
      origin: {
        type: 'conversation',
        description: 'David replied to your proposal on Feb 3 asking for volume discount options. You said you\'d have a revised proposal by end of week.'
      },
      trigger: {
        type: 'deadline',
        description: 'End of week is tomorrow. David mentioned their evaluation committee meets Monday, so they need it before then to include you in their final shortlist.'
      },
      rankingRationale: 'Large deal, deadline tomorrow'
    }
  },
  {
    id: 'async-2',
    title: 'Review PR for mobile sync feature',
    assignee: 'Me',
    dueDate: '2026-02-05',
    status: 'overdue',
    priority: 'Medium',
    context: 'Alex tagged you in #engineering asking for review. The feature is blocking the release.',
    source: {
      type: 'slack',
      title: '#engineering',
      channel: '#engineering',
      author: 'Alex Rivera',
      timestamp: '2026-02-02T16:45:00',
      preview: '"@you can you review this? Blocking mobile release"',
      threadUrl: 'https://slack.com/archives/C01234/p1234567890'
    },
    attentionType: 'blocker',
    probability: 'high',
    impact: 'medium',
    needsIntervention: true,
    needsDecision: false,
    memoryRationale: 'Alex and the mobile team have been waiting 2 days. The release is blocked on your review.',
    collaborators: ['Alex Rivera', 'Mobile Team'],
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-02-02T16:45:00',
      activeDays: 3,
      hasAppearedBefore: true,
      previousAppearances: 1,
      origin: {
        type: 'conversation',
        description: 'Alex tagged you in #engineering on Feb 2: "@you can you review this? Blocking mobile release." The PR implements the sync optimization you discussed in the architecture review.'
      },
      trigger: {
        type: 'dependency_change',
        description: 'It\'s now 2 days overdue. Alex followed up yesterday and the mobile team mentioned in standup they\'re waiting on this to cut the release. A 30-minute review today would unblock them.'
      },
      rankingRationale: 'Team blocked, overdue, quick to resolve'
    }
  },
  {
    id: 'async-3',
    title: 'Provide feedback on Q1 OKRs draft',
    assignee: 'Me',
    dueDate: '2026-02-07',
    status: 'pending',
    priority: 'Medium',
    context: 'Leadership shared the OKRs doc for input. Comments due before Friday planning.',
    source: {
      type: 'notion',
      title: 'Q1 2026 OKRs [DRAFT]',
      author: 'Leadership',
      timestamp: '2026-02-01T10:00:00',
      preview: 'Please add your comments by EOD Friday'
    },
    attentionType: 'commitment',
    probability: 'medium',
    impact: 'medium',
    needsIntervention: false,
    needsDecision: true,
    memoryRationale: 'Comments are due Friday before the planning meeting. Your input shapes where resources go next quarter.',
    memory: {
      lifecycleState: 'persisting',
      enteredAt: '2026-02-01T10:00:00',
      activeDays: 4,
      hasAppearedBefore: false,
      origin: {
        type: 'document',
        description: 'Leadership shared the Q1 OKRs draft in Notion on Feb 1 with a request for input by Friday. The doc has comments from 4 people so far but not from you.'
      },
      trigger: {
        type: 'deadline',
        description: 'Friday planning is in 2 days. Last quarter you missed the comment window and had to raise concerns in the meeting itself—which took longer and felt disruptive.'
      },
      rankingRationale: 'Comment window closing, shapes Q1 direction'
    }
  },
  {
    id: 'async-4',
    title: 'Submit expense report for conference',
    assignee: 'Me',
    dueDate: '2026-02-10',
    status: 'pending',
    priority: 'Low',
    context: 'Finance sent a reminder that January expenses need to be submitted by the 10th.',
    source: {
      type: 'email',
      title: 'Reminder: January Expense Reports Due',
      author: 'Finance Team',
      timestamp: '2026-02-01T08:00:00',
      preview: 'Please submit all January expenses by Feb 10'
    },
    attentionType: 'commitment',
    probability: 'medium',
    impact: 'low',
    needsIntervention: false,
    needsDecision: false,
    memoryRationale: 'Not urgent but easy to keep pushing off. The deadline is Feb 10.'
  },
  {
    id: 'async-5',
    title: 'Respond to customer support escalation',
    assignee: 'Me',
    dueDate: '2026-02-05',
    status: 'pending',
    priority: 'High',
    context: 'Support escalated a technical issue from Northstar. They need engineering input on the workaround.',
    source: {
      type: 'slack',
      title: '#support-escalations',
      channel: '#support-escalations',
      author: 'Support Team',
      timestamp: '2026-02-04T11:30:00',
      preview: '"@eng-oncall Northstar hitting rate limits, need guidance"',
      threadUrl: 'https://slack.com/archives/C05678/p9876543210'
    },
    attentionType: 'blocker',
    probability: 'high',
    impact: 'high',
    needsIntervention: true,
    needsDecision: true,
    memoryRationale: 'Northstar is your largest account and they\'re hitting rate limits. Support needs engineering guidance on a workaround.',
    collaborators: ['Support Team', 'Sarah Chen'],
    memory: {
      lifecycleState: 'entered',
      enteredAt: '2026-02-04T11:30:00',
      activeDays: 1,
      hasAppearedBefore: false,
      origin: {
        type: 'signal',
        description: 'Support escalated in #support-escalations at 11:30 AM yesterday. Northstar is hitting rate limits during their end-of-month processing and needs a workaround.'
      },
      trigger: {
        type: 'external_signal',
        description: 'This is time-sensitive—Northstar\'s end-of-month processing continues through tomorrow. Either a temporary rate limit increase or a batching workaround would help. Sarah from CS is standing by to relay the solution.'
      },
      rankingRationale: 'Largest account, time-sensitive, SLA risk'
    }
  }
];

// ============================================================================
// CRM CONTACTS
// ============================================================================

export const contacts: Contact[] = [
  {
    id: 'contact-1',
    firstName: 'Sarah',
    lastName: 'Chen',
    company: 'Northstar Inc.',
    companyId: 'company-1',
    title: 'VP Engineering',
    email: 'sarah.chen@northstar.io',
    phone: '+1 (415) 555-0123',
    linkedIn: 'linkedin.com/in/sarahchen',
    location: 'San Francisco, CA',
    relationship: 'key_stakeholder',
    warmth: 'cool',
    category: 'client',
    tags: ['Enterprise', 'Technical', 'Q1 Priority'],
    aiSummary: 'Key decision-maker for Northstar\'s $500K contract. Technical background, prefers data-driven discussions. Recently expressed budget concerns.',
    talkingPoints: ['Follow up on budget concerns', 'Share API performance benchmarks', 'Discuss Q2 roadmap alignment'],
    risks: ['Budget constraints may delay expansion', 'Competitor demo scheduled'],
    lastContacted: '2026-01-15',
    nextFollowUp: '2026-02-06',
    interactions: [
      { id: 'i1', type: 'email', date: '2026-01-15', subject: 'Re: Q1 Budget Discussion', summary: 'Discussed budget allocation concerns', sentiment: 'neutral' },
      { id: 'i2', type: 'meeting', date: '2026-01-08', subject: 'Quarterly Business Review', summary: 'Positive review, raised pricing concerns', sentiment: 'positive' }
    ],
    notes: 'Prefers async communication. Responds within 24h.',
    probability: 'high',
    impact: 'high',
    needsAttention: true,
    attentionReason: '21 days since contact. Budget concerns unaddressed.'
  },
  {
    id: 'contact-2',
    firstName: 'David',
    lastName: 'Park',
    company: 'TechFlow',
    companyId: 'company-2',
    title: 'CTO',
    email: 'david.park@techflow.com',
    phone: '+1 (650) 555-0456',
    location: 'Palo Alto, CA',
    relationship: 'champion',
    warmth: 'warm',
    category: 'client',
    tags: ['Technical', 'Integration', 'Active Eval'],
    aiSummary: 'Technical champion at TechFlow. Strong advocate. Currently evaluating integration options.',
    talkingPoints: ['Send API documentation', 'Discuss webhook timeline', 'Offer technical deep-dive'],
    lastContacted: '2026-01-28',
    nextFollowUp: '2026-02-05',
    interactions: [
      { id: 'i4', type: 'email', date: '2026-01-28', subject: 'API Integration Questions', summary: 'Requested API docs and webhook specs', sentiment: 'positive' },
      { id: 'i5', type: 'call', date: '2026-01-20', subject: 'Technical Discovery', summary: 'Deep dive into architecture. Very engaged.', sentiment: 'positive' }
    ],
    notes: 'Very technical, appreciates detailed docs. Q1 decision timeline.',
    probability: 'high',
    impact: 'medium',
    needsAttention: true,
    attentionReason: 'Requested API docs 8 days ago - still pending.'
  },
  {
    id: 'contact-3',
    firstName: 'Maria',
    lastName: 'Santos',
    company: 'Acme Corp',
    companyId: 'company-3',
    title: 'Director of Operations',
    email: 'maria.santos@acme.com',
    location: 'New York, NY',
    relationship: 'decision_maker',
    warmth: 'warm',
    category: 'client',
    tags: ['Enterprise', 'Operations', 'Digital Transform'],
    aiSummary: 'Leading Acme\'s $10M digital transformation. Strong budget authority.',
    talkingPoints: ['Congratulate on transformation announcement', 'Discuss platform fit', 'Propose pilot program'],
    lastContacted: '2026-01-20',
    interactions: [
      { id: 'i6', type: 'meeting', date: '2026-01-20', subject: 'Legacy System Discussion', summary: 'Discussed modernization needs', sentiment: 'positive' }
    ],
    notes: 'Met at CloudConf 2025. Interested in efficiency gains.',
    probability: 'medium',
    impact: 'high',
    needsAttention: true,
    attentionReason: 'Company announced major initiative - timely outreach opportunity.'
  },
  {
    id: 'contact-4',
    firstName: 'James',
    lastName: 'Wilson',
    company: 'Sequoia Capital',
    companyId: 'company-4',
    title: 'Partner',
    email: 'james.wilson@sequoia.com',
    location: 'Menlo Park, CA',
    relationship: 'key_stakeholder',
    warmth: 'cold',
    category: 'investor',
    tags: ['Board', 'Investor', 'Quarterly Update'],
    aiSummary: 'Lead investor and board member. Expects quarterly updates. Last update was 4 months ago.',
    talkingPoints: ['Apologize for delayed update', 'Share Q4 metrics', 'Discuss fundraising timeline'],
    risks: ['Trust erosion from silence', 'May reduce support'],
    lastContacted: '2025-10-05',
    nextFollowUp: '2026-02-01',
    interactions: [
      { id: 'i8', type: 'meeting', date: '2025-10-05', subject: 'Q3 Board Meeting', summary: 'Quarterly update. Positive reception.', sentiment: 'positive' }
    ],
    notes: 'Very busy. Prefers concise updates with clear metrics.',
    probability: 'high',
    impact: 'high',
    needsAttention: true,
    attentionReason: '4 months since contact. Quarterly commitment broken.'
  },
  {
    id: 'contact-5',
    firstName: 'Emily',
    lastName: 'Thompson',
    company: 'CloudScale',
    companyId: 'company-5',
    title: 'Head of Partnerships',
    email: 'emily.t@cloudscale.io',
    location: 'Seattle, WA',
    relationship: 'influencer',
    warmth: 'hot',
    category: 'partner',
    tags: ['Partnership', 'Integration', 'Active'],
    aiSummary: 'Driving partnership integration. Very responsive and engaged. Strong internal champion.',
    talkingPoints: ['Review integration progress', 'Discuss co-marketing', 'Plan Q2 webinar'],
    lastContacted: '2026-02-01',
    interactions: [
      { id: 'i10', type: 'meeting', date: '2026-02-01', subject: 'Partnership Sync', summary: 'On track for Q1 launch.', sentiment: 'positive' },
      { id: 'i11', type: 'slack', date: '2026-01-30', subject: 'API changes', summary: 'Coordinated on version changes', sentiment: 'positive' }
    ],
    notes: 'Excellent collaborator. Weekly syncs working well.',
    probability: 'low',
    impact: 'medium',
    needsAttention: false
  },
  {
    id: 'contact-6',
    firstName: 'Michael',
    lastName: 'Brown',
    company: 'DataDriven Inc.',
    companyId: 'company-6',
    title: 'CEO',
    email: 'michael.brown@datadriven.co',
    phone: '+1 (312) 555-0789',
    location: 'Chicago, IL',
    relationship: 'decision_maker',
    warmth: 'new',
    category: 'client',
    tags: ['New Lead', 'Enterprise', 'Inbound'],
    aiSummary: 'New inbound lead. Company is good fit for enterprise tier. Recently raised Series B.',
    talkingPoints: ['Understand tech stack', 'Learn growth plans', 'Propose discovery call'],
    lastContacted: '2026-02-03',
    interactions: [
      { id: 'i13', type: 'email', date: '2026-02-03', subject: 'Thanks for reaching out', summary: 'Scheduled intro call.', sentiment: 'positive' }
    ],
    notes: 'Inbound from pricing page. Already did research.',
    probability: 'medium',
    impact: 'medium',
    needsAttention: false
  },
  {
    id: 'contact-7',
    firstName: 'Lisa',
    lastName: 'Anderson',
    company: 'FinanceFirst',
    companyId: 'company-7',
    title: 'VP Product',
    email: 'lisa.anderson@financefirst.com',
    location: 'Boston, MA',
    relationship: 'blocker',
    warmth: 'cool',
    category: 'client',
    tags: ['Enterprise', 'Security Concerns', 'Legal Review'],
    aiSummary: 'Raised security and compliance concerns blocking the deal. Needs detailed documentation.',
    talkingPoints: ['Address SOC 2 questions', 'Share security whitepaper', 'Connect with security team'],
    risks: ['Could derail deal', 'Competitor has better compliance story'],
    lastContacted: '2026-01-22',
    interactions: [
      { id: 'i14', type: 'email', date: '2026-01-22', subject: 'Security Documentation', summary: 'Requested compliance docs', sentiment: 'neutral' },
      { id: 'i15', type: 'meeting', date: '2026-01-15', subject: 'Product Demo', summary: 'Raised data handling concerns', sentiment: 'negative' }
    ],
    notes: 'Very security-conscious. Regulated industry.',
    probability: 'high',
    impact: 'high',
    needsAttention: true,
    attentionReason: 'Security concerns blocking deal. 2 weeks without follow-up.'
  },
  {
    id: 'contact-8',
    firstName: 'Alex',
    lastName: 'Rivera',
    company: 'Sentra',
    companyId: 'company-8',
    title: 'Backend Engineer',
    email: 'alex.rivera@sentra.io',
    location: 'Austin, TX',
    relationship: 'contact',
    warmth: 'hot',
    category: 'team',
    tags: ['Engineering', 'Backend', 'API'],
    aiSummary: 'Internal team member. Backend specialist. Key resource for technical support.',
    lastContacted: '2026-02-04',
    interactions: [
      { id: 'i16', type: 'slack', date: '2026-02-04', subject: 'Rate limit discussion', summary: 'Discussed architecture for enterprise', sentiment: 'positive' }
    ],
    notes: 'Go-to for API questions. Helpful with escalations.',
    needsAttention: false
  }
];

// ============================================================================
// CRM COMPANIES
// ============================================================================

export const companies: Company[] = [
  {
    id: 'company-1',
    name: 'Northstar Inc.',
    domain: 'northstar.io',
    industry: 'Enterprise Software',
    size: '500-1000',
    location: 'San Francisco, CA',
    website: 'https://northstar.io',
    linkedIn: 'linkedin.com/company/northstar',
    status: 'active',
    tier: 'enterprise',
    category: 'client',
    tags: ['Enterprise', 'Q1 Priority', 'At Risk'],
    totalValue: 500000,
    activeDeals: [
      { id: 'deal-1', name: 'Enterprise Expansion', value: 250000, stage: 'negotiation', closeDate: '2026-03-15', probability: 60 }
    ],
    aiSummary: 'Key enterprise client with $500K contract. Currently in negotiation for expansion but facing budget headwinds. Primary contact (Sarah Chen) has gone quiet.',
    keyInsights: ['Budget concerns raised in last QBR', 'Competitor demo scheduled with engineering team', 'Contract renewal in 90 days'],
    risks: ['Champion going silent (21 days)', 'Competitor gaining traction', 'Budget freeze possible'],
    opportunities: ['Expansion into 2 new departments', 'API integration could increase stickiness'],
    lastActivity: '2026-01-15',
    totalInteractions: 12,
    activities: [
      { id: 'ca-1', type: 'email', title: 'Re: Q1 Budget Discussion', summary: 'Sarah discussed budget allocation concerns', date: '2026-01-15', contactId: 'contact-1' },
      { id: 'ca-2', type: 'meeting', title: 'Quarterly Business Review', summary: 'Positive review overall, pricing concerns raised', date: '2026-01-08', participants: ['Sarah Chen', 'Mike Ross'], contactId: 'contact-1' }
    ],
    contactIds: ['contact-1'],
    primaryContactId: 'contact-1',
    needsAttention: true,
    attentionReason: 'High-value at-risk account. Primary contact silent 21 days.'
  },
  {
    id: 'company-2',
    name: 'TechFlow',
    domain: 'techflow.com',
    industry: 'Developer Tools',
    size: '100-250',
    location: 'Palo Alto, CA',
    website: 'https://techflow.com',
    status: 'prospect',
    tier: 'growth',
    category: 'client',
    tags: ['Technical', 'Integration', 'Active Eval'],
    activeDeals: [
      { id: 'deal-2', name: 'Growth Plan', value: 75000, stage: 'proposal', closeDate: '2026-02-28', probability: 70 }
    ],
    aiSummary: 'Strong technical fit. CTO is a champion. Currently in active evaluation phase with Q1 decision timeline.',
    keyInsights: ['CTO very engaged technically', 'Integration feasibility is key', 'Quick decision-making culture'],
    opportunities: ['Technical deep-dive could close the deal', 'Case study potential'],
    lastActivity: '2026-01-28',
    totalInteractions: 6,
    activities: [
      { id: 'ca-3', type: 'email', title: 'API Integration Questions', summary: 'Requested detailed API docs and webhook specs', date: '2026-01-28', contactId: 'contact-2' },
      { id: 'ca-4', type: 'call', title: 'Technical Discovery', summary: 'Deep dive into architecture. Very engaged.', date: '2026-01-20', participants: ['David Park'], contactId: 'contact-2' }
    ],
    contactIds: ['contact-2'],
    primaryContactId: 'contact-2',
    needsAttention: true,
    attentionReason: 'Waiting for API docs response (8 days). Deal momentum at risk.'
  },
  {
    id: 'company-3',
    name: 'Acme Corp',
    domain: 'acme.com',
    industry: 'Manufacturing',
    size: '5000+',
    location: 'New York, NY',
    website: 'https://acme.com',
    linkedIn: 'linkedin.com/company/acme',
    status: 'prospect',
    tier: 'enterprise',
    category: 'client',
    tags: ['Enterprise', 'Digital Transform', 'New Opportunity'],
    activeDeals: [
      { id: 'deal-3', name: 'Digital Transformation Platform', value: 500000, stage: 'qualified', closeDate: '2026-06-30', probability: 40 }
    ],
    aiSummary: 'Large enterprise undergoing $10M digital transformation. Early stage opportunity with strong potential. Decision-maker engaged.',
    keyInsights: ['Major transformation initiative announced', 'Legacy systems pain point', 'Budget allocated for modernization'],
    opportunities: ['Land-and-expand potential', 'Multi-department rollout possible'],
    lastActivity: '2026-01-20',
    totalInteractions: 3,
    activities: [
      { id: 'ca-5', type: 'meeting', title: 'Legacy System Discussion', summary: 'Discussed modernization needs and platform fit', date: '2026-01-20', participants: ['Maria Santos'], contactId: 'contact-3' }
    ],
    contactIds: ['contact-3'],
    primaryContactId: 'contact-3',
    needsAttention: true,
    attentionReason: 'Timely outreach opportunity - company announced major initiative.'
  },
  {
    id: 'company-4',
    name: 'Sequoia Capital',
    domain: 'sequoiacap.com',
    industry: 'Venture Capital',
    size: '100-250',
    location: 'Menlo Park, CA',
    website: 'https://sequoiacap.com',
    status: 'active',
    category: 'investor',
    tags: ['Board', 'Lead Investor', 'Quarterly Update'],
    aiSummary: 'Lead investor and board member. Relationship at risk due to 4 months of silence. Quarterly commitment not maintained.',
    keyInsights: ['Expects quarterly updates', 'Last update was October', 'May reduce engagement if pattern continues'],
    risks: ['Trust erosion from silence', 'Reduced support at board level'],
    lastActivity: '2025-10-05',
    totalInteractions: 8,
    activities: [
      { id: 'ca-6', type: 'meeting', title: 'Q3 Board Meeting', summary: 'Quarterly update delivered. Positive reception.', date: '2025-10-05', participants: ['James Wilson'], contactId: 'contact-4' }
    ],
    contactIds: ['contact-4'],
    primaryContactId: 'contact-4',
    needsAttention: true,
    attentionReason: '4 months since contact. Quarterly commitment broken. Critical relationship.'
  },
  {
    id: 'company-5',
    name: 'CloudScale',
    domain: 'cloudscale.io',
    industry: 'Cloud Infrastructure',
    size: '250-500',
    location: 'Seattle, WA',
    website: 'https://cloudscale.io',
    status: 'active',
    category: 'partner',
    tags: ['Partnership', 'Integration', 'Active'],
    aiSummary: 'Strategic partnership with active integration work. Relationship is healthy with regular touchpoints. Q1 launch on track.',
    keyInsights: ['Integration on track for Q1', 'Co-marketing planned', 'Weekly syncs working well'],
    opportunities: ['Co-marketing webinar in Q2', 'Case study opportunity'],
    lastActivity: '2026-02-01',
    totalInteractions: 15,
    activities: [
      { id: 'ca-7', type: 'meeting', title: 'Partnership Sync', summary: 'Reviewed integration progress. On track for Q1 launch.', date: '2026-02-01', participants: ['Emily Thompson'], contactId: 'contact-5' },
      { id: 'ca-8', type: 'note', title: 'API changes coordination', summary: 'Coordinated on version changes via Slack', date: '2026-01-30', contactId: 'contact-5' }
    ],
    contactIds: ['contact-5'],
    primaryContactId: 'contact-5',
    needsAttention: false
  },
  {
    id: 'company-6',
    name: 'DataDriven Inc.',
    domain: 'datadriven.co',
    industry: 'Data Analytics',
    size: '50-100',
    location: 'Chicago, IL',
    website: 'https://datadriven.co',
    status: 'prospect',
    tier: 'growth',
    category: 'client',
    tags: ['New Lead', 'Inbound', 'Series B'],
    activeDeals: [
      { id: 'deal-4', name: 'Growth Platform', value: 50000, stage: 'lead', closeDate: '2026-04-30', probability: 30 }
    ],
    aiSummary: 'New inbound lead with strong fit indicators. Recently raised Series B, actively evaluating solutions. CEO engaged directly.',
    keyInsights: ['Inbound from pricing page', 'Already did research before outreach', 'Good enterprise fit'],
    opportunities: ['Fast-track opportunity', 'Land-and-expand potential'],
    lastActivity: '2026-02-03',
    totalInteractions: 2,
    activities: [
      { id: 'ca-9', type: 'email', title: 'Thanks for reaching out', summary: 'Initial response. Scheduled intro call.', date: '2026-02-03', contactId: 'contact-6' }
    ],
    contactIds: ['contact-6'],
    primaryContactId: 'contact-6',
    needsAttention: false
  },
  {
    id: 'company-7',
    name: 'FinanceFirst',
    domain: 'financefirst.com',
    industry: 'Financial Services',
    size: '1000-5000',
    location: 'Boston, MA',
    website: 'https://financefirst.com',
    linkedIn: 'linkedin.com/company/financefirst',
    status: 'prospect',
    tier: 'enterprise',
    category: 'client',
    tags: ['Enterprise', 'Security Concerns', 'Blocked'],
    activeDeals: [
      { id: 'deal-5', name: 'Enterprise Platform', value: 300000, stage: 'negotiation', closeDate: '2026-03-31', probability: 40 }
    ],
    aiSummary: 'Large enterprise deal blocked by security and compliance concerns. VP Product has raised multiple objections that need addressing.',
    keyInsights: ['Regulated industry with strict compliance requirements', 'Security documentation gap is blocking progress', 'Competitor has better compliance positioning'],
    risks: ['Deal derailment risk', 'Security objections unaddressed', 'Competitor advantage'],
    lastActivity: '2026-01-22',
    totalInteractions: 5,
    activities: [
      { id: 'ca-10', type: 'email', title: 'Security Documentation', summary: 'Requested SOC 2 and compliance documentation', date: '2026-01-22', contactId: 'contact-7' },
      { id: 'ca-11', type: 'meeting', title: 'Product Demo', summary: 'Demo went well but data handling concerns raised', date: '2026-01-15', participants: ['Lisa Anderson'], contactId: 'contact-7' }
    ],
    contactIds: ['contact-7'],
    primaryContactId: 'contact-7',
    needsAttention: true,
    attentionReason: 'Security concerns blocking $300K deal. 2 weeks without follow-up.'
  },
  {
    id: 'company-8',
    name: 'Sentra',
    domain: 'sentra.io',
    industry: 'Enterprise Software',
    size: '10-50',
    location: 'Austin, TX',
    website: 'https://sentra.io',
    status: 'active',
    category: 'team',
    tags: ['Internal', 'Team'],
    aiSummary: 'Internal team. Used for tracking team member relationships and internal coordination.',
    keyInsights: ['Growing engineering team', 'Backend scaling initiatives'],
    lastActivity: '2026-02-04',
    totalInteractions: 50,
    activities: [
      { id: 'ca-12', type: 'note', title: 'Rate limit architecture discussion', summary: 'Discussed enterprise rate limiting architecture', date: '2026-02-04', contactId: 'contact-8' }
    ],
    contactIds: ['contact-8'],
    needsAttention: false
  }
];
