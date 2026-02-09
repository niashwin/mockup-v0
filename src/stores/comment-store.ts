import { create } from "zustand";

export interface CommentHighlight {
  id: string;
  reportId: string;
  selectedText: string;
  startOffset: number;
  endOffset: number;
  comment: {
    id: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: Date;
  } | null;
}

interface CommentState {
  // All highlights with comments
  highlights: CommentHighlight[];

  // Currently active highlight (clicked)
  activeHighlightId: string | null;

  // Selection state for new comment
  pendingSelection: {
    text: string;
    startOffset: number;
    endOffset: number;
  } | null;

  // Is comment composer open?
  isComposerOpen: boolean;

  // Actions
  setActiveHighlight: (id: string | null) => void;
  setPendingSelection: (
    selection: { text: string; startOffset: number; endOffset: number } | null,
  ) => void;
  openComposer: () => void;
  closeComposer: () => void;
  addComment: (
    text: string,
    userName: string,
    userId: string,
    reportId: string,
  ) => void;
  updateComment: (highlightId: string, newText: string) => void;
  deleteHighlight: (highlightId: string) => void;
  clearHighlightsForReport: (reportId: string) => void;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  highlights: [],
  activeHighlightId: null,
  pendingSelection: null,
  isComposerOpen: false,

  setActiveHighlight: (id) => set({ activeHighlightId: id }),

  setPendingSelection: (selection) => set({ pendingSelection: selection }),

  openComposer: () => set({ isComposerOpen: true }),

  closeComposer: () =>
    set({
      isComposerOpen: false,
      pendingSelection: null,
    }),

  addComment: (text, userName, userId, reportId) => {
    const { pendingSelection, highlights } = get();
    if (!pendingSelection) return;

    const newHighlight: CommentHighlight = {
      id: crypto.randomUUID(),
      reportId,
      selectedText: pendingSelection.text,
      startOffset: pendingSelection.startOffset,
      endOffset: pendingSelection.endOffset,
      comment: {
        id: crypto.randomUUID(),
        userId,
        userName,
        text,
        createdAt: new Date(),
      },
    };

    set({
      highlights: [...highlights, newHighlight],
      pendingSelection: null,
      isComposerOpen: false,
      activeHighlightId: newHighlight.id,
    });
  },

  updateComment: (highlightId, newText) =>
    set((state) => ({
      highlights: state.highlights.map((h) =>
        h.id === highlightId && h.comment
          ? { ...h, comment: { ...h.comment, text: newText } }
          : h,
      ),
    })),

  deleteHighlight: (highlightId) =>
    set((state) => ({
      highlights: state.highlights.filter((h) => h.id !== highlightId),
      activeHighlightId:
        state.activeHighlightId === highlightId
          ? null
          : state.activeHighlightId,
    })),

  clearHighlightsForReport: (reportId) =>
    set((state) => ({
      highlights: state.highlights.filter((h) => h.reportId !== reportId),
    })),
}));
