import {
  SchedulingPreferences,
  DayOfWeek,
  TimeRange,
  DaySchedule,
  WorkingAvailability,
  SavedLocation,
  MeetingContextPreferences,
  WorkLocationPreferences,
  SchedulingCommunicationStyle,
  SchedulingContext,
  TimeSlot,
  MeetingType,
  MeetingFormat,
  MeetingMode,
  AttentionItem
} from '../types';

/**
 * Returns default scheduling preferences
 */
export function getDefaultPreferences(): SchedulingPreferences {
  const defaultTimeRange: TimeRange = { start: '09:00', end: '17:00' };

  const defaultDaySchedule = (day: DayOfWeek, isWorkday: boolean): DaySchedule => ({
    day,
    enabled: isWorkday,
    timeRanges: isWorkday ? [{ ...defaultTimeRange }] : []
  });

  const workingAvailability: WorkingAvailability = {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekSchedule: [
      defaultDaySchedule('monday', true),
      defaultDaySchedule('tuesday', true),
      defaultDaySchedule('wednesday', true),
      defaultDaySchedule('thursday', true),
      defaultDaySchedule('friday', true),
      defaultDaySchedule('saturday', false),
      defaultDaySchedule('sunday', false),
    ],
    exceptions: []
  };

  const workLocation: WorkLocationPreferences = {
    mode: 'hybrid',
    officeAddress: '',
    homeAddress: '',
    preferredMeetingLocation: 'flexible'
  };

  const meetingContext: MeetingContextPreferences = {
    allowBreakfastMeetings: false,
    allowLunchMeetings: true,
    allowDinnerMeetings: false,
    virtualOnlyWindows: [],
    bufferBetweenMeetings: 15,
    maxMeetingsPerDay: 8,
    focusTimeBlocks: []
  };

  const savedLocations: SavedLocation[] = [];

  const communicationStyle: SchedulingCommunicationStyle = {
    emailTemplate: `Hi {{name}},

I am Sentra from {{company}}, reaching out on behalf of {{signature}}.

I'd like to connect with you. Here are a few options that work:

{{slots}}

Let me know which option works best for you, or if you find another alternative, feel free to set a time that suits you.

Alternatively, if you have a Calendly link or any preferred scheduling link, please share it and I'll find the best time for you, coordinating with all parties.

Best regards,
{{signature}}`,
    signature: '',
    preferSchedulingLinks: false,
    schedulingLinkUrl: ''
  };

  return {
    workingAvailability,
    workLocation,
    meetingContext,
    savedLocations,
    communicationStyle
  };
}

/**
 * Generate available time slots based on preferences
 */
export function generateTimeSlots(
  preferences: SchedulingPreferences,
  durationMinutes: number = 30,
  daysAhead: number = 7
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();

  for (let dayOffset = 1; dayOffset <= daysAhead; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
    const daySchedule = preferences.workingAvailability.weekSchedule.find(d => d.day === dayOfWeek);

    if (!daySchedule?.enabled) continue;

    // Check for exceptions
    const dateStr = date.toISOString().split('T')[0];
    const exception = preferences.workingAvailability.exceptions.find(e => e.date === dateStr);
    if (exception && !exception.isAvailable) continue;

    const timeRanges = exception?.customTimeRanges || daySchedule.timeRanges;

    for (const range of timeRanges) {
      const [startHour, startMin] = range.start.split(':').map(Number);
      const [endHour, endMin] = range.end.split(':').map(Number);

      let slotStart = startHour * 60 + startMin;
      const rangeEnd = endHour * 60 + endMin;

      while (slotStart + durationMinutes <= rangeEnd) {
        const startTime = new Date(date);
        startTime.setHours(Math.floor(slotStart / 60), slotStart % 60, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + durationMinutes);

        slots.push({
          id: `slot-${startTime.getTime()}`,
          start: startTime,
          end: endTime,
          score: scoreTimeSlot({
            id: `slot-${startTime.getTime()}`,
            start: startTime,
            end: endTime
          }, preferences),
          isPreferred: false,
          conflictsWith: []
        });

        slotStart += 30; // 30-minute increments
      }
    }
  }

  // Sort by score descending, then by date ascending
  return slots.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.start.getTime() - b.start.getTime();
  });
}

/**
 * Score a time slot based on preferences
 */
