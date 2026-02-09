import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Meetings Store
 *
 * Manages state for the Meetings page:
 * - Selected meeting for detail view
 * - Detail mode (brief for upcoming, recap for past)
 * - Search filtering
 *
 * Only view preferences are persisted to localStorage.
 */

export type MeetingDetailMode = "brief" | "recap";

interface MeetingsState {
  // ─── Selection ────────────────────────────────────────────────────────────
  /** Currently selected meeting ID */
  selectedMeetingId: string | null;

  /** Detail view mode (brief for upcoming, recap for past) */
  detailMode: MeetingDetailMode | null;

  // ─── Filtering ────────────────────────────────────────────────────────────
  /** Search query */
  searchQuery: string;

  // ─── Actions ──────────────────────────────────────────────────────────────
  selectMeeting: (id: string | null, mode?: MeetingDetailMode) => void;
  clearSelection: () => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

const initialState = {
  selectedMeetingId: null as string | null,
  detailMode: null as MeetingDetailMode | null,
  searchQuery: "",
};

export const useMeetingsStore = create<MeetingsState>()(
  persist(
    (set) => ({
      ...initialState,

      // ─── Selection Actions ────────────────────────────────────────────────
      selectMeeting: (id, mode) =>
        set({
          selectedMeetingId: id,
          detailMode: mode ?? null,
        }),

      clearSelection: () =>
        set({
          selectedMeetingId: null,
          detailMode: null,
        }),

      // ─── Filter Actions ───────────────────────────────────────────────────
      setSearchQuery: (query) => set({ searchQuery: query }),

      // ─── Utility ──────────────────────────────────────────────────────────
      reset: () => set({ ...initialState }),
    }),
    {
      name: "meetings-data",
      // Only persist view preferences, not selections
      partialize: () => ({}),
    },
  ),
);

// ─────────────────────────────────────────────────────────────────────────────
// Selector Hooks (for optimized re-renders)
// ─────────────────────────────────────────────────────────────────────────────

/** Check if a meeting is selected */
export function useIsMeetingSelected(meetingId: string): boolean {
  return useMeetingsStore((state) => state.selectedMeetingId === meetingId);
}

/** Check if detail view is open */
export function useIsDetailViewOpen(): boolean {
  return useMeetingsStore((state) => state.selectedMeetingId !== null);
}

/** Get the current detail mode */
export function useDetailMode(): MeetingDetailMode | null {
  return useMeetingsStore((state) => state.detailMode);
}
