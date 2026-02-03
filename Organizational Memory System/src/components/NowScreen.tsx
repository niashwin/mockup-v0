import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Brain, Clock, AlertTriangle, CheckCircle2, Calendar, ArrowRight, Zap, FileText, User, X } from 'lucide-react';
import { Commitment, MeetingBrief, Alert } from '../types';
import { MemoryBubblesEnhanced as MemoryBubbles } from './MemoryBubblesEnhanced';
import { MeetingDetailCard } from './MeetingComponents';
import { TopicDetailPanel } from './TopicDetailPanel';
import { ChatInterface } from './ChatInterface';
import { CommitmentItemWithActions } from './CommitmentItemWithActions';
import { toast } from 'sonner';

// Topic details data - AI-generated summaries and related items
const topicDetails: Record<number, any> = {
  1: {
    id: 1,
    label: 'Vision',
    icon: Brain,
    gradient: 'from-fuchsia-500/20 to-purple-600/20 text-fuchsia-900 dark:text-fuchsia-100 ring-fuchsia-500/30',
    summary: 'The company vision centers around building intelligent memory systems that help organizations operate more effectively. Recent discussions emphasize transparency, user empowerment, and seamless integration with existing workflows.',
    relatedItems: [
      { id: '1', type: 'document', title: 'Vision 2024 Strategy Doc', subtitle: 'Updated by leadership team', timestamp: '2 days ago' },
      { id: '2', type: 'mention', title: 'CEO Town Hall', subtitle: 'Vision alignment discussed', timestamp: '1 week ago' },
      { id: '3', type: 'document', title: 'Mission & Values Framework', subtitle: 'Core principles document', timestamp: '3 weeks ago' }
    ]
  },
  2: {
    id: 2,
    label: 'Q3 Goals',
    icon: Zap,
    gradient: 'from-blue-500/20 to-cyan-500/20 text-blue-900 dark:text-blue-100 ring-blue-500/30',
    summary: 'Q3 goals focus on product market fit, user acquisition, and platform stability. Key metrics include 10k active users, 95% uptime, and three major feature launches. Progress is tracked weekly across all departments.',
    relatedItems: [
      { id: '1', type: 'document', title: 'Q3 OKRs Dashboard', subtitle: '75% progress toward goals', timestamp: 'Updated today' },
      { id: '2', type: 'mention', title: 'Weekly Planning Meeting', subtitle: 'Goal adjustments discussed', timestamp: '3 days ago' },
      { id: '3', type: 'document', title: 'Marketing Campaign Plan', subtitle: 'User acquisition strategy', timestamp: '1 week ago' }
    ]
  },
  4: {
    id: 4,
    label: 'Mobile App',
    icon: FileText,
    gradient: 'from-emerald-500/20 to-teal-500/20 text-emerald-900 dark:text-emerald-100 ring-emerald-500/30',
    summary: 'The mobile app initiative aims to bring Sentra to iOS and Android platforms. Currently in beta testing with 50 internal users. Focus areas include offline sync, notifications, and quick capture workflows for on-the-go memory creation.',
    relatedItems: [
      { id: '1', type: 'document', title: 'Mobile Roadmap Q3-Q4', subtitle: 'Feature prioritization', timestamp: '1 day ago' },
      { id: '2', type: 'mention', title: 'Beta Tester Feedback', subtitle: '23 responses collected', timestamp: '2 days ago' },
      { id: '3', type: 'document', title: 'Design System: Mobile', subtitle: 'Component library', timestamp: '1 week ago' }
    ]
  },
  6: {
    id: 6,
    label: 'User Study',
    icon: User,
    gradient: 'from-amber-500/20 to-orange-500/20 text-amber-900 dark:text-amber-100 ring-amber-500/30',
    summary: 'Ongoing user research to understand how teams use organizational memory. Recent findings show that users want better search, more context, and automatic tagging. 15 interviews completed, 10 more scheduled for next month.',
    relatedItems: [
      { id: '1', type: 'document', title: 'User Interview Notes (Aug)', subtitle: 'Key insights summary', timestamp: 'Yesterday' },
      { id: '2', type: 'mention', title: 'Research Sync', subtitle: 'Findings presentation', timestamp: '4 days ago' },
      { id: '3', type: 'document', title: 'Usability Test Plan', subtitle: 'Testing protocol', timestamp: '1 week ago' }
    ]
  }
};

