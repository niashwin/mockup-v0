import { useState, useMemo, type ComponentType, type SVGProps } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "motion/react";
import { SourceCard } from "./source-card";
import { cn } from "@lib/utils";
import {
  SlackIcon,
  LinearIcon,
  GoogleCalendarIcon,
  MonitorIcon,
  ExternalLinkIcon,
  FileTextIcon,
} from "@components/icons/source-icons";
import type { SourceItem, SourceCategory } from "@types/sources";

interface SourcesAccordionProps {
  sources: SourceItem[];
}

const categoryConfig: Record<
  SourceCategory,
  { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  meetings: { label: "Meetings", Icon: GoogleCalendarIcon },
  slack: { label: "Slack", Icon: SlackIcon },
  linear: { label: "Linear", Icon: LinearIcon },
  system: { label: "System Logs", Icon: MonitorIcon },
  external: { label: "External", Icon: ExternalLinkIcon },
  reports: { label: "Reports", Icon: FileTextIcon },
};

const categoryOrder: SourceCategory[] = [
  "meetings",
  "slack",
  "linear",
  "system",
  "external",
  "reports",
];

export function SourcesAccordion({ sources }: SourcesAccordionProps) {
  const [expandedSections, setExpandedSections] = useState<Set<SourceCategory>>(
    new Set(categoryOrder),
  );

  const groupedSources = useMemo(() => {
    const groups: Record<SourceCategory, SourceItem[]> = {
      meetings: [],
      slack: [],
      linear: [],
      system: [],
      external: [],
      reports: [],
    };

    for (const source of sources) {
      groups[source.category].push(source);
    }

    return groups;
  }, [sources]);

  const toggleSection = (category: SourceCategory) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const nonEmptyCategories = categoryOrder.filter(
    (cat) => groupedSources[cat].length > 0,
  );

  if (nonEmptyCategories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-ui text-muted-foreground">No sources available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {nonEmptyCategories.map((category) => {
        const config = categoryConfig[category];
        const items = groupedSources[category];
        const isExpanded = expandedSections.has(category);
        const { Icon } = config;

        return (
          <div
            key={category}
            className="border border-border rounded-[var(--radius-lg)] overflow-hidden bg-surface"
          >
            {/* Section Header */}
            <button
              id={`sources-accordion-header-${category}`}
              onClick={() => toggleSection(category)}
              aria-expanded={isExpanded}
              aria-controls={`sources-accordion-${category}`}
              className={cn(
                "w-full px-4 py-3 flex items-center justify-between",
                "hover:bg-muted hover:text-foreground transition-colors duration-150",
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="size-4" />
                <span className="text-ui font-medium text-foreground">
                  {config.label}
                </span>
                <span
                  className={cn(
                    "size-[14px] rounded-full text-[10px] font-medium",
                    "bg-[var(--color-sources)] text-[var(--color-sources-foreground)]",
                    "inline-flex items-center justify-center",
                  )}
                >
                  {items.length}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="text-muted-foreground"
                />
              </motion.div>
            </button>

            {/* Section Content */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  id={`sources-accordion-${category}`}
                  role="region"
                  aria-labelledby={`sources-accordion-header-${category}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-2 space-y-2 bg-muted/30 border-t border-border-subtle">
                    {items.map((source) => (
                      <SourceCard key={source.id} source={source} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
