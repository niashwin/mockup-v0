import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Contact,
  ContactSortField,
  CrmTagMeta,
  SortDirection,
} from "@types/contact";
import { mockContacts } from "@data/contacts";
import { getUnifiedTagList, ALL_KNOWN_TAGS } from "@lib/crm-tag-utils";

/**
 * CRM Store
 *
 * Manages state for the CRM page with card-grid layout:
 * - Tracks selected contact and drawer open state
 * - Unified tag filtering (auto-derived + custom tags)
 * - Recency-based filtering
 * - Pinned contacts and pinned tag groups
 *
 * View preferences are persisted to localStorage.
 */

interface CrmState {
  // ─── Contact Data ────────────────────────────────────────────────────────
  contacts: Contact[];

  // ─── View Configuration ──────────────────────────────────────────────────
  sortField: ContactSortField;
  sortDirection: SortDirection;

  // ─── Selection State ─────────────────────────────────────────────────────
  selectedContactId: string | null;
  isDrawerOpen: boolean;

  // ─── Filtering ───────────────────────────────────────────────────────────
  searchQuery: string;
  /** Selected tags (unified — matches auto-derived and custom tags) */
  selectedTags: string[];
  /** Recency filter bucket (e.g., "This week", "This month") */
  selectedRecencyFilter: string | null;

  // ─── UI State ────────────────────────────────────────────────────────────
  isFiltersPanelOpen: boolean;
  /** Individually pinned contact IDs */
  pinnedContactIds: string[];
  /** Tag groups pinned to float to top of grid */
  pinnedTagGroups: string[];
  /** User-created custom global tags */
  customGlobalTags: string[];
  /** Card display size for grid layout */
  cardSize: "sm" | "md" | "lg";

