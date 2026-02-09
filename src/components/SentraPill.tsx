import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Square, Sparkles } from "lucide-react";
import { useMeetingCapture } from "./MeetingCaptureProvider";

interface SentraPillProps {
  className?: string;
}

export const SentraPill: React.FC<SentraPillProps> = ({ className = "" }) => {
  const {
    captureState,
    startCapture,
    stopCapture,
    showCapturePrompt,
    dismissPrompt,
    upcomingMeeting,
  } = useMeetingCapture();

  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip on hover when idle
  useEffect(() => {
    if (isHovered && captureState === "idle") {
      const timer = setTimeout(() => setShowTooltip(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowTooltip(false);
    }
  }, [isHovered, captureState]);

  const handleClick = () => {
    if (captureState === "capturing") {
      stopCapture();
    } else if (captureState === "idle" || captureState === "armed") {
      startCapture();
    }
  };

  const isCapturing = captureState === "capturing";
  const isIdle = captureState === "idle" || captureState === "armed";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 ${className}`}
    >
      {/* Capture Prompt (when meeting detected) */}
      <AnimatePresence>
        {showCapturePrompt && !isCapturing && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-card dark:bg-neutral-900 rounded-2xl shadow-xl border border-border p-4 max-w-[240px]"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Meeting starting
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {upcomingMeeting?.title || "Capture this meeting?"}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => startCapture()}
                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
                  >
                    Capture
                  </button>
                  <button
                    onClick={dismissPrompt}
                    className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && isIdle && !showCapturePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="bg-primary dark:bg-neutral-100 text-white dark:text-foreground text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg"
          >
            Start capturing this meeting
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Pill */}
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative flex items-center gap-2.5 px-4 py-2.5 rounded-full
          shadow-lg border transition-all duration-300
          ${
            isCapturing
              ? "bg-accent border-accent text-white shadow-accent/20"
              : "bg-card dark:bg-neutral-900 border-border text-foreground hover:shadow-xl hover:border-border"
          }
        `}
        whileHover={{ scale: isCapturing ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Pulsing background when capturing */}
        {isCapturing && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-accent"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-accent"
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </>
        )}

        {/* Mic Icon with animation */}
        <div className="relative z-10">
          {isCapturing ? (
            <div className="relative">
              <Mic className="w-4 h-4" />
              {/* Subtle sound wave animation */}
              <motion.div className="absolute -right-1 top-1/2 -translate-y-1/2 flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-white/80 rounded-full"
                    animate={{
                      height: ["4px", "8px", "4px"],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            </div>
          ) : (
            <Mic
              className={`w-4 h-4 transition-colors ${isHovered ? "text-accent" : ""}`}
            />
          )}
        </div>

        {/* Label */}
        <span className="relative z-10 text-sm font-medium">
          {isCapturing ? "Capturing" : "Sentra"}
        </span>

        {/* Stop indicator on hover when capturing */}
        {isCapturing && isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-4 h-4 flex items-center justify-center"
          >
            <Square className="w-3 h-3 fill-current" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default SentraPill;
