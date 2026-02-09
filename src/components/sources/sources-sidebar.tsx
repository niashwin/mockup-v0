import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { useSourcesStore } from "@stores/sources-store";
import { SourcesAccordion } from "./sources-accordion";
import { springs } from "@lib/motion";
import { cn } from "@lib/utils";

export function SourcesSidebar() {
  const { isOpen, sectionTitle, sources, close } = useSourcesStore();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    // Delay to prevent immediate close from triggering event
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, close]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={springs.default}
            className={cn(
              "fixed top-0 right-0 bottom-0 w-[360px] z-50",
              "bg-surface-elevated border-l border-border shadow-float",
              "flex flex-col overflow-hidden",
            )}
          >
            {/* Header */}
            <div className="shrink-0 px-6 py-5 border-b border-border-subtle flex items-center justify-between bg-surface-elevated">
              <div>
                <h3 className="text-heading font-semibold text-foreground">
                  Sources
                </h3>
                <p className="text-caption text-muted-foreground mt-0.5">
                  {sectionTitle}
                </p>
              </div>
              <button
                onClick={close}
                className={cn(
                  "size-8 rounded-[var(--radius-lg)] flex items-center justify-center",
                  "text-muted-foreground hover:text-foreground",
                  "hover:bg-muted transition-colors duration-150",
                )}
                aria-label="Close sources sidebar"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={16}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <SourcesAccordion sources={sources} />
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-4 border-t border-border-subtle bg-surface-elevated">
              <p className="text-caption text-muted-foreground/70 text-center">
                {sources.length} source{sources.length !== 1 ? "s" : ""} from
                this section
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
