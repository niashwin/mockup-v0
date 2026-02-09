import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useReviewActionsStore } from "@stores/review-actions-store";
import { modalContentVariants, springs } from "@lib/motion";
import { ReviewActionsHeader } from "./review-actions-header";
import { Button } from "@components/ui/button";
import { SplitPanelLayout } from "./layouts";
import { isEmailAction, isMeetingAction } from "@types/action";

export function ReviewActionsModal() {
  const {
    isOpen,
    closeModal,
    markCompleted,
    draftAction,
    updateDraft,
    addParticipant,
    removeParticipant,
    cycleRecipientType,
  } = useReviewActionsStore();

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    },
    [closeModal],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  // Focus trap - focus first focusable element when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const modal = document.getElementById("review-actions-modal");
        const firstFocusable = modal?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        firstFocusable?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
            onClick={closeModal}
          />

          {/* Modal container */}
          <div
            id="review-actions-modal"
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-actions-title"
          >
            {/* Modal content */}
            <motion.div
              className="relative w-full mx-4 bg-surface-elevated rounded-xl shadow-float border border-border pointer-events-auto max-w-3xl"
              variants={modalContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={springs.default}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <ReviewActionsHeader />

              {/* Content */}
              <div className="px-8 py-6 min-h-[420px]">
                {draftAction &&
                  (isEmailAction(draftAction) ||
                    isMeetingAction(draftAction)) && (
                    <SplitPanelLayout
                      action={draftAction}
                      onUpdateDraft={updateDraft}
                      onAddParticipant={addParticipant}
                      onRemoveParticipant={removeParticipant}
                      onCycleRecipientType={cycleRecipientType}
                    />
                  )}
                {!draftAction && (
                  <div className="flex items-center justify-center h-full text-modal-ui text-muted-foreground">
                    No actions to review
                  </div>
                )}
              </div>

              {/* Footer - Confirm only, no Skip */}
              <div className="flex items-center justify-end px-8 py-4 border-t border-border-subtle">
                <Button
                  variant="default"
                  size="md"
                  className="h-9 px-5 text-modal-ui"
                  onClick={markCompleted}
                  disabled={!draftAction}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
