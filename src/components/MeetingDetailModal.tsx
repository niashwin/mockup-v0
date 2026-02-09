import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Video,
  FileText,
  CheckCircle2,
  MessageSquare,
  Share2,
  Lock,
  UsersRound,
} from "lucide-react";
import { MeetingBrief } from "../types";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";

const NEUTRAL_AVATAR =
  "from-neutral-300 to-neutral-400 dark:from-neutral-600 dark:to-neutral-700";

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const getPersonColor = (_name: string): string => NEUTRAL_AVATAR;

interface MeetingDetailModalProps {
  meeting: MeetingBrief | null;
  onClose: () => void;
  onPersonClick: (personName: string) => void;
  onViewTranscript: (meetingId: string, timestamp?: string) => void;
  onViewReport: (reportId: string) => void;
  onTogglePrivacy?: (meetingId: string) => void;
}

// Enhanced action items with organizational context
interface EnhancedActionItem {
  id: number;
  text: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
  transcriptTimestamp?: string;
  affectsDownstream?: string;
  unblocks?: string;
  riskIfIgnored?: string;
}

export const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({
  meeting,
  onClose,
  onPersonClick,
  onViewTranscript,
  onViewReport,
  onTogglePrivacy,
}) => {
  if (!meeting) return null;
  const isPrivate = !!meeting.isPrivate;

  // Enhanced meeting brief - the "first screenful" content
  const meetingBrief = {
    purpose: `Align on ${meeting.title.toLowerCase()} priorities and identify action items for the coming week.`,
    humanRecognition:
      "This meeting clarified ownership across teams and set clear next steps.",
  };

  // Enhanced action items with context
  const mockActionItems: EnhancedActionItem[] = [
    {
      id: 1,
      text: "Complete mobile app beta testing feedback review",
      assignee: "Sarah Chen",
      dueDate: "Feb 5",
      completed: false,
      transcriptTimestamp: "01:45",
      affectsDownstream: "Product launch timeline",
      unblocks: "Final QA sign-off",
      riskIfIgnored: "Launch delay by 1 week",
    },
    {
      id: 2,
      text: "Update Q3 roadmap based on user research findings",
      assignee: "Mike Johnson",
      dueDate: "Feb 6",
      completed: true,
      transcriptTimestamp: "02:15",
      affectsDownstream: "Engineering sprint planning",
      unblocks: "Feature prioritization meeting",
    },
    {
      id: 3,
      text: "Schedule follow-up with design team on new components",
      assignee: "Emma Davis",
      dueDate: "Feb 8",
      completed: false,
      transcriptTimestamp: "03:45",
      affectsDownstream: "Design system update",
      unblocks: "Component library v2",
    },
    {
      id: 4,
      text: "Share meeting notes with broader team via Slack",
      assignee: "Alex Rivera",
      dueDate: "Feb 4",
      completed: true,
      transcriptTimestamp: "04:35",
      affectsDownstream: "Team awareness",
    },
  ];

  const mockKeyDecisions = [
    {
      text: "Approved budget increase for Q3 marketing campaign",
      transcriptTimestamp: "00:45",
      transcriptExcerpt:
        "We've successfully migrated 80% of our core services to the new cluster. We're seeing about a 30% reduction in latency.",
      speaker: "Sarah Chen",
    },
    {
      text: "Decided to move mobile app launch from end of Q3 to mid-Q3",
      transcriptTimestamp: "02:15",
      transcriptExcerpt:
        "Regarding the Zinc-based aesthetic for the new Sentra dashboard\u2014how's the glassmorphic implementation going?",
      speaker: "Alex Lewis",
    },
    {
      text: "Agreed to implement weekly design reviews starting next sprint",
      transcriptTimestamp: "03:30",
      transcriptExcerpt:
        "I noticed some clipping on the timeline bubbles in the last build. Let's make sure the overflow is handled gracefully.",
      speaker: "Alex Lewis",
    },
  ];

  return (
    <AnimatePresence>
      {meeting && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className={`w-full max-w-4xl max-h-[85vh] bg-card dark:bg-neutral-900 border shadow-2xl shadow-black/20 rounded-[2rem] overflow-hidden flex flex-col pointer-events-auto relative border-border`}
            >
              {/* Header */}
              <div className="shrink-0 px-8 py-6 border-b border-border relative z-10 bg-card dark:bg-neutral-900">
                <div className="relative">
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            meeting.status === "completed"
                              ? "bg-muted-foreground"
                              : meeting.status === "in_progress"
                                ? "bg-green-500 animate-pulse"
                                : "bg-blue-500"
                          }`}
                        />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {meeting.status === "completed"
                            ? "Completed"
                            : meeting.status === "in_progress"
                              ? "In Progress"
                              : "Scheduled"}
                        </span>
                        <span
                          className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                            isPrivate
                              ? "text-muted-foreground bg-muted border-border"
                              : "text-muted-foreground bg-muted border-border"
                          }`}
                        >
                          {isPrivate ? (
                            <Lock size={10} />
                          ) : (
                            <UsersRound size={10} />
                          )}
                          {isPrivate ? "Private" : "Public"}
                        </span>
                      </div>
                      <h2 className="text-2xl font-semibold text-foreground mb-2">
                        {meeting.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>
                            {new Date(meeting.time).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{meeting.time}</span>
                        </div>
                        {meeting.location && (
                          <div className="flex items-center gap-1.5">
                            {meeting.location.includes("Zoom") ? (
                              <Video size={14} />
                            ) : (
                              <MapPin size={14} />
                            )}
                            <span>{meeting.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {onTogglePrivacy && (
                        <button
                          onClick={() => onTogglePrivacy(meeting.id)}
                          className={`px-3 py-1.5 rounded-[7px] text-xs font-bold border transition-all flex items-center gap-1.5 ${
                            isPrivate
                              ? "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                              : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                          }`}
                          title={isPrivate ? "Make public" : "Make private"}
                        >
                          {isPrivate ? (
                            <Lock size={12} />
                          ) : (
                            <UsersRound size={12} />
                          )}
                          {isPrivate ? "Private" : "Public"}
                        </button>
                      )}
                      <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-[7px] bg-secondary hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-sm hover:shadow"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    {meeting.status === "completed" && (
                      <button
                        onClick={() => onViewTranscript(meeting.id)}
                        className="px-3 py-1.5 bg-accent/10 dark:bg-accent/20 hover:bg-accent/15 dark:hover:bg-accent/25 text-accent text-xs font-bold rounded-[7px] border border-accent/20 dark:border-accent/30 transition-all flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95"
                      >
                        <MessageSquare size={12} />
                        Transcript
                      </button>
                    )}
                    {meeting.status === "completed" && (
                      <button className="px-3 py-1.5 bg-background hover:bg-muted text-muted-foreground text-xs font-bold rounded-[7px] border border-border transition-all flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95">
                        <Share2 size={12} />
                        Share
                      </button>
                    )}
                    {meeting.hasBrief && meeting.status !== "completed" && (
                      <button className="px-3 py-1.5 bg-background hover:bg-muted text-muted-foreground text-xs font-bold rounded-[7px] border border-border transition-all flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95">
                        <FileText size={12} />
                        Pre-meeting Brief
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar relative z-10">
                <div className="space-y-6">
                  {/* Meeting Purpose - Why did this meeting exist? */}
                  {meeting.status === "completed" && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Purpose
                      </h3>
                      <p className="text-sm text-foreground leading-relaxed">
                        {meetingBrief.purpose}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        {meetingBrief.humanRecognition}
                      </p>
                    </section>
                  )}

                  {/* Attendees */}
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Attendees ({meeting.attendees.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((person, idx) => (
                        <button
                          key={idx}
                          onClick={() => onPersonClick(person)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-sm text-foreground transition-colors group/att"
                        >
                          <div
                            className={`w-6 h-6 rounded-full bg-gradient-to-br ${getPersonColor(person)} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}
                          >
                            {getInitials(person)}
                          </div>
                          <span className="group-hover/att:text-accent transition-colors">
                            {person}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Key Decisions */}
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Key Decisions
                    </h3>
                    <ul className="space-y-2">
                      {mockKeyDecisions.map((decision, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-foreground group"
                        >
                          <span className="text-muted-foreground mt-1.5">
                            •
                          </span>
                          <span className="flex-1">{decision.text}</span>
                          <HoverCard openDelay={200}>
                            <HoverCardTrigger asChild>
                              <button
                                onClick={() => {
                                  onClose();
                                  onViewTranscript(
                                    meeting.id,
                                    decision.transcriptTimestamp,
                                  );
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground/50 hover:text-blue-500 transition-all shrink-0 mt-0.5"
                                title="View in transcript"
                              >
                                <MessageSquare size={12} />
                              </button>
                            </HoverCardTrigger>
                            <HoverCardContent side="left" className="w-72 p-3">
                              <div className="border-l-2 border-blue-500 pl-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                  <span className="font-medium">
                                    {decision.speaker}
                                  </span>
                                  <span>at {decision.transcriptTimestamp}</span>
                                </div>
                                <p className="text-xs text-foreground italic">
                                  &ldquo;{decision.transcriptExcerpt}&rdquo;
                                </p>
                                <p className="text-[10px] text-accent mt-2 font-medium">
                                  Click to view in transcript &rarr;
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Commitments */}
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Commitments
                    </h3>
                    <div className="space-y-2">
                      {mockActionItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 py-2"
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                              item.completed
                                ? "bg-accent border-accent"
                                : "border-border"
                            }`}
                          >
                            {item.completed && (
                              <CheckCircle2
                                size={10}
                                className="text-white"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm ${
                                item.completed
                                  ? "text-muted-foreground line-through"
                                  : "text-foreground"
                              }`}
                            >
                              {item.text}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <button
                                onClick={() => onPersonClick(item.assignee)}
                                className="hover:text-foreground hover:underline transition-colors"
                              >
                                {item.assignee}
                              </button>
                              <span>•</span>
                              <span>Due {item.dueDate}</span>
                              {item.transcriptTimestamp && (
                                <HoverCard openDelay={200}>
                                  <HoverCardTrigger asChild>
                                    <button
                                      onClick={() => {
                                        onClose();
                                        onViewTranscript(
                                          meeting.id,
                                          item.transcriptTimestamp,
                                        );
                                      }}
                                      className="ml-auto p-1 text-muted-foreground/40 hover:text-emerald-500 transition-all"
                                      title="View in transcript"
                                    >
                                      <MessageSquare size={11} />
                                    </button>
                                  </HoverCardTrigger>
                                  <HoverCardContent
                                    side="left"
                                    className="w-64 p-3"
                                  >
                                    <div className="border-l-2 border-emerald-500 pl-3">
                                      <div className="text-xs text-muted-foreground mb-1">
                                        <span className="font-medium">
                                          Transcript
                                        </span>{" "}
                                        at {item.transcriptTimestamp}
                                      </div>
                                      <p className="text-[10px] text-accent mt-1 font-medium">
                                        Click to view in transcript &rarr;
                                      </p>
                                    </div>
                                  </HoverCardContent>
                                </HoverCard>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
