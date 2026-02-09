import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@lib/motion";
import type { Meeting } from "@types/meeting";

interface MeetingTranscriptTabProps {
  meeting: Meeting;
}

/**
 * Transcript tab content for meeting detail view
 * Displays the full meeting transcript
 */
export function MeetingTranscriptTab({ meeting }: MeetingTranscriptTabProps) {
  if (!meeting.transcript) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-ui text-muted-foreground">
          No transcript available for this meeting
        </p>
      </div>
    );
  }

  // Split transcript into paragraphs for better readability
  const paragraphs = meeting.transcript.split("\n\n").filter((p) => p.trim());

  return (
    <motion.div
      className="flex-1 overflow-y-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="px-6 py-6 space-y-4">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            variants={staggerItem}
            className="text-body text-foreground leading-relaxed whitespace-pre-wrap"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
