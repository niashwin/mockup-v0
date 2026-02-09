import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Sparkles,
} from "lucide-react";
import {
  AttentionItem,
  AttentionType,
  EvidenceItem,
  CollaborationComment,
} from "../types";
import { getRelativeTime } from "../utils/AttentionScore";
import { CollaborationThread } from "./CollaborationThread";
import { EmailCompose } from "./EmailCompose";

// Get contextual intervention actions based on item type
// Item 5: Replace "completion" semantics with "intervention" semantics
// Actions are logged interventions, not resolutions. Resolution only happens via external signal change.
function getInterventionActions(item: AttentionItem): Array<{
  id: string;
  label: string;
  icon: React.ElementType;
  primary?: boolean;
}> {
  const type = item.attentionType || item.itemType;

  switch (type) {
    case "risk":
    case "alert":
      return [
        { id: "intervened", label: "Action taken", icon: Hand, primary: true },
        { id: "escalate", label: "Escalate", icon: UserPlus },
      ];
    case "misalignment":
      return [
        {
          id: "schedule-sync",
          label: "Schedule Sync",
          icon: Calendar,
          primary: true,
        },
        { id: "send-message", label: "Send Message", icon: MessageSquare },
      ];
    case "blocker":
      return [
        { id: "intervened", label: "Action taken", icon: Hand, primary: true },
        { id: "escalate", label: "Escalate", icon: UserPlus },
      ];
    case "commitment":
      return [
        { id: "intervened", label: "Action taken", icon: Hand, primary: true },
        { id: "send-email", label: "Send Email", icon: Mail },
      ];
    case "meeting":
      return [
        { id: "join-meeting", label: "Join Now", icon: Video, primary: true },
        { id: "reschedule", label: "Reschedule", icon: Calendar },
      ];
    case "relationship":
      return [
        { id: "send-email", label: "Send Email", icon: Mail, primary: true },
        { id: "schedule-call", label: "Schedule Call", icon: Phone },
      ];
    case "followup":
      return [
        {
          id: "send-followup",
          label: "Send Follow-up",
          icon: Send,
          primary: true,
        },
        { id: "schedule-call", label: "Schedule Call", icon: Phone },
      ];
    default:
      return [
        { id: "intervened", label: "Action taken", icon: Hand, primary: true },
      ];
  }
}

