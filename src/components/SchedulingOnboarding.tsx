import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Coffee,
  BookOpen,
  Mail,
  CalendarDays,
  Plus,
  Trash2,
  Home,
  Building2,
  Laptop,
  Info
} from 'lucide-react';
import { useScheduling } from './SchedulingProvider';
import { Switch } from './ui/switch';
import { MapPreview } from './MapPreview';
import {
  DayOfWeek,
  TimeRange,
  DaySchedule,
  LocationMode,
  SavedLocation,
  SchedulingPreferences
} from '../types';
import { getTimezoneOptions } from '../utils/SchedulingUtils';

interface SchedulingOnboardingProps {
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

// Time slots from 6 AM to 10 PM in 30-minute increments
const TIME_SLOTS = Array.from({ length: 32 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6; // Start at 6 AM
  const minute = (i % 2) * 30;
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const label = new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  return { value: time, label, hour, minute };
});

// Special time markers for meal meetings
const MEAL_TIMES = {
  breakfast: { start: 6, end: 9, label: 'Breakfast' },
  lunch: { start: 12, end: 13, label: 'Lunch' },
  dinner: { start: 18, end: 21, label: 'Dinner' }
};

export const SchedulingOnboarding: React.FC<SchedulingOnboardingProps> = ({
  open,
  onClose,
  onComplete
}) => {
  const { preferences, updatePreferences, setOnboarded } = useScheduling();
  const [step, setStep] = useState(0);

  // Local state for editing during onboarding
  const [localPrefs, setLocalPrefs] = useState<SchedulingPreferences>(preferences);

  // Time grid selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ day: DayOfWeek; slot: number } | null>(null);
  const [selectionMode, setSelectionMode] = useState<'add' | 'remove'>('add');
  const gridRef = useRef<HTMLDivElement>(null);

  // Selected time slots as a Set of "day-slotIndex" strings
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(() => {
    const slots = new Set<string>();
    localPrefs.workingAvailability.weekSchedule.forEach(daySchedule => {
      if (daySchedule.enabled && daySchedule.timeRanges.length > 0) {
        daySchedule.timeRanges.forEach(range => {
          const startHour = parseInt(range.start.split(':')[0]);
          const startMin = parseInt(range.start.split(':')[1]);
          const endHour = parseInt(range.end.split(':')[0]);
          const endMin = parseInt(range.end.split(':')[1]);

          const startSlot = (startHour - 6) * 2 + (startMin >= 30 ? 1 : 0);
          const endSlot = (endHour - 6) * 2 + (endMin > 0 ? 1 : 0);

          for (let i = startSlot; i < endSlot && i < 32; i++) {
            if (i >= 0) slots.add(`${daySchedule.day}-${i}`);
          }
        });
      }
    });
    return slots;
  });

  // New location form state
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationAddress, setNewLocationAddress] = useState('');

  const totalSteps = 6;

  const updateLocalPrefs = (updates: Partial<SchedulingPreferences>) => {
    setLocalPrefs(prev => ({ ...prev, ...updates }));
  };

  // Convert selected slots to week schedule
  const slotsToSchedule = useCallback((slots: Set<string>): DaySchedule[] => {
    return DAYS.map(({ key }) => {
      const daySlots = Array.from(slots)
        .filter(s => s.startsWith(`${key}-`))
        .map(s => parseInt(s.split('-')[1]))
        .sort((a, b) => a - b);

      if (daySlots.length === 0) {
        return { day: key, enabled: false, timeRanges: [] };
      }

      // Group consecutive slots into ranges
      const ranges: TimeRange[] = [];
      let rangeStart = daySlots[0];
      let rangeEnd = daySlots[0];

      for (let i = 1; i <= daySlots.length; i++) {
        if (i < daySlots.length && daySlots[i] === rangeEnd + 1) {
          rangeEnd = daySlots[i];
        } else {
          const startHour = Math.floor(rangeStart / 2) + 6;
          const startMin = (rangeStart % 2) * 30;
          const endHour = Math.floor((rangeEnd + 1) / 2) + 6;
          const endMin = ((rangeEnd + 1) % 2) * 30;

          ranges.push({
            start: `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
            end: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`
          });

          if (i < daySlots.length) {
            rangeStart = daySlots[i];
            rangeEnd = daySlots[i];
          }
        }
      }

      return { day: key, enabled: true, timeRanges: ranges };
    });
  }, []);

