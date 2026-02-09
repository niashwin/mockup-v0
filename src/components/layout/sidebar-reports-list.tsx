import { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { cn } from "@lib/utils";
import { springs, staggerContainer, staggerItem } from "@lib/motion";
import { filterBySearch } from "@lib/search-utils";
import { useSettingsStore } from "@stores/settings-store";
import {
  CATEGORY_CONFIG,
  CATEGORY_ORDER,
  type CategoryConfig,
} from "@lib/report-categories";
import type { WeeklyReport, ReportCategory } from "@data/mock-reports";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

interface ReportsListProps {
  reports: WeeklyReport[];
  selectedReportId: string | null;
  onSelectReport: (id: string) => void;
  searchQuery: string;
}

export function ReportsList({
  reports,
  selectedReportId,
  onSelectReport,
  searchQuery,
}: ReportsListProps) {
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
    <div className="space-y-4">
      {categoryGroups.map((group) => {
        return (
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
                className={cn("size-3.5", group.config.color)}
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
                        "font-medium text-[13px] leading-tight truncate transition-colors",
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
        );
      })}

      {categoryGroups.length === 0 && (
        <div className="px-3 py-8 text-center">
          <p className="text-xs text-muted-foreground">No reports found</p>
        </div>
      )}
    </div>
  );
}
