import { Alert, Commitment, MeetingBrief, Report } from './types';

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
    ]
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
    criticality: 'critical'
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
    evidence: [{ type: 'Notion', url: 'Q2 Retro', preview: '3 Key Action Items identified' }]
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
  { id: 'tl-51', type: 'meeting', title: 'Renewal Review: Lumen', timestamp: 'Jan 20, 2026', actor: 'CS', summary: 'Renewal health check and expansion plan.', swimlaneId: 'sl6' },
  { id: 'tl-52', type: 'decision', title: 'Expansion Playbook v2', timestamp: 'Jan 25, 2026', actor: 'CS Ops', summary: 'Standardized expansion motion by segment.', swimlaneId: 'sl6' },
  { id: 'tl-53', type: 'alert', title: 'Security Audit Gap', timestamp: 'Jan 28, 2026', actor: 'Security', summary: 'Evidence collection for access reviews behind schedule.', swimlaneId: 'sl7' },
  { id: 'tl-54', type: 'document', title: 'SOC 2 Evidence Pack', timestamp: 'Jan 30, 2026', actor: 'Security', summary: 'Updated evidence repository.', swimlaneId: 'sl7' },
  { id: 'tl-55', type: 'alert', title: 'Latency Spike', timestamp: 'Jan 31, 2026', actor: 'Platform', summary: 'p95 latency exceeded 250ms for 2 hours.', swimlaneId: 'sl8' },
  { id: 'tl-56', type: 'decision', title: 'Queue Optimization Rollout', timestamp: 'Feb 02, 2026', actor: 'Platform', summary: 'New queue settings reduced backlog by 40%.', swimlaneId: 'sl8' }
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
    title: 'Misalignment on Q3 Goals',
    description: 'Marketing and Product have divergent KPIs for the launch campaign.',
    severity: 'warning',
    timestamp: '2026-02-02T09:30:00',
    source: 'Slack #strategy'
  },
  {
    id: 'a2',
    title: 'Budget Escalation Risk',
    description: 'Cloud infrastructure spend trending 15% over forecast.',
    severity: 'critical',
    timestamp: '2026-02-01T14:15:00',
    source: 'Finance Update PDF'
  },
  {
    id: 'a3',
    title: 'New Competitor Feature',
    description: 'Competitor X released "Smart Sync" today.',
    severity: 'info',
    timestamp: '2026-02-02T08:00:00',
    source: 'Market Intelligence'
  },
  {
    id: 'a4',
    title: 'Security Review Pending',
    description: 'SOC 2 renewal requires updated access reviews this week.',
    severity: 'warning',
    timestamp: '2026-02-02T11:45:00',
    source: 'Security Checklist'
  },
  {
    id: 'a5',
    title: 'Customer Escalation: Lumen',
    description: 'Lumen reported missing audit exports on Feb 1.',
    severity: 'critical',
    timestamp: '2026-02-02T12:10:00',
    source: 'Support Queue'
  },
  {
    id: 'a6',
    title: 'Hiring Plan Drift',
    description: 'Engineering hiring pipeline is 20% below target.',
    severity: 'warning',
    timestamp: '2026-02-01T16:30:00',
    source: 'People Ops'
  },
  {
    id: 'a7',
    title: 'Infrastructure Latency Spike',
    description: 'US-East region p95 latency increased by 35% last 24h.',
    severity: 'critical',
    timestamp: '2026-02-02T07:20:00',
    source: 'Datadog'
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
    context: 'Completed on time'
  },
  {
    id: 'c0-1',
    title: 'Sign Vendor Contract',
    assignee: 'Me',
    dueDate: '2 days ago',
    status: 'completed',
    priority: 'Medium',
    okr: 'Operational Excellence',
    context: 'Legal approved'
  },
  {
    id: 'c1',
    title: 'Review Engineering Hiring Plan',
    assignee: 'Me',
    dueDate: 'Today, 5:00 PM',
    status: 'pending',
    priority: 'High',
    okr: 'Build World Class Team',
    context: 'Promised to CTO in Weekly Sync',
    source: {
      type: 'meeting',
      title: 'Engineering Weekly',
      id: 'm-past-2',
      timestamp: 'Jan 22, 2:45 PM',
      preview: 'CTO: "Can we get a review of the hiring plan by EOD?"',
      author: 'CTO'
    }
  },
  {
    id: 'c2',
    title: 'Send Q1 Retrospective',
    assignee: 'Me',
    dueDate: 'Tomorrow',
    status: 'pending',
    priority: 'Medium',
    okr: 'Operational Excellence',
    context: 'Recurring task'
  },
  {
    id: 'c3',
    title: 'Approve Design System Updates',
    assignee: 'Sarah (Design)',
    dueDate: 'Overdue',
    status: 'overdue',
    priority: 'High',
    okr: 'Product Quality',
    context: 'Blocked on your approval',
    source: {
      type: 'slack',
      title: '#design-system',
      timestamp: 'Yesterday 4:20 PM',
      preview: 'Sarah: "@Alex just need a quick thumbs up on the new tokens."',
      author: 'Sarah Chen'
    }
  },
  {
    id: 'c4',
    title: 'Draft Investor Update',
    assignee: 'Me',
    dueDate: 'Feb 10',
    status: 'pending',
    priority: 'High',
    okr: 'Financial Health',
    context: 'Monthly requirement',
    source: {
      type: 'email',
      title: 'Investor Update Reminder',
      timestamp: 'Feb 1, 9:00 AM',
      preview: 'Subject: Please submit your monthly update by the 10th.',
      author: 'Board Admin'
    }
  },
  {
    id: 'c5',
    title: 'Finalize Q2 Roadmap',
    assignee: 'Me',
    dueDate: 'Feb 14',
    status: 'pending',
    priority: 'High',
    okr: 'Product Quality',
    context: 'Align with Sales + Success',
    source: {
      type: 'meeting',
      title: 'Product Roadmap Sync',
      timestamp: 'Feb 1, 11:00 AM',
      preview: 'PM: "We need final priorities by Feb 14."',
      author: 'PM Lead'
    }
  },
  {
    id: 'c6',
    title: 'Prepare Board Pack',
    assignee: 'Me',
    dueDate: 'Feb 18',
    status: 'pending',
    priority: 'High',
    okr: 'Financial Health',
    context: 'Quarterly board meeting',
    source: {
      type: 'document',
      title: 'Board Prep Checklist',
      timestamp: 'Feb 2, 8:00 AM',
      preview: 'Slides due by Feb 18.',
      author: 'Chief of Staff'
    }
  },
  {
    id: 'c7',
    title: 'Audit Data Retention Policies',
    assignee: 'Legal',
    dueDate: 'Feb 20',
    status: 'pending',
    priority: 'Medium',
    okr: 'Operational Excellence',
    context: 'EU AI Act guidance update'
  },
  {
    id: 'c8',
    title: 'Migrate Remaining API Clients',
    assignee: 'Platform Team',
    dueDate: 'Feb 25',
    status: 'pending',
    priority: 'Medium',
    okr: 'Platform Reliability',
    context: 'Reduce legacy traffic by 80%'
  },
  {
    id: 'c9',
    title: 'Run Q1 Customer Advisory Board',
    assignee: 'Customer Success',
    dueDate: 'Mar 1',
    status: 'pending',
    priority: 'Low',
    okr: 'Enterprise Growth',
    context: 'Invite top 10 accounts'
  },
  {
    id: 'c10',
    title: 'Publish Incident RCA',
    assignee: 'DevOps',
    dueDate: 'Tomorrow',
    status: 'pending',
    priority: 'High',
    okr: 'Platform Reliability',
    context: 'Required within 48 hours'
  },
  {
    id: 'c11',
    title: 'Update Competitive Battlecard',
    assignee: 'Marketing',
    dueDate: 'Feb 12',
    status: 'pending',
    priority: 'Medium',
    okr: 'Enterprise Growth',
    context: 'New competitor feature released'
  },
  {
    id: 'c12',
    title: 'Close Q1 Hiring Targets',
    assignee: 'People Ops',
    dueDate: 'Feb 28',
    status: 'pending',
    priority: 'High',
    okr: 'Build World Class Team',
    context: 'Backend + GTM roles'
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
    title: 'Urgent: Server Incident Response',
    time: 'In 15 mins (11:00 AM)',
    timestamp: '2026-02-02T11:00:00',
    attendees: ['DevOps', 'Alex', 'CTO'],
    summary: 'Post-mortem on the downtime experienced this morning. Need to define preventative measures.',
    keyTopics: ['RCA', 'Uptime'],
    status: 'scheduled',
    location: 'Zoom',
    meetingLink: 'https://zoom.us/j/incident-room',
    preMeetingBrief: {
      context: 'At 08:30 AM EST, the primary database cluster experienced a split-brain scenario during routine maintenance, causing 14 minutes of downtime.',
      goals: ['Establish the root cause of the failover failure', 'Determine why the standby replica did not promote immediately', 'Draft a communication plan for affected enterprise customers'],
      materials: ['Incident Log #4092', 'CloudProvider Status Report', 'DB Logs']
    }
  },
  {
    id: 'm2',
    title: 'Design Review: Settings',
    time: 'Today, 2:00 PM',
    timestamp: '2026-02-02T14:00:00',
    attendees: ['Sarah', 'Alex'],
    summary: 'Reviewing the new "Settings" visual refresh.',
    keyTopics: ['UI', 'Consistency'],
    status: 'scheduled',
    location: 'In Person',
    locationDetails: 'Design Studio',
    preMeetingBrief: {
      context: 'The current settings page has legacy UI patterns from 2024. Sarah has redesigned it to match the new "Zinc" aesthetic.',
      goals: ['Approve the new sidebar navigation for settings', 'Decide on the "Dark Mode" toggle placement', 'Review the "Account Deletion" flow'],
      materials: ['Figma Prototype Link', 'User Research Summary']
    }
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
