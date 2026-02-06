export type AlertSeverity = 'critical' | 'warning' | 'info';

// New types for attention scoring and prioritization
export type Probability = 'high' | 'medium' | 'low';
export type Impact = 'high' | 'medium' | 'low';
export type ActionCategory = 'context' | 'execute' | 'collaborate';
export type AttentionType = 'risk' | 'misalignment' | 'blocker' | 'commitment' | 'meeting' | 'relationship' | 'followup';

// Focus categories for the orientation layer
// - pulse: what's emerging or shifting
// - friction: where progress is stuck or contested
// - horizon: what's coming due or approaching decision
export type FocusCategory = 'pulse' | 'friction' | 'horizon';

// Evidence items for verification
export interface EvidenceItem {
  type: string;
  url: string;
  preview: string;
  timestamp?: string;
}

// Attention metadata - common fields for all attention-worthy items
export interface AttentionMetadata {
  probability: Probability;
  impact: Impact;
  memoryRationale: string;  // Why this surfaced - explains context, not commands
  needsIntervention: boolean;
  needsDecision: boolean;
  collaborators?: string[];
  evidence?: EvidenceItem[];
  focusCategory?: FocusCategory;  // pulse, friction, or horizon
}

export interface Alert extends Partial<AttentionMetadata> {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  source: string;
  attentionType?: AttentionType;
  thread?: CollaborationThread;
}

export interface CommitmentSource {
  type: 'meeting' | 'email' | 'slack' | 'document' | 'calendar' | 'linear' | 'notion';
  title: string;
  id?: string;
  timestamp?: string;
  preview?: string;
  author?: string;
  channel?: string; // For Slack: #channel-name
  threadUrl?: string;
}

export interface Commitment extends Partial<AttentionMetadata> {
  id: string;
  title: string;
  assignee: string; // 'Me' or others
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'High' | 'Medium' | 'Low';
  okr?: string;
  context: string;
  source?: CommitmentSource;
  attentionType?: AttentionType;
  thread?: CollaborationThread;
}

export interface MeetingBrief extends Partial<AttentionMetadata> {
  id: string;
  title: string;
  time: string;
  timestamp: string;
  attendees: string[];
  summary: string;
  keyTopics: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  reportStatus?: 'published' | 'pending' | 'none';
  location: 'Zoom' | 'Google Meet' | 'Microsoft Teams' | 'In Person' | 'Phone';
  meetingLink?: string;
  locationDetails?: string; // e.g., "Conference Room B" or the URL
  isPrivate?: boolean;
  preMeetingBrief?: {
    context: string;
    goals: string[];
    materials: string[];
  };
  attentionType?: AttentionType;
  thread?: CollaborationThread;
}

export interface Report {
  id: string;
  title: string;
  dateRange: string;
  summary: string;
  status: 'ready' | 'generating';
}

export interface SwimlaneEvent {
  id: string;
  title: string;
  timestamp: string;
  type: 'meeting' | 'decision' | 'document' | 'alert';
  lane: string;
}

// Attention item types for the unified attention stream
export interface AttentionAlert extends Alert {
  itemType: 'alert';
}

export interface AttentionCommitment extends Commitment {
  itemType: 'commitment';
}

export interface AttentionMeeting extends MeetingBrief {
  itemType: 'meeting';
}

// Relationship/Contact attention item - for relationship maintenance
export interface RelationshipAlert extends Partial<AttentionMetadata> {
  id: string;
  contactId: string;
  contactName: string;
  contactRole?: string;
  contactCompany?: string;
  contactAvatar?: string;
  title: string;
  description: string;
  lastContactDate: string;
  daysSinceContact: number;
  relationshipStrength: 'strong' | 'warm' | 'cooling' | 'cold';
  suggestedAction?: string;
  recentContext?: string; // Last thing discussed
  attentionType?: AttentionType;
  thread?: CollaborationThread;
}

export interface AttentionRelationship extends RelationshipAlert {
  itemType: 'relationship';
}

// Union type for attention stream
export type AttentionItem = AttentionAlert | AttentionCommitment | AttentionMeeting | AttentionRelationship;

// Collaboration types for in-card thread UI
export interface CollaborationComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  mentions?: string[];
}

export interface CollaborationThread {
  comments: CollaborationComment[];
  participants: string[];
}

// ============================================================================
// CRM / Contact Types
// ============================================================================

export type RelationshipType =
  | 'key_stakeholder'
  | 'champion'
  | 'decision_maker'
  | 'influencer'
  | 'blocker'
  | 'contact';

export type RelationshipWarmth = 'hot' | 'warm' | 'cool' | 'cold' | 'new';

export type ContactCategory = 'investor' | 'client' | 'partner' | 'team' | 'other';

export type InteractionType = 'email' | 'meeting' | 'call' | 'slack' | 'linkedin' | 'note';

export interface ContactInteraction {
  id: string;
  type: InteractionType;
  date: string;
  subject: string;
  summary: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  company: string;
  companyId?: string;
  title: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  location?: string;

  // Relationship
  relationship: RelationshipType;
  warmth: RelationshipWarmth;
  category: ContactCategory;
  tags: string[];

  // AI Insights
  aiSummary: string;
  talkingPoints?: string[];
  risks?: string[];

  // Activity
  lastContacted: string;
  nextFollowUp?: string;
  interactions: ContactInteraction[];

  // Notes
  notes?: string;

  // Attention metadata - reuse existing patterns
  probability?: Probability;
  impact?: Impact;
  needsAttention?: boolean;
  attentionReason?: string;
}

export type CompanyStatus = 'active' | 'prospect' | 'churned' | 'paused';
export type CompanyTier = 'enterprise' | 'growth' | 'startup';
export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface CompanyDeal {
  id: string;
  name: string;
  value: number;
  stage: DealStage;
  closeDate?: string;
  probability: number;
}

export interface CompanyActivity {
  id: string;
  type: 'meeting' | 'email' | 'call' | 'note' | 'deal_update';
  title: string;
  summary: string;
  date: string;
  participants?: string[];
  contactId?: string;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  linkedIn?: string;

  // Relationship
  status: CompanyStatus;
  tier?: CompanyTier;
  category: ContactCategory;
  tags: string[];

  // Value
  totalValue?: number;
  activeDeals?: CompanyDeal[];

  // AI Insights
  aiSummary: string;
  keyInsights?: string[];
  risks?: string[];
  opportunities?: string[];

  // Activity
  lastActivity: string;
  totalInteractions: number;
  activities: CompanyActivity[];

  // Contacts
  contactIds: string[];
  primaryContactId?: string;

  // Attention
  needsAttention?: boolean;
  attentionReason?: string;
}
