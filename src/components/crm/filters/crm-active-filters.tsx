import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { useCrmStore, useHasActiveFilters } from "@stores/crm-store";
import { Badge } from "@components/ui/badge";

/**
 * CRM Active Filters
 *
 * Displays currently active filter badges with one-click removal.
 * Shows selected tags and recency filter.
 */

export function CrmActiveFilters() {
  const {
    selectedTags,
    selectedRecencyFilter,
    toggleTag,
    setSelectedRecencyFilter,
    clearFilters,
  } = useCrmStore();

  const hasFilters = useHasActiveFilters();
  const hasVisibleBadges =
    selectedTags.length > 0 || selectedRecencyFilter !== null;

  if (!hasVisibleBadges) return null;

  return (
    <div className="px-8 py-3 flex items-center gap-2 flex-wrap border-b border-border/30 bg-muted/10">
      <span className="text-xs text-muted-foreground/60 mr-1">
        Filtering by:
      </span>

      {selectedTags.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className="cursor-pointer group text-xs px-2.5 py-1 rounded-[var(--radius-lg)] border-border/60 hover:border-border transition-colors capitalize"
          onClick={() => toggleTag(tag)}
        >
          {tag}
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={12}
            strokeWidth={1.5}
            className="ml-1.5 opacity-40 group-hover:opacity-100 transition-opacity"
          />
        </Badge>
      ))}

      {selectedRecencyFilter && (
        <Badge
          variant="outline"
          className="cursor-pointer group text-xs px-2.5 py-1 rounded-[var(--radius-lg)] border-border/60 hover:border-border transition-colors"
          onClick={() => setSelectedRecencyFilter(null)}
        >
          {selectedRecencyFilter}
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={12}
            strokeWidth={1.5}
            className="ml-1.5 opacity-40 group-hover:opacity-100 transition-opacity"
          />
        </Badge>
      )}

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors ml-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
