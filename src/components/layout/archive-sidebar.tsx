import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Setting07Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { springs, staggerContainer, staggerItem } from "@lib/motion";
import { filterBySearch } from "@lib/search-utils";
import { Button } from "@components/ui/button";
import { useSettingsStore } from "@stores/settings-store";
import {
  CATEGORY_CONFIG,
  CATEGORY_ORDER,
  type CategoryConfig,
} from "@lib/report-categories";
import type { WeeklyReport, ReportCategory } from "@data/mock-reports";

interface ArchiveSidebarProps {
  reports: WeeklyReport[];
  selectedReportId: string | null;
  onSelectReport: (id: string) => void;
}

interface CategoryGroup {
  key: ReportCategory;
  config: CategoryConfig;
  reports: WeeklyReport[];
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Updated today";
  if (diffDays === 1) return "Updated 1d ago";
  if (diffDays < 7) return `Updated ${diffDays}d ago`;
  if (diffDays < 14) return "Updated 1w ago";
  return `Updated ${Math.floor(diffDays / 7)}w ago`;
}

/**
 * Groups reports by category, keeping only the latest report per unique title.
 * Returns groups in the order defined by CATEGORY_ORDER.
 */
function getLatestByCategory(reports: WeeklyReport[]): CategoryGroup[] {
  const byCategoryAndTitle = new Map<
    ReportCategory,
    Map<string, WeeklyReport[]>
  >();

  for (const report of reports) {
    if (!byCategoryAndTitle.has(report.category)) {
      byCategoryAndTitle.set(report.category, new Map());
    }
    const titleMap = byCategoryAndTitle.get(report.category)!;
    if (!titleMap.has(report.title)) {
      titleMap.set(report.title, []);
    }
    titleMap.get(report.title)!.push(report);
  }

  return CATEGORY_ORDER.filter((cat) => byCategoryAndTitle.has(cat)).map(
    (category) => {
      const titleMap = byCategoryAndTitle.get(category)!;
      const latestReports: WeeklyReport[] = [];

      for (const titleReports of titleMap.values()) {
        const latest = titleReports.reduce((best, current) =>
          current.generatedAt > best.generatedAt ? current : best,
        );
        latestReports.push(latest);
      }

      latestReports.sort(
        (a, b) => b.generatedAt.getTime() - a.generatedAt.getTime(),
      );

      return {
        key: category,
        config: CATEGORY_CONFIG[category],
        reports: latestReports,
      };
    },
  );
}

export function ArchiveSidebar({
  reports,
  selectedReportId,
  onSelectReport,
}: ArchiveSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const openSettings = useSettingsStore((state) => state.openSettings);
  const closeSettings = useSettingsStore((state) => state.closeSettings);

  const filteredReports = useMemo(
    () => filterBySearch(reports, searchQuery, (report) => report.title),
    [reports, searchQuery],
  );

  const categoryGroups = useMemo(
    () => getLatestByCategory(filteredReports),
    [filteredReports],
  );

  return (
    <div className="flex flex-col h-full p-3">
      {/* Header */}
      <header className="mb-3 pb-3 border-b border-border-subtle">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
            Reports
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={openSettings}
          >
            <HugeiconsIcon icon={Setting07Icon} size={14} strokeWidth={1.5} />
          </Button>
        </div>

        {/* Search input */}
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            size={14}
            strokeWidth={1.5}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className={cn(
              "w-full h-8 pl-8 pr-3 text-xs rounded-[var(--radius-md)]",
              "bg-muted/50 border-0",
              "placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-1 focus:ring-accent/30 dark:focus:ring-accent/30",
            )}
          />
        </div>
      </header>

      {/* Report List - grouped by category */}
      <div className="flex-1 overflow-y-auto -mx-1.5 space-y-4">
        {categoryGroups.map((group) => (
          <motion.div
            key={group.key}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Category header */}
            <div className="flex items-center gap-2 px-2 mb-2">
              <HugeiconsIcon
                icon={group.config.icon}
                size={14}
                strokeWidth={1.5}
                className={group.config.color}
              />
              <span className="font-semibold text-[11px] uppercase tracking-wide text-muted-foreground/60">
                {group.config.label}
              </span>
              <div className="h-px flex-1 bg-border-subtle/50" />
            </div>

            {/* Reports in this category */}
            <div className="space-y-1">
              {group.reports.map((report) => {
                const isSelected = selectedReportId === report.id;
                return (
                  <motion.button
                    key={report.id}
                    variants={staggerItem}
                    onClick={() => {
                      onSelectReport(report.id);
                      closeSettings();
                    }}
                    className={cn(
                      "group w-full text-left px-3 py-2.5 rounded-[var(--radius-md)]",
                      "transition-colors duration-150 cursor-pointer",
                      isSelected ? "bg-accent-muted" : "hover:bg-muted/70",
                    )}
                    whileHover={{ x: 1 }}
                    transition={springs.quick}
                  >
                    <h3
                      className={cn(
                        "font-medium text-[13px] leading-tight transition-colors",
                        isSelected
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {report.title}
                    </h3>
                    <span className="text-[11px] text-muted-foreground/50 mt-1 block">
                      {formatRelativeDate(report.generatedAt)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Empty state */}
        {categoryGroups.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-xs text-muted-foreground">No reports found</p>
          </div>
        )}
      </div>

      {/* Footer - minimal */}
      <div className="pt-3 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-success animate-pulse-glow" />
          <span className="text-[11px] text-muted-foreground/50">
            Auto-generated
          </span>
        </div>
      </div>
    </div>
  );
}
