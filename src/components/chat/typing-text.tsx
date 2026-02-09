import { useState, useEffect, useId } from "react";
import { motion } from "motion/react";

interface TypingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  renderContent?: (displayedText: string) => React.ReactNode;
}

interface InternalTypingTextProps extends TypingTextProps {
  textKey: string;
}

function InternalTypingText({
  text,
  speed = 25,
  onComplete,
  className,
  renderContent,
}: InternalTypingTextProps) {
  const [displayedCount, setDisplayedCount] = useState(0);
  const isComplete = displayedCount >= text.length;

  useEffect(() => {
    if (displayedCount >= text.length) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedCount((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedCount, text.length, speed, onComplete]);

  const displayedText = text.slice(0, displayedCount);

  const cursor = !isComplete && (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="inline-block w-0.5 h-4 bg-current ml-0.5 align-middle"
    />
  );

  if (renderContent) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={className}
      >
        {renderContent(displayedText)}
        {cursor}
      </motion.div>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {displayedText}
      {cursor}
    </motion.span>
  );
}

export function TypingText(props: TypingTextProps) {
  const id = useId();
  // Use text as key to reset state when text changes
  return (
    <InternalTypingText
      {...props}
      key={`${id}-${props.text}`}
      textKey={props.text}
    />
  );
}
