import { HugeiconsIcon } from "@hugeicons/react";
import {
  Video01Icon,
  Clock01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { cn } from "@lib/utils";
import { springs } from "@lib/motion";
import { Avatar } from "@components/ui/avatar";
import type { Meeting, MeetingPlatform } from "@types/meeting";

interface MeetingCardProps {
  meeting: Meeting;
  isSelected: boolean;
  onClick: () => void;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

function getPlatformLabel(platform: MeetingPlatform): string {
  const labels: Record<MeetingPlatform, string> = {
    zoom: "Zoom",
    meet: "Meet",
    teams: "Teams",
    phone: "Phone",
    "in-person": "In-person",
  };
  return labels[platform];
}

function getPlatformColor(platform: MeetingPlatform): string {
  const colors: Record<MeetingPlatform, string> = {
    zoom: "text-blue-500",
    meet: "text-emerald-500",
    teams: "text-violet-500",
    phone: "text-amber-500",
    "in-person": "text-slate-500",
  };
  return colors[platform];
}

/**
 * Individual meeting card in the archive list
 * Displays title, summary, time, duration, platform, and attendee avatars
 */
export function MeetingCard({
  meeting,
  isSelected,
  onClick,
}: MeetingCardProps) {
  const maxVisibleAttendees = 3;
  const visibleAttendees = meeting.attendees.slice(0, maxVisibleAttendees);
  const overflowCount = meeting.attendees.length - maxVisibleAttendees;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-xl border",
        "transition-colors duration-150",
        isSelected
          ? "bg-accent-muted/50 border-accent/40"
          : "bg-background border-border/50 hover:border-border hover:bg-muted/20",
      )}
      whileHover={{ y: -2 }}
      transition={springs.quick}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Title with recording indicator */}
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-body font-medium text-foreground truncate">
              {meeting.title}
            </h3>
            {meeting.hasRecording && (
              <HugeiconsIcon
                icon={Video01Icon}
                size={16}
                className="text-muted-foreground/60 shrink-0"
                strokeWidth={1.5}
              />
            )}
          </div>

          {/* Summary */}
          <p className="text-ui text-muted-foreground line-clamp-2 mb-3">
            {meeting.summary}
          </p>

          {/* Metadata row */}
          <div className="flex items-center gap-2 text-caption text-muted-foreground">
            <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={1.5} />
            <span>{meeting.startTime}</span>
            <span className="text-border">·</span>
            <span>{formatDuration(meeting.duration)}</span>
            <span className="text-border">·</span>
            <span className={getPlatformColor(meeting.platform)}>
              {getPlatformLabel(meeting.platform)}
            </span>
          </div>
        </div>

        {/* Right side: avatars and chevron */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Attendee avatars */}
          <div className="flex items-center -space-x-2">
            {visibleAttendees.map((attendee) => (
              <Avatar
                key={attendee.id}
                name={attendee.name}
                src={attendee.avatarUrl}
                size="sm"
                className="ring-2 ring-background"
              />
            ))}
            {overflowCount > 0 && (
              <div className="size-6 rounded-full bg-muted flex items-center justify-center ring-2 ring-background">
                <span className="text-micro font-medium text-white">
                  +{overflowCount}
                </span>
              </div>
            )}
          </div>

          {/* Chevron */}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={20}
            className="text-muted-foreground/40"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </motion.button>
  );
}
