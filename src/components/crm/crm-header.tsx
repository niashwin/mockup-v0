import { PageBreadcrumbHeader } from "@components/layout/page-breadcrumb-header";
import {
  CrmSearchBar,
  CrmTagFilterDropdown,
  CrmRecencyFilter,
  CrmActiveFilters,
} from "./filters";
import { useCrmStore } from "@stores/crm-store";
import { cn } from "@lib/utils";

/**
 * CRM Header
 *
 * Thin orchestrator composing the breadcrumb, search bar,
 * tag filter dropdown, recency filter, active filters row,
 * and card size toggle.
 */

const SIZE_OPTIONS = [
  { value: "sm" as const, label: "S" },
  { value: "md" as const, label: "M" },
  { value: "lg" as const, label: "L" },
];

export function CrmHeader() {
  const { cardSize, setCardSize } = useCrmStore();

  return (
    <header className="shrink-0 bg-background">
      <PageBreadcrumbHeader items={[{ label: "CRM" }]} />

      <div className="px-6 py-4 flex items-center gap-3 border-b border-border/60">
        <CrmSearchBar />
        <CrmTagFilterDropdown />
        <CrmRecencyFilter />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Card size toggle */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-[var(--radius-lg)] bg-muted/50 border border-border/40">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCardSize(opt.value)}
              className={cn(
                "px-2.5 py-1 text-caption font-medium rounded-[var(--radius-md)] transition-all",
                cardSize === opt.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <CrmActiveFilters />
    </header>
  );
}
