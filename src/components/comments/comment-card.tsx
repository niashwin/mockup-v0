import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Avatar } from "@components/ui/avatar";
import { cn } from "@lib/utils";
import { useCommentStore } from "@stores/comment-store";
import { springs } from "@lib/motion";
import type { CommentHighlight } from "@stores/comment-store";

interface CommentCardProps {
  highlight: CommentHighlight;
  isActive: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

type CardMode = "view" | "edit" | "delete";

export function CommentCard({
  highlight,
  isActive,
  onClick,
  style,
}: CommentCardProps) {
  const { updateComment, deleteHighlight } = useCommentStore();
  const [internalMode, setInternalMode] = useState<CardMode>("view");
  const [editText, setEditText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // When card is inactive, always show view mode
  const mode: CardMode = isActive ? internalMode : "view";
  const setMode = (newMode: CardMode) => {
    if (newMode === "view") {
      setEditText("");
    }
    setInternalMode(newMode);
  };

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (mode === "edit" && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [mode]);

  if (!highlight.comment) return null;

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditText(highlight.comment?.text ?? "");
    setMode("edit");
  };

  const cancelEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMode("view");
  };

  const saveEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (editText.trim()) {
      updateComment(highlight.id, editText.trim());
    }
    setMode("view");
  };

  const startDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMode("delete");
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMode("view");
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHighlight(highlight.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      cancelEdit();
    }
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      saveEdit();
    }
  };

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ opacity: 1, scale: 1 }}
      transition={springs.default}
      style={style}
      className={cn(
        "group absolute left-0 w-64 p-3 rounded-[var(--radius-lg)] cursor-pointer",
        "bg-sidebar border border-border shadow-sm",
        "transition-shadow duration-200",
      )}
    >
      {/* Hover/focus action icons - only in view mode */}
      {mode === "view" && (
        <div className="absolute top-2 right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <button
            onClick={startEdit}
            className={cn(
              "p-1.5 rounded text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
              "focus:outline-none focus:bg-muted focus:text-foreground",
            )}
            aria-label="Edit comment"
          >
            <HugeiconsIcon
              icon={PencilEdit01Icon}
              size={14}
              strokeWidth={1.5}
            />
          </button>
          <button
            onClick={startDelete}
            className={cn(
              "p-1.5 rounded text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
              "focus:outline-none focus:bg-muted focus:text-foreground",
            )}
            aria-label="Delete comment"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Header: avatar + name */}
      <div className="flex items-center gap-2 mb-2">
        <Avatar name={highlight.comment.userName} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-caption font-medium truncate">
            {highlight.comment.userName}
          </p>
        </div>
      </div>

      {/* Comment text OR edit textarea */}
      {mode === "edit" ? (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            aria-label="Edit comment text"
            className={cn(
              "w-full resize-none rounded-[var(--radius-md)] border border-border bg-background",
              "px-2 py-1.5 text-caption placeholder:text-muted-foreground caret-accent",
              "focus:outline-none focus:border-accent",
            )}
          />
          <div className="flex justify-end gap-1.5">
            <button
              onClick={cancelEdit}
              className={cn(
                "px-2.5 py-1 text-micro font-medium rounded",
                "text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
              )}
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              disabled={!editText.trim()}
              className={cn(
                "px-2.5 py-1 text-micro font-medium rounded",
                "bg-accent text-accent-foreground",
                "hover:bg-accent/90 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-caption">{highlight.comment.text}</p>
      )}

      {/* Delete confirmation overlay */}
      <AnimatePresence>
        {mode === "delete" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-foreground/85 dark:bg-foreground/90 rounded-[var(--radius-lg)] flex flex-col items-center justify-center gap-3 p-3 backdrop-blur-sm"
          >
            <p className="text-caption font-medium text-background">
              Delete this comment?
            </p>
            <div className="flex gap-2">
              <motion.button
                onClick={confirmDelete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springs.quick}
                className={cn(
                  "px-3 py-1.5 text-micro font-medium rounded-[var(--radius-md)]",
                  "bg-error text-white hover:bg-error/90 transition-colors",
                )}
              >
                Delete
              </motion.button>
              <motion.button
                onClick={cancelDelete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springs.quick}
                className={cn(
                  "px-3 py-1.5 text-micro font-medium rounded-[var(--radius-md)]",
                  "bg-background text-foreground hover:bg-muted hover:text-foreground transition-colors",
                )}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
