import { create } from "zustand";

export type Frequency = "weekly" | "biweekly" | "monthly";
export type Preset =
  | "org-overview"
  | "engineering"
  | "customer-revenue"
  | "custom";

export interface ScheduleSettings {
  frequency: Frequency;
  dayOfWeek: string;
  time: string;
}

interface SettingsState {
  isOpen: boolean;

  // Schedule
  frequency: Frequency;
  dayOfWeek: string;
  time: string;

  // Focus
  preset: Preset;
  customInstructions: string;

  // Actions
  openSettings: () => void;
  closeSettings: () => void;
  updateSchedule: (updates: Partial<ScheduleSettings>) => void;
  setPreset: (preset: Preset) => void;
  setCustomInstructions: (text: string) => void;
  saveSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isOpen: false,

  // Default schedule values
  frequency: "weekly",
  dayOfWeek: "monday",
  time: "09:00",

  // Default focus values
  preset: "org-overview",
  customInstructions: "",

  openSettings: () => set({ isOpen: true }),

  closeSettings: () => set({ isOpen: false }),

  updateSchedule: (updates) => set(updates),

  setPreset: (preset) => set({ preset }),

  setCustomInstructions: (text) => set({ customInstructions: text }),

  saveSettings: () => {
    // In a real app, this would persist to backend
    // For now, just close the settings view
    set({ isOpen: false });
  },
}));
