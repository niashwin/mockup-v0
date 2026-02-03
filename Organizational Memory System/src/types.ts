export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  source: string;
}

export interface CommitmentSource {
  type: 'meeting' | 'email' | 'slack' | 'document';
  title: string;
  id?: string;
  timestamp?: string;
  preview?: string;
  author?: string;
}

export interface Commitment {
  id: string;
  title: string;
  assignee: string; // 'Me' or others
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'High' | 'Medium' | 'Low';
  okr?: string;
  context: string;
  source?: CommitmentSource;
}

export interface MeetingBrief {
  id: string;
  title: string;
  time: string;
  timestamp: string;
  attendees: string[];
  summary: string;
  keyTopics: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  reportStatus?: 'published' | 'pending' | 'none';
  location: 'Zoom' | 'Google Meet' | 'Microsoft Teams' | 'In Person' | 'Phone';
  meetingLink?: string;
  locationDetails?: string; // e.g., "Conference Room B" or the URL
  isPrivate?: boolean;
  preMeetingBrief?: {
    context: string;
    goals: string[];
    materials: string[];
  };
}

export interface Report {
  id: string;
  title: string;
  dateRange: string;
  summary: string;
  status: 'ready' | 'generating';
}

export interface SwimlaneEvent {
  id: string;
  title: string;
  timestamp: string;
  type: 'meeting' | 'decision' | 'document' | 'alert';
  lane: string;
}
