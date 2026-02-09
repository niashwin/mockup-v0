export type SourceCategory =
  | "meetings"
  | "slack"
  | "linear"
  | "system"
  | "external"
  | "reports";

export interface SourceItem {
  id: string;
  category: SourceCategory;
  title: string;
  snippet?: string;
  timestamp: Date;
  href?: string;
}

export interface DigestSection {
  id: string;
  title: string;
  content: string;
  sources: SourceItem[];
}

export interface PRDSourceContext {
  meetings: number;
  slackThreads: number;
  documents: number;
}
