import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle2,
  MessageSquare,
  Share2,
  Lock,
  UsersRound,
  Circle,
} from "lucide-react";
import { MeetingBrief } from "../types";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";

// ─── Helpers ────────────────────────────────────────────────────────────────

const NEUTRAL_AVATAR =
  "from-neutral-300 to-neutral-400 dark:from-neutral-600 dark:to-neutral-700";

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const getPersonColor = (_name: string): string => NEUTRAL_AVATAR;

// ─── Types ──────────────────────────────────────────────────────────────────

interface MeetingDetailModalProps {
  meeting: MeetingBrief | null;
  onClose: () => void;
  onPersonClick: (personName: string) => void;
  onViewTranscript: (meetingId: string, timestamp?: string) => void;
  onViewReport?: (reportId: string) => void;
  onTogglePrivacy?: (meetingId: string) => void;
}

interface CommitmentItem {
  id: number;
  text: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
  transcriptTimestamp?: string;
}

interface KeyDecision {
  text: string;
  transcriptTimestamp: string;
  transcriptExcerpt: string;
  speaker: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_COMMITMENTS: CommitmentItem[] = [
  {
    id: 1,
    text: "Complete mobile app beta testing feedback review",
    assignee: "Sarah Chen",
    dueDate: "Feb 5",
    completed: false,
    transcriptTimestamp: "01:45",
  },
  {
    id: 2,
    text: "Update Q3 roadmap based on user research findings",
    assignee: "Mike Johnson",
    dueDate: "Feb 6",
    completed: true,
    transcriptTimestamp: "02:15",
  },
  {
    id: 3,
    text: "Schedule follow-up with design team on new components",
    assignee: "Emma Davis",
    dueDate: "Feb 8",
    completed: false,
    transcriptTimestamp: "03:45",
  },
  {
    id: 4,
    text: "Share meeting notes with broader team via Slack",
    assignee: "Alex Rivera",
    dueDate: "Feb 4",
    completed: true,
    transcriptTimestamp: "04:35",
  },
];

const MOCK_KEY_DECISIONS: KeyDecision[] = [
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
      "The user research is clear — we need to ship this sooner. Mid-Q3 is aggressive but achievable.",
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

// ─── Component ──────────────────────────────────────────────────────────────

export const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({
  meeting,
  onClose,
  onPersonClick,
  onViewTranscript,
  onTogglePrivacy,
}) => {
  useEffect(() => {
    if (!meeting) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [meeting, onClose]);

  const isPrivate = meeting ? !!meeting.isPrivate : false;

  const meetingBrief = meeting
    ? {
        purpose: `Align on ${meeting.title.toLowerCase()} priorities and identify action items for the coming week.`,
        humanRecognition:
          "This meeting clarified ownership across teams and set clear next steps.",
      }
    : { purpose: "", humanRecognition: "" };

  const getStatusLabel = () => {
    if (!meeting) return "";
    if (meeting.status === "completed") return "Completed";
    if (meeting.status === "cancelled") return "Cancelled";
    return "Scheduled";
  };

  const getStatusColor = () => {
    if (!meeting) return "bg-muted-foreground";
    if (meeting.status === "completed") return "bg-muted-foreground";
    if (meeting.status === "cancelled") return "bg-destructive";
    return "bg-accent";
  };

  return (
    <AnimatePresence>
      {meeting && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 32, stiffness: 420 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div className="w-full max-w-3xl max-h-[85vh] bg-card dark:bg-neutral-900 border border-border shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl overflow-hidden flex flex-col pointer-events-auto">
              {/* ── Header ─────────────────────────────────────── */}
              <div className="shrink-0 px-8 pt-6 pb-5 border-b border-border bg-card dark:bg-neutral-900">
                {/* Top row: status badges + controls */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusColor()}`}
                      />
                      {getStatusLabel()}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted dark:bg-neutral-800 px-2 py-0.5 rounded-full border border-border">
                      <UsersRound size={10} />
                      {isPrivate ? "Private" : "Public"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onTogglePrivacy && (
                      <button
                        onClick={() => onTogglePrivacy(meeting.id)}
                        className="px-3 py-1.5 rounded-[var(--radius)] text-xs font-semibold border border-border bg-background hover:bg-muted text-muted-foreground transition-all flex items-center gap-1.5 active:scale-95"
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
                      className="w-8 h-8 rounded-[var(--radius)] bg-background hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all border border-border"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-foreground mb-2.5 tracking-tight">
                  {meeting.title}
                </h2>

                {/* Metadata row */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="opacity-60" />
                    {(() => {
                      const d = new Date(meeting.time);
                      return isNaN(d.getTime())
                        ? meeting.time.split(",")[0]
                        : d.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          });
                    })()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="opacity-60" />
                    {meeting.time.includes(",")
                      ? meeting.time.split(",").pop()?.trim()
                      : meeting.time}
                  </span>
                  {meeting.location && (
                    <span className="flex items-center gap-1.5">
                      {meeting.location.includes("Zoom") ||
                      meeting.location.includes("Meet") ||
                      meeting.location.includes("Teams") ? (
                        <Video size={14} className="opacity-60" />
                      ) : (
                        <MapPin size={14} className="opacity-60" />
                      )}
                      {meeting.location}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {meeting.status === "completed" && (
                    <button
                      onClick={() => onViewTranscript(meeting.id)}
                      className="px-3.5 py-1.5 bg-accent/10 dark:bg-accent/15 hover:bg-accent/15 dark:hover:bg-accent/20 text-accent text-xs font-bold rounded-[var(--radius)] border border-accent/20 dark:border-accent/25 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <MessageSquare size={13} />
                      Transcript
                    </button>
                  )}
                  <button className="px-3.5 py-1.5 bg-background hover:bg-muted text-muted-foreground text-xs font-bold rounded-[var(--radius)] border border-border transition-all flex items-center gap-1.5 active:scale-95">
                    <Share2 size={13} />
                    Share
                  </button>
                </div>
              </div>

              {/* ── Content ────────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                <div className="space-y-7">
                  {/* PURPOSE */}
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Purpose
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      {meetingBrief.purpose}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 italic leading-relaxed">
                      {meetingBrief.humanRecognition}
                    </p>
                  </section>

                  {/* ATTENDEES */}
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Attendees ({meeting.attendees.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((person, idx) => (
                        <button
                          key={idx}
                          onClick={() => onPersonClick(person)}
                          className="flex items-center gap-2 pl-1.5 pr-3 py-1 bg-muted/60 dark:bg-neutral-800/60 hover:bg-muted dark:hover:bg-neutral-800 rounded-full text-sm text-foreground transition-colors group/att"
                        >
                          <div
                            className={`w-6 h-6 rounded-full bg-gradient-to-br ${getPersonColor(person)} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}
                          >
                            {getInitials(person)}
                          </div>
                          <span className="group-hover/att:text-accent transition-colors text-sm">
                            {person}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* KEY DECISIONS */}
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Key Decisions
                    </h3>
                    <ul className="space-y-3">
                      {MOCK_KEY_DECISIONS.map((decision, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm text-foreground group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                          <span className="flex-1 leading-relaxed">
                            {decision.text}
                          </span>
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
                                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground/40 hover:text-accent transition-all shrink-0 mt-0.5"
                                title="View in transcript"
                              >
                                <MessageSquare size={12} />
                              </button>
                            </HoverCardTrigger>
                            <HoverCardContent side="left" className="w-72 p-3">
                              <div className="border-l-2 border-accent pl-3">
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

                  {/* COMMITMENTS */}
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Commitments
                    </h3>
                    <div className="space-y-1">
                      {MOCK_COMMITMENTS.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0 group"
                        >
                          {/* Circular checkbox */}
                          <div className="shrink-0 mt-0.5">
                            {item.completed ? (
                              <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                                <CheckCircle2
                                  size={12}
                                  className="text-white"
                                  strokeWidth={2.5}
                                />
                              </div>
                            ) : (
                              <Circle
                                size={20}
                                className="text-border"
                                strokeWidth={1.5}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm leading-relaxed ${
                                item.completed
                                  ? "text-muted-foreground line-through decoration-muted-foreground/40"
                                  : "text-foreground"
                              }`}
                            >
                              {item.text}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                              <button
                                onClick={() => onPersonClick(item.assignee)}
                                className="hover:text-foreground hover:underline transition-colors"
                              >
                                {item.assignee}
                              </button>
                              <span className="text-border">·</span>
                              <span>Due {item.dueDate}</span>
                            </div>
                          </div>

                          {/* Transcript link */}
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
                                  className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground/30 hover:text-accent transition-all shrink-0"
                                  title="View in transcript"
                                >
                                  <MessageSquare size={13} />
                                </button>
                              </HoverCardTrigger>
                              <HoverCardContent
                                side="left"
                                className="w-64 p-3"
                              >
                                <div className="border-l-2 border-accent pl-3">
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
