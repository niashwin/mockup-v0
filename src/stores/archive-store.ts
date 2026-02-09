import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Archive Store
 *
 * Manages state for the Archive page with Radars and Reports tabs:
 * - Tab selection (radars vs reports)
 * - Radar selection and detail view state
 * - Report selection for archived reports
 * - Search filtering
 *
 * Tab preference is persisted to localStorage.
 */

export type ArchiveTab = "radars" | "reports" | "meetings";
export type MeetingDetailTab = "summary" | "transcript" | "attendees";

interface ArchiveState {
  // ─── Tab State ─────────────────────────────────────────────────────────────
  /** Active archive tab */
  activeTab: ArchiveTab;

  // ─── Meeting Selection ─────────────────────────────────────────────────────
  /** Currently selected meeting ID */
  selectedMeetingId: string | null;

  /** Active sub-tab in meeting detail view */
  meetingDetailTab: MeetingDetailTab;

  // ─── Report Selection ──────────────────────────────────────────────────────
  /** Currently selected archived report ID */
  selectedArchivedReportId: string | null;

  // ─── Radar Selection ──────────────────────────────────────────────────────
  /** Currently selected radar ID */
  selectedRadarId: string | null;

  // ─── Filtering ─────────────────────────────────────────────────────────────
  /** Search query */
  searchQuery: string;

  // ─── Actions ───────────────────────────────────────────────────────────────
  // Tab actions
  setActiveTab: (tab: ArchiveTab) => void;

  // Meeting selection actions
  selectMeeting: (id: string | null) => void;
  setMeetingDetailTab: (tab: MeetingDetailTab) => void;

  // Report selection actions
  selectArchivedReport: (id: string | null) => void;

  // Radar selection actions
  selectRadar: (id: string | null) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;

  // Utility
  reset: () => void;
}

const initialState = {
  activeTab: "reports" as ArchiveTab,
  selectedMeetingId: null as string | null,
  meetingDetailTab: "summary" as MeetingDetailTab,
  selectedArchivedReportId: null as string | null,
  selectedRadarId: null as string | null,
  searchQuery: "",
};

export const useArchiveStore = create<ArchiveState>()(
  persist(
    (set) => ({
      ...initialState,

      // ─── Tab Actions ────────────────────────────────────────────────────────
      setActiveTab: (tab) =>
        set({
          activeTab: tab,
          // Clear selections when switching tabs
          selectedMeetingId: null,
          selectedArchivedReportId: null,
          selectedRadarId: null,
        }),

      // ─── Meeting Selection Actions ──────────────────────────────────────────
      selectMeeting: (id) =>
        set({
          selectedMeetingId: id,
          meetingDetailTab: "summary", // Reset to summary tab when selecting new meeting
        }),

      setMeetingDetailTab: (tab) => set({ meetingDetailTab: tab }),

      // ─── Report Selection Actions ───────────────────────────────────────────
      selectArchivedReport: (id) => set({ selectedArchivedReportId: id }),

      // ─── Radar Selection Actions ───────────────────────────────────────────
      selectRadar: (id) => set({ selectedRadarId: id }),

      // ─── Filter Actions ─────────────────────────────────────────────────────
      setSearchQuery: (query) => set({ searchQuery: query }),

      clearFilters: () => set({ searchQuery: "" }),

      // ─── Utility ────────────────────────────────────────────────────────────
      reset: () => set({ ...initialState }),
    }),
    {
      name: "archive-data",
      // Persist tab preference only
      partialize: (state) => ({
        activeTab: state.activeTab,
      }),
    },
  ),
);

// ─────────────────────────────────────────────────────────────────────────────
// Selector Hooks (for optimized re-renders)
// ─────────────────────────────────────────────────────────────────────────────

/** Check if a meeting is selected */
export function useIsMeetingSelected(meetingId: string): boolean {
  return useArchiveStore((state) => state.selectedMeetingId === meetingId);
}

/** Check if a report is selected */
export function useIsArchivedReportSelected(reportId: string): boolean {
  return useArchiveStore(
    (state) => state.selectedArchivedReportId === reportId,
  );
}

/** Check if any filters are active */
export function useHasActiveArchiveFilters(): boolean {
  return useArchiveStore((state) => state.searchQuery !== "");
}
