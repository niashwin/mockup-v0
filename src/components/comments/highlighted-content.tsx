import { useRef, useCallback, useMemo, type ReactNode } from "react";
import { useCommentStore } from "@stores/comment-store";
import { useTextSelection } from "@hooks/useTextSelection";
import { HighlightRenderer } from "./highlight-renderer";

interface HighlightedContentProps {
  children: ReactNode;
  reportId: string;
  className?: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

export function HighlightedContent({
  children,
  reportId,
  className,
  contentRef: externalRef,
}: HighlightedContentProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = externalRef ?? internalRef;

  const {
    highlights,
    activeHighlightId,
    isComposerOpen,
    setPendingSelection,
    openComposer,
    setActiveHighlight,
  } = useCommentStore();

  const reportHighlights = useMemo(
    () => highlights.filter((h) => h.reportId === reportId),
    [highlights, reportId],
  );

  const handleSelect = useCallback(
    (selection: { text: string; startOffset: number; endOffset: number }) => {
      setPendingSelection(selection);
      openComposer();
    },
    [setPendingSelection, openComposer],
  );

  useTextSelection({
    containerRef,
    onSelect: handleSelect,
    enabled: !isComposerOpen,
  });

  // Handle click outside highlights to deselect
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-highlight-id]")) {
        setActiveHighlight(null);
      }
    },
    [setActiveHighlight],
  );

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      onClick={handleClick}
      className={className}
    >
      <HighlightRenderer
        highlights={reportHighlights}
        activeHighlightId={activeHighlightId}
        onHighlightClick={setActiveHighlight}
      >
        {children}
      </HighlightRenderer>
    </div>
  );
}
