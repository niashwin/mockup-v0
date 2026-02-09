import type {
  Action,
  MeetingAction,
  EmailAction,
  Participant,
} from "@types/action";

export interface LayoutProps {
  action: MeetingAction | EmailAction;
  onUpdateDraft: (updates: Partial<Action>) => void;
  onAddParticipant: (participant: Participant) => void;
  onRemoveParticipant: (id: string) => void;
  onCycleRecipientType: (id: string) => void;
}
