import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Target,
  Zap,
  UserPlus,
  Check,
  UserCircle,
  Send,
  Mail,
  Video,
  MessageSquare,
  Phone,
  Search,
  Building2,
  Plus,
  RotateCcw,
  GitBranch,
  Pause,
  Hand,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { AttentionItem, AttentionType, EvidenceItem, CollaborationComment } from '../types';
import { getRelativeTime } from '../utils/AttentionScore';
import { CollaborationThread } from './CollaborationThread';

// Get contextual intervention actions based on item type
// Item 5: Replace "completion" semantics with "intervention" semantics
// Actions are logged interventions, not resolutions. Resolution only happens via external signal change.
function getInterventionActions(item: AttentionItem): Array<{ id: string; label: string; icon: React.ElementType; primary?: boolean }> {
  const type = item.attentionType || item.itemType;

  switch (type) {
    case 'risk':
    case 'alert':
      return [
        { id: 'intervened', label: 'Action taken', icon: Hand, primary: true },
        { id: 'escalate', label: 'Escalate', icon: UserPlus }
      ];
    case 'misalignment':
      return [
        { id: 'schedule-sync', label: 'Schedule Sync', icon: Calendar, primary: true },
        { id: 'send-message', label: 'Send Message', icon: MessageSquare }
      ];
    case 'blocker':
      return [
        { id: 'intervened', label: 'Action taken', icon: Hand, primary: true },
        { id: 'escalate', label: 'Escalate', icon: UserPlus }
      ];
    case 'commitment':
      return [
        { id: 'intervened', label: 'Action taken', icon: Hand, primary: true },
        { id: 'send-email', label: 'Send Email', icon: Mail }
      ];
    case 'meeting':
      return [
        { id: 'join-meeting', label: 'Join Now', icon: Video, primary: true },
        { id: 'reschedule', label: 'Reschedule', icon: Calendar }
      ];
    case 'relationship':
      return [
        { id: 'send-email', label: 'Send Email', icon: Mail, primary: true },
        { id: 'schedule-call', label: 'Schedule Call', icon: Phone }
      ];
    case 'followup':
      return [
        { id: 'send-followup', label: 'Send Follow-up', icon: Send, primary: true },
        { id: 'schedule-call', label: 'Schedule Call', icon: Phone }
      ];
    default:
      return [
        { id: 'intervened', label: 'Action taken', icon: Hand, primary: true }
      ];
  }
}

