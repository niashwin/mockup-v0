import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ChevronRight,
  Video,
  MapPin,
  Phone,
  Lock,
  UsersRound,
  FileText,
  Search,
  X,
} from "lucide-react";
import { MeetingBrief } from "../types";
import { MeetingDetailModal } from "./MeetingDetailModal";
import { ContactDrawer } from "./crm/layouts/card-grid/contact-drawer";
import { TranscriptModal } from "./TranscriptModal";
import type { Contact } from "@types/contact";

// ─── Helpers ────────────────────────────────────────────────────────────────

const getMeetingTypeIcon = (location: string) => {
  const iconClass =
    "w-10 h-10 rounded-[var(--radius)] bg-accent/8 dark:bg-accent/15 flex items-center justify-center text-accent shrink-0";

  if (
    location.includes("Zoom") ||
    location.includes("Meet") ||
    location.includes("Teams")
  ) {
    return (
      <div className={iconClass}>
        <Video size={18} />
      </div>
    );
  }
  if (location === "Phone") {
    return (
      <div className={iconClass}>
        <Phone size={18} />
      </div>
    );
  }
  return (
    <div className={iconClass}>
      <MapPin size={18} />
    </div>
  );
};

const formatMeetingDate = (timeString: string) => {
  const today = new Date(2026, 1, 3);
  if (timeString.includes("Today")) {
    return "Today";
  }
  if (timeString.includes("Tomorrow")) {
    return "Tomorrow";
  }
  if (timeString.includes("Yesterday")) {
    return "Yesterday";
  }
  // For day-name formats like "Wed, 9:00 AM"
  if (timeString.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/)) {
    const dayName = timeString.split(",")[0];
    const dayMap: Record<string, string> = {
      Mon: "Mon, Feb 3",
      Tue: "Tue, Feb 4",
      Wed: "Wed, Feb 5",
      Thu: "Thu, Feb 6",
      Fri: "Fri, Feb 7",
      Sat: "Sat, Feb 8",
      Sun: "Sun, Feb 9",
    };
    return dayMap[dayName] || dayName;
  }
  return timeString.split(",")[0];
};

const formatMeetingTime = (timeString: string) => {
  // Extract just the time portion
  const parts = timeString.split(",");
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }
  return timeString;
};

const getDateGroupKey = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const generateMockContact = (name: string): Contact => {
  const parts = name.split(" ");
  const firstName = parts[0] || "Unknown";
  const lastName = parts.slice(1).join(" ") || "Person";
  const emailName = name.toLowerCase().replace(/\s+/g, ".");

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);

  const companies = [
    "Acme Corp",
    "TechVentures",
    "GlobalSync",
    "Meridian Partners",
    "Apex Solutions",
    "Catalyst Inc",
  ];
  const titles = [
    "VP of Product",
    "Engineering Manager",
    "Head of Design",
    "Director of Operations",
    "Senior Partner",
    "Chief of Staff",
  ];
  const relationships: Contact["relationship"][] = [
    "key_stakeholder",
    "champion",
    "decision_maker",
    "influencer",
    "contact",
  ];
  const categories: Contact["category"][] = ["client", "investor", "other"];
  const summaries = [
    "Strong advocate who consistently drives alignment across teams. Prefers async communication.",
    "Key decision-maker with deep technical background. Values data-driven proposals.",
    "Highly engaged partner focused on long-term strategic outcomes. Responsive on Slack.",
  ];

  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

  return {
    id: `mock-${emailName}`,
    firstName,
    lastName,
    company: companies[absHash % companies.length],
    title: titles[absHash % titles.length],
    email: `${emailName}@company.com`,
    phone: `+1 (555) ${String(absHash % 1000).padStart(3, "0")}-${String(absHash % 10000).padStart(4, "0")}`,
    linkedIn: `https://linkedin.com/in/${emailName}`,
    location: "San Francisco, CA",
    relationship: relationships[absHash % relationships.length],
    relationshipScore: 40 + (absHash % 60),
    category: categories[absHash % categories.length],
    roleBadges: ["Cross-functional Lead"],
    tags: ["enterprise", "q1-priority"],
    insights: {
      aiSummary: summaries[absHash % summaries.length],
      talkingPoints: [
        "Q1 roadmap alignment",
        "Budget approval",
        "Team expansion",
      ],
      risks: ["Follow-up cadence has slipped recently"],
      interests: ["AI/ML applications", "Team building"],
    },
    notes: {
      customSummary:
        "Met at last quarter's offsite. Great energy and very detail-oriented.",
    },
    interestingFacts: [
      {
        id: `fact-${absHash}-1`,
        content: "Previously worked at Google for 8 years",
        source: "Meeting - Jan 2026",
        extractedAt: daysAgo(14),
        category: "career" as const,
      },
    ],
    recentTopics: ["product roadmap", "Q1 targets", "hiring plans"],
    interactions: [
      {
        id: `int-${absHash}-1`,
        type: "meeting",
        date: daysAgo(2),
        subject: "Weekly Sync",
        summary: "Discussed project timelines.",
      },
      {
        id: `int-${absHash}-2`,
        type: "email",
        date: daysAgo(5),
        subject: "Follow-up on proposal",
        summary: "Shared updated proposal.",
      },
    ],
    lastContacted: daysAgo(2),
    nextFollowUp: new Date(now.getTime() + 5 * 86400000),
    createdAt: daysAgo(120),
    updatedAt: daysAgo(2),
  };
};

