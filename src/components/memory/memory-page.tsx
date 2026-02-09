import { MemoryInitiativeSidebar } from "./memory-initiative-sidebar";
import { MemoryInitiativeHeader } from "./memory-initiative-header";
import { MemoryTimeline } from "./memory-timeline";
import { MemoryEventDetail } from "./memory-event-detail";
import { MemorySourcesPanel } from "./memory-sources-panel";
import { useMemoryStore } from "@stores/memory-store";

/**
 * Memory Page
 *
 * Initiative-centric timeline view with:
 * - Left sidebar: Initiatives (swimlanes) grouped by ACTIVE/BLOCKED status
 * - Initiative header: Title, description, stakeholder avatars
 * - Horizontal timeline: Week markers with event cards
 * - Event detail panel: Slides up when event selected
 * - Sources panel: Slides in from right when sources button clicked
 *
 * Layout:
 * ┌───────────┬────────────────────────────────────────────────────┐
 * │           │ Initiative Header                                  │
 * │  Sidebar  ├────────────────────────────────────────────────────┤
 * │  (220px)  │ Timeline (week columns with event cards)           │
 * │           ├────────────────────────────────────────────────────┤
 * │           │ Event Detail (when event selected)                 │
 * └───────────┴────────────────────────────────────────────────────┘
 */

export function MemoryPage() {
  // Get selected IDs from store
  const selectedInitiativeId = useMemoryStore(
    (state) => state.selectedInitiativeId,
  );

  // Get data from store
  const initiatives = useMemoryStore((state) => state.initiatives);

  // Derive selected initiative
  const selectedInitiative =
    initiatives.find((i) => i.id === selectedInitiativeId) || null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background relative">
      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Initiative Swimlanes */}
        <MemoryInitiativeSidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Initiative Header */}
          <MemoryInitiativeHeader initiative={selectedInitiative} />

          {/* Timeline with week markers */}
          <MemoryTimeline />

          {/* Event Detail Panel - Slide-up panel (shows in focus mode) */}
          <MemoryEventDetail />
        </main>
      </div>

      {/* Sources Panel (slides from right) */}
      <MemorySourcesPanel />
    </div>
  );
}