// Category styling
const CATEGORY_CONFIG: Record<AttentionType, {
  icon: React.ElementType;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}> = {
  risk: {
    icon: AlertTriangle,
    label: 'RISK',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800'
  },
  misalignment: {
    icon: Target,
    label: 'MISALIGNMENT',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800'
  },
  blocker: {
    icon: Zap,
    label: 'BLOCKER',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    textColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-200 dark:border-orange-800'
  },
  commitment: {
    icon: CheckCircle2,
    label: 'COMMITMENT',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  meeting: {
    icon: Calendar,
    label: 'MEETING',
    bgColor: 'bg-violet-50 dark:bg-violet-900/20',
    textColor: 'text-violet-600 dark:text-violet-400',
    borderColor: 'border-violet-200 dark:border-violet-800'
  },
  relationship: {
    icon: UserCircle,
    label: 'RELATIONSHIP',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    textColor: 'text-pink-600 dark:text-pink-400',
    borderColor: 'border-pink-200 dark:border-pink-800'
  },
  followup: {
    icon: Send,
    label: 'FOLLOW-UP',
    bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-200 dark:border-cyan-800'
  }
};

interface FocusViewProps {
  item: AttentionItem | null;
  onClose: () => void;
  onAction: (actionId: string, item: AttentionItem) => void;
  onNavigateToSource?: (sourceType: string, sourceId?: string) => void;
}

// Source type icons and labels for navigation
const SOURCE_CONFIG: Record<string, { icon: React.ElementType; label: string; navigateTo: string }> = {
  'Email': { icon: Mail, label: 'View Email', navigateTo: 'email' },
  'Slack': { icon: MessageSquare, label: 'View Thread', navigateTo: 'slack' },
  'Meeting': { icon: Video, label: 'View Transcript', navigateTo: 'meetings' },
  'Meeting Transcript': { icon: Video, label: 'View Transcript', navigateTo: 'meetings' },
  'Document': { icon: ExternalLink, label: 'View Document', navigateTo: 'document' },
  'Report': { icon: ExternalLink, label: 'View Report', navigateTo: 'reports' },
  'Linear': { icon: Target, label: 'View in Linear', navigateTo: 'linear' },
  'Notion': { icon: ExternalLink, label: 'View in Notion', navigateTo: 'notion' },
  'CRM': { icon: Users, label: 'View Contact', navigateTo: 'contacts' },
  'Contact': { icon: Users, label: 'View Contact', navigateTo: 'contacts' },
  'Swimlane': { icon: GitBranch, label: 'View Timeline', navigateTo: 'swimlanes' },
  'Calendar': { icon: Calendar, label: 'View Event', navigateTo: 'calendar' },
};

// Extend AttentionItem to include optional thread
interface AttentionItemWithThread extends AttentionItem {
  thread?: {
    comments: CollaborationComment[];
    participants: string[];
  };
}

// Organization directory - internal people
const ORGANIZATION_DIRECTORY = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Product Lead', avatar: 'SC', isInternal: true },
  { id: '2', name: 'Mike Rodriguez', email: 'mike.rodriguez@company.com', role: 'Engineering Manager', avatar: 'MR', isInternal: true },
  { id: '3', name: 'Emily Watson', email: 'emily.watson@company.com', role: 'Legal Counsel', avatar: 'EW', isInternal: true },
  { id: '4', name: 'James Park', email: 'james.park@company.com', role: 'Finance Director', avatar: 'JP', isInternal: true },
  { id: '5', name: 'Lisa Thompson', email: 'lisa.thompson@company.com', role: 'Operations Lead', avatar: 'LT', isInternal: true },
  { id: '6', name: 'David Kim', email: 'david.kim@company.com', role: 'DevOps Lead', avatar: 'DK', isInternal: true },
  { id: '7', name: 'Anna Martinez', email: 'anna.martinez@company.com', role: 'CTO', avatar: 'AM', isInternal: true },
];

// CRM contacts - external people
const CRM_CONTACTS = [
  { id: 'ext-1', name: 'John Smith', email: 'john.smith@acme.com', company: 'Acme Corp', isInternal: false },
  { id: 'ext-2', name: 'Rachel Green', email: 'rachel@northstar.io', company: 'Northstar Inc', isInternal: false },
  { id: 'ext-3', name: 'Tom Wilson', email: 'twilson@techflow.com', company: 'TechFlow', isInternal: false },
];

// For backward compatibility
const SUGGESTED_COLLABORATORS = ORGANIZATION_DIRECTORY;

