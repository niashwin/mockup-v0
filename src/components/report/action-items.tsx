import { HugeiconsIcon } from "@hugeicons/react";
import {
  BulbIcon,
  Mail01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { useChatboxStore } from "@stores/chatbox-store";
import { springs, staggerContainer, staggerItem } from "@lib/motion";
import { cn } from "@lib/utils";
import { isPRDGenerationAction } from "@types/action";
import type { Action } from "@types/action";
import type { IconSvgElement } from "@hugeicons/react";

interface ActionItemsProps {
  actions: Action[];
}

const actionIcons: Record<string, IconSvgElement> = {
  "prd-generation": BulbIcon,
  email: Mail01Icon,
  meeting: Calendar01Icon,
};

export function ActionItems({ actions }: ActionItemsProps) {
  const { triggerPRDGeneration } = useChatboxStore();

  const handleActionClick = (action: Action) => {
    if (isPRDGenerationAction(action)) {
      triggerPRDGeneration(action.sourceContext, action.prompt);
    }
  };

  if (actions.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <h3 className="text-heading font-semibold text-foreground">
        Suggested Actions
      </h3>

      <div className="space-y-3">
        {actions.map((action) => {
          const iconDef = actionIcons[action.type] ?? BulbIcon;
          const isPRD = isPRDGenerationAction(action);

          return (
            <motion.button
              key={action.id}
              variants={staggerItem}
              onClick={() => handleActionClick(action)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={springs.quick}
              className={cn(
                "w-full p-4 rounded-[var(--radius-lg)] text-left",
                "bg-surface border border-border",
                "hover:border-accent hover:bg-accent-muted",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                "transition-colors duration-150",
                "flex items-center gap-4",
              )}
            >
              <div
                className={cn(
                  "shrink-0 size-10 rounded-[var(--radius-lg)] flex items-center justify-center",
                  "bg-accent-muted",
                )}
              >
                <HugeiconsIcon
                  icon={iconDef}
                  size={20}
                  className="text-accent"
                  strokeWidth={1.5}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-ui font-medium text-foreground">
                  {action.title}
                </h4>
                {isPRD && (
                  <p className="text-caption text-muted-foreground mt-0.5">
                    Based on {action.sourceContext.meetings} meetings,{" "}
                    {action.sourceContext.slackThreads} Slack threads,{" "}
                    {action.sourceContext.documents} docs
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
