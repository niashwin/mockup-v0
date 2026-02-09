import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Tick01Icon,
  Search01Icon,
  PinIcon,
  PlusSignIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { useCrmStore } from "@stores/crm-store";
import type { CrmTagMeta } from "@types/contact";

/**
 * CRM Tag Filter Dropdown
 *
 * Unified dropdown with checkboxes for filtering by both auto-derived
 * tags (company, category, relationship) and custom user tags.
 * Includes in-dropdown search and pin-to-top support.
 */

export function CrmTagFilterDropdown() {
  const {
    selectedTags,
    toggleTag,
    getAllUniqueTags,
    pinnedTagGroups,
    togglePinTagGroup,
    addGlobalTag,
    removeGlobalTag,
    customGlobalTags,
  } = useCrmStore();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTagValue, setNewTagValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const addTagRef = useRef<HTMLInputElement>(null);

  const allTags = useMemo(() => getAllUniqueTags(), [getAllUniqueTags]);

  const filteredTags = useMemo(() => {
    if (!searchQuery) return allTags;
    const query = searchQuery.toLowerCase();
    return allTags.filter((tag) => tag.label.toLowerCase().includes(query));
  }, [allTags, searchQuery, isOpen]);

  const roleTags = filteredTags.filter((t) => t.type === "role");
  const companyTags = filteredTags.filter((t) => t.type === "company");
  const customTags = filteredTags.filter((t) => t.type === "custom");

  const handleAddTag = useCallback(() => {
    const trimmed = newTagValue.trim();
    if (!trimmed) return;
    addGlobalTag(trimmed);
    setNewTagValue("");
    requestAnimationFrame(() => addTagRef.current?.focus());
  }, [newTagValue, addGlobalTag]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    }
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [isOpen]);

  const getLabel = () => {
    if (selectedTags.length === 0) return "Tags";
    if (selectedTags.length === 1) return selectedTags[0];
    return `${selectedTags.length} tags`;
  };

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          "flex items-center gap-2 h-10 px-3.5 rounded-xl",
          "bg-muted/30 border border-border/50",
          "text-sm transition-all duration-200",
          "hover:bg-muted/50 hover:border-border",
          isOpen && "bg-muted/50 border-border",
          selectedTags.length > 0 && "border-accent/40 bg-accent/5",
        )}
      >
        <span
          className={cn(
            "truncate max-w-[160px] capitalize",
            selectedTags.length > 0
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          {getLabel()}
        </span>
        {selectedTags.length > 0 && (
          <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-medium bg-accent/20 text-accent rounded-[var(--radius-md)]">
            {selectedTags.length}
          </span>
        )}
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
            "w-72 bg-background border border-border/60 rounded-xl shadow-lg",
            "flex flex-col max-h-[400px]",
          )}
        >
          {/* Search within dropdown */}
          <div className="p-2 border-b border-border/40">
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={14}
                strokeWidth={1.5}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40"
              />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tags..."
                className={cn(
                  "w-full h-8 pl-8 pr-3 rounded-[var(--radius-lg)]",
                  "bg-muted/30 border-none",
                  "text-xs placeholder:text-muted-foreground/40",
                  "focus:outline-none",
                )}
              />
            </div>
          </div>

          {/* Scrollable tag list */}
          <div className="overflow-y-auto flex-1 py-1">
            {roleTags.length > 0 && (
              <TagSection
                label="Role"
                tags={roleTags}
                selectedTags={selectedTags}
                pinnedTagGroups={pinnedTagGroups}
                onToggleTag={toggleTag}
                onTogglePin={togglePinTagGroup}
              />
            )}
            {companyTags.length > 0 && (
              <TagSection
                label="Company"
                tags={companyTags}
                selectedTags={selectedTags}
                pinnedTagGroups={pinnedTagGroups}
                onToggleTag={toggleTag}
                onTogglePin={togglePinTagGroup}
              />
            )}
            {customTags.length > 0 && (
              <TagSection
                label="Custom"
                tags={customTags}
                selectedTags={selectedTags}
                pinnedTagGroups={pinnedTagGroups}
                onToggleTag={toggleTag}
                onTogglePin={togglePinTagGroup}
                onRemoveTag={removeGlobalTag}
              />
            )}
            {filteredTags.length === 0 && (
              <p className="px-3 py-4 text-xs text-muted-foreground/50 text-center">
                No tags match &quot;{searchQuery}&quot;
              </p>
            )}
          </div>

          {/* Add tag input */}
          <div className="border-t border-border/40 p-2">
            <div className="relative">
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={12}
                strokeWidth={1.5}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40"
              />
              <input
                ref={addTagRef}
                type="text"
                value={newTagValue}
                onChange={(e) => setNewTagValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                  // Don't propagate Escape to the parent — let it close dropdown
                }}
                placeholder="Create new tag..."
                className={cn(
                  "w-full h-7 pl-7 pr-3 rounded-lg",
                  "bg-muted/20 border border-dashed border-border/40",
                  "text-xs placeholder:text-muted-foreground/35",
                  "focus:outline-none focus:border-border/60 focus:bg-muted/30",
                  "transition-colors duration-200",
                )}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function TagSection({
  label,
  tags,
  selectedTags,
  pinnedTagGroups,
  onToggleTag,
  onTogglePin,
  onRemoveTag,
}: {
  label: string;
  tags: CrmTagMeta[];
  selectedTags: string[];
  pinnedTagGroups: string[];
  onToggleTag: (tag: string) => void;
  onTogglePin: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
}) {
  return (
    <div>
      <div className="px-3 pt-2.5 pb-1">
        <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">
          {label}
        </span>
      </div>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.label);
        const isPinned = pinnedTagGroups.includes(tag.label);
        return (
          <div
            key={tag.label}
            className={cn(
              "flex items-center gap-2 px-3 py-2",
              "text-sm transition-colors duration-150",
              "hover:bg-muted/50 group",
              isSelected && "bg-accent/5",
            )}
          >
            {/* Checkbox */}
            <button
              type="button"
              onClick={() => onToggleTag(tag.label)}
              className={cn(
                "size-4 rounded border flex items-center justify-center shrink-0 transition-colors duration-150",
                isSelected
                  ? "bg-accent border-accent"
                  : "border-border bg-transparent",
              )}
            >
              {isSelected && (
                <HugeiconsIcon
                  icon={Tick01Icon}
                  size={12}
                  strokeWidth={2.5}
                  className="text-white"
                />
              )}
            </button>

            {/* Label + count */}
            <button
              type="button"
              onClick={() => onToggleTag(tag.label)}
              className="flex-1 flex items-center gap-2 text-left min-w-0"
            >
              <span
                className={cn(
                  "truncate capitalize",
                  isSelected
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {tag.label}
              </span>
              <span className="text-[10px] text-muted-foreground/40 tabular-nums shrink-0">
                {tag.count}
              </span>
            </button>

            {/* Remove button (custom tags only) */}
            {onRemoveTag && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTag(tag.label);
                }}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground/30 hover:text-red-400 transition-all duration-200"
                title="Remove custom tag"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={12}
                  strokeWidth={1.5}
                />
              </button>
            )}

            {/* Pin button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(tag.label);
              }}
              className={cn(
                "shrink-0 transition-all duration-200",
                isPinned
                  ? "text-amber-500"
                  : "opacity-0 group-hover:opacity-100 text-muted-foreground/30 hover:text-amber-500",
              )}
              title={isPinned ? "Unpin group" : "Pin group to top"}
            >
              <HugeiconsIcon icon={PinIcon} size={12} strokeWidth={1.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
