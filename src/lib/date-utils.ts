/**
 * Date Utility Functions
 *
 * Shared date formatting utilities for the application.
 */

/**
 * Formats a date as a relative time string (e.g., "Today", "2d ago", "3mo ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Meeting-specific utilities
// ─────────────────────────────────────────────────────────────────────────────

import type { Meeting } from "@types/meeting";

function parseStartTime(date: Date, startTime: string): Date {
  const result = new Date(date);
  const [time, period] = startTime.split(" ");
  const [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (period?.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (period?.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  result.setHours(hours, minutes, 0, 0);
  return result;
}

function isMeetingPast(meeting: Meeting): boolean {
  const startDateTime = parseStartTime(meeting.date, meeting.startTime);
  const endDateTime = new Date(
    startDateTime.getTime() + meeting.duration * 60 * 1000,
  );
  return endDateTime < new Date();
}

function isMeetingToday(meeting: Meeting): boolean {
  const today = new Date();
  return (
    meeting.date.getFullYear() === today.getFullYear() &&
    meeting.date.getMonth() === today.getMonth() &&
    meeting.date.getDate() === today.getDate()
  );
}

/**
 * Gets the number of minutes until a meeting starts
 * Returns negative if meeting has already started
 */
export function getMinutesUntilMeeting(meeting: Meeting): number {
  const startDateTime = parseStartTime(meeting.date, meeting.startTime);
  const diff = startDateTime.getTime() - new Date().getTime();
  return Math.floor(diff / (1000 * 60));
}

/**
 * Gets a countdown string for an upcoming meeting
 * e.g., "In 15 mins", "In 2 hours", "Starting now", "Started 5 mins ago"
 */
export function getCountdownString(meeting: Meeting): string {
  const minutes = getMinutesUntilMeeting(meeting);

  if (minutes <= 0 && minutes > -meeting.duration) {
    return "In progress";
  }
  if (minutes <= 0) {
    return "Ended";
  }
  if (minutes <= 1) {
    return "Starting now";
  }
  if (minutes < 60) {
    return `In ${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours === 1) {
    return "In 1 hour";
  }
  if (hours < 24) {
    return `In ${hours} hours`;
  }
  const days = Math.floor(hours / 24);
  if (days === 1) {
    return "Tomorrow";
  }
  return `In ${days} days`;
}

/**
 * Formats the countdown with the actual time
 * e.g., "In 15 mins (11:00 AM)"
 */
export function getCountdownWithTime(meeting: Meeting): string {
  const countdown = getCountdownString(meeting);
  return `${countdown} (${meeting.startTime})`;
}

/**
 * Categorizes meetings into past (today + older), up next, and later
 */
export function categorizeMeetings(meetings: Meeting[]): {
  pastToday: Meeting[];
  pastOlder: Meeting[];
  upNext: Meeting | null;
  later: Meeting[];
} {
  const pastToday: Meeting[] = [];
  const pastOlder: Meeting[] = [];
  const upcoming: Meeting[] = [];

  for (const meeting of meetings) {
    if (isMeetingPast(meeting)) {
      if (isMeetingToday(meeting)) {
        pastToday.push(meeting);
      } else {
        pastOlder.push(meeting);
      }
    } else {
      upcoming.push(meeting);
    }
  }

  // Sort past meetings by time (most recent first)
  pastToday.sort((a, b) => {
    const aTime = parseStartTime(a.date, a.startTime);
    const bTime = parseStartTime(b.date, b.startTime);
    return bTime.getTime() - aTime.getTime();
  });

  // Sort older past meetings by date (most recent first)
  pastOlder.sort((a, b) => {
    const aTime = parseStartTime(a.date, a.startTime);
    const bTime = parseStartTime(b.date, b.startTime);
    return bTime.getTime() - aTime.getTime();
  });

  // Sort upcoming meetings by time (soonest first)
  upcoming.sort((a, b) => {
    const aTime = parseStartTime(a.date, a.startTime);
    const bTime = parseStartTime(b.date, b.startTime);
    return aTime.getTime() - bTime.getTime();
  });

  // The first upcoming meeting is "up next"
  const upNext = upcoming.length > 0 ? upcoming[0] : null;
  const later = upcoming.slice(1);

  return { pastToday, pastOlder, upNext, later };
}