// Category styling
const CATEGORY_CONFIG: Record<
  AttentionType,
  {
    icon: React.ElementType;
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  risk: {
    icon: AlertTriangle,
    label: "RISK",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-200 dark:border-red-800",
  },
  misalignment: {
    icon: Target,
    label: "MISALIGNMENT",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    textColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  blocker: {
    icon: Zap,
    label: "BLOCKER",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    textColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  commitment: {
    icon: CheckCircle2,
    label: "COMMITMENT",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  meeting: {
    icon: Calendar,
    label: "MEETING",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    textColor: "text-violet-600 dark:text-violet-400",
    borderColor: "border-violet-200 dark:border-violet-800",
  },
  relationship: {
    icon: UserCircle,
    label: "RELATIONSHIP",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    textColor: "text-pink-600 dark:text-pink-400",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
  followup: {
    icon: Send,
    label: "FOLLOW-UP",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    textColor: "text-cyan-600 dark:text-cyan-400",
    borderColor: "border-cyan-200 dark:border-cyan-800",
  },
};

interface FocusViewProps {
  item: AttentionItem | null;
  onClose: () => void;
  onAction: (actionId: string, item: AttentionItem) => void;
  onNavigateToSource?: (sourceType: string, sourceId?: string) => void;
}

// Source type icons and labels for navigation
const SOURCE_CONFIG: Record<
  string,
  { icon: React.ElementType; label: string; navigateTo: string }
> = {
  Email: { icon: Mail, label: "View Email", navigateTo: "email" },
  Slack: { icon: MessageSquare, label: "View Thread", navigateTo: "slack" },
  Meeting: { icon: Video, label: "View Transcript", navigateTo: "meetings" },
  "Meeting Transcript": {
    icon: Video,
    label: "View Transcript",
    navigateTo: "meetings",
  },
  Document: {
    icon: ExternalLink,
    label: "View Document",
    navigateTo: "document",
  },
  Report: { icon: ExternalLink, label: "View Report", navigateTo: "reports" },
  Linear: { icon: Target, label: "View in Linear", navigateTo: "linear" },
  Notion: { icon: ExternalLink, label: "View in Notion", navigateTo: "notion" },
  CRM: { icon: Users, label: "View Contact", navigateTo: "contacts" },
  Contact: { icon: Users, label: "View Contact", navigateTo: "contacts" },
  Swimlane: {
    icon: GitBranch,
    label: "View Timeline",
    navigateTo: "swimlanes",
  },
  Calendar: { icon: Calendar, label: "View Event", navigateTo: "calendar" },
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
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    role: "Product Lead",
    avatar: "SC",
    isInternal: true,
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    email: "mike.rodriguez@company.com",
    role: "Engineering Manager",
    avatar: "MR",
    isInternal: true,
  },
  {
    id: "3",
    name: "Emily Watson",
    email: "emily.watson@company.com",
    role: "Legal Counsel",
    avatar: "EW",
    isInternal: true,
  },
  {
    id: "4",
    name: "James Park",
    email: "james.park@company.com",
    role: "Finance Director",
    avatar: "JP",
    isInternal: true,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    role: "Operations Lead",
    avatar: "LT",
    isInternal: true,
  },
  {
    id: "6",
    name: "David Kim",
    email: "david.kim@company.com",
    role: "DevOps Lead",
    avatar: "DK",
    isInternal: true,
  },
  {
    id: "7",
    name: "Anna Martinez",
    email: "anna.martinez@company.com",
    role: "CTO",
    avatar: "AM",
    isInternal: true,
  },
];

// CRM contacts - external people
const CRM_CONTACTS = [
  {
    id: "ext-1",
    name: "John Smith",
    email: "john.smith@acme.com",
    company: "Acme Corp",
    isInternal: false,
  },
  {
    id: "ext-2",
    name: "Rachel Green",
    email: "rachel@northstar.io",
    company: "Northstar Inc",
    isInternal: false,
  },
  {
    id: "ext-3",
    name: "Tom Wilson",
    email: "twilson@techflow.com",
    company: "TechFlow",
    isInternal: false,
  },
];

// For backward compatibility
const SUGGESTED_COLLABORATORS = ORGANIZATION_DIRECTORY;

export const FocusView: React.FC<FocusViewProps> = ({
  item,
  onClose,
  onAction,
  onNavigateToSource,
}) => {
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>(
    [],
  );
  const [threadStarted, setThreadStarted] = useState(false);

  // Email compose modal state
  const [isEmailComposeOpen, setIsEmailComposeOpen] = useState(false);

  // Meeting-specific state for adding people to calendar
  const [isAddingPeople, setIsAddingPeople] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedInvitees, setAddedInvitees] = useState<
    Array<{
      id: string;
      name: string;
      email: string;
      isInternal: boolean;
      company?: string;
    }>
  >([]);
  // Tracks invitees that have been "sent" - they show in People Involved
  const [sentInvitees, setSentInvitees] = useState<
    Array<{ id: string; name: string; email: string; isInternal: boolean }>
  >([]);

  // Filter people based on search
  const filteredPeople =
    searchQuery.length > 0
      ? [
          ...ORGANIZATION_DIRECTORY.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.email.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
          ...CRM_CONTACTS.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.email.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        ]
      : [];

  // Check if search query is a valid email
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNewEmail =
    isValidEmail(searchQuery) &&
    !ORGANIZATION_DIRECTORY.some(
      (p) => p.email.toLowerCase() === searchQuery.toLowerCase(),
    ) &&
    !CRM_CONTACTS.some(
      (p) => p.email.toLowerCase() === searchQuery.toLowerCase(),
    ) &&
    !addedInvitees.some(
      (p) => p.email.toLowerCase() === searchQuery.toLowerCase(),
    );

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && item) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [item, onClose]);

  if (!item) return null;

  const attentionType: AttentionType =
    item.attentionType ||
    (item.itemType === "alert"
      ? "risk"
      : item.itemType === "meeting"
        ? "meeting"
        : item.itemType === "relationship"
          ? "relationship"
          : "commitment");

  const config = CATEGORY_CONFIG[attentionType];
  const CategoryIcon = config.icon;
  const interventionActions = getInterventionActions(item);

  // Get full content based on item type
  const getTitle = (): string => item.title;

  const getContext = (): string => {
    switch (item.itemType) {
      case "alert":
        return item.description;
      case "commitment":
        return item.context || "";
      case "meeting":
        return item.summary;
      case "relationship":
        return item.description;
      default:
        return "";
    }
  };

  const getTimestamp = (): string => {
    switch (item.itemType) {
      case "alert":
        return item.timestamp;
      case "commitment":
        return item.dueDate || "";
      case "meeting":
        return item.time;
      case "relationship":
        return `Last contact: ${item.lastContactDate}`;
      default:
        return "";
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
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[85vh] bg-card dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-border">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
            >
              <CategoryIcon size={12} strokeWidth={2.5} />
              <span className="text-[10px] font-bold tracking-wider">
                {config.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Title */}
            <div>
              <h1 className="text-xl font-semibold text-foreground mb-2">
                {getTitle()}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>{getTimestamp()}</span>
              </div>
            </div>

            {/* What Changed - subtle indicator that the system is alive and reactive */}
            {(item.isNew || item.isEscalated) && (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-[7px] text-xs ${
                  item.isEscalated
                    ? "bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30"
                    : "bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30"
                }`}
              >
                {item.isEscalated ? (
                  <>
                    <TrendingUp
                      size={12}
                      className="text-red-500 dark:text-red-400"
                    />
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      What changed:
                    </span>
                    <span className="text-red-700 dark:text-red-300">
                      Urgency escalated since yesterday
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles
                      size={12}
                      className="text-blue-500 dark:text-blue-400"
                    />
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      What changed:
                    </span>
                    <span className="text-blue-700 dark:text-blue-300">
                      New since your last visit
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Meeting-specific content - shown INSTEAD of attention item content */}
            {item.itemType === "meeting" ? (
              <>
                {/* Meeting Context */}
                {item.preMeetingBrief && (
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Meeting Context
                    </h2>
                    <p className="text-sm text-foreground leading-relaxed">
                      {item.preMeetingBrief.context}
                    </p>
                  </div>
                )}

                {/* Goals */}
                {item.preMeetingBrief?.goals &&
                  item.preMeetingBrief.goals.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Goals
                      </h2>
                      <ul className="space-y-1">
                        {item.preMeetingBrief.goals.map((goal, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-foreground"
                          >
                            <span className="text-blue-500 mt-0.5">•</span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* People Involved for meetings - includes original + newly invited */}
                {((item.collaborators && item.collaborators.length > 0) ||
                  sentInvitees.length > 0) && (
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      <Users size={12} />
                      People Involved (
                      {(item.collaborators?.length || 0) + sentInvitees.length})
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {/* Original collaborators */}
                      {item.collaborators?.map((person, index) => (
                        <div
                          key={`orig-${index}`}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary rounded-full"
                        >
                          <div className="w-4 h-4 rounded-full bg-muted-foreground/40 flex items-center justify-center text-[9px] font-medium text-muted-foreground">
                            {person.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-foreground">
                            {person}
                          </span>
                        </div>
                      ))}
                      {/* Newly invited people */}
                      {sentInvitees.map((person) => (
                        <div
                          key={person.id}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                            person.isInternal
                              ? "bg-violet-100 dark:bg-violet-900/30"
                              : "bg-accent/10"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-medium ${
                              person.isInternal
                                ? "bg-violet-300 dark:bg-violet-700 text-violet-700 dark:text-violet-200"
                                : "bg-accent/30 text-accent"
                            }`}
                          >
                            {(person.name || person.email)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span
                            className={`text-xs ${
                              person.isInternal
                                ? "text-violet-700 dark:text-violet-300"
                                : "text-accent"
                            }`}
                          >
                            {person.name || person.email}
                          </span>
                          <span className="text-[9px] text-muted-foreground">
                            invited
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Context: Origin + Why now - flowing naturally as paragraphs */}
                <div className="space-y-3">
                  <p className="text-sm text-foreground leading-relaxed">
                    {item.memory?.origin?.description || getContext()}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {item.memory?.trigger?.description ||
                      item.memoryRationale ||
                      ""}
                  </p>
                </div>

                {/* Item 7: Storyline indicator (lightweight, not a timeline) */}
                {(item.memory?.storyline?.isPartOfThread ||
                  item.memory?.storyline?.threadDescription) && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <GitBranch size={12} />
                    <span>
                      {item.memory?.storyline?.threadDescription ||
                        "Part of an ongoing thread"}
                    </span>
                    {item.memory?.storyline?.relatedItemIds &&
                      item.memory.storyline.relatedItemIds.length > 0 && (
                        <button className="text-accent hover:underline">
                          View history
                        </button>
                      )}
                  </div>
                )}

                {/* Item 3: Reappearance indicator in detail view */}
                {item.memory?.hasAppearedBefore &&
                  item.memory?.lifecycleState === "resurfaced" && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-[7px] text-xs bg-background border border-border">
                      <RotateCcw size={12} className="text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Resurfaced{" "}
                        {item.memory.resurfaceReason
                          ? `· ${item.memory.resurfaceReason}`
                          : "after inactivity"}
                      </span>
                    </div>
                  )}

                {/* Sources and People Involved - side by side - for attention items only */}
                <div className="flex items-start justify-between gap-6">
                  {/* Sources - clickable links to original content */}
                  {item.evidence && item.evidence.length > 0 && (
                    <div className="flex-1">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Sources
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {item.evidence.map((evidence, index) => {
                          const config = SOURCE_CONFIG[evidence.type] || {
                            icon: ExternalLink,
                            label: "View Source",
                            navigateTo: "external",
                          };
                          const SourceIcon = config.icon;
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                if (evidence.url) {
                                  // External URL - open in new tab
                                  window.open(evidence.url, "_blank");
                                } else if (onNavigateToSource) {
                                  // Internal navigation
                                  onNavigateToSource(
                                    config.navigateTo,
                                    evidence.type,
                                  );
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-secondary border border-border rounded-[7px] text-muted-foreground hover:border-accent hover:bg-accent/10 hover:text-accent transition-colors group"
                              title={config.label}
                            >
                              <SourceIcon
                                size={12}
                                className="opacity-60 group-hover:opacity-100"
                              />
                              <span>{evidence.type}</span>
                              <ExternalLink
                                size={10}
                                className="opacity-40 group-hover:opacity-70"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* People Involved - right side */}
                  {item.collaborators && item.collaborators.length > 0 && (
                    <div className="flex-shrink-0">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                        <Users size={12} />
                        People Involved ({item.collaborators.length})
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {item.collaborators.map((person, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary rounded-full"
                          >
                            <div className="w-4 h-4 rounded-full bg-muted-foreground/40 flex items-center justify-center text-[9px] font-medium text-muted-foreground">
                              {person.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs text-foreground">
                              {person}
                            </span>
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
              {item.itemType === "meeting" && isAddingPeople && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-border pt-4 overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Calendar size={12} />
                        Add to Calendar Invite
                      </h2>
                      <button
                        onClick={() => {
                          setIsAddingPeople(false);
                          setSearchQuery("");
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Search input */}
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search people or enter email..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-background border border-border rounded-[7px] focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-muted-foreground"
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
                                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            <span>{person.name || person.email}</span>
                            <button
                              onClick={() =>
                                setAddedInvitees((prev) =>
                                  prev.filter((p) => p.id !== person.id),
                                )
                              }
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
                          const isAlreadyAdded = addedInvitees.some(
                            (p) => p.email === person.email,
                          );
                          if (isAlreadyAdded) return null;
                          return (
                            <button
                              key={person.id}
                              onClick={() => {
                                setAddedInvitees((prev) => [
                                  ...prev,
                                  {
                                    id: person.id,
                                    name: person.name,
                                    email: person.email,
                                    isInternal: person.isInternal,
                                    company:
                                      "company" in person
                                        ? person.company
                                        : undefined,
                                  },
                                ]);
                                setSearchQuery("");
                              }}
                              className="w-full flex items-center gap-2.5 p-2.5 rounded-[7px] border border-border hover:border-accent bg-background transition-all"
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${
                                  person.isInternal
                                    ? "bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300"
                                    : "bg-neutral-200 dark:bg-neutral-700 text-muted-foreground"
                                }`}
                              >
                                {"avatar" in person
                                  ? person.avatar
                                  : person.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                  {person.name}
                                  {person.isInternal && (
                                    <span className="px-1.5 py-0.5 text-[9px] bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded">
                                      Internal
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  {person.email}
                                  {"company" in person && (
                                    <>
                                      <span>•</span>
                                      <Building2 size={9} />
                                      {person.company}
                                    </>
                                  )}
                                </div>
                              </div>
                              <Plus
                                size={14}
                                className="text-muted-foreground"
                              />
                            </button>
                          );
                        })}

                        {/* Add external email option */}
                        {isNewEmail && (
                          <button
                            onClick={() => {
                              setAddedInvitees((prev) => [
                                ...prev,
                                {
                                  id: `ext-new-${Date.now()}`,
                                  name: "",
                                  email: searchQuery,
                                  isInternal: false,
                                },
                              ]);
                              setSearchQuery("");
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 rounded-[7px] border border-dashed border-border hover:border-accent bg-background transition-all"
                          >
                            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-700">
                              <Mail
                                size={12}
                                className="text-muted-foreground"
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-xs font-medium text-foreground">
                                Add external: {searchQuery}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                Send calendar invite to this email
                              </div>
                            </div>
                            <Plus size={14} className="text-muted-foreground" />
                          </button>
                        )}

                        {filteredPeople.length === 0 &&
                          !isNewEmail &&
                          searchQuery.length > 2 && (
                            <p className="text-xs text-muted-foreground text-center py-3">
                              No matches found. Enter a full email to invite
                              externally.
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
              {item.itemType !== "meeting" && isCollaborating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-border pt-4 overflow-hidden"
                >
                  {!threadStarted ? (
                    // People Selector - Choose who to bring in
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <UserPlus size={12} />
                          Bring people into this conversation
                        </h2>
                        <button
                          onClick={() => setIsCollaborating(false)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Suggested collaborators */}
                      <div className="space-y-1.5">
                        {SUGGESTED_COLLABORATORS.map((person) => {
                          const isSelected = selectedCollaborators.includes(
                            person.id,
                          );
                          return (
                            <button
                              key={person.id}
                              onClick={() => {
                                setSelectedCollaborators((prev) =>
                                  isSelected
                                    ? prev.filter((id) => id !== person.id)
                                    : [...prev, person.id],
                                );
                              }}
                              className={`w-full flex items-center gap-2.5 p-2.5 rounded-[7px] border transition-all ${
                                isSelected
                                  ? "bg-accent/10 border-accent/20"
                                  : "bg-background border-border hover:border-accent"
                              }`}
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${
                                  isSelected
                                    ? "bg-accent/20 text-accent"
                                    : "bg-neutral-200 dark:bg-neutral-700 text-muted-foreground"
                                }`}
                              >
                                {person.avatar}
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-xs font-medium text-foreground">
                                  {person.name}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {person.role}
                                </div>
                              </div>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
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
                        className={`w-full py-2.5 rounded-[7px] text-xs font-medium transition-colors ${
                          selectedCollaborators.length > 0
                            ? "bg-accent hover:bg-accent/90 text-white"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        {selectedCollaborators.length > 0
                          ? `Start thread with ${selectedCollaborators.length} ${selectedCollaborators.length === 1 ? "person" : "people"}`
                          : "Select people to collaborate with"}
                      </button>
                    </div>
                  ) : (
                    // Collaboration Thread - Active conversation
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Thread
                          </h2>
                          <div className="flex -space-x-1.5">
                            {selectedCollaborators.slice(0, 3).map((id) => {
                              const person = SUGGESTED_COLLABORATORS.find(
                                (p) => p.id === id,
                              );
                              return person ? (
                                <div
                                  key={id}
                                  className="w-5 h-5 rounded-full bg-accent/20 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-[8px] font-medium text-accent"
                                >
                                  {person.avatar}
                                </div>
                              ) : null;
                            })}
                            {selectedCollaborators.length > 3 && (
                              <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-[8px] font-medium text-muted-foreground">
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
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Close thread
                        </button>
                      </div>
                      <CollaborationThread
                        thread={(item as AttentionItemWithThread).thread}
                        participants={[
                          ...(item.collaborators || []),
                          ...selectedCollaborators
                            .map(
                              (id) =>
                                SUGGESTED_COLLABORATORS.find((p) => p.id === id)
                                  ?.name || "",
                            )
                            .filter(Boolean),
                        ]}
                        onAddComment={(content, mentions) => {
                          console.log(
                            "New comment:",
                            content,
                            "Mentions:",
                            mentions,
                          );
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer with Actions */}
          <div className="shrink-0 px-5 py-4 border-t border-border bg-background/50">
            <div className="flex items-center justify-end gap-2">
              {item.itemType === "meeting" ? (
                <>
                  {isAddingPeople && addedInvitees.length > 0 ? (
                    <>
                      {/* Cancel - when invitees are ready to send */}
                      <button
                        onClick={() => {
                          setIsAddingPeople(false);
                          setSearchQuery("");
                          setAddedInvitees([]);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-secondary text-muted-foreground border border-border rounded-[7px] hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                      >
                        <X size={12} />
                        Cancel
                      </button>

                      {/* Send - adds invitees to People Involved */}
                      <button
                        onClick={() => {
                          // Add invitees to sentInvitees so they show in People Involved
                          setSentInvitees((prev) => [
                            ...prev,
                            ...addedInvitees.map((p) => ({
                              id: p.id,
                              name: p.name,
                              email: p.email,
                              isInternal: p.isInternal,
                            })),
                          ]);
                          // In a real app, this would call calendar API to send invites
                          console.log(
                            "Sending calendar invites to:",
                            addedInvitees,
                          );
                          onAction("send-calendar-invite", item);
                          setIsAddingPeople(false);
                          setSearchQuery("");
                          setAddedInvitees([]);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-card hover:bg-background dark:hover:bg-neutral-700 text-foreground border border-border rounded-[7px] transition-colors shadow-sm"
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
                            setSearchQuery("");
                            setAddedInvitees([]);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 rounded-[7px] hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors ${
                          isAddingPeople
                            ? "ring-2 ring-accent ring-offset-2 dark:ring-offset-neutral-900"
                            : ""
                        }`}
                      >
                        <UserPlus size={12} />
                        {isAddingPeople ? "Cancel" : "Add People"}
                      </button>

                      {/* Join Now - primary action for meetings */}
                      <button
                        onClick={() => onAction("join-meeting", item)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-accent hover:bg-accent/90 text-white rounded-[7px] transition-colors"
                      >
                        <Video size={12} />
                        Join Now
                      </button>

                      {/* Reschedule */}
                      <button
                        onClick={() => onAction("reschedule", item)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-accent/10 text-accent border border-accent/20 rounded-[7px] hover:bg-accent/15 transition-colors"
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
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-accent/10 text-accent border border-accent/20 rounded-[7px] hover:bg-accent/15 transition-colors ${
                      isCollaborating
                        ? "ring-2 ring-accent ring-offset-2 dark:ring-offset-neutral-900"
                        : ""
                    }`}
                  >
                    <UserPlus size={12} />
                    {isCollaborating ? "Cancel" : "Collaborate"}
                  </button>

                  {/* Item 5: Intervention actions (not completion actions) */}
                  {interventionActions.map((action) => {
                    const ActionIcon = action.icon;
                    const isEmailAction =
                      action.id === "send-email" ||
                      action.id === "send-followup";
                    return (
                      <button
                        key={action.id}
                        onClick={() => {
                          if (isEmailAction) {
                            setIsEmailComposeOpen(true);
                          } else {
                            onAction(action.id, item);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[7px] transition-colors ${
                          action.primary
                            ? "bg-accent hover:bg-accent/90 text-white"
                            : "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/15"
                        }`}
                      >
                        <ActionIcon size={12} />
                        {action.label}
                      </button>
                    );
                  })}

                  {/* Defer - moved from homepage (Item 9: homepage = awareness only) */}
                  <button
                    onClick={() => onAction("defer", item)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-secondary text-muted-foreground border border-border rounded-[7px] hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
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

      {/* Email Compose Modal */}
      <EmailCompose
        isOpen={isEmailComposeOpen}
        onClose={() => setIsEmailComposeOpen(false)}
        item={item}
      />
    </AnimatePresence>
  );
};

export default FocusView;