  // Update preferences when slots change
  const updateSlotsAndPrefs = useCallback((newSlots: Set<string>) => {
    setSelectedSlots(newSlots);
    updateLocalPrefs({
      workingAvailability: {
        ...localPrefs.workingAvailability,
        weekSchedule: slotsToSchedule(newSlots)
      }
    });
  }, [localPrefs.workingAvailability, slotsToSchedule]);

  // Handle grid cell interaction
  const handleCellMouseDown = (day: DayOfWeek, slotIndex: number) => {
    const slotKey = `${day}-${slotIndex}`;
    const isCurrentlySelected = selectedSlots.has(slotKey);
    setIsSelecting(true);
    setSelectionStart({ day, slot: slotIndex });
    setSelectionMode(isCurrentlySelected ? 'remove' : 'add');

    const newSlots = new Set(selectedSlots);
    if (isCurrentlySelected) {
      newSlots.delete(slotKey);
    } else {
      newSlots.add(slotKey);
    }
    updateSlotsAndPrefs(newSlots);
  };

  const handleCellMouseEnter = (day: DayOfWeek, slotIndex: number) => {
    if (!isSelecting || !selectionStart) return;

    const slotKey = `${day}-${slotIndex}`;
    const newSlots = new Set(selectedSlots);

    // Only allow selection within the same day for dragging
    if (day === selectionStart.day) {
      const minSlot = Math.min(selectionStart.slot, slotIndex);
      const maxSlot = Math.max(selectionStart.slot, slotIndex);

      for (let i = minSlot; i <= maxSlot; i++) {
        const key = `${day}-${i}`;
        if (selectionMode === 'add') {
          newSlots.add(key);
        } else {
          newSlots.delete(key);
        }
      }
      updateSlotsAndPrefs(newSlots);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectionStart(null);
  };

  const addLocation = () => {
    if (!newLocationName.trim() || !newLocationAddress.trim()) return;

    const newLocation: SavedLocation = {
      id: `loc-${Date.now()}`,
      name: newLocationName.trim(),
      address: newLocationAddress.trim(),
      type: 'other'
    };

    updateLocalPrefs({
      savedLocations: [...localPrefs.savedLocations, newLocation]
    });
    setNewLocationName('');
    setNewLocationAddress('');
  };

  const removeLocation = (id: string) => {
    updateLocalPrefs({
      savedLocations: localPrefs.savedLocations.filter(l => l.id !== id)
    });
  };

  const handleComplete = () => {
    updatePreferences(localPrefs);
    setOnboarded(true);
    onComplete?.();
    onClose();
  };

  // Check if a time slot is in a meal period
  const getMealPeriod = (slotIndex: number): string | null => {
    const hour = Math.floor(slotIndex / 2) + 6;
    if (hour >= MEAL_TIMES.breakfast.start && hour < MEAL_TIMES.breakfast.end) return 'breakfast';
    if (hour >= MEAL_TIMES.lunch.start && hour < MEAL_TIMES.lunch.end) return 'lunch';
    if (hour >= MEAL_TIMES.dinner.start && hour < MEAL_TIMES.dinner.end) return 'dinner';
    return null;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        // Step 1: Meeting Availability with drag-select grid
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Meeting Availability</h3>
              <p className="text-sm text-zinc-500 mt-2">
                When do you want to take meetings? Drag to select available times.
              </p>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Timezone</label>
              <select
                value={localPrefs.workingAvailability.timezone}
                onChange={(e) => updateLocalPrefs({
                  workingAvailability: {
                    ...localPrefs.workingAvailability,
                    timezone: e.target.value
                  }
                })}
                className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
              >
                {getTimezoneOptions().map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            {/* Drag-select time grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-zinc-500 uppercase">Select Available Times</label>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <Info className="w-3 h-3" />
                  <span>Includes breakfast, lunch & dinner times</span>
                </div>
              </div>

              <div
                ref={gridRef}
                className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden select-none"
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Header row with day names */}
                <div className="grid grid-cols-8 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="p-2 text-[10px] font-medium text-zinc-400 text-center"></div>
                  {DAYS.map(({ key, short }) => (
                    <div key={key} className="p-2 text-[10px] font-medium text-zinc-600 dark:text-zinc-400 text-center">
                      {short}
                    </div>
                  ))}
                </div>

                {/* Time grid */}
                <div className="max-h-[280px] overflow-y-auto">
                  {TIME_SLOTS.filter((_, i) => i % 2 === 0).map((slot, rowIndex) => {
                    const slotIndex = rowIndex * 2;
                    const mealPeriod = getMealPeriod(slotIndex);

                    return (
                      <div key={slot.value} className="grid grid-cols-8 border-b border-zinc-100 dark:border-zinc-800/50 last:border-b-0">
                        {/* Time label */}
                        <div className={`p-1.5 text-[10px] text-zinc-400 text-right pr-2 flex items-center justify-end ${
                          mealPeriod ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''
                        }`}>
                          {slot.label}
                          {mealPeriod && slotIndex === (MEAL_TIMES[mealPeriod as keyof typeof MEAL_TIMES].start - 6) * 2 && (
                            <span className="ml-1 text-[8px] text-amber-500 font-medium">
                              {mealPeriod === 'breakfast' ? '🌅' : mealPeriod === 'lunch' ? '🍽' : '🌙'}
                            </span>
                          )}
                        </div>

                        {/* Day cells (each represents 1 hour = 2 slots) */}
                        {DAYS.map(({ key }) => {
                          const slot1Selected = selectedSlots.has(`${key}-${slotIndex}`);
                          const slot2Selected = selectedSlots.has(`${key}-${slotIndex + 1}`);
                          const bothSelected = slot1Selected && slot2Selected;
                          const partialSelected = slot1Selected || slot2Selected;

                          return (
                            <div key={key} className="flex">
                              {/* First 30 min */}
                              <div
                                onMouseDown={() => handleCellMouseDown(key, slotIndex)}
                                onMouseEnter={() => handleCellMouseEnter(key, slotIndex)}
                                className={`flex-1 h-6 border-r border-zinc-100/50 dark:border-zinc-800/30 cursor-pointer transition-colors ${
                                  slot1Selected
                                    ? 'bg-emerald-500 dark:bg-emerald-600'
                                    : mealPeriod
                                      ? 'bg-amber-50/30 dark:bg-amber-900/5 hover:bg-emerald-200 dark:hover:bg-emerald-900/40'
                                      : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                                }`}
                              />
                              {/* Second 30 min */}
                              <div
                                onMouseDown={() => handleCellMouseDown(key, slotIndex + 1)}
                                onMouseEnter={() => handleCellMouseEnter(key, slotIndex + 1)}
                                className={`flex-1 h-6 border-r border-zinc-200/50 dark:border-zinc-800/50 cursor-pointer transition-colors ${
                                  slot2Selected
                                    ? 'bg-emerald-500 dark:bg-emerald-600'
                                    : mealPeriod
                                      ? 'bg-amber-50/30 dark:bg-amber-900/5 hover:bg-emerald-200 dark:hover:bg-emerald-900/40'
                                      : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-[10px] text-zinc-400 mt-2 text-center">
                Click and drag to select time blocks • Shaded areas indicate meal meeting times
              </p>
            </div>
          </div>
        );

      case 1:
        // Step 2: Work Location
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Work Location</h3>
              <p className="text-sm text-zinc-500 mt-2">
                Help Sentra understand your work style for better location suggestions.
              </p>
            </div>

            {/* Location Mode */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'remote', label: 'Remote', icon: Laptop, desc: 'Work from home' },
                { value: 'hybrid', label: 'Hybrid', icon: Home, desc: 'Mix of home & office' },
                { value: 'office', label: 'Office', icon: Building2, desc: 'Primarily in office' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateLocalPrefs({
                    workLocation: { ...localPrefs.workLocation, mode: option.value as LocationMode }
                  })}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    localPrefs.workLocation.mode === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <option.icon className={`w-6 h-6 mb-2 ${
                    localPrefs.workLocation.mode === option.value
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-zinc-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    localPrefs.workLocation.mode === option.value
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}>{option.label}</span>
                  <span className="text-[10px] text-zinc-400 mt-1">{option.desc}</span>
                </button>
              ))}
            </div>

            {/* Address Inputs */}
            {localPrefs.workLocation.mode !== 'remote' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Office Address</label>
                  <input
                    type="text"
                    value={localPrefs.workLocation.officeAddress || ''}
                    onChange={(e) => updateLocalPrefs({
                      workLocation: { ...localPrefs.workLocation, officeAddress: e.target.value }
                    })}
                    placeholder="e.g., 123 Main St, San Francisco, CA"
                    className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                  />
                </div>
                <MapPreview
                  address={localPrefs.workLocation.officeAddress || ''}
                  height="180px"
                />
              </div>
            )}

            {localPrefs.workLocation.mode !== 'office' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Home Address (Optional)</label>
                  <input
                    type="text"
                    value={localPrefs.workLocation.homeAddress || ''}
                    onChange={(e) => updateLocalPrefs({
                      workLocation: { ...localPrefs.workLocation, homeAddress: e.target.value }
                    })}
                    placeholder="For travel time estimates"
                    className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                  />
                </div>
                <MapPreview
                  address={localPrefs.workLocation.homeAddress || ''}
                  height="180px"
                />
              </div>
            )}
          </div>
        );

      case 2:
        // Step 3: Meeting Context
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Meeting Preferences</h3>
              <p className="text-sm text-zinc-500 mt-2">
                Fine-tune when and how you like to take meetings.
              </p>
            </div>

            {/* Meal Meetings */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-zinc-500 uppercase">Meal Meetings</label>

              {[
                { key: 'allowBreakfastMeetings', label: 'Breakfast meetings', time: 'Before 9 AM' },
                { key: 'allowLunchMeetings', label: 'Lunch meetings', time: '12 - 1 PM' },
                { key: 'allowDinnerMeetings', label: 'Dinner meetings', time: 'After 6 PM' }
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                >
                  <div>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
                    <span className="text-xs text-zinc-400 ml-2">{item.time}</span>
                  </div>
                  <Switch
                    checked={localPrefs.meetingContext[item.key as keyof typeof localPrefs.meetingContext] as boolean}
                    onCheckedChange={(checked) => updateLocalPrefs({
                      meetingContext: { ...localPrefs.meetingContext, [item.key]: checked }
                    })}
                  />
                </div>
              ))}
            </div>

            {/* Buffer Time */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">
                Buffer Between Meetings <span className="text-zinc-400 normal-case">(if no travel)</span>
              </label>
              <p className="text-[11px] text-zinc-400 mb-2">Travel time will be calculated automatically</p>
              <select
                value={localPrefs.meetingContext.bufferBetweenMeetings}
                onChange={(e) => updateLocalPrefs({
                  meetingContext: { ...localPrefs.meetingContext, bufferBetweenMeetings: Number(e.target.value) }
                })}
                className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
              >
                <option value={0}>No buffer</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>

            {/* Max Meetings */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Max Meetings Per Day</label>
              <select
                value={localPrefs.meetingContext.maxMeetingsPerDay || 8}
                onChange={(e) => updateLocalPrefs({
                  meetingContext: { ...localPrefs.meetingContext, maxMeetingsPerDay: Number(e.target.value) }
                })}
                className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
              >
                <option value={4}>4 meetings</option>
                <option value={6}>6 meetings</option>
                <option value={8}>8 meetings</option>
                <option value={10}>10 meetings</option>
                <option value={0}>No limit</option>
              </select>
            </div>
          </div>
        );

      case 3:
        // Step 4: Quick Save Locations
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Quick Save Locations</h3>
              <p className="text-sm text-zinc-500 mt-2">
                Add frequently used meeting spots for quick selection.
              </p>
              <p className="text-xs text-zinc-400 mt-1 italic">
                Any meetings you have at other places will automatically save here.
              </p>
            </div>

            {/* Saved Locations List */}
            {localPrefs.savedLocations.length > 0 && (
              <div className="space-y-2">
                {localPrefs.savedLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  >
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{loc.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{loc.address}</p>
                    </div>
                    <button
                      onClick={() => removeLocation(loc.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Location */}
            <div className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="space-y-3">
                <input
                  type="text"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  placeholder="Location name (e.g., Blue Bottle Coffee)"
                  className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                />
                <input
                  type="text"
                  value={newLocationAddress}
                  onChange={(e) => setNewLocationAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                />
                <MapPreview
                  address={newLocationAddress}
                  height="150px"
                />
                <button
                  onClick={addLocation}
                  disabled={!newLocationName.trim() || !newLocationAddress.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Location
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-400 text-center">
              This step is optional — you can skip and add locations later.
            </p>
          </div>
        );

      case 4:
        // Step 5: Communication Style
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Communication Style</h3>
              <p className="text-sm text-zinc-500 mt-2">
                Customize how Sentra drafts scheduling messages on your behalf.
              </p>
            </div>

            {/* Signature */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Your Name / Signature</label>
              <input
                type="text"
                value={localPrefs.communicationStyle.signature}
                onChange={(e) => updateLocalPrefs({
                  communicationStyle: { ...localPrefs.communicationStyle, signature: e.target.value }
                })}
                placeholder="e.g., Alex Lewis"
                className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
              />
            </div>

            {/* Email Template */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Email Template</label>
              <p className="text-xs text-zinc-400 mb-2">
                Use {'{{name}}'}, {'{{slots}}'}, {'{{signature}}'}, and {'{{company}}'} as placeholders.
              </p>
              <textarea
                value={localPrefs.communicationStyle.emailTemplate}
                onChange={(e) => updateLocalPrefs({
                  communicationStyle: { ...localPrefs.communicationStyle, emailTemplate: e.target.value }
                })}
                rows={10}
                className="w-full p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-mono resize-none"
              />
            </div>

            {/* Scheduling Link Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Prefer scheduling links</span>
                <p className="text-xs text-zinc-400 mt-0.5">Use Calendly, Cal.com, etc.</p>
              </div>
              <Switch
                checked={localPrefs.communicationStyle.preferSchedulingLinks}
                onCheckedChange={(checked) => updateLocalPrefs({
                  communicationStyle: { ...localPrefs.communicationStyle, preferSchedulingLinks: checked }
                })}
              />
            </div>

            {localPrefs.communicationStyle.preferSchedulingLinks && (
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Scheduling Link URL</label>
                <input
                  type="url"
                  value={localPrefs.communicationStyle.schedulingLinkUrl || ''}
                  onChange={(e) => updateLocalPrefs({
                    communicationStyle: { ...localPrefs.communicationStyle, schedulingLinkUrl: e.target.value }
                  })}
                  placeholder="https://calendly.com/yourname"
                  className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                />
              </div>
            )}
          </div>
        );

      case 5:
        // Step 6: Review & Confirm
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Review Setup</h3>
              <p className="text-sm text-zinc-500 mt-2">
                Here's a summary of your scheduling preferences.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Meeting Availability</span>
                </div>
                <p className="text-xs text-zinc-500">
                  {localPrefs.workingAvailability.weekSchedule.filter(d => d.enabled).map(d => d.day.charAt(0).toUpperCase() + d.day.slice(1, 3)).join(', ')}
                  {' • '}
                  {localPrefs.workingAvailability.timezone}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Work Location</span>
                </div>
                <p className="text-xs text-zinc-500">
                  {localPrefs.workLocation.mode.charAt(0).toUpperCase() + localPrefs.workLocation.mode.slice(1)}
                  {localPrefs.workLocation.officeAddress && ` • ${localPrefs.workLocation.officeAddress}`}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Meeting Preferences</span>
                </div>
                <p className="text-xs text-zinc-500">
                  {[
                    localPrefs.meetingContext.allowBreakfastMeetings && 'Breakfast',
                    localPrefs.meetingContext.allowLunchMeetings && 'Lunch',
                    localPrefs.meetingContext.allowDinnerMeetings && 'Dinner'
                  ].filter(Boolean).join(', ') || 'No meal meetings'}
                  {' • '}
                  {localPrefs.meetingContext.bufferBetweenMeetings} min buffer
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Saved Locations</span>
                </div>
                <p className="text-xs text-zinc-500">
                  {localPrefs.savedLocations.length} location{localPrefs.savedLocations.length !== 1 ? 's' : ''} saved
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-pink-500" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Communication</span>
                </div>
                <p className="text-xs text-zinc-500">
                  {localPrefs.communicationStyle.preferSchedulingLinks ? 'Scheduling links preferred' : 'Email coordination'}
                  {localPrefs.communicationStyle.signature && ` • Signed as ${localPrefs.communicationStyle.signature}`}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-[2rem] shadow-2xl border border-white/20 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <header className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className={`p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${step === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ChevronLeft size={20} className="text-zinc-500" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Set Up Scheduling</h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mt-1">
                <span>Step {step + 1} of {totalSteps}</span>
                <div className="w-24 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors">
            <X size={24} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-lg mx-auto"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
          <button
            onClick={onClose}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            {step === 5 ? 'Cancel' : 'Skip for now'}
          </button>

          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep(s => Math.min(totalSteps - 1, s + 1))}
              className="flex items-center gap-2 px-6 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <span>Continue</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-600/20"
            >
              <CheckCircle2 size={16} />
              <span>Complete Setup</span>
            </button>
          )}
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default SchedulingOnboarding;
