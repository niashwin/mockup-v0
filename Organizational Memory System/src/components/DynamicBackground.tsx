import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

type TimeOfDay = "morning" | "day" | "evening" | "night";

// Gradient configurations for each time of day
const GRADIENTS: Record<
  TimeOfDay,
  {
    primary: string;
    secondary: string;
    accent: string;
    description: string;
  }
> = {
  morning: {
    primary: "from-amber-50 via-orange-50 to-rose-50",
    secondary: "from-amber-100/30 to-orange-100/30",
    accent: "bg-amber-200/20",
    description: "Warm morning tones",
  },
  day: {
    primary: "from-blue-50 via-sky-50 to-cyan-50",
    secondary: "from-blue-100/30 to-sky-100/30",
    accent: "bg-blue-200/20",
    description: "Bright daylight",
  },
  evening: {
    primary: "from-violet-50 via-purple-50 to-indigo-50",
    secondary: "from-violet-100/30 to-purple-100/30",
    accent: "bg-violet-200/20",
    description: "Cool evening tones",
  },
  night: {
    primary: "from-slate-100 via-zinc-100 to-neutral-100",
    secondary: "from-slate-200/30 to-zinc-200/30",
    accent: "bg-slate-300/20",
    description: "Calm night mode",
  },
};

// Dark mode gradients
const DARK_GRADIENTS: Record<
  TimeOfDay,
  {
    primary: string;
    secondary: string;
    accent: string;
  }
> = {
  morning: {
    primary: "dark:from-amber-950/30 dark:via-orange-950/20 dark:to-zinc-950",
    secondary: "dark:from-amber-900/10 dark:to-orange-900/10",
    accent: "dark:bg-amber-800/10",
  },
  day: {
    primary: "dark:from-blue-950/30 dark:via-sky-950/20 dark:to-zinc-950",
    secondary: "dark:from-blue-900/10 dark:to-sky-900/10",
    accent: "dark:bg-blue-800/10",
  },
  evening: {
    primary: "dark:from-violet-950/30 dark:via-purple-950/20 dark:to-zinc-950",
    secondary: "dark:from-violet-900/10 dark:to-purple-900/10",
    accent: "dark:bg-violet-800/10",
  },
  night: {
    primary: "dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950",
    secondary: "dark:from-zinc-900/10 dark:to-zinc-900/10",
    accent: "dark:bg-zinc-800/10",
  },
};

/**
 * Determine time of day based on current hour
 */
function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "day";
  if (hour >= 18 && hour < 21) return "evening";
  return "night";
}

interface DynamicBackgroundProps {
  children: React.ReactNode;
  className?: string;
  override?: TimeOfDay;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  children,
  className = "",
  override,
}) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(
    override || getTimeOfDay(),
  );

  // Update time of day periodically
  useEffect(() => {
    if (override) {
      setTimeOfDay(override);
      return;
    }

    const updateTime = () => {
      setTimeOfDay(getTimeOfDay());
    };

    // Check every minute
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [override]);

  const gradient = GRADIENTS[timeOfDay];
  const darkGradient = DARK_GRADIENTS[timeOfDay];

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Base gradient layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 bg-gradient-to-br ${gradient.primary} ${darkGradient.primary}`}
      />

      {/* Secondary gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${gradient.secondary} ${darkGradient.secondary}`}
      />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large ambient blob - top right */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full ${gradient.accent} ${darkGradient.accent} blur-3xl`}
        />

        {/* Medium ambient blob - bottom left */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className={`absolute -bottom-1/4 -left-1/4 w-2/5 h-2/5 rounded-full ${gradient.accent} ${darkGradient.accent} blur-3xl`}
        />

        {/* Small accent blob - center */}
        <motion.div
          animate={{
            x: [-20, 20, -20],
            y: [-10, 10, -10],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full ${gradient.accent} ${darkGradient.accent} blur-3xl`}
        />
      </div>

      {/* Content - flex-1 ensures it fills available space */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
};

/**
 * Hook to get current time of day
 */
export function useTimeOfDay(): TimeOfDay {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return timeOfDay;
}

/**
 * Get gradient classes for the current time of day
 */
export function getTimeGradient(): {
  light: string;
  dark: string;
  accent: string;
} {
  const timeOfDay = getTimeOfDay();
  const gradient = GRADIENTS[timeOfDay];
  const darkGradient = DARK_GRADIENTS[timeOfDay];

  return {
    light: gradient.primary,
    dark: darkGradient.primary,
    accent: `${gradient.accent} ${darkGradient.accent}`,
  };
}

export default DynamicBackground;
