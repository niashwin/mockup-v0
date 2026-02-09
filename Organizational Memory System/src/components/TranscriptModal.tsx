import React, { useState } from "react";
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
  Sparkles,
  Filter,
} from "lucide-react";

interface TranscriptEntry {
  id: string;
  speaker: string;
  time: string;
  text: string;
  isActionItem?: boolean;
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
  },
  {
    id: "5",
    speaker: "Alex Lewis",
    time: "02:15",
    text: "Perfect. Now, regarding the Zinc-based aesthetic for the new Sentra dashboard—Marcus, how's the glassmorphic implementation going? We need that 'calm but serious' feel.",
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
    text: "Let's sync with the backend team tomorrow morning on that. We need to ensure PII redaction is active before we go to production.",
  },
  {
    id: "11",
    speaker: "Alex Lewis",
    time: "05:00",
    text: "Okay, let's wrap this up. Good work everyone.",
  },
];

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingTitle?: string;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  isOpen,
  onClose,
  meetingTitle = "Q3 Product Roadmap Sync",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "highlights" | "action-items"
  >("all");

  const filteredTranscript = MOCK_TRANSCRIPT.filter((item) => {
    const matchesSearch =
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "highlights")
      return matchesSearch && item.text.length > 80; // Simple heuristic
    if (activeTab === "action-items") return matchesSearch && item.isActionItem;
    return matchesSearch;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center shadow-inner">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {meetingTitle}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> 45:12
                    </span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <span className="flex items-center gap-1">
                      <Users size={12} /> 3 Participants
                    </span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <span className="text-emerald-500 font-medium">
                      Recording Saved
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all">
                  <Download size={18} />
                </button>
                <button className="p-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all">
                  <Share2 size={18} />
                </button>
                <div className="w-px h-6 bg-zinc-200 dark:bg-white/10 mx-2" />
                <button
                  onClick={onClose}
                  className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="px-8 py-4 bg-zinc-50/50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
                {(["all", "highlights", "action-items"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      activeTab === tab
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {tab.replace("-", " ")}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={14}
                  />
                  <input
                    type="text"
                    placeholder="Search transcript..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 text-xs font-semibold">
                  <Filter size={14} />
                  Filters
                </button>
              </div>
            </div>

            {/* Transcript Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              {filteredTranscript.map((entry, index) => (
                <div key={entry.id} className="group relative">
                  <div className="flex items-start gap-6">
                    <div className="w-16 pt-1 shrink-0">
                      <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {entry.time}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                        {entry.speaker}
                        {entry.isActionItem && (
                          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] uppercase tracking-wider font-bold">
                            Action Item
                          </span>
                        )}
                      </h4>
                      <p
                        className={`text-base leading-relaxed transition-colors ${
                          searchQuery &&
                          entry.text
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                            ? "text-zinc-900 dark:text-white"
                            : "text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {entry.text}
                      </p>
                    </div>
                  </div>
                  {/* Speaker dot indicator on the left line */}
                  <div className="absolute left-[72px] top-6 bottom-[-32px] w-px bg-zinc-100 dark:bg-white/5 last:hidden" />
                  <div className="absolute left-[68px] top-2 w-2 h-2 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-300 dark:bg-zinc-700 z-10" />
                </div>
              ))}

              {filteredTranscript.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-300 mb-4">
                    <Search size={32} />
                  </div>
                  <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold mb-1">
                    No results found
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Try adjusting your search or filters.
                  </p>
                </div>
              )}
            </div>

            {/* Media Player Bar (Bottom) */}
            <div className="px-8 py-4 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shrink-0">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-white/10 dark:hover:bg-black/5 rounded-full transition-colors">
                    <Rewind size={20} />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 flex items-center justify-center bg-emerald-500 rounded-full hover:scale-105 active:scale-95 transition-all text-white shadow-lg shadow-emerald-500/20"
                  >
                    {isPlaying ? (
                      <Pause size={24} fill="currentColor" />
                    ) : (
                      <Play size={24} className="ml-1" fill="currentColor" />
                    )}
                  </button>
                  <button className="p-2 hover:bg-white/10 dark:hover:bg-black/5 rounded-full transition-colors">
                    <FastForward size={20} />
                  </button>
                </div>

                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-1.5 w-full bg-white/10 dark:bg-black/5 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 left-0 w-[35%] bg-emerald-500 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-white/50 dark:text-zinc-500">
                    <span>15:42</span>
                    <span>45:12</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-lg bg-white/10 dark:bg-black/5 text-xs font-bold font-mono">
                    1.25x
                  </div>
                  <button className="p-2 hover:bg-white/10 dark:hover:bg-black/5 rounded-full transition-colors">
                    <Sparkles size={18} className="text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
