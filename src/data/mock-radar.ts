import type { RadarItem } from "@types/radar";

export const mockRadarItems: RadarItem[] = [
  {
    id: "radar-1",
    title: "Elevated login failure rate detected",
    description:
      "Authentication failure rate increased 340% over the past 24 hours. Potential credential stuffing attack or service degradation. The pattern suggests coordinated attempts originating from multiple IP ranges, primarily in Eastern Europe. Our rate limiting has blocked approximately 15,000 requests, but legitimate user access may be affected.",
    impact:
      "If left unaddressed, this could result in account compromises, service degradation for legitimate users, and potential data breach. Estimated 2,300 active users may experience login difficulties during peak hours.",
    severity: "critical",
    category: "Security",
    sources: [
      { name: "Auth Service Logs", type: "system" },
      { name: "Cloudflare Security Report", type: "external" },
      { name: "SOC Team Alert", type: "report" },
    ],
    stakeholders: [
      { name: "Sarah Chen", role: "Security Lead" },
      { name: "Marcus Johnson", role: "Infrastructure" },
      { name: "Lisa Park", role: "Customer Success" },
    ],
    nextSteps: [
      { label: "Enable Enhanced Auth", action: "primary" },
      { label: "Review IP Blocklist", action: "secondary" },
      { label: "Notify Affected Users", action: "secondary" },
    ],
    detectedAt: new Date("2025-02-03T08:30:00"),
    status: "new",
  },
  {
    id: "radar-2",
    title: "GDPR data retention policy violation",
    description:
      "User data older than 3 years found in production database. 847 records require deletion per compliance policy. These records include inactive user accounts, associated transaction histories, and communication logs that exceed our stated retention period.",
    impact:
      "Non-compliance with GDPR Article 17 could result in regulatory fines up to €20M or 4% of annual revenue. Additionally, this creates reputational risk if disclosed during audits.",
    severity: "high",
    category: "Compliance",
    sources: [
      { name: "Data Audit Tool", type: "system" },
      { name: "Q4 Compliance Review", type: "report" },
    ],
    stakeholders: [
      { name: "Emma Williams", role: "Data Protection Officer" },
      { name: "David Kim", role: "Legal Counsel" },
      { name: "Alex Rivera", role: "Database Admin" },
    ],
    nextSteps: [
      { label: "Run Data Purge Script", action: "primary" },
      { label: "Update Retention Policy", action: "secondary" },
      { label: "Schedule Compliance Review", action: "secondary" },
    ],
    detectedAt: new Date("2025-02-02T14:15:00"),
    status: "acknowledged",
  },
  {
    id: "radar-3",
    title: "API rate limits approaching threshold",
    description:
      "Third-party API usage at 85% of monthly quota with 12 days remaining. May impact downstream services. The Stripe and Twilio integrations are the primary consumers, driven by the recent marketing campaign surge.",
    impact:
      "Exceeding quota would disable payment processing and SMS notifications, directly impacting revenue and customer communications. Estimated $45K/day revenue at risk.",
    severity: "medium",
    category: "Operations",
    sources: [
      { name: "API Gateway Metrics", type: "system" },
      { name: "Vendor Dashboard", type: "external" },
    ],
    stakeholders: [
      { name: "James Wilson", role: "Platform Lead" },
      { name: "Nina Patel", role: "Finance" },
    ],
    nextSteps: [
      { label: "Request Quota Increase", action: "primary" },
      { label: "Optimize API Calls", action: "secondary" },
    ],
    detectedAt: new Date("2025-02-01T10:00:00"),
    status: "acknowledged",
  },
  {
    id: "radar-4",
    title: "Competitor launched similar feature",
    description:
      "Market intelligence indicates competitor X released a comparable product feature. Their implementation includes AI-powered recommendations and a mobile-first interface. Initial market response appears positive based on social media sentiment.",
    impact:
      "Could accelerate customer churn in the SMB segment where we've seen 8% decline. Sales team reports 3 deals citing this as a consideration factor in the past week.",
    severity: "medium",
    category: "Business",
    sources: [
      { name: "Market Watch Newsletter", type: "external" },
      { name: "Sales Team Feedback", type: "meeting" },
      { name: "Social Listening Report", type: "report" },
    ],
    stakeholders: [
      { name: "Michael Torres", role: "Product Manager" },
      { name: "Rachel Green", role: "Marketing Lead" },
      { name: "Tom Anderson", role: "Sales Director" },
    ],
    nextSteps: [
      { label: "Schedule Competitive Analysis", action: "primary" },
      { label: "Brief Sales Team", action: "secondary" },
      { label: "Review Product Roadmap", action: "secondary" },
    ],
    detectedAt: new Date("2025-01-30T16:45:00"),
    status: "new",
  },
  {
    id: "radar-5",
    title: "SSL certificate expiring in 14 days",
    description:
      "Production SSL certificate for api.example.com expires on Feb 17. Auto-renewal may have failed due to DNS validation issues. This affects our main API endpoint serving 2.1M requests daily.",
    impact:
      "Certificate expiration would cause complete API outage, breaking all client integrations and mobile apps. Historical data shows similar incidents resulted in 4-6 hour recovery time.",
    severity: "high",
    category: "Security",
    sources: [
      { name: "Certificate Monitor", type: "system" },
      { name: "Let's Encrypt Logs", type: "external" },
    ],
    stakeholders: [
      { name: "Marcus Johnson", role: "Infrastructure" },
      { name: "Sarah Chen", role: "Security Lead" },
    ],
    nextSteps: [
      { label: "Manual Certificate Renewal", action: "primary" },
      { label: "Fix DNS Validation", action: "secondary" },
      { label: "Set Up Redundant Monitoring", action: "secondary" },
    ],
    detectedAt: new Date("2025-02-03T06:00:00"),
    status: "new",
  },
  {
    id: "radar-6",
    title: "Unusual expense pattern in Q4",
    description:
      "Cloud infrastructure costs 23% higher than projected. Primary drivers: compute and data transfer. Analysis reveals inefficient batch jobs running during peak hours and unoptimized media delivery contributing to overage.",
    impact:
      "At current trajectory, annual cloud spend will exceed budget by $180K. This may require reallocation from other initiatives or budget revision discussions with leadership.",
    severity: "low",
    category: "Finance",
    sources: [
      { name: "AWS Cost Explorer", type: "system" },
      { name: "FinOps Dashboard", type: "report" },
    ],
    stakeholders: [
      { name: "Nina Patel", role: "Finance" },
      { name: "James Wilson", role: "Platform Lead" },
    ],
    nextSteps: [
      { label: "Review Cost Report", action: "primary" },
      { label: "Schedule Optimization Sprint", action: "secondary" },
    ],
    detectedAt: new Date("2025-01-28T09:30:00"),
    status: "resolved",
  },
  {
    id: "radar-7",
    title: "Key vendor contract renewal due",
    description:
      "Critical SaaS vendor contract expires March 1. Negotiation window closing for favorable terms. Current contract value is $240K/year with potential 15% increase proposed by vendor. Multi-year commitment could lock in current rates.",
    impact:
      "Without timely renewal, we risk service interruption for a tool used by 85% of the organization. Price increase would add $36K to annual operating costs.",
    severity: "medium",
    category: "Operations",
    sources: [
      { name: "Contract Management System", type: "system" },
      { name: "Vendor Meeting Notes", type: "meeting" },
    ],
    stakeholders: [
      { name: "David Kim", role: "Legal Counsel" },
      { name: "Nina Patel", role: "Finance" },
      { name: "Operations Team", role: "End Users" },
    ],
    nextSteps: [
      { label: "Schedule Negotiation Call", action: "primary" },
      { label: "Prepare Counter-Proposal", action: "secondary" },
      { label: "Evaluate Alternatives", action: "secondary" },
    ],
    detectedAt: new Date("2025-01-25T11:00:00"),
    status: "acknowledged",
  },
];
