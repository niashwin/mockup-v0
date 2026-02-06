import React, { useState, useRef, useEffect, useCallback, useMemo, Children, cloneElement, isValidElement, type ReactNode, type ReactElement } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Pencil, MessageSquare } from 'lucide-react';

// Types
export interface CommentHighlight {
  id: string;
  reportId: string;
  selectedText: string;
  startOffset: number;
  endOffset: number;
  comment: {
    id: string;
    userName: string;
    text: string;
    createdAt: Date;
  } | null;
}

interface HighlightRange {
  id: string;
  start: number;
  end: number;
}

// Hook: useTextSelection
function useTextSelection({
  containerRef,
  onSelect,
  enabled = true,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  onSelect: (selection: { text: string; startOffset: number; endOffset: number }) => void;
  enabled?: boolean;
}): void {
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const handleMouseUp = useCallback(() => {
    if (!enabledRef.current || !containerRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (!text || text.length < 3) return;

    const range = selection.getRangeAt(0);
    if (!containerRef.current.contains(range.commonAncestorContainer)) return;

    const preRange = document.createRange();
    preRange.setStart(containerRef.current, 0);
    preRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = preRange.toString().length;
    const endOffset = startOffset + text.length;

    onSelect({ text, startOffset, endOffset });
    selection.removeAllRanges();
  }, [containerRef, onSelect]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);
}

// HighlightRenderer - renders text with highlighted portions
function processNode(
  node: ReactNode,
  currentOffset: number,
  ranges: HighlightRange[],
  activeId: string | null,
  onClick: (id: string) => void,
): { nodes: ReactNode; offset: number } {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return { nodes: node, offset: currentOffset };
  }

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

  if (typeof node === 'string') {
    const endOffset = currentOffset + node.length;
    const relevantRanges = ranges.filter(r => r.start < endOffset && r.end > currentOffset);

    if (relevantRanges.length === 0) {
      return { nodes: node, offset: endOffset };
    }

    const segments: ReactNode[] = [];
    let pos = 0;

    for (const range of relevantRanges) {
      const relStart = Math.max(0, range.start - currentOffset);
      const relEnd = Math.min(node.length, range.end - currentOffset);

      if (relStart > pos) {
        segments.push(node.slice(pos, relStart));
      }

      const highlightedText = node.slice(relStart, relEnd);
      if (highlightedText) {
        const isActive = activeId === range.id;
        segments.push(
          <span
            key={`${range.id}-${relStart}`}
            data-highlight=""
            data-highlight-id={range.id}
            className={`cursor-pointer rounded-sm transition-colors ${
              isActive
                ? 'bg-amber-300/60 dark:bg-amber-500/40'
                : 'bg-amber-200/40 dark:bg-amber-600/20 hover:bg-amber-300/50 dark:hover:bg-amber-500/30'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onClick(range.id);
            }}
          >
            {highlightedText}
          </span>
        );
      }
      pos = relEnd;
    }

    if (pos < node.length) {
      segments.push(node.slice(pos));
    }

    return { nodes: segments, offset: endOffset };
  }

  if (typeof node === 'number') {
    return processNode(String(node), currentOffset, ranges, activeId, onClick);
  }

  if (isValidElement(node)) {
    const { children } = node.props as { children?: ReactNode };
    if (children === undefined || children === null) {
      return { nodes: node, offset: currentOffset };
    }

    const childArray = Children.toArray(children);
    const processedChildren: ReactNode[] = [];
    let offset = currentOffset;

    for (let i = 0; i < childArray.length; i++) {
      const result = processNode(childArray[i], offset, ranges, activeId, onClick);
      processedChildren.push(result.nodes);
      offset = result.offset;
    }

    return {
      nodes: cloneElement(node as ReactElement, { ...(node.props as object) }, ...processedChildren),
      offset,
    };
  }

  return { nodes: node, offset: currentOffset };
}

function HighlightRenderer({
  children,
  highlights,
  activeHighlightId,
  onHighlightClick,
}: {
  children: ReactNode;
  highlights: CommentHighlight[];
  activeHighlightId: string | null;
  onHighlightClick: (id: string) => void;
}) {
  const ranges = useMemo<HighlightRange[]>(
    () =>
      [...highlights]
        .sort((a, b) => a.startOffset - b.startOffset)
        .map((h) => ({ id: h.id, start: h.startOffset, end: h.endOffset })),
    [highlights]
  );

  if (ranges.length === 0) {
    return <>{children}</>;
  }

  const result = processNode(children, 0, ranges, activeHighlightId, onHighlightClick);
  return <>{result.nodes}</>;
}

// CommentCard
function CommentCard({
  highlight,
  isActive,
  onClick,
  onEdit,
  onDelete,
  style,
}: {
  highlight: CommentHighlight;
  isActive: boolean;
  onClick: () => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  style?: React.CSSProperties;
}) {
  const [mode, setMode] = useState<'view' | 'edit' | 'delete'>('view');
  const [editText, setEditText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isActive) setMode('view');
  }, [isActive]);

  useEffect(() => {
    if (mode === 'edit' && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [mode]);

  if (!highlight.comment) return null;

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditText(highlight.comment?.text ?? '');
    setMode('edit');
  };

  const saveEdit = () => {
    if (editText.trim()) {
      onEdit(highlight.id, editText.trim());
    }
    setMode('view');
  };

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={style}
      className={`group absolute left-0 w-48 p-2.5 rounded-lg cursor-pointer bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm transition-shadow hover:shadow-md ${
        isActive ? 'ring-1 ring-amber-400' : ''
      }`}
    >
      {mode === 'view' && (
        <div className="absolute top-1.5 right-1.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={startEdit}
            className="p-1 rounded text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-600"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMode('delete'); }}
            className="p-1 rounded text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-600"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
          {highlight.comment.userName.charAt(0)}
        </div>
        <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 truncate">
          {highlight.comment.userName}
        </span>
      </div>

      {mode === 'edit' ? (
        <div className="space-y-1.5">
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setMode('view');
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveEdit();
            }}
            rows={2}
            className="w-full resize-none rounded border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 text-[11px] focus:outline-none focus:border-emerald-500"
          />
          <div className="flex justify-end gap-1">
            <button onClick={() => setMode('view')} className="px-2 py-0.5 text-[10px] text-zinc-500 hover:text-zinc-700">
              Cancel
            </button>
            <button onClick={saveEdit} className="px-2 py-0.5 text-[10px] bg-emerald-500 text-white rounded">
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
          {highlight.comment.text}
        </p>
      )}

      <AnimatePresence>
        {mode === 'delete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-900/90 rounded-lg flex flex-col items-center justify-center gap-2 p-2"
          >
            <p className="text-[11px] font-medium text-white">Delete?</p>
            <div className="flex gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(highlight.id); }}
                className="px-2 py-1 text-[10px] font-medium bg-red-500 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setMode('view'); }}
                className="px-2 py-1 text-[10px] font-medium bg-zinc-700 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// CommentComposer
function CommentComposer({
  selectedText,
  onSubmit,
  onCancel,
}: {
  selectedText: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="p-3 space-y-2"
    >
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded p-2 border-l-2 border-amber-400">
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2">"{selectedText}"</p>
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCancel();
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
        }}
        placeholder="Add a comment..."
        rows={2}
        className="w-full resize-none rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500"
      />

      <div className="flex justify-end gap-1.5">
        <button onClick={onCancel} className="px-2.5 py-1 text-[11px] text-zinc-500 hover:text-zinc-700">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="px-3 py-1 text-[11px] font-medium bg-emerald-500 text-white rounded-lg disabled:opacity-50"
        >
          Comment
        </button>
      </div>
    </motion.div>
  );
}

// Main exported component: HighlightedContent
export function HighlightedContent({
  children,
  reportId,
  highlights,
  activeHighlightId,
  setActiveHighlight,
  className,
  contentRef: externalRef,
  pendingSelection,
  setPendingSelection,
  isComposerOpen,
  setIsComposerOpen,
}: {
  children: ReactNode;
  reportId: string;
  highlights: CommentHighlight[];
  activeHighlightId: string | null;
  setActiveHighlight: (id: string | null) => void;
  className?: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  pendingSelection: { text: string; startOffset: number; endOffset: number } | null;
  setPendingSelection: (sel: { text: string; startOffset: number; endOffset: number } | null) => void;
  isComposerOpen: boolean;
  setIsComposerOpen: (open: boolean) => void;
}) {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = externalRef ?? internalRef;

  const reportHighlights = useMemo(
    () => highlights.filter((h) => h.reportId === reportId),
    [highlights, reportId]
  );

  const handleSelect = useCallback(
    (selection: { text: string; startOffset: number; endOffset: number }) => {
      setPendingSelection(selection);
      setIsComposerOpen(true);
    },
    [setPendingSelection, setIsComposerOpen]
  );

  useTextSelection({
    containerRef,
    onSelect: handleSelect,
    enabled: !isComposerOpen,
  });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-highlight-id]')) {
        setActiveHighlight(null);
      }
    },
    [setActiveHighlight]
  );

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>} onClick={handleClick} className={className}>
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

// CommentLayer - positions comment cards
export function CommentLayer({
  contentRef,
  positioningRef,
  reportId,
  highlights,
  activeHighlightId,
  setActiveHighlight,
  onEdit,
  onDelete,
}: {
  contentRef: React.RefObject<HTMLElement | null>;
  positioningRef: React.RefObject<HTMLElement | null>;
  reportId: string;
  highlights: CommentHighlight[];
  activeHighlightId: string | null;
  setActiveHighlight: (id: string | null) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  const [positions, setPositions] = useState<{ id: string; top: number }[]>([]);

  const reportHighlights = useMemo(
    () => highlights.filter((h) => h.reportId === reportId),
    [highlights, reportId]
  );

  const updatePositions = useCallback(() => {
    const element = contentRef.current;
    const ancestor = positioningRef.current;
    if (!element || !ancestor) return;

    requestAnimationFrame(() => {
      const ancestorRect = ancestor.getBoundingClientRect();
      const newPositions: { id: string; top: number }[] = [];

      for (const highlight of reportHighlights) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let currentOffset = 0;
        let range: Range | null = null;

        while (walker.nextNode()) {
          const node = walker.currentNode as Text;
          const nodeLength = node.length;

          if (currentOffset + nodeLength > highlight.startOffset && !range) {
            range = document.createRange();
            range.setStart(node, Math.max(0, highlight.startOffset - currentOffset));
          }

          if (range && currentOffset + nodeLength >= highlight.endOffset) {
            range.setEnd(node, Math.min(highlight.endOffset - currentOffset, nodeLength));
            break;
          }

          currentOffset += nodeLength;
        }

        if (range) {
          const rect = range.getBoundingClientRect();
          newPositions.push({ id: highlight.id, top: rect.top - ancestorRect.top });
        }
      }

      // Avoid overlapping
      const sorted = [...newPositions].sort((a, b) => a.top - b.top);
      const minGap = 90;
      const adjusted = sorted.reduce<{ id: string; top: number }[]>((acc, pos, i) => {
        if (i === 0) return [pos];
        const prevBottom = acc[i - 1].top + minGap;
        return [...acc, { ...pos, top: Math.max(pos.top, prevBottom) }];
      }, []);

      setPositions(adjusted);
    });
  }, [contentRef, positioningRef, reportHighlights]);

  useEffect(() => {
    updatePositions();
  }, [updatePositions]);

  useEffect(() => {
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [updatePositions]);

  if (reportHighlights.length === 0) return null;

  return (
    <div className="absolute top-0 right-4 w-48 pointer-events-none">
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
                onEdit={onEdit}
                onDelete={onDelete}
                style={{ top: position.top }}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// CommentPanel - slides in from right
export function CommentPanel({
  isOpen,
  pendingSelection,
  onSubmit,
  onClose,
}: {
  isOpen: boolean;
  pendingSelection: { text: string; startOffset: number; endOffset: number } | null;
  onSubmit: (text: string) => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && pendingSelection && (
        <motion.div
          ref={panelRef}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
          className="shrink-0 border-l border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 overflow-hidden"
        >
          <div className="w-[280px]">
            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Add Comment</span>
            </div>
            <CommentComposer
              selectedText={pendingSelection.text}
              onSubmit={onSubmit}
              onCancel={onClose}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
