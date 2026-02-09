import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { staggerContainer, staggerItem } from "@lib/motion";
import { springs } from "@lib/motion";
import { InfoPopover } from "@components/ui/info-popover";
import { useSettingsStore, type Preset } from "@stores/settings-store";

// --- Constants ---------------------------------------------------------------

const PRESETS: Array<{
  id: Preset;
  title: string;
  description: string;
}> = [
  {
    id: "org-overview",
    title: "Org-wide overview",
    description:
      "Broadly summarize the movements across the organization this week, highlighting key achievements, blockers, and measurable progress across all teams.",
  },
  {
    id: "engineering",
    title: "Engineering focus",
    description:
      "Focus on technical progress; completed milestones, overdue tasks, emerging risks, and any incidents or blockers from the engineering team.",
  },
  {
    id: "customer-revenue",
    title: "Customer & revenue focus",
    description:
      "Dive deep into customer relations, focusing on any feedback, risks of churn, and any delays or issues on our end relating to revenue-impacting activities.",
  },
];

const REPORT_FOCUS_INFO =
  "By default, Sentra will make a report for you that highlights major changes over the last week — updates on what progressed as well as any blockers or issues — followed by drill-downs into the details of various projects and initiatives.\n\nCustomize what Sentra should focus on when writing your report, as well as the format.";

// --- Preset Card -------------------------------------------------------------

interface PresetCardProps {
  preset: (typeof PRESETS)[0];
  isSelected: boolean;
  onClick: () => void;
}

function PresetCard({ preset, isSelected, onClick }: PresetCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={staggerItem}
      whileTap={{ scale: 0.99 }}
      transition={springs.quick}
      className={cn(
        "w-full p-5 rounded-[var(--radius-lg)] text-left",
        "border transition-colors duration-200",
        isSelected
          ? "border-accent bg-accent-muted"
          : "border-border-subtle hover:border-accent/50",
      )}
    >
      <h4 className="text-ui font-medium">{preset.title}</h4>
      <p className="text-caption text-muted-foreground mt-2 leading-relaxed">
        {preset.description}
      </p>
    </motion.button>
  );
}

// --- Presets Section ---------------------------------------------------------

export function PresetsSection() {
  const { preset, customInstructions, setPreset, setCustomInstructions } =
    useSettingsStore();

  const showCustom = preset === "custom" || customInstructions.length > 0;

  const handlePresetClick = (presetId: Preset) => {
    setPreset(presetId);
  };

  const handleCustomToggle = () => {
    if (showCustom && preset === "custom") {
      setCustomInstructions("");
      setPreset("org-overview");
    } else {
      setPreset("custom");
    }
  };

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerItem}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-caption uppercase tracking-wider text-muted-foreground">
            Report Focus
          </h2>
          <InfoPopover>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {REPORT_FOCUS_INFO}
            </p>
          </InfoPopover>
        </div>
      </motion.div>

      {/* Preset Cards */}
      <motion.div variants={staggerItem} className="space-y-3 mb-6">
        {PRESETS.map((p) => (
          <PresetCard
            key={p.id}
            preset={p}
            isSelected={preset === p.id}
            onClick={() => handlePresetClick(p.id)}
          />
        ))}
      </motion.div>

      {/* Custom Instructions Toggle */}
      <motion.div variants={staggerItem}>
        <button
          type="button"
          onClick={handleCustomToggle}
          className={cn(
            "flex items-center gap-2 text-ui",
            "transition-colors duration-200",
            showCustom
              ? "text-accent"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span
            className={cn(
              "transition-transform duration-200",
              showCustom && "rotate-180",
            )}
          >
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
          </span>
          <span>Custom report preferences</span>
        </button>

        <AnimatePresence>
          {showCustom && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-caption text-muted-foreground mt-3 mb-2">
                Provide specific instructions on how you want your weekly
                reports structured and what to focus on.
              </p>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g., Focus on trends in sprint velocity, highlight blockers and their resolution time, and emphasize team achievements."
                className={cn(
                  "w-full max-w-full p-3 rounded-[var(--radius-lg)]",
                  "bg-muted border border-border-subtle text-foreground",
                  "text-ui placeholder:text-muted-foreground/60",
                  "resize-none min-h-[100px]",
                  "focus:outline-none focus:ring-1 focus:ring-accent",
                  "box-border",
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
