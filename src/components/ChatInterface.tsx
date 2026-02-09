import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  Sparkles,
  Search,
  FileText,
  MessageSquare,
  Users,
  Clock,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Array<{ title: string; type: string }>;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const starterPrompts = [
  {
    icon: Sparkles,
    text: "What did we decide about Q3 priorities?",
    category: "Decisions",
  },
  {
    icon: Users,
    text: "Who is working on the mobile app?",
    category: "People",
  },
  { icon: Clock, text: "Summarize last week's meetings", category: "Meetings" },
  {
    icon: FileText,
    text: "Show me recent design system updates",
    category: "Documents",
  },
];

// Mock AI response generator
const generateMockResponse = (
  query: string,
): { content: string; sources: Array<{ title: string; type: string }> } => {
  const lowerQuery = query.toLowerCase();

  if (
    lowerQuery.includes("q3") ||
    lowerQuery.includes("priorities") ||
    lowerQuery.includes("decide")
  ) {
    return {
      content: `Based on recent discussions and documentation, here are the key Q3 priorities:

• **Product Market Fit**: Focus on validating core value proposition with target users. Target: 10k active users by end of quarter.

• **Platform Stability**: Achieve 95% uptime across all services. This includes infrastructure improvements and monitoring enhancements.

• **Feature Launches**: Ship three major features:
  - Mobile app beta release
  - Advanced search with AI-powered suggestions
  - Team collaboration tools

• **User Acquisition**: Launch marketing campaign targeting enterprise teams. Goal: 500 new team sign-ups.

The leadership team aligned on these priorities during the Q3 kickoff meeting, with Sarah Chen leading product initiatives and Mike Johnson overseeing engineering execution.`,
      sources: [
        { title: "Q3 OKRs Dashboard", type: "document" },
        { title: "Leadership Kickoff Meeting", type: "meeting" },
        { title: "#strategy channel", type: "slack" },
      ],
    };
  }

  if (lowerQuery.includes("mobile") || lowerQuery.includes("app")) {
    return {
      content: `The mobile app team currently consists of:

• **Sarah Chen** (Product Lead): Defining feature scope and user requirements. Leading beta testing program with 50 internal users.

• **Mike Johnson** (Engineering Lead): Architecting the React Native codebase and offline sync capabilities.

• **Emma Davis** (Design): Creating the mobile design system and interaction patterns.

• **Alex Rivera** (Backend): Building API endpoints for mobile-specific features like push notifications.

The team meets every Tuesday for sprint planning and is currently focusing on offline mode and quick capture workflows. Beta launch is targeted for end of Q3.`,
      sources: [
        { title: "Mobile Roadmap Q3-Q4", type: "document" },
        { title: "Team Roster", type: "document" },
        { title: "Tuesday Sprint Planning", type: "meeting" },
      ],
    };
  }

  if (lowerQuery.includes("meeting") || lowerQuery.includes("last week")) {
    return {
      content: `Here's a summary of key meetings from last week:

• **Monday: Product Sync** (9:00 AM)
  - Reviewed user feedback from recent beta testing
  - Decided to prioritize search improvements over new features
  - Action items assigned to Sarah and Emma

• **Tuesday: Engineering Standup** (10:00 AM)
  - Mobile app progress: 75% complete
  - Discussed API performance issues, resolved by Thursday
  - Security audit scheduled for next sprint

• **Thursday: All-Hands** (2:00 PM)
  - CEO presented Q3 goals and vision alignment
  - Celebrated reaching 8k active users milestone
  - Q&A session about upcoming org changes

• **Friday: Design Review** (11:00 AM)
  - Reviewed mobile design system components
  - Approved new iconography for memory stream
  - Planning user study for next month`,
      sources: [
        { title: "Product Sync Notes", type: "meeting" },
        { title: "Engineering Standup", type: "meeting" },
        { title: "All-Hands Recording", type: "video" },
      ],
    };
  }

  if (lowerQuery.includes("design") || lowerQuery.includes("system")) {
    return {
      content: `Recent design system updates include:

• **Mobile Components**: Emma shipped 15 new mobile-optimized components including bottom sheets, floating action buttons, and mobile navigation patterns.

• **Icon Library Expansion**: Added 50+ new icons from Lucide with consistent 1.5px stroke width to match our calm aesthetic.

• **Glassmorphism Guidelines**: Documented our approach to glass effects including backdrop blur values, opacity ranges, and border treatments for light/dark modes.

• **Typography Scale**: Refined type scale with better mobile-first sizing. All components now use semantic size tokens.

• **Color Tokens**: Expanded zinc-based palette with semantic color naming for alerts, success states, and interactive elements.

The design system is now used across web and mobile with 95% component consistency.`,
      sources: [
        { title: "Design System Changelog", type: "document" },
        { title: "Figma: DS Components", type: "design" },
        { title: "#design channel", type: "slack" },
      ],
    };
  }

  // Default response
  return {
    content: `I found some relevant information about "${query}":

• Based on recent organizational activity, this topic has been discussed across multiple channels and meetings.

• Key stakeholders include Sarah Chen, Mike Johnson, and Emma Davis who have been actively involved in related initiatives.

• There are several documents and Slack conversations that mention this topic. The most recent activity was within the past week.

• For more detailed information, you might want to explore the Memory Stream or check specific swimlanes related to this area.

Would you like me to help you find something more specific?`,
    sources: [
      { title: "Recent Activity", type: "system" },
      { title: "Team Updates", type: "slack" },
    ],
  };
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = generateMockResponse(inputValue);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleStarterPromptClick = (promptText: string) => {
    setInputValue(promptText);
    inputRef.current?.focus();
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return Clock;
      case "document":
        return FileText;
      case "slack":
        return MessageSquare;
      default:
        return FileText;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-50"
          />

          {/* Chat Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-3xl h-[80vh] bg-card/95 dark:bg-neutral-900/95 backdrop-blur-3xl border border-white/60 dark:border-white/10 shadow-2xl shadow-black/20 rounded-[2rem] overflow-hidden flex flex-col pointer-events-auto">
              {/* Header */}
              <div className="shrink-0 px-8 py-6 border-b border-border bg-gradient-to-b from-white/50 to-transparent dark:from-neutral-900/50 relative">
                {/* Decorative gradient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/[0.02] rounded-full blur-3xl pointer-events-none" />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[7px] bg-gradient-to-br from-accent/20 to-accent/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg flex items-center justify-center">
                      <Sparkles
                        size={20}
                        className="text-accent"
                        strokeWidth={2}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        Ask Sentra
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Your AI organizational memory assistant
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-[7px] bg-muted dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-sm hover:shadow"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">
                {messages.length === 0 ? (
                  /* Empty State with Starter Prompts */
                  <div className="h-full flex flex-col items-center justify-center space-y-8">
                    <div className="text-center max-w-md">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg flex items-center justify-center mx-auto mb-4">
                        <Search
                          size={28}
                          className="text-accent"
                          strokeWidth={1.5}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        What can I help you with?
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Ask me anything about your organization's memory. I can
                        help you find decisions, people, meetings, and
                        documents.
                      </p>
                    </div>

                    {/* Starter Prompts */}
                    <div className="w-full max-w-2xl grid grid-cols-2 gap-3">
                      {starterPrompts.map((prompt, idx) => {
                        const Icon = prompt.icon;
                        return (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() =>
                              handleStarterPromptClick(prompt.text)
                            }
                            className="group p-4 bg-background dark:bg-neutral-800/50 hover:bg-card dark:hover:bg-neutral-800 border border-border hover:border-border rounded-2xl transition-all text-left hover:shadow-lg"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-[7px] bg-muted dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800 flex items-center justify-center transition-colors shrink-0">
                                <Icon
                                  size={14}
                                  className="text-muted-foreground"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  {prompt.category}
                                </p>
                                <p className="text-sm text-foreground leading-snug">
                                  {prompt.text}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Messages */
                  <>
                    {messages.map((message, idx) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.type === "user" ? (
                          /* User Message */
                          <div className="max-w-[75%] bg-primary dark:bg-muted text-white dark:text-foreground rounded-2xl px-5 py-3 shadow-lg">
                            <p className="text-sm leading-relaxed">
                              {message.content}
                            </p>
                          </div>
                        ) : (
                          /* Assistant Message */
                          <div className="max-w-[85%] space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-[7px] bg-gradient-to-br from-accent/20 to-accent/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg flex items-center justify-center shrink-0">
                                <Sparkles size={14} className="text-accent" />
                              </div>
                              <div className="flex-1 bg-background dark:bg-neutral-800/50 border border-border rounded-2xl px-5 py-4 shadow-sm">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                  {message.content
                                    .split("\n")
                                    .map((line, i) => {
                                      if (line.trim().startsWith("•")) {
                                        return (
                                          <div
                                            key={i}
                                            className="flex gap-2 mb-2"
                                          >
                                            <span className="text-accent shrink-0">
                                              •
                                            </span>
                                            <span className="text-sm text-foreground leading-relaxed">
                                              {line.substring(1).trim()}
                                            </span>
                                          </div>
                                        );
                                      }
                                      return line.trim() ? (
                                        <p
                                          key={i}
                                          className="text-sm text-foreground leading-relaxed mb-3 last:mb-0"
                                        >
                                          {line}
                                        </p>
                                      ) : (
                                        <div key={i} className="h-2" />
                                      );
                                    })}
                                </div>
                              </div>
                            </div>

                            {/* Sources */}
                            {message.sources && message.sources.length > 0 && (
                              <div className="ml-11 space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                  Sources
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {message.sources.map((source, idx) => {
                                    const SourceIcon = getSourceIcon(
                                      source.type,
                                    );
                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-card dark:bg-neutral-800 border border-border rounded-[7px] text-xs text-muted-foreground hover:border-border transition-colors cursor-pointer"
                                      >
                                        <SourceIcon size={12} />
                                        <span>{source.title}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-[7px] bg-gradient-to-br from-accent/20 to-accent/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg flex items-center justify-center">
                          <Sparkles
                            size={14}
                            className="text-accent animate-pulse"
                          />
                        </div>
                        <div className="flex gap-1.5 bg-background dark:bg-neutral-800/50 border border-border rounded-2xl px-5 py-4">
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="shrink-0 px-8 py-6 border-t border-border bg-gradient-to-t from-white/50 to-transparent dark:from-neutral-900/50">
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-3"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything about your organization..."
                    className="flex-1 bg-card dark:bg-neutral-800 border border-border rounded-2xl px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="w-12 h-12 rounded-[7px] bg-primary dark:bg-muted hover:bg-foreground dark:hover:bg-neutral-200 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 text-white dark:text-foreground disabled:text-muted-foreground flex items-center justify-center transition-all shadow-lg hover:shadow-xl disabled:shadow-none hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </form>
                <p className="text-[10px] text-muted-foreground text-center mt-3">
                  Sentra AI can make mistakes. Verify important information.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
