import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  Link01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { formatDateRange } from "@lib/utils";
import { staggerItem } from "@lib/motion";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { useReviewActionsStore } from "@components/review-actions";
import type { WeeklyReport } from "@data/mock-reports";

interface ReportHeaderProps {
  report: WeeklyReport;
  onViewHistory?: () => void;
}

export function ReportHeader({ report, onViewHistory }: ReportHeaderProps) {
  const { openModal } = useReviewActionsStore();
  const actions = report.actions ?? [];
  const actionCount = actions.filter((a) => a.status === "pending").length;

  const handleReviewClick = () => {
    openModal(actions);
  };
  return (
    <motion.header variants={staggerItem} className="mb-16">
      {/* Week indicator */}
      <div className="flex items-center gap-4 mb-8">
        <span className="font-semibold text-caption uppercase tracking-wider text-accent">
          Week {report.weekNumber}
        </span>
        <div className="h-px flex-1 bg-border-subtle" />
        <span className="text-caption text-muted-foreground">
          {formatDateRange(report.dateRange.start, report.dateRange.end)}
        </span>
      </div>

      {/* Title */}
      <h1 className="font-bold text-display tracking-tight text-foreground leading-[1.1]">
        {report.title}
      </h1>

      {/* Actions row */}
      <div className="flex items-center gap-3 mt-10 pt-8 border-t border-border-subtle">
        <div className="flex-1" />
        {onViewHistory && (
          <Button
            variant="ghost"
            size="default"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={onViewHistory}
          >
            <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={1.5} />
            View History
          </Button>
        )}
        <Button variant="ghost" size="icon" className="size-8">
          <HugeiconsIcon icon={Link01Icon} size={16} strokeWidth={1.5} />
        </Button>
        <Button
          variant="outline"
          size="default"
          className="gap-1.5"
          onClick={handleReviewClick}
        >
          <HugeiconsIcon icon={SparklesIcon} size={14} strokeWidth={1.5} />
          Review
          {actionCount > 0 && (
            <Badge variant="count" className="ml-1">
              {actionCount}
            </Badge>
          )}
        </Button>
      </div>
    </motion.header>
  );
}
