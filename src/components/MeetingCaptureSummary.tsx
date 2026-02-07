import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  CircleDot,
  HelpCircle,
  FileText,
  Link2,
  Lock,
  Share2,
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useMeetingCapture } from './MeetingCaptureProvider';

export const MeetingCaptureSummary: React.FC = () => {
  const { currentCapture, showSummary, closeSummary, saveCapture } = useMeetingCapture();
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedSaveOption, setSelectedSaveOption] = useState<'meeting' | 'thread' | 'private' | null>(null);

  if (!showSummary || !currentCapture) return null;

  const { snapshot, transcript, title, attendees, duration } = currentCapture;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 1) return `${secs}s`;
    return `${mins}m ${secs > 0 ? `${secs}s` : ''}`;
  };

  const handleSave = (option: 'meeting' | 'thread' | 'private') => {
    setSelectedSaveOption(option);
    // Slight delay for visual feedback
    setTimeout(() => {
      saveCapture(option);
    }, 300);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && closeSummary()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-[2rem] shadow-2xl border border-white/20 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <header className="px-8 pt-8 pb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {title || 'Meeting Captured'}
                </h2>
                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(duration)}
                  </span>
                  {attendees && attendees.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {attendees.length} participants
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={closeSummary}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X size={20} />
            </button>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            {/* What Sentra Understood - THE KEY MOMENT */}
            <div className="mb-8">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50/50 dark:from-emerald-900/20 dark:to-blue-900/10 border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-base text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  {snapshot.understanding}
                </p>
              </div>
            </div>

            {/* What Entered Memory */}
            <div className="space-y-6">
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                What Entered Memory
              </h3>

              {/* Decisions */}
              {snapshot.decisions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Decisions</span>
                  </div>
                  <div className="space-y-2 pl-6">
                    {snapshot.decisions.map((decision) => (
                      <div
                        key={decision.id}
                        className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                      >
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                          {decision.summary}
                        </p>
                        {decision.participants && decision.participants.length > 0 && (
                          <p className="text-xs text-zinc-400 mt-1">
                            {decision.participants.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Commitments */}
              {snapshot.commitments.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <CircleDot className="w-4 h-4 text-blue-500" />
                    <span>Commitments</span>
                  </div>
                  <div className="space-y-2 pl-6">
                    {snapshot.commitments.map((commitment) => (
                      <div
                        key={commitment.id}
                        className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                      >
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                          {commitment.summary}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {commitment.owner && (
                            <span className="text-xs text-zinc-500">
                              {commitment.owner}
                            </span>
                          )}
                          {commitment.dueDate && (
                            <span className="text-xs text-zinc-400">
                              Due: {new Date(commitment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Open Questions */}
              {snapshot.openQuestions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span>Open Questions</span>
                  </div>
                  <div className="space-y-2 pl-6">
                    {snapshot.openQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                      >
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                          {question.summary}
                        </p>
                        {question.askedBy && (
                          <p className="text-xs text-zinc-400 mt-1">
                            Asked by {question.askedBy}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics */}
              {snapshot.dominantTopics.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {snapshot.dominantTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Transcript (collapsed by default) */}
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center justify-between w-full text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Transcript
                </span>
                {showTranscript ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              <AnimatePresence>
                {showTranscript && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto">
                      {transcript.map((segment) => (
                        <div key={segment.id} className="flex gap-3">
                          <div className="w-16 shrink-0 text-right">
                            <span className="text-[10px] text-zinc-400">
                              {new Date(segment.timestamp).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            {segment.speaker && (
                              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                {segment.speaker}
                              </span>
                            )}
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5">
                              {segment.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer - What Happens Next */}
          <footer className="px-8 py-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
              Save As
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSave('meeting')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedSaveOption === 'meeting'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <FileText className={`w-5 h-5 ${selectedSaveOption === 'meeting' ? 'text-emerald-600' : 'text-zinc-400'}`} />
                <span className={`text-sm font-medium ${selectedSaveOption === 'meeting' ? 'text-emerald-700 dark:text-emerald-300' : 'text-zinc-600 dark:text-zinc-400'}`}>
                  Meeting
                </span>
              </button>

              <button
                onClick={() => handleSave('thread')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedSaveOption === 'thread'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <Link2 className={`w-5 h-5 ${selectedSaveOption === 'thread' ? 'text-blue-600' : 'text-zinc-400'}`} />
                <span className={`text-sm font-medium ${selectedSaveOption === 'thread' ? 'text-blue-700 dark:text-blue-300' : 'text-zinc-600 dark:text-zinc-400'}`}>
                  Attach to Thread
                </span>
              </button>

              <button
                onClick={() => handleSave('private')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedSaveOption === 'private'
                    ? 'border-zinc-500 bg-zinc-100 dark:bg-zinc-800'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <Lock className={`w-5 h-5 ${selectedSaveOption === 'private' ? 'text-zinc-600' : 'text-zinc-400'}`} />
                <span className={`text-sm font-medium ${selectedSaveOption === 'private' ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-600 dark:text-zinc-400'}`}>
                  Private
                </span>
              </button>
            </div>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MeetingCaptureSummary;
