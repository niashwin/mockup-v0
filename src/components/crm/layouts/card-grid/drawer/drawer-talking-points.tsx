import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUpRight01Icon,
  News01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import type { Contact } from "@types/contact";

/**
 * Drawer Talking Points (Recent Activity)
 *
 * Accordion section showing AI-curated talking points with
 * optional source links. Collapsed by default, resets on contact change.
 */

interface DrawerTalkingPointsProps {
  contact: Contact;
  onExpandTimeline?: () => void;
}

export function DrawerTalkingPoints({
  contact,
  onExpandTimeline,
}: DrawerTalkingPointsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [contact.id]);

  if (
    !contact.insights.talkingPoints ||
    contact.insights.talkingPoints.length === 0
  ) {
    return null;
  }

  return (
    <section>
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex items-center justify-between w-full group"
      >
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={News01Icon}
            size={14}
            strokeWidth={2}
            className="text-muted-foreground/50"
          />
          <h4 className="font-medium text-[10px] text-muted-foreground/50 uppercase tracking-wider">
            Recent Activity
          </h4>
        </div>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={16}
          strokeWidth={2}
          className={cn(
            "text-muted-foreground/40 group-hover:text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 pt-2.5">
              {contact.insights.talkingPoints.slice(0, 4).map((point, i) => {
                const relatedInteraction = contact.interactions.find(
                  (int) =>
                    int.keyTopics?.some((topic) =>
                      point.toLowerCase().includes(topic.toLowerCase()),
                    ) ||
                    int.summary
                      ?.toLowerCase()
                      .includes(point.toLowerCase().slice(0, 20)),
                );
                const sourceUrl = relatedInteraction?.sourceUrl;

                return (
                  <li
                    key={i}
                    className="group flex items-start gap-2 text-ui text-foreground"
                  >
                    <span className="size-1 rounded-full bg-foreground/50 mt-2 shrink-0" />
                    <span className="flex-1">{point}</span>
                    {(sourceUrl || relatedInteraction) && (
                      <a
                        href={sourceUrl || "#"}
                        target={sourceUrl ? "_blank" : undefined}
                        rel={sourceUrl ? "noopener noreferrer" : undefined}
                        onClick={(e) => {
                          if (!sourceUrl) {
                            e.preventDefault();
                            onExpandTimeline?.();
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                        title={sourceUrl ? "View source" : "View in activity"}
                      >
                        <HugeiconsIcon
                          icon={ArrowUpRight01Icon}
                          size={14}
                          strokeWidth={2}
                        />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
