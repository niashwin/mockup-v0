import { create } from "zustand";
import type { PRDSourceContext } from "@types/sources";

export type ChatboxState = "collapsed" | "expanded" | "chat";

export type LoadingPhase = "reading" | "analyzing" | "complete";

export interface PRDMetadata {
  type: "prd";
  label: string;
  slackUrl: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  thinkingTime?: number;
  prdMetadata?: PRDMetadata;
}

interface ChatboxStore {
  state: ChatboxState;
  messages: Message[];
  inputValue: string;
  isTyping: boolean;
  loadingPhase: LoadingPhase | null;
  loadingContext: string | null;
  thinkingStartTime: number | null;
  contactContext: { contactId: string; contactName: string } | null;

  // Actions
  expand: () => void;
  collapse: () => void;
  enterChatMode: () => void;
  setInputValue: (value: string) => void;
  sendMessage: (content: string) => void;
  setContactContext: (
    context: { contactId: string; contactName: string } | null,
  ) => void;
  clearContactContext: () => void;
  addAssistantMessage: (
    content: string,
    thinkingTime?: number,
    prdMetadata?: PRDMetadata,
  ) => void;
  setIsTyping: (typing: boolean) => void;
  setLoadingPhase: (phase: LoadingPhase | null, context?: string) => void;
  clearMessages: () => void;
  triggerPRDGeneration: (
    sourceContext: PRDSourceContext,
    prompt: string,
  ) => void;
}

const HARDCODED_RESPONSE = `**We just closed Softbank!** Thanks to Al and Andrey for making this happen.

- They're looking to expand their partnership
- Book another session next quarter to discuss Series B strategy
- Consider preparing a deck for the follow-up meeting

Would you like me to draft an agenda for the next session?`;

const CONTACT_HARDCODED_RESPONSE = (
  name: string,
) => `Here's what I know about **${name}**:

- You've had 5 interactions over the past 3 months
- Last met at the quarterly review on January 15th
- Key topics discussed: product roadmap, Q1 targets, hiring plans
- They mentioned interest in expanding the partnership scope

Would you like me to draft a follow-up email or prep notes for your next meeting?`;

const HARDCODED_PRD = `## Cross-Team Collaboration Tool

### Problem Statement

Based on discussions across 4 meetings, 12 Slack threads, and 2 documents, teams need better async collaboration tools for distributed work. Key pain points include:

- **Communication Silos**: Information scattered across multiple channels
- **Meeting Overload**: Too many sync meetings for simple updates
- **Context Loss**: New team members struggle to catch up on decisions

### Requirements

**1. Real-time Notifications**
- Push notifications for @mentions and direct messages
- Configurable quiet hours per user timezone
- Email digest for missed messages (daily/weekly)

**2. Threaded Discussions**
- Nested replies with proper threading
- Cross-link to related Linear issues
- Automatic meeting note summaries

**3. Search & Discovery**
- Full-text search across all channels
- Filter by date, author, channel, and tags
- AI-powered "related discussions" suggestions

### Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Team adoption | 80% | Q1 2026 |
| Notification latency | <2s | Launch |
| Meeting time reduction | 30% | Q2 2026 |

### Next Steps

1. **Design Review** — Schedule for Feb 15
2. **Engineering Kickoff** — Target Feb 20
3. **Beta Launch** — March 1 internal pilot`;

export const useChatboxStore = create<ChatboxStore>((set, get) => ({
  state: "collapsed",
  messages: [],
  inputValue: "",
  isTyping: false,
  loadingPhase: null,
  loadingContext: null,
  thinkingStartTime: null,
  contactContext: null,

  expand: () => set({ state: "expanded" }),

  collapse: () => set({ state: "collapsed" }),

  enterChatMode: () => set({ state: "chat" }),

  setInputValue: (value: string) => set({ inputValue: value }),

  setContactContext: (context) => set({ contactContext: context }),
  clearContactContext: () => set({ contactContext: null }),

  sendMessage: (content: string) => {
    if (!content.trim()) return;

    const { contactContext } = get();

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const startTime = Date.now();

    set((state) => ({
      messages: [...state.messages, userMessage],
      inputValue: "",
      state: "chat",
      isTyping: true,
      loadingPhase: "reading",
      loadingContext: null,
      thinkingStartTime: startTime,
    }));

    // Phase 1: Reading (after 800ms, show context)
    setTimeout(() => {
      set({
        loadingPhase: "analyzing",
        loadingContext: contactContext
          ? `${contactContext.contactName}'s history`
          : "product launch momentum",
      });
    }, 800);

    // Phase 2: Complete and show response
    setTimeout(() => {
      const thinkingTime = Math.round((Date.now() - startTime) / 1000);
      const response = contactContext
        ? CONTACT_HARDCODED_RESPONSE(contactContext.contactName)
        : HARDCODED_RESPONSE;
      get().addAssistantMessage(response, thinkingTime);
    }, 2500);
  },

  addAssistantMessage: (
    content: string,
    thinkingTime?: number,
    prdMetadata?: PRDMetadata,
  ) => {
    const assistantMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content,
      timestamp: new Date(),
      thinkingTime,
      prdMetadata,
    };

    set((state) => ({
      messages: [...state.messages, assistantMessage],
      isTyping: false,
      loadingPhase: null,
      loadingContext: null,
      thinkingStartTime: null,
    }));
  },

  setIsTyping: (typing: boolean) => set({ isTyping: typing }),

  setLoadingPhase: (phase: LoadingPhase | null, context?: string) =>
    set({ loadingPhase: phase, loadingContext: context ?? null }),

  clearMessages: () =>
    set({
      messages: [],
      state: "collapsed",
      loadingPhase: null,
      loadingContext: null,
      thinkingStartTime: null,
      contactContext: null,
    }),

  triggerPRDGeneration: (sourceContext: PRDSourceContext, prompt: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };

    const startTime = Date.now();

    set({
      state: "chat",
      messages: [userMessage],
      inputValue: "",
      isTyping: true,
      loadingPhase: "reading",
      loadingContext: null,
      thinkingStartTime: startTime,
    });

    // Phase 1: Show what we're pulling from
    setTimeout(() => {
      set({
        loadingPhase: "analyzing",
        loadingContext: `pulling from ${sourceContext.meetings} meetings, ${sourceContext.slackThreads} Slack threads, ${sourceContext.documents} docs`,
      });
    }, 800);

    // Phase 2: Complete and show PRD
    setTimeout(() => {
      const thinkingTime = Math.round((Date.now() - startTime) / 1000);
      get().addAssistantMessage(HARDCODED_PRD, thinkingTime, {
        type: "prd",
        label: "PRD from real discussion",
        slackUrl:
          "https://sentra-app.slack.com/archives/C0ABA6NP64F/p1769975111239039",
      });
    }, 3500);
  },
}));