  // ─── Actions ─────────────────────────────────────────────────────────────
  setSortField: (field: ContactSortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  toggleSortDirection: () => void;

  selectContact: (id: string | null) => void;
  openDrawer: (contactId: string) => void;
  closeDrawer: () => void;

  setSearchQuery: (query: string) => void;
  toggleTag: (tag: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSelectedRecencyFilter: (filter: string | null) => void;
  clearFilters: () => void;

  toggleFiltersPanel: () => void;
  setFiltersPanelOpen: (open: boolean) => void;

  updateContactTags: (contactId: string, tags: string[]) => void;
  updateContactNotes: (contactId: string, notes: string) => void;

  togglePin: (contactId: string) => void;
  togglePinTagGroup: (tag: string) => void;

  addGlobalTag: (tag: string) => void;
  removeGlobalTag: (tag: string) => void;

  setCardSize: (size: "sm" | "md" | "lg") => void;

  getAllUniqueTags: () => CrmTagMeta[];

  reset: () => void;
}

const initialState = {
  contacts: mockContacts,
  sortField: "lastContacted" as ContactSortField,
  sortDirection: "desc" as SortDirection,
  selectedContactId: null,
  isDrawerOpen: false,
  searchQuery: "",
  selectedTags: [] as string[],
  selectedRecencyFilter: null as string | null,
  isFiltersPanelOpen: false,
  pinnedContactIds: [] as string[],
  pinnedTagGroups: [] as string[],
  customGlobalTags: [] as string[],
  cardSize: "lg" as "sm" | "md" | "lg",
};

export const useCrmStore = create<CrmState>()(
  persist(
    (set) => ({
      ...initialState,

      // ─── View Actions ──────────────────────────────────────────────────────
      setSortField: (field) => set({ sortField: field }),

      setSortDirection: (direction) => set({ sortDirection: direction }),

      toggleSortDirection: () =>
        set((state) => ({
          sortDirection: state.sortDirection === "asc" ? "desc" : "asc",
        })),

      // ─── Selection Actions ─────────────────────────────────────────────────
      selectContact: (id) => set({ selectedContactId: id }),

      // ─── Drawer Actions ────────────────────────────────────────────────────
      openDrawer: (contactId) =>
        set({
          selectedContactId: contactId,
          isDrawerOpen: true,
        }),

      closeDrawer: () => set({ isDrawerOpen: false }),

      // ─── Filter Actions ────────────────────────────────────────────────────
      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleTag: (tag) =>
        set((state) => ({
          selectedTags: state.selectedTags.includes(tag)
            ? state.selectedTags.filter((t) => t !== tag)
            : [...state.selectedTags, tag],
        })),

      setSelectedTags: (tags) => set({ selectedTags: tags }),

      setSelectedRecencyFilter: (filter) =>
        set({ selectedRecencyFilter: filter }),

      clearFilters: () =>
        set({
          searchQuery: "",
          selectedTags: [],
          selectedRecencyFilter: null,
        }),

      // ─── UI Actions ────────────────────────────────────────────────────────
      toggleFiltersPanel: () =>
        set((state) => ({ isFiltersPanelOpen: !state.isFiltersPanelOpen })),

      setFiltersPanelOpen: (open) => set({ isFiltersPanelOpen: open }),

      // ─── Contact Data Actions ──────────────────────────────────────────────
      updateContactTags: (contactId, tags) =>
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === contactId
              ? { ...contact, tags, updatedAt: new Date() }
              : contact,
          ),
        })),

      updateContactNotes: (contactId, newNotes) =>
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === contactId
              ? {
                  ...c,
                  notes: {
                    ...c.notes,
                    customSummary: newNotes,
                    notesUpdatedAt: new Date(),
                  },
                  updatedAt: new Date(),
                }
              : c,
          ),
        })),

      // ─── Pin Actions ───────────────────────────────────────────────────────
      togglePin: (contactId) =>
        set((state) => ({
          pinnedContactIds: state.pinnedContactIds.includes(contactId)
            ? state.pinnedContactIds.filter((id) => id !== contactId)
            : [...state.pinnedContactIds, contactId],
        })),

      togglePinTagGroup: (tag) =>
        set((state) => ({
          pinnedTagGroups: state.pinnedTagGroups.includes(tag)
            ? state.pinnedTagGroups.filter((t) => t !== tag)
            : [...state.pinnedTagGroups, tag],
        })),

      // ─── Custom Tag Actions ────────────────────────────────────────────────
      addGlobalTag: (tag) =>
        set((state) => {
          const trimmed = tag.trim();
          if (!trimmed) return state;
          const existing = [...ALL_KNOWN_TAGS, ...state.customGlobalTags];
          if (existing.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
            return state;
          }
          return { customGlobalTags: [...state.customGlobalTags, trimmed] };
        }),

      removeGlobalTag: (tag) =>
        set((state) => ({
          customGlobalTags: state.customGlobalTags.filter((t) => t !== tag),
        })),

      // ─── Card Size ──────────────────────────────────────────────────────
      setCardSize: (size) => set({ cardSize: size }),

      // ─── Derived Data ──────────────────────────────────────────────────────
      getAllUniqueTags: () => {
        const state = useCrmStore.getState();
        return getUnifiedTagList(state.contacts, state.customGlobalTags);
      },

      // ─── Utility ──────────────────────────────────────────────────────────
      reset: () => set({ ...initialState }),
    }),
    {
      name: "crm-data",
      version: 6,
      partialize: (state) => ({
        sortField: state.sortField,
        sortDirection: state.sortDirection,
        pinnedContactIds: state.pinnedContactIds,
        pinnedTagGroups: state.pinnedTagGroups,
        customGlobalTags: state.customGlobalTags,
        cardSize: state.cardSize,
      }),
    },
  ),
);

// ─────────────────────────────────────────────────────────────────────────────
// Selector Hooks (for optimized re-renders)
// ─────────────────────────────────────────────────────────────────────────────

export function useIsContactSelected(contactId: string): boolean {
  return useCrmStore((state) => state.selectedContactId === contactId);
}

export function useHasActiveFilters(): boolean {
  return useCrmStore(
    (state) =>
      state.searchQuery !== "" ||
      state.selectedTags.length > 0 ||
      state.selectedRecencyFilter !== null,
  );
}
