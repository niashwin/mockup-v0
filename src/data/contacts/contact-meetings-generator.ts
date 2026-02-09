import type { Meeting, MeetingPlatform } from "@types/meeting";
import type { Contact } from "@types/contact";
import { daysAgo } from "@lib/mock-date-helpers";

/**
 * Contact Meetings Generator
 *
 * Generates realistic meeting history for CRM contacts.
 * Each contact gets 15-20 meetings spread over the past 6 months,
 * with titles and summaries tailored to their company and domain.
 */

const PLATFORMS: MeetingPlatform[] = ["zoom", "meet", "teams", "in-person"];
const START_TIMES = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
];
const DURATIONS = [30, 30, 45, 45, 60, 60, 60, 90];

interface MeetingTemplate {
  titleTemplate: string;
  summaryTemplate: string;
}

const MEETING_TEMPLATES: MeetingTemplate[] = [
  {
    titleTemplate: "Quarterly Business Review with {company}",
    summaryTemplate:
      "Reviewed Q{quarter} metrics with {name}. Discussed product adoption, support tickets, and renewal timeline. Strong engagement from their team.",
  },
  {
    titleTemplate: "{company} Security Architecture Review",
    summaryTemplate:
      "Deep-dive into security posture with {name}. Covered SSO, data encryption, and compliance requirements. Follow-up needed on penetration test results.",
  },
  {
    titleTemplate: "Technical Demo: {company} Integration",
    summaryTemplate:
      "Walked {name} through our latest integration capabilities. Strong interest in API webhooks and real-time sync features. Pilot timeline discussed.",
  },
  {
    titleTemplate: "1:1 with {name}",
    summaryTemplate:
      "Regular check-in with {name}. Discussed roadmap priorities, team updates, and upcoming milestones. Relationship remains strong.",
  },
  {
    titleTemplate: "{company} Contract Negotiation",
    summaryTemplate:
      "Reviewed pricing proposal with {name} and their procurement team. They want volume discounts. Need to loop in our finance team for custom terms.",
  },
  {
    titleTemplate: "{company} Implementation Kickoff",
    summaryTemplate:
      "Kicked off implementation with {name}'s engineering team. Defined milestones, assigned POCs, and set up weekly syncs. Target go-live in 6 weeks.",
  },
  {
    titleTemplate: "Product Roadmap Preview — {company}",
    summaryTemplate:
      "Shared upcoming features with {name}. Excitement around collaboration tools and AI-powered insights. They want early beta access.",
  },
  {
    titleTemplate: "{company} Executive Briefing",
    summaryTemplate:
      "Presented to {name} and their leadership. Focused on ROI, competitive differentiation, and strategic alignment. Positive reception overall.",
  },
  {
    titleTemplate: "Support Escalation: {company}",
    summaryTemplate:
      "Addressed {name}'s concerns about recent support tickets. Committed to faster response times and dedicated support channel. Tension reduced.",
  },
  {
    titleTemplate: "{company} Vendor Evaluation Follow-up",
    summaryTemplate:
      "Follow-up from vendor eval with {name}. Provided comparison matrix, reference customers, and benchmark data. Decision expected in 2 weeks.",
  },
  {
    titleTemplate: "Architecture Workshop — {company}",
    summaryTemplate:
      "Whiteboarding session with {name}'s architects. Mapped integration points, discussed scalability requirements, and identified potential blockers.",
  },
  {
    titleTemplate: "{company} Renewal Discussion",
    summaryTemplate:
      "Discussed renewal terms with {name}. They want expanded seats and premium support. Multi-year deal on the table if we can meet their timeline.",
  },
  {
    titleTemplate: "Customer Advisory Board — {company}",
    summaryTemplate:
      "Advisory board session with {name} and other key customers. Gathered feedback on product direction, identified common pain points, and prioritized feature requests.",
  },
  {
    titleTemplate: "{company} Data Migration Planning",
    summaryTemplate:
      "Planned data migration strategy with {name}'s team. Discussed schema mapping, validation steps, and rollback procedures. Timeline is aggressive but feasible.",
  },
  {
    titleTemplate: "Compliance Review with {company}",
    summaryTemplate:
      "Reviewed compliance requirements with {name}. SOC2, GDPR, and HIPAA certifications discussed. Need to provide updated audit reports by end of month.",
  },
  {
    titleTemplate: "{company} Training Session",
    summaryTemplate:
      "Conducted training for {name}'s team on advanced features. Good engagement, several AHA moments. Follow-up docs sent. Next session in 2 weeks.",
  },
  {
    titleTemplate: "Strategic Planning: {company} Partnership",
    summaryTemplate:
      "Explored partnership opportunities with {name}. Potential co-marketing and joint customer events. Both teams see strong alignment.",
  },
  {
    titleTemplate: "{company} Performance Review",
    summaryTemplate:
      "Reviewed system performance metrics with {name}. Latency improvements noted, uptime at 99.97%. Discussed capacity planning for Q{quarter} growth.",
  },
  {
    titleTemplate: "Lunch Meeting with {name}",
    summaryTemplate:
      "Informal lunch with {name}. Discussed industry trends, their team's growth plans, and some personal updates. Good relationship-building opportunity.",
  },
  {
    titleTemplate: "{company} API Integration Deep Dive",
    summaryTemplate:
      "Technical deep-dive with {name}'s dev team on API integration. Resolved authentication questions, discussed rate limits, and reviewed webhook patterns.",
  },
  {
    titleTemplate: "Stakeholder Alignment — {company}",
    summaryTemplate:
      "Multi-stakeholder meeting with {name} and their cross-functional team. Aligned on goals, success metrics, and communication cadence for the project.",
  },
  {
    titleTemplate: "{company} Feature Request Review",
    summaryTemplate:
      "Reviewed {name}'s top feature requests against our roadmap. Three items already planned for Q{quarter}. Two custom requests need product review.",
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function getQuarter(date: Date): number {
  return Math.ceil((date.getMonth() + 1) / 3);
}

function fillTemplate(
  template: string,
  name: string,
  company: string,
  date: Date,
): string {
  return template
    .replace(/{name}/g, name)
    .replace(/{company}/g, company)
    .replace(/{quarter}/g, String(getQuarter(date)));
}

/**
 * Generate an array of Meeting objects for a given contact.
 * Produces 15-20 meetings spread over the past 6 months.
 */
export function generateContactMeetings(contact: Contact): Meeting[] {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const meetingCount = 15 + Math.floor(Math.random() * 6); // 15-20
  const meetings: Meeting[] = [];

  // Spread meetings over ~180 days, avoiding weekends
  const usedTemplateIndices = new Set<number>();

  for (let i = 0; i < meetingCount; i++) {
    // Pick a template, avoiding repeats until exhausted
    let templateIdx: number;
    if (usedTemplateIndices.size >= MEETING_TEMPLATES.length) {
      usedTemplateIndices.clear();
    }
    do {
      templateIdx = Math.floor(Math.random() * MEETING_TEMPLATES.length);
    } while (usedTemplateIndices.has(templateIdx));
    usedTemplateIndices.add(templateIdx);

    const template = MEETING_TEMPLATES[templateIdx]!;

    // Distribute dates across 180 days, roughly evenly
    const dayOffset =
      Math.floor((i / meetingCount) * 180) + Math.floor(Math.random() * 8);
    const meetingDate = daysAgo(dayOffset);

    // Skip weekends
    const day = meetingDate.getDay();
    if (day === 0) meetingDate.setDate(meetingDate.getDate() + 1);
    if (day === 6) meetingDate.setDate(meetingDate.getDate() + 2);

    const title = fillTemplate(
      template.titleTemplate,
      contact.firstName,
      contact.company,
      meetingDate,
    );
    const summary = fillTemplate(
      template.summaryTemplate,
      contact.firstName,
      contact.company,
      meetingDate,
    );

    const platform = pickRandom(PLATFORMS);
    const startTime = pickRandom(START_TIMES);
    const duration = pickRandom(DURATIONS);
    const hasRecording = Math.random() > 0.4;

    meetings.push({
      id: `crm-mtg-${contact.id}-${i}`,
      title,
      summary,
      date: meetingDate,
      startTime,
      duration,
      platform,
      hasRecording,
      visibility: "shared",
      description: summary.slice(0, 80) + "...",
      overview: summary,
      keyTakeaways: [
        {
          id: `kt-${contact.id}-${i}-1`,
          text: `Follow up with ${contact.firstName} on discussed items`,
        },
        {
          id: `kt-${contact.id}-${i}-2`,
          text: "Share meeting notes with stakeholders",
        },
      ],
      attendees: [
        {
          id: `att-you-${contact.id}-${i}`,
          name: "You",
          email: "you@company.com",
          initials: "YO",
          attended: true,
        },
        {
          id: `att-${contact.id}-${i}`,
          name: fullName,
          email: contact.email,
          avatarUrl: contact.avatarUrl,
          initials: `${contact.firstName[0]}${contact.lastName[0]}`,
          attended: true,
          linkedContactId: contact.id,
        },
      ],
      linkedContactIds: [contact.id],
    });
  }

  // Sort by date descending (most recent first)
  return meetings.sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Generate meetings for all contacts in an array.
 * Returns a flat array of all generated meetings.
 */
export function generateAllContactMeetings(contacts: Contact[]): Meeting[] {
  return contacts.flatMap(generateContactMeetings);
}
