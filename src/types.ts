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

// Memory lifecycle states (item 10 from checklist)
// 1. entered - originates from a real signal
// 2. persisting - remains visible while unresolved
// 3. resurfaced - reappeared when conditions changed
// 4. resolved - cleared by verified state change
// 5. archived - retained, searchable, attributable
export type MemoryLifecycleState = 'entered' | 'persisting' | 'resurfaced' | 'resolved' | 'archived';

// Memory origin types - WHERE this came from (item 2)
export type MemoryOriginType = 'decision' | 'meeting' | 'commitment' | 'signal' | 'conversation' | 'document';

// Memory trigger types - WHY it surfaced NOW (item 2)
export type MemoryTriggerType = 'deadline' | 'dependency_change' | 'escalation' | 'inactivity' | 'pattern_detected' | 'scheduled' | 'external_signal';

// Memory metadata - organizational memory tracking
export interface MemoryMetadata {
  // Lifecycle (item 10)
  lifecycleState: MemoryLifecycleState;
  enteredAt: string;           // When this first entered memory

  // Time tracking (item 1)
  activeDays: number;          // How long this has been active
  lastSeenAt?: string;         // When user last viewed this

  // Reappearance tracking (item 3)
  hasAppearedBefore: boolean;
  previousAppearances?: number;
  resurfacedAt?: string;       // When it came back
  resurfaceReason?: string;    // Why it came back

  // Origin and Trigger (item 2)
  origin: {
    type: MemoryOriginType;
    description: string;       // One sentence max
    sourceId?: string;         // Link to original source
  };
  trigger: {
    type: MemoryTriggerType;
    description: string;       // One sentence max
  };

  // Storyline (item 7)
  storyline?: {
    isPartOfThread: boolean;
    threadDescription?: string;  // "Part of ongoing Q3 planning discussion"
    relatedItemIds?: string[];
  };

  // Ranking rationale (item 8)
  rankingRationale: string;    // "Why is this here instead of something else?"

  // Intervention tracking (item 5) - log, not resolution
  interventions?: Array<{
    type: 'acknowledged' | 'action_taken' | 'delegated' | 'deferred';
    timestamp: string;
    note?: string;
  }>;
}

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
  impactNarrative?: string; // Human-readable impact description (blocks downstream work, etc.)
  isNew?: boolean;          // Item appeared since last visit
  isEscalated?: boolean;    // Item urgency increased since last visit
  needsIntervention: boolean;
  needsDecision: boolean;
  collaborators?: string[];
  evidence?: EvidenceItem[];
  focusCategory?: FocusCategory;  // pulse, friction, or horizon

  // Organizational memory fields
  memory?: MemoryMetadata;
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

// ============================================================================
// Scheduling Types
// ============================================================================

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type LocationMode = 'remote' | 'hybrid' | 'office';
export type MeetingContextType = 'breakfast' | 'lunch' | 'dinner' | 'virtual-only';

export interface TimeRange {
  start: string; // HH:mm format
  end: string;   // HH:mm format
}

export interface DaySchedule {
  day: DayOfWeek;
  enabled: boolean;
  timeRanges: TimeRange[];
}

export interface DateException {
  date: string; // YYYY-MM-DD format
  isAvailable: boolean;
  reason?: string;
  customTimeRanges?: TimeRange[];
}

export interface WorkingAvailability {
  timezone: string;
  weekSchedule: DaySchedule[];
  exceptions: DateException[];
}

export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  type: 'office' | 'cafe' | 'restaurant' | 'other';
  notes?: string;
  isDefault?: boolean;
}

export interface WorkLocationPreferences {
  mode: LocationMode;
  officeAddress?: string;
  homeAddress?: string;
  preferredMeetingLocation?: 'office' | 'home' | 'flexible';
}

export interface MeetingContextPreferences {
  allowBreakfastMeetings: boolean;
  allowLunchMeetings: boolean;
  allowDinnerMeetings: boolean;
  virtualOnlyWindows: TimeRange[];
  bufferBetweenMeetings: number; // minutes
  maxMeetingsPerDay?: number;
  focusTimeBlocks?: TimeRange[];
}

export interface SchedulingCommunicationStyle {
  emailTemplate: string;
  signature: string;
  preferSchedulingLinks: boolean;
  schedulingLinkUrl?: string;
}

export interface SchedulingPreferences {
  workingAvailability: WorkingAvailability;
  workLocation: WorkLocationPreferences;
  meetingContext: MeetingContextPreferences;
  savedLocations: SavedLocation[];
  communicationStyle: SchedulingCommunicationStyle;
}

// Scheduling action flow types
export type MeetingType = 'one-on-one' | 'group' | 'team-sync' | 'external';
export type MeetingFormat = 'virtual' | 'in-person' | 'hybrid';
export type MeetingMode = 'internal' | 'external';

