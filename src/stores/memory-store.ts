import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MemoryEvent, MemorySource, Initiative } from "@types/memory";
import {
  mockMemoryEvents,
  getEventsByWeek,
  getOrderedWeekLabels,
} from "@data/memories";
import { mockInitiatives } from "@data/mock-initiatives";

/**
 * Memory Store
 *
 * Manages state for the Memory timeline page:
 * - Initiatives (swimlanes) and events data
 * - Initiative and event selection
 * - Sources panel state
 * - Sidebar accordion state (ACTIVE/BLOCKED sections)
 *
 * View preferences (expandedSections) are persisted.
 */

type SidebarSection = "active" | "blocked";
type ConnectionVisualizationMode = "dim-only" | "dim-with-lines";

interface MemoryState {
  // ─── Data ────────────────────────────────────────────────────────────────
  /** All memory events */
  events: MemoryEvent[];

  /** All initiatives (swimlanes) */
  initiatives: Initiative[];

  // ─── Selection State ─────────────────────────────────────────────────────
  /** Currently selected initiative ID */
  selectedInitiativeId: string | null;

  /** Currently selected event ID (within the selected initiative) */
  selectedEventId: string | null;

  // ─── Sources Panel State ─────────────────────────────────────────────────
  /** Whether the sources panel is open */
  isSourcesPanelOpen: boolean;

  /** Sources to display in the panel */
  sourcePanelSources: MemorySource[];

  // ─── Sidebar State ───────────────────────────────────────────────────────
  /** Sidebar sections that are expanded (ACTIVE, BLOCKED) */
  expandedSections: SidebarSection[];

  // ─── Search & Filter State ──────────────────────────────────────────────
  /** Search query for sidebar filtering */
  searchQuery: string;

  /** Week labels that are expanded in sidebar */
  expandedWeeks: string[];

  /** Whether the detail popup is open */
  isPopupOpen: boolean;

  // ─── Focus Mode State ───────────────────────────────────────────────────
  /** ID of the event that initiated focus mode (clicked to show connections) */
  focusedEventId: string | null;

  /** Whether focus mode is active (dimming non-connected events) */
  isFocusMode: boolean;

  /** Visualization mode: 'dim-only' or 'dim-with-lines' */
  connectionVisualizationMode: ConnectionVisualizationMode;

  // ─── Initiative Actions ──────────────────────────────────────────────────
  selectInitiative: (id: string | null) => void;

  // ─── Event Actions ───────────────────────────────────────────────────────
  selectEvent: (id: string | null) => void;
  clearSelection: () => void;

  // ─── Focus Mode Actions ─────────────────────────────────────────────────
  /** Enter focus mode for a specific event (shows its connections) */
  enterFocusMode: (eventId: string) => void;

  /** Exit focus mode and return to normal view */
  exitFocusMode: () => void;

  /** Toggle focus mode for an event */
  toggleFocusMode: (eventId: string) => void;

  /** Toggle between 'dim-only' and 'dim-with-lines' visualization modes */
  toggleVisualizationMode: () => void;

  /** Set visualization mode explicitly */
  setVisualizationMode: (mode: ConnectionVisualizationMode) => void;

  // ─── Sources Panel Actions ───────────────────────────────────────────────
  openSourcesPanel: (sources: MemorySource[]) => void;
  closeSourcesPanel: () => void;

  // ─── Sidebar Actions ─────────────────────────────────────────────────────
  toggleSection: (section: SidebarSection) => void;
  expandAllSections: () => void;
  collapseAllSections: () => void;

  // ─── Popup & Search Actions ─────────────────────────────────────────────
  openPopup: (eventId: string) => void;
  closePopup: () => void;
  setSearchQuery: (query: string) => void;
  toggleWeekExpanded: (weekLabel: string) => void;
  expandAllWeeks: () => void;
  collapseAllWeeks: () => void;
  toggleActionItem: (eventId: string, actionItemId: string) => void;

  // ─── Computed / Derived Data ─────────────────────────────────────────────
  /** Get initiatives grouped by status */
  getInitiativesByStatus: () => {
    active: Initiative[];
    blocked: Initiative[];
  };

  /** Get events for a specific initiative */
  getEventsForInitiative: (initiativeId: string) => MemoryEvent[];

