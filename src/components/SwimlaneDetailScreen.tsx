import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  ArrowLeft,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  Filter,
  MessageSquare,
  FileText,
  CheckCircle2,
  GitCommit,
  Users,
  Activity,
  Sparkles,
  MoreHorizontal,
  Calendar,
  ChevronDown,
  X,
  Share2,
  ExternalLink,
} from "lucide-react";
import { SwimlaneMeta, TimelineItem } from "../data";

// --- Types & Interfaces ---

interface SwimlaneDetailProps {
  lane: SwimlaneMeta;
  timelineData: TimelineItem[];
  onBack: () => void;
}

type PanelMode = "details" | "comments";

// Mocking date parsing for the demo
const parseMockDate = (timestamp: string): number => {
  const now = new Date();
  const currentYear = 2026; // Hardcoded for demo context as per prompt date

  if (timestamp.includes("Today")) return now.getTime();
  if (timestamp.includes("Yesterday")) return now.getTime() - 86400000;
  if (timestamp.includes("days ago")) {
    const days = parseInt(timestamp.split(" ")[0]);
    return now.getTime() - days * 86400000;
  }
  if (timestamp.includes("In 15 mins")) return now.getTime() + 15 * 60000;

  // Try standard date parsing
  const parsed = Date.parse(timestamp);
  if (!isNaN(parsed)) return parsed;

  // Handle "Jan 30" (add current year)
  const parts = timestamp.split(" ");
  if (parts.length >= 2) {
    const monthStr = parts[0];
    const dayStr = parts[1].replace(",", "");
    const yearStr = parts[2] || currentYear;
    const constructed = `${monthStr} ${dayStr}, ${yearStr}`;
    const p = Date.parse(constructed);
    if (!isNaN(p)) return p;
  }

  return now.getTime();
};

// --- Timeline Components ---