export const FocusView: React.FC<FocusViewProps> = ({ item, onClose, onAction, onNavigateToSource }) => {
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);
  const [threadStarted, setThreadStarted] = useState(false);

  // Meeting-specific state for adding people to calendar
  const [isAddingPeople, setIsAddingPeople] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedInvitees, setAddedInvitees] = useState<Array<{ id: string; name: string; email: string; isInternal: boolean; company?: string }>>([]);
  // Tracks invitees that have been "sent" - they show in People Involved
  const [sentInvitees, setSentInvitees] = useState<Array<{ id: string; name: string; email: string; isInternal: boolean }>>([]);

  // Filter people based on search
  const filteredPeople = searchQuery.length > 0 ? [
    ...ORGANIZATION_DIRECTORY.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    ...CRM_CONTACTS.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ] : [];

  // Check if search query is a valid email
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNewEmail = isValidEmail(searchQuery) &&
    !ORGANIZATION_DIRECTORY.some(p => p.email.toLowerCase() === searchQuery.toLowerCase()) &&
    !CRM_CONTACTS.some(p => p.email.toLowerCase() === searchQuery.toLowerCase()) &&
    !addedInvitees.some(p => p.email.toLowerCase() === searchQuery.toLowerCase());

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && item) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [item, onClose]);

  if (!item) return null;

  const attentionType: AttentionType = item.attentionType ||
    (item.itemType === 'alert' ? 'risk' :
     item.itemType === 'meeting' ? 'meeting' :
     item.itemType === 'relationship' ? 'relationship' : 'commitment');

  const config = CATEGORY_CONFIG[attentionType];
  const CategoryIcon = config.icon;
  const interventionActions = getInterventionActions(item);

  // Get full content based on item type
  const getTitle = (): string => item.title;

  const getContext = (): string => {
    switch (item.itemType) {
      case 'alert':
        return item.description;
      case 'commitment':
        return item.context || '';
      case 'meeting':
        return item.summary;
      case 'relationship':
        return item.description;
      default:
        return '';
    }
  };

  const getTimestamp = (): string => {
    switch (item.itemType) {
      case 'alert':
        return item.timestamp;
      case 'commitment':
        return item.dueDate || '';
      case 'meeting':
        return item.time;
      case 'relationship':
        return `Last contact: ${item.lastContactDate}`;
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
              <CategoryIcon size={12} strokeWidth={2.5} />
              <span className="text-[10px] font-bold tracking-wider">{config.label}</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Title */}
            <div>
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                {getTitle()}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock size={12} />
                <span>{getTimestamp()}</span>
              </div>
            </div>

            {/* What Changed - subtle indicator that the system is alive and reactive */}
            {(item.isNew || item.isEscalated) && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                item.isEscalated
                  ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30'
                  : 'bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30'
              }`}>
                {item.isEscalated ? (
                  <>
                    <TrendingUp size={12} className="text-red-500 dark:text-red-400" />
                    <span className="text-red-600 dark:text-red-400 font-medium">What changed:</span>
                    <span className="text-red-700 dark:text-red-300">Urgency escalated since yesterday</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} className="text-blue-500 dark:text-blue-400" />
                    <span className="text-blue-600 dark:text-blue-400 font-medium">What changed:</span>
                    <span className="text-blue-700 dark:text-blue-300">New since your last visit</span>
                  </>
                )}
              </div>
            )}

            {/* Meeting-specific content - shown INSTEAD of attention item content */}
            {item.itemType === 'meeting' ? (
              <>
                {/* Meeting Context */}
                {item.preMeetingBrief && (
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Meeting Context</h2>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{item.preMeetingBrief.context}</p>
                  </div>
                )}

                {/* Goals */}
                {item.preMeetingBrief?.goals && item.preMeetingBrief.goals.length > 0 && (
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Goals</h2>
                    <ul className="space-y-1">
                      {item.preMeetingBrief.goals.map((goal, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* People Involved for meetings - includes original + newly invited */}
                {((item.collaborators && item.collaborators.length > 0) || sentInvitees.length > 0) && (
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                      <Users size={12} />
                      People Involved ({(item.collaborators?.length || 0) + sentInvitees.length})
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {/* Original collaborators */}
                      {item.collaborators?.map((person, index) => (
                        <div
                          key={`orig-${index}`}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full"
                        >
                          <div className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-[9px] font-medium text-zinc-600 dark:text-zinc-300">
                            {person.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-zinc-700 dark:text-zinc-300">{person}</span>
                        </div>
                      ))}
                      {/* Newly invited people */}
                      {sentInvitees.map((person) => (
                        <div
                          key={person.id}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                            person.isInternal
                              ? 'bg-violet-100 dark:bg-violet-900/30'
                              : 'bg-emerald-100 dark:bg-emerald-900/30'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-medium ${
                            person.isInternal
                              ? 'bg-violet-300 dark:bg-violet-700 text-violet-700 dark:text-violet-200'
                              : 'bg-emerald-300 dark:bg-emerald-700 text-emerald-700 dark:text-emerald-200'
                          }`}>
                            {(person.name || person.email).charAt(0).toUpperCase()}
                          </div>
                          <span className={`text-xs ${
                            person.isInternal
                              ? 'text-violet-700 dark:text-violet-300'
                              : 'text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {person.name || person.email}
                          </span>
                          <span className="text-[9px] text-zinc-400">invited</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Item 2: Origin - WHERE this came from (one sentence max) */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Origin</h2>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {item.memory?.origin?.description || getContext()}
                  </p>
                </div>

                {/* Item 2: Trigger - WHY it surfaced NOW (one sentence max) */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Trigger</h2>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {item.memory?.trigger?.description || item.memoryRationale || 'Conditions changed requiring attention.'}
                  </p>
                </div>

                {/* Item 7: Storyline indicator (lightweight, not a timeline) */}
                {(item.memory?.storyline?.isPartOfThread || item.memory?.storyline?.threadDescription) && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <GitBranch size={12} />
                    <span>{item.memory?.storyline?.threadDescription || 'Part of an ongoing thread'}</span>
                    {item.memory?.storyline?.relatedItemIds && item.memory.storyline.relatedItemIds.length > 0 && (
                      <button className="text-blue-600 dark:text-blue-400 hover:underline">
                        View history
                      </button>
                    )}
                  </div>
                )}

                {/* Item 3: Reappearance indicator in detail view */}
                {item.memory?.hasAppearedBefore && item.memory?.lifecycleState === 'resurfaced' && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                    <RotateCcw size={12} className="text-zinc-500" />
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Resurfaced {item.memory.resurfaceReason ? `· ${item.memory.resurfaceReason}` : 'after inactivity'}
                    </span>
                  </div>
                )}

                {/* Sources and People Involved - side by side - for attention items only */}
                <div className="flex items-start justify-between gap-6">
                  {/* Sources - clickable links to original content */}
                  {item.evidence && item.evidence.length > 0 && (
                    <div className="flex-1">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Sources</h2>
                      <div className="flex flex-wrap gap-2">
                        {item.evidence.map((evidence, index) => {
                          const config = SOURCE_CONFIG[evidence.type] || { icon: ExternalLink, label: 'View Source', navigateTo: 'external' };
                          const SourceIcon = config.icon;
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                if (evidence.url) {
                                  // External URL - open in new tab
                                  window.open(evidence.url, '_blank');
                                } else if (onNavigateToSource) {
                                  // Internal navigation
                                  onNavigateToSource(config.navigateTo, evidence.type);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                              title={config.label}
                            >
                              <SourceIcon size={12} className="opacity-60 group-hover:opacity-100" />
                              <span>{evidence.type}</span>
                              <ExternalLink size={10} className="opacity-40 group-hover:opacity-70" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* People Involved - right side */}
                  {item.collaborators && item.collaborators.length > 0 && (
                    <div className="flex-shrink-0">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                        <Users size={12} />
                        People Involved ({item.collaborators.length})
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {item.collaborators.map((person, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full"
                          >
                            <div className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-[9px] font-medium text-zinc-600 dark:text-zinc-300">
                              {person.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs text-zinc-700 dark:text-zinc-300">{person}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Add People to Calendar - for meetings */}
            <AnimatePresence>
              {item.itemType === 'meeting' && isAddingPeople && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-zinc-200 dark:border-zinc-800 pt-4 overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                        <Calendar size={12} />
                        Add to Calendar Invite
                      </h2>
                      <button
                        onClick={() => {
                          setIsAddingPeople(false);
                          setSearchQuery('');
                        }}
                        className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Search input */}
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search people or enter email..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-zinc-400"
                      />
                    </div>

                    {/* Added invitees */}
                    {addedInvitees.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {addedInvitees.map((person) => (
                          <div
                            key={person.id}
                            className={`flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full text-xs ${
                              person.isInternal
                                ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                            }`}
                          >
                            <span>{person.name || person.email}</span>
                            <button
                              onClick={() => setAddedInvitees(prev => prev.filter(p => p.id !== person.id))}
                              className="w-4 h-4 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Search results */}
                    {searchQuery.length > 0 && (
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {filteredPeople.map((person) => {
                          const isAlreadyAdded = addedInvitees.some(p => p.email === person.email);
                          if (isAlreadyAdded) return null;
                          return (
                            <button
                              key={person.id}
                              onClick={() => {
                                setAddedInvitees(prev => [...prev, {
                                  id: person.id,
                                  name: person.name,
                                  email: person.email,
                                  isInternal: person.isInternal,
                                  company: 'company' in person ? person.company : undefined
                                }]);
                                setSearchQuery('');
                              }}
                              className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50 transition-all"
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${
                                person.isInternal
                                  ? 'bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300'
                                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                              }`}>
                                {'avatar' in person ? person.avatar : person.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                  {person.name}
                                  {person.isInternal && (
                                    <span className="px-1.5 py-0.5 text-[9px] bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded">Internal</span>
                                  )}
                                </div>
                                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                  {person.email}
                                  {'company' in person && (
                                    <>
                                      <span>•</span>
                                      <Building2 size={9} />
                                      {person.company}
                                    </>
                                  )}
                                </div>
                              </div>
                              <Plus size={14} className="text-zinc-400" />
                            </button>
                          );
                        })}

                        {/* Add external email option */}
                        {isNewEmail && (
                          <button
                            onClick={() => {
                              setAddedInvitees(prev => [...prev, {
                                id: `ext-new-${Date.now()}`,
                                name: '',
                                email: searchQuery,
                                isInternal: false
                              }]);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 transition-all"
                          >
                            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-700">
                              <Mail size={12} className="text-zinc-500" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                                Add external: {searchQuery}
                              </div>
                              <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                Send calendar invite to this email
                              </div>
                            </div>
                            <Plus size={14} className="text-zinc-400" />
                          </button>
                        )}

                        {filteredPeople.length === 0 && !isNewEmail && searchQuery.length > 2 && (
                          <p className="text-xs text-zinc-400 text-center py-3">
                            No matches found. Enter a full email to invite externally.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collaboration Section - for non-meeting items */}
            <AnimatePresence>
              {item.itemType !== 'meeting' && isCollaborating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-zinc-200 dark:border-zinc-800 pt-4 overflow-hidden"
                >
                  {!threadStarted ? (
                    // People Selector - Choose who to bring in
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                          <UserPlus size={12} />
                          Bring people into this conversation
                        </h2>
                        <button
                          onClick={() => setIsCollaborating(false)}
                          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Suggested collaborators */}
                      <div className="space-y-1.5">
                        {SUGGESTED_COLLABORATORS.map((person) => {
                          const isSelected = selectedCollaborators.includes(person.id);
                          return (
                            <button
                              key={person.id}
                              onClick={() => {
                                setSelectedCollaborators(prev =>
                                  isSelected
                                    ? prev.filter(id => id !== person.id)
                                    : [...prev, person.id]
                                );
                              }}
                              className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg border transition-all ${
                                isSelected
                                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                                  : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${
                                isSelected
                                  ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                              }`}>
                                {person.avatar}
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                                  {person.name}
                                </div>
                                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                  {person.role}
                                </div>
                              </div>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                  <Check size={10} className="text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Start thread button */}
                      <button
                        onClick={() => {
                          if (selectedCollaborators.length > 0) {
                            setThreadStarted(true);
                          }
                        }}
                        disabled={selectedCollaborators.length === 0}
                        className={`w-full py-2.5 rounded-lg text-xs font-medium transition-colors ${
                          selectedCollaborators.length > 0
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                        }`}
                      >
                        {selectedCollaborators.length > 0
                          ? `Start thread with ${selectedCollaborators.length} ${selectedCollaborators.length === 1 ? 'person' : 'people'}`
                          : 'Select people to collaborate with'
                        }
                      </button>
                    </div>
                  ) : (
                    // Collaboration Thread - Active conversation
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Thread
                          </h2>
                          <div className="flex -space-x-1.5">
                            {selectedCollaborators.slice(0, 3).map((id) => {
                              const person = SUGGESTED_COLLABORATORS.find(p => p.id === id);
                              return person ? (
                                <div
                                  key={id}
                                  className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[8px] font-medium text-emerald-700 dark:text-emerald-300"
                                >
                                  {person.avatar}
                                </div>
                              ) : null;
                            })}
                            {selectedCollaborators.length > 3 && (
                              <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[8px] font-medium text-zinc-600 dark:text-zinc-400">
                                +{selectedCollaborators.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setThreadStarted(false);
                            setIsCollaborating(false);
                            setSelectedCollaborators([]);
                          }}
                          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        >
                          Close thread
                        </button>
                      </div>
                      <CollaborationThread
                        thread={(item as AttentionItemWithThread).thread}
                        participants={[
                          ...(item.collaborators || []),
                          ...selectedCollaborators.map(id =>
                            SUGGESTED_COLLABORATORS.find(p => p.id === id)?.name || ''
                          ).filter(Boolean)
                        ]}
                        onAddComment={(content, mentions) => {
                          console.log('New comment:', content, 'Mentions:', mentions);
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer with Actions */}
          <div className="shrink-0 px-5 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center justify-end gap-2">
              {item.itemType === 'meeting' ? (
                <>
                  {isAddingPeople && addedInvitees.length > 0 ? (
                    <>
                      {/* Cancel - when invitees are ready to send */}
                      <button
                        onClick={() => {
                          setIsAddingPeople(false);
                          setSearchQuery('');
                          setAddedInvitees([]);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <X size={12} />
                        Cancel
                      </button>

                      {/* Send - adds invitees to People Involved */}
                      <button
                        onClick={() => {
                          // Add invitees to sentInvitees so they show in People Involved
                          setSentInvitees(prev => [
                            ...prev,
                            ...addedInvitees.map(p => ({
                              id: p.id,
                              name: p.name,
                              email: p.email,
                              isInternal: p.isInternal
                            }))
                          ]);
                          // In a real app, this would call calendar API to send invites
                          console.log('Sending calendar invites to:', addedInvitees);
                          onAction('send-calendar-invite', item);
                          setIsAddingPeople(false);
                          setSearchQuery('');
                          setAddedInvitees([]);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-600 rounded-lg transition-colors shadow-sm"
                      >
                        <Send size={14} />
                        Send
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Add People - for meetings (adds to calendar invite) */}
                      <button
                        onClick={() => {
                          setIsAddingPeople(!isAddingPeople);
                          if (isAddingPeople) {
                            setSearchQuery('');
                            setAddedInvitees([]);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors ${
                          isAddingPeople ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-zinc-900' : ''
                        }`}
                      >
                        <UserPlus size={12} />
                        {isAddingPeople ? 'Cancel' : 'Add People'}
                      </button>

                      {/* Join Now - primary action for meetings */}
                      <button
                        onClick={() => onAction('join-meeting', item)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Video size={12} />
                        Join Now
                      </button>

                      {/* Reschedule */}
                      <button
                        onClick={() => onAction('reschedule', item)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        <Calendar size={12} />
                        Reschedule
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Collaborate - for attention items */}
                  <button
                    onClick={() => {
                      setIsCollaborating(!isCollaborating);
                      if (isCollaborating) {
                        setThreadStarted(false);
                        setSelectedCollaborators([]);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors ${
                      isCollaborating ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-900' : ''
                    }`}
                  >
                    <UserPlus size={12} />
                    {isCollaborating ? 'Cancel' : 'Collaborate'}
                  </button>

                  {/* Item 5: Intervention actions (not completion actions) */}
                  {interventionActions.map((action) => {
                    const ActionIcon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => onAction(action.id, item)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                          action.primary
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                        }`}
                      >
                        <ActionIcon size={12} />
                        {action.label}
                      </button>
                    );
                  })}

                  {/* Defer - moved from homepage (Item 9: homepage = awareness only) */}
                  <button
                    onClick={() => onAction('defer', item)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Pause size={12} />
                    Defer
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FocusView;
