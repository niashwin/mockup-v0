import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, AtSign, MessageCircle } from "lucide-react";
import {
  CollaborationComment,
  CollaborationThread as ThreadType,
} from "../types";

interface CollaborationThreadProps {
  thread?: ThreadType;
  participants?: string[];
  onAddComment?: (content: string, mentions: string[]) => void;
  isExpanded?: boolean;
}

// Helper to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Helper to get relative time
const getRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Avatar colors based on name hash
const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-pink-500",
  ];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const CollaborationThread: React.FC<CollaborationThreadProps> = ({
  thread,
  participants = [],
  onAddComment,
  isExpanded = true,
}) => {
  const [newComment, setNewComment] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const comments = thread?.comments || [];
  const hasComments = comments.length > 0;

  // Filter participants for @mention autocomplete
  const filteredParticipants = participants.filter((p) =>
    p.toLowerCase().includes(mentionFilter.toLowerCase()),
  );

  // Handle input change and detect @mentions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewComment(value);

    // Check for @mention trigger
    const lastAtIndex = value.lastIndexOf("@");
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      setShowMentions(true);
      setMentionFilter("");
    } else if (lastAtIndex !== -1) {
      const afterAt = value.slice(lastAtIndex + 1);
      if (!afterAt.includes(" ")) {
        setShowMentions(true);
        setMentionFilter(afterAt);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  // Handle selecting a mention
  const handleSelectMention = (name: string) => {
    const lastAtIndex = newComment.lastIndexOf("@");
    const newValue = newComment.slice(0, lastAtIndex) + `@${name} `;
    setNewComment(newValue);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  // Handle submitting a comment
  const handleSubmit = () => {
    if (!newComment.trim() || !onAddComment) return;

    // Extract mentions from comment
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(newComment)) !== null) {
      mentions.push(match[1]);
    }

    onAddComment(newComment.trim(), mentions);
    setNewComment("");
    setShowMentions(false);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isExpanded) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MessageCircle size={14} />
        <span>
          {hasComments ? `${comments.length} comments` : "Start a thread"}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Thread Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <MessageCircle size={14} />
          Thread {hasComments && `(${comments.length})`}
        </h3>
        {isTyping && (
          <span className="text-xs text-muted-foreground animate-pulse">
            Someone is typing...
          </span>
        )}
      </div>

      {/* Comments List */}
      {hasComments ? (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full ${getAvatarColor(comment.authorName)} flex items-center justify-center shrink-0`}
                >
                  {comment.authorAvatar ? (
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-medium text-white">
                      {getInitials(comment.authorName)}
                    </span>
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {comment.authorName}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {getRelativeTime(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 break-words">
                    {comment.content.split(/(@\w+)/g).map((part, i) => {
                      if (part.startsWith("@")) {
                        return (
                          <span
                            key={i}
                            className="text-blue-600 dark:text-blue-400 font-medium"
                          >
                            {part}
                          </span>
                        );
                      }
                      return part;
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            No comments yet. Start the conversation.
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="relative">
        {/* Mention Autocomplete */}
        <AnimatePresence>
          {showMentions && filteredParticipants.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-full left-0 right-0 mb-2 bg-card dark:bg-neutral-800 border border-border rounded-[7px] shadow-lg overflow-hidden z-10"
            >
              {filteredParticipants.slice(0, 5).map((participant) => (
                <button
                  key={participant}
                  onClick={() => handleSelectMention(participant)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-background dark:hover:bg-neutral-800/50 transition-colors text-left"
                >
                  <div
                    className={`w-6 h-6 rounded-full ${getAvatarColor(participant)} flex items-center justify-center`}
                  >
                    <span className="text-[10px] font-medium text-white">
                      {getInitials(participant)}
                    </span>
                  </div>
                  <span className="text-sm text-foreground">{participant}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Field */}
        <div className="flex items-center gap-2 bg-background dark:bg-neutral-800/50 border border-border rounded-[7px] px-3 py-2">
          <button
            onClick={() => {
              setNewComment(newComment + "@");
              setShowMentions(true);
              inputRef.current?.focus();
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <AtSign size={16} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className={`p-1.5 rounded-[7px] transition-colors ${
              newComment.trim()
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-neutral-200 dark:bg-neutral-800 text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationThread;
