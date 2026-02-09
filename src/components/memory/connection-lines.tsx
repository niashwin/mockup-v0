import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  useMemoryStore,
  useIsFocusMode,
  useFocusedEventId,
  useConnectionVisualizationMode,
} from "@stores/memory-store";
import { calculateBezierPath, type Point } from "@lib/bezier-paths";

/**
 * Connection Lines - SVG Bezier Curves
 *
 * Draws animated bezier curves between the focused card and its
 * connected cards when in "dim-with-lines" visualization mode.
 *
 * Features:
 * - Smooth bezier curves with glow effect
 * - Staggered draw-in animation
 * - Stable positions that don't drift on scroll
 * - Cyan accent color matching design system
 *
 * IMPORTANT: Lines are calculated using absolute positions within the
 * scrollable content, not viewport-relative positions. This ensures
 * they remain stable when scrolling.
 */

interface ConnectionPath {
  id: string;
  path: string;
  from: Point;
  to: Point;
}

interface ConnectionLinesProps {
  /** Reference to the scrollable container for position calculations */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Get the absolute position of an element within a scrollable container.
 * This calculates where the element is in the content coordinate space,
 * not the viewport coordinate space.
 */
function getElementPositionInContainer(
  element: Element,
  container: HTMLElement,
): { left: number; top: number; width: number; height: number } | null {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Position relative to container's visible area
  const relativeLeft = elementRect.left - containerRect.left;
  const relativeTop = elementRect.top - containerRect.top;

  // Add scroll offset to get absolute position in content
  const absoluteLeft = relativeLeft + container.scrollLeft;
  const absoluteTop = relativeTop + container.scrollTop;

  return {
    left: absoluteLeft,
    top: absoluteTop,
    width: elementRect.width,
    height: elementRect.height,
  };
}

/**
 * Calculate connection points between two cards.
 * Returns the optimal start and end points for a bezier curve.
 */
function getCardConnectionPoints(
  fromRect: { left: number; top: number; width: number; height: number },
  toRect: { left: number; top: number; width: number; height: number },
): { from: Point; to: Point } {
  const fromCenterX = fromRect.left + fromRect.width / 2;
  const fromCenterY = fromRect.top + fromRect.height / 2;
  const toCenterX = toRect.left + toRect.width / 2;
  const toCenterY = toRect.top + toRect.height / 2;

  // Determine which edges to connect based on relative positions
  const deltaX = toCenterX - fromCenterX;
  const deltaY = toCenterY - fromCenterY;

  let from: Point;
  let to: Point;

  // If mostly horizontal, connect from sides
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      // Target is to the right
      from = { x: fromRect.left + fromRect.width, y: fromCenterY };
      to = { x: toRect.left, y: toCenterY };
    } else {
      // Target is to the left
      from = { x: fromRect.left, y: fromCenterY };
      to = { x: toRect.left + toRect.width, y: toCenterY };
    }
  } else {
    // If mostly vertical, connect from top/bottom
    if (deltaY > 0) {
      // Target is below
      from = { x: fromCenterX, y: fromRect.top + fromRect.height };
      to = { x: toCenterX, y: toRect.top };
    } else {
      // Target is above
      from = { x: fromCenterX, y: fromRect.top };
      to = { x: toCenterX, y: toRect.top + toRect.height };
    }
  }

  return { from, to };
}

export function ConnectionLines({ containerRef }: ConnectionLinesProps) {
  const isFocusMode = useIsFocusMode();
  const focusedEventId = useFocusedEventId();
  const visualizationMode = useConnectionVisualizationMode();
  const getConnectedEventIds = useMemoryStore(
    (state) => state.getConnectedEventIds,
  );

  const [connections, setConnections] = useState<ConnectionPath[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Memoize connected IDs to prevent unnecessary recalculations
  const connectedIds = useMemo(() => {
    if (!focusedEventId) return [];
    return getConnectedEventIds(focusedEventId);
  }, [focusedEventId, getConnectedEventIds]);

  // Calculate connection paths - only when focus mode is entered or IDs change
  const calculateConnections = useCallback(() => {
    if (
      !isFocusMode ||
      !focusedEventId ||
      visualizationMode !== "dim-with-lines" ||
      !containerRef.current ||
      connectedIds.length === 0
    ) {
      setConnections([]);
      return;
    }

    const container = containerRef.current;

    // Update container size for SVG viewport
    setContainerSize({
      width: container.scrollWidth,
      height: container.scrollHeight,
    });

    // Find the focused card element
    const focusedCard = container.querySelector(
      `[data-event-id="${focusedEventId}"]`,
    );
    if (!focusedCard) {
      setConnections([]);
      return;
    }

    const focusedRect = getElementPositionInContainer(focusedCard, container);
    if (!focusedRect) {
      setConnections([]);
      return;
    }

    // Calculate paths to all connected cards
    const paths: ConnectionPath[] = [];

    for (const connectedId of connectedIds) {
      const connectedCard = container.querySelector(
        `[data-event-id="${connectedId}"]`,
      );
      if (!connectedCard) continue;

      const connectedRect = getElementPositionInContainer(
        connectedCard,
        container,
      );
      if (!connectedRect) continue;

      // Get connection points
      const { from, to } = getCardConnectionPoints(focusedRect, connectedRect);

      // Generate bezier path
      const path = calculateBezierPath(from, to);

      paths.push({
        id: `${focusedEventId}-${connectedId}`,
        path,
        from,
        to,
      });
    }

    setConnections(paths);
  }, [
    isFocusMode,
    focusedEventId,
    visualizationMode,
    containerRef,
    connectedIds,
  ]);

  // Calculate connections when dependencies change
  // Note: We intentionally DON'T recalculate on scroll - the positions
  // are in content-space, not viewport-space, so they remain stable
  useEffect(() => {
    calculateConnections();
  }, [calculateConnections]);

  // Recalculate if container size changes (e.g., window resize)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateConnections();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [containerRef, calculateConnections]);

  // Don't render if not in focus mode or not showing lines
  if (
    !isFocusMode ||
    visualizationMode !== "dim-with-lines" ||
    connections.length === 0
  ) {
    return null;
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-25 overflow-visible"
      style={{
        width: containerSize.width,
        height: containerSize.height,
      }}
    >
      {/* Glow filter definition */}
      <defs>
        <filter
          id="connection-glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#00a6f5" floodOpacity="0.4" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <AnimatePresence>
        {connections.map((conn, index) => (
          <motion.path
            key={conn.id}
            d={conn.path}
            stroke="#00a6f5"
            strokeWidth={2}
            fill="none"
            filter="url(#connection-glow)"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            exit={{ pathLength: 0, opacity: 0 }}
            transition={{
              pathLength: {
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
              opacity: { duration: 0.2, delay: index * 0.1 },
            }}
          />
        ))}
      </AnimatePresence>
    </svg>
  );
}
