import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  File01Icon,
  Message01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { cn } from "@lib/utils";
import { springs } from "@lib/motion";
import type { MeetingDetailTab } from "@stores/archive-store";

interface TabConfig {
  id: MeetingDetailTab;
  icon: IconSvgElement;
  label: string;
}

interface MeetingDetailTabsProps {
  activeTab: MeetingDetailTab;
  onTabChange: (tab: MeetingDetailTab) => void;
  attendeesCount: number;
  className?: string;
}

/**
 * Compact sub-tabs for meeting detail view
 * Summary, Transcript, Attendees
 */
export function MeetingDetailTabs({
  activeTab,
  onTabChange,
  attendeesCount,
  className,
}: MeetingDetailTabsProps) {
  const tabs: TabConfig[] = [
    { id: "summary", icon: File01Icon, label: "Summary" },
    { id: "transcript", icon: Message01Icon, label: "Transcript" },
    { id: "attendees", icon: UserGroupIcon, label: `Attendees` },
  ];

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 border-b border-border-subtle",
        className,
      )}
    >
      {tabs.map(({ id, icon, label }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={cn(
              "relative flex items-center gap-1 px-3 py-2",
              "text-[11px] font-medium transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/70",
            )}
          >
            <HugeiconsIcon icon={icon} size={12} strokeWidth={1.5} />
            <span>{label}</span>
            {id === "attendees" && (
              <span className="text-[10px] text-muted-foreground/60 tabular-nums ml-0.5">
                {attendeesCount}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="meeting-detail-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                transition={springs.quick}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
