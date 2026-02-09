import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUpRight01Icon,
  Building03Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import type { Contact } from "@types/contact";

/**
 * Drawer Recent Company Activity
 *
 * Accordion section showing company news bullets.
 * Collapsed by default, resets on contact change.
 * Exposes an imperative expand via the onRegisterExpand callback.
 */

interface DrawerRecentActivityProps {
  contact: Contact;
  onRegisterExpand?: (expand: () => void) => void;
}

export function DrawerRecentActivity({
  contact,
  onRegisterExpand,
}: DrawerRecentActivityProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [contact.id]);

  useEffect(() => {
    onRegisterExpand?.(() => setIsExpanded(true));
  }, [onRegisterExpand]);

  const companyNews = contact.insights.companyNews ?? [];

  if (companyNews.length === 0) {
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
            icon={Building03Icon}
            size={14}
            strokeWidth={2}
            className="text-muted-foreground/50"
          />
          <h4 className="font-medium text-[10px] text-muted-foreground/50 uppercase tracking-wider">
            Recent Company Activity
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
              {companyNews.slice(0, 4).map((news) => (
                <li
                  key={news.id}
                  className="group flex items-start gap-2 text-ui text-foreground"
                >
                  <span className="size-1 rounded-full bg-foreground/50 mt-2 shrink-0" />
                  <span className="flex-1">{news.headline}</span>
                  {news.sourceUrl && (
                    <a
                      href={news.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                      title="View source"
                    >
                      <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        size={14}
                        strokeWidth={2}
                      />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
