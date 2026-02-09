import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CommentComposer } from "./comment-composer";
import { useCommentStore } from "@stores/comment-store";
import { cn } from "@lib/utils";

interface CommentPanelProps {
  reportId: string;
  userName: string;
  userId: string;
}

export function CommentPanel({
  reportId,
  userName,
  userId,
}: CommentPanelProps) {
  const { pendingSelection, isComposerOpen, closeComposer, addComment } =
    useCommentStore();
  const panelRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    if (!isComposerOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeComposer();
      }
    };

    // Delay to prevent immediate close from the selection mouseup event
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isComposerOpen, closeComposer]);

  const handleSubmit = (text: string) => {
    addComment(text, userName, userId, reportId);
  };

  return (
    <AnimatePresence>
      {isComposerOpen && pendingSelection && (
        <motion.div
          ref={panelRef}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          className={cn(
            "shrink-0 border-l border-border bg-sidebar overflow-hidden",
          )}
        >
          <div className="w-80">
            <CommentComposer
              userName={userName}
              selectedText={pendingSelection.text}
              onSubmit={handleSubmit}
              onCancel={closeComposer}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
