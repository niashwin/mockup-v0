import type { PRDSourceContext } from "./sources";

export type ActionType = "meeting" | "email" | "prd-generation";

export type MatchStatus = "matched" | "suggested" | "manual" | "none";

export type RecipientType = "to" | "cc" | "bcc";

export interface Participant {
  id: string;
  name: string;
  email: string;
  matchStatus: MatchStatus;
  matchedContactId?: string;
  recipientType?: RecipientType;
}

interface BaseAction {
  id: string;
  reportId: string;
  title: string;
  status: "pending" | "completed" | "skipped";
}

export interface MeetingAction extends BaseAction {
  type: "meeting";
  meetingName: string;
  description: string;
  participants: Participant[];
  calendarConnected: boolean;
}

export interface EmailAction extends BaseAction {
  type: "email";
  subject: string;
  message: string;
  recipients: Participant[];
}

export interface PRDGenerationAction extends BaseAction {
  type: "prd-generation";
  prompt: string;
  sourceContext: PRDSourceContext;
}

export type Action = MeetingAction | EmailAction | PRDGenerationAction;

// Type guards for narrowing
export function isMeetingAction(action: Action): action is MeetingAction {
  return action.type === "meeting";
}

export function isEmailAction(action: Action): action is EmailAction {
  return action.type === "email";
}

export function isPRDGenerationAction(
  action: Action,
): action is PRDGenerationAction {
  return action.type === "prd-generation";
}
