import { HugeiconsIcon } from "@hugeicons/react";
import {
  Video01Icon,
  PlayIcon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@components/ui/button";

interface MeetingRecordingBannerProps {
  recordingUrl?: string;
  onWatch?: () => void;
  onDownload?: () => void;
}

/**
 * Banner showing recording availability with Watch and Download actions
 */
export function MeetingRecordingBanner({
  recordingUrl,
  onWatch,
  onDownload,
}: MeetingRecordingBannerProps) {
  const handleWatch = () => {
    if (onWatch) {
      onWatch();
    } else if (recordingUrl) {
      window.open(recordingUrl, "_blank");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-[var(--radius-lg)] bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
          <HugeiconsIcon
            icon={Video01Icon}
            size={20}
            className="text-amber-600 dark:text-amber-400"
            strokeWidth={1.5}
          />
        </div>
        <div>
          <p className="text-ui font-medium text-foreground">
            Recording Available
          </p>
          <p className="text-caption text-muted-foreground">
            Video and transcript synced
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleWatch}>
          <HugeiconsIcon
            icon={PlayIcon}
            size={14}
            strokeWidth={1.5}
            className="mr-1.5"
          />
          Watch
        </Button>
        <button
          type="button"
          onClick={onDownload}
          className="size-8 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
        >
          <HugeiconsIcon
            icon={Download01Icon}
            size={16}
            className="text-muted-foreground"
            strokeWidth={1.5}
          />
        </button>
      </div>
    </div>
  );
}
