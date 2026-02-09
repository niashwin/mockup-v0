import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Video, Clock, Users } from "lucide-react";
import { useMeetingCapture } from "./MeetingCaptureProvider";

interface MeetingIndicatorProps {
  className?: string;
}

export const MeetingIndicator: React.FC<MeetingIndicatorProps> = ({
  className = "",
}) => {
  const { upcomingMeeting, captureState, startCapture } = useMeetingCapture();

  if (!upcomingMeeting) return null;

  const isCapturing = captureState === "capturing";
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
            ${
              isCapturing
                ? "bg-accent/10 text-accent"
                : isActive
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                  : "bg-secondary text-muted-foreground"
            }
          `}
        >
          {/* Status Dot */}
          <div className="relative">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isCapturing
                  ? "bg-accent"
                  : isActive
                    ? "bg-yellow-500"
                    : "bg-neutral-400"
              }`}
            />
            {(isCapturing || isActive) && (
              <motion.div
                className={`absolute inset-0 rounded-full ${
                  isCapturing ? "bg-accent" : "bg-yellow-500"
                }`}
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>

          {/* Status Text */}
          <span>
            {isCapturing
              ? "Capturing"
              : isActive
                ? "In meeting"
                : "Meeting starting"}
          </span>
        </div>

        {/* Meeting Info (on hover/click expandable) */}
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
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
            className="p-1.5 rounded-full text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
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
