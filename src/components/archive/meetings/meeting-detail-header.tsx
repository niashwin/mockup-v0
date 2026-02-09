import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Calendar01Icon,
  Clock01Icon,
  Copy01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import type { Meeting } from "@types/meeting";

interface MeetingDetailHeaderProps {
  meeting: Meeting;
  onBack: () => void;
  onCopyNotes?: () => void;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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

/**
 * Meeting detail header with back button, title, metadata, and actions
 */
export function MeetingDetailHeader({
  meeting,
  onBack,
  onCopyNotes,
}: MeetingDetailHeaderProps) {
  return (
    <header className="px-6 pt-4 pb-6 border-b border-border-subtle">
      {/* Top row: back and actions */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-caption text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.5} />
          <span>All Meetings</span>
        </button>

        <div className="flex items-center gap-2">
          {onCopyNotes && (
            <Button variant="outline" size="sm" onClick={onCopyNotes}>
              <HugeiconsIcon
                icon={Copy01Icon}
                size={14}
                strokeWidth={1.5}
                className="mr-1.5"
              />
              Copy Notes
            </Button>
          )}
          <Badge variant="outline" className="text-caption">
            V17
          </Badge>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-display font-semibold text-foreground mb-3">
        {meeting.title}
      </h1>

      {/* Metadata row */}
      <div className="flex items-center gap-4 text-ui text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Calendar01Icon} size={16} strokeWidth={1.5} />
          <span>{formatDate(meeting.date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.5} />
          <span>{meeting.startTime}</span>
        </div>
        <span className="text-border">·</span>
        <span>{formatDuration(meeting.duration)}</span>
      </div>
    </header>
  );
}
