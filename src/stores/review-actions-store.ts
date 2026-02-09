import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Action,
  MeetingAction,
  EmailAction,
  Participant,
  RecipientType,
} from "@types/action";

export type ModalLayout = "split-panel";

interface ReviewActionsState {
  // Modal state
  isOpen: boolean;
  actions: Action[];
  currentIndex: number;

  // Draft state for editing without committing
  draftAction: Action | null;

  // Navigation direction for animations
  direction: number;

  // Layout preference
  layout: ModalLayout;

  // Actions
  openModal: (actions: Action[]) => void;
  closeModal: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  setLayout: (layout: ModalLayout) => void;

  // Draft mutations
  updateDraft: (updates: Partial<Action>) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  cycleRecipientType: (participantId: string) => void;

  // Action completion
  markCompleted: () => void;
  skipAction: () => void;

  // Computed
  currentAction: () => Action | null;
  remainingCount: () => number;
}

type SetState = (
  partial:
    | Partial<ReviewActionsState>
    | ((state: ReviewActionsState) => Partial<ReviewActionsState>),
) => void;
type GetState = () => ReviewActionsState;

function finalizeAction(set: SetState, get: GetState, action: Action): void {
  const { actions, currentIndex } = get();
  const updatedActions = actions.map((a, i) =>
    i === currentIndex ? action : a,
  );

  const nextPendingIndex = updatedActions.findIndex(
    (a, i) => i > currentIndex && a.status === "pending",
  );

  if (nextPendingIndex === -1) {
    set({
      actions: updatedActions,
      isOpen: false,
      draftAction: null,
    });
  } else {
    set({
      actions: updatedActions,
      currentIndex: nextPendingIndex,
      draftAction: { ...updatedActions[nextPendingIndex] },
      direction: 1,
    });
  }
}

export const useReviewActionsStore = create<ReviewActionsState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      actions: [],
      currentIndex: 0,
      draftAction: null,
      direction: 0,
      layout: "split-panel" as ModalLayout,

      openModal: (actions) => {
        const pendingActions = actions.filter((a) => a.status === "pending");
        const firstAction = pendingActions[0] ?? null;
        set({
          isOpen: true,
          actions: pendingActions,
          currentIndex: 0,
          draftAction: firstAction ? { ...firstAction } : null,
          direction: 0,
        });
      },

      closeModal: () =>
        set({
          isOpen: false,
          draftAction: null,
          direction: 0,
        }),

      setLayout: (layout) => set({ layout }),

      goToNext: () => {
        const { actions, currentIndex, draftAction } = get();
        if (currentIndex >= actions.length - 1) return;

        // Save current draft back to actions before moving
        const updatedActions = draftAction
          ? actions.map((a, i) => (i === currentIndex ? { ...draftAction } : a))
          : actions;

        const nextIndex = currentIndex + 1;
        set({
          actions: updatedActions,
          currentIndex: nextIndex,
          draftAction: { ...updatedActions[nextIndex] },
          direction: 1,
        });
      },

      goToPrevious: () => {
        const { actions, currentIndex, draftAction } = get();
        if (currentIndex <= 0) return;

        // Save current draft back to actions before moving
        const updatedActions = draftAction
          ? actions.map((a, i) => (i === currentIndex ? { ...draftAction } : a))
          : actions;

        const prevIndex = currentIndex - 1;
        set({
          actions: updatedActions,
          currentIndex: prevIndex,
          draftAction: { ...updatedActions[prevIndex] },
          direction: -1,
        });
      },

      updateDraft: (updates) => {
        const { draftAction } = get();
        if (!draftAction) return;
        set({ draftAction: { ...draftAction, ...updates } as Action });
      },

      addParticipant: (participant) => {
        const { draftAction } = get();
        if (!draftAction) return;

        if (draftAction.type === "meeting") {
          set({
            draftAction: {
              ...draftAction,
              participants: [...draftAction.participants, participant],
            } as MeetingAction,
          });
        } else if (draftAction.type === "email") {
          set({
            draftAction: {
              ...draftAction,
              recipients: [...draftAction.recipients, participant],
            } as EmailAction,
          });
        }
      },

      removeParticipant: (participantId) => {
        const { draftAction } = get();
        if (!draftAction) return;

        if (draftAction.type === "meeting") {
          set({
            draftAction: {
              ...draftAction,
              participants: draftAction.participants.filter(
                (p) => p.id !== participantId,
              ),
            } as MeetingAction,
          });
        } else if (draftAction.type === "email") {
          set({
            draftAction: {
              ...draftAction,
              recipients: draftAction.recipients.filter(
                (p) => p.id !== participantId,
              ),
            } as EmailAction,
          });
        }
      },

      cycleRecipientType: (participantId) => {
        const { draftAction } = get();
        if (!draftAction || draftAction.type !== "email") return;

        const cycleOrder: RecipientType[] = ["to", "cc", "bcc"];

        const updatedRecipients = draftAction.recipients.map((p) => {
          if (p.id !== participantId) return p;

          const currentType = p.recipientType ?? "to";
          const currentIndex = cycleOrder.indexOf(currentType);
          const nextType = cycleOrder[(currentIndex + 1) % cycleOrder.length];

          return { ...p, recipientType: nextType };
        });

        set({
          draftAction: {
            ...draftAction,
            recipients: updatedRecipients,
          } as EmailAction,
        });
      },

      markCompleted: () => {
        const { draftAction } = get();
        if (!draftAction) return;
        finalizeAction(set, get, { ...draftAction, status: "completed" });
      },

      skipAction: () => {
        const { draftAction } = get();
        if (!draftAction) return;
        finalizeAction(set, get, { ...draftAction, status: "skipped" });
      },

      currentAction: () => {
        const { draftAction } = get();
        return draftAction;
      },

      remainingCount: () => {
        const { actions } = get();
        return actions.filter((a) => a.status === "pending").length;
      },
    }),
    {
      name: "review-actions-layout",
      partialize: (state) => ({ layout: state.layout }),
    },
  ),
);
