/**
 * Home Page Store
 *
 * Zustand store for managing Home page state including:
 * - Selected personal task and popup visibility
 * - Meeting brief popup state
 */

import { create } from "zustand";

// ═══════════════════════════════════════════════════════════════════════════
// Store Types
// ═══════════════════════════════════════════════════════════════════════════

interface HomeState {
  // Personal Task State
  selectedTaskId: string | null;
  isTaskPopupOpen: boolean;

  // Meeting Brief State
  selectedMeetingId: string | null;
  isBriefPopupOpen: boolean;

  // Needs Attention Popup State
  isNeedsAttentionPopupOpen: boolean;

  // Actions
  selectTask: (taskId: string) => void;
  openTaskPopup: (taskId: string) => void;
  closeTaskPopup: () => void;

  openBriefPopup: (meetingId: string) => void;
  closeBriefPopup: () => void;

  openNeedsAttentionPopup: () => void;
  closeNeedsAttentionPopup: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// Store Implementation
// ═══════════════════════════════════════════════════════════════════════════

export const useHomeStore = create<HomeState>()((set) => ({
  // Initial state
  selectedTaskId: null,
  isTaskPopupOpen: false,

  selectedMeetingId: null,
  isBriefPopupOpen: false,

  isNeedsAttentionPopupOpen: false,

  // Personal Task Actions
  selectTask: (taskId) =>
    set({
      selectedTaskId: taskId,
    }),

  openTaskPopup: (taskId) =>
    set({
      selectedTaskId: taskId,
      isTaskPopupOpen: true,
    }),

  closeTaskPopup: () =>
    set({
      isTaskPopupOpen: false,
    }),

  // Meeting Brief Actions
  openBriefPopup: (meetingId) =>
    set({
      selectedMeetingId: meetingId,
      isBriefPopupOpen: true,
    }),

  closeBriefPopup: () =>
    set({
      isBriefPopupOpen: false,
    }),

  // Needs Attention Popup Actions
  openNeedsAttentionPopup: () =>
    set({
      isNeedsAttentionPopupOpen: true,
    }),

  closeNeedsAttentionPopup: () =>
    set({
      isNeedsAttentionPopupOpen: false,
    }),
}));

// ═══════════════════════════════════════════════════════════════════════════
// Selector Hooks (for optimized re-renders)
// ═══════════════════════════════════════════════════════════════════════════

export const useSelectedTaskId = () =>
  useHomeStore((state) => state.selectedTaskId);

export const useIsTaskPopupOpen = () =>
  useHomeStore((state) => state.isTaskPopupOpen);

export const useIsBriefPopupOpen = () =>
  useHomeStore((state) => state.isBriefPopupOpen);

export const useIsNeedsAttentionPopupOpen = () =>
  useHomeStore((state) => state.isNeedsAttentionPopupOpen);
