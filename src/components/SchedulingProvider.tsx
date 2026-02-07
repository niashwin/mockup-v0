import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SchedulingPreferences } from '../types';
import { getDefaultPreferences } from '../utils/SchedulingUtils';

const STORAGE_KEY = 'sentra-scheduling-preferences';

interface SchedulingProviderProps {
  children: React.ReactNode;
}

interface SchedulingProviderState {
  isOnboarded: boolean;
  preferences: SchedulingPreferences;
  updatePreferences: (updates: Partial<SchedulingPreferences>) => void;
  setOnboarded: (value: boolean) => void;
  resetToDefaults: () => void;
}

const initialState: SchedulingProviderState = {
  isOnboarded: false,
  preferences: getDefaultPreferences(),
  updatePreferences: () => null,
  setOnboarded: () => null,
  resetToDefaults: () => null,
};

const SchedulingContext = createContext<SchedulingProviderState>(initialState);

interface StoredSchedulingData {
  isOnboarded: boolean;
  preferences: SchedulingPreferences;
}

export function SchedulingProvider({ children }: SchedulingProviderProps) {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<SchedulingPreferences>(getDefaultPreferences());

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredSchedulingData = JSON.parse(stored);
        setIsOnboarded(data.isOnboarded ?? false);
        if (data.preferences) {
          setPreferences(prev => ({ ...prev, ...data.preferences }));
        }
      }
    } catch (e) {
      console.error('Failed to load scheduling preferences:', e);
    }
  }, []);

  // Persist to localStorage when state changes
  const persistState = useCallback((onboarded: boolean, prefs: SchedulingPreferences) => {
    if (typeof window === 'undefined') return;

    try {
      const data: StoredSchedulingData = {
        isOnboarded: onboarded,
        preferences: prefs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save scheduling preferences:', e);
    }
  }, []);

  const updatePreferences = useCallback((updates: Partial<SchedulingPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...updates };
      persistState(isOnboarded, updated);
      return updated;
    });
  }, [isOnboarded, persistState]);

  const handleSetOnboarded = useCallback((value: boolean) => {
    setIsOnboarded(value);
    persistState(value, preferences);
  }, [preferences, persistState]);

  const resetToDefaults = useCallback(() => {
    const defaults = getDefaultPreferences();
    setPreferences(defaults);
    setIsOnboarded(false);
    persistState(false, defaults);
  }, [persistState]);

  const value: SchedulingProviderState = {
    isOnboarded,
    preferences,
    updatePreferences,
    setOnboarded: handleSetOnboarded,
    resetToDefaults,
  };

  return (
    <SchedulingContext.Provider value={value}>
      {children}
    </SchedulingContext.Provider>
  );
}

export const useScheduling = (): SchedulingProviderState => {
  const context = useContext(SchedulingContext);

  if (context === undefined) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }

  return context;
};
