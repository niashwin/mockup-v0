import { motion, AnimatePresence } from "motion/react";
import { useIsFocusMode } from "@stores/memory-store";

/**
 * Focus Mode Overlay
 *
 * Dark overlay that appears when in focus mode.
 * Uses pointer-events-none to allow scroll pass-through.
 * Cards handle their own click events for exit.
 */
export function FocusModeOverlay() {
  const isFocusMode = useIsFocusMode();

  return (
    <AnimatePresence>
      {isFocusMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute inset-0 bg-black z-20 pointer-events-none"
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}

/**
 * Current Week Indicator
 *
 * A glowing white/cyan bar that marks the current week in focus mode.
 * Helps users orient themselves and indicates that anything to the right
 * (future weeks) is tentative and subject to change.
 */
interface CurrentWeekIndicatorProps {
  currentWeekIndex: number;
  columnWidth: number;
}

export function CurrentWeekIndicator({
  currentWeekIndex,
  columnWidth,
}: CurrentWeekIndicatorProps) {
  const isFocusMode = useIsFocusMode();

  if (!isFocusMode) return null;

  // Position at the right edge of the current week column
  const leftPosition = (currentWeekIndex + 1) * columnWidth;

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute top-0 bottom-0 z-25 pointer-events-none"
      style={{ left: leftPosition - 2 }}
    >
      {/* Main indicator line */}
      <div className="relative h-full w-1">
        {/* Glow effect */}
        <div className="absolute inset-0 w-1 bg-white/30 blur-sm" />
        {/* Solid core */}
        <div className="absolute inset-0 w-[2px] bg-white/70 left-[1px]" />
        {/* Accent highlight */}
        <div className="absolute inset-0 w-[1px] bg-accent/50 left-[2px]" />
      </div>

      {/* "Now" label */}
      <div className="absolute top-2 -translate-x-1/2 left-1/2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.2 }}
          className="px-1.5 py-0.5 bg-white/90 dark:bg-white/80 rounded text-[9px] font-bold uppercase tracking-wider text-black shadow-lg"
        >
          Now
        </motion.div>
      </div>

      {/* "Future" indicator on right side */}
      <div className="absolute top-2 left-4">
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ delay: 0.25, duration: 0.2 }}
          className="text-[8px] font-medium uppercase tracking-wider text-white/50 whitespace-nowrap"
        >
          Tentative →
        </motion.div>
      </div>
    </motion.div>
  );
}
