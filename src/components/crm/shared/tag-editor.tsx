import { useState, useRef, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";

/**
 * Tag Editor
 *
 * Combobox-style tag editor with autocomplete suggestions.
 * Follows editorial/Polaroid aesthetic - understated, typewriter-like labels.
 */

interface TagEditorProps {
  tags: string[];
  allTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  /** Compact mode - smaller tags, no icon in pills */
  compact?: boolean;
  /** Pill-shaped input that matches tag aesthetics instead of full-width field */
  pillInput?: boolean;
}

export function TagEditor({
  tags,
  allTags,
  onTagsChange,
  placeholder = "Add a tag...",
  maxTags = 10,
  compact = false,
  pillInput = false,
}: TagEditorProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input - exclude already added tags
  const suggestions = inputValue.trim()
    ? allTags
        .filter(
          (tag) =>
            tag.toLowerCase().includes(inputValue.toLowerCase()) &&
            !tags.includes(tag),
        )
        .slice(0, 6)
    : [];

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return;
      if (tags.length >= maxTags) return;
      if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return;
      if (!allTags.some((t) => t.toLowerCase() === trimmed.toLowerCase()))
        return;

      onTagsChange([...tags, trimmed]);
      setInputValue("");
      setIsOpen(false);
      setHighlightedIndex(0);
    },
    [tags, maxTags, onTagsChange, allTags],
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      onTagsChange(tags.filter((t) => t !== tagToRemove));
    },
    [tags, onTagsChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0 && highlightedIndex < suggestions.length) {
        addTag(suggestions[highlightedIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const maxIndex = suggestions.length - 1;
      setHighlightedIndex((i) => Math.min(i + 1, maxIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [inputValue]);

  const showDropdown = isOpen && suggestions.length > 0;

  return (
    <div ref={containerRef} className={compact ? "space-y-2" : "space-y-3"}>
      {/* Input with dropdown — shown first */}
      {tags.length < maxTags && (
        <div className={cn("relative", pillInput && "inline-block")}>
          <div className="relative">
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={compact ? 12 : 14}
              strokeWidth={2}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none",
                compact ? "left-2" : "left-3",
              )}
            />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn(
                "border border-dashed border-border/60",
                "bg-transparent placeholder:text-muted-foreground/40",
                "focus:outline-none focus:border-border focus:bg-muted/10",
                "transition-colors duration-200",
                pillInput
                  ? "h-6 pl-6 pr-3 text-micro rounded-full w-[120px] focus:w-[160px]"
                  : compact
                    ? "w-full h-6 pl-6 pr-2 text-micro rounded-lg"
                    : "w-full h-8 pl-8 pr-3 text-ui rounded-[var(--radius-lg)]",
              )}
              aria-expanded={showDropdown || undefined}
              aria-haspopup="listbox"
              role="combobox"
            />
          </div>

          {/* Suggestions dropdown */}
          {showDropdown && (
            <div
              className={cn(
                "absolute z-50 mt-1.5",
                pillInput ? "w-[200px]" : "w-full",
                "bg-background border border-border/60 rounded-[var(--radius-lg)] shadow-lg",
                "py-1 overflow-hidden",
              )}
              role="listbox"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => addTag(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "w-full px-3 py-1.5 text-left text-ui capitalize",
                    "transition-colors duration-100",
                    highlightedIndex === index
                      ? "bg-muted/50 text-foreground"
                      : "text-muted-foreground hover:bg-muted/30",
                  )}
                  role="option"
                  aria-selected={highlightedIndex === index}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current tags */}
      {tags.length > 0 && (
        <div className={cn("flex flex-wrap", compact ? "gap-1.5" : "gap-2")}>
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "group inline-flex items-center",
                "border border-border/60 bg-muted/20",
                "text-muted-foreground font-medium",
                "transition-colors duration-200",
                "hover:border-border hover:bg-muted/30",
                "capitalize",
                compact
                  ? "gap-1 px-2 py-0.5 text-micro rounded-full"
                  : "gap-1.5 px-2.5 py-1 text-caption rounded-full",
              )}
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="opacity-40 hover:opacity-100 transition-opacity -mr-0.5"
                aria-label={`Remove ${tag}`}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={compact ? 10 : 12}
                  strokeWidth={2}
                />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Max tags message */}
      {tags.length >= maxTags && (
        <p className="text-caption text-muted-foreground/50">
          Maximum {maxTags} tags reached
        </p>
      )}
    </div>
  );
}
