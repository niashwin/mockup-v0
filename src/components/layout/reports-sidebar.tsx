import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Search01Icon,
  Setting07Icon,
  File02Icon,
  AlertDiamondIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { useSettingsStore } from "@stores/settings-store";
import { ReportsList } from "./sidebar-reports-list";
import { RadarList } from "./sidebar-radar-list";
import type { WeeklyReport } from "@data/mock-reports";
import type { ViewMode } from "./reports-radar-toggle";

// ─── Section Nav Item ───────────────────────────────────────────────────────

interface SectionNavItemProps {
  icon: IconSvgElement;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function SectionNavItem({
  icon,
  label,
  isActive,
  onClick,
}: SectionNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)]",
        "text-sm font-medium transition-colors",
        isActive
          ? "text-foreground bg-accent-muted"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      )}
    >
      <HugeiconsIcon
        icon={icon}
        size={14}
        strokeWidth={1.5}
        className="shrink-0"
      />
      <span>{label}</span>
    </button>
  );
}

// ─── Unified Sidebar ────────────────────────────────────────────────────────

interface ReportsSidebarProps {
  reports: WeeklyReport[];
  selectedReportId: string | null;
  onSelectReport: (id: string) => void;
  selectedRadarId: string | null;
  onSelectRadarItem: (id: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ReportsSidebar({
  reports,
  selectedReportId,
  onSelectReport,
  selectedRadarId,
  onSelectRadarItem,
  viewMode,
  onViewModeChange,
}: ReportsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const openSettings = useSettingsStore((state) => state.openSettings);

  return (
    <div className="flex flex-col h-full p-3">
      {/* Header */}
      <header className="mb-3 pb-3 border-b border-border-subtle">
        {/* Section Navigation + Settings */}
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex flex-col gap-0.5 flex-1">
            <SectionNavItem
              icon={File02Icon}
              label="Reports"
              isActive={viewMode === "reports"}
              onClick={() => onViewModeChange("reports")}
            />
            <SectionNavItem
              icon={AlertDiamondIcon}
              label="Radar"
              isActive={viewMode === "radar"}
              onClick={() => onViewModeChange("radar")}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 mt-1"
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
            placeholder={
              viewMode === "reports" ? "Search reports..." : "Search alerts..."
            }
            className={cn(
              "w-full h-8 pl-8 pr-3 text-xs rounded-[var(--radius-md)]",
              "bg-muted/50 border-0",
              "placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-1 focus:ring-accent/30 dark:focus:ring-accent/30",
            )}
          />
        </div>
      </header>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto -mx-1.5">
        <AnimatePresence mode="wait">
          {viewMode === "reports" ? (
            <motion.div
              key="reports"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              <ReportsList
                reports={reports}
                selectedReportId={selectedReportId}
                onSelectReport={onSelectReport}
                searchQuery={searchQuery}
              />
            </motion.div>
          ) : (
            <motion.div
              key="radar"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
            >
              <RadarList
                selectedItemId={selectedRadarId}
                onSelectItem={onSelectRadarItem}
                searchQuery={searchQuery}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "size-2 rounded-full",
              viewMode === "reports"
                ? "bg-success animate-pulse-glow"
                : "bg-warning animate-pulse",
            )}
          />
          <span className="text-[11px] text-muted-foreground/50">
            {viewMode === "reports" ? "Auto-generated" : "Monitoring active"}
          </span>
        </div>
      </div>
    </div>
  );
}
