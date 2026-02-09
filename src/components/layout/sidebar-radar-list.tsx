import { useMemo } from "react";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@lib/motion";
import { filterBySearch } from "@lib/search-utils";
import { RadarItemCard } from "@components/radar/radar-item-card";
import { mockRadarItems } from "@data/mock-radar";
import type { RadarItem, RadarSeverity } from "@types/radar";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function groupBySeverity(
  items: RadarItem[],
): Record<RadarSeverity, RadarItem[]> {
  return items.reduce(
    (acc, item) => ({
      ...acc,
      [item.severity]: [...acc[item.severity], item],
    }),
    {
      critical: [] as RadarItem[],
      high: [] as RadarItem[],
      medium: [] as RadarItem[],
      low: [] as RadarItem[],
    },
  );
}

const severityOrder: RadarSeverity[] = ["critical", "high", "medium", "low"];

// ─── Component ───────────────────────────────────────────────────────────────

interface RadarListProps {
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  searchQuery: string;
}

export function RadarList({
  selectedItemId,
  onSelectItem,
  searchQuery,
}: RadarListProps) {
  const filteredItems = useMemo(
    () =>
      filterBySearch(mockRadarItems, searchQuery, (item) =>
        [item.title, item.category].join(" "),
      ),
    [searchQuery],
  );

  const groupedItems = useMemo(
    () => groupBySeverity(filteredItems),
    [filteredItems],
  );

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {severityOrder.map((severity) => {
        const items = groupedItems[severity];
        if (items.length === 0) return null;

        return (
          <motion.div key={severity} variants={staggerItem}>
            {/* Severity header */}
            <div className="flex items-center gap-2 px-2 mb-1.5">
              <span className="font-semibold text-[10px] uppercase tracking-wide text-muted-foreground/60">
                {severity}
              </span>
              <div className="h-px flex-1 bg-border-subtle/50" />
              <span className="text-[10px] text-muted-foreground/50 tabular-nums">
                {items.length}
              </span>
            </div>
            <div className="space-y-0.5">
              {items.map((item) => (
                <RadarItemCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItemId === item.id}
                  onClick={() => onSelectItem(item.id)}
                />
              ))}
            </div>
          </motion.div>
        );
      })}

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-[11px] text-muted-foreground/60">
          No alerts found
        </div>
      )}
    </motion.div>
  );
}
