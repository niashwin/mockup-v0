import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Clock, Users } from 'lucide-react';
import { useMeetingCapture } from './MeetingCaptureProvider';

interface MeetingIndicatorProps {
  className?: string;
}

export const MeetingIndicator: React.FC<MeetingIndicatorProps> = ({ className = '' }) => {
  const { upcomingMeeting, captureState, startCapture } = useMeetingCapture();

  if (!upcomingMeeting) return null;

  const isCapturing = captureState === 'capturing';
  const isActive = upcomingMeeting.isActive;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-center gap-3 ${className}`}
      >
        {/* Meeting Status Chip */}
        <div
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
            transition-colors duration-300
            ${isCapturing
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : isActive
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }
          `}
        >
          {/* Status Dot */}
          <div className="relative">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isCapturing
                  ? 'bg-emerald-500'
                  : isActive
                    ? 'bg-amber-500'
                    : 'bg-zinc-400'
              }`}
            />
            {(isCapturing || isActive) && (
              <motion.div
                className={`absolute inset-0 rounded-full ${
                  isCapturing ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            )}
          </div>

          {/* Status Text */}
          <span>
            {isCapturing ? 'Capturing' : isActive ? 'In meeting' : 'Meeting starting'}
          </span>
        </div>

        {/* Meeting Info (on hover/click expandable) */}
        <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500">
          <span className="max-w-[150px] truncate">
            {upcomingMeeting.title}
          </span>
          {upcomingMeeting.attendees.length > 0 && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {upcomingMeeting.attendees.length}
            </span>
          )}
        </div>

        {/* Subtle capture affordance when in meeting but not capturing */}
        {isActive && !isCapturing && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => startCapture()}
            className="p-1.5 rounded-full text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            title="Start capturing"
          >
            <Video className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MeetingIndicator;
