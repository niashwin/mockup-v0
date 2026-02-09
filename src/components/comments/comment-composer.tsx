import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Avatar } from "@components/ui/avatar";
import { cn } from "@lib/utils";

interface CommentComposerProps {
  userName: string;
  selectedText: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

export function CommentComposer({
  userName,
  selectedText,
  onSubmit,
  onCancel,
}: CommentComposerProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      className="p-4 space-y-3"
    >
      {/* Selected text preview */}
      <div className="bg-accent/10 rounded-[var(--radius-md)] p-2.5 border-l-2 border-accent">
        <p className="text-xs text-muted-foreground line-clamp-2">
          "{selectedText}"
        </p>
      </div>

      {/* Avatar + name row (Google Docs style) */}
      <div className="flex items-center gap-2.5">
        <Avatar name={userName} size="md" />
        <span className="text-sm font-medium">{userName}</span>
      </div>

      {/* Pill-shaped input */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Comment or add others with @"
        rows={1}
        className={cn(
          "w-full resize-none rounded-full border border-accent bg-background",
          "px-4 py-2 text-sm placeholder:text-muted-foreground caret-accent",
          "focus:outline-none focus:border-accent",
        )}
      />

      {/* Actions - clickable buttons with hover states */}
      <div className="flex justify-end items-center gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-full hover:bg-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-full",
            "bg-accent text-accent-foreground",
            "hover:bg-accent/90 transition-colors",
            "disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          Comment
        </button>
      </div>
    </motion.div>
  );
}