export function scoreTimeSlot(slot: Pick<TimeSlot, 'start' | 'end'>, preferences: SchedulingPreferences): number {
  let score = 50; // Base score

  const hour = slot.start.getHours();
  const dayOfWeek = slot.start.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  // Prefer mid-morning and early afternoon
  if (hour >= 10 && hour <= 11) score += 20;
  else if (hour >= 14 && hour <= 15) score += 15;
  else if (hour >= 9 && hour <= 16) score += 10;

  // Penalize early morning
  if (hour < 9) score -= 10;

  // Penalize late afternoon
  if (hour >= 17) score -= 15;

  // Prefer Tuesday-Thursday
  if (['tuesday', 'wednesday', 'thursday'].includes(dayOfWeek)) score += 10;

  // Penalize Monday and Friday
  if (dayOfWeek === 'monday') score -= 5;
  if (dayOfWeek === 'friday') score -= 5;

  // Check lunch meetings preference
  if (hour >= 12 && hour < 13) {
    if (!preferences.meetingContext.allowLunchMeetings) score -= 30;
  }

  // Check breakfast meetings preference
  if (hour < 9) {
    if (!preferences.meetingContext.allowBreakfastMeetings) score -= 30;
  }

  // Check dinner meetings preference
  if (hour >= 18) {
    if (!preferences.meetingContext.allowDinnerMeetings) score -= 30;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Detect meeting type from an attention item
 */
export function detectMeetingType(item: AttentionItem): {
  type: MeetingType;
  format: MeetingFormat;
  mode: MeetingMode;
} {
  let type: MeetingType = 'one-on-one';
  let format: MeetingFormat = 'virtual';
  let mode: MeetingMode = 'internal';

  // Detect based on item type and content
  if (item.itemType === 'relationship') {
    // External contact
    mode = 'external';
    type = 'one-on-one';

    if ('contactCompany' in item && item.contactCompany) {
      // Has company info, likely external business contact
      mode = 'external';
    }
  } else if (item.itemType === 'meeting') {
    // Parse from meeting data
    if ('attendees' in item && Array.isArray(item.attendees)) {
      type = item.attendees.length > 2 ? 'group' : 'one-on-one';
    }

    if ('location' in item) {
      const location = item.location?.toLowerCase() || '';
      if (location.includes('room') || location === 'in person') {
        format = 'in-person';
      } else if (location.includes('zoom') || location.includes('meet') || location.includes('teams')) {
        format = 'virtual';
      }
    }
  } else if (item.itemType === 'commitment') {
    // Commitment follow-up
    mode = 'internal';
    type = 'one-on-one';

    if ('assignee' in item && item.assignee) {
      // Check if assignee looks like an external contact
      if (item.assignee.includes('@') && !item.assignee.includes('sentra')) {
        mode = 'external';
      }
    }
  }

  return { type, format, mode };
}

/**
 * Generate a scheduling email draft based on context
 */
export function generateSchedulingEmail(
  context: SchedulingContext,
  preferences: SchedulingPreferences,
  slots: TimeSlot[]
): string {
  const { recipient, subject, meetingType, format, duration } = context;

  let template = preferences.communicationStyle.emailTemplate;

  // Replace placeholders
  template = template.replace(/\{\{name\}\}/g, recipient.name || 'there');
  template = template.replace(/\{\{signature\}\}/g, preferences.communicationStyle.signature || 'Your name');
  template = template.replace(/\{\{company\}\}/g, recipient.company || 'our organization');

  // Generate slots text
  const topSlots = slots.slice(0, 3);
  const slotsText = topSlots.map(slot => {
    const date = slot.start.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    const time = slot.start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const endTime = slot.end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return `• ${date}, ${time} - ${endTime}`;
  }).join('\n');

  template = template.replace(/\{\{slots\}\}/g, slotsText);

  // Add meeting format context
  if (format === 'in-person' && context.location) {
    template = template.replace(
      'Let me know what works best',
      `We can meet at ${context.location}. Let me know what works best`
    );
  } else if (format === 'virtual') {
    template = template.replace(
      'Let me know what works best',
      "I'll send a video call link once we confirm. Let me know what works best"
    );
  }

  return template;
}

/**
 * Format a time slot for display
 */
export function formatTimeSlot(slot: TimeSlot): string {
  const date = slot.start.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  const time = slot.start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  return `${date}, ${time}`;
}

/**
 * Get duration options for scheduling
 */
export function getDurationOptions(): { value: number; label: string }[] {
  return [
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
  ];
}

/**
 * Get timezone options
 */
export function getTimezoneOptions(): { value: string; label: string }[] {
  return [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Central European (CET)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  ];
}
