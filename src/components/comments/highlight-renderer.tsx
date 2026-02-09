import {
  Children,
  cloneElement,
  isValidElement,
  useMemo,
  type ReactNode,
  type ReactElement,
} from "react";
import type { CommentHighlight } from "@stores/comment-store";

interface HighlightRendererProps {
  children: ReactNode;
  highlights: CommentHighlight[];
  activeHighlightId: string | null;
  onHighlightClick: (id: string) => void;
}

interface HighlightRange {
  id: string;
  start: number;
  end: number;
}

/**
 * HighlightRenderer recursively traverses React children and wraps text
 * that falls within highlight ranges in <span data-highlight> elements.
 *
 * This enables visual highlighting of selected text using CSS selectors
 * defined in index.css ([data-highlight], [data-highlight][data-active="true"]).
 */
export function HighlightRenderer({
  children,
  highlights,
  activeHighlightId,
  onHighlightClick,
}: HighlightRendererProps) {
  // Convert highlights to simple ranges sorted by start offset
  const ranges = useMemo<HighlightRange[]>(
    () =>
      [...highlights]
        .sort((a, b) => a.startOffset - b.startOffset)
        .map((h) => ({
          id: h.id,
          start: h.startOffset,
          end: h.endOffset,
        })),
    [highlights],
  );

  // If no highlights, render children as-is
  if (ranges.length === 0) {
    return <>{children}</>;
  }

  const result = processNode(
    children,
    0,
    ranges,
    activeHighlightId,
    onHighlightClick,
  );
  return <>{result.nodes}</>;
}

interface ProcessResult {
  nodes: ReactNode;
  offset: number;
}

/**
 * Recursively process a React node, tracking cumulative text offset.
 * When text overlaps a highlight range, split and wrap in highlight spans.
 */
function processNode(
  node: ReactNode,
  currentOffset: number,
  ranges: HighlightRange[],
  activeId: string | null,
  onClick: (id: string) => void,
): ProcessResult {
  // Handle null/undefined/boolean
  if (node === null || node === undefined || typeof node === "boolean") {
    return { nodes: node, offset: currentOffset };
  }

  // Handle arrays (e.g., from map)
  if (Array.isArray(node)) {
    const processedChildren: ReactNode[] = [];
    let offset = currentOffset;

    for (let i = 0; i < node.length; i++) {
      const result = processNode(node[i], offset, ranges, activeId, onClick);
      processedChildren.push(result.nodes);
      offset = result.offset;
    }

    return { nodes: processedChildren, offset };
  }

  // Handle text strings
  if (typeof node === "string") {
    return processTextNode(node, currentOffset, ranges, activeId, onClick);
  }

  // Handle numbers (convert to string for processing)
  if (typeof node === "number") {
    return processTextNode(
      String(node),
      currentOffset,
      ranges,
      activeId,
      onClick,
    );
  }

  // Handle React elements
  if (isValidElement(node)) {
    return processElement(node, currentOffset, ranges, activeId, onClick);
  }

  // Fallback: return as-is
  return { nodes: node, offset: currentOffset };
}

/**
 * Process a text string, splitting it at highlight boundaries.
 */
function processTextNode(
  text: string,
  startOffset: number,
  ranges: HighlightRange[],
  activeId: string | null,
  onClick: (id: string) => void,
): ProcessResult {
  const endOffset = startOffset + text.length;
  const relevantRanges = ranges.filter(
    (r) => r.start < endOffset && r.end > startOffset,
  );

  // No overlapping highlights - return text as-is
  if (relevantRanges.length === 0) {
    return { nodes: text, offset: endOffset };
  }

  // Split text at highlight boundaries
  const segments: ReactNode[] = [];
  let pos = 0;

  for (const range of relevantRanges) {
    // Calculate relative positions within this text node
    const relStart = Math.max(0, range.start - startOffset);
    const relEnd = Math.min(text.length, range.end - startOffset);

    // Add unhighlighted text before this range
    if (relStart > pos) {
      segments.push(text.slice(pos, relStart));
    }

    // Add highlighted text
    const highlightedText = text.slice(relStart, relEnd);
    if (highlightedText) {
      const isActive = activeId === range.id;
      segments.push(
        <span
          key={`${range.id}-${relStart}`}
          data-highlight=""
          data-highlight-id={range.id}
          data-active={isActive ? "true" : undefined}
          onClick={(e) => {
            e.stopPropagation();
            onClick(range.id);
          }}
        >
          {highlightedText}
        </span>,
      );
    }

    pos = relEnd;
  }

  // Add remaining unhighlighted text
  if (pos < text.length) {
    segments.push(text.slice(pos));
  }

  return { nodes: segments, offset: endOffset };
}

/**
 * Process a React element by recursively processing its children.
 */
function processElement(
  element: ReactElement,
  currentOffset: number,
  ranges: HighlightRange[],
  activeId: string | null,
  onClick: (id: string) => void,
): ProcessResult {
  const { children } = element.props as { children?: ReactNode };

  // No children - return element as-is
  if (children === undefined || children === null) {
    return { nodes: element, offset: currentOffset };
  }

  // Process children recursively
  const childArray = Children.toArray(children);
  const processedChildren: ReactNode[] = [];
  let offset = currentOffset;

  for (let i = 0; i < childArray.length; i++) {
    const result = processNode(
      childArray[i],
      offset,
      ranges,
      activeId,
      onClick,
    );
    processedChildren.push(result.nodes);
    offset = result.offset;
  }

  // Clone element with processed children
  return {
    nodes: cloneElement(
      element,
      { ...(element.props as object) },
      ...processedChildren,
    ),
    offset,
  };
}
