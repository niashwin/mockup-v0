import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ExternalLink,
  BadgeCheck,
  FileText,
  MessageSquare,
  Video,
  Mail,
  Link2,
} from "lucide-react";
import { AttentionItem, EvidenceItem } from "../types";

// Evidence type icons
const getEvidenceIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("slack") || lowerType.includes("message"))
    return MessageSquare;
  if (
    lowerType.includes("zoom") ||
    lowerType.includes("meeting") ||
    lowerType.includes("video")
  )
    return Video;
  if (lowerType.includes("email")) return Mail;
  if (
    lowerType.includes("notion") ||
    lowerType.includes("doc") ||
    lowerType.includes("pdf")
  )
    return FileText;
  return Link2;
};

// Evidence type colors
const getEvidenceColors = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("slack")) {
    return {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
    };
  }
  if (lowerType.includes("zoom") || lowerType.includes("meeting")) {
    return {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    };
  }
  if (lowerType.includes("email")) {
    return {
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
    };
  }
  if (lowerType.includes("notion") || lowerType.includes("doc")) {
    return {
      bg: "bg-secondary",
      text: "text-muted-foreground",
      border: "border-border",
    };
  }
  if (lowerType.includes("figma")) {
    return {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800",
    };
  }
  if (lowerType.includes("jira") || lowerType.includes("ticket")) {
    return {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    };
  }
  if (lowerType.includes("datadog") || lowerType.includes("incident")) {
    return {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
    };
  }
  return {
    bg: "bg-secondary",
    text: "text-muted-foreground",
    border: "border-border",
  };
};

interface SourceDrawerProps {
  item: AttentionItem | null;
  onClose: () => void;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({
  item,
  onClose,
}) => {
  if (!item || !item.evidence || item.evidence.length === 0) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card dark:bg-neutral-900 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BadgeCheck size={18} className="text-emerald-500" />
            <h2 className="text-sm font-semibold text-foreground">
              Evidence Sources
            </h2>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {item.evidence.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Context */}
        <div className="shrink-0 p-4 bg-background dark:bg-neutral-800/50 border-b border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            For
          </p>
          <p className="text-sm font-medium text-foreground line-clamp-2">
            {item.title}
          </p>
        </div>

        {/* Evidence List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {item.evidence.map((evidence, index) => {
            const Icon = getEvidenceIcon(evidence.type);
            const colors = getEvidenceColors(evidence.type);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-[7px] border ${colors.border} ${colors.bg} hover:shadow-md transition-all cursor-pointer group`}
                onClick={() => {
                  // In a real app, this would open the source
                  console.log("Opening source:", evidence.url);
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-[7px] ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={18} className={colors.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${colors.text}`}>
                        {evidence.type}
                      </span>
                      {evidence.timestamp && (
                        <span className="text-[10px] text-muted-foreground">
                          {evidence.timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {evidence.preview}
                    </p>
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-border bg-background/50 dark:bg-neutral-900/50">
          <p className="text-xs text-muted-foreground text-center">
            Click any source to view the original content
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SourceDrawer;
