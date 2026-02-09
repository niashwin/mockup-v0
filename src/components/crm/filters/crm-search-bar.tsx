import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { useCrmStore } from "@stores/crm-store";

/**
 * CRM Search Bar
 *
 * Full-text search across contact names, company, title, email, and AI summaries.
 */

export function CrmSearchBar() {
  const { searchQuery, setSearchQuery } = useCrmStore();

  return (
    <div className="relative">
      <HugeiconsIcon
        icon={Search01Icon}
        size={16}
        strokeWidth={1.5}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search contacts..."
        className={cn(
          "w-72 h-10 pl-10 pr-9 rounded-xl",
          "bg-muted/30 border border-border/50",
          "text-sm placeholder:text-muted-foreground/50",
          "focus:outline-none focus:border-border focus:bg-background",
          "transition-all duration-200",
        )}
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