// ─── Privacy Badge ──────────────────────────────────────────────────────────

const PrivacyBadge = ({
  isPrivate,
  onClick,
}: {
  isPrivate: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer active:scale-95 ${
      isPrivate
        ? "bg-muted text-muted-foreground border-border hover:bg-neutral-200 dark:hover:bg-neutral-700"
        : "bg-accent/8 dark:bg-accent/15 text-accent border-accent/20 dark:border-accent/25 hover:bg-accent/12 dark:hover:bg-accent/20"
    }`}
    title={isPrivate ? "Make public" : "Make private"}
  >
    {isPrivate ? <Lock size={11} /> : <UsersRound size={11} />}
    {isPrivate ? "Private" : "Public"}
  </button>
);

// ─── Meeting Row ────────────────────────────────────────────────────────────

const MeetingRow = ({
  meeting,
  onClick,
  onTogglePrivacy,
  isPast = false,
}: {
  meeting: MeetingBrief;
  onClick: () => void;
  onTogglePrivacy: (id: string) => void;
  isPast?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer group transition-all duration-200 ease-out hover:bg-neutral-200/80 dark:hover:bg-neutral-700/60"
    onClick={onClick}
  >
    {/* Left: Meeting type icon */}
    {getMeetingTypeIcon(meeting.location)}

    {/* Center: Title + info */}
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-semibold text-foreground truncate">
        {meeting.title}
      </h3>
      {isPast ? (
        <p className="text-xs text-muted-foreground mt-0.5">
          {meeting.attendees[0] || "No attendees"}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground mt-0.5">
          <span>{formatMeetingDate(meeting.time)}</span>
          <span className="mx-0.5 text-border">·</span>
          <span>{formatMeetingTime(meeting.time)}</span>
        </p>
      )}
    </div>

    {/* Right: Privacy badge + time (for past) + arrow */}
    <div className="flex items-center gap-3 shrink-0">
      {isPast && (
        <span className="text-xs text-muted-foreground font-medium tabular-nums">
          {formatMeetingTime(meeting.time)}
        </span>
      )}
      <PrivacyBadge
        isPrivate={!!meeting.isPrivate}
        onClick={(e) => {
          e.stopPropagation();
          onTogglePrivacy(meeting.id);
        }}
      />
      <ChevronRight
        size={16}
        className="text-transparent group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all duration-200 ease-out"
      />
    </div>
  </motion.div>
);

// ─── Main Component ─────────────────────────────────────────────────────────

export const MeetingsPage = ({
  meetings,
  onTogglePrivacy,
}: {
  meetings: MeetingBrief[];
  onTogglePrivacy: (id: string) => void;
}) => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null,
  );
  const [selectedPersonName, setSelectedPersonName] = useState<string | null>(
    null,
  );
  const [showTranscriptId, setShowTranscriptId] = useState<string | null>(null);
  const [transcriptScrollTimestamp, setTranscriptScrollTimestamp] = useState<
    string | null
  >(null);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Partition meetings
  const upcoming = meetings
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const completed = meetings
    .filter((m) => m.status === "completed")
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  // Group past meetings by date (immutable)
  const pastByDate = completed.reduce<Record<string, MeetingBrief[]>>(
    (acc, m) => {
      const key = getDateGroupKey(m.timestamp);
      return { ...acc, [key]: [...(acc[key] || []), m] };
    },
    {},
  );

  const selectedMeeting = selectedMeetingId
    ? meetings.find((m) => m.id === selectedMeetingId) || null
    : null;

  const transcriptMeeting = showTranscriptId
    ? meetings.find((m) => m.id === showTranscriptId)
    : null;

  const visibleUpcoming = showAllUpcoming ? upcoming : upcoming.slice(0, 5);

  // Search: filter completed meetings by title or attendee name
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchResults =
    trimmedQuery.length > 0
      ? completed.filter(
          (m) =>
            m.title.toLowerCase().includes(trimmedQuery) ||
            m.attendees.some((a) => a.toLowerCase().includes(trimmedQuery)),
        )
      : [];
  const isSearching = trimmedQuery.length > 0;

  return (
    <div className="flex-1 overflow-y-auto h-full">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
        {/* ── Search Bar ──────────────────────────────────────── */}
        <div className="relative mb-6 px-4">
          <Search
            size={16}
            className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground/50"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past meetings by title or person..."
            className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-border bg-muted/30 dark:bg-neutral-900/40 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent/40 focus:bg-card dark:focus:bg-neutral-900/60 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ── Search Results ──────────────────────────────────── */}
        {isSearching ? (
          <section>
            <div className="px-4 mb-4">
              <p className="text-xs text-muted-foreground">
                {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""} for &ldquo;
                {searchQuery.trim()}&rdquo;
              </p>
            </div>
            <div className="space-y-0.5">
              {searchResults.map((meeting) => (
                <MeetingRow
                  key={meeting.id}
                  meeting={meeting}
                  onClick={() => setSelectedMeetingId(meeting.id)}
                  onTogglePrivacy={onTogglePrivacy}
                  isPast
                />
              ))}
              {searchResults.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search size={32} className="mb-3 opacity-20" />
                  <p className="text-sm font-medium">No meetings found</p>
                  <p className="text-xs mt-1">
                    Try a different name or meeting title.
                  </p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* ── Coming Up ─────────────────────────────────────────── */}
            {upcoming.length > 0 && (
              <section className="mb-12">
                <div className="flex items-baseline justify-between mb-5 px-4">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    Coming up
                  </h2>
                  {upcoming.length > 5 && (
                    <button
                      onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-all font-medium px-2.5 py-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    >
                      {showAllUpcoming ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>

                <div className="space-y-0.5">
                  {visibleUpcoming.map((meeting) => (
                    <MeetingRow
                      key={meeting.id}
                      meeting={meeting}
                      onClick={() => setSelectedMeetingId(meeting.id)}
                      onTogglePrivacy={onTogglePrivacy}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Past Meetings ─────────────────────────────────────── */}
            {Object.keys(pastByDate).length > 0 && (
              <section>
                {/* Divider */}
                <div className="border-t border-border mb-8" />

                {Object.entries(pastByDate).map(
                  ([dateLabel, dateMeetings], groupIdx) => (
                    <div key={dateLabel} className="mb-8">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
                        {dateLabel}
                      </h3>
                      <div className="space-y-0.5">
                        {dateMeetings.map((meeting, i) => (
                          <motion.div
                            key={meeting.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay:
                                (groupIdx * dateMeetings.length + i) * 0.03,
                              duration: 0.25,
                            }}
                          >
                            <MeetingRow
                              meeting={meeting}
                              onClick={() => setSelectedMeetingId(meeting.id)}
                              onTogglePrivacy={onTogglePrivacy}
                              isPast
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </section>
            )}

            {/* Empty state */}
            {upcoming.length === 0 && completed.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <FileText size={40} className="mb-4 opacity-30" />
                <p className="text-sm font-medium">No meetings yet</p>
                <p className="text-xs mt-1">
                  Meetings will appear here once scheduled.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Meeting Detail Modal ──────────────────────────────── */}
      <MeetingDetailModal
        meeting={selectedMeeting}
        onClose={() => setSelectedMeetingId(null)}
        onPersonClick={(name) => {
          setSelectedMeetingId(null);
          setSelectedPersonName(name);
        }}
        onViewTranscript={(id, timestamp) => {
          setSelectedMeetingId(null);
          setShowTranscriptId(id);
          setTranscriptScrollTimestamp(timestamp ?? null);
        }}
        onViewReport={() => {}}
        onTogglePrivacy={onTogglePrivacy}
      />

      {/* ── Transcript Modal ──────────────────────────────────── */}
      <TranscriptModal
        isOpen={!!showTranscriptId}
        onClose={() => {
          setShowTranscriptId(null);
          setTranscriptScrollTimestamp(null);
        }}
        meetingTitle={transcriptMeeting?.title}
        scrollToTimestamp={transcriptScrollTimestamp ?? undefined}
      />

      {/* ── Contact Drawer ────────────────────────────────────── */}
      <ContactDrawer
        contact={
          selectedPersonName ? generateMockContact(selectedPersonName) : null
        }
        isOpen={!!selectedPersonName}
        onClose={() => setSelectedPersonName(null)}
      />
    </div>
  );
};