const EventBubble = ({
  item,
  x,
  isSelected,
  zoomLevel,
  onClick,
}: {
  item: TimelineItem;
  x: number;
  isSelected: boolean;
  zoomLevel: number;
  onClick: () => void;
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return Users;
      case "decision":
        return GitCommit;
      case "commitment":
        return CheckCircle2;
      case "document":
        return FileText;
      case "alert":
        return Activity;
      default:
        return Activity;
    }
  };

  const getColor = (type: string, criticality?: string) => {
    if (criticality === "critical")
      return "bg-red-500 text-white border-red-500 ring-red-500/30";
    if (criticality === "urgent")
      return "bg-orange-500 text-white border-orange-500 ring-orange-500/30";

    switch (type) {
      case "decision":
        return "bg-emerald-500 text-white border-emerald-500 ring-emerald-500/20";
      case "commitment":
        return "bg-amber-500 text-white border-amber-500 ring-amber-500/20";
      case "meeting":
        return "bg-blue-500 text-white border-blue-500 ring-blue-500/20";
      default:
        return "bg-neutral-500 text-white border-neutral-500 ring-neutral-500/20";
    }
  };

  const Icon = getIcon(item.type);
  const colorClass = getColor(item.type, item.criticality);

  // Staggered height to avoid overlapping labels
  const stemHeight = isSelected ? 80 : 40 + (item.title.length % 3) * 20;

  return (
    <motion.div
      className="absolute bottom-1/2 flex flex-col items-center pointer-events-none"
      style={{ left: x }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Label - Visibility depends on Zoom or Selection */}
      <AnimatePresence>
        {(zoomLevel > 1.5 || isSelected) && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mb-2 pointer-events-auto cursor-pointer"
            onClick={onClick}
          >
            <div
              className={`bg-card dark:bg-neutral-900 border border-border shadow-lg rounded-[7px] p-3 min-w-[200px] max-w-[280px] ${isSelected ? "ring-2 ring-emerald-500/50 border-emerald-500/50" : ""} ${item.criticality === "critical" ? "ring-2 ring-red-500/50 border-red-500" : ""}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {item.type}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {item.timestamp}
                </span>
              </div>
              <div className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                {item.title}
              </div>
              {isSelected && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                  <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[8px] font-bold">
                    {item.actor.charAt(0)}
                  </div>
                  {item.actor}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simplified Label for lower zoom */}
      {zoomLevel <= 1.5 && !isSelected && (
        <motion.div
          className={`mb-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm px-2 py-1 rounded-[7px] border text-xs font-medium pointer-events-auto cursor-pointer whitespace-nowrap shadow-sm hover:scale-105 transition-transform ${item.criticality === "critical" ? "border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-bold" : item.criticality === "urgent" ? "border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400" : "border-border text-muted-foreground"}`}
          onClick={onClick}
        >
          {item.title} {item.criticality === "critical" && "!"}
        </motion.div>
      )}

      {/* Bubble */}
      <div
        onClick={onClick}
        className={`w-4 h-4 rounded-full ${colorClass} shadow-lg cursor-pointer pointer-events-auto z-10 hover:scale-125 transition-transform duration-300 relative ${isSelected ? "scale-125 ring-4" : ""} ${item.criticality === "critical" ? "animate-pulse" : ""}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={8} />
        </div>
      </div>

      {/* Stem */}
      <div
        className="w-px bg-neutral-300 dark:bg-neutral-700"
        style={{ height: stemHeight }}
      />

      {/* Anchor point on timeline */}
      <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 -mb-[3px]" />
    </motion.div>
  );
};

// --- Main Screen Component ---

export const SwimlaneDetailScreen = ({
  lane,
  timelineData,
  onBack,
}: SwimlaneDetailProps) => {
  const [zoom, setZoom] = useState(1.4);
  const [panX, setPanX] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>("details");
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragBounds, setDragBounds] = useState({ left: -800, right: 800 });
  const [containerWidth, setContainerWidth] = useState(0);

  // Process timeline data with coordinates
  // Sort by date descending (newest right? actually usually time flows left->right, so oldest left)
  // Let's assume left is past, right is future/present.
  const processedData = useMemo(() => {
    const data = timelineData.map((t) => ({
      ...t,
      parsedDate: parseMockDate(t.timestamp),
    }));
    data.sort((a, b) => a.parsedDate - b.parsedDate);

    // Normalize dates to 0-1 range for initial layout
    const minDate = data[0]?.parsedDate || 0;
    const maxDate = data[data.length - 1]?.parsedDate || 100;
    const range = maxDate - minDate || 1;

    return data.map((t) => ({
      ...t,
      normalizedPos: (t.parsedDate - minDate) / range,
    }));
  }, [timelineData]);

  // Initial centering
  useEffect(() => {
    // Center the timeline initially
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
      setPanX(containerRef.current.clientWidth / 2 - 400); // Rough centering
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      const newZoom = direction === "in" ? prev * 1.2 : prev / 1.2;
      return Math.min(Math.max(newZoom, 0.5), 5); // Clamp zoom
    });
  };

  const selectedEvent = useMemo(
    () => timelineData.find((t) => t.id === selectedEventId) || timelineData[0], // Default to first/latest
    [selectedEventId, timelineData],
  );

  // Generate X coordinates based on pan/zoom
  // Base width 800px * zoom
  const timelineWidth = 1000 * zoom;

  useEffect(() => {
    if (!containerWidth || processedData.length === 0) return;
    const spread = 200 * zoom;
    const startOffset = 100;
    const leftmostX = startOffset;
    const rightmostX = startOffset + (processedData.length - 1) * spread;
    const padding = 200;
    const rightBound = padding - leftmostX;
    const leftBound = containerWidth - padding - rightmostX;
    setDragBounds({
      left: Math.min(leftBound, -1000),
      right: Math.max(rightBound, 1000),
    });
    const mid = (leftmostX + rightmostX) / 2;
    const centered = containerWidth / 2 - mid;
    setPanX(centered);
  }, [containerWidth, processedData.length, zoom]);

  // Drag handling
  const handlePan = (info: any) => {
    setPanX((prev) => prev + info.delta.x);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "blocked":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50";
      case "on-track":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50";
      case "delayed":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50";
      default:
        return "bg-secondary text-foreground border-border";
    }
  };

  const getDotColor = (status: string) => {
    switch (status) {
      case "blocked":
        return "bg-red-500";
      case "on-track":
        return "bg-emerald-500";
      case "delayed":
        return "bg-orange-500";
      case "finished":
        return "bg-neutral-400";
      default:
        return "bg-neutral-400";
    }
  };

  return (
    <motion.div
      className="flex flex-col h-full bg-background overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // smooth spatial transition
    >
      {/* 1. Header (Fixed) */}
      <header className="h-20 shrink-0 border-b border-border bg-card/80 dark:bg-neutral-900/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-8 z-30 relative">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-neutral-800 transition-all"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-foreground">{lane.name}</h1>
              <span
                className={`w-2 h-2 rounded-full ${getDotColor(lane.status)}`}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="max-w-[300px] truncate">{lane.description}</span>
              <span>•</span>
              <span className="font-medium bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                Last 90 Days
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-secondary rounded-[7px] p-1 border border-border">
            <button
              onClick={() => handleZoom("out")}
              className="p-1.5 hover:bg-card dark:hover:bg-neutral-700 rounded-[7px] text-muted-foreground transition-colors"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="px-2 text-xs font-mono text-muted-foreground"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => handleZoom("in")}
              className="p-1.5 hover:bg-card dark:hover:bg-neutral-700 rounded-[7px] text-muted-foreground transition-colors"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Filter size={18} />
          </button>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

          <div className="flex items-center bg-secondary rounded-[7px] p-0.5 border border-border">
            <button
              onClick={() => setPanelMode("details")}
              className={`px-3 py-1.5 text-xs font-medium rounded-[7px] transition-all ${panelMode === "details" ? "bg-card dark:bg-neutral-700 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Details
            </button>
            <button
              onClick={() => setPanelMode("comments")}
              className={`px-3 py-1.5 text-xs font-medium rounded-[7px] transition-all ${panelMode === "comments" ? "bg-card dark:bg-neutral-700 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Comments
            </button>
          </div>
        </div>
      </header>

      {/* 2. Horizontal Status Bar */}
      <div
        className={`shrink-0 border-b border-border ${getStatusColor(lane.status)}`}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-8 py-3 flex items-center justify-between gap-8"
        >
          {/* Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${lane.status === "blocked" ? "bg-red-400" : lane.status === "delayed" ? "bg-orange-400" : "bg-emerald-400"}`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${lane.status === "blocked" ? "bg-red-500" : lane.status === "delayed" ? "bg-orange-500" : "bg-emerald-500"}`}
                ></span>
              </span>
              <span className="text-sm font-bold capitalize">
                {lane.status.replace("-", " ")}
              </span>
            </div>
            <div className="h-3 w-px bg-current opacity-20" />
            <p className="text-xs opacity-70 font-medium max-w-md line-clamp-1">
              {lane.summary || "No summary available"}
            </p>
          </div>

          {/* Stakeholders */}
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
              Stakeholders
            </span>
            <div className="flex -space-x-1.5">
              <div
                className="w-6 h-6 rounded-full bg-card dark:bg-neutral-800 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-[9px] font-bold shadow-sm relative z-20"
                title={`Owner: ${lane.owner}`}
              >
                {lane.owner.charAt(0)}
              </div>
              <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-[8px] font-bold opacity-90 relative z-10 text-muted-foreground">
                JD
              </div>
              <div className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-600 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-[8px] font-bold opacity-90 relative z-0 text-muted-foreground">
                MK
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Timeline Canvas */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing bg-background dark:bg-neutral-950"
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Zoom with Ctrl/Cmd + wheel
            handleZoom(e.deltaY > 0 ? "out" : "in");
          } else {
            e.preventDefault();
            // Horizontal scroll with wheel (pan left/right)
            setPanX((prev) => {
              const delta = e.deltaY * 1.5; // Scroll speed
              const newPan = prev - delta;
              // More generous bounds for scrolling
              return Math.max(
                Math.min(newPan, dragBounds.right),
                dragBounds.left,
              );
            });
          }
        }}
      >
        {/* Timeline Axis */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-300 dark:bg-neutral-700 z-10" />

        <motion.div
          className="absolute inset-0 flex items-center h-full"
          drag="x"
          dragConstraints={dragBounds}
          onDrag={(e, info) => handlePan(info)}
          style={{ x: panX, cursor: "grab" }}
          whileTap={{ cursor: "grabbing" }}
        >
          {/* Connecting Lines between boxes */}
          <svg
            className="absolute w-full h-full pointer-events-none"
            style={{ left: 0, top: 0 }}
          >
            {processedData.map((item, index) => {
              if (index === processedData.length - 1) return null;

              const spread = 200 * zoom;
              const startOffset = 100;
              const boxWidth = 200;

              const x1 = startOffset + index * spread + boxWidth;
              const x2 = startOffset + (index + 1) * spread;
              const y = "50%";

              return (
                <line
                  key={`line-${item.id}`}
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="text-neutral-300 dark:text-neutral-600 opacity-50"
                />
              );
            })}
          </svg>

          {/* Events - Simple Box Layout */}
          {processedData.map((item, index) => {
            const spread = 200 * zoom;
            const startOffset = 100;
            const xPos = startOffset + index * spread;
            const isSelected = selectedEventId === item.id;

            const getIcon = (type: string) => {
              switch (type) {
                case "meeting":
                  return Users;
                case "decision":
                  return GitCommit;
                case "commitment":
                  return CheckCircle2;
                case "document":
                  return FileText;
                default:
                  return Activity;
              }
            };

            const getBgColor = (type: string, criticality?: string) => {
              if (criticality === "critical")
                return "bg-red-500/10 border-red-500 hover:bg-red-500/20";
              if (criticality === "urgent")
                return "bg-orange-500/10 border-orange-500 hover:bg-orange-500/20";

              switch (type) {
                case "decision":
                  return "bg-emerald-500/10 border-emerald-500 hover:bg-emerald-500/20";
                case "commitment":
                  return "bg-amber-500/10 border-amber-500 hover:bg-amber-500/20";
                case "meeting":
                  return "bg-blue-500/10 border-blue-500 hover:bg-blue-500/20";
                default:
                  return "bg-neutral-500/10 border-neutral-500 hover:bg-neutral-500/20";
              }
            };

            const Icon = getIcon(item.type);
            const bgColor = getBgColor(item.type, item.criticality);

            return (
              <motion.div
                key={item.id}
                className="absolute top-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                style={{ left: xPos }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedEventId(item.id)}
              >
                <div
                  className={`bg-card dark:bg-neutral-900 border-2 ${bgColor} rounded-[7px] p-5 shadow-lg min-w-[200px] max-w-[240px] transition-all ${isSelected ? "ring-2 ring-emerald-500 scale-105" : ""} ${item.criticality === "critical" ? "animate-pulse" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-5 h-5 rounded-full ${bgColor.split(" ")[0].replace("/10", "")} flex items-center justify-center`}
                    >
                      <Icon size={11} className="text-white" />
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                      {item.type}
                    </span>
                  </div>

                  <div className="font-semibold text-foreground text-xs mb-2 line-clamp-2">
                    {item.title}
                  </div>

                  <div className="text-[9px] text-muted-foreground font-mono">
                    {item.timestamp}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Gradient fade on sides */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background/50 dark:from-neutral-950/50 to-transparent pointer-events-none z-30" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background/50 dark:from-neutral-950/50 to-transparent pointer-events-none z-30" />
      </div>

      {/* 3. Bottom Panel (Fixed) */}
      <motion.div
        className="h-[32%] shrink-0 bg-card dark:bg-neutral-900 border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20 relative flex flex-col"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", damping: 20 }}
      >
        {panelMode === "details" ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Summary */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded">
                    {selectedEvent.type}
                  </span>
                  <span className="text-muted-foreground text-xs font-mono">
                    {selectedEvent.timestamp}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                  {selectedEvent.title}
                </h2>

                <div className="prose dark:prose-invert prose-sm max-w-none text-muted-foreground">
                  <p className="mb-4">{selectedEvent.summary}</p>
                  <p>
                    This event is significant because it marks a transition in
                    the project phase. Impact affects {lane.owner}'s team and
                    downstream dependencies.
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-200 flex items-center justify-center text-xs font-bold text-muted-foreground">
                      AL
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-200 flex items-center justify-center text-xs font-bold text-muted-foreground">
                      SC
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Involved in this event
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Evidence Sidebar */}
            <div className="w-96 border-l border-muted dark:border-neutral-800 bg-background/50 dark:bg-neutral-900/50 p-6 overflow-y-auto">
              <h3 className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2">
                <Sparkles size={12} className="text-emerald-500" />
                Evidence & Artifacts
              </h3>

              <div className="space-y-3">
                {selectedEvent.evidence?.map((ev, i) => (
                  <a
                    key={i}
                    href="#"
                    className="block p-3 bg-card dark:bg-neutral-800 border border-border rounded-[7px] hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {ev.type.includes("Slack") ? (
                          <MessageSquare
                            size={12}
                            className="text-muted-foreground"
                          />
                        ) : (
                          <FileText
                            size={12}
                            className="text-muted-foreground"
                          />
                        )}
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {ev.type}
                        </span>
                      </div>
                      <ExternalLink
                        size={10}
                        className="text-muted-foreground/40 group-hover:text-emerald-500 transition-colors"
                      />
                    </div>
                    <p className="text-xs font-medium text-foreground mb-1">
                      "{ev.preview}"
                    </p>
                    <div className="text-[10px] text-muted-foreground truncate hover:underline">
                      {ev.url}
                    </div>
                  </a>
                )) || (
                  <div className="text-xs text-muted-foreground italic py-4 text-center">
                    No linked evidence found.
                  </div>
                )}

                <div className="pt-4 mt-4 border-t border-border">
                  <div className="text-[10px] text-muted-foreground mb-2">
                    Related Commitments
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 rounded">
                    <CheckCircle2 size={12} className="text-amber-500" />
                    Update Strategy Doc
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-background/50 dark:bg-neutral-900/50">
            <div className="text-center max-w-sm">
              <div className="w-12 h-12 bg-muted dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <MessageSquare size={20} />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                Comments will appear here
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Discuss this event with your team. Context will be preserved in
                the memory stream.
              </p>
              <div className="bg-card dark:bg-neutral-800 border border-border rounded-[7px] p-3 w-full opacity-60 cursor-not-allowed">
                <div className="text-xs text-muted-foreground text-left">
                  Write a comment...
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
