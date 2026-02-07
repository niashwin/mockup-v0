import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, MoreHorizontal, Check, Clock, MessageSquare, Mail, Video, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Commitment } from '../types';

interface CommitmentRowProps {
  commitment: Commitment;
  onToggle: (id: string) => void;
  isHistory?: boolean;
  isCard?: boolean;
}

export const CommitmentRow = ({ commitment, onToggle, isHistory = false, isCard = false }: CommitmentRowProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset state if commitment status changes externally (e.g. from data update)
  useEffect(() => {
    setIsTransitioning(false);
    setProgress(0);
  }, [commitment.status]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTransitioning) {
      setProgress(0);
      const duration = 10000; // 10 seconds
      const step = 50; // Update every 50ms
      const increment = 100 / (duration / step);

      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + increment;
        });
      }, step);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isTransitioning]);

  useEffect(() => {
    if (progress >= 100 && isTransitioning) {
      onToggle(commitment.id);
      setIsTransitioning(false); // Reset local state, wait for prop update
    }
  }, [progress, isTransitioning, onToggle, commitment.id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTransitioning(!isTransitioning);
  };

  const isCompleted = commitment.status === 'completed';
  const isOverdue = commitment.status === 'overdue';

  // Styles based on state
  const containerClasses = isHistory
    ? "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
    : `bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md ${isOverdue ? 'border-red-200 dark:border-red-900/30 ring-1 ring-red-50 dark:ring-red-900/10' : 'border-zinc-200 dark:border-zinc-800'}`;

  // Card specific classes
  const cardClasses = isCard ? "h-full flex-col items-start justify-between p-6 gap-4" : "items-center justify-between p-4 sm:p-5";

  const SourceIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'slack': return <MessageSquare size={14} className="text-blue-500" />;
      case 'email': return <Mail size={14} className="text-amber-500" />;
      case 'meeting': return <Video size={14} className="text-purple-500" />;
      case 'document': return <FileText size={14} className="text-emerald-500" />;
      default: return <CheckCircle2 size={14} className="text-zinc-500" />;
    }
  };

  const DetailsPanel = () => (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden w-full"
        >
          <div className={`pt-3 mt-3 border-t ${isCard ? 'border-zinc-100 dark:border-zinc-800/50' : 'border-transparent pl-9'}`}>
            {commitment.source ? (
              <div className="flex items-start gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                 <div className="mt-0.5 shrink-0 bg-white dark:bg-zinc-700 rounded-md p-1 shadow-sm">
                    <SourceIcon type={commitment.source.type} />
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 capitalize">{commitment.source.type} Source</span>
                       <span className="text-[10px] text-zinc-400">{commitment.source.timestamp}</span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium mb-1 truncate">{commitment.source.title}</p>
                    {commitment.source.preview && (
                      <div className="relative pl-2 border-l-2 border-zinc-200 dark:border-zinc-600 text-xs text-zinc-500 italic line-clamp-2">
                         "{commitment.source.preview}"
                      </div>
                    )}
                 </div>
              </div>
            ) : (
               <div className="flex items-center justify-center p-4 text-xs text-zinc-400 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg border border-zinc-100 dark:border-zinc-800/30 border-dashed">
                  No source trace available.
               </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`relative overflow-hidden border rounded-2xl flex group ${containerClasses} ${cardClasses} ${isExpanded ? 'ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>
      
      {/* Progress Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            className={`absolute inset-0 pointer-events-none z-0 ${isCompleted ? 'bg-zinc-200/50 dark:bg-zinc-700/50' : 'bg-emerald-500/10'}`}
            initial={{ width: '0%', height: '100%' }} // height 100% to cover card
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.05 }} // Smooth steps
          />
        )}
      </AnimatePresence>

      {isCard ? (
        // Bento Card Layout
        <div className="relative z-10 w-full flex flex-col h-full justify-between">
           <div className="flex justify-between items-start w-full mb-2">
              <span className={`text-[10px] px-2 py-1 rounded-md border font-bold uppercase tracking-wider ${commitment.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400' : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700'}`}>
                  {commitment.priority}
              </span>
              <div 
                  onClick={handleToggle}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : isTransitioning 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-zinc-300 dark:border-zinc-600 hover:border-emerald-500/50'
                  }`}
                >
                  {isCompleted && <Check size={14} className="text-white" strokeWidth={3} />}
                  {!isCompleted && isTransitioning && (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
              </div>
           </div>

           <div className="flex-1 mb-2">
              <h3 className={`text-lg font-bold leading-tight mb-2 ${isCompleted ? 'text-zinc-500 line-through decoration-zinc-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                  {commitment.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-2">
                 {commitment.context}
              </p>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors group/btn"
              >
                Details
                {isExpanded ? <ChevronUp size={12} className="group-hover/btn:-translate-y-0.5 transition-transform" /> : <ChevronDown size={12} className="group-hover/btn:translate-y-0.5 transition-transform" />}
              </button>
           </div>
            
           <DetailsPanel />

           <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-3 mt-auto w-full">
                 <Clock size={12} />
                 <span>Due {commitment.dueDate}</span>
                 {commitment.assignee && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                         For <span className="text-zinc-600 dark:text-zinc-300">{commitment.assignee}</span>
                      </span>
                    </>
                 )}
             </div>
        </div>
      ) : (
        // Original Row Layout
        <div className="flex flex-col w-full">
          <div className="relative z-10 flex items-center gap-4 w-full">
            {/* Checkbox Area */}
            <div 
              onClick={handleToggle}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all duration-300 shrink-0 ${
                isCompleted 
                  ? 'bg-emerald-500 border-emerald-500' 
                  : isTransitioning 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : 'border-zinc-300 dark:border-zinc-600 hover:border-emerald-500/50'
              }`}
            >
              {isCompleted && <Check size={12} className="text-white" strokeWidth={3} />}
              {!isCompleted && isTransitioning && (
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium truncate pr-4 ${isCompleted ? 'text-zinc-500 line-through decoration-zinc-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {commitment.title}
                </h3>
                {/* Right side info */}
                <div className="flex items-center gap-3">
                  {!isHistory && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                      className="hidden sm:flex text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 items-center gap-1 transition-colors"
                    >
                      Details
                      {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    </button>
                  )}
                  <div className={`text-xs font-medium px-2 py-1 rounded shrink-0 ${isOverdue && !isCompleted ? 'bg-red-50 text-red-600' : isHistory ? 'text-zinc-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                      {commitment.dueDate}
                  </div>
                </div>
              </div>
              
              {!isHistory && (
                <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${commitment.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400' : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700'}`}>
                        {commitment.priority}
                    </span>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs text-zinc-500 truncate">{commitment.context}</span>
                    
                    {/* Mobile details toggle */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                      className="sm:hidden text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 ml-auto"
                    >
                      {isExpanded ? 'Hide' : 'Details'}
                    </button>
                </div>
              )}
            </div>
          </div>
          
          <DetailsPanel />
        </div>
      )}
    </div>
  );
};
