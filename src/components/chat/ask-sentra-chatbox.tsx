import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mic01Icon,
  AttachmentIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { useChatboxStore } from "@stores/chatbox-store";
import { springs } from "@lib/motion";
import { cn } from "@lib/utils";
import { ChatMessage } from "./chat-message";
import { ThinkingIndicator } from "./thinking-indicator";

const HEIGHTS = {
  collapsed: 52,
  expanded: 52,
  chat: 420,
};

export function AskSentraChatbox() {
  const {
    state,
    messages,
    inputValue,
    isTyping,
    loadingPhase,
    loadingContext,
    collapse,
    setInputValue,
    sendMessage,
    contactContext,
    clearContactContext,
  } = useChatboxStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (state === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, state]);

  // Handle click outside - collapse only from chat mode
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        collapse();
      }
    }

    if (state === "chat") {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [state, collapse]);

  // Handle escape key - collapse only from chat mode
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && state === "chat") {
        collapse();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state, collapse]);

  const handleSubmit = useCallback(() => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  }, [inputValue, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const isChat = state === "chat";

  const content = (
    <motion.div
      ref={containerRef}
      initial={{ height: HEIGHTS.collapsed, opacity: 0, y: 20 }}
      animate={{
        height: isChat ? HEIGHTS.chat : HEIGHTS.collapsed,
        opacity: 1,
        y: 0,
      }}
      transition={springs.default}
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "w-[min(640px,calc(100vw-48px))]",
        "bg-surface-elevated border border-border shadow-float",
        "flex flex-col justify-end overflow-hidden",
        isChat ? "rounded-3xl" : "rounded-full",
      )}
      role="dialog"
      aria-expanded={isChat}
      aria-label="Ask Sentra chat"
    >
      {/* Chat Mode: Messages area */}
      <AnimatePresence>
        {isChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLatest={index === messages.length - 1}
              />
            ))}
            {isTyping && messages[messages.length - 1]?.role === "user" && (
              <ThinkingIndicator
                phase={loadingPhase}
                context={loadingContext}
              />
            )}
            <div ref={messagesEndRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact context indicator */}
      {contactContext && (
        <div className="px-4 pb-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
            <span className="text-xs text-accent font-medium">
              Asking about: {contactContext.contactName}
            </span>
            <button
              onClick={clearContactContext}
              className="text-accent/60 hover:text-accent transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {/* Input area — always looks the same in collapsed/expanded */}
      <div
        className={cn(
          "flex items-center h-[52px] shrink-0 px-5 gap-3",
          isChat && "border-t border-border-subtle",
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            contactContext
              ? `Ask about ${contactContext.contactName}...`
              : isChat
                ? "Type a message..."
                : "Ask Sentra anything..."
          }
          style={{ outline: "none", boxShadow: "none" }}
          className={cn(
            "flex-1 bg-transparent text-ui text-foreground",
            "placeholder:text-muted-foreground/50",
            "[&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-none",
            "outline-none ring-0 border-none",
          )}
        />

        {/* Arrow submit button — always visible when not in chat mode */}
        {!isChat && (
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center size-8 rounded-full bg-accent text-white hover:bg-accent/80 transition-colors shrink-0 -mr-1"
            aria-label="Submit"
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="13" x2="8" y2="3" />
              <polyline points="3,7 8,2 13,7" />
            </svg>
          </button>
        )}

        {/* Chat mode: action buttons */}
        {isChat && (
          <div className="flex items-center gap-1">
            <button
              className={cn(
                "px-2 py-1 rounded-[var(--radius-lg)] text-muted-foreground",
                "hover:bg-muted hover:text-foreground transition-colors",
              )}
              aria-label="Auto"
            >
              <span className="text-caption font-medium">Auto</span>
            </button>
            <button
              className={cn(
                "p-1.5 rounded-[var(--radius-lg)] text-muted-foreground",
                "hover:bg-muted hover:text-foreground transition-colors",
              )}
              aria-label="Attach file"
            >
              <HugeiconsIcon
                icon={AttachmentIcon}
                size={16}
                strokeWidth={1.5}
              />
            </button>
            <button
              className={cn(
                "p-1.5 rounded-[var(--radius-lg)] text-muted-foreground",
                "hover:bg-muted hover:text-foreground transition-colors",
              )}
              aria-label="Voice input"
            >
              <HugeiconsIcon icon={Mic01Icon} size={16} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  return createPortal(content, document.body);
}
