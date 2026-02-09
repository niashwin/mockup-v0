import { useMemo } from "react";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@lib/motion";
import { filterBySearch } from "@lib/search-utils";
import { MeetingCard } from "./meeting-card";
import type { Meeting } from "@types/meeting";

interface MeetingsListProps {
  meetings: Meeting[];
  selectedMeetingId: string | null;
  onSelectMeeting: (id: string) => void;
  searchQuery: string;
}

interface DateGroup {
  label: string;
  meetings: Meeting[];
}

function formatDateGroupLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function groupMeetingsByDate(meetings: Meeting[]): DateGroup[] {
  const groups = new Map<string, Meeting[]>();

  // Sort meetings by date descending
  const sortedMeetings = [...meetings].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  for (const meeting of sortedMeetings) {
    const dateKey = meeting.date.toDateString();
    const existing = groups.get(dateKey) || [];
    groups.set(dateKey, [...existing, meeting]);
  }

  return Array.from(groups.entries()).map(([dateKey, groupMeetings]) => ({
    label: formatDateGroupLabel(new Date(dateKey)),
    meetings: groupMeetings,
  }));
}

/**
 * Meetings list grouped by date
 * Filters meetings by search query
 */
export function MeetingsList({
  meetings,
  selectedMeetingId,
  onSelectMeeting,
  searchQuery,
}: MeetingsListProps) {
  // Filter meetings by search query
  const filteredMeetings = useMemo(
    () =>
      filterBySearch(meetings, searchQuery, (meeting) =>
        [
          meeting.title,
          meeting.summary,
          ...meeting.attendees.map((a) => a.name),
        ].join(" "),
      ),
    [meetings, searchQuery],
  );

  // Group by date
  const dateGroups = useMemo(
    () => groupMeetingsByDate(filteredMeetings),
    [filteredMeetings],
  );

  if (filteredMeetings.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-ui text-muted-foreground">
          {searchQuery ? "No meetings match your search" : "No meetings yet"}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex-1 overflow-y-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="px-6 pb-6 space-y-6">
        {dateGroups.map((group) => (
          <div key={group.label}>
            {/* Date group header */}
            <h2 className="text-caption font-medium text-muted-foreground mb-3 sticky top-0 bg-background py-2 -mx-6 px-6">
              {group.label}
            </h2>

            {/* Meeting cards */}
            <div className="space-y-3">
              {group.meetings.map((meeting) => (
                <motion.div key={meeting.id} variants={staggerItem}>
                  <MeetingCard
                    meeting={meeting}
                    isSelected={selectedMeetingId === meeting.id}
                    onClick={() => onSelectMeeting(meeting.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
