import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Search,
  Download,
  Share2,
  Play,
  Pause,
  FastForward,
  Rewind,
  MessageSquare,
  Clock,
  Users,
  CheckCircle2,
  Video,
} from "lucide-react";

interface TranscriptEntry {
  id: string;
  speaker: string;
  time: string;
  text: string;
  isActionItem?: boolean;
  isDecision?: boolean;
  isCommitment?: boolean;
  isRisk?: boolean;
}

interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
  transcriptTimestamp?: string;
}

interface Highlight {
  id: string;
  text: string;
  speaker: string;
  timestamp: string;
  category: "decision" | "commitment" | "risk" | "insight";
}

const MOCK_TRANSCRIPT: TranscriptEntry[] = [
  {
    id: "1",
    speaker: "Alex Lewis",
    time: "00:02",
    text: "Alright everyone, thanks for jumping on. Let's dive into the Q3 product roadmap. Sarah, do you want to start with the infrastructure updates?",
  },
  {
    id: "2",
    speaker: "Sarah Chen",
    time: "00:45",
    text: "Sure. We've successfully migrated 80% of our core services to the new cluster. We're seeing about a 30% reduction in latency for the organizational memory queries. The remaining 20% should be done by Friday.",
    isDecision: true,
  },
  {
    id: "3",
    speaker: "Marcus Thorne",
    time: "01:20",
    text: "That's great progress. How does that impact the real-time transcription latency? We've had some feedback about a 2-second lag in the mobile client.",
  },
  {
    id: "4",
    speaker: "Sarah Chen",
    time: "01:45",
    text: "The migration actually addresses that directly. The new edge nodes reduce the round-trip time significantly. We're targeting sub-500ms once the migration is complete.",
    isActionItem: true,
    isCommitment: true,
  },
  {
    id: "5",
    speaker: "Alex Lewis",
    time: "02:15",
    text: "Perfect. Now, regarding the Zinc-based aesthetic for the new Sentra dashboard\u2014Marcus, how's the glassmorphic implementation going? We need that 'calm but serious' feel.",
  },
  {
    id: "6",
    speaker: "Marcus Thorne",
    time: "02:40",
    text: "We've refined the backdrop filters and the borders. It's looking very premium. We're using a specific opacity range for the zinc colors to ensure legibility while maintaining the organic floating feel.",
  },
  {
    id: "7",
    speaker: "Alex Lewis",
    time: "03:30",
    text: "I noticed some clipping on the timeline bubbles in the last build. Let's make sure the overflow is handled gracefully.",
  },
  {
    id: "8",
    speaker: "Marcus Thorne",
    time: "03:45",
    text: "I'll take a look at the z-indexing and the layout constraints today.",
    isActionItem: true,
  },
  {
    id: "9",
    speaker: "Sarah Chen",
    time: "04:10",
    text: "One more thing, we need to finalize the Supabase integration for the persistent storage of these transcriptions. Currently, we're just using local state for testing.",
  },
  {
    id: "10",
    speaker: "Alex Lewis",
    time: "04:35",
    text: "Let's sync with backend team tomorrow morning on that. We need to ensure PII redaction is active before we go to production.",
    isActionItem: true,
    isRisk: true,
  },
  {
    id: "11",
    speaker: "Alex Lewis",
    time: "05:00",
    text: "Okay, let's wrap this up. Good work everyone.",
  },
];

const MOCK_HIGHLIGHTS: Highlight[] = [
  {
    id: "h1",
    text: "We've successfully migrated 80% of our core services to the new cluster. We're seeing about a 30% reduction in latency.",
    speaker: "Sarah Chen",
    timestamp: "00:45",
    category: "decision",
  },
  {
    id: "h2",
    text: "We're targeting sub-500ms once the migration is complete.",
    speaker: "Sarah Chen",
    timestamp: "01:45",
    category: "commitment",
  },
  {
    id: "h3",
    text: "We need to ensure PII redaction is active before we go to production.",
    speaker: "Alex Lewis",
    timestamp: "04:35",
    category: "risk",
  },
];

const MOCK_ACTION_ITEMS: ActionItem[] = [
  {
    id: "a1",
    text: "Complete edge node migration and run final latency benchmarks",
    assignee: "Sarah Chen",
    dueDate: "Feb 7",
    completed: false,
    transcriptTimestamp: "01:45",
  },
  {
    id: "a2",
    text: "Fix timeline bubble clipping and z-index issues",
    assignee: "Marcus Thorne",
    dueDate: "Feb 5",
    completed: false,
    transcriptTimestamp: "03:45",
  },
  {
    id: "a3",
    text: "Sync with backend team on Supabase integration and PII redaction",
    assignee: "Alex Lewis",
    dueDate: "Feb 4",
    completed: true,
    transcriptTimestamp: "04:35",
  },
];