export const NowScreen = ({ 
  commitments, 
  onToggle,
  alerts,
  meetingBriefs,
  onNavigate
}: { 
  commitments: Commitment[], 
  onToggle: (id: string) => void,
  alerts: Alert[],
  meetingBriefs: MeetingBrief[],
  onNavigate: (tab: 'Now' | 'Reports' | 'Swimlanes' | 'Meetings' | 'ToDo' | 'Settings') => void
}) => {
  const [rightPanelMode, setRightPanelMode] = useState<'default' | 'alerts_expanded'>('default');
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const upcomingMeeting = meetingBriefs.find(m => m.status === 'scheduled');
  const activeAlerts = alerts; // Show all alerts when expanded, or filter if needed
  const recentAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'warning').slice(0, 2);
  const pendingCommitments = commitments.filter(c => c.status !== 'completed');

  // Commitment action handlers
  const handleCompleteCommitment = (id: string) => {
    onToggle(id);
    toast.success('Commitment completed!', {
      description: 'Great job staying on top of things.',
      duration: 2000
    });
  };

  const handleSnoozeCommitment = (id: string) => {
    toast.info('Commitment snoozed', {
      description: 'We\'ll remind you tomorrow.',
      duration: 2000
    });
  };

  const handleDelegateCommitment = (id: string) => {
    toast('Delegate commitment', {
      description: 'Select a team member to delegate this to.',
      duration: 2000
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full p-6 lg:p-10 overflow-hidden bg-transparent">
      {/* Top Section: Ask Sentra */}
      <div className="shrink-0 mb-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mx-auto"
          >
             <div 
               className="relative group cursor-pointer"
               onClick={() => setIsChatOpen(true)}
             >
               <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl hover:bg-white/80 dark:hover:bg-zinc-900/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm hover:shadow-md">
                  <Search className="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-500 w-4 h-4 transition-colors shrink-0" strokeWidth={2} />
                  <span className="text-sm font-light text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-500 transition-colors">Ask Sentra anything...</span>
                  <div className="ml-auto flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                     <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-500">⌘K</kbd>
                  </div>
               </div>
             </div>
          </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 flex gap-8 min-h-0 relative z-0">
         {/* Left 2/3rds: Memory Bubbles */}
         <div className="w-[65%] flex flex-col min-h-0 shadow-2xl shadow-zinc-200/50 dark:shadow-black/20 rounded-[2rem]">
            <MemoryBubbles onBubbleClick={(bubble) => {
              const details = topicDetails[bubble.id];
              if (details) {
                setSelectedTopic(details);
              }
            }} />
         </div>

         {/* Right 1/3rd: Dashboard Panel */}
         <div className="flex-1 flex flex-col gap-5 min-h-0 relative">
             
             <AnimatePresence mode="popLayout">
                 {rightPanelMode === 'default' ? (
                     <>
                        {/* Meeting Card */}
                        <motion.div 
                           layoutId="meeting-card" 
                           className="shrink-0"
                           initial={{ opacity: 0, scale: 0.98, y: 10 }}
                           animate={{ opacity: 1, scale: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        >
                           {upcomingMeeting && (
                              <MeetingDetailCard 
                                 meeting={upcomingMeeting} 
                                 isHero={false} 
                                 onClick={() => onNavigate('Meetings')}
                              />
                           )}
                        </motion.div>

                        {/* Alerts - Collapsed */}
                        <motion.div 
                           key="alerts-panel"
                           layoutId="alerts-panel"
                           initial={{ opacity: 0, scale: 0.98, y: 10 }}
                           animate={{ opacity: 1, scale: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                           onClick={() => setRightPanelMode('alerts_expanded')}
                           className="flex-1 min-h-0 bg-[color:var(--app-surface)] border border-[color:var(--app-border)] shadow-[0_18px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.25)] rounded-3xl p-5 overflow-hidden cursor-pointer hover:bg-[color:var(--app-surface)] transition-all group relative ring-1 ring-zinc-200/40 dark:ring-white/5"
                        >
                           {/* Decorative gradient blob */}
                           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />

                           <div className="flex items-center justify-between mb-4 relative z-10">
                              <div className="flex items-center gap-2.5">
                                 <div className="w-6 h-6 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-900/30">
                                    <AlertTriangle size={12} strokeWidth={2.5} />
                                 </div>
                                 <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">Alerts</h3>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-zinc-400 group-hover:text-amber-600 transition-colors font-medium">
                                 <span>Expand</span>
                                 <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                              </div>
                           </div>
                           
                           <div className="space-y-2.5 relative z-10">
                              {recentAlerts.map(alert => (
                                 <div key={alert.id} className="p-3.5 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 group-hover:bg-amber-50/30 dark:group-hover:bg-amber-900/10 transition-colors">
                                    <div className="flex justify-between items-baseline mb-1">
                                       <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 tracking-tight">{alert.title}</span>
                                       <span className="text-[10px] font-medium text-zinc-400 tabular-nums">{new Date(alert.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-1">{alert.description}</p>
                                 </div>
                              ))}
                           </div>
                        </motion.div>

                        {/* Commitments - Collapsed */}
                        <motion.div 
                           key="commitments-collapsed"
                           layoutId="commitments-panel"
                           initial={{ opacity: 0, scale: 0.98, y: 10 }}
                           animate={{ opacity: 1, scale: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                           onClick={() => onNavigate('ToDo')}
                           className="shrink-0 bg-[color:var(--app-surface)] border border-[color:var(--app-border)] shadow-[0_18px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.25)] rounded-3xl p-5 cursor-pointer hover:bg-[color:var(--app-surface)] transition-all group relative ring-1 ring-zinc-200/40 dark:ring-white/5"
                        >
                           {/* Decorative gradient blob */}
                           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />

                           <div className="flex items-center justify-between mb-4 relative z-10">
                              <div className="flex items-center gap-2.5">
                                 <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-900/30">
                                    <CheckCircle2 size={12} strokeWidth={2.5} />
                                 </div>
                                 <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">Commitments</h3>
                              </div>
                              <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700/50">{pendingCommitments.length}</span>
                           </div>
                           
                           <div className="space-y-2 relative z-10">
                              {pendingCommitments.slice(0, 3).map(c => (
                                 <CommitmentItemWithActions 
                                   key={c.id} 
                                   commitment={c} 
                                   onComplete={handleCompleteCommitment}
                                   onSnooze={handleSnoozeCommitment}
                                   onDelegate={handleDelegateCommitment}
                                   isCompact={true}
                                 />
                              ))}
                              {pendingCommitments.length > 3 && (
                                 <div className="pl-4.5 text-[10px] text-zinc-400 font-medium">+ {pendingCommitments.length - 3} more</div>
                              )}
                           </div>
                        </motion.div>
                     </>
                 ) : (
                     <motion.div 
                        key="alerts-expanded"
                        layoutId="alerts-panel"
                        className="flex-1 bg-[color:var(--app-surface)] border border-[color:var(--app-border)] shadow-2xl shadow-zinc-200/50 dark:shadow-black/20 rounded-[2rem] p-6 flex flex-col min-h-0 h-full relative overflow-hidden ring-1 ring-zinc-200/40 dark:ring-white/5"
                     >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                        <div className="flex items-center justify-between mb-6 shrink-0 relative z-10">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-900/30">
                                 <AlertTriangle size={16} strokeWidth={2.5} />
                              </div>
                              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500">Active Alerts</h3>
                           </div>
                           <button
                              onClick={(e) => {
                                 e.stopPropagation();
                                 e.preventDefault();
                                 setRightPanelMode('default');
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                           >
                              <X size={14} />
                           </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 relative z-10 custom-scrollbar">
                           {activeAlerts.map(alert => (
                              <div key={alert.id} className="p-4 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:border-amber-200/50 dark:hover:border-amber-900/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 cursor-pointer group">
                                 <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                        alert.severity === 'critical' 
                                            ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30' 
                                            : alert.severity === 'warning' 
                                                ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/30' 
                                                : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30'
                                    }`}>
                                       {alert.severity.toUpperCase()}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-medium tabular-nums">{new Date(alert.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                 </div>
                                 <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{alert.title}</h4>
                                 <p className="text-xs text-zinc-500 leading-relaxed">{alert.description}</p>
                              </div>
                           ))}
                        </div>
                     </motion.div>
                 )}
             </AnimatePresence>
         </div>
      </div>

      {/* Topic Detail Panel */}
      <TopicDetailPanel 
        topic={selectedTopic}
        onClose={() => setSelectedTopic(null)}
        onDeepDive={() => {
          console.log('Deep dive into topic:', selectedTopic?.label);
          // Could navigate to a dedicated view or trigger search
          setSelectedTopic(null);
        }}
      />

      {/* Chat Interface */}
      <ChatInterface 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