export interface SchedulingContext {
  item?: AttentionItem;
  recipient: {
    name: string;
    email?: string;
    company?: string;
  };
  subject: string;
  meetingType: MeetingType;
  format: MeetingFormat;
  mode: MeetingMode;
  duration: number; // minutes
  location?: string;
  notes?: string;
}

export interface TimeSlot {
  id: string;
  start: Date;
  end: Date;
  score: number; // 0-100 preference score
  isPreferred?: boolean;
  conflictsWith?: string[]; // IDs of conflicting events
}

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

// ============================================================================
// Meeting Capture Types (Ambient Meeting Capture via Sentra Pill)
// ============================================================================

export type MeetingCaptureState = 'idle' | 'armed' | 'capturing' | 'attention' | 'processing' | 'complete';

export interface CapturedDecision {
  id: string;
  summary: string;
  participants?: string[];
  timestamp: string;
}

export interface CapturedCommitment {
  id: string;
  summary: string;
  owner?: string;
  dueDate?: string;
  timestamp: string;
}

export interface CapturedQuestion {
  id: string;
  summary: string;
  askedBy?: string;
  timestamp: string;
  isResolved: boolean;
}

export interface MeetingTranscriptSegment {
  id: string;
  speaker?: string;
  text: string;
  timestamp: string;
  confidence: number;
}

export interface MeetingCaptureSnapshot {
  // What Sentra understood (1-2 sentences)
  understanding: string;

  // What entered organizational memory
  decisions: CapturedDecision[];
  commitments: CapturedCommitment[];
  openQuestions: CapturedQuestion[];

  // Meeting context
  duration: number; // seconds
  participantCount: number;
  dominantTopics: string[];
}

export interface CapturedMeeting {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // seconds

  // Core data
  snapshot: MeetingCaptureSnapshot;
  transcript: MeetingTranscriptSegment[];

  // Metadata
  source: 'manual' | 'calendar' | 'zoom' | 'meet' | 'teams';
  calendarEventId?: string;
  title?: string;
  attendees?: string[];

  // User actions
  savedAs?: 'meeting' | 'thread' | 'private';
  attachedToThreadId?: string;
  isPrivate: boolean;
}

export interface UpcomingMeeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  location: string;
  isActive: boolean;
}

// ============================================================================
// Enhanced Meeting Transcript Types (Delight-focused)
// ============================================================================

/**
 * Meeting Brief - The "first screenful" that answers:
 * 1. Why did this meeting exist?
 * 2. What changed because of it?
 * 3. What is now expected to happen next?
 */
export interface MeetingBriefing {
  purpose: string;          // 1 sentence - why the meeting existed
  outcomes: string[];       // 2-3 bullets max - what changed
  openThreads: string[];    // Things not resolved
  humanRecognition: string; // One line of thoughtful recognition
}

/**
 * Enhanced action item with organizational context
 */
export interface EnhancedActionItem {
  id: string;
  text: string;
  assignee: string;
  dueDate: string;
  completed: boolean;

  // Contextual awareness (auto-derived where possible)
  affectsDownstream?: string;   // Who/what this affects
  unblocks?: string;            // What this enables
  riskIfIgnored?: string;       // When it becomes a problem

  // Playback reference
  transcriptTimestamp?: string;
}

/**
 * Enhanced highlight with interpretation
 */
export interface MeetingHighlight {
  id: string;
  text: string;
  speaker: string;
  timestamp: string;

  // What makes this important
  interpretation?: string;      // "This confirms..." or "This signals..."
  impactLevel: 'high' | 'medium' | 'low';
  category: 'decision' | 'commitment' | 'risk' | 'insight' | 'question';
}

/**
 * Enhanced transcript entry with playback markers
 */
export interface EnhancedTranscriptEntry {
  id: string;
  speaker: string;
  time: string;
  text: string;

  // Markers for purposeful playback
  isActionItem?: boolean;
  isDecision?: boolean;
  isHighlight?: boolean;
  isQuestionResolved?: boolean;

  // Visual emphasis during playback
  emphasisLevel?: 'high' | 'medium' | 'none';
}

/**
 * Link between transcript and generated briefs
 */
export interface TranscriptBriefLink {
  briefId: string;
  briefTitle: string;
  createdAt: string;
  status: 'active' | 'archived';
}

/**
 * Delta from previous recurring meeting
 */
export interface MeetingDelta {
  newDecisions: string[];
  resolvedIssues: string[];
  newRisks: string[];
  progressMade: string[];
}

/**
 * Full enhanced meeting data for transcript view
 */
export interface EnhancedMeetingData {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];

  // The briefing layer
  briefing: MeetingBriefing;

  // Enhanced content
  highlights: MeetingHighlight[];
  actionItems: EnhancedActionItem[];
  decisions: string[];

  // Transcript
  transcript: EnhancedTranscriptEntry[];

  // Links to briefs
  generatedBriefs: TranscriptBriefLink[];
  derivedFrom?: string;  // Parent meeting if this continues a series

  // For recurring meetings
  isRecurring?: boolean;
  delta?: MeetingDelta;
}