// Key moments for the "Jump to" strip and playback markers
const KEY_MOMENTS = MOCK_TRANSCRIPT.filter(
  (e) => e.isDecision || e.isCommitment || e.isRisk,
);

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingTitle?: string;
  hasVideo?: boolean;
  scrollToTimestamp?: string;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  isOpen,
  onClose,
  meetingTitle = "Q3 Product Roadmap Sync",
  hasVideo = true,
  scrollToTimestamp,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "highlights" | "action-items"
  >("all");
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [highlightedEntryId, setHighlightedEntryId] = useState<string | null>(
    null,
  );
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Simulate playback progress
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentPlaybackTime((prev) => Math.min(prev + 1, 312));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Auto-scroll to timestamp when opening from a decision/commitment link
  useEffect(() => {
    if (!isOpen || !scrollToTimestamp) return;

    const entry = MOCK_TRANSCRIPT.find((e) => e.time === scrollToTimestamp);
    if (!entry) return;

    setActiveTab("all");
    setHighlightedEntryId(entry.id);

    requestAnimationFrame(() => {
      const el = document.getElementById(`transcript-entry-${entry.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    const timer = setTimeout(() => setHighlightedEntryId(null), 3000);
    return () => clearTimeout(timer);
  }, [isOpen, scrollToTimestamp]);

  const scrollToEntry = useCallback((entryId: string) => {
    setHighlightedEntryId(entryId);
    const el = document.getElementById(`transcript-entry-${entryId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlightedEntryId(null), 3000);
  }, []);

  const filteredTranscript = MOCK_TRANSCRIPT.filter((item) => {
    const matchesSearch =
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "highlights")
      return (
        matchesSearch && (item.isDecision || item.isCommitment || item.isRisk)
      );
    if (activeTab === "action-items") return matchesSearch && item.isActionItem;
    return matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "decision":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600";
      case "commitment":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600";
      case "risk":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  const getEntryCategory = (
    entry: TranscriptEntry,
  ): "decision" | "commitment" | "risk" | null => {
    if (entry.isDecision) return "decision";
    if (entry.isCommitment) return "commitment";
    if (entry.isRisk) return "risk";
    return null;
  };

  const getBorderColor = (entry: TranscriptEntry): string => {
    if (entry.isDecision) return "border-l-blue-500";
    if (entry.isCommitment) return "border-l-emerald-500";
    if (entry.isRisk) return "border-l-amber-500";
    if (entry.isActionItem) return "border-l-accent";
    return "";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-card dark:bg-neutral-900 border border-border dark:border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[7px] bg-accent/10 text-accent flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {meetingTitle}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> 5:12
                    </span>
                    <span className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                    <span className="flex items-center gap-1">
                      <Users size={11} /> 3 Participants
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/5 rounded-[7px] transition-all">
                  <Download size={16} />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/5 rounded-[7px] transition-all">
                  <Share2 size={16} />
                </button>
                <div className="w-px h-5 bg-border mx-1" />
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-[7px] transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Tabs + Search */}
            <div className="px-6 py-3 bg-background/50 border-b border-border flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-1 bg-card dark:bg-neutral-800 p-1 rounded-[7px] border border-border">
                {(["all", "highlights", "action-items"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      activeTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "highlights"
                      ? "What Mattered"
                      : tab === "action-items"
                        ? "Action Items"
                        : "All"}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card dark:bg-neutral-800 border border-border rounded-[7px] pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            {/* Jump to key moments strip */}
            {activeTab === "all" && KEY_MOMENTS.length > 0 && (
              <div className="px-6 py-2 border-b border-border/50 flex items-center gap-2 shrink-0 bg-background/30">
                <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider mr-1 shrink-0">
                  Jump to
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {KEY_MOMENTS.map((entry) => {
                    const category = getEntryCategory(entry);
                    return (
                      <button
                        key={entry.id}
                        onClick={() => scrollToEntry(entry.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border transition-all hover:scale-105 active:scale-95 shrink-0 ${
                          category === "decision"
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800"
                            : category === "commitment"
                              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-800"
                              : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-800"
                        }`}
                      >
                        {category} @ {entry.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Content - Stacked: Video on top, transcript below */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Video Preview - Full width, prominent */}
              {hasVideo && (
                <div className="shrink-0 bg-neutral-950 relative border-b border-border">
                  <div className="w-full max-h-[220px] aspect-video flex items-center justify-center relative overflow-hidden">
                    <div className="text-center">
                      <Video
                        size={40}
                        className="text-muted-foreground/40 mx-auto mb-2"
                      />
                      <span className="text-xs text-muted-foreground/60">
                        Video Preview
                      </span>
                    </div>
                    {/* Play overlay */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        {isPlaying ? (
                          <Pause
                            size={22}
                            className="text-neutral-900"
                            fill="currentColor"
                          />
                        ) : (
                          <Play
                            size={22}
                            className="text-neutral-900 ml-1"
                            fill="currentColor"
                          />
                        )}
                      </div>
                    </button>
                    {/* Timestamp overlay */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 rounded text-[10px] font-mono text-white/80">
                      {Math.floor(currentPlaybackTime / 60)}:
                      {String(currentPlaybackTime % 60).padStart(2, "0")} / 5:12
                    </div>
                  </div>
                </div>
              )}

              {/* Transcript/Content area */}
              <div
                ref={transcriptContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
              >
                {/* Highlights view */}
                {activeTab === "highlights" && (
                  <div className="space-y-3">
                    {MOCK_HIGHLIGHTS.map((highlight) => (
                      <div
                        key={highlight.id}
                        className="p-4 rounded-[7px] bg-background border border-border"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getCategoryColor(highlight.category)}`}
                          >
                            {highlight.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {highlight.speaker}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {highlight.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          &ldquo;{highlight.text}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action items view */}
                {activeTab === "action-items" && (
                  <div className="space-y-3">
                    {MOCK_ACTION_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-[7px] border ${
                          item.completed
                            ? "bg-accent/5 border-accent/20"
                            : "bg-background border-border"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              item.completed
                                ? "bg-accent border-accent"
                                : "border-border"
                            }`}
                          >
                            {item.completed && (
                              <CheckCircle2 size={12} className="text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                item.completed
                                  ? "text-muted-foreground line-through"
                                  : "text-foreground"
                              }`}
                            >
                              {item.text}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>{item.assignee}</span>
                              <span>&bull;</span>
                              <span>Due {item.dueDate}</span>
                              {item.transcriptTimestamp && (
                                <>
                                  <span>&bull;</span>
                                  <button
                                    onClick={() => {
                                      setActiveTab("all");
                                      const entry = MOCK_TRANSCRIPT.find(
                                        (e) =>
                                          e.time === item.transcriptTimestamp,
                                      );
                                      if (entry) scrollToEntry(entry.id);
                                    }}
                                    className="text-blue-500 hover:underline font-mono"
                                  >
                                    {item.transcriptTimestamp}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Full transcript view with visual markers */}
                {activeTab === "all" &&
                  filteredTranscript.map((entry) => {
                    const hasMarker =
                      entry.isDecision ||
                      entry.isCommitment ||
                      entry.isRisk ||
                      entry.isActionItem;
                    const borderColor = getBorderColor(entry);
                    const isHighlighted = highlightedEntryId === entry.id;

                    return (
                      <div
                        key={entry.id}
                        id={`transcript-entry-${entry.id}`}
                        className={`group transition-all duration-500 rounded-lg ${
                          isHighlighted
                            ? "bg-accent/10 ring-2 ring-accent/40 -mx-2 px-2 py-1"
                            : ""
                        }`}
                      >
                        <div
                          className={`flex items-start gap-4 ${
                            hasMarker
                              ? `border-l-2 ${borderColor} pl-3 py-1`
                              : ""
                          }`}
                        >
                          <div className="w-12 pt-0.5 shrink-0">
                            <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                              {entry.time}
                            </span>
                          </div>
                          <div className="flex-1 pb-4 border-b border-border">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-foreground">
                                {entry.speaker}
                              </span>
                              {entry.isActionItem && (
                                <span className="px-1.5 py-0.5 bg-accent/10 text-accent rounded text-[9px] uppercase font-bold">
                                  Action
                                </span>
                              )}
                              {entry.isDecision && (
                                <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded text-[9px] uppercase font-bold">
                                  Decision
                                </span>
                              )}
                              {entry.isCommitment && (
                                <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded text-[9px] uppercase font-bold">
                                  Commitment
                                </span>
                              )}
                              {entry.isRisk && (
                                <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded text-[9px] uppercase font-bold">
                                  Risk
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {entry.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {filteredTranscript.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search
                      size={24}
                      className="text-muted-foreground/40 mb-2"
                    />
                    <h3 className="text-foreground font-medium mb-1">
                      No results found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Playback Bar */}
            <div className="px-6 py-3 bg-primary dark:bg-neutral-950 text-white shrink-0 border-t border-border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                    <Rewind size={16} />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 flex items-center justify-center bg-accent rounded-full hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying ? (
                      <Pause size={18} fill="currentColor" />
                    ) : (
                      <Play size={18} className="ml-0.5" fill="currentColor" />
                    )}
                  </button>
                  <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                    <FastForward size={16} />
                  </button>
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
                    <div
                      className="absolute inset-0 left-0 bg-accent rounded-full transition-all"
                      style={{
                        width: `${(currentPlaybackTime / 312) * 100}%`,
                      }}
                    />
                    {/* Key moment markers - enhanced */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 left-[15%] w-1.5 h-3 bg-blue-400 rounded-full cursor-pointer hover:h-4 transition-all"
                      title="Decision @ 0:45"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 left-[35%] w-1.5 h-3 bg-emerald-400 rounded-full cursor-pointer hover:h-4 transition-all"
                      title="Commitment @ 1:45"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 left-[87%] w-1.5 h-3 bg-amber-400 rounded-full cursor-pointer hover:h-4 transition-all"
                      title="Risk @ 4:35"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-white/40">
                    <span>
                      {Math.floor(currentPlaybackTime / 60)}:
                      {String(currentPlaybackTime % 60).padStart(2, "0")}
                    </span>
                    <span>5:12</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded bg-white/10 text-[10px] font-bold font-mono">
                    1.0x
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
