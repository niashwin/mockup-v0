import type { Contact } from "@types/contact";
import { daysAgo, weeksAgo, monthsAgo } from "./contact-helpers";

/**
 * Client Contacts (14)
 * Enterprise customers, prospects
 */
export const clientContacts: Contact[] = [
  {
    id: "cli-1",
    firstName: "Sarah",
    lastName: "Chen",
    avatarUrl: "/avatars/1636597139460.jpeg",
    company: "Accenture",
    title: "VP of Engineering",
    department: "Technology",
    email: "sarah.chen@accenture.com",
    phone: "+1 (415) 555-0123",
    linkedIn: "linkedin.com/in/sarahchen",
    twitter: "@sarahchentech",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "client",

    relationship: "champion",
    relationshipScore: 92,
    communicationStyle: "async",

    roleBadges: [],
    tags: ["client", "Sentra", "Glean"],

    insights: {
      aiSummary:
        "Sarah is hands down our strongest champion at Accenture. She drove both procurement cycles and checks in with our team weekly on the API integration. I can always count on her to push things forward internally — she's gone to bat for us with their CTO twice now.",
      strengths: [
        "Strong technical understanding",
        "Internal political capital",
        "Fast decision-making",
      ],
      risks: [
        "Busy schedule limits meeting availability",
        "High expectations for technical depth",
      ],
      talkingPoints: [
        "Sarah gave an internal keynote at Accenture's tech summit on AI-driven automation last month",
        "Her team is expanding by 30% in Q2 — she's hiring across three new roles",
        "She's been pushing hard for SOC2 compliance across all their vendor relationships",
      ],
      interests: [
        "Distributed systems",
        "Developer experience",
        "Team productivity metrics",
      ],
      bestReachTime: "Tuesdays and Thursdays, 9-11 AM PT",
      insightsUpdatedAt: daysAgo(2),
      companyNews: [
        {
          id: "news-acc-1",
          headline: "Accenture announces $3B investment in AI capabilities",
          date: daysAgo(5),
          sourceUrl: "https://newsroom.accenture.com",
          category: "press",
        },
        {
          id: "news-acc-2",
          headline: "New partnership with Google Cloud for generative AI",
          date: daysAgo(12),
          sourceUrl: "https://newsroom.accenture.com",
          category: "product",
        },
        {
          id: "news-acc-3",
          headline: "Q1 earnings beat expectations, revenue up 8%",
          date: daysAgo(18),
          category: "funding",
        },
      ],
    },

    notes: {
      customSummary:
        "- Our strongest internal champion at Accenture — drove both procurement cycles\n- Prefers async communication, very responsive on Slack\n- Technical depth — always come prepared with concrete architecture details",
      quickFacts: [
        "Stanford CS PhD",
        "Previously at Google (8 years)",
        "Runs weekly architecture reviews",
      ],
      personalDetails:
        "Marathon runner, completed Boston Marathon 2024. Daughter starts college next fall.",
      notesUpdatedAt: daysAgo(5),
    },

    interestingFacts: [
      {
        id: "fact-cli1-1",
        content:
          "Adopted a golden retriever puppy named Byte in November — always shows photos",
        source: "Meeting - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "family",
      },
      {
        id: "fact-cli1-2",
        content:
          "Daughter is heading to college next fall — Sarah's been touring campuses on weekends",
        source: "Coffee chat - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "family",
      },
      {
        id: "fact-cli1-3",
        content:
          "Got really into ceramics last summer — made everyone on her team a custom mug",
        source: "Meeting - Oct 2025",
        extractedAt: monthsAgo(4),
        category: "hobby",
      },
    ],

    recentTopics: [
      "Q1 Planning",
      "API Integration",
      "Enterprise Pricing",
      "Security Compliance",
    ],

    interactions: [
      {
        id: "int-cli1-1",
        type: "email",
        date: daysAgo(1),
        subject: "Re: Q1 Strategy Discussion",
        summary:
          "Confirmed budget approval for pilot. Wants technical deep-dive with her architects next week.",
        sentiment: "positive",
        keyTopics: ["Budget", "Technical Review", "Timeline"],
      },
    ],

    lastContacted: daysAgo(1),
    nextFollowUp: daysAgo(-5),
    firstContact: monthsAgo(4),
    createdAt: monthsAgo(4),
    updatedAt: daysAgo(1),
  },

  {
    id: "cli-2",
    firstName: "James",
    lastName: "Morrison",
    avatarUrl: "/avatars/1516155918505.jpeg",
    company: "JPMorgan Chase",
    title: "Managing Director",
    department: "Technology",
    email: "james.morrison@jpmorgan.com",
    phone: "+1 (212) 555-0456",
    linkedIn: "linkedin.com/in/jamesmorrison",
    timezone: "America/New_York",
    location: "New York, NY",
    category: "client",

    relationship: "decision_maker",
    relationshipScore: 78,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["client", "Sentra"],

    insights: {
      aiSummary:
        "James is the ultimate gatekeeper at JPMorgan — nothing moves without his sign-off. Our relationship is respectful but distant; he's not the type to grab coffee. I've learned to always go through his EA Jennifer first and show up with compliance docs ready. He respects preparation.",
      strengths: [
        "Clear budget authority ($2M+)",
        "Direct line to CTO",
        "Respected across divisions",
      ],
      risks: [
        "Long procurement cycles (8-12 weeks)",
        "Requires legal review for all contracts",
      ],
      talkingPoints: [
        "James led the rollout of JPMorgan's new AI fraud detection system — it was in the news last week",
        "He mentioned they're hiring 2,000 new engineers and his division is getting a big chunk of headcount",
        "Been working closely with their CISO on a vendor security framework overhaul",
      ],
      interests: [
        "Regulatory technology",
        "Risk management",
        "Operational efficiency",
      ],
      bestReachTime: "Early mornings, 7-8 AM ET",
      insightsUpdatedAt: daysAgo(7),
      companyNews: [
        {
          id: "news-jpm-1",
          headline: "JPMorgan launches new AI-powered fraud detection system",
          date: daysAgo(3),
          sourceUrl: "https://www.jpmorganchase.com/news",
          category: "product",
        },
        {
          id: "news-jpm-2",
          headline: "Expands technology workforce with 2,000 new hires",
          date: daysAgo(10),
          category: "leadership",
        },
        {
          id: "news-jpm-3",
          headline: "Record quarterly profit driven by trading revenues",
          date: daysAgo(21),
          sourceUrl: "https://www.jpmorganchase.com/ir",
          category: "funding",
        },
      ],
    },

    notes: {
      customSummary:
        "- Always go through his EA Jennifer to schedule anything\n- Very formal — stick to data-driven arguments, no casual small talk\n- Compliance docs must be airtight before he'll even take a meeting",
      quickFacts: [
        "Wharton MBA",
        "20+ years at JPM",
        "Board member of fintech accelerator",
      ],
      personalDetails: "Avid golfer, member at Winged Foot.",
      notesUpdatedAt: weeksAgo(2),
    },

    interestingFacts: [
      {
        id: "fact-cli2-1",
        content:
          "Avid golfer — member at Winged Foot, plays every Saturday morning rain or shine",
        source: "Lunch - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "hobby",
      },
      {
        id: "fact-cli2-2",
        content:
          "His oldest son just started at Georgetown — James flew down for move-in weekend in August",
        source: "Meeting - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "family",
      },
    ],

    recentTopics: [
      "Compliance Review",
      "Security Architecture",
      "Reference Calls",
    ],

    interactions: [
      {
        id: "int-cli2-1",
        type: "meeting",
        date: daysAgo(3),
        subject: "Security Architecture Review",
        summary:
          "Brought their CISO. Detailed walkthrough of our security posture. They want penetration test results.",
        sentiment: "neutral",
        keyTopics: ["Security", "Penetration Testing", "Compliance"],
      },
    ],

    lastContacted: daysAgo(3),
    nextFollowUp: daysAgo(-4),
    firstContact: monthsAgo(2),
    createdAt: monthsAgo(2),
    updatedAt: daysAgo(3),
  },

  {
    id: "cli-3",
    firstName: "Priya",
    lastName: "Sharma",
    avatarUrl: "/avatars/1644337039118.jpeg",
    company: "Stripe",
    title: "Staff Engineer",
    department: "Developer Platform",
    email: "priya@stripe.com",
    phone: "+1 (206) 555-2203",
    linkedIn: "linkedin.com/in/priyasharma",
    twitter: "@priyacodes",
    timezone: "America/Los_Angeles",
    location: "Seattle, WA (Remote)",
    category: "client",

    relationship: "influencer",
    relationshipScore: 85,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["contractor", "Sentra", "A16Z"],

    insights: {
      aiSummary:
        "Priya is one of my favorite people to talk shop with. She's brutally honest about our product — if something sucks she'll tell me — but when she likes something, she tweets about it to her 40K followers and it goes viral. We chat on Twitter DMs pretty regularly. I don't treat this as a sales relationship; it's more like a product partnership.",
      strengths: [
        "40K+ Twitter following",
        "Conference speaker circuit",
        "Genuine product feedback",
      ],
      risks: [
        "Won't promote anything she doesn't love",
        "Skeptical of enterprise software",
      ],
      talkingPoints: [
        "Priya gave a lightning talk at KubeCon on developer experience anti-patterns — it got a lot of buzz on Twitter",
        "She's been contributing to Stripe's new embedded finance platform that just launched",
        "Published a deep-dive article in The Pragmatic Engineer on API design principles last month",
      ],
      interests: ["Developer experience", "Open source", "API design", "Rust"],
      bestReachTime: "Async - Twitter DMs or Slack",
      insightsUpdatedAt: daysAgo(3),
      companyNews: [
        {
          id: "news-stripe-1",
          headline: "Stripe launches new embedded finance platform for SaaS",
          date: daysAgo(2),
          sourceUrl: "https://stripe.com/newsroom",
          category: "product",
        },
        {
          id: "news-stripe-2",
          headline: "Valued at $50B in latest secondary market transactions",
          date: daysAgo(15),
          category: "funding",
        },
        {
          id: "news-stripe-3",
          headline: "Opens new engineering hub in Toronto",
          date: daysAgo(25),
          sourceUrl: "https://stripe.com/blog",
          category: "leadership",
        },
      ],
    },

    notes: {
      customSummary:
        "- Hates corporate speak — keep it real and technical with her\n- Her product feedback is gold, always act on it quickly\n- If she tweets about us positively, it's worth more than any ad spend",
      quickFacts: [
        "Maintains popular OSS project (15K stars)",
        "Writes for The Pragmatic Engineer",
      ],
      personalDetails: "Rescue dog named Kubernetes (Kube for short).",
      notesUpdatedAt: daysAgo(10),
    },

    interestingFacts: [
      {
        id: "fact-cli3-1",
        content:
          "Has a rescue dog named Kubernetes — Kube for short — who shows up on Zoom calls constantly",
        source: "Slack - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "family",
      },
      {
        id: "fact-cli3-2",
        content:
          "Got super into bouldering over the holidays — goes to the climbing gym three times a week now",
        source: "Twitter DM - Jan 2026",
        extractedAt: monthsAgo(1),
        category: "hobby",
      },
      {
        id: "fact-cli3-3",
        content: "Planning a solo backpacking trip through Patagonia in April",
        source: "Twitter - Jan 2026",
        extractedAt: weeksAgo(3),
        category: "travel",
      },
    ],

    recentTopics: ["CLI Improvements", "API Design", "Developer Experience"],

    interactions: [
      {
        id: "int-cli3-1",
        type: "slack",
        date: daysAgo(2),
        subject: "CLI Feedback Thread",
        summary:
          "Detailed feedback on new CLI commands. Loved the autocomplete feature.",
        sentiment: "positive",
        keyTopics: ["CLI", "UX Feedback"],
      },
    ],

    lastContacted: daysAgo(2),
    nextFollowUp: daysAgo(-7),
    firstContact: monthsAgo(3),
    createdAt: monthsAgo(3),
    updatedAt: daysAgo(2),
  },

  {
    id: "cli-4",
    firstName: "David",
    lastName: "Park",
    avatarUrl: "/avatars/1658519522892.jpeg",
    company: "Salesforce",
    title: "Senior Director",
    department: "Platform Engineering",
    email: "dpark@salesforce.com",
    phone: "+1 (415) 555-0789",
    linkedIn: "linkedin.com/in/davidpark",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "client",

    relationship: "key_stakeholder",
    relationshipScore: 45,
    communicationStyle: "sync",

    roleBadges: [],
    tags: ["client", "Sequoia", "Glean"],

    insights: {
      aiSummary:
        "David used to be easy to work with, but the relationship has gone cold since their reorg. Last call was pretty tense — he's frustrated with our support response times and flat out told me he's looking at competitors. I need to get our exec team involved ASAP or we're going to lose this renewal. Two-year customer and it would sting to lose him.",
      strengths: ["Existing customer (2 years)", "Team knows our product"],
      risks: [
        "Actively evaluating competitors",
        "Frustrated with support tickets",
      ],
      talkingPoints: [
        "His team has been pulled into the Agentforce AI platform launch — he's stretched thin right now",
        "David's division went through a major reorg in Q4 and he now has a bigger team but more pressure",
        "Mentioned on our last call that he's been doing vendor evaluations across the board, not just us",
      ],
      interests: ["Platform reliability", "Cost optimization"],
      bestReachTime: "Schedule through EA",
      insightsUpdatedAt: daysAgo(1),
      companyNews: [
        {
          id: "news-sfdc-1",
          headline: "Salesforce launches Agentforce AI platform",
          date: daysAgo(7),
          sourceUrl: "https://salesforce.com/news",
          category: "product",
        },
        {
          id: "news-sfdc-2",
          headline: "Announces acquisition of data analytics startup",
          date: daysAgo(14),
          category: "funding",
        },
        {
          id: "news-sfdc-3",
          headline: "CEO Marc Benioff speaks at World Economic Forum",
          date: daysAgo(20),
          category: "leadership",
        },
      ],
    },

    notes: {
      customSummary:
        "- Renewal at risk — he explicitly mentioned evaluating competitors on our last call\n- Frustrated with support ticket response times, need to fix this immediately\n- Just had twins, so be mindful of his time and keep meetings short",
      quickFacts: [
        "Reports to SVP",
        "Team of 50+ engineers",
        "Contract renews Q2",
      ],
      personalDetails: "New father (twins!), probably sleep-deprived.",
      notesUpdatedAt: daysAgo(1),
    },

    interestingFacts: [
      {
        id: "fact-cli4-1",
        content:
          "Had twins in December — he's running on zero sleep and mentioned it on every call since",
        source: "Call - Jan 2026",
        extractedAt: weeksAgo(1),
        category: "family",
      },
      {
        id: "fact-cli4-2",
        content:
          "Big into woodworking — built a crib for the twins himself over paternity leave",
        source: "Meeting - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "hobby",
      },
    ],

    recentTopics: [
      "Support Issues",
      "Renewal Discussion",
      "Competitor Evaluation",
    ],

    interactions: [
      {
        id: "int-cli4-1",
        type: "call",
        date: daysAgo(4),
        subject: "Account Check-in",
        summary:
          "Tense call. He's frustrated with response times. Mentioned evaluating a competitor.",
        sentiment: "negative",
        keyTopics: ["Support Issues", "Competitor Threat"],
      },
    ],

    lastContacted: daysAgo(4),
    nextFollowUp: daysAgo(0),
    firstContact: monthsAgo(24),
    createdAt: monthsAgo(24),
    updatedAt: daysAgo(1),
  },

  {
    id: "cli-5",
    firstName: "Elena",
    lastName: "Rodriguez",
    avatarUrl: "/avatars/1714012339927.jpeg",
    company: "Shopify",
    title: "Director of Engineering",
    department: "Merchant Platform",
    email: "elena.rodriguez@shopify.com",
    phone: "+1 (416) 555-2305",
    linkedIn: "linkedin.com/in/elenarodriguez",
    timezone: "America/Toronto",
    location: "Toronto, ON",
    category: "client",

    relationship: "contact",
    relationshipScore: 65,
    communicationStyle: "async",

    roleBadges: [],
    tags: ["client", "A16Z", "Sequoia"],

    insights: {
      aiSummary:
        "Elena came in through our webinar last week and I'm really excited about this one. She knows exactly what she wants, has budget locked in for Q1, and is moving fast. We had one discovery call and she was already asking about pilot timelines. Still early — I don't know her well personally yet — but the energy is great.",
      strengths: [
        "Clear budget and timeline",
        "Technical background",
        "Motivated",
      ],
      risks: ["Also evaluating 2 other vendors", "Tight Q1 deadline"],
      talkingPoints: [
        "Elena just stood up a brand new internal tools team at Shopify — hiring three engineers right now",
        "Shopify had a massive holiday season with GMV up 24% — her team is riding that momentum",
        "She mentioned she's evaluating two other vendors alongside us, so we need to move quickly",
      ],
      interests: ["Internal tooling", "Developer productivity"],
      bestReachTime: "Flexible - responds quickly to email",
      insightsUpdatedAt: daysAgo(0),
      companyNews: [
        {
          id: "news-shop-1",
          headline: "Shopify reports strong holiday season, GMV up 24%",
          date: daysAgo(8),
          sourceUrl: "https://news.shopify.com",
          category: "funding",
        },
        {
          id: "news-shop-2",
          headline: "Launches Shop Pay installments in Europe",
          date: daysAgo(16),
          category: "product",
        },
      ],
    },

    notes: {
      customSummary:
        "- Brand new inbound lead — move fast, she's evaluating two other vendors\n- Knows exactly what she wants and has Q1 budget locked in\n- Very responsive to email, prefers async over scheduled calls",
      quickFacts: ["Ex-Wealthsimple, Ex-Uber", "Built 3 internal tools teams"],
      personalDetails: "Loves salsa dancing. Training for Ironman.",
      notesUpdatedAt: daysAgo(1),
    },

    interestingFacts: [
      {
        id: "fact-cli5-1",
        content:
          "Passionate salsa dancer — goes to a studio in Toronto three nights a week",
        source: "Meeting - Jan 2026",
        extractedAt: weeksAgo(1),
        category: "hobby",
      },
      {
        id: "fact-cli5-2",
        content:
          "Recently moved to a new condo in the Distillery District with her partner and their cat Churro",
        source: "Meeting - Jan 2026",
        extractedAt: weeksAgo(1),
        category: "family",
      },
    ],

    recentTopics: ["Internal Tools Strategy", "Pilot Program", "Integration"],

    interactions: [
      {
        id: "int-cli5-1",
        type: "meeting",
        date: daysAgo(1),
        subject: "Discovery Call",
        summary:
          "Excellent meeting. Clear requirements and budget. Wants to move to pilot within 2 weeks.",
        sentiment: "positive",
        keyTopics: ["Discovery", "Requirements", "Pilot Timeline"],
      },
    ],

    lastContacted: daysAgo(1),
    nextFollowUp: daysAgo(-2),
    firstContact: daysAgo(3),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },

  {
    id: "cli-6",
    firstName: "Aisha",
    lastName: "Patel",
    avatarUrl: "/avatars/1739515018850.jpeg",
    company: "Microsoft",
    title: "Principal Product Manager",
    department: "Azure DevOps",
    email: "aipatel@microsoft.com",
    phone: "+1 (425) 555-2406",
    linkedIn: "linkedin.com/in/aishapatel",
    twitter: "@aikidev",
    timezone: "America/Los_Angeles",
    location: "Redmond, WA",
    category: "client",

    relationship: "champion",
    relationshipScore: 95,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["team", "Sentra", "Glean"],

    insights: {
      aiSummary:
        "Aisha is honestly my favorite customer. She's given us three referrals that all closed, done two conference talks featuring our product, and is on our product advisory board. We talk at least weekly, usually over Twitter DMs. I genuinely consider her a product partner at this point — she's shaped several of our features. Cannot afford to take this relationship for granted.",
      strengths: [
        "Vocal advocate (2 conference talks)",
        "Product advisory board member",
        "Enterprise reference customer",
      ],
      risks: ["Don't take her for granted", "High expectations for support"],
      talkingPoints: [
        "Aisha is preparing a co-presentation with us at Microsoft Build on developer tooling workflows",
        "She just got promoted to lead a new cross-team initiative on AI-powered dev tools within Azure",
        "Been blogging on the MS DevBlog about developer experience metrics — her latest post got picked up by Hacker News",
      ],
      interests: ["Product development", "Developer tools", "AI/ML"],
      bestReachTime: "Very responsive - DM on Twitter or Teams",
      insightsUpdatedAt: daysAgo(5),
      companyNews: [
        {
          id: "news-msft-1",
          headline:
            "Microsoft reports record quarterly revenue of $65B, cloud growth accelerates",
          date: daysAgo(4),
          sourceUrl: "https://news.microsoft.com",
          category: "funding",
        },
        {
          id: "news-msft-2",
          headline:
            "Azure DevOps integrates GitHub Copilot for enterprise development workflows",
          date: daysAgo(11),
          sourceUrl: "https://devblogs.microsoft.com",
          category: "product",
        },
        {
          id: "news-msft-3",
          headline:
            "Microsoft Build 2026 announces expanded AI developer tools and platform updates",
          date: daysAgo(20),
          category: "press",
        },
      ],
    },

    notes: {
      customSummary:
        "- Our single best customer relationship — treat her like a co-founder, not a client\n- Always give her early access to betas and new features first\n- Three referrals from her have closed — keep investing in this relationship",
      quickFacts: [
        "10 years at Microsoft",
        "Former startup founder (acquired)",
        "Writes for MS DevBlog",
      ],
      personalDetails:
        "Two cats named Git and Hub. Competitive Valorant player.",
      notesUpdatedAt: weeksAgo(2),
    },

    interestingFacts: [
      {
        id: "fact-cli6-1",
        content:
          "Has two cats named Git and Hub — they have their own Instagram account",
        source: "Meeting - Sep 2025",
        extractedAt: monthsAgo(5),
        category: "family",
      },
      {
        id: "fact-cli6-2",
        content:
          "Competitive Valorant player — hit Immortal rank and plays in a weekend league with coworkers",
        source: "Slack - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "hobby",
      },
      {
        id: "fact-cli6-3",
        content:
          "Took her parents on a trip to Kerala over the holidays — first time they'd been back in 15 years",
        source: "Twitter DM - Jan 2026",
        extractedAt: weeksAgo(3),
        category: "travel",
      },
    ],

    recentTopics: ["Q2 Roadmap Preview", "Build Conference", "Team Expansion"],

    interactions: [
      {
        id: "int-cli6-1",
        type: "meeting",
        date: daysAgo(6),
        subject: "Q2 Roadmap Preview",
        summary:
          "Shared early roadmap. She's thrilled about collaboration features. Wants to be first to test.",
        sentiment: "positive",
        keyTopics: ["Roadmap", "Collaboration Features", "Beta Access"],
      },
    ],

    lastContacted: daysAgo(6),
    nextFollowUp: daysAgo(-7),
    firstContact: monthsAgo(18),
    createdAt: monthsAgo(18),
    updatedAt: daysAgo(6),
  },

  {
    id: "cli-7",
    firstName: "Tom",
    lastName: "Anderson",
    avatarUrl: "/avatars/1564124329948.jpeg",
    company: "Netflix",
    title: "Engineering Manager",
    department: "Studio Technology",
    email: "tanderson@netflix.com",
    phone: "+1 (310) 555-2507",
    linkedIn: "linkedin.com/in/tomanderson",
    timezone: "America/Los_Angeles",
    location: "Los Angeles, CA",
    category: "client",

    relationship: "contact",
    relationshipScore: 50,
    communicationStyle: "async",

    roleBadges: [],
    tags: ["client", "Glean"],

    insights: {
      aiSummary:
        "Tom went dark on us about six months ago when Netflix restructured his whole division. We had good momentum before that — he was genuinely interested. Now that the dust has settled and his team has doubled in size, it's time to reach back out. I don't know him super well personally, but the vibe was always friendly. Worth a LinkedIn message to test the waters.",
      strengths: ["Was very interested", "Team has grown (more budget)"],
      risks: ["May have moved on", "Need fresh pitch"],
      talkingPoints: [
        "Tom's new Studio Technology team has grown to 60+ engineers after the reorg settled",
        "Netflix expanded their LA office — his team moved into the new building in December",
      ],
      interests: ["Content pipeline tools", "Global team collaboration"],
      bestReachTime: "Try LinkedIn message",
      insightsUpdatedAt: daysAgo(0),
      companyNews: [
        {
          id: "news-nflx-1",
          headline:
            "Netflix surpasses 300M global subscribers, stock hits all-time high",
          date: daysAgo(6),
          sourceUrl: "https://about.netflix.com/news",
          category: "funding",
        },
        {
          id: "news-nflx-2",
          headline:
            "Netflix expands LA studio campus with new production technology center",
          date: daysAgo(13),
          category: "general",
        },
      ],
    },

    notes: {
      customSummary:
        "- Deal went dark 6 months ago during Netflix reorg — time to re-engage\n- His team doubled in size, so the opportunity might be bigger now\n- Try LinkedIn message first, keep it casual and reference our last conversation",
      quickFacts: ["Ex-Amazon, Ex-Adobe", "Manages 30+ engineers"],
      personalDetails: "Surfer, works from home near the beach.",
      notesUpdatedAt: daysAgo(0),
    },

    interestingFacts: [
      {
        id: "fact-cli7-1",
        content:
          "Avid surfer — lives near the beach in LA and hits the waves before work most mornings",
        source: "Call - Jul 2025",
        extractedAt: monthsAgo(7),
        category: "hobby",
      },
      {
        id: "fact-cli7-2",
        content:
          "Has a 6-year-old daughter who's obsessed with marine biology — they go tidepooling every weekend",
        source: "Call - Aug 2025",
        extractedAt: monthsAgo(6),
        category: "family",
      },
    ],

    recentTopics: [],

    interactions: [
      {
        id: "int-cli7-1",
        type: "email",
        date: monthsAgo(6),
        subject: "Re: Putting on Hold",
        summary:
          "Let us know the org was restructuring. Asked to reconnect in 6 months.",
        sentiment: "neutral",
        keyTopics: ["Deal Pause", "Restructuring"],
      },
    ],

    lastContacted: monthsAgo(6),
    nextFollowUp: daysAgo(-1),
    firstContact: monthsAgo(8),
    createdAt: monthsAgo(8),
    updatedAt: daysAgo(0),
  },

  {
    id: "cli-8",
    firstName: "Michelle",
    lastName: "Liu",
    avatarUrl: "/avatars/1517664582201.jpeg",
    company: "Airbnb",
    title: "VP of Engineering",
    department: "Platform",
    email: "mliu@airbnb.com",
    phone: "+1 (415) 555-2608",
    linkedIn: "linkedin.com/in/michelleliu",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "client",

    relationship: "decision_maker",
    relationshipScore: 70,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["client", "A16Z", "Sentra"],

    insights: {
      aiSummary:
        "Michelle is a tough but fair buyer. She won't move without a rock-solid business case and at least two reference calls. We met a month ago and I can tell she's interested, but she's not going to rush anything. Everything goes through her chief of staff. I respect her process — we just need to give her exactly what she asks for and not waste her time.",
      strengths: ["Clear budget", "Direct decision authority"],
      risks: ["Slow procurement", "Needs multiple stakeholder alignment"],
      talkingPoints: [
        "Michelle was recently featured in an Airbnb internal spotlight on platform reliability initiatives",
        "She's leading a cross-functional effort to consolidate developer tooling across Airbnb's engineering org",
        "Mentioned she's presenting their platform strategy at an internal all-hands next month",
      ],
      interests: ["Platform reliability", "Developer productivity"],
      bestReachTime: "Schedule through her chief of staff",
      insightsUpdatedAt: daysAgo(5),
      companyNews: [
        {
          id: "news-abnb-1",
          headline:
            "Airbnb launches new platform reliability initiative across engineering org",
          date: daysAgo(7),
          sourceUrl: "https://news.airbnb.com",
          category: "product",
        },
        {
          id: "news-abnb-2",
          headline:
            "Airbnb reports Q4 earnings beat with record bookings in international markets",
          date: daysAgo(15),
          category: "funding",
        },
        {
          id: "news-abnb-3",
          headline:
            "Brian Chesky announces major product redesign focused on AI-powered trip planning",
          date: daysAgo(23),
          category: "leadership",
        },
      ],
    },

    notes: {
      customSummary:
        "- Everything goes through her chief of staff — never try to schedule directly\n- Needs a bulletproof business case with ROI numbers and at least two reference calls\n- Don't waste her time with fluff, she values concise and data-driven communication",
      quickFacts: ["Ex-Google", "Stanford MBA", "Board advisor to 2 startups"],
      personalDetails: "Wine enthusiast. Napa regular.",
      notesUpdatedAt: daysAgo(5),
    },

    interestingFacts: [
      {
        id: "fact-cli8-1",
        content:
          "Serious wine enthusiast — visits Napa almost every month and is building a collection at home",
        source: "Meeting - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "hobby",
      },
      {
        id: "fact-cli8-2",
        content:
          "Her son just started little league baseball — she coaches on Saturday mornings",
        source: "Meeting - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "family",
      },
    ],

    recentTopics: ["Business Case", "Implementation", "References"],

    interactions: [
      {
        id: "int-cli8-1",
        type: "meeting",
        date: daysAgo(5),
        subject: "Executive Briefing",
        summary:
          "Walked through business case. She's interested but needs more references.",
        sentiment: "positive",
        keyTopics: ["Business Case", "References"],
      },
    ],

    lastContacted: daysAgo(5),
    nextFollowUp: daysAgo(-3),
    firstContact: monthsAgo(1),
    createdAt: monthsAgo(1),
    updatedAt: daysAgo(5),
  },

  {
    id: "cli-9",
    firstName: "Kevin",
    lastName: "O'Brien",
    avatarUrl: "/avatars/1578757794439.jpeg",
    company: "Deloitte",
    title: "Partner",
    department: "Technology Consulting",
    email: "kobrien@deloitte.com",
    phone: "+1 (312) 555-0234",
    linkedIn: "linkedin.com/in/kevinobrien",
    timezone: "America/Chicago",
    location: "Chicago, IL",
    category: "client",

    relationship: "blocker",
    relationshipScore: 35,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["client", "Sequoia"],

    insights: {
      aiSummary:
        "Kevin is the one person in this deal I haven't figured out yet. He has a pre-existing relationship with a competitor and I think he's steering the evaluation their way. Every meeting feels orchestrated — he keeps bringing up competitor features. My angle is to position this as a services revenue opportunity for his practice, because at the end of the day he cares about billable hours, not which vendor wins.",
      strengths: [
        "Senior partner with influence",
        "Could become champion if aligned",
      ],
      risks: ["Competitor relationship", "Controls evaluation process"],
      talkingPoints: [
        "Kevin's practice just won a major implementation contract with a Fortune 100 — he's riding high on it",
        "He was on a panel at a Deloitte internal conference about AI vendor selection frameworks",
        "His team is expanding the Chicago office with 15 new consultants focused on tech advisory",
      ],
      interests: ["Consulting revenue", "Client relationships"],
      bestReachTime: "Travels Mon-Thu, best on Fridays",
      insightsUpdatedAt: weeksAgo(1),
      companyNews: [
        {
          id: "news-deloitte-1",
          headline:
            "Deloitte announces $2B investment in AI and machine learning capabilities",
          date: daysAgo(5),
          sourceUrl: "https://www2.deloitte.com/press",
          category: "press",
        },
        {
          id: "news-deloitte-2",
          headline:
            "Deloitte Technology Consulting practice wins major Fortune 100 implementation deal",
          date: daysAgo(12),
          category: "general",
        },
        {
          id: "news-deloitte-3",
          headline:
            "New global managing partner appointed to lead technology consulting division",
          date: daysAgo(21),
          category: "leadership",
        },
      ],
    },

    notes: {
      customSummary:
        "- Potential blocker — has a pre-existing relationship with our competitor\n- Strategy: frame our product as a services revenue opportunity for his practice\n- Only available Fridays (travels Mon-Thu), keep communications formal and concise",
      quickFacts: ["25+ years at Deloitte", "On competitor's advisory board"],
      personalDetails: "Notre Dame football fan. Lake house in Michigan.",
      notesUpdatedAt: weeksAgo(1),
    },

    interestingFacts: [
      {
        id: "fact-cli9-1",
        content:
          "Diehard Notre Dame football fan — had season tickets for 20 years straight and tailgates every home game",
        source: "Meeting - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "hobby",
      },
      {
        id: "fact-cli9-2",
        content:
          "Spends every August at his family's lake house in northern Michigan — completely off the grid for two weeks",
        source: "Meeting - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "travel",
      },
    ],

    recentTopics: ["Competitor Comparison", "Implementation Concerns"],

    interactions: [
      {
        id: "int-cli9-1",
        type: "meeting",
        date: weeksAgo(1),
        subject: "Vendor Evaluation Committee",
        summary:
          "Tough room. He kept pushing back on our architecture. Felt orchestrated.",
        sentiment: "negative",
        keyTopics: ["Architecture", "Vendor Evaluation"],
      },
    ],

    lastContacted: weeksAgo(1),
    nextFollowUp: daysAgo(-3),
    firstContact: monthsAgo(2),
    createdAt: monthsAgo(2),
    updatedAt: weeksAgo(1),
  },

  {
    id: "cli-10",
    firstName: "Jessica",
    lastName: "Martinez",
    avatarUrl: "/avatars/1676239585072.jpeg",
    company: "Uber",
    title: "Director of Engineering",
    department: "Maps Platform",
    email: "jmartinez@uber.com",
    phone: "+1 (415) 555-2710",
    linkedIn: "linkedin.com/in/jessicamartinez",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "client",

    relationship: "influencer",
    relationshipScore: 72,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["contractor", "Sentra", "Sequoia"],

    insights: {
      aiSummary:
        "Jessica is the technical gatekeeper at Uber — if she gives the thumbs up, the deal moves forward. She holds us to a really high bar on performance and scale, which honestly has been good for us. We had a solid deep-dive last week and she seemed impressed, but she wants to see hard benchmarks before she'll recommend us internally. I like working with her — she's direct and doesn't play politics.",
      strengths: ["Respected technical voice", "Can champion internally"],
      risks: ["Very technical bar", "Needs proof points"],
      talkingPoints: [
        "Jessica's team just shipped a major overhaul of Uber's maps caching layer — she presented it internally last week",
        "She's been working on a new performance testing framework for their platform team",
        "Mentioned she's speaking at a distributed systems meetup in SF next month",
      ],
      interests: ["Scale", "Performance", "Developer experience"],
      bestReachTime: "Slack or email preferred",
      insightsUpdatedAt: daysAgo(4),
      companyNews: [
        {
          id: "news-uber-1",
          headline:
            "Uber Maps Platform ships major caching layer overhaul, reducing latency by 40%",
          date: daysAgo(3),
          sourceUrl: "https://uber.com/blog",
          category: "product",
        },
        {
          id: "news-uber-2",
          headline:
            "Uber posts record Q4 profitability as ride-hailing demand surges",
          date: daysAgo(14),
          category: "funding",
        },
        {
          id: "news-uber-3",
          headline:
            "Uber announces autonomous vehicle partnership expansion with Waymo",
          date: daysAgo(22),
          category: "press",
        },
      ],
    },

    notes: {
      customSummary:
        "- Technical gatekeeper — if she signs off, the deal moves forward\n- Wants to see hard performance benchmarks before recommending us\n- Very direct and no-nonsense, come prepared with technical depth",
      quickFacts: ["Ex-Google", "Distributed systems expert"],
      personalDetails: "Rock climbing enthusiast.",
      notesUpdatedAt: daysAgo(4),
    },

    interestingFacts: [
      {
        id: "fact-cli10-1",
        content:
          "Serious rock climber — goes to Yosemite every other weekend and just started lead climbing",
        source: "Meeting - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "hobby",
      },
      {
        id: "fact-cli10-2",
        content:
          "Just adopted a rescue greyhound named Latency — thinks the name is hilarious",
        source: "Slack - Jan 2026",
        extractedAt: weeksAgo(1),
        category: "family",
      },
    ],

    recentTopics: ["Technical Deep Dive", "Performance", "Architecture"],

    interactions: [
      {
        id: "int-cli10-1",
        type: "meeting",
        date: daysAgo(4),
        subject: "Technical Deep Dive",
        summary: "Good technical discussion. She wants to see our benchmarks.",
        sentiment: "positive",
        keyTopics: ["Architecture", "Performance"],
      },
    ],

    lastContacted: daysAgo(4),
    nextFollowUp: daysAgo(-5),
    firstContact: monthsAgo(1),
    createdAt: monthsAgo(1),
    updatedAt: daysAgo(4),
  },

  {
    id: "cli-11",
    firstName: "Ryan",
    lastName: "Wilson",
    avatarUrl: "/avatars/1754977605251.jpeg",
    company: "Datadog",
    title: "VP of Product",
    department: "Product",
    email: "rwilson@datadoghq.com",
    phone: "+1 (212) 555-2811",
    linkedIn: "linkedin.com/in/ryanwilson",
    timezone: "America/New_York",
    location: "New York, NY",
    category: "client",

    relationship: "champion",
    relationshipScore: 82,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["team", "A16Z", "Glean"],

    insights: {
      aiSummary:
        "Ryan is one of my most energizing calls. He genuinely sees the synergy between our products and has been driving the integration partnership from his side. We sync every couple weeks and the conversations always run long because we both get excited about the possibilities. He has real product vision and the technical chops to back it up. This could be a game-changing partnership if we execute well.",
      strengths: ["Product vision alignment", "Technical team support"],
      risks: ["Partnership timelines can slip"],
      talkingPoints: [
        "Ryan just got buy-in from Datadog's CTO to pursue the integration partnership officially",
        "He presented the joint solution concept at Datadog's internal product summit and it got great reception",
        "His team is scoping out a joint go-to-market plan — wants to co-announce at DASH conference",
      ],
      interests: ["Observability", "Developer experience", "Integrations"],
      bestReachTime: "Very responsive to Slack",
      insightsUpdatedAt: daysAgo(3),
      companyNews: [
        {
          id: "news-ddog-1",
          headline:
            "Datadog unveils new AI-powered observability suite at DASH conference",
          date: daysAgo(5),
          sourceUrl: "https://datadoghq.com/blog",
          category: "product",
        },
        {
          id: "news-ddog-2",
          headline:
            "Datadog surpasses $2.5B annual revenue run rate, beats analyst estimates",
          date: daysAgo(16),
          category: "funding",
        },
      ],
    },

    notes: {
      customSummary:
        "- Driving the integration partnership from Datadog's side — has CTO buy-in\n- Very responsive on Slack, loves to riff on product ideas\n- First kid coming in March — congrats him and be mindful of his bandwidth around then",
      quickFacts: ["Built Datadog's APM product", "Ex-New Relic"],
      personalDetails: "Home brewer. Fantasy football obsessed.",
      notesUpdatedAt: daysAgo(3),
    },

    interestingFacts: [
      {
        id: "fact-cli11-1",
        content:
          "Avid home brewer — has a full setup in his garage and just started experimenting with sours",
        source: "Meeting - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "hobby",
      },
      {
        id: "fact-cli11-2",
        content:
          "Runs a fantasy football league with other tech execs — takes trash talk extremely seriously",
        source: "Slack - Jan 2026",
        extractedAt: weeksAgo(3),
        category: "hobby",
      },
      {
        id: "fact-cli11-3",
        content:
          "Wife is expecting their first kid in March — he's been reading parenting books nonstop",
        source: "Meeting - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "family",
      },
    ],

    recentTopics: ["Integration", "Partnership", "Joint Roadmap"],

    interactions: [
      {
        id: "int-cli11-1",
        type: "meeting",
        date: daysAgo(3),
        subject: "Integration Planning",
        summary: "Mapped out integration architecture. Both teams excited.",
        sentiment: "positive",
        keyTopics: ["Integration", "Architecture"],
      },
    ],

    lastContacted: daysAgo(3),
    nextFollowUp: daysAgo(-7),
    firstContact: monthsAgo(2),
    createdAt: monthsAgo(2),
    updatedAt: daysAgo(3),
  },

  {
    id: "cli-12",
    firstName: "Amy",
    lastName: "Nguyen",
    avatarUrl: "/avatars/1762280748340.jpeg",
    company: "Twilio",
    title: "Engineering Manager",
    department: "Developer Platform",
    email: "anguyen@twilio.com",
    phone: "+1 (415) 555-2912",
    linkedIn: "linkedin.com/in/amynguyen",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "client",

    relationship: "contact",
    relationshipScore: 58,
    communicationStyle: "async",

    roleBadges: [],
    tags: ["client", "Sentra", "A16Z"],

    insights: {
      aiSummary:
        "Amy is bought in on our product but she's stuck in the internal consensus-building phase. She's an engineering manager without direct budget authority, so she needs to convince her peers and her VP. I've been arming her with ROI materials and case studies to make her internal pitch easier. She's responsive and motivated — I just need to be patient and give her what she needs to sell it internally.",
      strengths: ["Clear use case", "Budget available"],
      risks: ["Needs to convince her peers"],
      talkingPoints: [
        "Amy is presenting a developer productivity proposal to her VP next week — using our ROI calculator",
        "She mentioned Twilio is consolidating their internal tooling stack and there's pressure to reduce vendor count",
        "Her team recently shipped a major API overhaul and she's been heads-down on reliability improvements",
      ],
      interests: ["Developer productivity", "API design"],
      bestReachTime: "Email works best",
      insightsUpdatedAt: daysAgo(6),
      companyNews: [
        {
          id: "news-twlo-1",
          headline:
            "Twilio consolidates internal tooling stack as part of cost optimization push",
          date: daysAgo(4),
          sourceUrl: "https://twilio.com/blog",
          category: "product",
        },
        {
          id: "news-twlo-2",
          headline:
            "Twilio ships major API overhaul for its developer platform",
          date: daysAgo(12),
          category: "product",
        },
        {
          id: "news-twlo-3",
          headline:
            "Twilio CEO outlines path to profitability with focus on core communications platform",
          date: daysAgo(24),
          category: "leadership",
        },
      ],
    },

    notes: {
      customSummary:
        "- Bought in personally but needs to build internal consensus with peers and VP\n- Arm her with ROI materials, case studies, and one-pagers she can forward\n- New mom with a tight schedule — keep meetings under 30 minutes",
      quickFacts: ["5 years at Twilio", "Ex-startup engineer"],
      personalDetails: "New mom. Flexible schedule.",
      notesUpdatedAt: daysAgo(6),
    },

    interestingFacts: [
      {
        id: "fact-cli12-1",
        content:
          "Has a one-year-old daughter — adjusting to the new-parent schedule and keeps meetings tight",
        source: "Email - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "family",
      },
      {
        id: "fact-cli12-2",
        content:
          "Really into pottery — takes a weekend class in the Mission and posts her work on Instagram",
        source: "Email - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "hobby",
      },
    ],

    recentTopics: ["ROI", "Internal Buy-in", "Use Cases"],

    interactions: [
      {
        id: "int-cli12-1",
        type: "email",
        date: daysAgo(6),
        subject: "ROI Materials",
        summary:
          "Sent ROI calculator and case studies. She's presenting internally.",
        sentiment: "positive",
        keyTopics: ["ROI", "Materials"],
      },
    ],

    lastContacted: daysAgo(6),
    nextFollowUp: daysAgo(-4),
    firstContact: monthsAgo(1),
    createdAt: monthsAgo(1),
    updatedAt: daysAgo(6),
  },

  {
    id: "cli-13",
    firstName: "Chris",
    lastName: "Taylor",
    avatarUrl: "/avatars/1718938966112.jpeg",
    company: "Figma",
    title: "Head of Infrastructure",
    department: "Engineering",
    email: "ctaylor@figma.com",
    phone: "+1 (415) 555-3013",
    linkedIn: "linkedin.com/in/christaylor",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "client",

    relationship: "decision_maker",
    relationshipScore: 75,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["contractor", "Glean", "Sequoia"],

    insights: {
      aiSummary:
        "Chris is the fastest-moving buyer I've ever worked with. He has budget, authority, and zero patience for long sales cycles. We had one meeting and he was already asking about pilot start dates. He's casual and easy to talk to but very sharp — he'll cut through any fluff immediately. I like this deal a lot because it matches how we like to sell: show value fast, close fast.",
      strengths: ["Clear authority", "Fast decision cycles"],
      risks: ["Many priorities competing for attention"],
      talkingPoints: [
        "Chris just finished migrating Figma's infra to a new orchestration layer — he presented results at their engineering all-hands",
        "Figma is scaling fast and his team is hiring aggressively for infrastructure roles",
        "He mentioned he's been evaluating ways to improve developer velocity as a top priority for H1",
      ],
      interests: ["Infrastructure", "Scale", "Developer velocity"],
      bestReachTime: "Mornings work best",
      insightsUpdatedAt: daysAgo(2),
      companyNews: [
        {
          id: "news-figma-1",
          headline:
            "Figma completes successful IPO, valued at $20B on first day of trading",
          date: daysAgo(6),
          sourceUrl: "https://figma.com/blog",
          category: "funding",
        },
        {
          id: "news-figma-2",
          headline:
            "Figma launches AI-powered design assistant and new developer handoff tools",
          date: daysAgo(15),
          category: "product",
        },
        {
          id: "news-figma-3",
          headline:
            "Figma engineering team scales to 500+ as company invests in infrastructure",
          date: daysAgo(25),
          category: "general",
        },
      ],
    },

    notes: {
      customSummary:
        "- Fastest decision-maker I've seen — wants pilot running within a week\n- Values speed over perfection, show quick wins not long roadmaps\n- Casual and direct, morning meetings work best for him",
      quickFacts: ["Early Figma employee", "Built their infra from scratch"],
      personalDetails: "Cyclist. Rides to work daily.",
      notesUpdatedAt: daysAgo(2),
    },

    interestingFacts: [
      {
        id: "fact-cli13-1",
        content:
          "Bikes to work every day — does a 15-mile ride across the Golden Gate Bridge each way",
        source: "Meeting - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "hobby",
      },
      {
        id: "fact-cli13-2",
        content:
          "Just got engaged over the holidays — planning a small wedding in Big Sur this summer",
        source: "Meeting - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "family",
      },
    ],

    recentTopics: ["Implementation Speed", "Quick Wins", "Value"],

    interactions: [
      {
        id: "int-cli13-1",
        type: "meeting",
        date: daysAgo(2),
        subject: "Value Discussion",
        summary: "Focused on quick wins. He wants a pilot starting next week.",
        sentiment: "positive",
        keyTopics: ["Pilot", "Quick Wins"],
      },
    ],

    lastContacted: daysAgo(2),
    nextFollowUp: daysAgo(-3),
    firstContact: weeksAgo(2),
    createdAt: weeksAgo(2),
    updatedAt: daysAgo(2),
  },

  {
    id: "cli-14",
    firstName: "Lauren",
    lastName: "Baker",
    avatarUrl: "/avatars/1677716095250.jpeg",
    company: "Notion",
    title: "Director of Engineering",
    department: "Platform",
    email: "lbaker@notion.so",
    phone: "+1 (415) 555-3114",
    linkedIn: "linkedin.com/in/laurenbaker",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "client",

    relationship: "champion",
    relationshipScore: 85,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["team", "Sentra", "Sequoia"],

    insights: {
      aiSummary:
        "Lauren is one of our most loyal champions. Her team uses our product daily and she's always the first to volunteer for reference calls when we need them. We've been working together for about a year now and the relationship is easy — she gives us honest feedback, we ship what she asks for, and she tells other companies about us. I make sure to loop her into every beta because she always has great product insights.",
      strengths: ["Vocal advocate", "Active user", "Great reference"],
      risks: ["Keep her engaged with new features"],
      talkingPoints: [
        "Lauren's platform team just launched a new internal API gateway at Notion — she's been heads-down on it for months",
        "She gave a product feedback session to our team last week and had a list of 12 feature requests ready",
        "Mentioned Notion is expanding their SF office and her team is growing from 15 to 25 engineers in Q1",
      ],
      interests: ["Productivity tools", "Team collaboration"],
      bestReachTime: "Very responsive on Slack",
      insightsUpdatedAt: daysAgo(4),
      companyNews: [
        {
          id: "news-notion-1",
          headline:
            "Notion launches new internal API gateway for enterprise customers",
          date: daysAgo(3),
          sourceUrl: "https://notion.so/blog",
          category: "product",
        },
        {
          id: "news-notion-2",
          headline:
            "Notion expands SF office and grows platform engineering team to 25 engineers",
          date: daysAgo(10),
          category: "general",
        },
        {
          id: "news-notion-3",
          headline:
            "Notion valued at $15B in latest funding round led by Sequoia Capital",
          date: daysAgo(20),
          category: "funding",
        },
      ],
    },

    notes: {
      customSummary:
        "- Our go-to reference customer — always willing to hop on calls with prospects\n- Her team is one of our most active daily users, great source of product feedback\n- Very responsive on Slack, loop her into every beta and new feature rollout",
      quickFacts: ["4 years at Notion", "Built their platform team"],
      personalDetails: "Yoga instructor on weekends. Plant mom.",
      notesUpdatedAt: daysAgo(4),
    },

    interestingFacts: [
      {
        id: "fact-cli14-1",
        content:
          "Teaches vinyasa yoga at a studio in the Mission on Saturday mornings — has a loyal group of regulars",
        source: "Slack - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "hobby",
      },
      {
        id: "fact-cli14-2",
        content:
          "Has over 40 houseplants and names all of them — her office looks like a greenhouse",
        source: "Meeting - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "hobby",
      },
    ],

    recentTopics: ["Product Feedback", "New Features", "Team Usage"],

    interactions: [
      {
        id: "int-cli14-1",
        type: "slack",
        date: daysAgo(4),
        subject: "Feature Feedback",
        summary:
          "Great feedback on new collaboration features. Already using them daily.",
        sentiment: "positive",
        keyTopics: ["Features", "Feedback"],
      },
    ],

    lastContacted: daysAgo(4),
    nextFollowUp: daysAgo(-10),
    firstContact: monthsAgo(12),
    createdAt: monthsAgo(12),
    updatedAt: daysAgo(4),
  },
];
