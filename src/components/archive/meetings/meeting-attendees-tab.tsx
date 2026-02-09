import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Tick01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { cn } from "@lib/utils";
import { staggerContainer, staggerItem } from "@lib/motion";
import { Avatar } from "@components/ui/avatar";
import type { Meeting } from "@types/meeting";

interface MeetingAttendeesTabProps {
  meeting: Meeting;
}

/**
 * Attendees tab content for meeting detail view
 * Shows list of attendees with avatars, names, emails, and attendance status
 */
export function MeetingAttendeesTab({ meeting }: MeetingAttendeesTabProps) {
  const attendees = meeting.attendees;

  if (attendees.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-ui text-muted-foreground">
          No attendees recorded for this meeting
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
      <div className="px-6 py-6">
        <div className="divide-y divide-border-subtle">
          {attendees.map((attendee) => (
            <motion.div
              key={attendee.id}
              variants={staggerItem}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  name={attendee.name}
                  src={attendee.avatarUrl}
                  size="md"
                />
                <div>
                  <p className="text-ui font-medium text-foreground">
                    {attendee.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={12}
                      strokeWidth={1.5}
                    />
                    <span>{attendee.email}</span>
                  </div>
                </div>
              </div>

              {/* Attendance status */}
              <div
                className={cn(
                  "flex items-center gap-1.5 text-caption",
                  attendee.attended
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground",
                )}
              >
                {attendee.attended ? (
                  <>
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={16}
                      strokeWidth={2}
                    />
                    <span>Attended</span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      size={16}
                      strokeWidth={2}
                    />
                    <span>No-show</span>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
