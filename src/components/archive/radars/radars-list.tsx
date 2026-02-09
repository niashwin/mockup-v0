import { useMemo } from "react";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@lib/motion";
import { filterBySearch } from "@lib/search-utils";
import { RadarCard } from "./radar-card";
import type { RadarItem, RadarSeverity } from "@types/radar";

interface RadarsListProps {
  radars: RadarItem[];
  selectedRadarId: string | null;
  onSelectRadar: (id: string) => void;
  searchQuery: string;
}

const SEVERITY_ORDER: RadarSeverity[] = ["critical", "high", "medium", "low"];

const SEVERITY_LABELS: Record<RadarSeverity, string> = {
  critical: "Critical",
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

interface SeverityGroup {
  severity: RadarSeverity;
  label: string;
  radars: RadarItem[];
}

function groupRadarsBySeverity(radars: RadarItem[]): SeverityGroup[] {
  const groups = new Map<RadarSeverity, RadarItem[]>();

  // Initialize groups
  for (const severity of SEVERITY_ORDER) {
    groups.set(severity, []);
  }

  // Group radars
  for (const radar of radars) {
    const group = groups.get(radar.severity);
    if (group) {
      group.push(radar);
    }
  }

  // Convert to array, filter empty groups, sort by date within each group
  return SEVERITY_ORDER.map((severity) => ({
    severity,
    label: SEVERITY_LABELS[severity],
    radars: (groups.get(severity) ?? []).sort(
      (a, b) => b.detectedAt.getTime() - a.detectedAt.getTime(),
    ),
  })).filter((group) => group.radars.length > 0);
}

/**
 * Radars list for the archive page
 * Groups radars by severity with styled headers
 */
export function RadarsList({
  radars,
  selectedRadarId,
  onSelectRadar,
  searchQuery,
}: RadarsListProps) {
  // Filter radars by search query
  const filteredRadars = useMemo(
    () =>
      filterBySearch(radars, searchQuery, (radar) =>
        [radar.title, radar.description, radar.category].join(" "),
      ),
    [radars, searchQuery],
  );

  // Group by severity
  const groupedRadars = useMemo(
    () => groupRadarsBySeverity(filteredRadars),
    [filteredRadars],
  );

  if (filteredRadars.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-ui text-muted-foreground">
          {searchQuery ? "No radars match your search" : "No radar alerts"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto -mx-1.5 space-y-4 py-2">
      {groupedRadars.map((group) => (
        <motion.div
          key={group.severity}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Severity header */}
          <div className="flex items-center gap-2 px-2 mb-2">
            <span className="font-semibold text-[11px] uppercase tracking-wide text-muted-foreground/60">
              {group.label}
            </span>
            <div className="h-px flex-1 bg-border-subtle/50" />
          </div>

          {/* Radars in this severity */}
          <div className="space-y-1">
            {group.radars.map((radar) => (
              <motion.div key={radar.id} variants={staggerItem}>
                <RadarCard
                  radar={radar}
                  isSelected={selectedRadarId === radar.id}
                  onClick={() => onSelectRadar(radar.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
