export type MeetingPlatform = "zoom" | "meet" | "teams" | "phone" | "in-person";
export type MeetingVisibility = "shared" | "private";

export interface MeetingAttendee {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  attended: boolean;
  /** Optional link to CRM contact for profile drawer */
  linkedContactId?: string;
}

export interface MeetingKeyTakeaway {
  id: string;
  text: string;
}

export interface Meeting {
  id: string;
  title: string;
  summary: string;
  date: Date;
  startTime: string;
  duration: number; // minutes
  platform: MeetingPlatform;
  hasRecording: boolean;
  recordingUrl?: string;
  attendees: MeetingAttendee[];
  overview: string;
  keyTakeaways: MeetingKeyTakeaway[];
  transcript?: string;
  linkedContactIds?: string[];
  // New fields for Meetings page
  visibility: MeetingVisibility;
  agenda?: string; // Pre-meeting brief content
  meetingUrl?: string; // Join link for upcoming meetings
  description?: string; // Short description for cards
  location?: string; // Physical location for in-person meetings
}
