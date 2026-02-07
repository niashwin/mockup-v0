import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Trash2, Lock, Check, PencilLine, Link } from 'lucide-react';
import sentraLogo from '../assets/2d867a3a115cb7771d8ca0fe7bf3c137b72785fa.png';
import { ViewMode } from '../types';

export const PillState = ({ 
  onClick, 
  isRecording, 
  setIsRecording,
  setMode,
  onCommit,
  isOverlay = false
}: { 
  onClick: () => void;
  isRecording: boolean;
  setIsRecording: (b: boolean) => void;
  setMode: (m: ViewMode) => void;
  onCommit: (type: 'private' | 'public', title: string, references: string) => void;
  isOverlay?: boolean;
}) => {
  const [showPostRecording, setShowPostRecording] = useState(false);
  const [noteTitle, setNoteTitle] = useState('New Meeting Note');
  const [noteReferences, setNoteReferences] = useState('');

  const handleMicClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRecording) {
      setIsRecording(false);
      setNoteTitle(prev => (prev.trim() ? prev : 'New Meeting Note'));
      setShowPostRecording(true);
    } else {
      setIsRecording(true);
      setShowPostRecording(false);
    }
  };

  const handleCommit = (type: 'private' | 'public') => {
    if (isOverlay && window?.electronAPI?.commitMeeting) {
      window.electronAPI.commitMeeting({
        type,
        title: noteTitle,
        references: noteReferences,
      });
    } else {
      onCommit(type, noteTitle, noteReferences);
    }
    setShowPostRecording(false);
    setNoteReferences('');
  };

  const handleDiscard = () => {
    setShowPostRecording(false);
    setNoteReferences('');
  };

  const handleOpenExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOverlay && window?.electronAPI?.openMain) {
      window.electronAPI.openMain('expanded');
      return;
    }
    setMode('expanded');
  };

  if (showPostRecording) {
    return (
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-2 flex flex-col gap-2 border border-zinc-200 dark:border-zinc-800 w-60 overflow-hidden">
           <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center border-b border-zinc-100 dark:border-zinc-800">
             New Meeting Note
           </div>

           <div className="px-2">
             <label className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
               <PencilLine size={11} />
               Title
             </label>
             <input
               value={noteTitle}
               onChange={(e) => setNoteTitle(e.target.value)}
               className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-2.5 py-2 text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40"
               placeholder="Add a title"
             />
           </div>

           <div className="px-2 pb-1">
             <label className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
               <Link size={11} />
               References
             </label>
             <input
               value={noteReferences}
               onChange={(e) => setNoteReferences(e.target.value)}
               className="w-full text-xs rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent px-2.5 py-2 text-zinc-600 dark:text-zinc-300 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40"
               placeholder="Add people, links, or doc refs"
             />
           </div>
           
           <button 
             onClick={() => handleCommit('public')}
             className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium transition-colors"
           >
             <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Check size={14} />
             </div>
             Commit
           </button>

           <button 
             onClick={() => handleCommit('private')}
             className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium transition-colors"
           >
             <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Lock size={14} />
             </div>
             Private
           </button>

           <button 
             onClick={handleDiscard}
             className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 text-sm font-medium transition-colors"
           >
             <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Trash2 size={14} />
             </div>
             Discard
           </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50">
      <motion.div
        className="bg-zinc-900 dark:bg-zinc-50 rounded-full shadow-2xl flex flex-col items-center p-1.5 cursor-pointer overflow-hidden border border-zinc-700/50 dark:border-zinc-300/50 hover:scale-105 transition-transform"
        style={{ width: '44px' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
        onClick={onClick}
      >
        {/* Logo Area */}
        <div 
           onClick={handleOpenExpanded}
           className="w-8 h-8 rounded-full flex items-center justify-center relative group"
           title="Open Full View"
        >
          <img src={sentraLogo} className="w-5 h-5 object-contain relative z-10" />
        </div>

        {/* Divider */}
        <div className="w-4 h-px bg-zinc-700 dark:bg-zinc-300 my-1 opacity-50" />
        
        {/* Mic Area */}
        <div 
           onClick={handleMicClick}
           className="w-8 h-8 rounded-full flex items-center justify-center relative group"
           title={isRecording ? "Stop Recording" : "Start Recording"}
        >
           {isRecording ? (
             <div className="flex items-center justify-center gap-0.5 h-full w-full">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-red-500 rounded-full"
                    animate={{ height: [8, 16, 8] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
             </div>
           ) : (
             <Mic size={16} className="text-zinc-400 group-hover:text-white dark:text-zinc-400 dark:group-hover:text-zinc-900 transition-colors" />
           )}
        </div>
      </motion.div>
    </div>
  );
};
