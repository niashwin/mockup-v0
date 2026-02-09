import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ViewMode } from "@components/layout/reports-radar-toggle";

interface ReportsState {
  // View toggle
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Selected items
  selectedReportId: string | null;
  selectedRadarId: string | null;
  setSelectedReportId: (id: string | null) => void;
  setSelectedRadarId: (id: string | null) => void;
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set) => ({
      viewMode: "reports",
      setViewMode: (mode) => set({ viewMode: mode }),

      selectedReportId: null,
      selectedRadarId: null,
      setSelectedReportId: (id) => set({ selectedReportId: id }),
      setSelectedRadarId: (id) => set({ selectedRadarId: id }),
    }),
    {
      name: "reports-view-storage",
      partialize: (state) => ({
        viewMode: state.viewMode,
      }),
    },
  ),
);
