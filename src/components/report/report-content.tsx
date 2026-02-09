import type { ReactElement } from "react";
import { useMemo } from "react";
import { motion } from "motion/react";
import { staggerItem } from "@lib/motion";

interface ReportContentProps {
  content: string;
}

interface ListState {
  items: string[];
  type: "ul" | "ol" | null;
}

function parseInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function createListElement(
  list: ListState,
  keyPrefix: string,
): ReactElement | null {
  if (list.items.length === 0 || !list.type) {
    return null;
  }
  const ListTag = list.type;
  return (
    <ListTag key={keyPrefix}>
      {list.items.map((item, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
      ))}
    </ListTag>
  );
}

function parseMarkdown(content: string): ReactElement[] {
  const lines = content.split("\n");
  const elements: ReactElement[] = [];
  let currentList: ListState = { items: [], type: null };
  let elementIndex = 0;

  function flushList(): void {
    const element = createListElement(currentList, `list-${elementIndex}`);
    if (element) {
      elements.push(element);
      elementIndex += 1;
    }
    currentList = { items: [], type: null };
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(<h2 key={`h2-${elementIndex++}`}>{trimmed.slice(3)}</h2>);
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(<h3 key={`h3-${elementIndex++}`}>{trimmed.slice(4)}</h3>);
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (currentList.type !== "ul") {
        flushList();
        currentList = { items: [], type: "ul" };
      }
      currentList = {
        ...currentList,
        items: [...currentList.items, trimmed.slice(2)],
      };
      continue;
    }

    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      if (currentList.type !== "ol") {
        flushList();
        currentList = { items: [], type: "ol" };
      }
      currentList = {
        ...currentList,
        items: [...currentList.items, numberedMatch[1]],
      };
      continue;
    }

    flushList();
    elements.push(
      <p
        key={`p-${elementIndex++}`}
        dangerouslySetInnerHTML={{ __html: parseInline(trimmed) }}
      />,
    );
  }

  flushList();
  return elements;
}

export function ReportContent({ content }: ReportContentProps) {
  const parsedContent = useMemo(() => parseMarkdown(content), [content]);

  return (
    <motion.article
      variants={staggerItem}
      className="prose-editorial select-text"
    >
      {parsedContent}
    </motion.article>
  );
}
