import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Badge } from "@components/ui/badge";
import { PRDSources } from "./prd-sources";
import { PRDActions } from "./prd-actions";
import { springs } from "@lib/motion";
import type { PRDMetadata } from "@stores/chatbox-store";

interface PRDMessageProps {
  content: string;
  metadata: PRDMetadata;
  animate?: boolean;
}

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListTag = listType === "ul" ? "ul" : "ol";
      elements.push(
        <ListTag
          key={`list-${elements.length}`}
          className={
            listType === "ul"
              ? "list-disc list-inside space-y-1 my-3"
              : "list-decimal list-inside space-y-1 my-3"
          }
        >
          {listItems.map((item, i) => (
            <li key={i} className="text-caption text-foreground">
              {formatInline(item)}
            </li>
          ))}
        </ListTag>,
      );
      listItems = [];
      listType = null;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const [header, ...body] = tableRows;
      elements.push(
        <div
          key={`table-${elements.length}`}
          className="my-4 overflow-x-auto rounded-[var(--radius-lg)] border border-border"
        >
          <table className="w-full text-caption">
            <thead>
              <tr className="bg-muted/50">
                {header.map((cell, i) => (
                  <th
                    key={i}
                    className="px-3 py-2 text-left font-semibold text-foreground"
                  >
                    {cell.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, i) => (
                <tr key={i} className="border-t border-border-subtle">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 text-muted-foreground">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      tableRows = [];
      inTable = false;
    }
  };

  const formatInline = (text: string): React.ReactNode => {
    // Handle **bold** text
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      flushList();
      flushTable();
      continue;
    }

    // Table detection
    if (trimmed.includes("|") && !trimmed.startsWith("#")) {
      // Skip separator row (|---|---|)
      if (/^\|[\s\-|]+\|$/.test(trimmed)) {
        continue;
      }
      inTable = true;
      const cells = trimmed.split("|").filter((c) => c.trim() !== "");
      tableRows.push(cells);
      continue;
    }

    if (inTable) {
      flushTable();
    }

    // H2
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="text-ui font-semibold text-foreground mt-4 mb-2"
        >
          {trimmed.slice(3)}
        </h2>,
      );
      continue;
    }

    // H3
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="text-caption font-semibold text-foreground mt-3 mb-1"
        >
          {trimmed.slice(4)}
        </h3>,
      );
      continue;
    }

    // Unordered list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listItems.push(trimmed.slice(2));
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listItems.push(trimmed.replace(/^\d+\.\s/, ""));
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="text-caption text-foreground my-2"
      >
        {formatInline(trimmed)}
      </p>,
    );
  }

  flushList();
  flushTable();

  return elements;
}

export function PRDMessage({
  content,
  metadata,
  animate = true,
}: PRDMessageProps) {
  const [displayedCount, setDisplayedCount] = useState(
    animate ? 0 : content.length,
  );
  const [isComplete, setIsComplete] = useState(!animate);
  const speed = 8; // Characters per tick - faster for longer content

  useEffect(() => {
    if (!animate) {
      setDisplayedCount(content.length);
      setIsComplete(true);
      return;
    }

    if (displayedCount >= content.length) {
      setIsComplete(true);
      return;
    }

    // Type multiple characters at once for smoother feel with long content
    const charsToAdd = Math.min(3, content.length - displayedCount);

    const timer = setTimeout(() => {
      setDisplayedCount((prev) => prev + charsToAdd);
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedCount, content.length, animate, speed]);

  const displayedText = content.slice(0, displayedCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.default}
      className="space-y-4"
    >
      {/* Label Badge */}
      <Badge variant="accent" className="text-micro">
        {metadata.label}
      </Badge>

      {/* PRD Content */}
      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 relative">
        {parseMarkdown(displayedText)}
        {!isComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="inline-block w-0.5 h-4 bg-accent ml-0.5 align-middle"
          />
        )}
      </div>

      {/* Sources - only show when typing is complete */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-2 border-t border-border-subtle"
        >
          <PRDSources slackUrl={metadata.slackUrl} />
        </motion.div>
      )}

      {/* Actions - only show when typing is complete */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <PRDActions />
        </motion.div>
      )}
    </motion.div>
  );
}
