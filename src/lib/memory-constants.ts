/**
 * Memory Timeline Constants
 *
 * Shared constants and types for the memory timeline feature.
 */

// Zoom levels for the timeline
export const ZOOM_LEVELS = [0.6, 0.75, 0.85, 1.0, 1.15] as const;
export const DEFAULT_ZOOM_INDEX = 3; // Start at 1.0 (100%)
export const BASE_COLUMN_WIDTH = 300; // Base width at zoom 1.0

// Week data structure for timeline columns
export interface WeekData {
  label: string;
  dateRange: string;
  weekOffset: number;
  isCurrentWeek: boolean;
  isFuture: boolean;
}
