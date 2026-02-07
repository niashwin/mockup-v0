import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, User, Calendar, ArrowRight, Link, MessageSquare, Sparkles } from 'lucide-react';

interface RelatedItem {
  id: string;
  type: 'mention' | 'document' | 'person';
  title: string;
  subtitle?: string;
  timestamp?: string;
}

interface TopicDetail {
  id: number;
  label: string;
  icon: React.ElementType;
  gradient: string;
  summary: string;
  relatedItems: RelatedItem[];
}

interface TopicDetailPanelProps {
  topic: TopicDetail | null;
  onClose: () => void;
  onDeepDive: () => void;
}

export const TopicDetailPanel: React.FC<TopicDetailPanelProps> = ({ topic, onClose, onDeepDive }) => {
  const getRelatedIcon = (type: string) => {
    switch (type) {
      case 'mention': return MessageSquare;
      case 'document': return FileText;
      case 'person': return User;
      default: return Link;
    }
  };

  return (
    <AnimatePresence>
      {topic && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300,
              opacity: { duration: 0.2 }
            }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
            style={{ width: 'min(36vw, 520px)', minWidth: '360px' }}
          >
            {/* Glass Panel Content */}
            <div className="h-full m-6 flex flex-col bg-white/90 dark:bg-zinc-900/90 backdrop-blur-3xl border border-white/50 dark:border-white/10 shadow-2xl shadow-zinc-900/10 dark:shadow-black/40 rounded-[2rem] overflow-hidden">
              
              {/* Header */}
              <div className="shrink-0 px-8 pt-8 pb-6 border-b border-zinc-100 dark:border-zinc-800/50 relative">
                {/* Decorative gradient blob */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${topic.gradient.split(' ')[0]} ${topic.gradient.split(' ')[1]} opacity-20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none`} />
                
                <div className="relative z-10">
                  <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all shadow-sm hover:shadow"
                  >
                    <X size={16} />
                  </button>

                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.gradient} backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg flex items-center justify-center`}>
                      <topic.icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{topic.label}</h2>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Memory Topic</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
                {/* AI Summary */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <Sparkles size={11} className="text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">AI Summary</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800">
                    {topic.summary}
                  </p>
                </div>

                {/* Related Items */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">Related Information</h3>
                  <div className="space-y-2">
                    {topic.relatedItems.map((item) => {
                      const Icon = getRelatedIcon(item.type);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group p-4 bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all cursor-pointer hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0 group-hover:scale-110 transition-transform">
                              <Icon size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">{item.title}</h4>
                              {item.subtitle && (
                                <p className="text-xs text-zinc-500 mt-0.5 truncate">{item.subtitle}</p>
                              )}
                              {item.timestamp && (
                                <p className="text-[10px] text-zinc-400 mt-1 font-mono">{item.timestamp}</p>
                              )}
                            </div>
                            <ArrowRight size={14} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Key People */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">Key People</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Sarah Chen', 'Mike Johnson', 'Emma Davis'].map((name) => (
                      <div
                        key={name}
                        className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full cursor-pointer transition-colors border border-zinc-200 dark:border-zinc-700"
                      >
                        <div className="w-5 h-5 rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                          {name.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Preview */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">Recent Activity</h3>
                  <div className="space-y-3 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800">
                    {[
                      { time: '2 hours ago', text: 'Mentioned in #product-updates channel' },
                      { time: '1 day ago', text: 'Document updated by Sarah' },
                      { time: '3 days ago', text: 'Discussed in team standup' }
                    ].map((activity, idx) => (
                      <div key={idx} className="relative -ml-[9px]">
                        <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900" />
                        <div className="pl-6">
                          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">{activity.text}</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer - Deep Dive Button */}
              <div className="shrink-0 px-8 py-6 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
                <button
                  onClick={onDeepDive}
                  className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl font-medium text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                  <span>Deep Dive</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
