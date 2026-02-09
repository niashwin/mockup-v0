import { useState } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { chatMessageVariants } from "@lib/motion";
import { cn } from "@lib/utils";
import { TypingText } from "./typing-text";
import { PRDMessage } from "./prd-message";
import type { Message } from "@stores/chatbox-store";

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
  onTypingComplete?: () => void;
}

// Parse simple markdown: **bold**, bullet points (•), newlines
function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim();

    // Check if it's a bullet point
    if (trimmedLine.startsWith("•") || trimmedLine.startsWith("-")) {
      const bulletContent = trimmedLine.replace(/^[•-]\s*/, "");
      elements.push(
        <div key={lineIndex} className="flex gap-2 items-start ml-1">
          <span className="text-accent mt-0.5">•</span>
          <span>{parseBold(bulletContent)}</span>
        </div>,
      );
    } else if (trimmedLine === "") {
      // Empty line - add spacing
      elements.push(<div key={lineIndex} className="h-2" />);
    } else {
      // Regular paragraph
      elements.push(<div key={lineIndex}>{parseBold(trimmedLine)}</div>);
    }
  });

  return elements;
}

// Parse **bold** text
function parseBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function ChatMessage({
  message,
  isLatest = false,
  onTypingComplete,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const shouldAnimate = isLatest && !isUser;
  const [isExpanded, setIsExpanded] = useState(true);

  // User message - simple bubble
  if (isUser) {
    return (
      <motion.div
        variants={chatMessageVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-end"
      >
        <div
          className={cn(
            "max-w-[80%] px-4 py-2.5 text-ui",
            "bg-accent text-accent-foreground rounded-2xl rounded-br-md",
          )}
        >
          <span>{message.content}</span>
        </div>
      </motion.div>
    );
  }

  // PRD message - special rendering with sources and actions
  if (message.prdMetadata) {
    return (
      <motion.div
        variants={chatMessageVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-start w-full"
      >
        <div className="w-full">
          {/* Thought header */}
          {message.thinkingTime !== undefined && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "flex items-center gap-1 mb-2",
                "text-caption text-muted-foreground",
                "hover:text-foreground transition-colors cursor-pointer",
              )}
            >
              <span>Thought for {message.thinkingTime}s</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={12}
                className={cn(
                  "transition-transform",
                  isExpanded && "rotate-90",
                )}
              />
            </button>
          )}
          <PRDMessage
            content={message.content}
            metadata={message.prdMetadata}
            animate={isLatest}
          />
        </div>
      </motion.div>
    );
  }

  // Assistant message - with "Thought for Xs" header and formatted content
  return (
    <motion.div
      variants={chatMessageVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-start"
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl rounded-bl-md",
          "bg-surface text-foreground",
        )}
      >
        {/* Thought header */}
        {message.thinkingTime !== undefined && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "flex items-center gap-1 px-4 pt-3 pb-1",
              "text-caption text-muted-foreground",
              "hover:text-foreground transition-colors cursor-pointer",
            )}
          >
            <span>Thought for {message.thinkingTime}s</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={12}
              className={cn("transition-transform", isExpanded && "rotate-90")}
            />
          </button>
        )}

        {/* Message content */}
        <div
          className={cn(
            "px-4 pb-3 text-body leading-relaxed",
            !message.thinkingTime && "pt-3",
          )}
        >
          {shouldAnimate ? (
            <TypingText
              text={message.content}
              speed={15}
              onComplete={onTypingComplete}
              renderContent={(text) => (
                <div className="space-y-1.5">{parseMarkdown(text)}</div>
              )}
            />
          ) : (
            <div className="space-y-1.5">{parseMarkdown(message.content)}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
