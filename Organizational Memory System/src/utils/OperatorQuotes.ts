// Curated quotes for completion moments that feel personal and encouraging

export type QuoteType = 'complete' | 'snooze' | 'delegate' | 'celebrate';

const QUOTES: Record<QuoteType, string[]> = {
  complete: [
    "Done and dusted.",
    "Another one off the list.",
    "Nicely handled.",
    "That's progress.",
    "Checked off.",
    "Well done.",
    "Moving forward.",
    "One less thing to worry about.",
    "Good work.",
    "Handled."
  ],
  snooze: [
    "Smart move. We'll remind you.",
    "Got it. Tomorrow it is.",
    "Snoozed. We've got your back.",
    "Taking a breather on this one.",
    "Noted. Check back tomorrow.",
    "Postponed for now.",
    "We'll circle back.",
    "Rest easy. It's not forgotten.",
    "On pause. We'll ping you.",
    "Deferred wisely."
  ],
  delegate: [
    "Passed the baton. They're on it.",
    "Handed off successfully.",
    "Now it's their turn.",
    "Delegation complete.",
    "Off your plate, onto theirs.",
    "They've got this.",
    "Good call on the handoff.",
    "Reassigned and tracked.",
    "Teamwork in action.",
    "Shared the load."
  ],
  celebrate: [
    "That was a big one. Well done.",
    "Major milestone achieved.",
    "Outstanding work today.",
    "You're on fire today.",
    "Impressive progress.",
    "That deserves recognition.",
    "Crushing it.",
    "What a win.",
    "Excellence in action.",
    "That's leadership."
  ]
};

// Track which quotes have been used to avoid immediate repetition
const recentQuotes: Record<QuoteType, Set<number>> = {
  complete: new Set(),
  snooze: new Set(),
  delegate: new Set(),
  celebrate: new Set()
};

/**
 * Get a random operator quote for the given type
 * Avoids repeating the same quote in quick succession
 */
export function getOperatorQuote(type: QuoteType): string {
  const quotes = QUOTES[type];
  const recent = recentQuotes[type];

  // Find available quotes (not recently used)
  const availableIndices = quotes
    .map((_, i) => i)
    .filter(i => !recent.has(i));

  // If we've used all quotes, reset the tracking
  if (availableIndices.length === 0) {
    recent.clear();
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Pick a random available quote
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  recent.add(randomIndex);

  // Keep the recent set from growing too large (remember last 3)
  if (recent.size > 3) {
    const oldestIndex = recent.values().next().value;
    recent.delete(oldestIndex);
  }

  return quotes[randomIndex];
}

/**
 * Get a celebratory quote for significant completions
 * Used for high-impact items or streaks
 */
export function getCelebratoryQuote(): string {
  return getOperatorQuote('celebrate');
}

/**
 * Determine if an action deserves celebration
 * Based on impact, streak, completedToday count, or time of day
 */
export function shouldCelebrate(context: {
  completedToday: number;
  streak?: number;
  isHighImpact?: boolean;
}): boolean {
  // Celebrate high-impact completions
  if (context.isHighImpact) return true;

  // Celebrate streaks of 3+
  if (context.streak && context.streak >= 3) return true;

  // Celebrate milestone completions (5, 10, 15...)
  if (context.completedToday > 0 && context.completedToday % 5 === 0) return true;

  // Small random chance to celebrate anyway (5%)
  return Math.random() < 0.05;
}

/**
 * Get a contextual message based on time of day
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 6) return "Burning the midnight oil?";
  if (hour < 12) return "Good morning.";
  if (hour < 14) return "Powering through the day.";
  if (hour < 17) return "Afternoon productivity.";
  if (hour < 20) return "Good evening.";
  return "Working late tonight.";
}

/**
 * Get an encouragement message for when the list is empty
 */
export function getEmptyStateMessage(): string {
  const messages = [
    "All caught up. Nice work.",
    "Clean slate. What's next?",
    "Nothing urgent right now.",
    "You're on top of things.",
    "Clear skies ahead.",
    "Inbox zero energy.",
    "Zen mode activated.",
    "Enjoy the calm."
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get a context-aware quote based on various factors
 */
export function getContextualQuote(context: {
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  completionStreak?: number;
  itemType?: 'commitment' | 'meeting' | 'alert';
  completedToday?: number;
}): string {
  const { timeOfDay, completionStreak, itemType, completedToday } = context;

  // Streak-based quotes take priority
  if (completionStreak && completionStreak >= 5) {
    const streakQuotes = [
      `${completionStreak} in a row. You're unstoppable.`,
      "On fire today.",
      "Momentum is building.",
      "Keep that streak alive."
    ];
    return streakQuotes[Math.floor(Math.random() * streakQuotes.length)];
  }

  // Milestone-based quotes
  if (completedToday && completedToday % 5 === 0 && completedToday > 0) {
    const milestoneQuotes = [
      `${completedToday} done today. Impressive.`,
      "Milestone reached.",
      "That's real progress.",
      "Productive day so far."
    ];
    return milestoneQuotes[Math.floor(Math.random() * milestoneQuotes.length)];
  }

  // Item type specific quotes
  if (itemType === 'meeting') {
    const meetingQuotes = [
      "Meeting prep complete.",
      "Ready for the call.",
      "Briefed and prepared."
    ];
    return meetingQuotes[Math.floor(Math.random() * meetingQuotes.length)];
  }

  if (itemType === 'alert') {
    const alertQuotes = [
      "Risk acknowledged.",
      "On your radar now.",
      "Awareness is the first step."
    ];
    return alertQuotes[Math.floor(Math.random() * alertQuotes.length)];
  }

  // Time-based quotes
  if (timeOfDay) {
    const timeQuotes: Record<string, string[]> = {
      morning: [
        "Great way to start the day.",
        "Morning momentum.",
        "Early progress pays off."
      ],
      afternoon: [
        "Powering through.",
        "Solid afternoon work.",
        "Keeping the pace."
      ],
      evening: [
        "Wrapping up for the day?",
        "Evening productivity.",
        "Strong finish."
      ],
      night: [
        "Burning the midnight oil?",
        "Late night hustle.",
        "Dedicated work."
      ]
    };
    const quotes = timeQuotes[timeOfDay];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Default to standard completion quote
  return getOperatorQuote('complete');
}

/**
 * Get the current time of day category
 */
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}
