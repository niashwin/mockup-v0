import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, MapPin, Video, Users, FileText, CheckCircle2, ArrowRight, ExternalLink, MessageSquare, Share2, ChevronDown, Lock, Unlock } from 'lucide-react';
import { MeetingBrief } from '../types';

interface MeetingDetailModalProps {
  meeting: MeetingBrief | null;
  onClose: () => void;
  onPersonClick: (personName: string) => void;
  onViewTranscript: (meetingId: string) => void;
  onViewReport: (reportId: string) => void;
  onTogglePrivacy?: (meetingId: string) => void;
}

export const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({ meeting, onClose, onPersonClick, onViewTranscript, onViewReport, onTogglePrivacy }) => {
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);
  if (!meeting) return null;
  const isPrivate = !!meeting.isPrivate;

  const mockReports = [
    { id: 'rep-1', title: 'Executive Strategy Sync', category: 'Strategic', date: 'Feb 2, 2026' },
    { id: 'rep-2', title: 'Infrastructure Audit Results', category: 'Technical', date: 'Feb 1, 2026' },
    { id: 'rep-3', title: 'Q3 Product Roadmap v2', category: 'Product', date: 'Jan 30, 2026' },
    { id: 'rep-4', title: 'Team Performance Review', category: 'Operations', date: 'Jan 28, 2026' },
  ];

  // Mock detailed data - you can expand this with real data structure
  const mockSummary = `This ${meeting.title.toLowerCase()} covered key strategic initiatives and project updates. The team aligned on priorities and identified several action items for the coming week. Discussion focused on cross-functional collaboration and ensuring all stakeholders are informed of progress.`;
  
  const mockActionItems = [
    { id: 1, text: 'Complete mobile app beta testing feedback review', assignee: 'Sarah Chen', dueDate: 'Feb 5', completed: false },
    { id: 2, text: 'Update Q3 roadmap based on user research findings', assignee: 'Mike Johnson', dueDate: 'Feb 6', completed: true },
    { id: 3, text: 'Schedule follow-up with design team on new components', assignee: 'Emma Davis', dueDate: 'Feb 8', completed: false },
    { id: 4, text: 'Share meeting notes with broader team via Slack', assignee: 'Alex Rivera', dueDate: 'Feb 4', completed: true },
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
                          {isPrivate ? <Lock size={10} /> : <Unlock size={10} />}
                          {isPrivate ? 'Private' : 'Shared'}
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
                              : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                          title={isPrivate ? 'Mark as shared' : 'Mark as private'}
                        >
                          {isPrivate ? <Lock size={12} /> : <Unlock size={12} />}
                          {isPrivate ? 'Private' : 'Shared'}
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
                    {meeting.reportStatus === 'published' && (
                      <div className="relative">
                        <button 
                          onClick={() => setShowReportsDropdown(!showReportsDropdown)}
                          className={`px-3 py-1.5 ${showReportsDropdown ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-blue-50 dark:bg-blue-900/20'} hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-lg border border-blue-200 dark:border-blue-800/30 transition-all flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95`}
                        >
                          <FileText size={12} />
                          Reports ({mockReports.length})
                          <ChevronDown size={12} className={`transition-transform duration-200 ${showReportsDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {showReportsDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.95 }}
                              className="absolute top-full left-0 mt-2 w-72 max-h-64 overflow-y-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl z-50 p-2 custom-scrollbar"
                            >
                              <div className="px-2 py-1.5 mb-1">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Select Report</span>
                              </div>
                              <div className="space-y-1">
                                {mockReports.map((report) => (
                                  <button
                                    key={report.id}
                                    onClick={() => {
                                      onViewReport(report.id);
                                      setShowReportsDropdown(false);
                                    }}
                                    className="w-full text-left p-3 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors group/item"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover/item:text-blue-500 transition-colors">{report.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[9px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded font-bold uppercase">{report.category}</span>
                                          <span className="text-[9px] text-zinc-400">{report.date}</span>
                                        </div>
                                      </div>
                                      <ArrowRight size={12} className="text-zinc-300 group-hover/item:text-blue-500 group-hover/item:translate-x-1 transition-all mt-1" />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
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
                  
                  {/* Attendees */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={16} className="text-zinc-400" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Attendees ({meeting.attendees.length})</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((person, idx) => (
                        <button
                          key={idx}
                          onClick={() => onPersonClick(person)}
                          className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 transition-all hover:shadow-md hover:scale-105 group"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                              {person.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium">{person}</span>
                            <ArrowRight size={12} className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-all -ml-1 group-hover:ml-0" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Summary */}
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3">Meeting Summary</h3>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{mockSummary}</p>
                    </div>
                  </section>

                  {/* Key Decisions */}
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3">Key Decisions</h3>
                    <div className="space-y-2">
                      {mockKeyDecisions.map((decision, idx) => (
                        <div key={idx} className="flex gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 size={12} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{decision}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Action Items */}
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3">Action Items</h3>
                    <div className="space-y-2">
                      {mockActionItems.map((item) => (
                        <div 
                          key={item.id} 
                          className={`p-4 rounded-xl border transition-all ${
                            item.completed 
                              ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30' 
                              : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              item.completed 
                                ? 'bg-emerald-500 border-emerald-500' 
                                : 'border-zinc-300 dark:border-zinc-600'
                            }`}>
                              {item.completed && <CheckCircle2 size={12} className="text-white" strokeWidth={3} />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium mb-2 ${
                                item.completed 
                                  ? 'text-zinc-500 dark:text-zinc-400 line-through' 
                                  : 'text-zinc-700 dark:text-zinc-300'
                              }`}>
                                {item.text}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-zinc-500">
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
