import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Calendar, Clock, MapPin, Video, Users, FileText, CheckCircle2,
  MessageSquare, Share2, ChevronDown, Lock, Link2, UsersRound
} from 'lucide-react';
import { MeetingBrief } from '../types';

interface MeetingDetailModalProps {
  meeting: MeetingBrief | null;
  onClose: () => void;
  onPersonClick: (personName: string) => void;
  onViewTranscript: (meetingId: string) => void;
  onViewReport: (reportId: string) => void;
  onTogglePrivacy?: (meetingId: string) => void;
}

// Enhanced action items with organizational context
interface EnhancedActionItem {
  id: number;
  text: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
  affectsDownstream?: string;
  unblocks?: string;
  riskIfIgnored?: string;
}

// Brief links generated from this meeting
interface GeneratedBrief {
  id: string;
  title: string;
  status: 'active' | 'archived';
}

export const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({
  meeting,
  onClose,
  onPersonClick,
  onViewTranscript,
  onViewReport,
  onTogglePrivacy
}) => {
  const [showBriefsSection, setShowBriefsSection] = useState(true);

  if (!meeting) return null;
  const isPrivate = !!meeting.isPrivate;

  // Enhanced meeting brief - the "first screenful" content
  const meetingBrief = {
    purpose: `Align on ${meeting.title.toLowerCase()} priorities and identify action items for the coming week.`,
    humanRecognition: "This meeting clarified ownership across teams and set clear next steps."
  };

  // Generated briefs from this meeting (bridge to Briefs)
  const generatedBriefs: GeneratedBrief[] = [
    { id: 'b1', title: 'Q3 Roadmap Priorities', status: 'active' },
    { id: 'b2', title: 'Cross-functional Alignment', status: 'active' }
  ];

  // Enhanced action items with context
  const mockActionItems: EnhancedActionItem[] = [
    {
      id: 1,
      text: 'Complete mobile app beta testing feedback review',
      assignee: 'Sarah Chen',
      dueDate: 'Feb 5',
      completed: false,
      affectsDownstream: 'Product launch timeline',
      unblocks: 'Final QA sign-off',
      riskIfIgnored: 'Launch delay by 1 week'
    },
    {
      id: 2,
      text: 'Update Q3 roadmap based on user research findings',
      assignee: 'Mike Johnson',
      dueDate: 'Feb 6',
      completed: true,
      affectsDownstream: 'Engineering sprint planning',
      unblocks: 'Feature prioritization meeting'
    },
    {
      id: 3,
      text: 'Schedule follow-up with design team on new components',
      assignee: 'Emma Davis',
      dueDate: 'Feb 8',
      completed: false,
      affectsDownstream: 'Design system update',
      unblocks: 'Component library v2'
    },
    {
      id: 4,
      text: 'Share meeting notes with broader team via Slack',
      assignee: 'Alex Rivera',
      dueDate: 'Feb 4',
      completed: true,
      affectsDownstream: 'Team awareness'
    },
  ];

  const mockKeyDecisions = [
    'Approved budget increase for Q3 marketing campaign',
    'Decided to move mobile app launch from end of Q3 to mid-Q3',
    'Agreed to implement weekly design reviews starting next sprint',
  ];

  return (
    <AnimatePresence>
      {meeting && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div className={`w-full max-w-4xl max-h-[85vh] bg-white dark:bg-zinc-900 border shadow-2xl shadow-black/20 rounded-[2rem] overflow-hidden flex flex-col pointer-events-auto relative ${isPrivate ? 'border-orange-200/70 dark:border-orange-900/40 ring-1 ring-orange-200/40 dark:ring-orange-900/30' : 'border-[color:var(--app-border)]'}`}>

              {/* Header */}
              <div className={`shrink-0 px-8 py-6 border-b border-zinc-100 dark:border-zinc-800/50 relative z-10 ${isPrivate ? 'bg-orange-50/60 dark:bg-orange-900/20' : 'bg-white dark:bg-zinc-900'}`}>
                {/* Decorative gradient */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 rounded-full blur-3xl pointer-events-none ${isPrivate ? 'bg-gradient-to-r from-orange-400/15 via-amber-400/10 to-rose-400/10' : 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-fuchsia-500/10'}`} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${
                          meeting.status === 'completed' ? 'bg-zinc-400' :
                          meeting.status === 'in_progress' ? 'bg-green-500 animate-pulse' :
                          'bg-blue-500'
                        }`} />
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          {meeting.status === 'completed' ? 'Completed' :
                           meeting.status === 'in_progress' ? 'In Progress' :
                           'Scheduled'}
                        </span>
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                          isPrivate
                            ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30'
                            : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30'
                        }`}>
                          {isPrivate ? <Lock size={10} /> : <UsersRound size={10} />}
                          {isPrivate ? 'Private' : 'Company-wide'}
                        </span>
                      </div>
                      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{meeting.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{new Date(meeting.time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{meeting.time}</span>
                        </div>
                        {meeting.location && (
                          <div className="flex items-center gap-1.5">
                            {meeting.location.includes('Zoom') ? <Video size={14} /> : <MapPin size={14} />}
                            <span>{meeting.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {onTogglePrivacy && (
                        <button
                          onClick={() => onTogglePrivacy(meeting.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                            isPrivate
                              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-100 dark:border-orange-900/30 hover:bg-orange-100/70'
                              : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100/70'
                          }`}
                          title={isPrivate ? 'Make company-wide' : 'Make private'}
                        >
                          {isPrivate ? <Lock size={12} /> : <UsersRound size={12} />}
                          {isPrivate ? 'Private' : 'Company-wide'}
                        </button>
                      )}
                      <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all shadow-sm hover:shadow"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    {meeting.status === 'completed' && (
                      <button
                        onClick={() => onViewTranscript(meeting.id)}
                        className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800/30 transition-all flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95"
                      >
                        <MessageSquare size={12} />
                        Transcript
                      </button>
                    )}
                    {meeting.status === 'completed' && (
                      <button className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95">
                        <Share2 size={12} />
                        Share
                      </button>
                    )}
                    {meeting.hasBrief && meeting.status !== 'completed' && (
                      <button className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95">
                        <FileText size={12} />
                        Pre-meeting Brief
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar relative z-10">
                <div className="space-y-6">

                  {/* Meeting Purpose - Why did this meeting exist? */}
                  {meeting.status === 'completed' && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-2">Purpose</h3>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {meetingBrief.purpose}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 italic">
                        {meetingBrief.humanRecognition}
                      </p>
                    </section>
                  )}

                  {/* Bridge to Briefs - "This meeting generated X active Briefs" */}
                  {meeting.status === 'completed' && generatedBriefs.length > 0 && (
                    <section>
                      <button
                        onClick={() => setShowBriefsSection(!showBriefsSection)}
                        className="flex items-center gap-2 mb-3 group"
                      >
                        <Link2 size={14} className="text-purple-500" />
                        <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-purple-600 transition-colors">
                          This meeting generated {generatedBriefs.length} active Briefs
                        </h3>
                        <ChevronDown size={14} className={`text-zinc-400 transition-transform ${showBriefsSection ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {showBriefsSection && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              {generatedBriefs.map(brief => (
                                <button
                                  key={brief.id}
                                  className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100/50 dark:border-purple-900/20 hover:border-purple-300 dark:hover:border-purple-800 text-left group/brief transition-all"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <FileText size={14} className="text-purple-500" />
                                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover/brief:text-purple-600 dark:group-hover/brief:text-purple-400">
                                        {brief.title}
                                      </span>
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                      brief.status === 'active'
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                                    }`}>
                                      {brief.status}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>
                  )}

                  {/* Attendees */}
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3">Attendees ({meeting.attendees.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((person, idx) => (
                        <button
                          key={idx}
                          onClick={() => onPersonClick(person)}
                          className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 transition-colors"
                        >
                          {person}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Key Decisions */}
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3">Key Decisions</h3>
                    <ul className="space-y-2">
                      {mockKeyDecisions.map((decision, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                          <span className="text-zinc-400 mt-1.5">•</span>
                          <span>{decision}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Commitments */}
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3">Commitments</h3>
                    <div className="space-y-2">
                      {mockActionItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 py-2"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                            item.completed
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-zinc-300 dark:border-zinc-600'
                          }`}>
                            {item.completed && <CheckCircle2 size={10} className="text-white" strokeWidth={3} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${
                              item.completed
                                ? 'text-zinc-400 dark:text-zinc-500 line-through'
                                : 'text-zinc-700 dark:text-zinc-300'
                            }`}>
                              {item.text}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                              <button
                                onClick={() => onPersonClick(item.assignee)}
                                className="hover:text-zinc-700 dark:hover:text-zinc-300 hover:underline transition-colors"
                              >
                                {item.assignee}
                              </button>
                              <span>•</span>
                              <span>Due {item.dueDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
