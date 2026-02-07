import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Search, X, Sparkles, Loader2 } from 'lucide-react';

/**
 * Persistent Chat Bar
 *
 * A floating search/chat bar at the bottom of the screen.
 * - Collapsed: Simple input bar
 * - Expanded: Shows conversation inline
 */

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface PersistentChatBarProps {
  onOpenChat?: () => void; // Optional - for backwards compatibility
}

export function PersistentChatBar({ onOpenChat }: PersistentChatBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      role: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsExpanded(true);
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses = [
        "Based on your organizational memory, I found several relevant items. The Q3 launch KPIs discussion has been ongoing in the #strategy channel, with Marketing and Product still misaligned on targets.",
        "Looking at recent meetings and documents, the budget approval for the $50K ad spend is still pending CFO review. Finance flagged this in yesterday's update.",
        "I've searched your memory and found that the Lumen account escalation is the most urgent item - their CTO reached out directly about the missing audit exports.",
        "From the team discussions, it appears the mobile navigation redesign is ready for your review. Sarah completed the Figma updates yesterday."
      ];

      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      if (messages.length === 0) {
        setIsExpanded(false);
      }
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setMessages([]);
    setInputValue('');
  };

  return (
    <motion.div
      layout
      className="fixed bottom-6 left-1/2 -translate-x-1/2"
      style={{
        width: isExpanded ? 'min(600px, calc(100vw - 48px))' : 'min(480px, calc(100vw - 80px))',
        zIndex: 99999
      }}
    >
      <motion.div
        layout
        className={`
          bg-white dark:bg-zinc-900
          border border-zinc-200 dark:border-zinc-700
          shadow-xl shadow-zinc-900/10 dark:shadow-black/40
          overflow-hidden
          ${isExpanded ? 'rounded-2xl' : 'rounded-full'}
        `}
      >
        {/* Expanded: Message History */}
        <AnimatePresence>
          {isExpanded && messages.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-zinc-100 dark:border-zinc-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Sentra AI</span>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="max-h-64 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed
                        ${message.role === 'user'
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
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
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
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
        <div className="flex items-center h-11 px-4 gap-3">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Sentra anything..."
            className="flex-1 bg-transparent text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
          />

          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            className={`
              flex items-center justify-center w-7 h-7 rounded-full transition-colors shrink-0
              ${inputValue.trim() && !isLoading
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
              }
            `}
            aria-label="Submit"
          >
            <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PersistentChatBar;
