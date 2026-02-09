import { useEffect, useState, useId } from "react";
import { motion } from "motion/react";
import { cn } from "@lib/utils";
import type { LoadingPhase } from "@stores/chatbox-store";

interface ThinkingIndicatorProps {
  phase: LoadingPhase | null;
  context: string | null;
}

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 bg-muted-foreground rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </span>
  );
}

interface TimerProps {
  phase: LoadingPhase;
  context: string | null;
}

function Timer({ phase, context }: TimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function getStatusLabel(): string {
    if (phase === "reading") return "Reading";
    if (phase === "analyzing" && context) return context;
    return "Thinking";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div
        className={cn(
          "bg-surface rounded-2xl rounded-bl-md px-4 py-3",
          "min-w-[140px]",
        )}
      >
        <div className="flex flex-col gap-1">
          <span className="text-caption text-muted-foreground">
            {getStatusLabel()}
            <LoadingDots />
          </span>

          {elapsedSeconds > 0 && (
            <span className="text-micro text-muted-foreground/60">
              {elapsedSeconds}s
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ThinkingIndicator({ phase, context }: ThinkingIndicatorProps) {
  const id = useId();

  // When phase is null, don't render anything
  if (phase === null) {
    return null;
  }

  // Key on phase to reset timer when phase becomes non-null
  return <Timer key={`${id}-${phase}`} phase={phase} context={context} />;
}
