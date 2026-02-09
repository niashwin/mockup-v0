import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { staggerContainer, staggerItem } from "@lib/motion";
import { InfoPopover } from "@components/ui/info-popover";
import { useSettingsStore, type Frequency } from "@stores/settings-store";

// --- Constants ---------------------------------------------------------------

const FREQUENCIES: Array<{ value: Frequency; label: string }> = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
];

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const TIMES = [
  { value: "06:00", label: "6:00 AM" },
  { value: "07:00", label: "7:00 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
];

const SCHEDULE_INFO =
  "Report generation begins 2 hours prior to the scheduled time. Note that changing the time to a later time will not trigger a new report generation if a report was already generated within the last 24 hours.";

// --- Select Component --------------------------------------------------------

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

function Select({ label, value, onChange, options }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="flex-1 min-w-0">
      <label className="block text-caption text-muted-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full h-10 px-3 rounded-[var(--radius-lg)]",
            "bg-muted border border-border-subtle text-foreground",
            "flex items-center justify-between gap-2",
            "text-ui text-left",
            "transition-colors duration-200",
            "hover:bg-muted/80",
            "focus:outline-none focus:ring-1 focus:ring-accent",
          )}
        >
          <span className="truncate">{selectedOption?.label ?? "Select"}</span>
          <span
            className={cn(
              "text-muted-foreground shrink-0 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          >
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "absolute z-20 top-full left-0 right-0 mt-1",
                  "bg-surface-elevated border border-border rounded-[var(--radius-lg)] shadow-lg",
                  "max-h-48 overflow-y-auto",
                )}
              >
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-ui text-left",
                      "flex items-center justify-between",
                      "transition-colors duration-150",
                      option.value === value
                        ? "bg-accent-muted text-accent"
                        : "hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={16}
                        className="text-accent"
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Schedule Section --------------------------------------------------------

export function ScheduleSection() {
  const { frequency, dayOfWeek, time, updateSchedule } = useSettingsStore();

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerItem}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-caption uppercase tracking-wider text-muted-foreground">
            Schedule
          </h2>
          <InfoPopover>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {SCHEDULE_INFO}
            </p>
          </InfoPopover>
        </div>
      </motion.div>
      <motion.div variants={staggerItem} className="flex gap-4">
        <Select
          label="Frequency"
          value={frequency}
          onChange={(v) => updateSchedule({ frequency: v as Frequency })}
          options={FREQUENCIES}
        />
        <Select
          label="Day"
          value={dayOfWeek}
          onChange={(v) => updateSchedule({ dayOfWeek: v })}
          options={DAYS_OF_WEEK}
        />
        <Select
          label="Time"
          value={time}
          onChange={(v) => updateSchedule({ time: v })}
          options={TIMES}
        />
      </motion.div>
    </motion.section>
  );
}