  /** Get the selected initiative object */
  getSelectedInitiative: () => Initiative | null;

  /** Get the selected event object */
  getSelectedEvent: () => MemoryEvent | null;

  /** Get events grouped by week for timeline display */
  getEventsByWeekForInitiative: (
    initiativeId: string,
  ) => Map<string, MemoryEvent[]>;

  /** Get ordered week labels for an initiative */
  getWeekLabelsForInitiative: (initiativeId: string) => string[];

  // ─── Focus Mode Computed ────────────────────────────────────────────────
  /** Get all event IDs connected to a given event (bidirectional lookup) */
  getConnectedEventIds: (eventId: string) => string[];

  /** Check if an event is connected to the currently focused event */
  isEventConnectedToFocus: (eventId: string) => boolean;

  /** Check if an event should be dimmed (not connected to focused event) */
  isEventDimmed: (eventId: string) => boolean;

  // ─── Search Computed ────────────────────────────────────────────────────
  getFilteredEvents: () => MemoryEvent[];
  getEventsByWeekGrouped: () => Map<string, MemoryEvent[]>;
  getOrderedWeeks: () => string[];

  // ─── Utility ─────────────────────────────────────────────────────────────
  reset: () => void;
}

const initialState = {
  events: mockMemoryEvents,
  initiatives: mockInitiatives,
  selectedInitiativeId: mockInitiatives[0]?.id || null, // Select first initiative by default
  selectedEventId: null as string | null,
  isSourcesPanelOpen: false,
  sourcePanelSources: [] as MemorySource[],
  expandedSections: ["active"] as SidebarSection[], // ACTIVE expanded by default
  searchQuery: "",
  expandedWeeks: ["This Week", "Last Week"],
  isPopupOpen: false,
  // Focus Mode
  focusedEventId: null as string | null,
  isFocusMode: false,
  connectionVisualizationMode: "dim-only" as ConnectionVisualizationMode,
};

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ═══════════════════════════════════════════════════════════════════════
      // Initiative Actions
      // ═══════════════════════════════════════════════════════════════════════

      selectInitiative: (id) =>
        set({
          selectedInitiativeId: id,
          selectedEventId: null, // Clear event selection when changing initiative
        }),

      // ═══════════════════════════════════════════════════════════════════════
      // Event Actions
      // ═══════════════════════════════════════════════════════════════════════

      selectEvent: (id) => set({ selectedEventId: id }),

      clearSelection: () =>
        set({ selectedEventId: null, selectedInitiativeId: null }),

      // ═══════════════════════════════════════════════════════════════════════
      // Focus Mode Actions
      // ═══════════════════════════════════════════════════════════════════════

      enterFocusMode: (eventId) =>
        set({
          focusedEventId: eventId,
          isFocusMode: true,
          selectedEventId: eventId, // Also select the event
        }),

      exitFocusMode: () =>
        set({
          focusedEventId: null,
          isFocusMode: false,
        }),

      toggleFocusMode: (eventId) => {
        const { focusedEventId, isFocusMode } = get();
        if (isFocusMode && focusedEventId === eventId) {
          // Already focused on this event, exit focus mode
          set({ focusedEventId: null, isFocusMode: false });
        } else {
          // Enter focus mode for this event
          set({
            focusedEventId: eventId,
            isFocusMode: true,
            selectedEventId: eventId,
          });
        }
      },

      toggleVisualizationMode: () =>
        set((state) => ({
          connectionVisualizationMode:
            state.connectionVisualizationMode === "dim-only"
              ? "dim-with-lines"
              : "dim-only",
        })),

      setVisualizationMode: (mode) =>
        set({ connectionVisualizationMode: mode }),

      // ═══════════════════════════════════════════════════════════════════════
      // Sources Panel Actions
      // ═══════════════════════════════════════════════════════════════════════

      openSourcesPanel: (sources) =>
        set({
          isSourcesPanelOpen: true,
          sourcePanelSources: sources,
        }),

      closeSourcesPanel: () =>
        set({
          isSourcesPanelOpen: false,
          sourcePanelSources: [],
        }),

      // ═══════════════════════════════════════════════════════════════════════
      // Sidebar Actions
      // ═══════════════════════════════════════════════════════════════════════

      toggleSection: (section) =>
        set((state) => {
          const expanded = state.expandedSections.includes(section)
            ? state.expandedSections.filter((s) => s !== section)
            : [...state.expandedSections, section];
          return { expandedSections: expanded };
        }),

      expandAllSections: () => set({ expandedSections: ["active", "blocked"] }),

      collapseAllSections: () => set({ expandedSections: [] }),

      // ═══════════════════════════════════════════════════════════════════════
      // Popup & Search Actions
      // ═══════════════════════════════════════════════════════════════════════

      openPopup: (eventId) =>
        set({
          selectedEventId: eventId,
          isPopupOpen: true,
        }),

      closePopup: () => set({ isPopupOpen: false }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleWeekExpanded: (weekLabel) =>
        set((state) => {
          const expanded = state.expandedWeeks.includes(weekLabel)
            ? state.expandedWeeks.filter((w) => w !== weekLabel)
            : [...state.expandedWeeks, weekLabel];
          return { expandedWeeks: expanded };
        }),

      expandAllWeeks: () =>
        set((state) => ({
          expandedWeeks: getOrderedWeekLabels(state.events),
        })),

      collapseAllWeeks: () => set({ expandedWeeks: [] }),

      toggleActionItem: (eventId, actionItemId) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  actionItems: event.actionItems.map((item) =>
                    item.id === actionItemId
                      ? { ...item, isCompleted: !item.isCompleted }
                      : item,
                  ),
                  updatedAt: new Date(),
                }
              : event,
          ),
        })),

      // ═══════════════════════════════════════════════════════════════════════
      // Computed / Derived Data
      // ═══════════════════════════════════════════════════════════════════════

      getInitiativesByStatus: () => {
        const { initiatives } = get();
        const active: Initiative[] = [];
        const blocked: Initiative[] = [];

        for (const initiative of initiatives) {
          if (initiative.status === "active") {
            active.push(initiative);
          } else if (initiative.status === "blocked") {
            blocked.push(initiative);
          }
        }

        return { active, blocked };
      },

      getEventsForInitiative: (initiativeId) => {
        const { events } = get();
        return events
          .filter((e) => e.initiativeId === initiativeId)
          .sort((a, b) => a.date.getTime() - b.date.getTime()); // Oldest first for timeline
      },

      getSelectedInitiative: () => {
        const { initiatives, selectedInitiativeId } = get();
        return initiatives.find((i) => i.id === selectedInitiativeId) || null;
      },

      getSelectedEvent: () => {
        const { events, selectedEventId } = get();
        return events.find((e) => e.id === selectedEventId) || null;
      },

      getEventsByWeekForInitiative: (initiativeId) => {
        const events = get().getEventsForInitiative(initiativeId);
        return getEventsByWeek(events);
      },

      getWeekLabelsForInitiative: (initiativeId) => {
        const events = get().getEventsForInitiative(initiativeId);
        return getOrderedWeekLabels(events);
      },

      // ═══════════════════════════════════════════════════════════════════════
      // Focus Mode Computed
      // ═══════════════════════════════════════════════════════════════════════

      getConnectedEventIds: (eventId) => {
        const { events, selectedInitiativeId } = get();
        const event = events.find((e) => e.id === eventId);
        if (!event) return [];

        // Direct connections from this event
        const direct = event.connectedEventIds || [];

        // Reverse connections (events that connect TO this event)
        const reverse = events
          .filter((e) => e.connectedEventIds?.includes(eventId))
          .map((e) => e.id);

        // Combine and deduplicate
        const allConnected = [...new Set([...direct, ...reverse])];

        // Filter to only include events in the current initiative
        // (since cross-initiative connections can't be visualized in the swimlane)
        if (selectedInitiativeId) {
          const initiativeEventIds = new Set(
            events
              .filter((e) => e.initiativeId === selectedInitiativeId)
              .map((e) => e.id),
          );
          return allConnected.filter((id) => initiativeEventIds.has(id));
        }

        return allConnected;
      },

      isEventConnectedToFocus: (eventId) => {
        const { isFocusMode, focusedEventId } = get();
        if (!isFocusMode || !focusedEventId) return false;

        // The focused event itself is always "connected"
        if (focusedEventId === eventId) return true;

        // Check if this event is in the connected list
        const connectedIds = get().getConnectedEventIds(focusedEventId);
        return connectedIds.includes(eventId);
      },

      isEventDimmed: (eventId) => {
        const { isFocusMode, focusedEventId } = get();
        if (!isFocusMode || !focusedEventId) return false;

        // The focused event is never dimmed
        if (focusedEventId === eventId) return false;

        // Dimmed if NOT connected to the focused event
        return !get().isEventConnectedToFocus(eventId);
      },

      // ═══════════════════════════════════════════════════════════════════════
      // Search Computed
      // ═══════════════════════════════════════════════════════════════════════

      getFilteredEvents: () => {
        const { events, searchQuery } = get();

        if (!searchQuery) return events;

        const query = searchQuery.toLowerCase();
        return events.filter((event) => {
          const searchableText = [
            event.title,
            event.summary,
            event.category,
            ...event.tags,
            ...event.participants.map((p) => p.name),
          ]
            .join(" ")
            .toLowerCase();
          return searchableText.includes(query);
        });
      },

      getEventsByWeekGrouped: () => {
        const filteredEvents = get().getFilteredEvents();
        return getEventsByWeek(filteredEvents);
      },

      getOrderedWeeks: () => {
        const filteredEvents = get().getFilteredEvents();
        return getOrderedWeekLabels(filteredEvents);
      },

      // ═══════════════════════════════════════════════════════════════════════
      // Utility
      // ═══════════════════════════════════════════════════════════════════════

      reset: () => set(initialState),
    }),
    {
      name: "memory-storage",
      version: 3, // Bump version for focus mode
      partialize: (state) => ({
        // Only persist view preferences
        expandedSections: state.expandedSections,
        expandedWeeks: state.expandedWeeks,
        connectionVisualizationMode: state.connectionVisualizationMode,
      }),
    },
  ),
);

