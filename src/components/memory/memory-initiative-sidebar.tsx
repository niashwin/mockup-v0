import { motion } from "motion/react";
import { cn } from "@lib/utils";
import type { Initiative } from "@types/memory";
import { useMemoryStore, useIsInitiativeSelected } from "@stores/memory-store";

/**
 * Initiative Sidebar
 *
 * Left sidebar showing "Memory" title with initiative count,
 * and a flat list of all initiatives by name.
 */

interface InitiativeItemProps {
  initiative: Initiative;
}

function InitiativeItem({ initiative }: InitiativeItemProps) {
  const isSelected = useIsInitiativeSelected(initiative.id);
  const selectInitiative = useMemoryStore((state) => state.selectInitiative);

  return (
    <motion.button
      type="button"
      onClick={() => selectInitiative(initiative.id)}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-[var(--radius-md)]",
        "transition-colors duration-150",
        isSelected
          ? "bg-accent-muted text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-caption font-medium truncate">
        {initiative.name}
      </span>
    </motion.button>
  );
}

export function MemoryInitiativeSidebar() {
  const initiatives = useMemoryStore((state) => state.initiatives);

  return (
    <aside className="w-[220px] shrink-0 bg-sidebar border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-3 border-b border-border">
        <h2 className="text-caption font-semibold text-foreground uppercase tracking-wider">
          Memory
        </h2>
        <p className="text-micro text-muted-foreground/60 mt-0.5">
          {initiatives.length} initiatives
        </p>
      </div>

      {/* Initiative List */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="flex flex-col gap-0.5">
          {initiatives.map((initiative) => (
            <InitiativeItem key={initiative.id} initiative={initiative} />
          ))}
        </div>
      </div>
    </aside>
  );
}
