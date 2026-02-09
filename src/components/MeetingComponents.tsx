import React, { useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  Video,
  ExternalLink,
  FileText,
  ChevronRight,
  ArrowLeft,
  Clock,
  Lock,
  UsersRound,
  UserPlus,
  Target,
  CheckCircle2,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { MeetingBrief } from "../types";

const NEUTRAL_AVATAR =
  "from-neutral-300 to-neutral-400 dark:from-neutral-600 dark:to-neutral-700";

const getPersonColor = (_name: string) => NEUTRAL_AVATAR;

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const MeetingDetailCard = ({
  meeting,
  onClick,
  onDescriptionClick,
  onTogglePrivacy,
  onPersonClick,
  isHero = false,
}: {
  meeting: MeetingBrief;
  onClick?: () => void;
  onDescriptionClick?: () => void;
  onTogglePrivacy?: () => void;
  onPersonClick?: (name: string) => void;
  isHero?: boolean;
}) => {
  const isPrivate = !!meeting.isPrivate;

  return (
    <div
      className={`
            bg-background
            border rounded-[2rem] p-6 lg:p-7
            shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.25)]
            relative overflow-hidden group transition-all duration-300
            ${
              isPrivate
                ? "border-border ring-1 ring-border"
                : "border-border ring-1 ring-border"
            }
            ${onClick ? "cursor-pointer hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1" : ""}
        `}
      onClick={onClick}
    >
      {/* Decorative gradient blob */}
      {isHero && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
      )}
      {!isHero && !isPrivate && (
        <div className="absolute top-0 right-0 w-48 h-48 bg-neutral-200/20 dark:bg-neutral-800/20 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      {isPrivate && (
        <div className="absolute top-0 right-0 w-48 h-48 bg-neutral-200/20 dark:bg-neutral-800/20 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none" />
      )}

      {isHero && (
        <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
      )}
      {isPrivate && (
        <div className="absolute top-0 left-0 w-1.5 h-full bg-muted-foreground" />
      )}

      <div className="flex flex-col gap-5 relative z-10">
        {/* Header: Status & Time */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {isHero ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 rounded-full border border-accent/20 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Starting Soon
              </span>
            ) : (
              <span className="text-[10px] font-bold text-muted-foreground bg-muted dark:bg-neutral-800 px-2 py-1 rounded-full uppercase tracking-wider">
                Upcoming
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onTogglePrivacy && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePrivacy();
                }}
                className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                  isPrivate
                    ? "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                }`}
                title={isPrivate ? "Make public" : "Make private"}
              >
                {isPrivate ? <Lock size={10} /> : <UsersRound size={10} />}
                {isPrivate ? "Private" : "Public"}
              </button>
            )}
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-background dark:bg-neutral-800/50 px-2.5 py-1 rounded-[7px]">
              <Clock size={12} />
              <span>{meeting.time}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground leading-tight tracking-tight group-hover:text-foreground transition-colors">
            {meeting.title}
          </h2>

          <div
            className={`group/desc ${onDescriptionClick ? "cursor-pointer" : ""}`}
            onClick={(e) => {
              if (onDescriptionClick) {
                e.stopPropagation();
                onDescriptionClick();
              }
            }}
          >
            <p className="text-muted-foreground leading-relaxed text-xs lg:text-sm line-clamp-2">
              {meeting.summary}
            </p>
            {onDescriptionClick && (
              <div className="flex items-center gap-1 text-xs font-bold text-accent mt-2 hover:underline">
                View Brief <ChevronRight size={12} />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {meeting.attendees.map((att, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  onPersonClick?.(att);
                }}
                className="flex items-center gap-1.5 pl-1 pr-2.5 py-0.5 rounded-full bg-background dark:bg-neutral-800/50 border border-border text-[10px] font-medium text-muted-foreground hover:border-accent/30 hover:text-foreground transition-colors cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-gradient-to-br ${getPersonColor(att)} flex items-center justify-center text-[8px] font-bold text-white`}
                >
                  {getInitials(att)}
                </div>
                {att.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Footer: Location & Action */}
        <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            {meeting.location.includes("Zoom") ||
            meeting.location.includes("Meet") ? (
              <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                <Video size={12} />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                <MapPin size={12} />
              </div>
            )}
            <span className="truncate max-w-[120px]">{meeting.location}</span>
          </div>

          {meeting.meetingLink && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(meeting.meetingLink, "_blank");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-muted text-white dark:text-foreground rounded-[7px] text-xs font-bold shadow-lg shadow-neutral-200 dark:shadow-black/50 hover:scale-105 active:scale-95 transition-all"
            >
              Join Now <ExternalLink size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const PreMeetingBriefOverlay = ({
  meeting,
  onClose,
  onEmail,
}: {
  meeting: MeetingBrief;
  onClose: () => void;
  onEmail?: () => void;
}) => {
  const [showAddPeople, setShowAddPeople] = useState(false);
  const [newPerson, setNewPerson] = useState("");
  const [addedPeople, setAddedPeople] = useState<string[]>([]);

  // Mock data for the brief
  const briefData = {
    objective: `Review progress on ${meeting.title.toLowerCase()} and align on next steps.`,
    keyTopics: [
      "Review current status and blockers",
      "Discuss timeline and dependencies",
      "Align on action items and ownership",
    ],
    openItems: [
      {
        text: "Finalize budget allocation",
        owner: "Sarah Chen",
        status: "pending",
      },
      {
        text: "Review design mockups",
        owner: "Mike Johnson",
        status: "in-progress",
      },
    ],
    context:
      "This is a follow-up from last week's planning session. Key decisions from that meeting are pending confirmation.",
  };

  const handleAddPerson = () => {
    if (newPerson.trim()) {
      setAddedPeople([...addedPeople, newPerson.trim()]);
      setNewPerson("");
    }
  };

  const allAttendees = [...meeting.attendees, ...addedPeople];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-card dark:bg-primary rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in fade-in zoom-in-95 duration-200 border border-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted dark:hover:bg-neutral-800 rounded-full transition-colors z-10"
        >
          <X size={20} className="text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-accent font-bold uppercase tracking-wider mb-2">
            <FileText size={14} />
            Pre-meeting Brief
          </div>
          <h2 className="text-xl font-bold text-foreground">{meeting.title}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>
                {new Date(meeting.time).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{meeting.time}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Attendees with Add button */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Attendees ({allAttendees.length})
              </h3>
              <button
                onClick={() => setShowAddPeople(!showAddPeople)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-xs font-bold transition-colors ${
                  showAddPeople
                    ? "bg-accent text-white"
                    : "bg-accent/10 text-accent hover:bg-accent/15"
                }`}
              >
                <UserPlus size={12} />
                Add people
              </button>
            </div>
            {showAddPeople && (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddPerson()}
                  placeholder="Enter name or email..."
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-[7px] bg-card dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  autoFocus
                />
                <button
                  onClick={handleAddPerson}
                  className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-[7px] text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {allAttendees.map((person, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1.5 rounded-[7px] text-sm ${
                    idx >= meeting.attendees.length
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {person}
                </span>
              ))}
            </div>
          </section>

          {/* Objective */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} className="text-blue-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Objective
              </h3>
            </div>
            <p className="text-sm text-foreground">{briefData.objective}</p>
          </section>

          {/* Key Topics */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Key Topics
            </h3>
            <ul className="space-y-2">
              {briefData.keyTopics.map((topic, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span className="text-muted-foreground mt-1">•</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Open Items from Previous Meetings */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-muted-foreground" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Open Items
              </h3>
            </div>
            <div className="space-y-2">
              {briefData.openItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 px-3 bg-muted/50 dark:bg-muted/30 rounded-[7px] border border-border"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${item.status === "in-progress" ? "bg-accent" : "bg-muted-foreground"}`}
                    />
                    <span className="text-sm text-foreground">{item.text}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.owner}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Context */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Context
            </h3>
            <p className="text-sm text-muted-foreground italic">
              {briefData.context}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {meeting.location.includes("Zoom") ||
            meeting.location.includes("Meet") ? (
              <Video size={14} className="text-blue-500" />
            ) : (
              <MapPin size={14} className="text-orange-500" />
            )}
            <span>{meeting.location}</span>
          </div>
          <div className="flex items-center gap-2">
            {onEmail && (
              <button
                onClick={onEmail}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded-[7px] text-sm font-bold transition-colors border border-blue-100 dark:border-blue-900/30"
              >
                <Mail size={14} />
                Email Attendees
              </button>
            )}
            {meeting.meetingLink && (
              <button
                onClick={() => window.open(meeting.meetingLink, "_blank")}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-[7px] text-sm font-bold transition-colors"
              >
                Join Meeting <ExternalLink size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
