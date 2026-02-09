import { useMemo } from "react";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@lib/motion";
import { filterBySearch } from "@lib/search-utils";
import {
  ArchiveReportItem,
  type ArchivedReportItem,
} from "./archive-report-item";
import type { ArchivedReport } from "./report-card";

interface ArchiveReportsListProps {
  reports: ArchivedReport[];
  selectedReportId: string | null;
  onSelectReport: (id: string) => void;
  searchQuery: string;
}

// Helper to get month name
function getMonthName(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long" });
}

// Helper to get year
function getYear(date: Date): number {
  return date.getFullYear();
}

// Group reports by month/year
interface MonthGroup {
  key: string;
  month: string;
  year: number;
  reports: ArchivedReportItem[];
}

const MONTH_ORDER_REVERSED = [
  "December",
  "November",
  "October",
  "September",
  "August",
  "July",
  "June",
  "May",
  "April",
  "March",
  "February",
  "January",
];

function groupReportsByMonth(reports: ArchivedReportItem[]): MonthGroup[] {
  const groups = new Map<string, MonthGroup>();

  for (const report of reports) {
    const month = getMonthName(report.date);
    const year = getYear(report.date);
    const key = `${year}-${month}`;

    if (!groups.has(key)) {
      groups.set(key, { key, month, year, reports: [] });
    }
    groups.get(key)!.reports.push(report);
  }

  // Sort groups by date (most recent first)
  return Array.from(groups.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return (
      MONTH_ORDER_REVERSED.indexOf(a.month) -
      MONTH_ORDER_REVERSED.indexOf(b.month)
    );
  });
}

/**
 * Archive reports list with month grouping
 * Matches the archive-sidebar aesthetic
 */
export function ArchiveReportsList({
  reports,
  selectedReportId,
  onSelectReport,
  searchQuery,
}: ArchiveReportsListProps) {
  // Filter reports by search query
  const filteredReports = useMemo(
    () =>
      filterBySearch(reports, searchQuery, (report) =>
        [report.title, report.summary].join(" "),
      ),
    [reports, searchQuery],
  );

  // Convert to simplified items
  const reportItems: ArchivedReportItem[] = useMemo(
    () =>
      filteredReports.map((r) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        date: r.date,
        isUnread: r.isUnread,
      })),
    [filteredReports],
  );

  // Group by month
  const groupedReports = useMemo(
    () => groupReportsByMonth(reportItems),
    [reportItems],
  );

  if (reportItems.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-ui text-muted-foreground">
          {searchQuery ? "No reports match your search" : "No reports yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto -mx-1.5 space-y-4 py-2">
      {groupedReports.map((group) => (
        <motion.div
          key={group.key}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Month header */}
          <div className="flex items-center gap-2 px-2 mb-2">
            <span className="font-semibold text-[11px] uppercase tracking-wide text-muted-foreground/60">
              {group.month}
            </span>
            <div className="h-px flex-1 bg-border-subtle/50" />
          </div>

          {/* Reports in this month */}
          <div className="space-y-1">
            {group.reports.map((report) => (
              <motion.div key={report.id} variants={staggerItem}>
                <ArchiveReportItem
                  report={report}
                  isSelected={selectedReportId === report.id}
                  onClick={() => onSelectReport(report.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
