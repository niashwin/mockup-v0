import React, { useState } from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Coffee,
  BookOpen,
  Mail,
  ChevronDown,
  RotateCcw,
  Settings,
  Plus,
  Trash2,
} from "lucide-react";
import { useScheduling } from "./SchedulingProvider";
import { SchedulingOnboarding } from "./SchedulingOnboarding";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Switch } from "./ui/switch";
import { MapPreview } from "./MapPreview";
import { DayOfWeek, LocationMode, SavedLocation } from "../types";
import { getTimezoneOptions } from "../utils/SchedulingUtils";

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = (i % 2) * 30;
  const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  const label = new Date(2000, 0, 1, hour, minute).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return { value: time, label };
});

export const SchedulingSettingsSection: React.FC = () => {
  const {
    isOnboarded,
    preferences,
    updatePreferences,
    setOnboarded,
    resetToDefaults,
  } = useScheduling();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationAddress, setNewLocationAddress] = useState("");

  const toggleDay = (day: DayOfWeek) => {
    const newSchedule = preferences.workingAvailability.weekSchedule.map(
      (d) => {
        if (d.day === day) {
          return {
            ...d,
            enabled: !d.enabled,
            timeRanges: !d.enabled
              ? [{ start: "09:00", end: "17:00" }]
              : d.timeRanges,
          };
        }
        return d;
      },
    );
    updatePreferences({
      workingAvailability: {
        ...preferences.workingAvailability,
        weekSchedule: newSchedule,
      },
    });
  };

  const updateDayTime = (
    day: DayOfWeek,
    field: "start" | "end",
    value: string,
  ) => {
    const newSchedule = preferences.workingAvailability.weekSchedule.map(
      (d) => {
        if (d.day === day && d.timeRanges.length > 0) {
          return {
            ...d,
            timeRanges: [{ ...d.timeRanges[0], [field]: value }],
          };
        }
        return d;
      },
    );
    updatePreferences({
      workingAvailability: {
        ...preferences.workingAvailability,
        weekSchedule: newSchedule,
      },
    });
  };

  const addLocation = () => {
    if (!newLocationName.trim() || !newLocationAddress.trim()) return;

    const newLocation: SavedLocation = {
      id: `loc-${Date.now()}`,
      name: newLocationName.trim(),
      address: newLocationAddress.trim(),
      type: "other",
    };

    updatePreferences({
      savedLocations: [...preferences.savedLocations, newLocation],
    });
    setNewLocationName("");
    setNewLocationAddress("");
  };

  const removeLocation = (id: string) => {
    updatePreferences({
      savedLocations: preferences.savedLocations.filter((l) => l.id !== id),
    });
  };

  // Not onboarded - show CTA
  if (!isOnboarded) {
    return (
      <>
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-accent/5 to-transparent dark:from-accent/10 dark:to-transparent">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[7px] bg-accent/10 flex items-center justify-center shrink-0">
                <CalendarDays className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Set Up Scheduling
                </h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Configure your availability and preferences so Sentra can
                  intelligently help you schedule meetings.
                </p>
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-[7px] text-sm font-medium transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Set up scheduling
                </button>
              </div>
            </div>
          </div>
        </div>

        <SchedulingOnboarding
          open={showOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
      </>
    );
  }

  // Onboarded - show editable settings
  return (
    <>
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Manage your scheduling preferences to help Sentra find the best
            times for meetings.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnboarding(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-[7px] hover:bg-background dark:hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Re-run setup
            </button>
          </div>
        </div>

        {/* Settings Accordion */}
        <Accordion
          type="multiple"
          defaultValue={["availability"]}
          className="space-y-3"
        >
          {/* Meeting Availability */}
          <AccordionItem
            value="availability"
            className="border border-border rounded-[7px] overflow-hidden"
          >
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[7px] bg-accent/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-accent" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground">
                    Meeting Availability
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {
                      preferences.workingAvailability.weekSchedule.filter(
                        (d) => d.enabled,
                      ).length
                    }{" "}
                    days active
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {/* Timezone */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-muted-foreground uppercase mb-2">
                  Timezone
                </label>
                <select
                  value={preferences.workingAvailability.timezone}
                  onChange={(e) =>
                    updatePreferences({
                      workingAvailability: {
                        ...preferences.workingAvailability,
                        timezone: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 bg-card dark:bg-neutral-900 border border-border rounded-[7px] text-sm"
                >
                  {getTimezoneOptions().map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day Schedules */}
              <div className="space-y-2">
                {DAYS.map(({ key, label }) => {
                  const daySchedule =
                    preferences.workingAvailability.weekSchedule.find(
                      (d) => d.day === key,
                    );
                  const isEnabled = daySchedule?.enabled ?? false;
                  const timeRange = daySchedule?.timeRanges[0];

                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-3 p-2.5 rounded-[7px] border transition-colors ${
                        isEnabled
                          ? "border-accent/20 bg-accent/5"
                          : "border-border bg-background dark:bg-neutral-900"
                      }`}
                    >
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={() => toggleDay(key)}
                      />
                      <span
                        className={`text-sm w-20 ${isEnabled ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {label}
                      </span>
                      {isEnabled && timeRange && (
                        <div className="flex items-center gap-2 ml-auto">
                          <select
                            value={timeRange.start}
                            onChange={(e) =>
                              updateDayTime(key, "start", e.target.value)
                            }
                            className="text-xs p-1.5 bg-card dark:bg-neutral-800 border border-border rounded"
                          >
                            {TIME_OPTIONS.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                          <span className="text-muted-foreground text-xs">
                            to
                          </span>
                          <select
                            value={timeRange.end}
                            onChange={(e) =>
                              updateDayTime(key, "end", e.target.value)
                            }
                            className="text-xs p-1.5 bg-card dark:bg-neutral-800 border border-border rounded"
                          >
                            {TIME_OPTIONS.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Work Location */}
          <AccordionItem
            value="location"
            className="border border-border rounded-[7px] overflow-hidden"
          >
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[7px] bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground">
                    Work Location
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {preferences.workLocation.mode.charAt(0).toUpperCase() +
                      preferences.workLocation.mode.slice(1)}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {(["remote", "hybrid", "office"] as LocationMode[]).map(
                  (mode) => (
                    <button
                      key={mode}
                      onClick={() =>
                        updatePreferences({
                          workLocation: { ...preferences.workLocation, mode },
                        })
                      }
                      className={`p-2.5 rounded-[7px] border-2 text-sm font-medium transition-all ${
                        preferences.workLocation.mode === mode
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "border-border text-muted-foreground hover:border-border"
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ),
                )}
              </div>

              {preferences.workLocation.mode !== "remote" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase mb-1.5">
                      Office Address
                    </label>
                    <input
                      type="text"
                      value={preferences.workLocation.officeAddress || ""}
                      onChange={(e) =>
                        updatePreferences({
                          workLocation: {
                            ...preferences.workLocation,
                            officeAddress: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., 123 Main St, San Francisco, CA"
                      className="w-full p-2 bg-card dark:bg-neutral-900 border border-border rounded-[7px] text-sm"
                    />
                  </div>
                  <MapPreview
                    address={preferences.workLocation.officeAddress || ""}
                    height="150px"
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Meeting Context */}
          <AccordionItem
            value="context"
            className="border border-border rounded-[7px] overflow-hidden"
          >
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[7px] bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground">
                    Meeting Preferences
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {preferences.meetingContext.bufferBetweenMeetings} min
                    buffer
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-3">
              {[
                {
                  key: "allowBreakfastMeetings",
                  label: "Allow breakfast meetings",
                },
                { key: "allowLunchMeetings", label: "Allow lunch meetings" },
                { key: "allowDinnerMeetings", label: "Allow dinner meetings" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-foreground">{item.label}</span>
                  <Switch
                    checked={
                      preferences.meetingContext[
                        item.key as keyof typeof preferences.meetingContext
                      ] as boolean
                    }
                    onCheckedChange={(checked) =>
                      updatePreferences({
                        meetingContext: {
                          ...preferences.meetingContext,
                          [item.key]: checked,
                        },
                      })
                    }
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase mb-1">
                  Buffer Between Meetings{" "}
                  <span className="text-muted-foreground normal-case">
                    (if no travel)
                  </span>
                </label>
                <p className="text-[11px] text-muted-foreground mb-1.5">
                  Travel time will be calculated automatically
                </p>
                <select
                  value={preferences.meetingContext.bufferBetweenMeetings}
                  onChange={(e) =>
                    updatePreferences({
                      meetingContext: {
                        ...preferences.meetingContext,
                        bufferBetweenMeetings: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full p-2 bg-card dark:bg-neutral-900 border border-border rounded-[7px] text-sm"
                >
                  <option value={0}>No buffer</option>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Quick Save Locations */}
          <AccordionItem
            value="locations"
            className="border border-border rounded-[7px] overflow-hidden"
          >
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[7px] bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground">
                    Quick Save Locations
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {preferences.savedLocations.length} location
                    {preferences.savedLocations.length !== 1 ? "s" : ""} •
                    Auto-saves from meetings
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {preferences.savedLocations.length > 0 && (
                <div className="space-y-2 mb-4">
                  {preferences.savedLocations.map((loc) => (
                    <div
                      key={loc.id}
                      className="flex items-center gap-2 p-2.5 rounded-[7px] border border-border bg-card dark:bg-neutral-900"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {loc.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {loc.address}
                        </p>
                      </div>
                      <button
                        onClick={() => removeLocation(loc.id)}
                        className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    placeholder="Name"
                    className="flex-1 p-2 bg-card dark:bg-neutral-900 border border-border rounded-[7px] text-sm"
                  />
                  <input
                    type="text"
                    value={newLocationAddress}
                    onChange={(e) => setNewLocationAddress(e.target.value)}
                    placeholder="Address"
                    className="flex-1 p-2 bg-card dark:bg-neutral-900 border border-border rounded-[7px] text-sm"
                  />
                  <button
                    onClick={addLocation}
                    disabled={
                      !newLocationName.trim() || !newLocationAddress.trim()
                    }
                    className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-[7px] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {newLocationAddress && (
                  <MapPreview address={newLocationAddress} height="140px" />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Communication Style */}
          <AccordionItem
            value="communication"
            className="border border-border rounded-[7px] overflow-hidden"
          >
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[7px] bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground">
                    Communication Style
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {preferences.communicationStyle.preferSchedulingLinks
                      ? "Scheduling links"
                      : "Email coordination"}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase mb-1.5">
                  Your Name / Signature
                </label>
                <input
                  type="text"
                  value={preferences.communicationStyle.signature}
                  onChange={(e) =>
                    updatePreferences({
                      communicationStyle: {
                        ...preferences.communicationStyle,
                        signature: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., Alex Lewis"
                  className="w-full p-2 bg-card dark:bg-neutral-900 border border-border rounded-[7px] text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">
                  Prefer scheduling links
                </span>
                <Switch
                  checked={preferences.communicationStyle.preferSchedulingLinks}
                  onCheckedChange={(checked) =>
                    updatePreferences({
                      communicationStyle: {
                        ...preferences.communicationStyle,
                        preferSchedulingLinks: checked,
                      },
                    })
                  }
                />
              </div>

              {preferences.communicationStyle.preferSchedulingLinks && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase mb-1.5">
                    Scheduling Link URL
                  </label>
                  <input
                    type="url"
                    value={
                      preferences.communicationStyle.schedulingLinkUrl || ""
                    }
                    onChange={(e) =>
                      updatePreferences({
                        communicationStyle: {
                          ...preferences.communicationStyle,
                          schedulingLinkUrl: e.target.value,
                        },
                      })
                    }
                    placeholder="https://calendly.com/yourname"
                    className="w-full p-2 bg-card dark:bg-neutral-900 border border-border rounded-[7px] text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase mb-1.5">
                  Email Template
                </label>
                <textarea
                  value={preferences.communicationStyle.emailTemplate}
                  onChange={(e) =>
                    updatePreferences({
                      communicationStyle: {
                        ...preferences.communicationStyle,
                        emailTemplate: e.target.value,
                      },
                    })
                  }
                  rows={6}
                  className="w-full p-2 bg-card dark:bg-neutral-900 border border-border rounded-[7px] text-sm font-mono resize-none"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Reset Button */}
        <div className="pt-4 border-t border-border">
          <button
            onClick={resetToDefaults}
            className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
          >
            Reset to defaults
          </button>
        </div>
      </div>

      <SchedulingOnboarding
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </>
  );
};

export default SchedulingSettingsSection;
