import type { Contact } from "@types/contact";
import { daysAgo, weeksAgo, monthsAgo } from "./contact-helpers";

/**
 * Other Contacts (12)
 * Advisors, partners, industry contacts
 */
export const otherContacts: Contact[] = [
  {
    id: "oth-1",
    firstName: "Alex",
    lastName: "Thompson",
    avatarUrl: "/avatars/1757181166572.jpeg",
    company: "Independent",
    title: "Executive Coach",
    department: "Advisory",
    email: "alex@alexthompson.co",
    phone: "+1 (310) 555-3201",
    linkedIn: "linkedin.com/in/alexthompson",
    timezone: "America/Los_Angeles",
    location: "Los Angeles, CA",
    category: "other",

    relationship: "champion",
    relationshipScore: 90,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["contractor", "Sentra"],

    insights: {
      aiSummary:
        "Alex has been my executive coach for almost a year now. I lean on him for the really hard stuff — leadership conflicts, board prep, team dynamics. He has this incredible ability to reframe problems that makes the answer obvious. Worth every dollar.",
      strengths: ["Trusted sounding board", "CEO coaching experience"],
      risks: ["Expensive - use wisely"],
      talkingPoints: [
        "Alex just launched a new coaching cohort focused on Series B founders",
        "He was featured on the First Round Review podcast last week talking about founder burnout",
        "Mentioned he's writing a book on founder psychology — wants early readers",
      ],
      interests: ["Leadership development", "Organizational psychology"],
      bestReachTime: "Weekly standing call",
      insightsUpdatedAt: daysAgo(7),
      companyNews: [
        {
          id: "news-alexcoach-1",
          headline:
            "Executive coach Alex Thompson launches new Series B founder coaching cohort",
          date: daysAgo(8),
          category: "product",
        },
        {
          id: "news-alexcoach-2",
          headline:
            "Featured on First Round Review podcast discussing founder burnout and resilience",
          date: daysAgo(18),
          sourceUrl: "https://review.firstround.com",
          category: "press",
        },
      ],
    },

    notes: {
      customSummary:
        "- My go-to for leadership conflicts and hard conversations\n- Weekly standing call on Thursdays at 9am PT\n- Expensive but worth every penny for the hard stuff",
      quickFacts: ["Coached 50+ CEOs", "Ex-McKinsey Partner"],
      personalDetails: "Meditation teacher. Lives on a boat.",
      notesUpdatedAt: daysAgo(7),
    },

    interestingFacts: [
      {
        id: "fact-oth1-1",
        content:
          "Recently got into pottery — been taking classes in Venice Beach since September",
        source: "Call - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "hobby",
      },
      {
        id: "fact-oth1-2",
        content:
          "His partner is a pastry chef and he always brings homemade croissants to our in-person sessions",
        source: "Meeting - Oct 2025",
        extractedAt: monthsAgo(4),
        category: "general",
      },
      {
        id: "fact-oth1-3",
        content:
          "Took his family to Costa Rica over the holidays — said the surf was life-changing",
        source: "Call - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "travel",
      },
    ],

    recentTopics: ["Leadership", "Board Prep", "Team Dynamics"],

    interactions: [
      {
        id: "int-oth1-1",
        type: "call",
        date: daysAgo(7),
        subject: "Weekly Coaching",
        summary: "Worked through board meeting approach. Great frameworks.",
        sentiment: "positive",
        keyTopics: ["Board Prep", "Leadership"],
      },
    ],

    lastContacted: daysAgo(7),
    nextFollowUp: daysAgo(0),
    firstContact: monthsAgo(10),
    createdAt: monthsAgo(10),
    updatedAt: daysAgo(7),
  },

  {
    id: "oth-2",
    firstName: "Dr. Maria",
    lastName: "Santos",
    avatarUrl: "/avatars/1578500070988.jpeg",
    company: "Stanford University",
    title: "Professor",
    department: "Computer Science",
    email: "msantos@stanford.edu",
    phone: "+1 (650) 555-3302",
    linkedIn: "linkedin.com/in/mariasantos",
    twitter: "@msantos_cs",
    timezone: "America/Los_Angeles",
    location: "Stanford, CA",
    category: "other",

    relationship: "influencer",
    relationshipScore: 75,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["friend", "Sentra", "A16Z"],

    insights: {
      aiSummary:
        "Maria is one of the sharpest AI minds I know. We connected through a YC event and she's become an informal technical advisor. Her stamp of approval on our ML approach was a huge confidence boost, and she's sent two of her PhD students our way for internships.",
      strengths: ["AI expertise", "Academic credibility", "PhD pipeline"],
      risks: ["Academic pace - slower than startup"],
      talkingPoints: [
        "She just published a paper on efficient transformer architectures that's getting a lot of attention on Twitter",
        "Keynoting at NeurIPS this year — her lab got three papers accepted",
        "Mentioned she's starting a new research initiative on AI safety with DARPA funding",
      ],
      interests: ["Machine learning", "Systems research", "Education"],
      bestReachTime: "Email preferred, academic schedule",
      insightsUpdatedAt: weeksAgo(2),
      companyNews: [
        {
          id: "news-stanford-1",
          headline:
            "Stanford CS lab publishes breakthrough paper on efficient transformer architectures",
          date: daysAgo(7),
          sourceUrl: "https://cs.stanford.edu/news",
          category: "press",
        },
        {
          id: "news-stanford-2",
          headline:
            "Stanford receives $100M DARPA grant for AI safety research initiative",
          date: daysAgo(16),
          category: "funding",
        },
        {
          id: "news-stanford-3",
          headline:
            "Stanford AI Lab accepts record three papers at NeurIPS 2026",
          date: daysAgo(24),
          category: "general",
        },
      ],
    },

    notes: {
      customSummary:
        "- Incredible technical validator — her feedback on our ML approach was a turning point\n- Great pipeline for PhD interns, ask about summer cohort in March\n- Prefers email and responds on academic schedule (slower but always thoughtful)",
      quickFacts: ["ACM Fellow", "Google AI advisory board", "100+ papers"],
      personalDetails: "Amateur astronomer. Has a telescope at home.",
      notesUpdatedAt: weeksAgo(2),
    },

    interestingFacts: [
      {
        id: "fact-oth2-1",
        content:
          "Amateur astronomer — built a custom telescope rig on her back patio and hosts stargazing nights for grad students",
        source: "Meeting - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "hobby",
      },
      {
        id: "fact-oth2-2",
        content:
          "Her daughter just started undergrad at MIT this fall — very proud, showed me photos at our last meeting",
        source: "Meeting - Sep 2025",
        extractedAt: monthsAgo(5),
        category: "family",
      },
    ],

    recentTopics: ["AI Research", "PhD Recruiting", "Technical Review"],

    interactions: [
      {
        id: "int-oth2-1",
        type: "meeting",
        date: weeksAgo(2),
        subject: "Technical Advisory",
        summary:
          "Reviewed our ML approach. Got valuable feedback and paper references.",
        sentiment: "positive",
        keyTopics: ["ML", "Research"],
      },
    ],

    lastContacted: weeksAgo(2),
    nextFollowUp: daysAgo(-14),
    firstContact: monthsAgo(6),
    createdAt: monthsAgo(6),
    updatedAt: weeksAgo(2),
  },

  {
    id: "oth-3",
    firstName: "James",
    lastName: "Wright",
    avatarUrl: "/avatars/1676239585072.jpeg",
    company: "TechCrunch",
    title: "Senior Editor",
    department: "Editorial",
    email: "james.wright@techcrunch.com",
    phone: "+1 (415) 555-3303",
    twitter: "@jameswright_tc",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "other",

    relationship: "contact",
    relationshipScore: 62,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["friend", "Glean"],

    insights: {
      aiSummary:
        "James covered our seed round and did a solid write-up on our Series A. He's fair, never sensationalizes, and actually takes the time to understand the product. I try to give him early looks on big news because he's earned it. Not super close personally but a reliable press relationship.",
      strengths: ["TC reach", "Fair journalist", "Enterprise beat"],
      risks: ["Busy - needs strong angle"],
      talkingPoints: [
        "He's been writing a deep-dive series on the developer tools consolidation wave",
        "Just got back from CES — said he's burned out on hardware and wants to focus more on enterprise software",
        "Mentioned he's thinking about launching a paid newsletter on the side",
      ],
      interests: ["Enterprise tech", "AI applications", "Startup stories"],
      bestReachTime: "Twitter DM or text",
      insightsUpdatedAt: weeksAgo(3),
      companyNews: [
        {
          id: "news-tc-1",
          headline:
            "TechCrunch launches new dedicated enterprise software vertical",
          date: daysAgo(5),
          sourceUrl: "https://techcrunch.com",
          category: "product",
        },
        {
          id: "news-tc-2",
          headline:
            "TechCrunch Disrupt 2026 announces AI-focused startup battlefield track",
          date: daysAgo(14),
          category: "general",
        },
      ],
    },

    notes: {
      customSummary:
        "- Give him 48-hour heads up on any big announcements — he appreciates exclusives\n- Prefers Twitter DM over email for quick stuff\n- Not looking for fluff pieces, needs a real angle or data",
      quickFacts: ["10 years at TC", "Former startup founder"],
      personalDetails: "Amateur DJ. Vinyl collector.",
      notesUpdatedAt: weeksAgo(3),
    },

    interestingFacts: [
      {
        id: "fact-oth3-1",
        content:
          "Serious vinyl collector — has over 2,000 records and DJs at small bars in the Mission on weekends",
        source: "Coffee - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "hobby",
      },
      {
        id: "fact-oth3-2",
        content:
          "Just adopted a rescue greyhound named Pixel — sends photos unprompted",
        source: "Twitter DM - Jan 2026",
        extractedAt: weeksAgo(3),
        category: "general",
      },
    ],

    recentTopics: ["Industry Coverage", "Announcements"],

    interactions: [
      {
        id: "int-oth3-1",
        type: "email",
        date: weeksAgo(3),
        subject: "Story Pitch",
        summary:
          "Pitched our Series B angle. He's interested when we're ready.",
        sentiment: "positive",
        keyTopics: ["Press", "Series B"],
      },
    ],

    lastContacted: weeksAgo(3),
    nextFollowUp: daysAgo(-21),
    firstContact: monthsAgo(8),
    createdAt: monthsAgo(8),
    updatedAt: weeksAgo(3),
  },

  {
    id: "oth-4",
    firstName: "Linda",
    lastName: "Chen",
    avatarUrl: "/avatars/1516155918505.jpeg",
    company: "AWS",
    title: "Partner Solutions Architect",
    department: "Startups",
    email: "lindachen@amazon.com",
    phone: "+1 (206) 555-3404",
    linkedIn: "linkedin.com/in/lindachen",
    timezone: "America/Los_Angeles",
    location: "Seattle, WA",
    category: "other",

    relationship: "contact",
    relationshipScore: 68,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["contractor", "Sequoia", "Sentra"],

    insights: {
      aiSummary:
        "Linda is our primary contact in the AWS Startups program. She's been really helpful navigating the credits process and is pushing internally to get us featured on the Marketplace. The relationship is mostly transactional but she genuinely roots for us — she came to our last demo day on her own time.",
      strengths: ["AWS credits access", "Co-marketing budget"],
      risks: ["AWS bureaucracy can be slow"],
      talkingPoints: [
        "She's been leading a new initiative to fast-track AI startups into the AWS Marketplace",
        "Just got promoted to senior solutions architect — more influence on partner decisions now",
        "Organizing an AWS Startups showcase in Seattle in March, wants us to present",
      ],
      interests: ["Partner success", "AWS services adoption"],
      bestReachTime: "Email, standard business hours",
      insightsUpdatedAt: weeksAgo(1),
      companyNews: [
        {
          id: "news-aws-1",
          headline:
            "AWS launches accelerated AI startup program with $100M in cloud credits",
          date: daysAgo(4),
          sourceUrl: "https://aws.amazon.com/startups",
          category: "product",
        },
        {
          id: "news-aws-2",
          headline:
            "AWS Marketplace adds new AI/ML category with streamlined listing process",
          date: daysAgo(12),
          category: "product",
        },
        {
          id: "news-aws-3",
          headline:
            "Amazon Web Services reports 37% year-over-year cloud revenue growth",
          date: daysAgo(22),
          category: "general",
        },
      ],
    },

    notes: {
      customSummary:
        "- Good ally inside AWS, send her quarterly usage updates to justify our credits renewal\n- Marketplace listing target is Q2 — need to follow up on technical requirements\n- She asked us to present at the Seattle showcase in March, should do it",
      quickFacts: ["8 years at AWS", "Former startup founder"],
      personalDetails: "Hiker. Completed the PCT.",
      notesUpdatedAt: weeksAgo(1),
    },

    interestingFacts: [
      {
        id: "fact-oth4-1",
        content:
          "Completed the entire Pacific Crest Trail last summer — took a 3-month sabbatical from AWS to do it",
        source: "Call - Oct 2025",
        extractedAt: monthsAgo(4),
        category: "travel",
      },
      {
        id: "fact-oth4-2",
        content:
          "Trains for ultramarathons on weekends — currently prepping for a 50-miler in Moab",
        source: "Email - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "hobby",
      },
    ],

    recentTopics: ["AWS Credits", "Marketplace", "Partnership"],

    interactions: [
      {
        id: "int-oth4-1",
        type: "email",
        date: weeksAgo(1),
        subject: "Marketplace Update",
        summary: "Discussing AWS Marketplace listing timeline. Q2 target.",
        sentiment: "positive",
        keyTopics: ["Marketplace", "Timeline"],
      },
    ],

    lastContacted: weeksAgo(1),
    nextFollowUp: daysAgo(-14),
    firstContact: monthsAgo(6),
    createdAt: monthsAgo(6),
    updatedAt: weeksAgo(1),
  },

  {
    id: "oth-5",
    firstName: "Mark",
    lastName: "Johnson",
    avatarUrl: "/avatars/1578757794439.jpeg",
    company: "Wilson Sonsini",
    title: "Partner",
    department: "Corporate",
    email: "mjohnson@wsgr.com",
    phone: "+1 (650) 555-0345",
    linkedIn: "linkedin.com/in/markjohnson",
    timezone: "America/Los_Angeles",
    location: "Palo Alto, CA",
    category: "other",

    relationship: "key_stakeholder",
    relationshipScore: 85,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["friend", "Sentra", "Glean"],

    insights: {
      aiSummary:
        "Mark has been our outside counsel since the seed round and he's basically part of the team at this point. He doesn't just give legal advice — he gives strategic advice. He's the one who flagged a problematic clause in our Series A docs that would have caused real issues later. I trust him completely on anything corporate.",
      strengths: [
        "Deep startup experience",
        "Fast turnaround",
        "Strategic advice",
      ],
      risks: ["Expensive - but worth it for complex matters"],
      talkingPoints: [
        "He's been advising a few other AI companies on the new EU AI Act compliance requirements",
        "Just wrapped a major M&A deal for another portfolio company — said it was the most complex of his career",
        "Mentioned WSGR is opening a new office in Austin and he might spend more time there",
      ],
      interests: ["Startup law", "Corporate governance"],
      bestReachTime: "Very responsive to email and text",
      insightsUpdatedAt: daysAgo(3),
      companyNews: [
        {
          id: "news-wsgr-1",
          headline:
            "Wilson Sonsini launches dedicated AI governance practice group",
          date: daysAgo(6),
          sourceUrl: "https://wsgr.com",
          category: "general",
        },
        {
          id: "news-wsgr-2",
          headline: "WSGR advises on $2.4B AI infrastructure acquisition deal",
          date: daysAgo(15),
          category: "general",
        },
      ],
    },

    notes: {
      customSummary:
        "- Been with us since day one — knows our cap table and corporate history cold\n- Always gives strategic context, not just legal opinion\n- For Series B, loop him in early on any term sheet drafts",
      quickFacts: ["20+ years at WSGR", "Worked with 200+ startups"],
      personalDetails: "Wine collector. Stanford Law grad.",
      notesUpdatedAt: daysAgo(3),
    },

    interestingFacts: [
      {
        id: "fact-oth5-1",
        content:
          "Serious wine collector — has a 500-bottle cellar at home and does Napa trips every few months with his wife",
        source: "Dinner - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "hobby",
      },
      {
        id: "fact-oth5-2",
        content:
          "His oldest son just got into Stanford Law — he's thrilled but pretending to be chill about it",
        source: "Call - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "family",
      },
    ],

    recentTopics: ["Series B Docs", "Corporate Governance"],

    interactions: [
      {
        id: "int-oth5-1",
        type: "call",
        date: daysAgo(3),
        subject: "Series B Docs Review",
        summary: "Reviewed term sheet terms. Good alignment on key points.",
        sentiment: "positive",
        keyTopics: ["Series B", "Legal"],
      },
    ],

    lastContacted: daysAgo(3),
    nextFollowUp: daysAgo(-5),
    firstContact: monthsAgo(18),
    createdAt: monthsAgo(18),
    updatedAt: daysAgo(3),
  },

  {
    id: "oth-6",
    firstName: "Susan",
    lastName: "Miller",
    avatarUrl: "/avatars/1739515018850.jpeg",
    company: "Greenhouse",
    title: "VP of Customer Success",
    department: "Customer Success",
    email: "smiller@greenhouse.io",
    phone: "+1 (212) 555-3506",
    linkedIn: "linkedin.com/in/susanmiller",
    timezone: "America/New_York",
    location: "New York, NY",
    category: "other",

    relationship: "influencer",
    relationshipScore: 65,
    communicationStyle: "async",

    roleBadges: [],
    tags: ["friend", "A16Z", "Sequoia"],

    insights: {
      aiSummary:
        "I met Susan through a SaaStr session last year and we hit it off. She built the entire CS org at Greenhouse from zero, so she's been an amazing resource as we think about our own CS motion. She's generous with her time but I try not to overdo it since she's got her own full plate.",
      strengths: ["CS expertise", "Enterprise experience"],
      risks: ["Busy with her own job"],
      talkingPoints: [
        "She just launched a new customer health scoring framework at Greenhouse — said it cut churn by 15%",
        "Been doing a LinkedIn content series on CS metrics that's getting really good engagement",
      ],
      interests: ["Customer success", "SaaS metrics", "Enterprise GTM"],
      bestReachTime: "Email or LinkedIn",
      insightsUpdatedAt: weeksAgo(2),
      companyNews: [
        {
          id: "news-greenhouse-1",
          headline:
            "Greenhouse introduces AI-powered candidate matching and scoring feature",
          date: daysAgo(8),
          sourceUrl: "https://greenhouse.io/blog",
          category: "product",
        },
        {
          id: "news-greenhouse-2",
          headline:
            "Greenhouse reports 25% increase in enterprise customer adoption",
          date: daysAgo(19),
          category: "general",
        },
      ],
    },

    notes: {
      customSummary:
        "- Incredible CS operator — her playbook doc she shared is a must-read for our CS team\n- Connect quarterly, she prefers async over calls\n- Ask her about health scoring framework next time, might adapt for our use case",
      quickFacts: ["Built Greenhouse CS from scratch", "10+ years in CS"],
      personalDetails: "Marathon runner. Book club organizer.",
      notesUpdatedAt: weeksAgo(2),
    },

    interestingFacts: [
      {
        id: "fact-oth6-1",
        content:
          "Training for the NYC Marathon in November — her third one, running for a children's literacy charity",
        source: "Call - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "hobby",
      },
      {
        id: "fact-oth6-2",
        content:
          "Runs a women-in-SaaS book club in NYC — they just finished 'Amp It Up' and she had strong opinions",
        source: "LinkedIn - Jan 2026",
        extractedAt: weeksAgo(3),
        category: "general",
      },
    ],

    recentTopics: ["CS Best Practices", "Enterprise GTM"],

    interactions: [
      {
        id: "int-oth6-1",
        type: "call",
        date: weeksAgo(2),
        subject: "CS Strategy Chat",
        summary: "Shared her enterprise CS playbook. Great insights.",
        sentiment: "positive",
        keyTopics: ["CS", "Strategy"],
      },
    ],

    lastContacted: weeksAgo(2),
    nextFollowUp: daysAgo(-30),
    firstContact: monthsAgo(4),
    createdAt: monthsAgo(4),
    updatedAt: weeksAgo(2),
  },

  {
    id: "oth-7",
    firstName: "Daniel",
    lastName: "Kim",
    avatarUrl: "/avatars/1579824551944.jpeg",
    company: "Honeycomb",
    title: "CEO",
    department: "Executive",
    email: "daniel@honeycomb.io",
    phone: "+1 (415) 555-3607",
    linkedIn: "linkedin.com/in/danielkim",
    twitter: "@danielkim",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "other",

    relationship: "influencer",
    relationshipScore: 70,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["friend", "Sentra", "Sequoia"],

    insights: {
      aiSummary:
        "Daniel and I connected at a YC alumni dinner and we've been swapping notes ever since. We're at similar stages and both in developer tools, so the conversations are really specific and useful. He's candid about his own mistakes which I appreciate. Not competitive today but our worlds could overlap eventually.",
      strengths: ["Similar stage company", "DevTools expertise"],
      risks: ["Could be competitive eventually"],
      talkingPoints: [
        "He just closed a big enterprise deal with a Fortune 100 bank — first time selling into financial services",
        "Been experimenting with a product-led growth motion alongside their sales-led approach",
        "He's speaking at Config in April about building developer communities",
      ],
      interests: ["Observability", "Developer experience", "Startup building"],
      bestReachTime: "Twitter DM or text",
      insightsUpdatedAt: weeksAgo(3),
      companyNews: [
        {
          id: "news-honeycomb-1",
          headline:
            "Honeycomb closes Fortune 100 banking deal, enters financial services market",
          date: daysAgo(10),
          category: "general",
        },
        {
          id: "news-honeycomb-2",
          headline:
            "Honeycomb launches new product-led growth tier alongside enterprise offering",
          date: daysAgo(20),
          sourceUrl: "https://honeycomb.io/blog",
          category: "product",
        },
      ],
    },

    notes: {
      customSummary:
        "- Best founder peer in my network — we share metrics openly\n- Monthly catch-up call, usually Fridays\n- Watch for competitive overlap long-term but right now it's all collaborative",
      quickFacts: ["3x founder", "YC alum", "Built Honeycomb to $50M ARR"],
      personalDetails: "Board game enthusiast. Has a game night.",
      notesUpdatedAt: weeksAgo(3),
    },

    interestingFacts: [
      {
        id: "fact-oth7-1",
        content:
          "Hosts a legendary board game night every other Saturday — invited me once, it was intense (he takes Settlers of Catan very seriously)",
        source: "Text - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "hobby",
      },
      {
        id: "fact-oth7-2",
        content:
          "His wife just had their second kid in December — a baby girl named Luna",
        source: "Call - Jan 2026",
        extractedAt: weeksAgo(3),
        category: "family",
      },
    ],

    recentTopics: ["Market Trends", "Fundraising"],

    interactions: [
      {
        id: "int-oth7-1",
        type: "call",
        date: weeksAgo(3),
        subject: "Founder Catch-up",
        summary: "Compared notes on Series B process. Helpful perspective.",
        sentiment: "positive",
        keyTopics: ["Fundraising", "Market"],
      },
    ],

    lastContacted: weeksAgo(3),
    nextFollowUp: daysAgo(-21),
    firstContact: monthsAgo(8),
    createdAt: monthsAgo(8),
    updatedAt: weeksAgo(3),
  },

  {
    id: "oth-8",
    firstName: "Nicole",
    lastName: "Brown",
    avatarUrl: "/avatars/1564124329948.jpeg",
    company: "Rippling",
    title: "VP of Sales",
    department: "Sales",
    email: "nbrown@rippling.com",
    phone: "+1 (415) 555-3708",
    linkedIn: "linkedin.com/in/nicolebrown",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "other",

    relationship: "contact",
    relationshipScore: 60,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["friend", "A16Z", "Glean"],

    insights: {
      aiSummary:
        "Nicole and I got introduced through a mutual VC connection. We've only had a couple of conversations but each one has been packed with value. She has incredibly clear thinking on enterprise sales structure. She's happy at Rippling so this isn't a recruiting play — more of a learn-from-the-best relationship.",
      strengths: ["Enterprise sales expertise", "Built teams at scale"],
      risks: ["Happy at Rippling currently"],
      talkingPoints: [
        "She's been rolling out a new vertical-specific sales motion at Rippling targeting healthcare",
        "Mentioned she's mentoring first-time sales leaders through a First Round program",
      ],
      interests: ["Enterprise sales", "Sales ops", "Team building"],
      bestReachTime: "Email or LinkedIn",
      insightsUpdatedAt: weeksAgo(4),
      companyNews: [
        {
          id: "news-rippling-1",
          headline:
            "Rippling expands into healthcare vertical with new industry-specific sales motion",
          date: daysAgo(7),
          sourceUrl: "https://rippling.com/blog",
          category: "product",
        },
        {
          id: "news-rippling-2",
          headline:
            "Rippling valued at $13.5B in latest secondary market transactions",
          date: daysAgo(18),
          category: "funding",
        },
      ],
    },

    notes: {
      customSummary:
        "- Don't know her super well yet but every conversation has been high-signal\n- Reach out when we're ready to build our first sales team — she's the expert\n- Keep it lightweight, she's busy and we're not close enough for frequent asks",
      quickFacts: ["Built $100M sales org", "Ex-Salesforce"],
      personalDetails: "Yoga enthusiast. Travels extensively.",
      notesUpdatedAt: weeksAgo(4),
    },

    interestingFacts: [
      {
        id: "fact-oth8-1",
        content:
          "Really into hot yoga — goes every morning at 6am before work, says it's her non-negotiable",
        source: "Coffee - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "hobby",
      },
      {
        id: "fact-oth8-2",
        content:
          "Spent three weeks in Japan over the holidays with her family — her kids are obsessed with the food",
        source: "LinkedIn - Jan 2026",
        extractedAt: weeksAgo(4),
        category: "travel",
      },
    ],

    recentTopics: ["Sales Best Practices"],

    interactions: [
      {
        id: "int-oth8-1",
        type: "linkedin",
        date: weeksAgo(4),
        subject: "Coffee Chat",
        summary: "Discussed enterprise sales approaches. Great advice.",
        sentiment: "positive",
        keyTopics: ["Sales"],
      },
    ],

    lastContacted: weeksAgo(4),
    nextFollowUp: daysAgo(-30),
    firstContact: monthsAgo(3),
    createdAt: monthsAgo(3),
    updatedAt: weeksAgo(4),
  },

  {
    id: "oth-9",
    firstName: "Andrew",
    lastName: "Lee",
    avatarUrl: "/avatars/1762560715750.jpeg",
    company: "Y Combinator",
    title: "Partner",
    department: "Investment",
    email: "alee@ycombinator.com",
    phone: "+1 (415) 555-3809",
    linkedIn: "linkedin.com/in/andrewlee",
    twitter: "@andrewlee_yc",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "other",

    relationship: "champion",
    relationshipScore: 82,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["team", "Sentra", "A16Z", "Glean"],

    insights: {
      aiSummary:
        "Andrew was our group partner during YC and he's continued to be one of my most trusted advisors. He's the person I call when I need a gut check on a big decision. He's seen hundreds of companies at our stage so his pattern-matching is unreal. He won't sugarcoat things, which is exactly what I need.",
      strengths: ["YC network", "Startup pattern matching"],
      risks: ["Limited bandwidth - many portfolio companies"],
      talkingPoints: [
        "He's been running a new YC program focused on AI-native companies — said the batch quality is the best he's seen",
        "Just published a long thread on X about common Series B mistakes that went viral",
        "He's organizing a YC alumni founders retreat in Tahoe this spring",
      ],
      interests: ["Startups", "Developer tools", "Founder success"],
      bestReachTime: "Text or Slack",
      insightsUpdatedAt: weeksAgo(1),
      companyNews: [
        {
          id: "news-yc-1",
          headline:
            "Y Combinator Winter 2026 batch features record number of AI-native startups",
          date: daysAgo(3),
          sourceUrl: "https://ycombinator.com/blog",
          category: "general",
        },
        {
          id: "news-yc-2",
          headline:
            "YC partner Andrew Lee publishes viral thread on common Series B mistakes",
          date: daysAgo(11),
          category: "press",
        },
        {
          id: "news-yc-3",
          headline:
            "Y Combinator announces alumni founders retreat in Lake Tahoe",
          date: daysAgo(21),
          category: "general",
        },
      ],
    },

    notes: {
      customSummary:
        "- My first call when I need a gut check on big decisions\n- Office hours every other week — always come with a specific question, he's busy\n- Ask him for intros strategically, his network is gold but don't overuse it",
      quickFacts: ["2x founder (1 exit)", "YC partner 5 years"],
      personalDetails: "Parent of twins. Avid reader.",
      notesUpdatedAt: weeksAgo(1),
    },

    interestingFacts: [
      {
        id: "fact-oth9-1",
        content:
          "His twins just turned 4 — he showed me a video of them trying to pitch a startup idea at dinner and it was hilarious",
        source: "Call - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "family",
      },
      {
        id: "fact-oth9-2",
        content:
          "Massive sci-fi reader — we bonded over the Three-Body Problem trilogy and he's been recommending Becky Chambers lately",
        source: "Office Hours - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "hobby",
      },
    ],

    recentTopics: ["YC Resources", "Fundraising Advice"],

    interactions: [
      {
        id: "int-oth9-1",
        type: "call",
        date: weeksAgo(1),
        subject: "Office Hours",
        summary: "Discussed Series B strategy. Good framing advice.",
        sentiment: "positive",
        keyTopics: ["Series B", "Strategy"],
      },
    ],

    lastContacted: weeksAgo(1),
    nextFollowUp: daysAgo(-14),
    firstContact: monthsAgo(16),
    createdAt: monthsAgo(16),
    updatedAt: weeksAgo(1),
  },

  {
    id: "oth-10",
    firstName: "Rebecca",
    lastName: "Torres",
    avatarUrl: "/avatars/1754693779599.jpeg",
    company: "Craft Ventures",
    title: "Talent Partner",
    department: "Talent",
    email: "rtorres@craftventures.com",
    phone: "+1 (415) 555-3910",
    linkedIn: "linkedin.com/in/rebeccatorres",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "other",

    relationship: "contact",
    relationshipScore: 65,
    communicationStyle: "async",

    roleBadges: [],
    tags: ["team", "Glean", "Sequoia"],

    insights: {
      aiSummary:
        "Rebecca works the talent side at Craft Ventures. We're not in their portfolio but she's been helpful anyway — I think she's building the relationship in case we become a portfolio company down the line. She sent us three solid VP Eng candidates and her comp benchmarking data has been really useful.",
      strengths: ["Executive search expertise", "Startup talent network"],
      risks: ["Primarily helps portfolio companies"],
      talkingPoints: [
        "She just placed a CFO at one of Craft's biggest portfolio companies — said the search took 6 months",
        "Been writing about the AI talent market on LinkedIn, says demand for ML engineers is cooling slightly",
      ],
      interests: ["Talent", "Startup hiring", "Leadership"],
      bestReachTime: "Email works best",
      insightsUpdatedAt: weeksAgo(2),
      companyNews: [
        {
          id: "news-craft-1",
          headline:
            "Craft Ventures places CFO at portfolio company after 6-month executive search",
          date: daysAgo(9),
          category: "general",
        },
        {
          id: "news-craft-2",
          headline:
            "Craft Ventures talent partner reports cooling demand for ML engineers in latest market analysis",
          date: daysAgo(16),
          sourceUrl: "https://craftventures.com/insights",
          category: "press",
        },
      ],
    },

    notes: {
      customSummary:
        "- Great resource for exec-level hiring — her candidate pipeline is strong\n- She's probably investing in the relationship hoping we'll join Craft's portfolio\n- Follow up on VP Eng candidates she sent, need to schedule interviews",
      quickFacts: ["10+ years in startup recruiting", "200+ exec placements"],
      personalDetails: "Foodie. Knows every restaurant in SF.",
      notesUpdatedAt: weeksAgo(2),
    },

    interestingFacts: [
      {
        id: "fact-oth10-1",
        content:
          "Total foodie — she keeps a spreadsheet of every restaurant she's been to in SF, has visited over 300",
        source: "Coffee - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "hobby",
      },
      {
        id: "fact-oth10-2",
        content:
          "Just moved to a new place in Noe Valley with her partner and their golden retriever, Bagel",
        source: "Email - Jan 2026",
        extractedAt: weeksAgo(3),
        category: "general",
      },
    ],

    recentTopics: ["Executive Hiring", "Talent Market"],

    interactions: [
      {
        id: "int-oth10-1",
        type: "email",
        date: weeksAgo(2),
        subject: "VP Engineering Search",
        summary: "Discussed VP Eng search. She'll send some candidates.",
        sentiment: "positive",
        keyTopics: ["Hiring", "Executive Search"],
      },
    ],

    lastContacted: weeksAgo(2),
    nextFollowUp: daysAgo(-7),
    firstContact: monthsAgo(2),
    createdAt: monthsAgo(2),
    updatedAt: weeksAgo(2),
  },

  {
    id: "oth-11",
    firstName: "Paul",
    lastName: "Garcia",
    avatarUrl: "/avatars/1768508257422.jpeg",
    company: "Cooley LLP",
    title: "Partner",
    department: "IP & Litigation",
    email: "pgarcia@cooley.com",
    phone: "+1 (650) 555-0456",
    linkedIn: "linkedin.com/in/paulgarcia",
    timezone: "America/Los_Angeles",
    location: "Palo Alto, CA",
    category: "other",

    relationship: "contact",
    relationshipScore: 55,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["investor", "Sequoia", "A16Z"],

    insights: {
      aiSummary:
        "Paul did our initial IP landscape review. We don't work with him regularly but he's the person I'd call if we ever had a patent issue. Very buttoned-up, classic big-law energy. Our interactions are pretty transactional but he's reliable and knows the AI patent space inside and out.",
      strengths: ["Deep IP expertise", "Patent litigation experience"],
      risks: ["Expensive - use for specific IP needs"],
      talkingPoints: [
        "He's been handling a wave of AI-related patent disputes — said it's the busiest he's been in years",
        "Mentioned Cooley is building out a dedicated AI IP practice group",
      ],
      interests: ["Technology patents", "IP strategy"],
      bestReachTime: "Email, business hours",
      insightsUpdatedAt: monthsAgo(1),
      companyNews: [
        {
          id: "news-cooley-1",
          headline:
            "Cooley establishes dedicated AI intellectual property practice group",
          date: daysAgo(12),
          sourceUrl: "https://cooley.com",
          category: "general",
        },
        {
          id: "news-cooley-2",
          headline:
            "Cooley handles surge in AI-related patent disputes amid industry boom",
          date: daysAgo(25),
          category: "general",
        },
      ],
    },

    notes: {
      customSummary:
        "- Keep him warm for when we need patent filings or if an IP dispute comes up\n- Not a close relationship, purely professional\n- Very responsive by email during business hours, don't text",
      quickFacts: ["20 years IP law", "Former USPTO examiner"],
      personalDetails: "Collector of vintage tech.",
      notesUpdatedAt: monthsAgo(1),
    },

    interestingFacts: [
      {
        id: "fact-oth11-1",
        content:
          "Collects vintage computers — has an original Apple I in his office and a working Commodore 64 at home",
        source: "Meeting - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "hobby",
      },
      {
        id: "fact-oth11-2",
        content:
          "Takes his family skiing in Tahoe almost every weekend in winter — his kids are competitive ski racers",
        source: "Meeting - Jan 2026",
        extractedAt: monthsAgo(1),
        category: "family",
      },
    ],

    recentTopics: ["IP Strategy"],

    interactions: [
      {
        id: "int-oth11-1",
        type: "meeting",
        date: monthsAgo(1),
        subject: "IP Review",
        summary: "Reviewed our IP position. Recommendations for patent filing.",
        sentiment: "positive",
        keyTopics: ["Patents", "IP"],
      },
    ],

    lastContacted: monthsAgo(1),
    nextFollowUp: daysAgo(-60),
    firstContact: monthsAgo(4),
    createdAt: monthsAgo(4),
    updatedAt: monthsAgo(1),
  },

  {
    id: "oth-12",
    firstName: "Stephanie",
    lastName: "Wong",
    avatarUrl: "/avatars/1754693779599.jpeg",
    company: "Emergence Capital",
    title: "Operating Partner",
    department: "Operations",
    email: "swong@emcap.com",
    phone: "+1 (415) 555-4012",
    linkedIn: "linkedin.com/in/stephaniewong",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "other",

    relationship: "influencer",
    relationshipScore: 70,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["investor", "A16Z", "Sentra", "Glean"],

    insights: {
      aiSummary:
        "Stephanie is an operating partner at Emergence and she's been incredibly generous with her time even though we're not in their portfolio. I think she's angling for us to raise from Emergence eventually, which is fine — the advice is genuinely good. Her enterprise GTM playbook is the best I've seen and she's given us very specific, actionable feedback on our sales process.",
      strengths: ["Enterprise GTM expertise", "B2B playbooks"],
      risks: ["Not in their portfolio - limited time"],
      talkingPoints: [
        "She's been running a B2B GTM roundtable series for Emergence portfolio founders — the decks she shares are incredible",
        "Just got back from a two-week trip to Tokyo where she was studying the Japanese enterprise sales model",
      ],
      interests: ["B2B SaaS", "Enterprise GTM", "Sales motions"],
      bestReachTime: "LinkedIn or email",
      insightsUpdatedAt: weeksAgo(3),
      companyNews: [
        {
          id: "news-emergence-1",
          headline:
            "Emergence Capital launches B2B GTM roundtable series for portfolio founders",
          date: daysAgo(6),
          category: "general",
        },
        {
          id: "news-emergence-2",
          headline:
            "Emergence Capital operating partner studies Japanese enterprise sales model on Tokyo research trip",
          date: daysAgo(17),
          category: "press",
        },
      ],
    },

    notes: {
      customSummary:
        "- Her enterprise GTM playbook deck is gold — saved it in our shared drive\n- Probably wants us to raise from Emergence, which is fine, the advice is legit\n- Check in quarterly, don't over-ask since we're not portfolio",
      quickFacts: ["Built GTM at 3 unicorns", "Ex-Salesforce"],
      personalDetails: "Triathlete. Completed Ironman twice.",
      notesUpdatedAt: weeksAgo(3),
    },

    interestingFacts: [
      {
        id: "fact-oth12-1",
        content:
          "Training for her third Ironman in Kona this fall — wakes up at 4:30am to train before work, absolutely wild",
        source: "Call - Oct 2025",
        extractedAt: monthsAgo(4),
        category: "hobby",
      },
      {
        id: "fact-oth12-2",
        content:
          "Her teenage daughter is a competitive fencer — she was showing me videos from a recent tournament, really proud mom energy",
        source: "Meeting - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "family",
      },
    ],

    recentTopics: ["Enterprise GTM", "Sales Motion"],

    interactions: [
      {
        id: "int-oth12-1",
        type: "call",
        date: weeksAgo(3),
        subject: "GTM Strategy",
        summary:
          "Reviewed our enterprise GTM. Great suggestions on sales process.",
        sentiment: "positive",
        keyTopics: ["GTM", "Sales"],
      },
    ],

    lastContacted: weeksAgo(3),
    nextFollowUp: daysAgo(-21),
    firstContact: monthsAgo(5),
    createdAt: monthsAgo(5),
    updatedAt: weeksAgo(3),
  },
];