// ═══════════════════════════════════════════════════════════════════════════
// Selector Hooks (for optimized re-renders)
// ═══════════════════════════════════════════════════════════════════════════

export function useIsInitiativeSelected(initiativeId: string): boolean {
  return useMemoryStore((state) => state.selectedInitiativeId === initiativeId);
}

export function useIsEventSelected(eventId: string): boolean {
  return useMemoryStore((state) => state.selectedEventId === eventId);
}

export function useIsSectionExpanded(section: SidebarSection): boolean {
  return useMemoryStore((state) => state.expandedSections.includes(section));
}

export function useIsWeekExpanded(weekLabel: string): boolean {
  return useMemoryStore((state) => state.expandedWeeks.includes(weekLabel));
}

// ═══════════════════════════════════════════════════════════════════════════
// Focus Mode Selector Hooks
// ═══════════════════════════════════════════════════════════════════════════

export function useIsFocusMode(): boolean {
  return useMemoryStore((state) => state.isFocusMode);
}

export function useFocusedEventId(): string | null {
  return useMemoryStore((state) => state.focusedEventId);
}

export function useIsEventFocused(eventId: string): boolean {
  return useMemoryStore((state) => state.focusedEventId === eventId);
}

export function useIsEventConnectedToFocus(eventId: string): boolean {
  return useMemoryStore((state) => {
    if (!state.isFocusMode || !state.focusedEventId) return false;
    if (state.focusedEventId === eventId) return true;

    // Get connected events (already filtered to current initiative by getConnectedEventIds)
    const connectedIds = state.getConnectedEventIds(state.focusedEventId);
    return connectedIds.includes(eventId);
  });
}

export function useIsEventDimmed(eventId: string): boolean {
  return useMemoryStore((state) => {
    if (!state.isFocusMode || !state.focusedEventId) return false;
    if (state.focusedEventId === eventId) return false;

    // Get connected events (already filtered to current initiative by getConnectedEventIds)
    const connectedIds = state.getConnectedEventIds(state.focusedEventId);
    return !connectedIds.includes(eventId);
  });
}

export function useConnectionVisualizationMode(): ConnectionVisualizationMode {
  return useMemoryStore((state) => state.connectionVisualizationMode);
}
