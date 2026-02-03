import React from 'react';
import { 
  X, Calendar, MapPin, Video, ExternalLink, FileText, 
  ChevronRight, ArrowLeft, Clock, Lock, Unlock
} from 'lucide-react';
import { MeetingBrief } from '../types';

export const MeetingDetailCard = ({ 
  meeting, 
  onClick, 
  onDescriptionClick,
  onTogglePrivacy,
  isHero = false 
}: { 
  meeting: MeetingBrief; 
  onClick?: () => void;
  onDescriptionClick?: () => void;
  onTogglePrivacy?: () => void;
  isHero?: boolean;
}) => {
  const isPrivate = !!meeting.isPrivate;
  
  return (
      <div 
        className={`
            bg-[color:var(--app-surface)] 
            border rounded-[2rem] p-6 lg:p-7
            shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.25)]
            relative overflow-hidden group transition-all duration-300
            ${isPrivate 
              ? 'border-orange-200 dark:border-orange-900/30 ring-1 ring-orange-100 dark:ring-orange-900/20' 
              : 'border-[color:var(--app-border)] ring-1 ring-zinc-200/40 dark:ring-white/5'
            }
            ${onClick ? 'cursor-pointer hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1' : ''}
        `} 
        onClick={onClick}
      >
         {/* Decorative gradient blob */}
         {isHero && <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />}
         {!isHero && !isPrivate && <div className="absolute top-0 right-0 w-48 h-48 bg-zinc-200/20 dark:bg-zinc-800/20 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />}
         {isPrivate && <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none" />}

         {isHero && <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />}
         {isPrivate && <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />}
         
         <div className="flex flex-col gap-5 relative z-10">
            {/* Header: Status & Time */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    {isPrivate ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full border border-orange-100 dark:border-orange-900/30 uppercase tracking-wider">
                            <Lock size={10} />
                            Private
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30 uppercase tracking-wider">
                            <Unlock size={10} />
                            Shared
                        </span>
                    )}
                    {isHero ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Starting Soon
                        </span>
                    ) : (
                        <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full uppercase tracking-wider">
                            Upcoming
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {onTogglePrivacy && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onTogglePrivacy(); }}
                          className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                            isPrivate 
                              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-100 dark:border-orange-900/30 hover:bg-orange-100/70' 
                              : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                          title={isPrivate ? 'Mark as shared' : 'Mark as private'}
                        >
                          {isPrivate ? <Lock size={10} /> : <Unlock size={10} />}
                          {isPrivate ? 'Private' : 'Shared'}
                        </button>
                    )}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-lg">
                        <Clock size={12} />
                        <span>{meeting.time}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
               <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight tracking-tight group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                  {meeting.title}
               </h2>
               
               <div 
                 className={`group/desc ${onDescriptionClick ? 'cursor-pointer' : ''}`}
                 onClick={(e) => {
                    if (onDescriptionClick) {
                        e.stopPropagation();
                        onDescriptionClick();
                    }
                 }}
               >
                 <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-xs lg:text-sm line-clamp-2">
                    {meeting.summary}
                 </p>
                 {onDescriptionClick && (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-2 hover:underline">
                        View Brief <ChevronRight size={12} />
                    </div>
                 )}
               </div>

               <div className="flex flex-wrap gap-2 pt-1">
                  {meeting.attendees.map((att, i) => (
                     <div key={i} className="flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                        <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[8px] font-bold text-zinc-500 dark:text-zinc-400">
                            {att.charAt(0)}
                        </div>
                        {att.split(' ')[0]}
                     </div>
                  ))}
               </div>
            </div>

            {/* Footer: Location & Action */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {meeting.location.includes('Zoom') || meeting.location.includes('Meet') ? (
                        <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                            <Video size={12} />
                        </div>
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                            <MapPin size={12} />
                        </div>
                    )}
                    <span className="truncate max-w-[120px]">{meeting.location}</span>
                </div>
                
                {meeting.meetingLink && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); window.open(meeting.meetingLink, '_blank'); }}
                     className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-bold shadow-lg shadow-zinc-200 dark:shadow-black/50 hover:scale-105 active:scale-95 transition-all"
                   >
                      Join Now <ExternalLink size={12} />
                   </button>
                )}
            </div>
         </div>
      </div>
  );
};

export const PreMeetingBriefOverlay = ({
  meeting,
  onClose
}: {
  meeting: MeetingBrief;
  onClose: () => void;
}) => {
    // Keep existing implementation but maybe polish visuals if time permits
    // For now, focusing on the MeetingDetailCard request
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                    <X size={20} />
                </button>
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-2">{meeting.title}</h2>
                    <p className="text-zinc-500 mb-6">Pre-meeting Brief</p>
                    <div className="prose dark:prose-invert max-w-none">
                        <p>{meeting.summary}</p>
                        {/* Add more brief details here */}
                    </div>
                </div>
            </div>
        </div>
    );
};
