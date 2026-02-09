import { useMemo } from "react";
import { ArchiveHeader } from "./archive-header";
import { ArchiveReportsList, type ArchivedReport } from "./reports";
import { RadarsList } from "./radars";
import { MeetingsList } from "./meetings/meetings-list";
import { MeetingDetailPane } from "./meetings/meeting-detail-pane";
import { useArchiveStore } from "@stores/archive-store";
import { mockReports } from "@data/mock-reports";
import { mockRadarItems } from "@data/mock-radar";
import { mockContacts } from "@data/contacts";
import { generateAllContactMeetings } from "@data/contacts/contact-meetings-generator";
import { ReadingPane } from "@components/report/reading-pane";
import { RadarReadingPane } from "@components/radar/radar-reading-pane";
import type { Meeting } from "@types/meeting";

/**
 * Determine archive report type from a WeeklyReport
 */
function getReportType(
  report: (typeof mockReports)[number],
): ArchivedReport["type"] {
  if (report.reportType === "leadership-digest") return "weekly";
  if (report.title.toLowerCase().includes("daily")) return "daily";
  return "standard";
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Generate historical entries for each unique report title.
 * Creates ~6 older weekly versions going back from the earliest
 * existing instance of that title, so the archive has a rich history.
 */
function generateHistoricalReports(): ArchivedReport[] {
  // Find the latest report per title to use as the template
  const latestByTitle = new Map<
    string,
    { type: ArchivedReport["type"]; earliestDate: Date }
  >();

  for (const report of mockReports) {
    const existing = latestByTitle.get(report.title);
    const reportType = getReportType(report);

    if (!existing || report.generatedAt < existing.earliestDate) {
      latestByTitle.set(report.title, {
        type: reportType,
        earliestDate: existing
          ? existing.earliestDate < report.generatedAt
            ? existing.earliestDate
            : report.generatedAt
          : report.generatedAt,
      });
    }
  }

  const historical: ArchivedReport[] = [];

  for (const [title, info] of latestByTitle.entries()) {
    // Generate 6 older versions, each 1 week before the earliest existing
    for (let i = 1; i <= 6; i++) {
      const date = new Date(info.earliestDate.getTime() - i * WEEK_MS);
      historical.push({
        id: `hist-${title.toLowerCase().replace(/\s+/g, "-")}-${i}`,
        title,
        summary: `Archived ${title} from week of ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}...`,
        type: info.type,
        date,
        isUnread: false,
      });
    }
  }

  return historical;
}

/**
 * Transform existing reports + generated history into archived reports format
 */
function getArchivedReports(): ArchivedReport[] {
  const reports: ArchivedReport[] = [];

  for (const report of mockReports) {
    reports.push({
      id: report.id,
      title: report.title,
      summary: report.content.slice(0, 150).replace(/[#*]/g, "").trim() + "...",
      type: getReportType(report),
      date: report.generatedAt,
      isUnread: report.id === mockReports[0]?.id,
    });
  }

  // Add historical entries so "View History" shows a rich timeline
  const historical = generateHistoricalReports();
  reports.push(...historical);

  // Sort all reports by date (most recent first)
  reports.sort((a, b) => b.date.getTime() - a.date.getTime());

  return reports;
}

/**
 * Generate all contact meetings once (memoized at module level to avoid
 * re-generating on each render since the source data is static).
 */
const allContactMeetings: Meeting[] = generateAllContactMeetings(mockContacts);

/**
 * Main Archive page component
 * Displays radars, reports, and meetings in a tabbed interface with detail views
 */
export function ArchivePage() {
  const {
    activeTab,
    setActiveTab,
    selectedArchivedReportId,
    selectArchivedReport,
    selectedRadarId,
    selectRadar,
    selectedMeetingId,
    selectMeeting,
    searchQuery,
    setSearchQuery,
    contactFilter,
    setContactFilter,
  } = useArchiveStore();

  // Get archived reports (without radar items)
  const archivedReports = useMemo(() => getArchivedReports(), []);

  // Find selected report
  const selectedReport = useMemo(() => {
    if (!selectedArchivedReportId) return null;
    return mockReports.find((r) => r.id === selectedArchivedReportId) ?? null;
  }, [selectedArchivedReportId]);

  // Find selected radar
  const selectedRadar = useMemo(() => {
    if (!selectedRadarId) return null;
    return mockRadarItems.find((r) => r.id === selectedRadarId) ?? null;
  }, [selectedRadarId]);

  // Filter meetings by contact when navigating from CRM
  const displayedMeetings = useMemo(() => {
    if (!contactFilter) return allContactMeetings;
    return allContactMeetings.filter((m) =>
      m.linkedContactIds?.includes(contactFilter.contactId),
    );
  }, [contactFilter]);

  // Find selected meeting
  const selectedMeeting = useMemo(() => {
    if (!selectedMeetingId) return null;
    return allContactMeetings.find((m) => m.id === selectedMeetingId) ?? null;
  }, [selectedMeetingId]);

  // Handle report selection
  const handleSelectReport = (id: string) => {
    selectArchivedReport(id);
  };

  // Handle radar selection
  const handleSelectRadar = (id: string) => {
    selectRadar(id);
  };

  // Handle meeting selection
  const handleSelectMeeting = (id: string) => {
    selectMeeting(id);
  };

  // Render list view (radars, reports, or meetings)
  const renderList = () => {
    if (activeTab === "radars") {
      return (
        <div className="flex-1 overflow-hidden flex flex-col p-3">
          <RadarsList
            radars={mockRadarItems}
            selectedRadarId={selectedRadarId}
            onSelectRadar={handleSelectRadar}
            searchQuery={searchQuery}
          />
        </div>
      );
    }

    if (activeTab === "meetings") {
      return (
        <div className="flex-1 overflow-hidden flex flex-col">
          {contactFilter && (
            <div className="px-6 py-2.5 border-b border-border-subtle flex items-center gap-2">
              <span className="text-caption text-muted-foreground">
                Meetings with
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-caption font-medium">
                {contactFilter.contactName}
                <button
                  type="button"
                  onClick={() => setContactFilter(null)}
                  className="ml-0.5 hover:text-accent/70 transition-colors"
                  aria-label="Clear contact filter"
                >
                  <svg
                    className="size-3"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M3 3l6 6M9 3l-6 6" />
                  </svg>
                </button>
              </span>
            </div>
          )}
          <MeetingsList
            meetings={displayedMeetings}
            selectedMeetingId={selectedMeetingId}
            onSelectMeeting={handleSelectMeeting}
            searchQuery={searchQuery}
          />
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-hidden flex flex-col p-3">
        <ArchiveReportsList
          reports={archivedReports}
          selectedReportId={selectedArchivedReportId}
          onSelectReport={handleSelectReport}
          searchQuery={searchQuery}
        />
      </div>
    );
  };

  // Render detail view
  const renderDetail = () => {
    if (activeTab === "radars") {
      if (!selectedRadar) {
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-px bg-border mx-auto mb-6" />
              <p className="text-heading font-medium text-muted-foreground">
                Select a radar alert to view
              </p>
              <div className="w-24 h-px bg-border mx-auto mt-6" />
            </div>
          </div>
        );
      }
      return <RadarReadingPane item={selectedRadar} />;
    }

    if (activeTab === "meetings") {
      return <MeetingDetailPane meeting={selectedMeeting} />;
    }

    // Reports tab detail
    if (!selectedReport) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-px bg-border mx-auto mb-6" />
            <p className="text-heading font-medium text-muted-foreground">
              Select a report to view
            </p>
            <div className="w-24 h-px bg-border mx-auto mt-6" />
          </div>
        </div>
      );
    }

    return <ReadingPane report={selectedReport} />;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header with search and tabs */}
      <ArchiveHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        radarsCount={mockRadarItems.length}
        reportsCount={archivedReports.length}
        meetingsCount={displayedMeetings.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main content area */}
      <div className="flex-1 overflow-hidden flex border-t border-border-subtle">
        {/* Left panel: List */}
        <div className="w-[400px] border-r border-border flex flex-col overflow-hidden">
          {renderList()}
        </div>

        {/* Right panel: Detail */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {renderDetail()}
        </div>
      </div>
    </div>
  );
}
