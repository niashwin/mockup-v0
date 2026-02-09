import { motion, AnimatePresence } from "motion/react";
import { springs, fadeVariants } from "@lib/motion";
import { MeetingDetailHeader } from "./meeting-detail-header";
import { MeetingDetailTabs } from "./meeting-detail-tabs";
import { MeetingSummaryTab } from "./meeting-summary-tab";
import { MeetingTranscriptTab } from "./meeting-transcript-tab";
import { MeetingAttendeesTab } from "./meeting-attendees-tab";
import { useArchiveStore } from "@stores/archive-store";
import type { Meeting } from "@types/meeting";

interface MeetingDetailPaneProps {
  meeting: Meeting | null;
}

/**
 * Meeting detail pane showing full meeting information
 * Contains header, sub-tabs, and tab content
 */
export function MeetingDetailPane({ meeting }: MeetingDetailPaneProps) {
  const { meetingDetailTab, setMeetingDetailTab, selectMeeting } =
    useArchiveStore();

  const handleBack = () => {
    selectMeeting(null);
  };

  const handleCopyNotes = async () => {
    if (!meeting) return;

    const notes = `${meeting.title}
${meeting.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}

OVERVIEW
${meeting.overview}

KEY TAKEAWAYS
${meeting.keyTakeaways.map((t, i) => `${i + 1}. ${t.text}`).join("\n")}
`;

    try {
      await navigator.clipboard.writeText(notes);
    } catch (error) {
      console.error("Failed to copy notes to clipboard:", error);
    }
  };

  if (!meeting) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-px bg-border mx-auto mb-6" />
          <p className="text-heading font-medium text-muted-foreground">
            Select a meeting to view
          </p>
          <div className="w-24 h-px bg-border mx-auto mt-6" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={meeting.id}
      className="flex-1 flex flex-col overflow-hidden bg-background"
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      transition={springs.gentle}
    >
      {/* Header */}
      <MeetingDetailHeader
        meeting={meeting}
        onBack={handleBack}
        onCopyNotes={handleCopyNotes}
      />

      {/* Sub-tabs */}
      <MeetingDetailTabs
        activeTab={meetingDetailTab}
        onTabChange={setMeetingDetailTab}
        attendeesCount={meeting.attendees.length}
        className="px-6"
      />

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {meetingDetailTab === "summary" && (
          <MeetingSummaryTab key="summary" meeting={meeting} />
        )}
        {meetingDetailTab === "transcript" && (
          <MeetingTranscriptTab key="transcript" meeting={meeting} />
        )}
        {meetingDetailTab === "attendees" && (
          <MeetingAttendeesTab key="attendees" meeting={meeting} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
