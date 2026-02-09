import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Clock, UserPlus } from "lucide-react";
import { Commitment } from "../types";

interface CommitmentItemWithActionsProps {
  commitment: Commitment;
  onComplete: (id: string) => void;
  onSnooze: (id: string) => void;
  onDelegate: (id: string) => void;
  isCompact?: boolean;
}

export const CommitmentItemWithActions: React.FC<
  CommitmentItemWithActionsProps
> = ({ commitment, onComplete, onSnooze, onDelegate, isCompact = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(false);
  const [showSuccessRing, setShowSuccessRing] = useState(false);

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCompleting(true);
    setShowSuccessRing(true);

    // Trigger success animation then callback
    setTimeout(() => {
      onComplete(commitment.id);
    }, 600);
  };

  const handleSnooze = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSnoozed(true);

    // Animate then callback
    setTimeout(() => {
      onSnooze(commitment.id);
      setIsSnoozed(false);
    }, 400);
  };

  const handleDelegate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelegate(commitment.id);
  };

  if (isCompact) {
    // Compact view for collapsed panel
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 5 }}
        animate={{
          opacity: isCompleting ? 0 : 1,
          y: 0,
          scale: isCompleting ? 0.95 : 1,
        }}
        exit={{ opacity: 0, scale: 0.9, height: 0 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group/item"
      >
        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 py-1">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover/item:bg-emerald-400 transition-colors"
            animate={{
              scale: showSuccessRing ? [1, 1.5, 0] : 1,
              opacity: showSuccessRing ? [1, 0.5, 0] : 1,
            }}
            transition={{ duration: 0.6 }}
          />
          <span
            className={`truncate text-xs font-medium tracking-wide transition-all ${
              isCompleting ? "line-through opacity-50" : ""
            }`}
          >
            {commitment.title}
          </span>
        </div>
      </motion.div>
    );
  }

  // Full view with action buttons
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: isCompleting ? 0.5 : 1,
        scale: isCompleting ? 0.98 : isSnoozed ? 0.95 : 1,
        x: isSnoozed ? 10 : 0,
      }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.3, layout: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group/item"
    >
      {/* Success Ring Effect */}
      <AnimatePresence>
        {showSuccessRing && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 2, opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-xl border-2 border-emerald-500 pointer-events-none z-20"
          />
        )}
      </AnimatePresence>

      <div
        className={`p-3.5 rounded-xl border transition-all ${
          isCompleting
            ? "bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30"
            : "bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-md"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.p
              className={`text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1 transition-all ${
                isCompleting ? "line-through opacity-50" : ""
              }`}
              animate={{ x: isCompleting ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {commitment.title}
            </motion.p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>
                To:{" "}
                <span className="font-medium text-zinc-600 dark:text-zinc-400">
                  {commitment.assignee}
                </span>
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <span
                className={`font-medium ${
                  commitment.status === "overdue"
                    ? "text-red-600 dark:text-red-400"
                    : ""
                }`}
              >
                {commitment.dueDate}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <AnimatePresence>
              {isHovered && !isCompleting && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex items-center gap-1"
                >
                  {/* Complete Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleComplete}
                    className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center transition-colors shadow-sm hover:shadow"
                    title="Complete"
                  >
                    <Check size={14} strokeWidth={2.5} />
                  </motion.button>

                  {/* Snooze Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSnooze}
                    className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center transition-colors shadow-sm hover:shadow"
                    title="Snooze"
                  >
                    <Clock size={14} strokeWidth={2} />
                  </motion.button>

                  {/* Delegate Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelegate}
                    className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 flex items-center justify-center transition-colors shadow-sm hover:shadow"
                    title="Delegate"
                  >
                    <UserPlus size={14} strokeWidth={2} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Overdue Badge */}
            {commitment.status === "overdue" && !isCompleting && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800/30"
              >
                OD
              </motion.span>
            )}
          </div>
        </div>

        {/* Completing Success Message */}
        <AnimatePresence>
          {isCompleting && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Check size={12} />
              </motion.div>
              <span>Completed!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
