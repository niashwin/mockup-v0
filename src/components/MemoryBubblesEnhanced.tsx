import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'motion/react';
import { Brain, Sparkles, Zap, Image, FileText, Link, Hash, User, Users, Calendar, List, Grid3x3 } from 'lucide-react';

export interface Bubble {
  id: number;
  label: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  x: number;
  y: number;
  gradient: string;
  icon?: React.ElementType;
  delay: number;
  importance?: number; // 1-10, for sorting in list view
  type?: 'person' | 'meeting' | 'project' | 'document' | 'other';
  people?: string[]; // Names of people involved
  timestamp?: string;
}

interface MemoryBubblesEnhancedProps {
  onBubbleClick?: (bubble: Bubble) => void;
}

type ViewMode = 'bubbles' | 'list';

export const MemoryBubblesEnhanced: React.FC<MemoryBubblesEnhancedProps> = ({ onBubbleClick }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('bubbles');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const springConfig = { damping: 20, stiffness: 100, mass: 0.8 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  const background = useMotionTemplate`radial-gradient(600px circle at ${x}px ${y}px, rgba(56, 189, 248, 0.1), transparent 80%)`;

  const bubbles: Bubble[] = [
    // Core
    { id: 1, label: 'Vision', size: 'xl', x: 50, y: 50, gradient: 'from-fuchsia-500/20 to-purple-600/20 text-fuchsia-900 dark:text-fuchsia-100 ring-fuchsia-500/30', icon: Brain, delay: 0, importance: 10, type: 'project' },

    // Strategy
    { id: 2, label: 'Q3 Goals', size: 'lg', x: 75, y: 25, gradient: 'from-blue-500/20 to-cyan-500/20 text-blue-900 dark:text-blue-100 ring-blue-500/30', icon: Zap, delay: 0.1, importance: 9, type: 'project' },
    { id: 3, label: 'Growth', size: 'sm', x: 85, y: 15, gradient: 'from-blue-400/10 to-blue-500/10 text-blue-800 dark:text-blue-200 ring-blue-400/20', delay: 0.2, importance: 7, type: 'project' },

    // Product
    { id: 4, label: 'Mobile App', size: 'lg', x: 70, y: 70, gradient: 'from-emerald-500/20 to-teal-500/20 text-emerald-900 dark:text-emerald-100 ring-emerald-500/30', icon: FileText, delay: 0.15, importance: 9, type: 'project' },
    { id: 5, label: 'Beta', size: 'md', x: 82, y: 80, gradient: 'from-emerald-400/10 to-teal-400/10 text-emerald-800 dark:text-emerald-200 ring-emerald-400/20', icon: Hash, delay: 0.25, importance: 6, type: 'project' },

    // Research
    { id: 6, label: 'User Study', size: 'lg', x: 25, y: 75, gradient: 'from-amber-500/20 to-orange-500/20 text-amber-900 dark:text-amber-100 ring-amber-500/30', icon: User, delay: 0.1, importance: 8, type: 'project' },
    { id: 7, label: 'Feedback', size: 'sm', x: 15, y: 85, gradient: 'from-amber-400/10 to-orange-400/10 text-amber-800 dark:text-amber-200 ring-amber-400/20', delay: 0.3, importance: 5, type: 'document' },
    { id: 8, label: 'Survey', size: 'xs', x: 35, y: 88, gradient: 'from-amber-300/10 to-orange-300/10 text-amber-800 dark:text-amber-200 ring-amber-300/20', delay: 0.4, importance: 4, type: 'document' },

    // Design
    { id: 9, label: 'Design Sys', size: 'md', x: 25, y: 30, gradient: 'from-pink-500/20 to-rose-500/20 text-pink-900 dark:text-pink-100 ring-pink-500/30', icon: Image, delay: 0.2, importance: 8, type: 'project' },
    { id: 10, label: 'Icons', size: 'xs', x: 15, y: 20, gradient: 'from-pink-400/10 to-rose-400/10 text-pink-800 dark:text-pink-200 ring-pink-400/20', delay: 0.35, importance: 3, type: 'document' },

    // People & Meetings
    { id: 11, label: 'Sarah', size: 'sm', x: 45, y: 20, gradient: 'from-violet-500/10 to-purple-500/10 text-violet-800 dark:text-violet-200 ring-violet-500/20', icon: User, delay: 0.6, importance: 7, type: 'person', people: ['Sarah Chen'] },
    { id: 12, label: 'Alex', size: 'sm', x: 55, y: 85, gradient: 'from-cyan-500/10 to-blue-500/10 text-cyan-800 dark:text-cyan-200 ring-cyan-500/20', icon: User, delay: 0.65, importance: 6, type: 'person', people: ['Alex Rivera'] },
    { id: 13, label: 'Team Sync', size: 'md', x: 65, y: 45, gradient: 'from-indigo-500/20 to-purple-500/20 text-indigo-900 dark:text-indigo-100 ring-indigo-500/30', icon: Users, delay: 0.7, importance: 8, type: 'meeting', people: ['Sarah Chen', 'Alex Rivera', 'Morgan Lee'], timestamp: 'Today, 2:00 PM' },

    // Additional Activity
    { id: 14, label: 'API', size: 'sm', x: 60, y: 40, gradient: 'from-zinc-500/10 to-zinc-600/10 text-zinc-700 dark:text-zinc-300 ring-zinc-500/20', icon: Link, delay: 0.5, importance: 5, type: 'project' },
    { id: 15, label: 'Docs', size: 'xs', x: 40, y: 60, gradient: 'from-zinc-500/10 to-zinc-600/10 text-zinc-700 dark:text-zinc-300 ring-zinc-500/20', delay: 0.55, importance: 4, type: 'document' },
    { id: 16, label: 'Sprint Review', size: 'md', x: 35, y: 45, gradient: 'from-rose-500/20 to-orange-500/20 text-rose-900 dark:text-rose-100 ring-rose-500/30', icon: Calendar, delay: 0.75, importance: 9, type: 'meeting', people: ['Team'], timestamp: 'Tomorrow, 10:00 AM' },
    { id: 17, label: 'Morgan', size: 'sm', x: 80, y: 50, gradient: 'from-teal-500/10 to-emerald-500/10 text-teal-800 dark:text-teal-200 ring-teal-500/20', icon: User, delay: 0.8, importance: 6, type: 'person', people: ['Morgan Lee'] },
  ];

  const connections = [
    [1, 2], [1, 4], [1, 6], [1, 9],
    [2, 3], [4, 5], [4, 14], [6, 7], [6, 8],
    [9, 10], [9, 11], [14, 2], [15, 6],
    [13, 11], [13, 12], [16, 1], [17, 4],
  ];

  const getSize = (size: string) => {
    switch(size) {
        case 'xl': return 140;
        case 'lg': return 110;
        case 'md': return 90;
        case 'sm': return 70;
        case 'xs': return 50;
        default: return 80;
    }
  };

  // Get initials for profile picture placeholder
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Sort bubbles by importance for list view
  const sortedBubbles = [...bubbles].sort((a, b) => (b.importance || 0) - (a.importance || 0));

  return (
    <div
      onMouseMove={handleMouseMove}
      className="h-full w-full relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white/40 to-white/10 dark:from-zinc-900/40 dark:to-black/20 backdrop-blur-3xl border border-white/40 dark:border-white/5 shadow-2xl group/container"
    >
       {/* Ambient Glows */}
       <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

       {/* Mouse-following Highlight */}
       <motion.div
         className="absolute inset-0 pointer-events-none mix-blend-soft-light dark:mix-blend-overlay z-0"
         style={{ background }}
       />

       {/* Header with Title and Toggle */}
       <div className="absolute top-6 left-8 right-8 z-20">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3 opacity-60 pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                   <Sparkles size={14} className="text-zinc-600 dark:text-zinc-300" />
                </div>
                <span className="text-xs font-semibold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase">Memory Stream</span>
             </div>

             {/* View Toggle - Right aligned, separate row */}
             <div className="flex items-center gap-1 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-lg pointer-events-auto">
               <button
                 onClick={() => setViewMode('bubbles')}
                 className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                   viewMode === 'bubbles'
                     ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-md'
                     : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                 }`}
               >
                 <Grid3x3 size={14} />
                 Graph
               </button>
               <button
                 onClick={() => setViewMode('list')}
                 className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                   viewMode === 'list'
                     ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-md'
                     : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                 }`}
               >
                 <List size={14} />
                 List
               </button>
             </div>
          </div>
       </div>

       {viewMode === 'bubbles' ? (
         // BUBBLE VIEW
         <div className="relative w-full h-full z-10 pt-36">
           <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <defs>
                 <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                 </linearGradient>
              </defs>
              {connections.map(([startId, endId], i) => {
                  const start = bubbles.find(b => b.id === startId);
                  const end = bubbles.find(b => b.id === endId);
                  if (!start || !end) return null;

                  return (
                      <motion.path
                        key={i}
                        d={`M ${start.x}% ${start.y}% C ${(start.x + end.x)/2}% ${start.y}% ${(start.x + end.x)/2}% ${end.y}% ${end.x}% ${end.y}%`}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="1.5"
                        className="text-zinc-400 dark:text-zinc-600"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                      />
                  );
              })}
           </svg>

           {bubbles.map((b) => (
              <motion.div
                key={b.id}
                className="absolute z-10"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: getSize(b.size),
                  height: getSize(b.size),
                }}
                initial={{ opacity: 0, scale: 0.5, x: '-50%', y: '-50%' }}
                animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                transition={{
                  opacity: { duration: 1.5, delay: b.delay, ease: [0.22, 1, 0.36, 1] },
                  scale: { type: 'spring', damping: 25, stiffness: 80, delay: b.delay },
                }}
              >
                <motion.div
                  className={`w-full h-full rounded-full flex flex-col items-center justify-center backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg cursor-pointer group bg-gradient-to-br ${b.gradient} relative overflow-hidden`}
                  animate={{
                    y: [0, -8, 0, 6, 0],
                    x: [0, 5, 0, -4, 0],
                    rotate: [0, 1.5, 0, -1, 0],
                    scale: [1, 1.02, 1, 0.98, 1],
                  }}
                  transition={{
                    duration: 8 + b.id * 0.7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.25, 0.5, 0.75, 1],
                  }}
                  whileHover={{ scale: 1.15, y: -5, rotate: 0, transition: { duration: 0.3 } }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onBubbleClick?.(b)}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Profile Picture for People/Meetings - Simple & Clean */}
                  {(b.type === 'person' || b.type === 'meeting') && b.people && b.people.length > 0 ? (
                    <div className="mb-1">
                      {b.type === 'meeting' && b.people.length > 1 ? (
                        // Multiple people - show overlapping avatars
                        <div className="flex -space-x-2">
                          {b.people.slice(0, 3).map((person, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-700 dark:text-zinc-300 shadow-sm"
                              style={{ zIndex: 3 - idx }}
                            >
                              {getInitials(person)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Single person - simple avatar
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 border-2 border-white/50 flex items-center justify-center text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-md">
                          {getInitials(b.people[0])}
                        </div>
                      )}
                    </div>
                  ) : b.icon ? (
                    <div className="mb-1 opacity-80 group-hover:scale-110 transition-transform duration-300">
                      <b.icon size={b.size === 'xl' ? 32 : b.size === 'lg' ? 24 : 16} strokeWidth={1.5} />
                    </div>
                  ) : null}

                  <span className={`text-center leading-none font-medium tracking-tight px-2 ${b.size === 'xs' ? 'text-[10px]' : 'text-xs'}`}>
                    {b.label}
                  </span>

                  {b.timestamp && (
                    <span className="text-[8px] opacity-60 mt-1">{b.timestamp}</span>
                  )}
                </motion.div>
              </motion.div>
           ))}
         </div>
       ) : (
         // LIST VIEW - Sorted by Importance
         <div className="relative w-full h-full z-10 pb-8 px-8 overflow-y-auto">
           {/* Hard-coded spacer to ensure list starts below header */}
           <div className="h-24" />
           <div className="space-y-2">
             {sortedBubbles.map((b, index) => (
               <motion.div
                 key={b.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: index * 0.05 }}
                 onClick={() => onBubbleClick?.(b)}
                 className="bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md rounded-xl p-4 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-800/60 cursor-pointer transition-all hover:shadow-lg group"
               >
                 <div className="flex items-center gap-4">
                   {/* Priority Indicator */}
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                     {b.importance || 0}
                   </div>

                   {/* Profile Picture or Icon - Clean & Simple */}
                   {(b.type === 'person' || b.type === 'meeting') && b.people && b.people.length > 0 ? (
                     <div className="flex-shrink-0">
                       {b.type === 'meeting' && b.people.length > 1 ? (
                         <div className="flex -space-x-2">
                           {b.people.slice(0, 3).map((person, idx) => (
                             <div
                               key={idx}
                               className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-300"
                               style={{ zIndex: 3 - idx }}
                             >
                               {getInitials(person)}
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 border-2 border-white/50 flex items-center justify-center text-sm font-bold text-zinc-700 dark:text-zinc-300">
                           {getInitials(b.people[0])}
                         </div>
                       )}
                     </div>
                   ) : b.icon ? (
                     <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${b.gradient} flex items-center justify-center`}>
                       <b.icon size={20} strokeWidth={1.5} />
                     </div>
                   ) : null}

                   {/* Content */}
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mb-1">
                       <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                         {b.label}
                       </h3>
                       {/* Type Badge */}
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                         b.type === 'meeting' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' :
                         b.type === 'person' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' :
                         b.type === 'project' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                         'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                       }`}>
                         {b.type || 'item'}
                       </span>
                     </div>

                     {/* Timestamp */}
                     {b.timestamp && (
                       <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                         <Calendar size={12} />
                         <span>{b.timestamp}</span>
                       </div>
                     )}

                     {/* People */}
                     {b.people && b.people.length > 0 && (
                       <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                         <Users size={12} />
                         <span>{b.people.join(', ')}</span>
                       </div>
                     )}
                   </div>

                   {/* Importance badge - always visible */}
                   <div className="flex-shrink-0">
                     <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                       (b.importance || 0) >= 9 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                       (b.importance || 0) >= 7 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                       'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                     }`}>
                       P{b.importance}
                     </div>
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
         </div>
       )}
    </div>
  );
};
