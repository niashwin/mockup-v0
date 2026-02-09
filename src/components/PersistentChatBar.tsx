import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, X, Sparkles, Loader2 } from "lucide-react";

/**
 * Persistent Chat Bar
 *
 * A floating search/chat bar at the bottom of the screen.
 * - Collapsed: Simple input bar
 * - Expanded: Shows conversation inline
 */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface PersistentChatBarProps {
  onOpenChat?: () => void; // Optional - for backwards compatibility
}

export function PersistentChatBar({ onOpenChat }: PersistentChatBarProps) {
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsExpanded(true);
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses = [
        "Based on your organizational memory, I found several relevant items. The Q3 launch KPIs discussion has been ongoing in the #strategy channel, with Marketing and Product still misaligned on targets.",
        "Looking at recent meetings and documents, the budget approval for the $50K ad spend is still pending CFO review. Finance flagged this in yesterday's update.",
        "I've searched your memory and found that the Lumen account escalation is the most urgent item - their CTO reached out directly about the missing audit exports.",
        "From the team discussions, it appears the mobile navigation redesign is ready for your review. Sarah completed the Figma updates yesterday.",
      ];

      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      if (messages.length === 0) {
        setIsExpanded(false);
      }
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setMessages([]);
    setInputValue("");
  };

  return (
    <motion.div
      layout
      className="fixed bottom-6 left-1/2 -translate-x-1/2"
      style={{
        width: "min(672px, calc(100vw - 48px))",
        zIndex: 99999,
      }}
    >
      <motion.div
        layout
        className={`
          bg-card dark:bg-primary
          border border-border
          shadow-xl shadow-primary/10 dark:shadow-black/40
          overflow-hidden
          ${isExpanded ? "rounded-2xl" : "rounded-full"}
        `}
      >
        {/* Expanded: Message History */}
        <AnimatePresence>
          {isExpanded && messages.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Sentra AI
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-muted dark:hover:bg-neutral-800 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="max-h-64 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-[85%] px-3 py-2 rounded-[7px] text-sm leading-relaxed
                        ${
                          message.role === "user"
                            ? "bg-primary dark:bg-muted text-white dark:text-foreground"
                            : "bg-muted dark:bg-neutral-800 text-foreground"
                        }
                      `}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-[7px] bg-muted dark:bg-neutral-800 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Searching memory...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <div className="flex items-center h-14 px-5 gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Sentra anything..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />

          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors shrink-0 bg-accent text-white hover:bg-accent/90 disabled:bg-muted disabled:dark:bg-neutral-800 disabled:text-muted-foreground"
            aria-label="Submit"
          >
            <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PersistentChatBar;
