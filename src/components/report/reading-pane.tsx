import { motion, useScroll, useSpring } from "motion/react";
import { useRef, useEffect, useMemo } from "react";
import { staggerContainer } from "@lib/motion";
import { ReportHeader } from "./report-header";
import { ReportContent } from "./report-content";
import { LeadershipDigest } from "./leadership-digest";
import { HighlightedContent, CommentLayer } from "@components/comments";
import { useCommentStore } from "@stores/comment-store";
import { cn } from "@lib/utils";
import type { WeeklyReport } from "@data/mock-reports";

interface ReadingPaneProps {
  report: WeeklyReport | null;
  onViewHistory?: () => void;
}

export function ReadingPane({ report, onViewHistory }: ReadingPaneProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const positioningRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const { activeHighlightId, highlights } = useCommentStore();

  // Check if there are comments for this report
  const reportHighlights = useMemo(
    () => (report ? highlights.filter((h) => h.reportId === report.id) : []),
    [highlights, report],
  );
  const hasComments = reportHighlights.length > 0;

  // Auto-scroll to active highlight
  useEffect(() => {
    if (
      !activeHighlightId ||
      !contentRef.current ||
      !scrollContainerRef.current
    )
      return;

    const highlight = highlights.find((h) => h.id === activeHighlightId);
    if (!highlight) return;

    const walker = document.createTreeWalker(
      contentRef.current,
      NodeFilter.SHOW_TEXT,
    );

    let currentOffset = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const nodeLength = node.length;

      if (currentOffset + nodeLength > highlight.startOffset) {
        const range = document.createRange();
        range.setStart(node, highlight.startOffset - currentOffset);
        range.setEnd(
          node,
          Math.min(highlight.endOffset - currentOffset, nodeLength),
        );
        const rect = range.getBoundingClientRect();
        const containerRect =
          scrollContainerRef.current.getBoundingClientRect();

        const scrollTop =
          scrollContainerRef.current.scrollTop +
          rect.top -
          containerRect.top -
          containerRect.height / 3;

        scrollContainerRef.current.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
        break;
      }
      currentOffset += nodeLength;
    }
  }, [activeHighlightId, highlights]);

  if (!report) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-px bg-border mx-auto mb-6" />
          <p className="text-heading font-medium text-muted-foreground">
            Select a report to read
          </p>
          <div className="w-24 h-px bg-border mx-auto mt-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Reading progress indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1px] bg-accent origin-left z-10"
        style={{ scaleX }}
      />

      {/* Scrollable content area */}
      <div ref={scrollContainerRef} className="h-full overflow-y-auto">
        {/* Relative container for absolute positioning of comment layer */}
        <div ref={positioningRef} className="relative min-h-full">
          {/*
            Content is viewport-centered to align with the chatbox.
            Chatbox: fixed left-1/2 -translate-x-1/2, width 640px
            Report: marginLeft offsets for nav (52px) + sidebar (220px) = 272px
          */}
          <motion.div
            className={cn(
              "w-full max-w-[640px] px-8 py-12 lg:px-12 lg:py-16",
              // Add right padding when comments exist to make room
              hasComments && "pr-8",
            )}
            style={{
              marginLeft: "calc((100vw - 640px) / 2 - 272px)",
            }}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            key={report.id}
          >
            <ReportHeader report={report} onViewHistory={onViewHistory} />

            {/* All content wrapped in HighlightedContent for universal commenting */}
            <HighlightedContent reportId={report.id} contentRef={contentRef}>
              {report.reportType === "leadership-digest" ? (
                <LeadershipDigest report={report} />
              ) : (
                <ReportContent content={report.content} />
              )}
            </HighlightedContent>

            {/* Footer flourish */}
            <div className="mt-20 pt-10 border-t border-border-subtle flex items-center justify-center gap-4">
              <div className="w-8 h-px bg-accent/30" />
              <span className="text-micro text-muted-foreground/50 uppercase tracking-widest">
                End of Report
              </span>
              <div className="w-8 h-px bg-accent/30" />
            </div>
          </motion.div>

          {/* Comment layer - INSIDE scroll container, positioned absolutely */}
          {/* Cards scroll with document content like Google Docs */}
          {hasComments && (
            <CommentLayer
              contentRef={contentRef}
              positioningRef={positioningRef}
              reportId={report.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
