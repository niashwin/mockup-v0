import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  type RefObject,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { CommentCard } from "./comment-card";
import { useCommentStore } from "@stores/comment-store";
import type { CommentHighlight } from "@stores/comment-store";

interface CommentPosition {
  id: string;
  top: number;
}

interface CommentLayerProps {
  contentRef: RefObject<HTMLElement | null>;
  positioningRef: RefObject<HTMLElement | null>;
  reportId: string;
}

/**
 * Calculate comment card positions relative to the positioning ancestor.
 * Cards are positioned at the Y coordinate of their highlighted text.
 * Since this layer is INSIDE the scroll container, no scroll offset is needed.
 */
function calculatePositionsFromDOM(
  element: HTMLElement,
  positioningAncestor: HTMLElement,
  highlights: readonly CommentHighlight[],
): CommentPosition[] {
  const ancestorRect = positioningAncestor.getBoundingClientRect();
  const newPositions: CommentPosition[] = [];

  for (const highlight of highlights) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

    let currentOffset = 0;
    let foundStart = false;
    let range: Range | null = null;

    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const nodeLength = node.length;

      if (!foundStart && currentOffset + nodeLength > highlight.startOffset) {
        range = document.createRange();
        range.setStart(node, highlight.startOffset - currentOffset);
        foundStart = true;
      }

      if (foundStart && currentOffset + nodeLength >= highlight.endOffset) {
        if (range) {
          range.setEnd(
            node,
            Math.min(highlight.endOffset - currentOffset, nodeLength),
          );
        }
        break;
      }

      currentOffset += nodeLength;
    }

    if (range) {
      const rect = range.getBoundingClientRect();
      // Position relative to positioning ancestor (not contentRef)
      // This accounts for ReportHeader and padding above the content
      newPositions.push({
        id: highlight.id,
        top: rect.top - ancestorRect.top,
      });
    }
  }

  // Sort and avoid overlapping - stack cards with minimum gap
  const sortedPositions = [...newPositions].sort((a, b) => a.top - b.top);
  const minGap = 120;

  return sortedPositions.reduce<CommentPosition[]>((acc, pos, index) => {
    if (index === 0) return [pos];
    const prevBottom = acc[index - 1].top + minGap;
    const adjustedTop = pos.top < prevBottom ? prevBottom : pos.top;
    return [...acc, { ...pos, top: adjustedTop }];
  }, []);
}

export function CommentLayer({
  contentRef,
  positioningRef,
  reportId,
}: CommentLayerProps) {
  const { highlights, activeHighlightId, setActiveHighlight } =
    useCommentStore();
  const [positions, setPositions] = useState<CommentPosition[]>([]);

  const reportHighlights = useMemo(
    () => highlights.filter((h) => h.reportId === reportId),
    [highlights, reportId],
  );

  const updatePositions = useCallback(() => {
    const element = contentRef.current;
    const ancestor = positioningRef.current;
    if (!element || !ancestor) return;
    // Use requestAnimationFrame to batch with browser paint
    requestAnimationFrame(() => {
      setPositions(
        calculatePositionsFromDOM(element, ancestor, reportHighlights),
      );
    });
  }, [contentRef, positioningRef, reportHighlights]);

  // Calculate positions after mount and when highlights change
  useEffect(() => {
    updatePositions();
  }, [updatePositions]);

  // Only resize listener needed - scroll listener removed since layer is inside scroll container
  useEffect(() => {
    window.addEventListener("resize", updatePositions);
    return () => {
      window.removeEventListener("resize", updatePositions);
    };
  }, [updatePositions]);

  // Don't render anything if no comments
  if (reportHighlights.length === 0) {
    return null;
  }

  // Position comment layer centered in the gap between content and right edge.
  // Content: max-w-2xl (672px) with marginLeft = calc((100vw - 672px) / 2 - 272px).
  // Gap on right = calc(50vw - 336px), center card (256px) in that gap.
  const layerStyle: React.CSSProperties = {
    right: "calc(25vw - 296px)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
      className="absolute top-0 w-64 pointer-events-none"
      style={layerStyle}
    >
      <div className="relative pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {reportHighlights.map((highlight) => {
            const position = positions.find((p) => p.id === highlight.id);
            if (!position) return null;

            return (
              <CommentCard
                key={highlight.id}
                highlight={highlight}
                isActive={activeHighlightId === highlight.id}
                onClick={() => setActiveHighlight(highlight.id)}
                style={{ top: position.top }}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
