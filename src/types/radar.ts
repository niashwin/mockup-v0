export type RadarSeverity = "critical" | "high" | "medium" | "low";
export type RadarStatus = "new" | "acknowledged" | "resolved";

export interface RadarStakeholder {
  name: string;
  role: string;
}

export interface RadarSource {
  name: string;
  type: "system" | "report" | "external" | "meeting";
  url?: string;
}

export interface RadarNextStep {
  label: string;
  action: "primary" | "secondary";
}

export interface RadarItem {
  id: string;
  title: string;
  description: string;
  severity: RadarSeverity;
  category: string; // e.g., "Security", "Compliance", "Business"
  source?: string; // Legacy simple source
  sources?: RadarSource[]; // Detailed sources
  detectedAt: Date;
  status: RadarStatus;
  // Extended fields
  impact?: string; // Business impact description
  stakeholders?: RadarStakeholder[]; // People involved
  nextSteps?: RadarNextStep[]; // Suggested actions
}
