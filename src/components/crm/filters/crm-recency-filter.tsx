import { useState, useRef, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { useCrmStore } from "@stores/crm-store";
import { RECENCY_OPTIONS } from "@lib/crm-tag-utils";

/**
 * CRM Recency Filter
 *
 * Single-select dropdown for filtering contacts by how recently
 * they were last contacted.
 */

export function CrmRecencyFilter() {
  const { selectedRecencyFilter, setSelectedRecencyFilter } = useCrmStore();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  }, []);

  const handleSelect = (option: string | null) => {
    setSelectedRecencyFilter(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={cn(
          "flex items-center gap-2 h-10 px-3.5 rounded-xl",
          "bg-muted/30 border border-border/50",
          "text-sm transition-all duration-200",
          "hover:bg-muted/50 hover:border-border",
          isOpen && "bg-muted/50 border-border",
          selectedRecencyFilter && "border-accent/40 bg-accent/5",
        )}
      >
        <HugeiconsIcon
          icon={Clock01Icon}
          size={16}
          strokeWidth={1.5}
          className={cn(
            "shrink-0",
            selectedRecencyFilter ? "text-accent" : "text-muted-foreground/50",
          )}
        />
        <span
          className={cn(
            "truncate max-w-[140px]",
            selectedRecencyFilter ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {selectedRecencyFilter ?? "Last contacted"}
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={16}
          strokeWidth={1.5}
          className={cn(
            "shrink-0 text-muted-foreground/60 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 top-full mt-2 z-50",
            "w-52 bg-background border border-border/60 rounded-xl shadow-lg",
            "py-1.5",
          )}
        >
          {/* "All time" option to clear */}
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2.5",
              "text-sm text-left transition-colors duration-150",
              "hover:bg-muted/50",
              !selectedRecencyFilter && "bg-accent/5",
            )}
          >
            <div
              className={cn(
                "size-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                !selectedRecencyFilter ? "border-accent" : "border-border",
              )}
            >
              {!selectedRecencyFilter && (
                <div className="size-1.5 rounded-full bg-accent" />
              )}
            </div>
            <span
              className={cn(
                !selectedRecencyFilter
                  ? "text-foreground font-medium"
                  : "text-muted-foreground",
              )}
            >
              All time
            </span>
          </button>

          <div className="mx-3 my-1 border-t border-border/30" />

          {RECENCY_OPTIONS.map((option) => {
            const isSelected = selectedRecencyFilter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5",
                  "text-sm text-left transition-colors duration-150",
                  "hover:bg-muted/50",
                  isSelected && "bg-accent/5",
                )}
              >
                <div
                  className={cn(
                    "size-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "border-accent" : "border-border",
                  )}
                >
                  {isSelected && (
                    <div className="size-1.5 rounded-full bg-accent" />
                  )}
                </div>
                <span
                  className={cn(
                    isSelected
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
