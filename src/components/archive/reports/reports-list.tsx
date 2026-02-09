import { useMemo } from "react";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@lib/motion";
import { filterBySearch } from "@lib/search-utils";
import { ReportCard, type ArchivedReport } from "./report-card";

interface ReportsListProps {
  reports: ArchivedReport[];
  selectedReportId: string | null;
  onSelectReport: (id: string) => void;
  searchQuery: string;
}

/**
 * Reports list for archived reports
 * Displays all reports without date grouping (reports have their own date badges)
 */
export function ReportsList({
  reports,
  selectedReportId,
  onSelectReport,
  searchQuery,
}: ReportsListProps) {
  // Filter reports by search query
  const filteredReports = useMemo(
    () =>
      filterBySearch(reports, searchQuery, (report) =>
        [report.title, report.summary].join(" "),
      ),
    [reports, searchQuery],
  );

  // Sort by date descending
  const sortedReports = useMemo(
    () =>
      [...filteredReports].sort((a, b) => b.date.getTime() - a.date.getTime()),
    [filteredReports],
  );

  if (sortedReports.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-ui text-muted-foreground">
          {searchQuery ? "No reports match your search" : "No reports yet"}
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
      <div className="px-6 pb-6 space-y-3">
        {sortedReports.map((report) => (
          <motion.div key={report.id} variants={staggerItem}>
            <ReportCard
              report={report}
              isSelected={selectedReportId === report.id}
              onClick={() => onSelectReport(report.id)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
