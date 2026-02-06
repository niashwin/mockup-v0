import { AttentionItem, ActionCategory } from '../types';

// Action definition
export interface ActionDefinition {
  id: string;
  label: string;
  category: ActionCategory;
  icon?: string;
  shortcut?: string;
}

// Action categories with styling
export const ACTION_STYLES: Record<ActionCategory, {
  bg: string;
  text: string;
  border: string;
  hover: string;
}> = {
  context: {
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-600 dark:text-zinc-400',
    border: 'border-zinc-200 dark:border-zinc-700',
    hover: 'hover:bg-zinc-200 dark:hover:bg-zinc-700'
  },
  execute: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/40'
  },
  collaborate: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
  }
};

// Context actions (gray) - for viewing and exploration
export const CONTEXT_ACTIONS: ActionDefinition[] = [
  { id: 'view-source', label: 'View Source', category: 'context' },
  { id: 'see-thread', label: 'See Thread', category: 'context' },
  { id: 'show-history', label: 'Show History', category: 'context' },
  { id: 'view-details', label: 'View Details', category: 'context' }
];

// Execute actions (blue) - for taking direct action
export const EXECUTE_ACTIONS: ActionDefinition[] = [
  { id: 'draft-email', label: 'Draft Email', category: 'execute' },
  { id: 'mark-done', label: 'Mark Done', category: 'execute' },
  { id: 'join-meeting', label: 'Join Meeting', category: 'execute' },
  { id: 'snooze', label: 'Snooze', category: 'execute' },
  { id: 'acknowledge', label: 'Acknowledge', category: 'execute' },
  { id: 'resolve', label: 'Resolve', category: 'execute' }
];

// Collaborate actions (green) - for working with others
export const COLLABORATE_ACTIONS: ActionDefinition[] = [
  { id: 'share-card', label: 'Share', category: 'collaborate' },
  { id: 'delegate', label: 'Delegate', category: 'collaborate' },
  { id: 'add-person', label: 'Add Person', category: 'collaborate' },
  { id: 'comment', label: 'Comment', category: 'collaborate' }
];

/**
 * Get available actions for an attention item based on its type
 *
 * Principle 6: Actions are primitives, not features
 * - Context: View source, see related thread (give me more context)
 * - Execute: Draft response, schedule meeting (complete in-product)
 * - Collaborate: Bring someone else in (they see what you see)
 *
 * Each category has ONE clear action to avoid redundancy:
 * - "See context" and "View discussion" are the same → consolidated to "View Source"
 * - "Share with team" and "Loop someone in" are the same → consolidated to "Collaborate"
 */
export function getActionsForItem(item: AttentionItem): {
  context: ActionDefinition[];
  execute: ActionDefinition[];
  collaborate: ActionDefinition[];
} {
  const actions = {
    context: [] as ActionDefinition[],
    execute: [] as ActionDefinition[],
    collaborate: [] as ActionDefinition[]
  };

  switch (item.itemType) {
    case 'alert':
      // Context: ONE action to see the source material
      actions.context = [
        { id: 'view-source', label: 'View Source', category: 'context' }
      ];
      // Execute: Actions to resolve or defer
      actions.execute = [
        { id: 'acknowledge', label: 'Acknowledge', category: 'execute' },
        { id: 'snooze', label: 'Snooze', category: 'execute' }
      ];
      // Collaborate: ONE action to bring others in
      actions.collaborate = [
        { id: 'delegate', label: 'Collaborate', category: 'collaborate' }
      ];
      break;

    case 'commitment':
      // Context: ONE action to see the source/thread
      actions.context = [
        { id: 'view-source', label: 'View Source', category: 'context' }
      ];
      // Execute: Actions to complete or defer
      actions.execute = [
        { id: 'mark-done', label: 'Mark Done', category: 'execute' },
        { id: 'snooze', label: 'Snooze', category: 'execute' }
      ];
      // Collaborate: ONE action to bring others in
      actions.collaborate = [
        { id: 'delegate', label: 'Collaborate', category: 'collaborate' }
      ];
      break;

    case 'meeting':
      // Context: ONE action to see the brief/history
      actions.context = [
        { id: 'view-details', label: 'View Brief', category: 'context' }
      ];
      // Execute: Actions to join or prepare
      actions.execute = [
        { id: 'join-meeting', label: 'Join', category: 'execute' }
      ];
      // Collaborate: ONE action to bring others in
      actions.collaborate = [
        { id: 'delegate', label: 'Collaborate', category: 'collaborate' }
      ];
      break;

    case 'relationship':
      // Context: ONE action to see interaction history
      actions.context = [
        { id: 'view-history', label: 'View History', category: 'context' }
      ];
      // Execute: Actions to reach out
      actions.execute = [
        { id: 'send-message', label: 'Reach Out', category: 'execute' },
        { id: 'snooze', label: 'Snooze', category: 'execute' }
      ];
      // Collaborate: ONE action to bring others in
      actions.collaborate = [
        { id: 'delegate', label: 'Collaborate', category: 'collaborate' }
      ];
      break;
  }

  return actions;
}

/**
 * Get primary action for quick access
 */
export function getPrimaryAction(item: AttentionItem): ActionDefinition | null {
  switch (item.itemType) {
    case 'alert':
      return { id: 'acknowledge', label: 'Acknowledge', category: 'execute' };
    case 'commitment':
      return { id: 'mark-done', label: 'Done', category: 'execute' };
    case 'meeting':
      return { id: 'join-meeting', label: 'Join', category: 'execute' };
    default:
      return null;
  }
}

/**
 * Get action button class string based on category
 */
export function getActionButtonClass(category: ActionCategory): string {
  const style = ACTION_STYLES[category];
  return `${style.bg} ${style.text} ${style.border} ${style.hover} border px-3 py-1.5 rounded-lg text-xs font-medium transition-colors`;
}
