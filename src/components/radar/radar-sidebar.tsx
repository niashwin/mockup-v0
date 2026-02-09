import { useState } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, FilterIcon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { staggerContainer, staggerItem } from "@lib/motion";
import { RadarItemCard } from "./radar-item-card";
import { mockRadarItems } from "@data/mock-radar";
import type { RadarItem, RadarSeverity } from "@types/radar";

interface RadarSidebarProps {
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
}

// Group items by severity
function groupBySeverity(
  items: RadarItem[],
): Record<RadarSeverity, RadarItem[]> {
  return items.reduce(
    (acc, item) => {
      acc[item.severity].push(item);
      return acc;
    },
    {
      critical: [] as RadarItem[],
      high: [] as RadarItem[],
      medium: [] as RadarItem[],
      low: [] as RadarItem[],
    },
  );
}

const severityOrder: RadarSeverity[] = ["critical", "high", "medium", "low"];

export function RadarSidebar({
  selectedItemId,
  onSelectItem,
}: RadarSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter items by search
  const filteredItems = mockRadarItems.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  const groupedItems = groupBySeverity(filteredItems);

  return (
    <aside className="w-[220px] shrink-0 flex flex-col bg-sidebar border-r border-border h-full">
      {/* Header - compact like reports sidebar */}
      <header className="p-3 border-b border-border-subtle">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
            Alerts
          </span>
          <span className="text-[11px] text-muted-foreground/60 tabular-nums">
            {filteredItems.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={1.5} />
          </span>
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search radar alerts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full h-7 pl-8 pr-3 text-xs rounded-[var(--radius-md)]",
              "bg-muted/50 border-0",
              "placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-1 focus:ring-accent",
            )}
          />
        </div>

        {/* Filter Toggle - compact */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-1.5 text-[11px]",
            showFilters
              ? "text-accent font-medium"
              : "text-muted-foreground/70",
            "hover:text-foreground transition-colors",
          )}
        >
          <span
            className={cn("transition-transform", showFilters && "rotate-90")}
          >
            <HugeiconsIcon icon={FilterIcon} size={12} strokeWidth={1.5} />
          </span>
          <span>Filters</span>
        </button>
      </header>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-2 -mx-0.5">
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
                {/* Severity header - matches reports sidebar month headers */}
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
      </div>

      {/* Footer - minimal */}
      <footer className="pt-3 px-3 pb-3 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-warning animate-pulse" />
          <span className="text-[11px] text-muted-foreground/50">
            Monitoring active
          </span>
        </div>
      </footer>
    </aside>
  );
}
