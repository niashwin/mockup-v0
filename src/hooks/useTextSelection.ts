import { useCallback, useEffect, useRef, type RefObject } from "react";

interface SelectionData {
  text: string;
  startOffset: number;
  endOffset: number;
  rect: DOMRect;
}

interface UseTextSelectionOptions {
  containerRef: RefObject<HTMLElement | null>;
  onSelect: (selection: SelectionData) => void;
  enabled?: boolean;
}

export function useTextSelection({
  containerRef,
  onSelect,
  enabled = true,
}: UseTextSelectionOptions): void {
  const enabledRef = useRef(enabled);

  // Update ref in effect to avoid updating during render
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const handleMouseUp = useCallback(() => {
    if (!enabledRef.current || !containerRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (!text) return;

    // Check if selection is within our container
    const range = selection.getRangeAt(0);
    if (!containerRef.current.contains(range.commonAncestorContainer)) return;

    // Calculate offsets relative to container's text content
    const preRange = document.createRange();
    preRange.setStart(containerRef.current, 0);
    preRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = preRange.toString().length;
    const endOffset = startOffset + text.length;

    const rect = range.getBoundingClientRect();

    onSelect({
      text,
      startOffset,
      endOffset,
      rect,
    });

    // Clear native selection after capturing
    selection.removeAllRanges();
  }, [containerRef, onSelect]);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);
}
