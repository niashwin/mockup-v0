import { useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { springs } from "@lib/motion";
import { Button } from "@components/ui/button";
import { useSettingsStore } from "@stores/settings-store";
import { ScheduleSection } from "./settings-schedule";
import { PresetsSection } from "./settings-presets";

export function SettingsPane() {
  const { closeSettings, saveSettings } = useSettingsStore();

  const handleSave = () => {
    saveSettings();
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSettings();
      }
    },
    [closeSettings],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={springs.gentle}
      className="h-full flex flex-col bg-background"
    >
      {/* Header */}
      <header className="relative shrink-0 px-8 pt-12 pb-6 border-b border-border-subtle">
        <h1 className="text-title font-semibold">Settings</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeSettings}
          className="absolute top-6 right-6 size-8"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-8 py-12 space-y-12">
          <ScheduleSection />

          {/* Divider */}
          <div className="border-b border-border-subtle" />

          <PresetsSection />
        </div>
      </div>

      {/* Footer */}
      <footer className="shrink-0 px-8 py-4 border-t border-border-subtle">
        <div className="max-w-lg mx-auto flex justify-end">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </footer>
    </motion.div>
  );
}
