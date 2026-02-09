import React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import {
  Brain,
  Sparkles,
  Zap,
  Image,
  FileText,
  Link,
  Hash,
  User,
} from "lucide-react";

export interface Bubble {
  id: number;
  label: string;
  size: "xs" | "sm" | "md" | "lg" | "xl";
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  gradient: string;
  icon?: React.ElementType;
  delay: number;
}

interface MemoryBubblesProps {
  onBubbleClick?: (bubble: Bubble) => void;
}

export const MemoryBubbles: React.FC<MemoryBubblesProps> = ({
  onBubbleClick,
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // "Watery" spring physics - low stiffness, moderate damping for fluid lag
  const springConfig = { damping: 20, stiffness: 100, mass: 0.8 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Dynamic watery highlight
  const background = useMotionTemplate`radial-gradient(600px circle at ${x}px ${y}px, rgba(56, 189, 248, 0.1), transparent 80%)`;

  const bubbles: Bubble[] = [
    // Center Core
    {
      id: 1,
      label: "Vision",
      size: "xl",
      x: 50,
      y: 50,
      gradient:
        "from-fuchsia-500/20 to-purple-600/20 text-fuchsia-900 dark:text-fuchsia-100 ring-fuchsia-500/30",
      icon: Brain,
      delay: 0,
    },

    // Top Right - Strategy
    {
      id: 2,
      label: "Q3 Goals",
      size: "lg",
      x: 75,
      y: 25,
      gradient:
        "from-blue-500/20 to-cyan-500/20 text-blue-900 dark:text-blue-100 ring-blue-500/30",
      icon: Zap,
      delay: 0.1,
    },
    {
      id: 3,
      label: "Growth",
      size: "sm",
      x: 85,
      y: 15,
      gradient:
        "from-blue-400/10 to-blue-500/10 text-blue-800 dark:text-blue-200 ring-blue-400/20",
      delay: 0.2,
    },

    // Bottom Right - Product
    {
      id: 4,
      label: "Mobile App",
      size: "lg",
      x: 70,
      y: 70,
      gradient:
        "from-emerald-500/20 to-teal-500/20 text-emerald-900 dark:text-emerald-100 ring-emerald-500/30",
      icon: FileText,
      delay: 0.15,
    },
    {
      id: 5,
      label: "Beta",
      size: "md",
      x: 82,
      y: 80,
      gradient:
        "from-emerald-400/10 to-teal-400/10 text-emerald-800 dark:text-emerald-200 ring-emerald-400/20",
      icon: Hash,
      delay: 0.25,
    },

    // Bottom Left - Research
    {
      id: 6,
      label: "User Study",
      size: "lg",
      x: 25,
      y: 75,
      gradient:
        "from-amber-500/20 to-orange-500/20 text-amber-900 dark:text-amber-100 ring-amber-500/30",
      icon: User,
      delay: 0.1,
    },
    {
      id: 7,
      label: "Feedback",
      size: "sm",
      x: 15,
      y: 85,
      gradient:
        "from-amber-400/10 to-orange-400/10 text-amber-800 dark:text-amber-200 ring-amber-400/20",
      delay: 0.3,
    },
    {
      id: 8,
      label: "Survey",
      size: "xs",
      x: 35,
      y: 88,
      gradient:
        "from-amber-300/10 to-orange-300/10 text-amber-800 dark:text-amber-200 ring-amber-300/20",
      delay: 0.4,
    },

    // Top Left - Design
    {
      id: 9,
      label: "Design Sys",
      size: "md",
      x: 25,
      y: 30,
      gradient:
        "from-pink-500/20 to-rose-500/20 text-pink-900 dark:text-pink-100 ring-pink-500/30",
      icon: Image,
      delay: 0.2,
    },
    {
      id: 10,
      label: "Icons",
      size: "xs",
      x: 15,
      y: 20,
      gradient:
        "from-pink-400/10 to-rose-400/10 text-pink-800 dark:text-pink-200 ring-pink-400/20",
      delay: 0.35,
    },

    // Floating Connectors
    {
      id: 11,
      label: "API",
      size: "sm",
      x: 60,
      y: 40,
      gradient:
        "from-neutral-500/10 to-neutral-600/10 text-foreground ring-border",
      icon: Link,
      delay: 0.5,
    },
    {
      id: 12,
      label: "Docs",
      size: "xs",
      x: 40,
      y: 60,
      gradient:
        "from-neutral-500/10 to-neutral-600/10 text-foreground ring-border",
      delay: 0.55,
    },
    {
      id: 13,
      label: "Sarah",
      size: "sm",
      x: 45,
      y: 20,
      gradient:
        "from-violet-500/10 to-purple-500/10 text-violet-800 dark:text-violet-200 ring-violet-500/20",
      icon: User,
      delay: 0.6,
    },
  ];

  const connections = [
    [1, 2],
    [1, 4],
    [1, 6],
    [1, 9], // Core radiation
    [2, 3], // Strategy cluster
    [4, 5],
    [4, 11], // Product cluster
    [6, 7],
    [6, 8], // Research cluster
    [9, 10],
    [9, 13], // Design cluster
    [11, 2], // Cross links
    [12, 6],
  ];

  const getSize = (size: string) => {
    switch (size) {
      case "xl":
        return 140;
      case "lg":
        return 110;
      case "md":
        return 90;
      case "sm":
        return 70;
      case "xs":
        return 50;
      default:
        return 80;
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="h-full w-full relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white/40 to-white/10 dark:from-neutral-900/40 dark:to-black/20 backdrop-blur-3xl border border-white/40 dark:border-white/5 shadow-2xl group/container"
    >
      {/* Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

      {/* Mouse-following "Fluid" Highlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-soft-light dark:mix-blend-overlay z-0"
        style={{ background }}
      />

      <div className="absolute top-8 left-8 flex items-center gap-3 opacity-60 pointer-events-none z-20">
        <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
          <Sparkles size={14} className="text-muted-foreground" />
        </div>
        <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Memory Stream
        </span>
      </div>

      <div className="relative w-full h-full z-10">
        {/* SVG Connections Layer - Elegant Curves */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          {connections.map(([startId, endId], i) => {
            const start = bubbles.find((b) => b.id === startId);
            const end = bubbles.find((b) => b.id === endId);
            if (!start || !end) return null;

            return (
              <motion.path
                key={i}
                d={`M ${start.x}% ${start.y}% C ${(start.x + end.x) / 2}% ${start.y}% ${(start.x + end.x) / 2}% ${end.y}% ${end.x}% ${end.y}%`}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="1.5"
                className="text-muted-foreground"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 2,
                  delay: 0.5 + i * 0.1,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </svg>

        {/* Bubbles Layer */}
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
            initial={{
              opacity: 0,
              scale: 0.5,
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: "-50%",
              y: "-50%",
            }}
            transition={{
              opacity: {
                duration: 1.5,
                delay: b.delay,
                ease: [0.22, 1, 0.36, 1],
              },
              scale: {
                type: "spring",
                damping: 25,
                stiffness: 80,
                delay: b.delay,
              },
            }}
          >
            {/* Floating animation container with visuals */}
            <motion.div
              className={`w-full h-full rounded-full flex flex-col items-center justify-center backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg cursor-pointer group bg-gradient-to-br ${b.gradient}`}
              animate={{
                y: [0, -8, 0, 6, 0],
                x: [0, 5, 0, -4, 0],
                rotate: [0, 1.5, 0, -1, 0],
                scale: [1, 1.02, 1, 0.98, 1],
              }}
              transition={{
                duration: 8 + b.id * 0.7, // Varying duration per bubble
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1], // Smooth sine-like timing
              }}
              whileHover={{
                scale: 1.15,
                y: -5,
                rotate: 0,
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onBubbleClick?.(b)}
            >
              {/* Inner Shine */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              {b.icon && (
                <div className="mb-1 opacity-80 group-hover:scale-110 transition-transform duration-300">
                  <b.icon
                    size={b.size === "xl" ? 32 : b.size === "lg" ? 24 : 16}
                    strokeWidth={1.5}
                  />
                </div>
              )}
              <span
                className={`text-center leading-none font-medium tracking-tight px-2 ${b.size === "xs" ? "text-[10px]" : "text-xs"}`}
              >
                {b.label}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
