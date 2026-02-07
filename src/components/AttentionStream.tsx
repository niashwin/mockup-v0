import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { AttentionItem } from '../types';
import { sortByAttentionScore, filterForAttentionPane } from '../utils/AttentionScore';
import { AttentionCard } from './AttentionCard';

interface AttentionStreamProps {
  items: AttentionItem[];
  onAction: (actionId: string, item: AttentionItem) => void;
  onExpand: (item: AttentionItem) => void;
  onShowEvidence?: (item: AttentionItem) => void;
  showAll?: boolean;
}

export const AttentionStream: React.FC<AttentionStreamProps> = ({
  items,
  onAction,
  onExpand,
  onShowEvidence,
  showAll = false
}) => {
  // Filter and sort items
  const attentionItems = showAll ? items : filterForAttentionPane(items);
  const sortedItems = sortByAttentionScore(attentionItems);

  // Limit to only 3 items for Focus view
  const limitedItems = sortedItems.slice(0, 3);

  // Empty state
  if (limitedItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center py-20"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Clear skies
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
          Nothing pressing right now. We'll surface things as they emerge.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
      {/* Focus Heading */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Focus
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          You should look at this
        </p>
      </motion.div>

      {/* Show top 3 items as a simple list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {limitedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AttentionCard
                item={item}
                onAction={onAction}
                onExpand={onExpand}
                onShowEvidence={onShowEvidence}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AttentionStream;
